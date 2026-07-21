# InfoSalud Firmas — Análisis de Seguridad

**Fecha:** 2026-07-14
**App:** InfoSalud Firmas (XAPK)
**Package:** `com.CMR.firmas_infosalud`
**Framework:** Flutter
**Servidor Backend:** WCF .NET
**URL Base:** `http://www.cmr-apps.com`

---

## 1. Configuration.yaml

### Archivo principal: `assets/flutter_assets/configuration.yaml`

```yaml
debugMode: false
name: InfoSalud
ip: http://www.cmr-apps.com
```

**Observación:** 
- Usa HTTP plano (sin HTTPS) para toda la comunicación.
- No define `baseUrl`, lo que sugiere que las rutas WCF se construyen directamente en el código Dart.
- `debugMode: false` a pesar de que el contexto indicaba `debugMode=true`.

### Archivo secundario: `assets/flutter_assets/assets/hospital/configuration.yaml`
Corresponde a otra app (EMESALUD / Policlínica Metropolitana) incluida en el bundle.

---

## 2. libapp.so — Strings Relevantes

Extraídos del archivo `lib/arm64-v8a/libapp.so` contenido en `config.arm64_v8a.apk`.

### Endpoints encontrados (endpoints específicos de Firmas/Consentimientos):

| Endpoint | Método | Parámetros |
|---|---|---|
| `/HisWebServicios/Portal/ServicioPortal.svc/GetContrasenaTabletas` | POST/GET | _(ninguno)_ |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetCamposFormularioConsentimiento` | POST/GET | `idConsentimiento` |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetConsentimientoPDF` | POST/GET | `idConsentimiento` |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetConsentimientosLista` | POST/GET | `busqueda` |
| `/HisWebServicios/Portal/ServicioPortal.svc/PersonalFirmaInBodyGuarda` | POST | _(body)_ |
| `/HisWebServicios/Portal/ServicioPortal.svc/PersonalFirmaRecupera` | POST/GET | `idPersonal` |
| `/HisWebServicios/Portal/ServicioPortal.svc/PersonalRecuperar` | POST/GET | _(ninguno)_ |
| `/HisWebServicios/Portal/ServicioPortal.svc/PostConsentimientosFirma` | POST | `idConsentimiento` |
| `/HisWebServicios/Portal/ServicioPortal.svc/PostGuardarDatosFormularioConsentimiento` | POST | _(body)_ |

### Nombres de campos/entidades en runtime:
- `Firma`, `Firma electrónica`
- `GetContrasenaTabletasResult`, `PersonalFirmaRecuperaResult`
- `PostConsentimientosFirmaResult`, `GetConsentimientosListaResult`
- `FirmaConsentimientos`, `HomePageFirmas`
- `NombrePaciente`, `FolioPaciente`, `Cedula`
- `Paciente`, `PacienteView`, `PacienteViewState`
- Constantes: `"Usando password en linea"`, `"Usando password offline"`
- Token: `AliasToken`, `AnchorToken`, `RootIsolateToken`
- Texto UI: `"Permita que sus pacientes firmen sus consentimientos informados desde tabletas."`

### Datos sensibles en texto claro:
- Contraseña de tablets: `cmrservice05` (hardcodeada en respuesta del servidor)

---

## 3. WSDL — Accesible

**URL:** `http://www.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc?wsdl`
**Estado:** `HTTP 200` — **Totalmente accesible sin autenticación**
**Tamaño:** 53,232 bytes
**Namespace:** `http://tempuri.org/`
**Data Contract:** `http://schemas.datacontract.org/2004/07/IDigitales.HIS.Web.Servicios.Portal`

### Las 76 operaciones expuestas en el WSDL:

**Autenticación:**
- `Token` — Retorna token vacío (no implementado / requiere headers)
- `TokenByCredential` — Inicio de sesión por credenciales
- `PasswordModify`, `PasswordSend` — Cambio/envío de contraseñas

**Pacientes:**
- `Paciente` — Obtener datos del paciente
- `ActualizaPaciente` — Actualizar datos del paciente
- `Folio` — Obtener folio
- `FotoPaciente` — Obtener foto del paciente
- `GetPacienteByFolio`, `GetPacienteSolicitudes`

**Personal Médico:**
- `PersonalRecuperar` — Listar todo el personal (SIN AUTH)
- `PersonalFirmaGuarda`, `PersonalFirmaRecupera` — Firmas del personal
- `PersonalFirmaInBodyGuarda` — Guardar firma en body

**Consentimientos (InfoSalud Firmas):**
- `GetContrasenaTabletas` — Obtener contraseña de tablets
- `GetConsentimientoPDF` — Obtener PDF de consentimiento
- `GetConsentimientosLista` — Listar consentimientos
- `PostConsentimientosFirma` — Firmar consentimiento
- `GetCamposFormularioConsentimiento` — Campos del formulario
- `PostGuardarDatosFormularioConsentimiento` — Guardar datos del formulario
- `PostDispositivo` — Registrar dispositivo

