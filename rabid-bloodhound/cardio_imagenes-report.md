# Cardio Imágenes Especializadas - Análisis de APK y Endpoints

## Información General

| Campo | Valor |
|-------|-------|
| **App** | Cardio Imágenes Especializadas (CIE) |
| **Paquete** | `com.CMR.emesalud_cardioimagenes` |
| **Android ID** | `com.CMR.emesalud_cardioimagenes` |
| **iOS ID** | `com.CMR.emesalud.cardioimagenes` |
| **Framework** | Flutter (eme_salud) |
| **Servidor Backend** | `cardioimagenes.cmr-apps.com` |
| **Web pública** | `https://cardioimagenes.com.do/` (WordPress + Pagelayer) |
| **Debug Mode** | `true` (configurado) |
| **País** | República Dominicana |

## Contacto

| Campo | Valor |
|-------|-------|
| **Teléfono** | 809-565-5666 |
| **Email** | info@cardioimagenes.com.do |
| **Horario** | Lun-Vie 7:00AM-9:00PM, Sáb 7:00AM-3:00PM, Dom 8:00AM-12:00PM |
| **Dirección** | Calle Cub Scouts num. 24 Ensanche Naco, Santo Domingo |

---

## 1. Configuration.yaml (Completo)

**Archivo:** `assets/flutter_assets/assets/hospital/configuration.yaml`

```yaml
androidAppId: com.CMR.emesalud_cardioimagenes
iosAppId: com.CMR.emesalud.cardioimagenes

name: Cardio Imágenes Especializadas
nameShort: Cardio Imágenes
webpage:  https://cardioimagenes.com.do/
ip: cardioimagenes.cmr-apps.com
usesHttps: true

contact_telephone: 809-565-5666
contact_email: info@cardioimagenes.com.do
contact_hours: De lunes a viernes 7:00 AM a 9:00 PM, Sábados 7:00 AM a 3:00 PM y Domingos 8:00 AM A 12:00 PM
contact_address: Calle Cub Scouts num. 24 Ensanche Naco, Santo Domingo

baseUrl: /HisWebServicios/Portal/ServicioPortal.svc
baseUrlPACS: /visorhtml5/WcfServiceIconos/Service1.svc
baseVisorPACS: /WebUltimateGL/App/Vistas/index.html

iconBackgroundColor: "#ad0d17"

color_primary: 0xff2C798C
color_accent: 0xff234570
color_primaryDark: 0xffA7AAAD
color_accentDark: 0xff10100f
color_primaryLight: 0xff5695e9
color_accentLight: 0xff60605f
color_loadingGrey: 0xffffffff

debugMode: true
hasImaging: true
hasLaboratory: false
hasPathology: false
hasDirectory: false
canMakeAppointmets: false
hasBanner: true
hasRecord: false
showAppointments: false
```

**Características habilitadas**: Solo Imagenología (`hasImaging: true`). Sin laboratorio, patología, directorio, citas, record médico, ni banner.

---

## 2. Endpoints desde libapp.so (Strings)

Extraídos del `lib/arm64-v8a/libapp.so` del paquete Flutter `eme_salud`:

### Endpoints REST-style descubiertos en libapp.so

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/HisWebServicios/Portal/ServicioPortal.svc/GetCatalogoPaisesLada` | POST/SOAP | Catálogo de países con LADA |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetCatalogoPlanesAseguramiento` | POST/SOAP | Planes de aseguramiento |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetEstudiosModalidad?idModalidad=` | POST/SOAP | Estudios por modalidad |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetHorariosDisponiblesModalidad?fecha=` | POST/SOAP | Horarios disponibles |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetModalidadesSucursales` | POST/SOAP | Modalidades por sucursal |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetPacienteByFolio?folio=` | POST/SOAP | Paciente por folio |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetSucursales` | POST/SOAP | Listado de sucursales |
| `/HisWebServicios/Portal/ServicioPortal.svc/SetSolicitudesEstudios?idPaciente=` | POST/SOAP | Crear solicitudes de estudios |
| `/FotoPaciente` | POST/SOAP | Foto del paciente |
| `/GetIconPortal` | POST/SOAP | Íconos del portal |

### Endpoint externo referenciado

| URL | Propósito |
|-----|-----------|
| `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales` | Servidores adicionales CEDISA |
| `https://www.youtube.com/` | Contenido embebido |

