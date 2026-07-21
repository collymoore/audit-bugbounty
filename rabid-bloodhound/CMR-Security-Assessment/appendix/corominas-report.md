# Análisis Clínica Corominas XAPK

## Resumen Ejecutivo

| Item | Valor |
|------|-------|
| **Paquete** | `com.CMR.emesalud_cmrcorominas` |
| **Versión** | 2.7.3 (code 6) |
| **Tipo de App** | Flutter (AOT compilado, `libapp.so`) |
| **Backend** | WCF (.NET) sobre IIS 10.0 / Windows Server |
| **Dominio principal** | `portal.clinicacorominas.com.do` |
| **Dominio backend real** | `portalresultados.cedisa.do` (Cedisa Consultores) |
| **IP servidor** | `190.167.229.27` (Claro.net.do / Clínica Corominas) |
| **IP backend** | `66.98.69.202` |
| **Puertos** | 80 (HTTP), 443 (HTTPS) |
| **debugMode** | `true` ⚠️ |
| **usesCleartextTraffic** | `true` ⚠️ |
| **PairIP License** | Presente (LicenseContentProvider) |

---

## 1. Config

Extraída de `assets/hospital/configuration.yaml`:

```yaml
androidAppId: com.CMR.emesalud_cmrcorominas
iosAppId: com.CMR.emesalud.corominas
name: Clínica Corominas
webpage: www.clinicacorominas.com.do/
ip: portal.clinicacorominas.com.do
usesHttps: true
baseUrl: /HisWebServicios/Portal/ServicioPortal.svc
baseUrlPACS: /visorhtml5/WcfServiceIconos/Service1.svc
baseVisorPACS: /WebUltimateGL/App/Vistas/index.html
debugMode: true     # <-- SECURITY ISSUE
hasImaging: true
hasLaboratory: false
hasPathology: false
```

**Contacto:**
- Tel: 809-580-1171 Ext. 2173
- Email: info@clinicacorominas.com.do
- Dirección: Calle Restauración 57, Santiago, R.D.

---

## 2. API Endpoints

### ServicioPortal.svc (WCF) — 83 operaciones

**Base URL (live)**: `https://portal.clinicacorominas.com.do/HisWebServicios/Portal/ServicioPortal.svc`

| # | Operación | Tipo |
|---|-----------|------|
| 1 | `Token` | Auth |
| 2 | `TokenByCredential` | Auth |
| 3 | `PasswordModify` | Auth |
| 4 | `PasswordSend` | Auth |
| 5 | `Ping` | Health |
| 6 | `AnalysisCount` | Dashboard |
| 7 | `Folio` | Patient |
| 8 | `Paciente` | Patient |
| 9 | `FotoPaciente` | Patient |
| 10 | `Empresa` | Patient |
| 11 | `EditContactInfo` | Patient |
| 12 | `HomePageData` | Dashboard |
| 13 | `ImagingAnalysisList` | Imaging |
| 14 | `ImagingAnalysisListWithToken` | Imaging |
| 15 | `ImagingAnalysisByEmpresa` | Imaging |
| 16 | `EstudiosImagenologia` | Imaging |
| 17 | `SerieDataImagenologia` | Imaging |
| 18 | `SolicitudesImagenologia` | Imaging |
| 19 | `ImagingReport` | Imaging |
| 20 | `ImagingReportFull` | Imaging |
| 21 | `ImagingReportRegions` | Imaging |
| 22 | `ImagingAnalysisCatalog` | Imaging |
| 23 | `ImagingAvailableAppointments` | Appointments |
| 24 | `ImagingAvailableAppointmentsDay` | Appointments |
| 25 | `MakeAppointment` | Appointments |
| 26 | `GetSucursales` | Catalog |
| 27 | `GetModalidadesSucursales` | Catalog |
| 28 | `GetEstudiosModalidad` | Catalog |
| 29 | `GetHorariosDisponiblesModalidad` | Catalog |
| 30 | `SetSolicitudesEstudios` | Catalog |
| 31 | `GetCatalogoPaisesLada` | Catalog |
| 32 | `GetCatalogoPlanesAseguramiento` | Catalog |
| 33 | `GetCatalogoEntidades` | Catalog |
| 34 | `GetCatalogoMunicipios` | Catalog |
| 35 | `GetCatalogoCodigosPostales` | Catalog |
| 36 | `GetCatalogoRegimenFiscal` | Catalog |
| 37 | `GetCatalogoUsosCFDI` | Catalog |
| 38 | `GetCatalogoFormasPagoSAT` | Catalog |
| 39 | `GetIdPaisHospital` | Catalog |
| 40 | `GetInformacionCuenta` | Account |
| 41 | `GetListaFacturas` | Invoicing |
| 42 | `TimbrarFactura` | Invoicing (SAT/Mexico) |
| 43 | `EnviarFacturaCorreo` | Invoicing |
| 44 | `DescargarArchivosFactura` | Invoicing |
| 45 | `EstadoCuentaFacturasPlan` | Invoicing |
| 46 | `ObtieneInformacionEstadisticaCuentasCobrar` | Invoicing |
| 47 | `SetNuevaCitaSinPaciente` | Appointments |
| 48 | `GetPacienteSolicitudes` | Patient |
| 49 | `GetPacienteByFolio` | Patient |
| 50 | `ActualizaPaciente` | Patient |
| 51 | `SignosVitales` | Medical Record |
| 52 | `Medicamentos` | Medical Record |
| 53 | `Alergias` | Medical Record |
| 54 | `HistoriaFamiliar` | Medical Record |
| 55 | `Dietas` | Medical Record |
| 56 | `NotasMedicas` | Medical Record |
| 57 | `Internamientos` | Medical Record |
| 58 | `PathologyAnalysisList` | Pathology |
| 59 | `EstudiosPatologia` | Pathology |
| 60 | `ImagenPatologia` | Pathology |
| 61 | `PathologyImage` | Pathology |
| 62 | `ReportePatologia` | Pathology |
| 63 | `LaboratoryAnalysisList` | Laboratory |
| 64 | `EnviarNotificacion` | Notifications |
| 65 | `PersonalRecuperar` | Staff |
| 66 | `PersonalFirmaGuarda` | Staff |
| 67 | `PersonalFirmaInBodyGuarda` | Staff |
| 68 | `PersonalFirmaRecupera` | Staff |
| 69 | `ReporteImagen` | Imaging |
| 70 | `ServidoresAdicionales` | Discovery |
| 71 | `GetConsentimientoPDF` | Consent |
| 72 | `GetContrasenaTabletas` | **Credentials Leak** |
| 73 | `GetConsentimientosLista` | Consent |
| 74 | `PostConsentimientosFirma` | Consent |
| 75 | `PostDispositivo` | Device |
| 76 | `GetCamposFormularioConsentimiento` | Consent |
| 77 | `PostGuardarDatosFormularioConsentimiento` | Consent |
| 78 | `GetDocumento` | Documents |
| 79 | `GetPatientDocuments` | Documents |
| 80 | `GetStudyDocuments` | Documents |
| 81 | `HandleOptionsRequest` | CORS |
| 82 | `GetPacienteSolicitudes` | Patient |
| 83 | `GetInformacionCuenta` | Account |

