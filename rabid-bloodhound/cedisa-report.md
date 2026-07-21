# CEDISA XAPK — Security Analysis Report

**App**: CEDISA (CMR) | **Package**: `com.CMR.eme_salud_cedisa` | **Version**: 2.6.2 (56)
**File**: `/root/bounty/cedisa.xapk` | **Extracted**: `/root/bounty/cedisa_extracted_apk/`
**Native lib (Flutter)**: `/root/bounty/cedisa_apk/lib/armeabi-v7a/libapp.so`

---

## 1. Configuration (`configuration.yaml`)

```yaml
androidAppId: com.CMR.eme_salud_cedisa
iosAppId: com.CMR.eme.salud.cedisa
name: CEDISA
webpage: https://www.cedisa.do/
ip: portalresultados.cedisa.do
usesHttps: true
contact_telephone: "8096212020"
contact_email: citas@cedisa.do/info@cedisa.do
contact_hours: 6.a.m. a 9 p.m.
contact_address: "Pedro Ignacio Espaillat #55"
baseUrl: /HisWebServicios/Portal/ServicioPortal.svc
baseUrlPACS: /visorhtml5/WcfServiceIconos/Service1.svc
baseVisorPACS: /WebUltimateGL/App/Vistas/index.html
debugMode: true                # <-- CRITICAL: Debug mode enabled in production
hasImaging: true
hasLaboratory: false
hasPathology: false
canMakeAppointmets: false
hasBanner: false
hasRecord: false
showAppointments: false
```

---

## 2. Server Information

| Property | Value |
|---|---|
| **Server IP** | `66.98.69.202` |
| **Web Server** | Microsoft-IIS/8.5 |
| **ASP.NET Version** | 4.0.30319 |
| **Backend Framework** | IDigitales.HIS.Web.Servicios v0.33.12.0 |
| **Internal Hostname Leaked** | `srv-recvoz.cmr.local` |

---

## 3. Exposed WCF REST Endpoints

All endpoints at: `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc/`

### Unauthenticated (No parameters required — accessible via GET)

| Method | Path | Status |
|---|---|---|
| `Ping` | `/Ping` | ✅ **WORKS** — Returns service info |
| `ServidoresAdicionales` | `/ServidoresAdicionales/` | 🔴 405 Method Not Allowed |
| `GetContrasenaTabletas` | `/GetContrasenaTabletas/` | 🔴 405 Method Not Allowed |
| `GetSucursales` | `/GetSucursales/` | 🔴 405 Method Not Allowed |
| `GetCatalogoPaisesLada` | `/GetCatalogoPaisesLada/` | 🔴 405 Method Not Allowed |
| `GetCatalogoPlanesAseguramiento` | `/GetCatalogoPlanesAseguramiento/` | 🔴 405 Method Not Allowed |
| `GetModalidadesSucursales` | `/GetModalidadesSucursales/` | 🔴 405 Method Not Allowed |
| `AnalysisCount` | `/AnalysisCount/` | 🔴 405 Method Not Allowed |
| `Folio` | `/Folio/` | 🔴 405 Method Not Allowed |
| `HomePageData` | `/HomePageData/` | 🔴 405 Method Not Allowed |
| `HandleOptionsRequest` | `/HandleOptionsRequest/` | 🔴 405 Method Not Allowed |
| `GetIdPaisHospital` | `/GetIdPaisHospital/` | 🔴 405 Method Not Allowed |
| `ObtieneInformacionEstadisticaCuentasCobrar` | `/ObtieneInformacionEstadisticaCuentasCobrar/` | 🔴 405 Method Not Allowed |
| `GetCatalogoEntidades` | `/GetCatalogoEntidades/` | 🔴 405 Method Not Allowed |
| `GetCatalogoRegimenFiscal` | `/GetCatalogoRegimenFiscal/` | 🔴 405 Method Not Allowed |
| `GetCatalogoUsosCFDI` | `/GetCatalogoUsosCFDI/` | 🔴 405 Method Not Allowed |
| `GetCatalogoFormasPagoSAT` | `/GetCatalogoFormasPagoSAT/` | 🔴 405 Method Not Allowed |
| `ImagingAnalysisList` | `/ImagingAnalysisList/` | 🔴 405 Method Not Allowed |
| `PathologyAnalysisList` | `/PathologyAnalysisList/` | 🔴 405 Method Not Allowed |
| `LaboratoryAnalysisList` | `/LaboratoryAnalysisList/` | 🔴 405 Method Not Allowed |
| `EstudiosImagenologia` | `/EstudiosImagenologia/` | 🔴 405 Method Not Allowed |
| `SolicitudesImagenologia` | `/SolicitudesImagenologia/` | 🔴 405 Method Not Allowed |
| `Paciente` | `/Paciente/` | 🔴 405 Method Not Allowed |
| `Empresa` | `/Empresa/` | 🔴 405 Method Not Allowed |
| `FotoPaciente` | `/FotoPaciente/` | 🔴 405 Method Not Allowed |
| `EstudiosPatologia` | `/EstudiosPatologia/` | 🔴 405 Method Not Allowed |
| `SignosVitales` | `/SignosVitales/` | 🔴 405 Method Not Allowed |
| `Medicamentos` | `/Medicamentos/` | 🔴 405 Method Not Allowed |
| `Alergias` | `/Alergias/` | 🔴 405 Method Not Allowed |
| `HistoriaFamiliar` | `/HistoriaFamiliar/` | 🔴 405 Method Not Allowed |
| `Dietas` | `/Dietas/` | 🔴 405 Method Not Allowed |
| `NotasMedicas` | `/NotasMedicas/` | 🔴 405 Method Not Allowed |
| `Internamientos` | `/Internamientos/` | 🔴 405 Method Not Allowed |

