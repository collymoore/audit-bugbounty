# ARS Universal — Security Assessment Findings
**Target:** ARS Universal (app-ars-sisacwebapi-qa-eastus.azurewebsites.net + subsistemas)
**Date:** 2026-07-24
**Classification:** NSI-SA (Confidential)

---

## 1️⃣ INFRASTRUCTURE MAP

| Component | URL | Status |
|-----------|-----|--------|
| **SISAC API (QA)** | `app-ars-sisacwebapi-qa-eastus.azurewebsites.net` | 🔴 Swagger full + 100+ endpoints sin auth |
| **Frontend Enlínea** | `enlinea.universal.com.do` | Angular SPA (PKCE auth) |
| **IDP Prod** | `idp.universal.com.do` | OIDC provider |
| **IDP QA** | `idp-qa.azurewebsites.net` | OIDC + device_code |
| **IDP Dev** | `idp-des.azurewebsites.net` | OIDC + device_code |
| **Portales API** | `app-gu-portales-api.azurewebsites.net` | Mix auth/anónimo |
| **App Clientes v4** | `universalapi-grupo-appv4.azurewebsites.net` | Auth required (swagger público) |
| **Azure Blob** | `guportalesstorage01.blob.core.windows.net` | 🔴 Lectura pública 10 PDFs |
| **Caja App** | `app-ars-cajaapp-qa-eastus.azurewebsites.net` | 🟡 403 (existe) |
| **Cotizador Web** | `app-ars-cotizadorweb-qa-eastus.azurewebsites.net` | ✅ Swagger disponible |
| **Reembolso App** | `app-ars-reembolsoapp-qa-eastus.azurewebsites.net` | ✅ 200 |
| **Receta Electrónica** | `app-ars-receta-electronica-api-prod-eastus2.azurewebsites.net` | ✅ Swagger |
| **Gateway** | `api.universal.com.do` | API Gateway (404 root, endpoints internos) |

---

## 2️⃣ CRITICAL VULNERABILITIES — 🔴

### V-001: Swagger Expuesto Sin Autenticación
**Endpoint:** `app-ars-sisacwebapi-qa-eastus/swagger/v1/swagger.json`
**Tamaño:** 184 KB, 100+ endpoints
**Auth:** ❌ Ninguna
**Endpoints críticos sin auth:**

| Endpoint | Función | Impacto Potencial |
|----------|---------|:-----------------:|
| `POST /api/Caja/CreaRecibo` | Crear recibos de caja con montos | 🔴 Fraude financiero |
| `POST /api/Caja/CreaReciboCompleto` | Recibo + facturas | 🔴 Fraude financiero |
| `POST /api/Caja/insertarAperturarCaja` | Abrir caja | 🔴 Manipulación caja |
| `POST /api/execute` | Ejecutar transacciones genéricas | 🔴 RCE/ejecución procedures |
| `POST /api/insertarRadicacion` | Insertar radicaciones (PRC_INSRAIPROFRAME) | 🔴 Creación fraudulenta |
| `POST /api/insertarSolicitudesCaso` | Insertar solicitudes | 🔴 
| `POST /api/insertarCasosBackOffice` | Insertar casos backoffice | 🔴 ✅ 200 |
| `POST /api/crearModeradorUsuario` | Crear usuarios moderadores | 🔴 ✅ 200 |
| `POST /api/insertarPermisosSubTipoSolicitud` | Insertar permisos | 🔴 ✅ 200 |

### V-002: PII Leak — Datos Financieros en Swagger
El swagger contiene datos REALES de un cliente en el ejemplo de `CreaReciboCompleto`:
- **Contrato:** 03087351 | **RNC:** 130786412
- **Nombre:** LAPRIN- EUROFARMA DOMINICANA SRL
- **ID Persona:** 1885600 | **Monto:** RD$18,497.32
- **Fecha:** 2022-12-13

### V-003: PII Leak Masivo — 9,582 Prestadores Médicos
**Endpoint:** `POST /api/obtenerPrestadores` (payload `{}`)
**Archivo guardado:** 1.6 MB (`prestadores.json`)

| Categoría | Cantidad |
|-----------|:--------:|
| Personas jurídicas (RNC) | 1,884 |
| Personas físicas (Cédula) | 7,698 |
| **Total registros** | **9,582** |

Datos expuestos por registro: código PSS, nombre proveedor, tipo ID, número ID (RNC/Cédula/Pasaporte), número afiliado.

### V-004: Oracle INSERT Directo Sin Auth
**Endpoint:** `POST /api/crearModeradorUsuario`
**Error:** `ORA-01400: cannot insert NULL into ("SISAC"."TABUSRCON"."PERUSUCOD")`
**Evidencia:** 
- Conexión Oracle viva desde API pública
- Capacidad de escritura directa a `SISAC.TABUSRCON`
- 4 endpoints confirmados que ejecutan INSERTs exitosos (HTTP 200)

### V-005: Secrets Expuestos en main.js (325 KB público)
| Secret | Valor | Riesgo |
|--------|-------|:------:|
| Adobe Sign API Key | `3fb347b8e8554763aee2631108e9e18c` | 🔴 Procesar documentos legalmente vinculantes |
| Adobe Sign Header | `int-prod-key` | 🔴 |
| Google Maps Key | `AIzaSyCg9ZQw-FBXOj2mVznMOO80EoPTYfMzrrc` | 🟡 Sin restricción de referrer |
| AppInsights Key | `6a7069bb-7d69-48bd-a3c4-3bf7a7b2548a` | 🟡 Telemetría interna |

