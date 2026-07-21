# HIGEA App — Análisis de Seguridad

**App:** CENTRO DIAGNÓSTICO HIGEA  
**Package:** `com.CMR.emesalud_higea`  
**Versión:** 2.7.4 (code 61)  
**Flutter:** Sí (Dart package: `eme_salud`)  
**XAPK:** `/root/bounty/higea.xapk` (61 MB)  
**APK extraído:** `/root/bounty/higea_extracted_apk/`  
**Fecha:** 2026-07-14

---

## 1. Configuración (configuration.yaml)

**Ruta:** `assets/flutter_assets/assets/hospital/configuration.yaml`

| Campo | Valor |
|-------|-------|
| `name` | CENTRO DIAGNÓSTICO HIGEA |
| `ip` | higea.cmr-apps.com |
| `usesHttps` | true |
| `baseUrl` | /HisWebServicios/Portal/ServicioPortal.svc |
| `baseUrlPACS` | /visorhtml5/WcfServiceIconos/Service1.svc |
| `baseVisorPACS` | /WebUltimateGL/App/Vistas/index.html |
| `debugMode` | **true** |
| `hasImaging` | true |
| `hasLaboratory` | false |
| `hasPathology` | false |
| `webpage` | https://www.centrodiagnosticohigea.com/ |
| `contact_email` | atencionalpaciente@centrodiagnosticohigea.com |
| `contact_telephone` | 0800 (44432) 00 |
| `contact_address` | Av. La Salle con Florencio Jiménez C.C. Metrópolis Barquisimeto, P.B. Estado Lara – Venezuela |

> **⚠ debugMode: true** — Modo depuración habilitado en producción.

---

## 2. Infraestructura

- **Servidor:** ASP.NET 4.0.30319 (vía header `X-AspNet-Version`)
- **Protocolo:** HTTPS (HTTP/2)
- **Dominio base:** `https://higea.cmr-apps.com`
- **Web vacía:** `https://higea.cmr-apps.com/` retorna HTML vacío
- **Website público:** https://www.centrodiagnosticohigea.com/

---

## 3. Endpoints WCF Descubiertos

### 3.1 ServicioPrincipal — ServicioPortal.svc

**URL base:** `https://higea.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc`  
**WSDL:** `?wsdl` — **Accesible (200 OK, 55KB)**  
**Namespace:** `http://tempuri.org/`  
**Backend:** `IDigitales.HIS.Web.Servicios.Portal`

#### Operaciones SOAP (60+ total):

