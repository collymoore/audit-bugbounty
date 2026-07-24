# NSI-SA-2026-007
**Título:** Evaluación de Seguridad — ARS Universal (SISAC QA + Subsistemas)
**Fecha:** 2026-07-24
**Preparado por:** Jonatan Collymoore — Null Session Intelligence LLC
**Contacto:** operations@nullsessionintelligence.com
**Clasificación:** NSI Confidencial

---

## 1. Resumen Ejecutivo

Se realizó una evaluación de seguridad sobre la infraestructura digital de **ARS Universal**, específicamente sobre el ambiente QA de SISAC (`app-ars-sisacwebapi-qa-eastus.azurewebsites.net`) y subsistemas asociados. Se identificaron **9 hallazgos críticos** y **5 moderados**, incluyendo exposición masiva de datos personales de 9,582 prestadores médicos, acceso sin autenticación a 100+ endpoints de escritura directa a base de datos Oracle, y secretos embebidos en código cliente.

---

## 2. Hallazgos

### 🔴 V-001: Swagger Expuesto Sin Autenticación

| Campo | Valor |
|-------|-------|
| **Endpoint** | `/swagger/v1/swagger.json` |
| **Host** | `app-ars-sisacwebapi-qa-eastus.azurewebsites.net` |
| **Tamaño** | 184 KB |
| **Endpoints expuestos** | 100+ |
| **Auth requerida** | ❌ No |
| **Riesgo** | 🔴 Crítico |

**Endpoints de escritura expuestos:**

| Endpoint | Función | Impacto |
|----------|---------|---------|
| `POST /api/Caja/CreaRecibo` | Crear recibos de caja | Fraude financiero |
| `POST /api/Caja/CreaReciboCompleto` | Recibo + facturas | Fraude financiero |
| `POST /api/Caja/insertarAperturarCaja` | Abrir caja | Manipulación |
| `POST /api/execute` | Ejecutar transacciones | RCE potencial |
| `POST /api/insertarRadicacion` | Insertar radicaciones | Creación fraudulenta |
| `POST /api/insertarSolicitudesCaso` | Insertar solicitudes | Manipulación |
| `POST /api/insertarCasosBackOffice` | Insertar casos backoffice | Manipulación |
| `POST /api/crearModeradorUsuario` | Crear usuarios/modificar roles | **Escritura Oracle** |
| `POST /api/insertarPermisosSubTipoSolicitud` | Insertar permisos | Elevación privilegios |

---

### 🔴 V-002: PII Leak — Datos Financieros en Swagger

El archivo swagger contiene datos reales de un cliente de ARS Universal:

```
Contrato:      03087351
Documento:     0302872956
RNC:           130786412
Nombre:        LAPRIN- EUROFARMA DOMINICANA SRL
ID Persona:    1885600
Monto:         RD$18,497.32
Fecha:         2022-12-13
```

**Riesgo:** 🔴 Crítico — Exposición de datos financieros corporativos en documentación pública.

---

### 🔴 V-003: PII Leak Masivo — 9,582 Prestadores Médicos

| Campo | Valor |
|-------|-------|
| **Endpoint** | `POST /api/obtenerPrestadores` |
| **Payload** | `{}` (vacío) |
| **Auth** | ❌ No |
| **Total registros** | **9,582** |
| **Personas jurídicas** | 1,884 |
| **Personas físicas** | 7,698 |
| **Tamaño dataset** | 1.6 MB |

**Datos expuestos por registro:** código PSS, nombre, tipo identificación (RNC/Cédula/Pasaporte), número de identificación, número de afiliado.

**Ejemplos:**
| Código PSS | Nombre | Tipo ID | Número ID | Afiliado |
|:----------:|--------|:-------:|:---------:|:--------:|
| 02911 | FARMACIA REYNA | RN | 102339058 | 253 |
| 00190 | HOSPITEN SANTO DOMINGO | RN | 101069635 | 933 |
| 03810 | HOSPITEN BAVARO | RN | 101835621 | 789 |
| 03518 | ZULEMA ALBERTO PEÑA | CN | 00107732554 | 920 |

---

### 🔴 V-004: Oracle INSERT Directo Sin Autenticación

**Endpoint:** `POST /api/crearModeradorUsuario`

| Prueba | Payload | Resultado |
|--------|---------|-----------|
| 1. Payload vacío | `{}` | `ORA-01400: NULL into SISAC.TABUSRCON.PERUSUCOD` |
| 2. Schema InModUser | `{"codigoUsuario":"X","nombre":"X"}` | `ORA-01400: NULL into SISAC.TABUSRCON.CALLTIPCONCOD` |
| 3. Campos correctos | `{"perusucod":"X","codigoUsuario":"X","nombre":"X",...}` | **HTTP 200 — ✅ Escritura exitosa** |