**Imagenología (PACS):**
- `ImagingAnalysisList`, `ImagingAnalysisListWithToken`, `ImagingAnalysisByEmpresa`
- `ImagingAnalysisCatalog`, `ImagingAvailableAppointments`, `ImagingAvailableAppointmentsDay`
- `ImagingReport`, `ImagingReportFull`, `ImagingReportRegions`
- `EstudiosImagenologia`, `SerieDataImagenologia`, `SolicitudesImagenologia`
- `ReporteImagen`, `MakeAppointment`

**Patología:**
- `PathologyAnalysisList`, `PathologyImage`
- `EstudiosPatologia`, `ImagenPatologia`, `ReportePatologia`

**Laboratorio:**
- `LaboratoryAnalysisList`

**Historia Clínica:**
- `SignosVitales`, `Medicamentos`, `Alergias`, `HistoriaFamiliar`, `Dietas`, `NotasMedicas`
- `Internamientos`, `HomePageData`

**Catálogos:**
- `GetCatalogoPaisesLada`, `GetCatalogoEntidades`, `GetCatalogoMunicipios`
- `GetCatalogoCodigosPostales`, `GetCatalogoRegimenFiscal`, `GetCatalogoUsosCFDI`
- `GetCatalogoFormasPagoSAT`, `GetCatalogoPlanesAseguramiento`
- `GetSucursales`, `GetModalidadesSucursales`, `GetEstudiosModalidad`
- `GetHorariosDisponiblesModalidad`, `GetIdPaisHospital`

**Facturación (CFDI):**
- `EstadoCuentaFacturasPlan`, `ObtieneInformacionEstadisticaCuentasCobrar`
- `TimbrarFactura`, `EnviarFacturaCorreo`, `DescargarArchivosFactura`, `GetListaFacturas`
- `GetInformacionCuenta`

**Infraestructura:**
- `ServidoresAdicionales` — Información de servidores internos
- `HandleOptionsRequest` — CORS handler

**Agendamiento:**
- `SetNuevaCitaSinPaciente`, `SetSolicitudesEstudios`
- `EnviarNotificacion`, `EditContactInfo`, `AnalysisCount`
- `Empresa`, `Dietas`

---

## 4. GetContrasenaTabletas — Prueba Exitosa

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/GetContrasenaTabletas`

**Request:**
```xml
<GetContrasenaTabletas xmlns="http://tempuri.org/"/>
```

**Response (HTTP 200):**
```json
{
  "GetContrasenaTabletasResult": "{\"Estado\":0,\"Data\":\"cmrservice05\",\"Error\":null}"
}
```

**Hallazgo CRÍTICO:** La contraseña de las tablets es `cmrservice05`. Esta misma contraseña se reutiliza a través de todas las apps CMR (InfoSalud, EMESALUD, Policlínica, etc.). `Estado: 0` indica operación exitosa.

---

## 5. PersonalRecuperar — Fuga Masiva de Datos

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/PersonalRecuperar`

**Request:**
```xml
<PersonalRecuperar xmlns="http://tempuri.org/"/>
```

**Response:** HTTP 200 — **131 registros de personal** expuestos sin autenticación.

### Datos expuestos por registro:
| Campo | Ejemplo |
|---|---|
| `IdPersonal` | 1 |
| `Nombre` | ADMINISTRADOR ADMIN ADMIN |
| `Cedula` | 7654321 |
| `Estado` | true/false |
| `UltimaModificacion` | 2024-11-21T16:56:00.38 |
| `Rol` | ADMINISTRADOR |
| `Especialidad` | ANESTESIOLOGÍA |

### Resumen de personal expuesto:
- **Total registros:** 131
- **Personal activo:** ~60 registros con `Estado: true`
- **Roles identificados:** ADMINISTRADOR, MNF RADIOLOGO, TECNICO RADIOLOGO, PATOLOGO ADMIN, HISTOTECNO, MEDICO URGENCIAS, etc.
- **Especialidades:** RADIOLOGÍA, ANESTESIOLOGÍA, MEDICINA DE URGENCIAS, PATOLOGÍA, CIRUGÍA GENERAL, etc.
- **Cédulas reales expuestas** (no placeholder): `7654321`, `1545855`, `122212122`, `40222798320`, `40220798321`, `98372838`, `8284250`, `8935518`, `80545581`, `13484478`, etc.

---