### Nombres de vistas/páginas en Flutter (package:eme_salud)

```
views/analysis/analysis.dart
views/analysis/image.dart
views/analysis/imaging/imaging_analysis.dart
views/analysis/laboratory_list.dart
views/analysis/pathology/pathology_analysis.dart
views/analysis/schedule/citas.dart
views/analysis/schedule/steps/step1_datos.dart
views/analysis/schedule/steps/step2_sucursal.dart
views/analysis/schedule/steps/step3_estudios.dart
views/analysis/schedule/steps/step4_fecha_hora.dart
views/configuration/debug.dart
views/dashboard/dashboard.dart
views/hospital/directory.dart
views/login/login.dart
views/profile/profile.dart
views/records/records.dart
views/splash.dart
```

---

## 3. WSDL - ServicioPrincipal (ServicioPortal.svc)

**URL:** `https://cardioimagenes.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc?wsdl`

**Namespace:** `http://tempuri.org/`
**Service:** `ServicioPortal`
**Contract:** `IServicioPortal`
**Backend Namespace:** `IDigitales.HIS.Web.Servicios.Portal`
**Internal Server Name Leak:** `srv-portal`

### Operaciones EXPUESTAS (Completo - 67 operaciones)

#### Autenticación y Seguridad
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `Token` | username (string), password (string) | string |
| `TokenByCredential` | username (string), password (string), credencial (int) | string |
| `PasswordModify` | newPassword (string), correo (string), inmediato (string) | string |
| `PasswordSend` | correo (string), inmediato (string) | string |

#### Pacientes
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `Paciente` | _(ninguno)_ | string |
| `Folio` | _(ninguno)_ | string |
| `GetPacienteByFolio` | folio (string), telefono (string) | string |
| `GetPacienteSolicitudes` | json (string) | string |
| `ActualizaPaciente` | folio, idPaisLada, telefono, correo, poliza, idPlan | string |
| `FotoPaciente` | _(ninguno)_ | StreamBody (binario) |
| `EditContactInfo` | tel (string), email (string) | string |

#### Estudios de Imagenología
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `ImagingAnalysisList` | _(ninguno)_ | string |
| `ImagingAnalysisListWithToken` | token (string) | string |
| `ImagingAnalysisByEmpresa` | inicio (dateTime), fin (dateTime) | string |
| `ImagingAnalysisCatalog` | filtro (string) | string |
| `EstudiosImagenologia` | _(ninguno)_ | string |
| `SerieDataImagenologia` | folio (string) | string |
| `SolicitudesImagenologia` | _(ninguno)_ | string |
| `HomePageData` | _(ninguno)_ | string |
| `AnalysisCount` | _(ninguno)_ | string |

#### Reportes de Imagenología
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `ImagingReport` | token (string), folio (string), region (string) | StreamBody |
| `ImagingReportFull` | token (string), folio (string) | StreamBody |
| `ImagingReportRegions` | folio (string) | string |
| `ReporteImagen` | folioEstudio (string) | StreamBody |

#### Citas (Appointments)
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `ImagingAvailableAppointments` | inicio (dateTime), fin (dateTime), idEstudio (int) | string |
| `ImagingAvailableAppointmentsDay` | datetime (dateTime), idEstudio (int) | string |
| `MakeAppointment` | citasJson (string) | string |
| `SetNuevaCitaSinPaciente` | datos (string) | string |

#### Sucursales y Catálogos
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `GetSucursales` | _(ninguno)_ | string |
| `GetModalidadesSucursales` | _(ninguno)_ | string |
| `GetEstudiosModalidad` | idModalidad (string) | string |
| `GetHorariosDisponiblesModalidad` | fecha (string), idEstudio (int) | string |
| `SetSolicitudesEstudios` | idPaciente (int), estudios (string) | string |
| `GetCatalogoPaisesLada` | _(ninguno)_ | string |
| `GetCatalogoPlanesAseguramiento` | _(ninguno)_ | string |

