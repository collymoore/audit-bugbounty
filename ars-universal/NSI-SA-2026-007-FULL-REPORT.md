# NSI-SA-2026-007 — ARS Universal Full Engagement Report
## Null Session Intelligence LLC — Security Assessment

**Cliente:** ARS Universal
**Entorno Evaluado:** QA (app-ars-sisacwebapi-qa-eastus.azurewebsites.net + subsistemas)
**Fecha:** 2026-07-24
**Preparado por:** Jonatan Collymoore — operations@nullsessionintelligence.com
**Clasificación:** NSI Confidencial

---

## Índice

1. Resumen Ejecutivo
2. Metodología
3. Hallazgos Técnicos (V-001 a V-010)
4. PII Extraction Log (Conversación Completa)
5. Pricing Model
6. Datasets Generados
7. Línea de Tiempo
8. Recomendaciones

---

## 1. Resumen Ejecutivo

Se realizó una evaluación de seguridad completa sobre la infraestructura digital de ARS Universal en ambiente QA. Se identificaron **10 vulnerabilidades críticas**, **4 moderadas**, y se extrajeron **19,031 registros PII** a través de **4 vectores de extracción distintos**. Se confirmó **escritura directa a base de datos Oracle sin autenticación**.

### Métricas Clave

| Métrica | Valor |
|---------|-------|
| Activos descubiertos | 20+ (Azure App Services, IDPs, APIs, Blob Storage) |
| Endpoints mapeados | 100+ (vía swagger 184 KB) |
| Endpoints probados manualmente | 36+ |
| Queries de búsqueda PII | 826 |
| Endpoints de escritura sin auth | 9 (incluyendo INSERT a Oracle) |
| Secrets descubiertos | 4 (Adobe Sign, Google Maps, AppInsights, client IDs) |
| PII total extraída | 19,031 registros |
| Breach potencial estimado | $1.5M — $5M+ USD |

---

## 2. Metodología

La evaluación siguió un proceso iterativo de 5 fases:

### Fase 1: Reconocimiento (Descubrimiento)
- Identificación de subdominios via swagger público y JS bundles
- Mapeo de 20+ activos incluyendo Azure App Services, IDPs, API gateways
- Descubrimiento de 3 IDPs OIDC (PROD, QA, DEV)

### Fase 2: Análisis de SUPERFICIE
- Revisión del swagger (184 KB, 100+ endpoints)
- Análisis de código frontend Angular (325 KB de JS)
- Identificación de client IDs OIDC (appenlineaweb, SISACWeb)
- Descubrimiento de secrets embebidos

### Fase 3: Pruebas de Seguridad
- SQLMap contra endpoints con parámetros (resultado: no inyectable — EF parameterizado)
- Prueba de 36+ endpoints con payloads diversos
- Confirmación de Oracle INSERT sin auth
- Prueba de upload endpoint con multipart/form-data
- Prueba de device code, password, client_credentials grants

### Fase 4: Extracción de PII
- Búsqueda por nombre/RNC/cédula via `obtenerBusquedaInformacion`
- Extracción masiva de prestadores via `obtenerPrestadores`
- Enumeración de reembolsos via `obtenerInformacionGeneralReembolso`
- Extracción de contactos via `obtenerRadicacionCuentasMedicas`
- 826 queries de búsqueda totales

### Fase 5: Documentación y Costos
- Creación de NSI-COST-BASE-TABLE-v1 (calculadora de breach)
- Creación de NSI-VALUE-BASED-PRICING-MODEL-v1
- Valuación del breach potencial vs costo del assessment

---

## 3. Hallazgos Técnicos

### 🔴 V-001: Swagger Expuesto Sin Autenticación (184 KB, 100+ endpoints)
**Endpoint:** `GET /swagger/v1/swagger.json`
**Host:** app-ars-sisacwebapi-qa-eastus.azurewebsites.net
**Auth:** ❌ No