### V-006: URLs Internas de Subsistemas Expuestas
**Endpoint:** `GET /api/obtenerUrlsPorAmbientes`
```
app-ars-sisacapi-qa-eastus.azurewebsites.net  → AutoriWeb
app-ars-cajaapp-qa-eastus.azurewebsites.net   → Caja App
app-ars-reembolsoapp-qa-eastus.azurewebsites.net → Reembolso
app-ars-cotizadorapi-qa-eastus.azurewebsites.net → Cotizador
app-ars-cotizadorweb-qa-eastus.azurewebsites.net → Cotizador Web
app-ars-autoriweb-qa-eastus.azurewebsites.net → Autori Web
```

### V-007: Implicit Grant Habilitado en IDP
`grant_types_supported` incluye `implicit` en PROD, QA y DES.
**OAuth 2.1:** Deprecado. Permite fuga de tokens vía historial browser/referrer headers.

### V-008: Logout CSRF en IDP
`GET /connect/endsession` → 302 sin requerir `id_token_hint`
**Ataque:** `<img src="https://idp.universal.com.do/connect/endsession">` fuerza logout

### V-009: QA/DES IDPs Públicamente Accesibles
`idp-qa.azurewebsites.net` e `idp-des.azurewebsites.net` sin restricción IP.
Mismo client_id `appenlineaweb` válido en todos los entornos.

---

## 3️⃣ MODERATE — 🟡

### M-001: Azure Blob Lectura Pública
`guportalesstorage01.blob.core.windows.net/afi-documentos-interes/`
- 10 PDFs accesibles sin auth (folletos de inversión, reglamentos)
- Sin capacidad de listar contenedor (blob-level public access)
- Sin capacidad de escritura (PUT → 404)

### M-002: Endpoint Upload Acepta Anónimo
`POST /api/afi/SolicitudesVinculacion` en `app-gu-portales-api`
- Acepta multipart/form-data con `Anonymous: true`
- Campos file: `fotosCedula`, `documentoOrigenIngresos`, `documentoSegundaNacionalidad`
- ✅ No requiere token, pero falla validation business (HTTP 500)

### M-003: DocumentOfInterest Sin Auth
`GET /api/afi/SolicitudesVinculacion/DocumentOfInterest`
- Expone catálogo completo de documentos de inversión con URLs de Azure Blob
- Sin autenticación requerida

### M-004: SISACWeb Client ID Expuesto
Segundo client ID descubierto (QA): `SISACWeb`
(Extraído del bundle JS de SISAC)

### M-005: Client ID Cross-Environment
`appenlineaweb` válido en PROD, QA y DES — potencial confusión de entorno

---

## 4️⃣ OIDC SCOPE INVENTORY

### PROD (14 scopes)
`integraciones.fullAccess`, `unit.connectx.emitirPoliza`, `universal.cajacore.fullAccess`, `backendtest.fullAccess`, `universal.cotizador.ars.fullAccess`, `Universal.ARS.FlujoDeTareas.FullAccess`, `corporativo.comprasTracking.fullAccess`, `Universal.ConsultaPersona.FullAccess`, `universal.fiduciaria.fullAccess`, `remesasservice.fullAccess`, `universal.autoriweb.mvc.fullAccess`

### QA (20 scopes — extras)
`Universal.App.API.fullAccess`, `facturaelectronica.Api`, `universal.uplanner.fullaccess`, `salud.ivr.fullAccess`, `Universal.SegurosWeb.FullAccess`, `bizagi.ETL.fullAccess`, `Universal.APIReclamacionesAuto.FullAccess`, `Universal.ReclamacionesRiesgosGenerales.FullAccess`, `Universal.InfoPiezas.FullAccess`, **`Universal.StorageService.FullAccess`**, `renovaciones.fullAccess`, `universal.configuraciones.fullaccess`, `Universal.Corportativo.SegurosDeViajes.FullAccess`

### DES (19 scopes — extras únicos)
`universal.activosfijos`, `facturaelectronicaapi`, `universal.facturaelectronica.fullaccess`, `ARS.Planes.FullAccess`, `Universal.AFI.Segmentacion.fullaccess`, `Universal.Experiencia.FullAccess`, `Universal.Cotizador.intermediario`

---

## 5️⃣ FILES GENERATED

| File | Size | Content |
|------|:----:|---------|
| `/root/bounty/ars-universal/README.md` | 8.5 KB | Reporte completo |
| `/root/bounty/ars-universal/swagger.json` | 184 KB | Documentación API completa |
| `/root/bounty/ars-universal/prestadores.json` | **1.6 MB** | 9,582 prestadores con PII |
| `/root/bounty/ars-universal/urls_internas.json` | 386 B | URLs subsistemas QA |
| `/root/bounty/ars-universal/oidc_config.json` | 2.2 KB | Config OIDC QA IDP |
| `/root/idp-oidc-misconfig-report.md` | 6.7 KB | Reporte OIDC detallado |

---

## 6️⃣ RECOMMENDATIONS (Prioritized)

### P0 — Inmediato
1. **Deshabilitar swagger público** o agregar auth
2. **Rotar Adobe Sign API key** y Google Maps key
3. **Eliminar datos reales del swagger** (ejemplo CreaReciboCompleto)
4. **Validar que Oracle INSERT endpoints requieran auth**

### P1 — Alto
5. **Deshabilitar implicit grant** en los 3 IDPs
6. **Agregar CSRF protection** al end_session endpoint
7. **Restringir QA/DES IDPs** por IP
8. **Mover secrets del main.js** a server-side

### P2 — Medio
9. **Configurar Azure Blob como privado** (no público ni siquiera blob-level)
10. **Separar client IDs por entorno** para evitar confusión
11. **Revisar redirect URIs** del implicit flow