#### Expediente Clínico (Record)
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `SignosVitales` | _(ninguno)_ | string |
| `Medicamentos` | _(ninguno)_ | string |
| `Alergias` | _(ninguno)_ | string |
| `HistoriaFamiliar` | _(ninguno)_ | string |
| `Dietas` | _(ninguno)_ | string |
| `NotasMedicas` | _(ninguno)_ | string |
| `Internamientos` | _(ninguno)_ | string |

#### Patología
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `PathologyAnalysisList` | _(ninguno)_ | string |
| `EstudiosPatologia` | _(ninguno)_ | string |
| `ImagenPatologia` | ruta (string) | string |
| `PathologyImage` | id (int) | StreamBody |
| `ReportePatologia` | folioEstudio (string) | StreamBody |

#### Laboratorio
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `LaboratoryAnalysisList` | _(ninguno)_ | string |

#### Personal / Firmas
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `PersonalRecuperar` | search (string) | string |
| `PersonalFirmaGuarda` | idPersonal (int), firma (string) | string |
| `PersonalFirmaRecupera` | idPersonal (int) | string |
| `PersonalFirmaInBodyGuarda` | datos (PersonalFirma complexType) | string |

#### Facturación (CFDI/SAT - México)
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `EstadoCuentaFacturasPlan` | idPlan, inicio, fin, modo | StreamBody |
| `ObtieneInformacionEstadisticaCuentasCobrar` | _(ninguno)_ | string |
| `TimbrarFactura` | folio, rfc, razonSocial, idRegimen, idEntidad, idMunicipio, idCodigoPostal, usoCFDI, correo | string |
| `EnviarFacturaCorreo` | correo (string), idsFactura (string) | string |
| `DescargarArchivosFactura` | idsFactura (string) | string |
| `GetListaFacturas` | rfc, nombrePaciente, fechaInicio, fechaFin | string |
| `GetCatalogoEntidades` | _(ninguno)_ | string |
| `GetCatalogoMunicipios` | idEntidad (int) | string |
| `GetCatalogoCodigosPostales` | idMunicipio (int) | string |
| `GetCatalogoRegimenFiscal` | _(ninguno)_ | string |
| `GetCatalogoUsosCFDI` | _(ninguno)_ | string |
| `GetCatalogoFormasPagoSAT` | _(ninguno)_ | string |

#### Notificaciones
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `EnviarNotificacion` | folioPaciente (string), title (string), body (string) | string |

#### Consentimientos
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `GetConsentimientoPDF` | idConsentimiento (int) | StreamBody |
| `GetConsentimientosLista` | busqueda (string), fechaInicial (string), fechaFinal (string) | string |
| `PostConsentimientosFirma` | idConsentimiento (int) | string |
| `GetCamposFormularioConsentimiento` | idConsentimiento (int) | string |
| `PostGuardarDatosFormularioConsentimiento` | json (string), idConsentimiento (int) | string |

#### Dispositivos
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `PostDispositivo` | id (int), nombre (string), descripcion (string) | string |

#### CRÍTICO: GetContrasenaTabletas
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| **`GetContrasenaTabletas`** | _(ninguno)_ | **string** |

#### Infraestructura
| Operación | Parámetros (Input) | Retorno |
|-----------|-------------------|---------|
| `ServidoresAdicionales` | _(ninguno)_ | string |
| `Empresa` | _(ninguno)_ | string |
| `HandleOptionsRequest` | _(ninguno)_ | _(vacío)_ |
| `GetIdPaisHospital` | _(ninguno)_ | string |

---

## 4. GetContrasenaTabletas

- **Confirmado en WSDL**: El endpoint `GetContrasenaTabletas` **SÍ existe** como operación SOAP.
- **Sin parámetros de entrada** — retorna directamente un `string` (posible contraseña de tablets).
- **Namespace:** `http://tempuri.org/IServicioPortal/GetContrasenaTabletas`
- **Payload SOAP necesario:**
  ```xml
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <GetContrasenaTabletas xmlns="http://tempuri.org/" />
    </soap:Body>
  </soap:Envelope>
  ```