### Service1.svc (Iconos PACS) — 3 operaciones

**Base URL**: `https://portal.clinicacorominas.com.do/visorhtml5/WcfServiceIconos/Service1.svc`

- `GetIcon`
- `GetIconPortal`
- `GetOptions`

### PACS Viewer

**URL**: `https://portal.clinicacorominas.com.do/WebUltimateGL/App/Vistas/index.html`
- Web-based DICOM/PACS viewer
- jQuery UI based

---

## 3. Secrets & Credentials Encontrados

### 🔴 CRÍTICO — Tablet Password Expuesto

Endpoint sin autenticación: `GetContrasenaTabletas`

```json
GET /HisWebServicios/Portal/ServicioPortal.svc/GetContrasenaTabletas
Response: {"Data": "cmrservice05"}
```

**Impacto**: Cualquier persona puede obtener la contraseña de tablets del hospital.

### Pasword Recovery Endpoints

- `PasswordSend` — probablemente envía email de recuperación
- `PasswordModify` — modificación de contraseña

### Auth Pattern (desde strings de libapp.so)

- `Bearer` tokens
- `Token` / `TokenByCredential` — login endpoints
- `LoginDict`, `LoginForm`, `LoginPage`
- `Error en login: |`
- `Login exitoso en sede: `
- `The username or password are incorrect`
- `Password is required`

### No se encontraron:
- ❌ Google API keys (AIza...)
- ❌ Firebase credentials
- ❌ google-services.json
- ❌ API keys hardcodeadas

---

## 4. Auth Patterns

1. **Token endpoint** (`/Token`): Obtiene token de sesión
2. **TokenByCredential** (`/TokenByCredential`): Login con credenciales
3. **Bearer tokens**: Las requests autenticadas usan `Authorization: Bearer <token>`
4. **Password endpoints**: `PasswordSend`, `PasswordModify` para recuperación

---

## 5. AndroidManifest Permissions

| Permission | Type |
|-----------|------|
| `INTERNET` | Normal |
| `WRITE_EXTERNAL_STORAGE` | Dangerous |
| `READ_EXTERNAL_STORAGE` | Dangerous |
| `POST_NOTIFICATIONS` | Dangerous (Android 13+) |
| `ACCESS_NETWORK_STATE` | Normal |
| `FOREGROUND_SERVICE` | Normal |
| `RECEIVE_BOOT_COMPLETED` | Normal |
| `WAKE_LOCK` | Normal |
| `VIBRATE` | Normal |
| `CHECK_LICENSE` | Google Play |
| `usesCleartextTraffic` | **`true`** ⚠️ |