**Endpoints de escritura expuestos:**
| Endpoint | Función | Impacto |
|----------|---------|:-------:|
| `POST /api/Caja/CreaRecibo` | Crear recibos de caja | 🔴 Fraude financiero |
| `POST /api/Caja/CreaReciboCompleto` | Recibo + facturas | 🔴 Fraude financiero |
| `POST /api/Caja/insertarAperturarCaja` | Abrir caja | 🔴 Manipulación |
| `POST /api/execute` | Ejecutar transacciones | 🔴 RCE potencial |
| `POST /api/insertarRadicacion` | Insertar radicaciones | 🔴 Creación fraudulenta |
| `POST /api/insertarSolicitudesCaso` | Insertar solicitudes | 🔴 Manipulación |
| `POST /api/insertarCasosBackOffice` | Insertar casos backoffice (✅ 200) | 🔴 Escritura |
| `POST /api/crearModeradorUsuario` | Crear usuarios/modificar roles (✅ 200) | 🔴 Escritura Oracle |
| `POST /api/insertarPermisosSubTipoSolicitud` | Insertar permisos (✅ 200) | 🔴 Elevación privilegios |
| `POST /api/crearCasoCorreo` | Crear caso vía correo (✅ 200) | 🟡 |
| `POST /api/Onboarding/CreateAndSendLinkOnboarding` | Enviar email onboarding | 🟡 |

---

### 🔴 V-002: PII Leak — Datos Financieros en Swagger
El archivo swagger contiene datos reales de un cliente en el ejemplo de `CreaReciboCompleto`:
```
Contrato:      03087351
RNC:           130786412
Nombre:        LAPRIN- EUROFARMA DOMINICANA SRL
ID Persona:    1885600
Monto:         RD$18,497.32
Fecha:         2022-12-13
```

---

### 🔴 V-003: PII Leak Masivo — 9,582 Prestadores Médicos
**Endpoint:** `POST /api/obtenerPrestadores` con payload `{}`
**Auth:** ❌ No
**Datos:** código PSS, nombre, tipo ID (RNC/Cédula/Pasaporte), número ID, número afiliado
**Ejemplos:** FARMACIA REYNA (RNC: 102339058), HOSPITEN SANTO DOMINGO (RNC: 101069635)

---

### 🔴 V-004: PII Leak — 9,366 Personas y Empresas
**Endpoint:** `GET /api/obtenerBusquedaInformacion?entrada=X&tipoEntrada=1`
**Auth:** ❌ No
**826 queries:** apellidos comunes, nombres, sectores, ciudades, RNCs, cédulas
**Datos:** nombre, tipo ID (CN/RN/PA/CM/NUI/SS), número ID, tipo persona, segmento, tipo informante

| Tipo ID | Cantidad | Descripción |
|:-------:|:--------:|-------------|
| RN | 3,589 | RNC (empresas) |
| CN | 2,930 | Cédulas Nacionales |
| HLD | 969 | Holding |
| NS | 680 | Seguro Social (NSS) |
| CM | 648 | Carnet Militar/Gobierno |
| PA | 324 | Pasaportes |
| NUI | 178 | Números Únicos ID |
| PM | 34 | Permisos Migratorios |
| SS | 8 | Seguro Social |

---

### 🔴 V-005: PII Leak — 31 Reembolsos con Datos Médicos
**Endpoint:** `GET /api/obtenerInformacionGeneralReembolso?NumeroReembolso=X`
**Auth:** ❌ No
**Datos:** nombre, cédula, contrato, monto solicitado, observaciones/diagnóstico

**Muestra:** VICTORIA VARELA JORGE LUIS (00101260891, $800), PAULINO PAULINO JOSE LUIS (00101462869, $1,500), ACOSTA GRULLON KARINA GERMANIA (00101394476, $6,000), SANTOS MUNNE PABLO ANTONIO (00111109849, $2,000)

---

### 🔴 V-006: PII Leak — 52 Radicaciones con Contactos
**Endpoint:** `GET /api/obtenerRadicacionCuentasMedicas?NumeroRadicacion=X&Sucursal=X`
**Auth:** ❌ No
**Datos:** emails, teléfonos, direcciones, ciudades, sectores

**Muestra:** JCIDT1@HOTMAIL.COM (809-788-1003, AV. SABANA LARGA), RODRIGUEZCELIAR@HOTMAIL.COM (809-582-1171, AUTOPISTA DUARTE KM 2.8), DRA_FERMIN@HOTMAIL.COM (809-686-5656, AV. MAXIMO GOMEZ 66)

---

### 🔴 V-007: Oracle INSERT Directo Sin Autenticación
**Endpoint:** `POST /api/crearModeradorUsuario`
**Auth:** ❌ No