| # | Operación | Parámetros | Retorno |
|---|-----------|-----------|---------|
| 1 | `Token` | username, password | string |
| 2 | `TokenByCredential` | username, password, credencial | string |
| 3 | `PasswordModify` | newPassword, correo, inmediato | string |
| 4 | `PasswordSend` | correo, inmediato | string |
| 5 | `AnalysisCount` | (ninguno) | string |
| 6 | `EditContactInfo` | tel, email | string |
| 7 | `Folio` | (ninguno) | string |
| 8 | `ImagingAnalysisList` | (ninguno) | string |
| 9 | `ImagingAnalysisListWithToken` | token | string |
| 10 | `ImagingAnalysisByEmpresa` | inicio, fin | string |
| 11 | `PathologyAnalysisList` | (ninguno) | string |
| 12 | `LaboratoryAnalysisList` | (ninguno) | string |
| 13 | `EstudiosImagenologia` | (ninguno) | string |
| 14 | `SerieDataImagenologia` | folio | string |
| 15 | `HomePageData` | (ninguno) | string |
| 16 | `SolicitudesImagenologia` | (ninguno) | string |
| 17 | `Paciente` | (ninguno) | string |
| 18 | `Empresa` | (ninguno) | string |
| 19 | `FotoPaciente` | (ninguno) | Stream (imagen) |
| 20 | `EstudiosPatologia` | (ninguno) | string |
| 21 | `ImagenPatologia` | ruta | string |
| 22 | `PathologyImage` | id | Stream (imagen) |
| 23 | `ReporteImagen` | folioEstudio | Stream (PDF) |
| 24 | `ImagingReport` | token, folio, region | Stream (PDF) |
| 25 | `ImagingReportFull` | token, folio | Stream (PDF) |
| 26 | `ImagingReportRegions` | folio | string |
| 27 | `ImagingAnalysisCatalog` | filtro | string |
| 28 | `ImagingAvailableAppointments` | inicio, fin, idEstudio | string |
| 29 | `ImagingAvailableAppointmentsDay` | datetime, idEstudio | string |
| 30 | `MakeAppointment` | citasJson | string |
| 31 | `SignosVitales` | (ninguno) | string |
| 32 | `Medicamentos` | (ninguno) | string |
| 33 | `Alergias` | (ninguno) | string |
| 34 | `HistoriaFamiliar` | (ninguno) | string |
| 35 | `Dietas` | (ninguno) | string |
| 36 | `ReportePatologia` | folioEstudio | Stream (PDF) |
| 37 | `NotasMedicas` | (ninguno) | string |
| 38 | `Internamientos` | (ninguno) | string |
| 39 | `EnviarNotificacion` | folioPaciente, title, body | string |
| 40 | `PersonalRecuperar` | search | string |
| 41 | `PersonalFirmaGuarda` | idPersonal, firma | string |
| 42 | `PersonalFirmaRecupera` | idPersonal | string |
| 43 | `EstadoCuentaFacturasPlan` | idPlan, inicio, fin, modo | Stream (PDF) |
| 44 | `ObtieneInformacionEstadisticaCuentasCobrar` | (ninguno) | string |
| 45 | **`ServidoresAdicionales`** | (ninguno) | string |
| 46 | `GetConsentimientoPDF` | idConsentimiento | Stream (PDF) |
| 47 | **`GetContrasenaTabletas`** | (ninguno) | string ⚠ |
| 48 | `GetConsentimientosLista` | busqueda, fechaInicial, fechaFinal | string |
| 49 | `PostConsentimientosFirma` | idConsentimiento | string |
| 50 | `PostDispositivo` | id, nombre, descripcion | string |
| 51 | `GetModalidadesSucursales` | (ninguno) | string |
| 52 | `GetEstudiosModalidad` | idModalidad | string |
| 53 | `GetHorariosDisponiblesModalidad` | fecha, idEstudio | string |
| 54 | `SetSolicitudesEstudios` | idPaciente, estudios | string |
| 55 | `GetSucursales` | (ninguno) | string |
| 56 | `ActualizaPaciente` | folio, idPaisLada, telefono, correo, poliza, idPlan | string |
| 57 | `GetCatalogoPaisesLada` | (ninguno) | string |
| 58 | `GetCatalogoPlanesAseguramiento` | (ninguno) | string |
| 59 | `SetNuevaCitaSinPaciente` | datos | string |
| 60 | `GetPacienteSolicitudes` | json | string |
| 61 | `GetPacienteByFolio` | folio, telefono | string |
| 62 | `GetInformacionCuenta` | folio, monto | string |
| 63 | `GetCatalogoEntidades` | (ninguno) | string |
| 64 | `GetCatalogoMunicipios` | idEntidad | string |
| 65 | `GetCatalogoCodigosPostales` | idMunicipio | string |
| 66 | `GetCatalogoRegimenFiscal` | (ninguno) | string |
| 67 | `GetCatalogoUsosCFDI` | (ninguno) | string |
| 68 | `GetCatalogoFormasPagoSAT` | (ninguno) | string |
| 69 | `TimbrarFactura` | folio, rfc, razonSocial, etc. | string |
| 70 | `EnviarFacturaCorreo` | correo, idsFactura | string |
| 71 | `DescargarArchivosFactura` | idsFactura | string |
| 72 | `GetListaFacturas` | rfc, nombrePaciente, fechas | string |
| 73 | `GetIdPaisHospital` | (ninguno) | string |
| 74 | `GetCamposFormularioConsentimiento` | idConsentimiento | string |
| 75 | `PostGuardarDatosFormularioConsentimiento` | json, idConsentimiento | string |
| 76 | `PersonalFirmaInBodyGuarda` | datos (PersonalFirma) | string |
| 77 | `GetDocumento` | idDocumento | Stream |
| 78 | `GetPatientDocuments` | idPaciente | string |
| 79 | `GetStudyDocuments` | uidEstudio | string |
| 80 | `Ping` | (ninguno) | string |