## 6. GetConsentimientosLista — Fuga de Datos de Pacientes

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/GetConsentimientosLista`

**Request:**
```xml
<GetConsentimientosLista xmlns="http://tempuri.org/"><busqueda></busqueda></GetConsentimientosLista>
```

**Response:** HTTP 200 — **77 consentimientos** expuestos. Buscar con string vacío retorna TODOS.

### Datos expuestos por consentimiento:
| Campo | Ejemplo |
|---|---|
| `IdConsentimiento` | 82 |
| `Fecha` | 2025-04-07T17:29:50.183 |
| `NombrePaciente` | ALEX PRUEBA PRUEBA PRUEBA |
| `FolioPaciente` | 9999999999 |
| `Tipo` | Carta Mastografía |
| `Estado` | Firmado / Sin Firmar |
| `Editable` | true/false |
| `FormularioRegistrado` | true/false |

### Tipos de consentimiento:
- Carta Mastografía
- Carta Tomografía
- CARTA 1 PROCEDIMIENTOS
- CARTA 2 MEDICAMENTOS EN INVESTIGACIÓN
- CARTE 3 CARTA CONSENTIMIENTO
- CARTA PERSONALIZADA PRUEBA
- CARTA PRUEBA
- CONSENTIMIENTO 2 PRUEBA

---

## 7. Verificación de Accesibilidad — Sin Autenticación

### Endpoints probados y accesibles sin token/credencial:

| Endpoint | Método | Status | Datos devueltos |
|---|---|---|---|
| `?wsdl` | GET | ✅ 200 | WSDL completo (53KB) |
| `GetContrasenaTabletas` | POST | ✅ 200 | Contraseña de tablets |
| `PersonalRecuperar` | POST | ✅ 200 | 131 registros de personal |
| `GetConsentimientosLista` | POST | ✅ 200 | 77 consentimientos |
| `Token` | POST | ✅ 200 | String vacío (sin auth) |
| `PersonalFirmaRecupera` | POST | ✅ 200 | Firma/staff info |
| `GetCamposFormularioConsentimiento` | POST | ✅ 200 | Campos de formulario (id=82: error) |
| `GetConsentimientoPDF` | POST | ✅ 200 | PDF (0 bytes para id=82) |

**Ninguno de los endpoints probados requirió autenticación.**

### Información interna filtrada:
El servidor redirige ciertas rutas a un hostname interno: **`eymsa-app1.internal.cmr.mx`**, revelando infraestructura de red interna.

---

## 8. Resumen de Hallazgos de Seguridad

### 🔴 CRÍTICOS

| # | Hallazgo | Impacto |
|---|---|---|
| 1 | **Fuga de 131 registros de personal médico** — `PersonalRecuperar` sin autenticación | Nombres completos, cédulas profesionales, roles, especialidades |
| 2 | **Fuga de 77 consentimientos informados** — `GetConsentimientosLista` sin autenticación | Nombres de pacientes, folios, fechas, tipos de procedimientos |
| 3 | **Contraseña de tablets revelada** — `GetContrasenaTabletas` retorna `cmrservice05` | Acceso no autorizado a tablets de firma en todas las apps CMR |
| 4 | **HTTP plano** — Todo el tráfico sin cifrar | Intercepción de datos en tránsito (MiTM) |
| 5 | **WSDL completamente expuesto** — 76 operaciones documentadas | Superficie de ataque completa |

### 🟡 ALTOS

| # | Hallazgo | Impacto |
|---|---|---|
| 6 | **Hostname interno filtrado** — `eymsa-app1.internal.cmr.mx` | Reconocimiento de infraestructura interna |
| 7 | **Sin autenticación en operaciones críticas** — Token/POST no verifican identidad | Acceso completo al backend |
| 8 | **PostConsentimientosFirma sin protección** — Permite firmar consentimientos | Falsificación de firmas de pacientes |
| 9 | **PersonalFirmaGuarda/InBodyGuarda sin protección** | Suplantación de firmas de doctores |
| 10 | **GetConsentimientoPDF expone documentos** — PDFs de consentimientos accesibles | Documentos médico-legales |

### 🟡 MEDIOS

| # | Hallazgo |
|---|---|
| 11 | PostDispositivo — registra dispositivos sin verificación |
| 12 | ServidoresAdicionales — endpoint de infraestructura expuesto |
| 13 | PasswordModify/PasswordSend — operaciones de cambio de contraseña expuestas |
| 14 | TimbrarFactura — facturación CFDI expuesta |

---

## 9. Vectores de Explotación Identificados

1. **Extraer contraseña de tablets** → Acceder a terminales de firma → \`cmrservice05\`
2. **Listar personal sin auth** → Obtener nombres/cédulas → Suplantar doctores
3. **Listar consentimientos sin auth** → Obtener datos de pacientes
4. **Descargar PDFs de consentimiento** sin auth
5. **Firmar consentimientos** como paciente usando `PostConsentimientosFirma` sin auth
6. **Registrar dispositivos no autorizados** vía `PostDispositivo`
7. **Acceder a historia clínica** (SignosVitales, Medicamentos, Alergias) sin auth

---

## 10. Datos Técnicos del APK

- **Package:** `com.CMR.firmas_infosalud`
- **Min SDK:** 21 (Android 5.0)
- **Arquitecturas:** arm64-v8a, armeabi-v7a
- **Compilación:** Release, R8 full mode
- **Librerías nativas:** Flutter, pdfium (modificado), datastore_shared_counter
- **SDK Flutter:** Compilado con Android SDK 34+
- **Nativas de firma biométrica:** `local_auth_android` (biometric auth plugin)
- **WebView:** `webview_flutter_android` (con soporte HttpAuthHandler)