---

## 6. Live Endpoint Verification

| Endpoint | Status | Response |
|----------|--------|----------|
| `portal.clinicacorominas.com.do/` | ✅ 200 | IIS Windows default page |
| `/ServicioPortal.svc` | ✅ 200 | WCF service page |
| `/ServicioPortal.svc?wsdl` | ✅ 200 | WSDL completo (83 ops) |
| `/ServicioPortal.svc/GetSucursales` | ✅ 200 | `[CLINICA COROMINAS]` |
| `/ServicioPortal.svc/GetCatalogoPaisesLada` | ✅ 200 | 245 países |
| `/ServicioPortal.svc/GetCatalogoPlanesAseguramiento` | ✅ 200 | `[MOSTRADOR-MOSTRADOR]` |
| `/ServicioPortal.svc/GetIdPaisHospital` | ✅ 200 | `63` (República Dominicana) |
| `/ServicioPortal.svc/HomePageData` | ✅ 200 | 81 estudios imagen, 0 pato, 0 lab |
| `/ServicioPortal.svc/Ping` | ✅ 200 | Redirect to `/Ping/` |
| `/ServicioPortal.svc/ServidoresAdicionales` | ✅ 200 | `{"data":[]}` |
| `/ServicioPortal.svc/GetContrasenaTabletas` | ✅ 200 | **`cmrservice05`** 🔴 |
| `/ServicioPortal.svc/GetConsentimientosLista` | ✅ 200 | Lista vacía |
| `/ServicioPortal.svc/PostDispositivo` | ✅ 200 | Device registration |
| `/visorhtml5/WcfServiceIconos/Service1.svc` | ✅ 200 | 3 operations |
| `/WebUltimateGL/App/Vistas/index.html` | ✅ 200 | PACS Viewer |
| `www.clinicacorominas.com.do` | ❌ 000 | No resuelve |
| `corominas.com.do` (HTTP) | ✅ 200 | WordPress site (ModSecurity) |

---

## 7. Estructura del Backend

### Arquitectura

```
Frontend (Flutter) → WCF SOAP/REST → SQL Server
                    ↕
               IIS 10.0
               Windows Server
               IP: 190.167.229.27
```

| Componente | Tecnología |
|-----------|-----------|
| **App móvil** | Flutter (Dart AOT, `libapp.so` 12MB+) |
| **Web principal** | WordPress en `corominas.com.do` |
| **API backend** | WCF (.NET) en `portal.clinicacorominas.com.do` |
| **Servidor web** | Microsoft IIS 10.0 |
| **OS** | Windows Server |
| **PACS** | WebUltimateGL (visor DICOM web) |
| **Base de datos** | Probablemente SQL Server (por el stack .NET + WCF) |
| **Namespace backend** | `IDigitales.HIS.Web.Servicios.Portal` |

**Desarrollador**: `Cedisa Consultores` (`portalresultados.cedisa.do`) — IDigitales HIS platform.

### Formato de datos

- JSON sobre HTTP POST
- Namespace: `http://tempuri.org/`
- DataContract: `http://schemas.datacontract.org/2004/07/IDigitales.HIS.Web.Servicios.Portal`
- Resultados envueltos en: `{"OperationResult": "{\"Estado\":0,\"Data\":...,\"Error\":null}"}`

---

## Hallazgos de Seguridad

| # | Severidad | Hallazgo |
|---|-----------|----------|
| 1 | 🔴 Crítico | `GetContrasenaTabletas` expone contraseña de tablets sin auth |
| 2 | 🟡 Medio | `debugMode: true` en producción |
| 3 | 🟡 Medio | `usesCleartextTraffic=true` permite HTTP plano |
| 4 | 🟡 Medio | Endpoints públicos sin autenticación (catálogos, sucursales) |
| 5 | 🟡 Medio | WordPress con ModSecurity en `corominas.com.do` (xmlrpc.php bloqueado) |
| 6 | 🟢 Info | WSDL expuesto públicamente con todas las operaciones |
| 7 | 🟢 Info | PairIP License Check (protección contra cracked APKs) |

---

## Notas Adicionales

- App usa PairIP license checking (com.pairip.licensecheck)
- Misma plataforma/source que InterHospital y Hospital San José Hermosillo
- Stack WCF = legacy .NET Framework
- `ServidoresAdicionales` permite descubrimiento dinámico de servidores (actualmente vacío)
- PACS Viewer usa WebUltimateGL (probablemente UltimateGL Web)
- Correo manejado por SupremeBox (mx1.supremebox.com, mx2.supremebox.com)