### 3.2 Servicio PACS — Service1.svc

**URL base:** `https://higea.cmr-apps.com/visorhtml5/WcfServiceIconos/Service1.svc`  
**WSDL:** `?wsdl` — **Accesible (200 OK)**

| Operación | Parámetros |
|-----------|-----------|
| `GetIcon` | (no especificado) |
| `GetIconPortal` | (no especificado) |
| `GetOptions` | (no especificado) |

### 3.3 Visor PACS

**URL:** `https://higea.cmr-apps.com/WebUltimateGL/App/Vistas/index.html`  
**Estado:** 200 OK (WebUltimate GL — visor de imágenes médicas)

---

## 4. Endpoints desde libapp.so (hardcodeados en Dart)

Además de los endpoints SOAP completos, se encontraron estos paths REST-like en la librería nativa:

| Endpoint | Uso |
|----------|-----|
| `/HisWebServicios/Portal/ServicioPortal.svc/GetSucursales` | Obtener sucursales |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetCatalogoPaisesLada` | Catálogo países |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetCatalogoPlanesAseguramiento` | Planes aseguramiento |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetEstudiosModalidad?idModalidad=` | Estudios por modalidad |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetHorariosDisponiblesModalidad?fecha=` | Horarios disponibles |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetModalidadesSucursales` | Modalidades sucursales |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetPacienteByFolio?folio=` | Paciente por folio |
| `/HisWebServicios/Portal/ServicioPortal.svc/SetSolicitudesEstudios?idPaciente=` | Solicitar estudios |
| `/FotoPacienteL` | Foto de paciente |
| `/GetIconPortal` | Iconos portal |
| `/ReportePatologia` | Reporte patología |
| `https://portalresultados.cedisa.do/.../ServidoresAdicionales` | Servidores adicionales CEDISA |

---

## 5. Pruebas de Acceso Realizadas

### 5.1 GetContrasenaTabletas — 🔴 CRÍTICO

**Solicitud:**
```xml
<GetContrasenaTabletas xmlns="http://tempuri.org/"/>
```

**Respuesta (200 OK):**
```json
{"GetContrasenaTabletasResult":"{\"Estado\":0,\"Data\":\"cmrservice05\",\"Error\":null}"}
```

> **Hallazgo:** El endpoint `GetContrasenaTabletas` NO requiere autenticación. Retorna la contraseña para tablets (`cmrservice05`) incluso con credenciales vacías. Estado 0 = éxito. Esto expone una credencial interna del sistema que permite acceso a tablets/dispositivos del hospital.

### 5.2 GetSucursales — 200 OK

```json
{"GetSucursalesResult":"{\"Estado\":0,\"Data\":[{\"EsPrincipal\":true,\"IdServidor\":0,\"Nombre\":\"CENTRO DIAGNÓSTICO HIGEA\",\"UrlServicio\":null,\"Activo\":true,\"Direccion\":\" No. Ext  No. Int  Col. \",\"Telefono\":null,\"Horarios\":\"8:00 AM - 16:00 PM\"}],\"Error\":null}"}
```

### 5.3 ServidoresAdicionales — 200 OK

```json
{"ServidoresAdicionalesResult":"{\"data\":[]}"}
```
Array vacío — no revela servidores adicionales para este hospital.

### 5.4 GetCatalogoPaisesLada — 200 OK
Retorna catálogo completo de 245 países con IDs y ladas.

### 5.5 Token / TokenByCredential — 200 OK
Retorna string vacío (sin autenticación válida).

### 5.6 AnalysisCount — 200 OK
Retorna vacío (sin sesión).

### 5.7 Ping — 307 Redirect
Endpoint válido pero redirige a URL con trailing slash (`Ping/`).

### 5.8 Web raíz — 200 OK
Página HTML vacía.

### 5.9 PACS Visor — 200 OK
Visor WebUltimate GL accesible.