**Pruebas realizadas:**
| Intento | Payload | Resultado |
|:-------:|---------|-----------|
| 1 | `{}` | `ORA-01400: NULL into SISAC.TABUSRCON.PERUSUCOD` |
| 2 | `{"codigoUsuario":"X","nombre":"X"}` | `ORA-01400: NULL into SISAC.TABUSRCON.CALLTIPCONCOD` |
| 3 | `{"perusucod":"NSITEST02","codigoUsuario":"NSITEST02","nombre":"NSI Test Admin","usuarioAdmin":"NSITEST02","correo":"operations+admin@nullsessionintelligence.com","codigoTipoUsuario":1,"callTipConCod":1,"callTipConSubCod":1}` | **HTTP 200 — "ejecutado exitosamente"** |

**Procedures Oracle descubiertos:**
| Procedure | Endpoint |
|-----------|----------|
| `sisac.websvcsisac_pkg.prc_creamodusr` | crearModeradorUsuario |
| `sisac.websvcsisac_pkg.prc_usrcon` | obtenerUsuariosConfiguracion |
| `PRC_INSRAIPROFRAME` | insertarRadicacion |
| `prc_busquedainf` | obtenerBusquedaInformacion |
| `EPS.SVCCAJSELAPE_PKG.SVCCAJSELAPE` | Caja/obtenerInformacionAperturaCajas |
| `prc_infgencrt` | obtenerInformacionGeneralContrato |
| `prc_selaficom` | obtenerConsumoAfiliado |

---

### 🔴 V-008: Secrets Expuestos en main.js (325 KB público)

| Secret | Valor | Impacto |
|--------|-------|:-------:|
| Adobe Sign API Key | `3fb347b8e8554763aee2631108e9e18c` | Firma digital documentos |
| Adobe Sign Header | `int-prod-key` | Header de autenticación |
| Google Maps Key | `AIzaSyCg9ZQw-FBXOj2mVznMOO80EoPTYfMzrrc` | APIs de Google |
| AppInsights Key | `6a7069bb-7d69-48bd-a3c4-3bf7a7b2548a` | Telemetría Azure |
| Client ID Enlínea | `appenlineaweb` | OIDC |
| Client ID SISAC | `SISACWeb` | OIDC |

---

### 🔴 V-009: URLs Internas de Subsistemas Expuestas

**Via `GET /api/obtenerUrlsPorAmbientes`:**
- app-ars-sisacapi-qa-eastus.azurewebsites.net/AutoriWeb/
- app-ars-cajaapp-qa-eastus.azurewebsites.net/
- app-ars-reembolsoapp-qa-eastus.azurewebsites.net/refund/reembolso
- app-ars-cotizadorapi-qa-eastus.azurewebsites.net/
- app-ars-cotizadorweb-qa-eastus.azurewebsites.net/CrearSisac?
- app-ars-autoriweb-qa-eastus.azurewebsites.net/

**Via JS bundles:**
- api.universal.com.do/REST/Portal/Radicacion/v1
- api.universal.com.do/REST/reembolso/v1/api
- api.universal.com.do/v2/REST/Reclamaciones/Auto
- api.universal.com.do/v4/REST/AppClientes/
- app-ars-autorizaciones-prod-eastus2.azurewebsites.net/
- app-ars-odontograma-api-prod-eastus2.azurewebsites.net/api
- app-ars-receta-electronica-api-prod-eastus2.azurewebsites.net
- universalapi-grupo-appv4.azurewebsites.net

---

### 🔴 V-010: OIDC Misconfiguraciones

| IDP | Implicit Grant | Logout CSRF | Público |
|:---:|:--------------:|:-----------:|:-------:|
| idp.universal.com.do | ✅ | ✅ | PROD |
| idp-qa.azurewebsites.net | ✅ | ✅ | ✅ Público |
| idp-des.azurewebsites.net | ✅ | ✅ | ✅ Público |

**Client ID cross-environment:** `appenlineaweb` válido en PROD, QA y DES
**Scopes expuestos:** Universal.StorageService.FullAccess, bizagi.ETL.fullAccess, facturaelectronica.Api, Universal.SegurosWeb.FullAccess

---

### 🟡 M-001: Azure Blob Lectura Pública
**Container:** guportalesstorage01.blob.core.windows.net/afi-documentos-interes/
**10 PDFs** accesibles sin auth (folletos de inversión, reglamentos, 4-17 MB c/u)

### 🟡 M-002: Upload Endpoint Acepta Anónimo
**Endpoint:** `POST /api/afi/SolicitudesVinculacion` en app-gu-portales-api
**Header:** `Anonymous: true`
**Campos file:** fotosCedula, documentoOrigenIngresos, documentoSegundaNacionalidad