### Authenticated (Require token/parameters)

| Method | Parameters |
|---|---|
| `Token` | username, password |
| `TokenByCredential` | username, password, credencial |
| `PasswordModify` | newPassword, correo, inmediato |
| `PasswordSend` | correo, inmediato |
| `EditContactInfo` | tel, email |
| `ImagingAnalysisListWithToken` | token |
| `ImagingAnalysisByEmpresa` | inicio, fin |
| `SerieDataImagenologia` | folio |
| `ImagingReport` | token, folio, region |
| `ImagingReportFull` | token, folio |
| `ImagingReportRegions` | folio |
| `ImagingAnalysisCatalog` | filtro |
| `ImagingAvailableAppointments` | inicio, fin, idEstudio |
| `ImagingAvailableAppointmentsDay` | datetime, idEstudio |
| `MakeAppointment` | citasJson |
| `ReporteImagen` | folioEstudio |
| `PathologyImage` | id |
| `ImagenPatologia` | ruta |
| `ReportePatologia` | folioEstudio |
| `EnviarNotificacion` | folioPaciente, title, body |
| `PersonalRecuperar` | search |
| `PersonalFirmaGuarda` | idPersonal, firma |
| `PersonalFirmaRecupera` | idPersonal |
| `PersonalFirmaInBodyGuarda` | datos (PersonalFirma) |
| `EstadoCuentaFacturasPlan` | idPlan, inicio, fin, modo |
| `GetConsentimientoPDF` | idConsentimiento |
| `GetContrasenaTabletas` | **(no parameters — suspicious)** |
| `GetConsentimientosLista` | busqueda, fechaInicial, fechaFinal |
| `PostConsentimientosFirma` | idConsentimiento |
| `PostDispositivo` | id, nombre, descripcion |
| `GetEstudiosModalidad` | idModalidad |
| `GetHorariosDisponiblesModalidad` | fecha, idEstudio |
| `SetSolicitudesEstudios` | idPaciente, estudios |
| `SetNuevaCitaSinPaciente` | datos |
| `GetPacienteSolicitudes` | json |
| `GetPacienteByFolio` | folio, telefono |
| `GetInformacionCuenta` | folio, monto |
| `GetCatalogoMunicipios` | idEntidad |
| `GetCatalogoCodigosPostales` | idMunicipio |
| `TimbrarFactura` | folio, rfc, razonSocial, idRegimen, ... |
| `EnviarFacturaCorreo` | correo, idsFactura |
| `DescargarArchivosFactura` | idsFactura |
| `GetListaFacturas` | rfc, nombrePaciente, fechaInicio, fechaFin |
| `GetCamposFormularioConsentimiento` | idConsentimiento |
| `PostGuardarDatosFormularioConsentimiento` | json, idConsentimiento |
| `GetDocumento` | idDocumento |
| `GetPatientDocuments` | idPaciente |
| `GetStudyDocuments` | uidEstudio |

---

## 4. PACS Service Endpoints

`https://portalresultados.cedisa.do/visorhtml5/WcfServiceIconos/Service1.svc`

| Method | Status |
|---|---|
| `GetIcon` | 🔴 Endpoint not found |
| `GetIconPortal` | 🔴 Endpoint not found |
| `GetOptions` | 🔴 Endpoint not found |

WSDL is accessible: `Service1.svc?wsdl` (HTTP 200)

---

## 5. WebUltimateGL PACS Visor

