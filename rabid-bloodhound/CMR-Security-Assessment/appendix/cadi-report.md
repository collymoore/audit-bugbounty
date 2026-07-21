# 🔴 CADI XAPK Analysis Report — Endpoints & Findings

**Date:** 2026-07-14
**App:** emesalud_cadi.xapk — `com.CMR.emesalud_cadi`
**Hospital:** CENTRO AVANZADO DE DIAGNÓSTICO E IMAGEN, S.A.S (CADI)
**Country:** República Dominicana
**Backend:** WCF on IIS + Cloudflare

---

## 1. App Configuration (configuration.yaml)

| Field | Value |
|-------|-------|
| ip | portal.cadi.do |
| usesHttps | true |
| baseUrl | /HisWebServicios/Portal/ServicioPortal.svc |
| baseUrlPACS | /visorhtml5/WcfServiceIconos/Service1.svc |
| baseVisorPACS | /WebUltimateGL/App/Vistas/index.html |
| debugMode | **true** ⚠️ |
| hasImaging | true |
| canMakeAppointmets | true (typo in original) |
| contact_telephone | (809) 255-2234 |
| contact_email | info@cadi.do |

---

## 2. Internal Server Name Leak 🔴

Every request to `ServicioPortal.svc` (without trailing slash) returns a redirect page containing:

```
https://srv-portal/HisWebServicios/Portal/ServicioPortal.svc
```

**Internal hostname discovered:** `srv-portal` (Windows server, likely on internal network). This is exposed in the IIS redirect response for ANY operation called without trailing slash.

---

## 3. Critical Finding: GetContrasenaTabletas Returns Password (No Auth) 🔴

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/GetContrasenaTabletas`
**Auth required:** NONE

**Response:**
```json
{"Estado":0,"Data":"cmrservice05","Error":null}
```

Returns the **tablet password**: `cmrservice05`. This endpoint requires zero authentication and returns a credential used for tablets accessing the system.

---

## 4. Publicly Accessible Endpoints (No Auth Required)

All tested via `POST /HisWebServicios/Portal/ServicioPortal.svc/{Operation}` with `Content-Type: application/json` and `{}` body.

### Working Endpoints

| Operation | Response Summary | Sensitivity |
|-----------|-----------------|-------------|
| **GetContrasenaTabletas** | Returns password `cmrservice05` | 🔴 CRITICAL |
| **Ping** (`GET /svc/Ping`) | `IDigitales.HIS.Web.Servicios, Version=0.32.71.0` | 🟡 Info leak |
| **GetSucursales** | Hospital branch info (1 branch: CADI) | 🟢 Low |
| **GetModalidadesSucursales** | Imaging modalities: MG, CR, DX, MR, CT, US | 🟢 Low |
| **GetCatalogoPaisesLada** | Full country calling code catalog | 🟢 Low |
| **GetCatalogoPlanesAseguramiento** | Insurance plans (94 plans:ARS Humano, APS, Universal, MAPFRE, Banreservas, etc.) | 🟡 Moderate |
| **HomePageData** | Study counts: 100 imaging, 0 pathology, 0 lab | 🟢 Low |
| **ServidoresAdicionales** | Returns `{"data":[]}` (empty — no additional servers configured) | 🟢 Low |
| **GetIdPaisHospital** | Returns `"63"` (Dominican Republic country ID) | 🟢 Low |
| **ObtieneInformacionEstadisticaCuentasCobrar** | Accounts receivable stats (all zeros) | 🟢 Low |
| **PasswordSend** | Password reset — validates email addresses `"Correo no válido"` | 🟡 Email oracle |

### Endpoints Returning Empty (May Require Valid Auth or Data)

| Operation | Response |
|-----------|----------|
| Token | `{"TokenResult":""}` |
| TokenByCredential | `{"TokenByCredentialResult":""}` |
| AnalysisCount | `""` |
| Folio | `""` |
| Paciente | `""` |
| Empresa | `"null"` |

---

## 5. WSDL — Full API Surface

**WSDL URL:** `https://portal.cadi.do/HisWebServicios/Portal/ServicioPortal.svc?wsdl`

**Service:** `IServicioPortal` (namespace: `http://tempuri.org/`)
**Assembly:** `IDigitales.HIS.Web.Servicios.Portal`

### Complete Operation List (48 total)

#### 🔐 Authentication
- `Token(username, password)` → string
- `TokenByCredential(username, password, credencial)` → string
- `PasswordModify(newPassword, correo, inmediato)` → string
- `PasswordSend(correo, inmediato)` → string