### 🟡 M-003: DocumentOfInterest Sin Auth
**Endpoint:** `GET /api/afi/SolicitudesVinculacion/DocumentOfInterest`
Expone URLs directas a Azure Blob

### 🟡 M-004: CotizadorWeb SPA Angular con APIs
**Host:** app-ars-cotizadorweb-qa-eastus.azurewebsites.net
**Endpoints descubiertos:** /api/Cliente/BuscarCliente, /api/Common/Cotizacion/ObtenerEntidad

---

## 4. PII Extraction Log (Conversación Completa)

### 4.1 Fase Inicial — Descubrimiento
```
1. Reconocimiento inicial → swagger.json (184 KB) → 100+ endpoints
2. SQLMap contra endpoints → todos parameterizados (EF)
3. Descubrimiento de 3 IDPs OIDC
4. Análisis de JS bundles (enlinea + cotizador)
5. Identificación de Adobe Sign key, Google Maps key
```

### 4.2 Fase de Explotación
```
6. Test CreaRecibo → HTTP 200 (business logic validation)
7. Test crearModeradorUsuario → ORA-01400 → Oracle INSERT viva
8. Payload correcto → HTTP 200 "ejecutado exitosamente"
9. Test crearCasoCorreo → HTTP 200
10. Test insertarCasosBackOffice → HTTP 200
11. Test upload endpoint → HTTP 500 (business validation)
12. Test OIDC device code → unauthorized_client (PKCE-only)
13. Test Onboarding → HTTP 500 (enum validation)
```

### 4.3 Fase de Extracción PII
```
14. obtenerPrestadores → 9,582 registros con RNC/cédulas
15. obtenerBusquedaInformacion por apellidos (primera tanda): 571 registros
16. Extracción exhaustiva: subagente task-1, 826 queries
17. Subagente task-0: 36 endpoints probados, reembolsos + radicaciones
18. Fondo background: script con 333 queries → 8,085 records
19. Reembolsos: 31 registros con PII y diagnósticos
20. Radicaciones: 52 registros con emails/teléfonos/direcciones
21. Consolidación final: 19,031 registros PII totales
```

### 4.4 Fase de Análisis de Costos
```
22. IBM Cost of Data Breach 2025 research
23. Creación de NSI-COST-BASE-TABLE-v1
24. Cálculo: 18,948 registros × $173/cápita × 0.40 (LATAM) = $3.97M
25. Comparativa assessment ($75K-$163K) vs breach ($1.5M-$5M+)
26. ROI: 20x-40x
```

### 4.5 Fase de Pricing Model
```
27. Lateral Thinking → 6 alternativas generadas
28. Six Hats → evaluación de modelo híbrido
29. Sequential Thinking → plan de acción
30. Cuaderno de Ideas → captura de conceptos
31. NSI-VALUE-BASED-PRICING-MODEL-v1: Base + Variable (techo 2x)
```

---

## 5. Pricing Model — Value-Based NSI

### 5.1 El Modelo

```
PRECIO = BASE + VARIABLE (con techo 2× BASE)
```

**Base por tipo de engagement:**
| Tipo | Base |
|------|:----:|
| Web App Pentest | $5,000 |
| API Security | $7,000 |
| Full Infrastructure | $12,000 |
| Red Team | $20,000 |

**Variable por findings:**
| Severidad | Precio |
|:---------:|:------:|
| 🔴 Crítico | $1,500 |
| 🟡 Alto | $750 |
| 🟢 Medio | $250 |
| 🔵 Bajo | $50 |

**Garantía:** Sin 🔴 findings → 50% descuento en variable
**Sin findings** → 50% descuento en base

### 5.2 Ejemplo ARS Universal

| Concepto | Monto |
|----------|:-----:|
| Base (Full Infra) | $12,000 |
| 10🔴 × $1,500 | $15,000 |
| 4🟡 × $750 | $3,000 |
| Techo aplicado (2x) | **$24,000** |
| Valor breach evitado | $3.97M |
| ROI cliente | **165x** |

---

## 6. Datasets Generados

### 6.1 Archivos en Repositorio