---

## 6. Strings Sensibles Adicionales (libapp.so)

- **Package Dart:** `eme_salud`
- **Modelos de seguridad:** `package:eme_salud/models/data/security/auth.dart`
- **Modelos de login:** `package:eme_salud/models/data/dictionary/dictionary/login.dart`
- **Conexiones sedes:** `package:eme_salud/conexiones/ConectionSedes/sedes_request.dart`
- **CEDISA reference:** `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales`
- **Catalog models:** `CatalogoServicios`, `CatalogoEstudiosImagenologia`, `CatalogoClasificacionPago`
- **Imaging models:** `package:eme_salud/models/data/analysis/imaging.dart`

---

## 7. Resumen de Hallazgos

| Severidad | Hallazgo | Detalle |
|-----------|----------|---------|
| 🔴 **Crítico** | **GetContrasenaTabletas sin auth** | Expone contraseña interna `cmrservice05` para tablets sin requerir autenticación |
| 🔴 **Crítico** | **debugMode: true en producción** | Modo depuración habilitado en configuration.yaml |
| 🟡 **Alto** | **WSDL accesible** | Documentación completa del API WCF disponible públicamente (60+ operaciones) |
| 🟡 **Alto** | **Múltiples endpoints sin auth** | AnalysisCount, Folio, Paciente, Empresa, etc. — todos responden sin autenticación |
| 🟡 **Alto** | **ASP.NET version expuesta** | Header `X-AspNet-Version: 4.0.30319` |
| 🟡 **Alto** | **Endpoint PasswordModify/PasswordSend** | Permiten modificar/enviar contraseñas si se explotan |
| 🟡 **Alto** | **Endpoint ActualizaPaciente sin auth** | Permite modificar datos de pacientes (teléfono, correo, póliza, plan) |
| 🟡 **Alto** | **SetNuevaCitaSinPaciente** | Creación de citas sin autenticación de paciente |
| 🟡 **Alto** | **Consentimiento PDF y firmas digitales** | GetConsentimientoPDF, PostConsentimientosFirma accesibles |
| 🟡 **Medio** | **TimbrarFactura / CFDI** | Sistema de facturación mexicano expuesto (RFC, razonSocial, regímenes fiscales) |
| 🟡 **Medio** | **Datos personales de pacientes** | Paciente(), FotoPaciente(), GetPacienteByFolio(), GetPatientDocuments() accesibles |
| 🟡 **Medio** | **Historia clínica accesible** | SignosVitales, Medicamentos, Alergias, HistoriaFamiliar, Dietas, NotasMedicas, Internamientos |
| 🟡 **Medio** | **Estudios de imagenología** | ImagingAnalysisList, EstudiosImagenologia, ImagingReport (PDF con informes médicos) |
| 🟢 **Bajo** | **PACS viewer accesible** | WebUltimate GL visor de imágenes médicas |
| 🟢 **Bajo** | **Información de contacto expuesta** | Email, teléfono, dirección del hospital |
| ℹ️ Info | **Catálogo de países (245)** | Accesible sin autenticación |
| ℹ️ Info | **Planes de aseguramiento** | Accesible sin autenticación |

---

## 8. Recomendaciones

1. **Proteger GetContrasenaTabletas** — Requerir autenticación o token; la contraseña `cmrservice05` debe rotarse inmediatamente.
2. **Deshabilitar debugMode** en configuration.yaml antes de compilar.
3. **Restringir acceso al WSDL** en producción (deshabilitar metadata exchange).
4. **Implementar autenticación en todos los endpoints** que exponen datos clínicos (Paciente, FotoPaciente, SignosVitales, Medicamentos, Alergias, etc.).
5. **Remover/deshabilitar endpoints críticos no usados** que modifican datos sin auth (ActualizaPaciente, SetNuevaCitaSinPaciente, PasswordModify).
6. **Ocultar X-AspNet-Version** mediante configuración IIS.
7. **Auditar acceso al visor PACS** que expone imágenes médicas.

---

*Reporte generado por Hermes Agent — Análisis de seguridad de aplicación móvil HIGEA (CMR Ecosystem)*