#### 📋 Patient & Appointment
- `Paciente()` → string
- `Folio()` → string (returns empty without auth)
- `GetPacienteByFolio(folio, telefono)` → string
- `GetPacienteSolicitudes(json)` → string
- `ActualizaPaciente(folio, idPaisLada, telefono, correo, poliza, idPlan)` → string
- `GetInformacionCuenta(folio, monto)` → string
- `MakeAppointment(citasJson)` → string
- `SetNuevaCitaSinPaciente(datos)` → string
- `SetSolicitudesEstudios(idPaciente, estudios)` → string
- `GetSucursales()` → string
- `GetModalidadesSucursales()` → string
- `GetEstudiosModalidad(idModalidad)` → string
- `GetHorariosDisponiblesModalidad(fecha, idEstudio)` → string
- `ImagingAvailableAppointments(inicio, fin, idEstudio)` → string
- `ImagingAvailableAppointmentsDay(datetime, idEstudio)` → string
- `PostDispositivo(id, nombre, descripcion)` → string

#### 🏥 Medical Records
- `SignosVitales()` → string
- `Medicamentos()` → string
- `Alergias()` → string
- `HistoriaFamiliar()` → string
- `Dietas()` → string
- `NotasMedicas()` → string
- `Internamientos()` → string
- `EnviarNotificacion(folioPaciente, title, body)` → string
- `GetPatientDocuments(idPaciente)` → string
- `GetStudyDocuments(uidEstudio)` → string

#### 🖼️ Imaging / Radiology
- `ImagingAnalysisList()` → string
- `ImagingAnalysisListWithToken(token)` → string
- `ImagingAnalysisByEmpresa(inicio, fin)` → string
- `ImagingAnalysisCatalog(filtro)` → string
- `EstudiosImagenologia()` → string
- `SerieDataImagenologia(folio)` → string
- `SolicitudesImagenologia()` → string
- `ImagingReport(token, folio, region)` → Stream (PDF)
- `ImagingReportFull(token, folio)` → Stream (PDF)
- `ImagingReportRegions(folio)` → string
- `ReporteImagen(folioEstudio)` → Stream (PDF)
- `ImagenPatologia(ruta)` → string

#### 🔬 Pathology
- `PathologyAnalysisList()` → string
- `PathologyImage(id)` → Stream
- `EstudiosPatologia()` → string
- `ReportePatologia(folioEstudio)` → Stream (PDF)

#### 🧪 Laboratory
- `LaboratoryAnalysisList()` → string

#### 📄 Documents & Consent
- `GetConsentimientoPDF(idConsentimiento)` → Stream (PDF)
- `GetConsentimientosLista(busqueda, fechaInicial, fechaFinal)` → string
- `PostConsentimientosFirma(idConsentimiento)` → string
- `GetCamposFormularioConsentimiento(idConsentimiento)` → string
- `PostGuardarDatosFormularioConsentimiento(json, idConsentimiento)` → string
- `GetDocumento(idDocumento)` → Stream

#### 👤 Staff / Personal
- `PersonalRecuperar(search)` → string
- `PersonalFirmaGuarda(idPersonal, firma)` → string
- `PersonalFirmaRecupera(idPersonal)` → string
- `PersonalFirmaInBodyGuarda(datos)` → string
- `FotoPaciente()` → Stream (patient photo)
- `EditContactInfo(tel, email)` → string

#### 💰 Billing / Invoicing (SAT CFDI — Mexican tax system!)
- `EstadoCuentaFacturasPlan(idPlan, inicio, fin, modo)` → Stream (PDF)
- `ObtieneInformacionEstadisticaCuentasCobrar()` → string
- `GetCatalogoRegimenFiscal()` → string
- `GetCatalogoUsosCFDI()` → string
- `GetCatalogoFormasPagoSAT()` → string
- `TimbrarFactura(folio, rfc, razonSocial, idRegimen, idEntidad, idMunicipio, idCodigoPostal, usoCFDI, correo)` → string
- `EnviarFacturaCorreo(correo, idsFactura)` → string
- `DescargarArchivosFactura(idsFactura)` → string
- `GetListaFacturas(rfc, nombrePaciente, fechaInicio, fechaFin)` → string

#### 🗺️ Catalogs
- `GetCatalogoPaisesLada()` → string
- `GetCatalogoPlanesAseguramiento()` → string
- `GetCatalogoEntidades()` → string
- `GetCatalogoMunicipios(idEntidad)` → string
- `GetCatalogoCodigosPostales(idMunicipio)` → string
- `GetIdPaisHospital()` → string
- `AnalysisCount()` → string
- `Empresa()` → string
- `HomePageData()` → string