- ✅ **Accessible**: `https://portalresultados.cedisa.do/WebUltimateGL/App/Vistas/index.html` (HTTP 200)
- Webpack-built HTML5 medical image viewer
- Loads content from `/WebUltimateGL/App/Content/`

---

## 6. Ping Response (Unauthenticated)

```json
{"Estado":0,"Data":"[ON] IDigitales.HIS.Web.Servicios, Version=0.33.12.0, Culture=neutral, PublicKeyToken=null","Error":null}
```

✅ **No authentication required** — leaks backend framework version info.

---

## 7. Directory Listing Enabled

`https://portalresultados.cedisa.do/HisWebServicios/Portal/` → **Directory listing is ON**

Contents:
```
23/12/2022  16:20          146  ServicioPortal.svc
```

---

## 8. Internal Network Exposure

The server **leaks an internal hostname** in error redirects:
```
srv-reczoz.cmr.local
```

This reveals:
- Internal network naming convention (`srv-*`)
- Possibly on a `cmr.local` domain
- Internal address routing to the same service

---

## 9. Key Findings from Native Library (`libapp.so`)

### Additional Routes (not in WSDL):
- `/GetIconPortal` — referenced in app code
- `/FotoPaciente` — patient photo endpoint
- `/ImagingReportFull` — full imaging report
- `/PathologyImage` — pathology image  
- `/ReportePatologia` — pathology report

### Authentication Scheme:
- Uses `Basic` and `Bearer` authorization headers
- Token-based auth with `Token` / `TokenByCredential` methods
- `TokenResult` returned as string
- `ImagingAnalysisListWithToken2` suggests a token-variant method

### HTTP Client Classes (Flutter):
- `HttpBase`, `HttpSplash`, `HttpLogin`, `HttpProfile`
- `HttpAlergies`, `HttpNotes`, `HttpDiets`, `HttpPrescriptions`
- `HttpVitalSigns`, `HttpAppointments`, `HttpEditProfile`
- `HttpUserPhoto`, `HttpImagingAnalysisList`, `HttpPathologyAnalysisList`

### Error Messages:
- "Lo sentimos, por el momento no podemos conectarnos a nuestros servicios"
- "El usuario o la contraseña son incorrectos"
- "Error en login: "
- "Error al obtener datos del usuario"

---

## 10. Security Issues Summary

| # | Issue | Severity | Detail |
|---|---|---|---|
| 1 | **debugMode: true** | 🔴 **High** | Debug mode enabled in production configuration |
| 2 | **Directory listing enabled** | 🔴 **High** | `/HisWebServicios/Portal/` lists files |
| 3 | **Internal hostname leaked** | 🟡 Medium | `srv-recvoz.cmr.local` exposed in error messages |
| 4 | **WSDL fully exposed** | 🟡 Medium | All 60+ service methods and parameters publicly documented |
| 5 | **Ping unauth** | 🟡 Medium | `/Ping` leaks backend version (0.33.12.0) without auth |
| 6 | **GetContrasenaTabletas** | 🟡 **Suspicious** | No parameters required — "Get Password Tablets" |
| 7 | **HTTP → HTTPS redirect** | ✅ OK | Uses HTTPS correctly |
| 8 | **Server info leaked** | 🟡 Medium | IIS/8.5 + ASP.NET 4.0.30319 in headers |
| 9 | **PACS visor accessible** | 🟡 Medium | WebUltimateGL HTML5 viewer publicly accessible |

---

## 11. Recommendations

1. **Disable `debugMode`** in production configuration
2. **Disable directory listing** on IIS for `/HisWebServicios/Portal/`
3. **Restrict access** to `GetContrasenaTabletas` — no-parameter password retrieval is suspicious
4. **Remove/obfuscate** internal hostname (`srv-recvoz.cmr.local`)
5. **Add authentication** to the `Ping` endpoint, or remove version info from response
6. **Restrict PACS visor** access to authenticated users only
7. **Block directory browsing** on all IIS virtual directories

---

## 12. Files Analyzed

| File | Path |
|---|---|
| APK (XAPK) | `/root/bounty/cedisa.xapk` |
| Extracted APK | `/root/bounty/cedisa_extracted_apk/` |
| Native lib | `/root/bounty/cedisa_apk/lib/armeabi-v7a/libapp.so` |
| Configuration | `assets/flutter_assets/assets/hospital/configuration.yaml` |
| Android Manifest | `AndroidManifest.xml` |
| WSDL (ServicioPortal) | `?wsdl` (55KB) |
| WSDL (Service1 PACS) | `?wsdl` |
| XSD Schema | `?xsd=xsd0` (full parameter definitions) |

**Report generated**: 2026-07-14