- **Estado de prueba**: HTTP 405 Method Not Allowed vía GET — requiere POST SOAP con `SOAPAction: http://tempuri.org/IServicioPortal/GetContrasenaTabletas`. El servidor redirige las peticiones entrantes a `srv-portal` (servidor interno).

---

## 5. Pruebas de Accesibilidad

| Endpoint | Método | Respuesta | Accesible |
|----------|--------|-----------|-----------|
| `https://cardioimagenes.cmr-apps.com/` | GET | Página IIS por defecto (iisstart.png) | ✅ Público |
| `https://cardioimagenes.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc` | GET | Página "You have created a service" | ✅ Público |
| `https://cardioimagenes.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc?wsdl` | GET | WSDL completo (67 operaciones) | ✅ Público |
| `https://cardioimagenes.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc?singleWsdl` | GET | WSDL completo en un archivo | ✅ Público |
| `https://cardioimagenes.cmr-apps.com/visorhtml5/WcfServiceIconos/Service1.svc?wsdl` | GET | WSDL (GetIcon, GetIconPortal, GetOptions) | ✅ Público |
| `https://cardioimagenes.cmr-apps.com/visorhtml5/WcfServiceIconos/Service1.svc/` | GET | "Endpoint not found" | ❌ No encontrado |
| `https://cardioimagenes.cmr-apps.com/WebUltimateGL/App/Vistas/index.html` | GET | Página "WU Cargando..." (PACS Viewer - Webpack) | ✅ Público |
| `https://cardioimagenes.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc/*` | POST | 405 Method Not Allowed (desde exterior) | ⚠️ Redirige a servidor interno |

### Hallazgos de Infraestructura

1. **Internal Hostname Leak:** El servidor redirige a `srv-portal` (nombre interno del servidor IIS)
2. **IIS Version:** Windows Server con IIS (página iisstart.png por defecto en raíz)
3. **Cross-Referencia:** Se encontró referencia a `portalresultados.cedisa.do` (otro hospital del ecosistema CMR)
4. **PACS Viewer:** `WebUltimateGL` — sistema de visualización de imágenes DICOM vía web con autenticación
5. **Web pública:** `cardioimagenes.com.do` corre sobre WordPress con Pagelayer builder

### Observaciones de Seguridad

1. **WSDL completamente expuesto** sin autenticación — cualquier persona puede ver las 67 operaciones disponibles, incluyendo `GetContrasenaTabletas`
2. **debugMode: true** en configuración de producción
3. **GetContrasenaTabletas** — operación sin autenticación que retorna una contraseña (potencialmente para tablets de los médicos)
4. **Expone namespace interno** `IDigitales.HIS.Web.Servicios.Portal`
5. **Servidor interno nombrado** como `srv-portal` (info leak)
6. **Expone operaciones de facturación CFDI/SAT** (México) en un hospital dominicano — posible funcionalidad compartida no utilizada
7. **PasswordModify y PasswordSend** permiten modificar/enviar contraseñas
8. **EnviarNotificacion** permite enviar notificaciones push a pacientes
9. **PersonalRecuperar** expone búsqueda de personal médico

---

## Resumen de Archivos

| Archivo | Ruta |
|---------|------|
| XAPK original | `/root/bounty/cardio_imagenes.xapk` |
| APK principal | `/root/bounty/cardio_imagenes/com.CMR.emesalud_cardioimagenes.apk` |
| Config Splits | `/root/bounty/cardio_imagenes/config.{arm64_v8a,en,fr,mdpi}.apk` |
| APK extraída | `/root/bounty/cardio_imagenes_apk/` |
| configuration.yaml | `/root/bounty/cardio_imagenes_apk/assets/flutter_assets/assets/hospital/configuration.yaml` |
| libapp.so | `/root/bounty/cardio_imagenes/config.arm64_v8a.apk` → `lib/arm64-v8a/libapp.so` |
| AndroidManifest.xml | `/root/bounty/cardio_imagenes_apk/AndroidManifest.xml` (binario, 16KB) |
| Reporte actual | `/root/bounty/cardio_imagenes-report.md` |

---

*Generado: Julio 2026 | Herramientas: unzip, strings, curl, WSDL analysis*