**Procedimiento Oracle confirmado:** `sisac.websvcsisac_pkg.prc_creamodusr`
**Tabla:** `SISAC.TABUSRCON`

**Evidencia de escritura exitosa:**
```
HTTP 200
{"mensaje":"El servicio fue ejecutado exitosamente."}
```

**Procedures Oracle adicionales descubiertos via swagger:**
| Procedure | Endpoint |
|-----------|----------|
| `PRC_INSRAIPROFRAME` | `insertarRadicacion` |
| `prc_usrcon` | `obtenerUsuariosConfiguracion` |
| `prc_creamodusr` | `crearModeradorUsuario` |
| `EPS.SVCCAJSELAPE_PKG.SVCCAJSELAPE` | `Caja/obtenerInformacionAperturaCajas` |
| `WebSvcSisacTransacciones_pkg.prc_parametricas` | `obtenerListaSisac` |
| `prc_infgencrt` | `obtenerInformacionGeneralContrato` |

---

### 🔴 V-005: Secrets Expuestos en Código Cliente

| Secret | Valor | Tipo |
|--------|-------|------|
| Adobe Sign API Key | `3fb347b8e8554763aee2631108e9e18c` | API Key |
| Adobe Sign Header Name | `int-prod-key` | Header |
| Google Maps API Key | `AIzaSyCg9ZQw-FBXOj2mVznMOO80EoPTYfMzrrc` | API Key |
| AppInsights Key | `6a7069bb-7d69-48bd-a3c4-3bf7a7b2548a` | Azure Key |
| Client ID SISAC | `SISACWeb` | OIDC Client |
| Client ID Enlínea | `appenlineaweb` | OIDC Client |

**Endpoint Adobe Sign:** `https://api.universal.com.do/integracion`

---

### 🔴 V-006: URLs Internas de Subsistemas Expuestas

**Endpoint:** `GET /api/obtenerUrlsPorAmbientes`

```json
[
  "https://app-ars-sisacapi-qa-eastus.azurewebsites.net/AutoriWeb/",
  "https://app-ars-cajaapp-qa-eastus.azurewebsites.net/",
  "https://app-ars-reembolsoapp-qa-eastus.azurewebsites.net/refund/reembolso",
  "https://app-ars-cotizadorapi-qa-eastus.azurewebsites.net/",
  "https://app-ars-cotizadorweb-qa-eastus.azurewebsites.net/CrearSisac?",
  "https://app-ars-autoriweb-qa-eastus.azurewebsites.net/"
]
```

**Subsistemas adicionales descubiertos en JS:**

| URL | Tipo |
|-----|------|
| `https://api.universal.com.do/REST/Portal/Radicacion/v1` | Radicación |
| `https://api.universal.com.do/REST/reembolso/v1/api` | Reembolso |
| `https://api.universal.com.do/v2/REST/Reclamaciones/Auto` | Reclamaciones |
| `https://api.universal.com.do/v4/REST/AppClientes/` | App Clientes |
| `https://app-ars-autorizaciones-prod-eastus2.azurewebsites.net/` | Autorizaciones Prod |
| `https://app-ars-odontograma-api-prod-eastus2.azurewebsites.net/api` | Odontograma |
| `https://app-ars-receta-electronica-api-prod-eastus2.azurewebsites.net` | Receta Electrónica |
| `https://universalapi-grupo-appv4.azurewebsites.net` | API App Clientes v4 |

---

### 🔴 V-007: Implicit Grant Habilitado en IDP

| IDP | Implicit Grant |
|-----|:--------------:|
| `idp.universal.com.do` (PROD) | ✅ Habilitado |
| `idp-qa.azurewebsites.net` (QA) | ✅ Habilitado |
| `idp-des.azurewebsites.net` (DES) | ✅ Habilitado |

**Impacto:** El flujo implicit está deprecado por OAuth 2.1. Permite fuga de tokens vía historial del navegador y referrer headers.

---

### 🔴 V-008: Logout CSRF en IDP

**Prueba:** `GET /connect/endsession` sin `id_token_hint`
**Resultado:** `HTTP 302 → /Account/Logout`

**Ataque:** `<img src="https://idp.universal.com.do/connect/endsession">` en página maliciosa fuerza logout de cualquier usuario autenticado.

---

### 🔴 V-009: QA/DES IDPs Públicamente Accesibles

Los entornos QA y DES del Identity Provider son accesibles desde internet público sin restricción de IP. El mismo client ID `appenlineaweb` es válido en los tres entornos, permitiendo potencial confusión de entorno.

---

### 🟡 M-001: Azure Blob Lectura Pública

**Container:** `guportalesstorage01.blob.core.windows.net/afi-documentos-interes/`