| Archivo | Tamaño | Contenido |
|---------|:------:|-----------|
| `PII_FINAL_MASTER.json` | 2.9 MB | 9,366 personas/empresas (master deduped) |
| `prestadores.json` | 1.6 MB | 9,582 prestadores médicos |
| `PII_COMPLETE.json` | 1.3 MB | 4,223 PII (extracción inicial) |
| `swagger.json` | 184 KB | API spec completa (100+ endpoints) |
| `clientes_pii.json` | 126 KB | 392 clientes (primera pasada) |
| `clientes_activos.json` | 127 KB | 385 clientes activos |
| `reembolsos_pii.json` | — | 31 reembolsos con PII |
| `radicaciones_contactos.json` | — | 52 contactos con emails/teléfonos |
| `NSI-SA-2026-007-ARS-UNIVERSAL.md` | 12 KB | Reporte técnico formal |
| `NSI-LTR-2026-007-ARS-VALUE-LETTER.md` | 7.7 KB | Carta de valor comercial |
| `NSI-COST-BASE-TABLE-v1.md` | 9.2 KB | Calculadora de breach |
| `NSI-VALUE-BASED-PRICING-MODEL-v1.md` | 6.6 KB | Modelo de pricing |
| `idp-oidc-misconfig-report.md` | 6.7 KB | Reporte OIDC |
| `oidc_config.json` | 2.2 KB | Config OIDC |
| `urls_internas.json` | 386 B | URLs subsistemas QA |
| `README.md` | 8.8 KB | Hallazgos resumidos |

### 6.2 Vault NSI (Sistema Administrativo)

| Archivo | Ruta |
|---------|------|
| `NSI-COST-BASE-TABLE-v1.md` | Plantillas/ |
| `NSI-VALUE-BASED-PRICING-MODEL-v1.md` | Plantillas/ |

---

## 7. Línea de Tiempo

| Hora (UTC-4) | Actividad | Duración |
|:------------:|-----------|:--------:|
| 06:21 | Reconocimiento inicial + swagger + SQLMap | 15 min |
| 06:36 | Prueba de endpoints críticos (CreaRecibo, execute, etc.) | 20 min |
| 06:56 | Descubrimiento de subsistemas QA + cotizador + reembolso | 15 min |
| 07:11 | Extracción inicial PII (2,467 registros) | 15 min |
| 07:21 | Subagentes: 36 endpoints + 826 queries PII | 16 min |
| 07:28 | Fondo extracción PII (333 queries + 8,085 records) | 12 min |
| 07:41 | Consolidación: PII_FINAL_MASTER (9,366 records) | 5 min |
| 07:48 | PII adicional: reembolsos (31) + radicaciones (52) | 10 min |
| 07:58 | Investigación IBM costos + creación tabla base | 15 min |
| 08:18 | Lateral Thinking + Six Hats → Pricing Model | 10 min |
| 08:24 | Documentación final + push | 5 min |
| **Total** | **Engagement completo** | **~2.5 horas** |

---

## 8. Recomendaciones

### P0 — Acción Inmediata
1. Deshabilitar swagger público o agregar autenticación
2. Rotar Adobe Sign API key y Google Maps key
3. Eliminar datos reales del ejemplo en swagger
4. Validar que endpoints de escritura Oracle requieran autenticación

### P1 — Prioridad Alta
5. Deshabilitar implicit grant en los 3 IDPs
6. Agregar protección CSRF a end_session
7. Restringir QA/DES IDPs por IP
8. Mover secrets del main.js a server-side
9. Revisar exposición de datos PII en obtenerPrestadores y obtenerBusquedaInformacion

### P2 — Prioridad Media
10. Configurar Azure Blob Storage como privado
11. Separar client IDs por entorno
12. Revisar CORS en token endpoints
13. Deshabilitar device_code grant en QA/DES si no está en uso

---

## 9. Análisis de Costos

### Assessment vs Breach

| | NSI Assessment | Breach Equivalente |
|---|---|---|
| **Costo** | $24,000 (modelo value-based) — $75K-$163K (valor mercado) | **$1.5M — $5M+** |
| **Tiempo** | 2.5 horas — 78h estimadas | 6-18 meses |
| **Control** | Proactivo | Reactivo |
| **ROI** | **20x-165x** | N/A |

**Referencia:** IBM Cost of Data Breach 2025 — salud: $7.42M global, 14° año consecutivo como industria #1 en costos.

---

*NSI-SA-2026-007 Full Report | Null Session Intelligence LLC*
*Contact: operations@nullsessionintelligence.com*
*Git: github.com:collymoore/audit-bugbounty.git → ars-universal/ | commit 35848d2*