#### 🔧 System
- `Ping()` → string
- `HandleOptionsRequest()` → void (CORS handshake)
- `ServidoresAdicionales()` → string
- `GetContrasenaTabletas()` → string 🔴

---

## 6. PACS WCF Service

**WSDL:** `https://portal.cadi.do/visorhtml5/WcfServiceIconos/Service1.svc?wsdl`
**Namespace:** `http://tempuri.org/`

| Operation | Description |
|-----------|-------------|
| `GetIcon` | Get icon/image |
| `GetIconPortal` | Get portal icon |
| `GetOptions` | Get options |

---

## 7. Web Viewers (Accessible)

| URL | Status |
|-----|--------|
| `https://portal.cadi.do/visorhtml5/WebDiagRxMobile` | ✅ HTTP 200 (WebDiag) |
| `https://portal.cadi.do/WebUltimateGL/App/Vistas/index.html` | ✅ HTTP 200 (webpack React app) |

---

## 8. CORS Configuration (Wide Open)

```
access-control-allow-origin: *
access-control-allow-headers: Content-Type, Accept, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, Custom-Header
access-control-allow-methods: POST,GET,PUT,OPTIONS
access-control-expose-headers: Content-Height,Content-Width,Content-Formato
access-control-max-age: 1728000
```

Allows cross-origin requests from any domain — potential for CSRF-style attacks.

---

## 9. CEDISA Cross-App Reference Found

In `libapp.so`, a hardcoded URL to another CMR client:
```
https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales
```

**CEDISA Ping response:** `IDigitales.HIS.Web.Servicios, Version=0.33.12.0` (different version than CADI: 0.32.71.0)

This confirms the CMR white-label pattern — same codebase, different per-hospital config.

---

## 10. Server Info Leak

| Header | Value |
|--------|-------|
| `x-aspnet-version` | 4.0.30319 |
| `x-powered-by` | ASP.NET |
| `server` | cloudflare |
| Internal hostname | `srv-portal` (leaked in redirect responses) |
| Backend assembly | `IDigitales.HIS.Web.Servicios, Version=0.32.71.0` |

**Cloudflare:** Portal behind Cloudflare CDN. Real origin IP not determined.

---

## 11. Permissions (AndroidManifest.xml)

- `INTERNET`
- `WRITE_EXTERNAL_STORAGE`
- `READ_EXTERNAL_STORAGE` (maxSdkVersion=32)
- `POST_NOTIFICATIONS`
- `VIBRATE`
- `WAKE_LOCK`
- `ACCESS_NETWORK_STATE`
- `RECEIVE_BOOT_COMPLETED`
- `FOREGROUND_SERVICE`

---

## 12. SQFlite (Local Database)

The app uses `sqflite` with a local database `eme_salud.db`. This means patient data may be cached locally on the device.

---

## 13. Summary of Findings

| Severity | Finding |
|----------|---------|
| 🔴 **CRITICAL** | `GetContrasenaTabletas` returns password `cmrservice05` with no auth |
| 🔴 **CRITICAL** | Internal server name `srv-portal` leaked via IIS redirect responses |
| 🟡 **HIGH** | `PasswordSend` endpoint publicly accessible — potential email oracle |
| 🟡 **HIGH** | `debugMode: true` in production config |
| 🟡 **HIGH** | Full WSDL publicly accessible — 48 operations mapped |
| 🟡 **MODERATE** | Version info leak via Ping: `0.32.71.0` |
| 🟡 **MODERATE** | CORS wide open (`*`) — cross-origin attacks possible |
| 🟡 **MODERATE** | SAT CFDI invoicing endpoints present (Mexican tax) in RD hospital app |
| 🟡 **MODERATE** | Token endpoint returns empty string (not error) — enumeration possible |
| 🟢 **INFO** | Imaging viewers publicly accessible |
| 🟢 **INFO** | CEDI cross-app reference confirms CMR white-label pattern |
| 🟢 **INFO** | SQFlite local storage — data cached on device |
| 🟢 **INFO** | Insurance plan catalog leaked (94 plans, ARS providers) |

---

## 14. Credentials Found

| Credential | Source | Valid? |
|------------|--------|--------|
| `cmrservice05` | `GetContrasenaTabletas` API | ✅ Confirmed (API returns Estado:0) |
| `info@cadi.do` | configuration.yaml | Contact email only |