**10 PDFs accesibles sin autenticación:**
- Folletos informativos de inversión (Dólar, Financiero Flexible, Liquidez, Renta Futuro)
- Reglamentos internos (Plazo Mensual Dólar, etc.)

**Tamaños:** 4 MB – 17.6 MB
**Sin capacidad de escritura** (PUT → 404)

---

### 🟡 M-002: Endpoint Upload Acepta Anónimo

**Endpoint:** `POST /api/afi/SolicitudesVinculacion`
**Host:** `app-gu-portales-api.azurewebsites.net`
**Header:** `Anonymous: true`
**Content-Type:** `multipart/form-data`

**Campos file aceptados:** `fotosCedula`, `documentoOrigenIngresos`, `documentoSegundaNacionalidad`
**Resultado:** HTTP 500 — el endpoint acepta el upload pero la validación de negocio falla por datos incompletos.

---

### 🟡 M-003: DocumentOfInterest Sin Auth

**Endpoint:** `GET /api/afi/SolicitudesVinculacion/DocumentOfInterest`
**Host:** `app-gu-portales-api.azurewebsites.net`
**Auth:** ❌ No

Expone catálogo completo de documentos de inversión con URLs directas a Azure Blob Storage.

---

### 🟡 M-004: Nuevo Client ID Descubierto

| Client ID | Entorno | Fuente |
|-----------|:-------:|--------|
| `appenlineaweb` | PROD, QA, DES | main.js |
| `SISACWeb` | QA | Bundle SISAC |

---

## 3. OIDC Scope Inventory

### PROD (14 scopes)
`universal.cajacore.fullAccess`, `universal.cotizador.ars.fullAccess`, `Universal.ConsultaPersona.FullAccess`, `integraciones.fullAccess`, `universal.fiduciaria.fullAccess`, `remesasservice.fullAccess`, `universal.autoriweb.mvc.fullAccess`, `corporativo.comprasTracking.fullAccess`, `Universal.ARS.FlujoDeTareas.FullAccess`, `unit.connectx.emitirPoliza`, `backendtest.fullAccess`

### QA (20 scopes — extras respecto a PROD)
`Universal.StorageService.FullAccess` 🎯, `Universal.App.API.fullAccess`, `bizagi.ETL.fullAccess`, `facturaelectronica.Api`, `Universal.SegurosWeb.FullAccess`, `Universal.APIReclamacionesAuto.FullAccess`, `salud.ivr.fullAccess`, `renovaciones.fullAccess`, `universal.configuraciones.fullaccess`

### DES (19 scopes — únicos)
`universal.activosfijos`, `facturaelectronicaapi`, `universal.facturaelectronica.fullaccess`, `ARS.Planes.FullAccess`, `Universal.AFI.Segmentacion.fullaccess`, `Universal.Experiencia.FullAccess`, `Universal.Cotizador.intermediario`

---

## 4. Document Upload Vector

**Endpoint descubierto:**
```
POST /api/afi/SolicitudesVinculacion
Host: app-gu-portales-api.azurewebsites.net
Header: Anonymous: true
FormData: fotosCedula (file), documentoOrigenIngresos (file), documentoSegundaNacionalidad (file)
```

**Flujo de la aplicación (Angular):**
1. `creaSolicitudDeVinculacion()` — Upload documentos + datos via FormData
2. `requestLongbinding()` — Enviar datos completos de vinculación
3. `validarOtp()` — Validar código OTP
4. `resendConfirmationCode()` — Reenviar código

---

## 5. Data Captured

| Archivo | Tamaño | Contenido |
|---------|:------:|-----------|
| `README.md` | 8.8 KB | Este reporte |
| `swagger.json` | 184 KB | Documentación completa de la API SISAC |
| `prestadores.json` | **1.6 MB** | 9,582 prestadores médicos con PII |
| `urls_internas.json` | 386 B | URLs de subsistemas QA |
| `oidc_config.json` | 2.2 KB | Configuración OIDC QA |
| `idp-oidc-misconfig-report.md` | 6.7 KB | Reporte detallado OIDC |

---

## 6. Recommendations

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
9. Revisar exposición de datos PII en obtenerPrestadores

### P2 — Prioridad Media
10. Configurar Azure Blob Storage como privado
11. Separar client IDs por entorno
12. Revisar CORS en token endpoints
13. Deshabilitar device_code grant en QA/DES si no está en uso

---

## 7. Timeline

| Fase | Fecha | Descripción |
|:----:|:-----:|-------------|
| Recon | 2026-07-24 | Descubrimiento de infraestructura, swagger, endpoints |
| Explotación | 2026-07-24 | Prueba de endpoints críticos, Oracle INSERT, upload |
| Documentación | 2026-07-24 | Consolidación de hallazgos |

---

*NSI-SA-2026-007 | Null Session Intelligence LLC*
*Contact: operations@nullsessionintelligence.com*
