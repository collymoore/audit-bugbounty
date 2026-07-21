# Centro Médico Moderno (CMM) — Análisis de Seguridad de Aplicación Móvil

**Fecha:** 2026-07-14
**App:** CMR Flutter (emesalud_cmm)
**Paquete:** com.CMR.emesalud_cmm
**Host:** resultadosimagenes.cmm.do

---

## 1. INFORMACIÓN GENERAL DE LA APP

### 1.1 Configuration (`configuration.yaml`)
```yaml
androidAppId: com.CMR.emesalud_cmm
name: Centro Médico Moderno
webpage: https://cmm.do/
ip: resultadosimagenes.cmm.do
usesHttps: true
debugMode: true          # [CRÍTICO] Debug habilitado en producción
hasImaging: true
hasLaboratory: false
hasPathology: false
baseUrl: /HisWebServicios/Portal/ServicioPortal.svc
baseUrlPACS: /visorhtml5/WcfServiceIconos/Service1.svc
baseVisorPACS: /WebUltimateGL/App/Vistas/index.html
```

### 1.2 Contacto
- Teléfono: (809) 548-3131
- Email: Plebreault@cmm.do
- Dirección: Av. Charles Sumner Esq. C/ Jose Lopez, Los Prados
- Horario: 24 horas

### 1.3 Framework
- **Framework:** Flutter (Dart)
- **Backend:** WCF (.NET) con REST/JSON (webHttpBinding)
- **App Framework Base:** `eme_salud` — paquete modular para hospitales
- **Plataforma:** Solo Android (sin iOS library)
- **Namespace Backend:** `IDigitales.HIS.Web.Servicios.Portal`
- **Versión Backend:** `IDigitales.HIS.Web.Servicios, Version=0.32.88.0`

---

## 2. ENDPOINTS DEL BACKEND

### 2.1 ServicioPortal.svc (Principal)
**URL Base:** `https://resultadosimagenes.cmm.do/HisWebServicios/Portal/ServicioPortal.svc`

Se accede vía **POST** con `Content-Type: application/json`. Los métodos requieren o no parámetros como `{}`.

#### OPERACIONES PÚBLICAS (Sin autenticación)
| Endpoint | Parámetros | Respuesta |
|---|---|---|
| **Ping** | `{}` | ✅ OK — Versión del servicio |
| **GetSucursales** | `{}` | ✅ OK — Datos de sucursales |
| **GetCatalogoPaisesLada** | `{}` | ✅ OK |
| **GetCatalogoPlanesAseguramiento** | `{}` | ✅ OK |
| **GetModalidadesSucursales** | `{}` | ✅ OK |
| **GetCatalogoEntidades** | `{}` | ✅ OK |
| **GetCatalogoRegimenFiscal** | `{}` | ✅ OK |
| **GetCatalogoUsosCFDI** | `{}` | ✅ OK |
| **GetCatalogoFormasPagoSAT** | `{}` | ✅ OK |
| **GetIdPaisHospital** | `{}` | ✅ OK |
| **HomePageData** | `{}` | ✅ OK |
| **AnalysisCount** | `{}` | ✅ OK |
| **GetEstudiosModalidad** | `{"idModalidad":""}` | ✅ OK |
| **GetContrasenaTabletas** | `{}` | ✅ OK — **[CRÍTICO]** |
| **ServidoresAdicionales** | `{}` | ✅ OK |
| **ImagingAnalysisList** | `{}` | ✅ OK |
| **Folio** | `{}` | ✅ OK |
| **Paciente** | `{}` | ✅ OK |
| **Empresa** | `{}` | ✅ OK |
| **EstudiosImagenologia** | `{}` | ✅ OK |
| **SolicitudesImagenologia** | `{}` | ✅ OK |
| **EstudiosPatologia** | `{}` | ✅ OK |
| **PathologyAnalysisList** | `{}` | ✅ OK |
| **LaboratoryAnalysisList** | `{}` | ✅ OK |
| **SignosVitales** | `{}` | ✅ OK |
| **Medicamentos** | `{}` | ✅ OK |
| **Alergias** | `{}` | ✅ OK |
| **HistoriaFamiliar** | `{}` | ✅ OK |
| **Dietas** | `{}` | ✅ OK |
| **NotasMedicas** | `{}` | ✅ OK |
| **Internamientos** | `{}` | ✅ OK |
| **ObtieneInformacionEstadisticaCuentasCobrar** | `{}` | ✅ OK |
| **HandleOptionsRequest** | `{}` | ✅ OK |

#### OPERACIONES QUE REQUIEREN PARÁMETROS
| Endpoint | Parámetros | Nota |
|---|---|---|
| **Token** | `{"username","password"}` | Auth — retorna vacío si falla |
| **TokenByCredential** | `{"username","password","credencial"}` | Auth por credencial |
| **PasswordModify** | `{"newPassword","correo","inmediato"}` | Cambio de contraseña |
| **PasswordSend** | `{"correo","inmediato"}` | Envío de contraseña |
| **GetPacienteByFolio** | `{"folio","telefono"}` | Búsqueda de paciente |
| **GetPacienteSolicitudes** | `{"json"}` | Solicitudes de paciente |
| **FotoPaciente** | `{}` | Retorna foto del paciente |
| **ActualizaPaciente** | `{"folio","idPaisLada","telefono","correo","poliza","idPlan"}` | Actualiza datos |
| **ImagingAnalysisListWithToken** | `{"token"}` | Requiere token |
| **ImagingAnalysisByEmpresa** | `{"inicio","fin"}` | |
| **ImagingAnalysisCatalog** | `{"filtro"}` | |
| **SerieDataImagenologia** | `{"folio"}` | |
| **ImagingReport** | `{"token","folio","region"}` | Reporte imagen |
| **ImagingReportFull** | `{"token","folio"}` | Reporte completo |
| **ImagingReportRegions** | `{"folio"}` | |
| **ImagingAvailableAppointments** | `{"inicio","fin","idEstudio"}` | Citas disponibles |
| **ImagingAvailableAppointmentsDay** | `{"datetime","idEstudio"}` | |
| **MakeAppointment** | `{"citasJson"}` | Crear cita |
| **SetSolicitudesEstudios** | `{"idPaciente","estudios"}` | Solicitar estudios |
| **SetNuevaCitaSinPaciente** | `{"datos"}` | Cita sin paciente |
| **ReporteImagen** | `{"folioEstudio"}` | Reporte PDF |
| **ReportePatologia** | `{"folioEstudio"}` | Reporte PDF |
| **ImagenPatologia** | `{"ruta"}` | Patología |
| **PathologyImage** | `{"id"}` | Imagen patología |
| **EnviarNotificacion** | `{"folioPaciente","title","body"}` | Enviar push |
| **EditContactInfo** | `{"tel","email"}` | Editar contacto |
| **PersonalRecuperar** | `{"search"}` | Buscar personal |
| **PersonalFirmaGuarda** | `{"idPersonal","firma"}` | Guardar firma |
| **PersonalFirmaRecupera** | `{"idPersonal"}` | Recuperar firma |
| **PersonalFirmaInBodyGuarda** | `{"datos"}` | |
| **EstadoCuentaFacturasPlan** | `{"idPlan","inicio","fin","modo"}` | |
| **GetInformacionCuenta** | `{"folio","monto"}` | |
| **TimbrarFactura** | `{"folio","rfc","razonSocial","idRegimen","idEntidad","idMunicipio","idCodigoPostal","usoCFDI","correo"}` | Facturación CFDI |
| **EnviarFacturaCorreo** | `{"correo","idsFactura"}` | |
| **DescargarArchivosFactura** | `{"idsFactura"}` | |
| **GetListaFacturas** | `{"rfc","nombrePaciente","fechaInicio","fechaFin"}` | |
| **GetCatalogoMunicipios** | `{"idEntidad"}` | |
| **GetCatalogoCodigosPostales** | `{"idMunicipio"}` | |
| **GetConsentimientoPDF** | `{"idConsentimiento"}` | |
| **GetConsentimientosLista** | `{"busqueda","fechaInicial","fechaFinal"}` | |
| **PostConsentimientosFirma** | `{"idConsentimiento"}` | |
| **PostGuardarDatosFormularioConsentimiento** | `{"json","idConsentimiento"}` | |
| **PostDispositivo** | `{"id","nombre","descripcion"}` | |
| **GetCamposFormularioConsentimiento** | `{"idConsentimiento"}` | |
| **GetDocumento** | `{"idDocumento"}` | |
| **GetPatientDocuments** | `{"idPaciente"}` | |
| **GetStudyDocuments** | `{"uidEstudio"}` | |

### 2.2 Service1.svc (PACS Icons)
**URL Base:** `https://resultadosimagenes.cmm.do/visorhtml5/WcfServiceIconos/Service1.svc`
- **GetIcon** — Obtener icono
- **GetIconPortal** — Obtener icono portal
- **GetOptions** — Opciones

### 2.3 Hospitalizacion.svc
**URL:** `https://resultadosimagenes.cmm.do/HisWebServicios/Hospitalizacion.svc`
- **GetOptions**
- **listarpacientes**

### 2.4 ServicioTrabajos.svc
**URL:** `https://resultadosimagenes.cmm.do/HisWebServicios/ServicioTrabajos.svc`
- **GuardaImagenEscaner**
- **ObtieneEtiquetas**

### 2.5 Otros servicios descubiertos
| Servicio | URL |
|---|---|
| ServicioFacturacion | `/HisWebServicios/Facturacion/ServicioFacturacion.svc` |
| Laboratorio | `/HisWebServicios/Integraciones/Laboratorio.svc` |
| Imagenes (Patología) | `/HisWebServicios/Patologia/Imagenes.svc` |
| ServicioIMP | `/HisWebServicios/ServicioIMP.svc` |

### 2.6 Visor PACS (Resultados de imágenes)
**URL:** `https://resultadosimagenes.cmm.do/WebUltimateGL/App/Vistas/index.html`
- Visor WebGL de imágenes médicas
- jQuery, jQuery UI, plugins de imágenes
- Aparentemente público

---

## 3. HALLAZGOS CRÍTICOS

### 🚨 [CRÍTICO] 3.1 — GetContrasenaTabletas Expone Contraseña de Servicio

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/GetContrasenaTabletas`

**No requiere ningún parámetro** (campos vacío `<xs:complexType><xs:sequence/></xs:complexType>`).

**Respuesta confirmada:**
```json
{"GetContrasenaTabletasResult":"{\"Estado\":0,\"Data\":\"cmrservice05\",\"Error\":null}"}
```

**Impacto:** La contraseña de servicio `cmrservice05` está expuesta públicamente sin autenticación. Potencialmente permite acceso a funcionalidades internas del sistema HIS.

---

### 🚨 [CRÍTICO] 3.2 — Directory Listing Habilitado

Los siguientes directorios tienen **listado de directorios habilitado** en IIS:

| Directorio | Contenido |
|---|---|
| `/HisWebServicios/` | ✅ Listado completo |
| `/HisWebServicios/Portal/` | ✅ Solo ServicioPortal.svc |
| `/HisWebServicios/Certificados/` | ✅ Certificado IMSS |
| `/HisWebServicios/Facturacion/` | ✅ ServicioFacturacion.svc |
| `/HisWebServicios/Integraciones/` | ✅ Laboratorio.svc |
| `/HisWebServicios/Patologia/` | ✅ Imagenes.svc |
| `/HisWebServicios/Xml/` | ✅ Subdirectorios |
| `/HisWebServicios/Xml/Enviados/` | ✅ Archivos XML |
| `/HisWebServicios/Xml/Respuesta/` | ✅ Archivos XML |
| `/HisWebServicios/Web%20References/` | ✅ Referencias de servicios web |

**Impacto:** Exposición de estructura del servidor, certificados, y metadatos de integraciones.

---

### 🚨 [CRÍTICO] 3.3 — debugMode: true en Producción

`configuration.yaml` línea 30: `debugMode: true`

La aplicación móvil tiene el modo debug habilitado en producción, confirmado por la clase `DebugConfigurationViewModel` en la app.

---

### ⚠️ [ALTO] 3.4 — Certificado IMSS Expuesto

**Archivo:** `/HisWebServicios/Certificados/csiproveedores.imss.gob.mx.cer`

Certificado digital del Instituto Mexicano del Seguro Social (IMSS) usado para integraciones con servicios gubernamentales mexicanos. Fecha de emisión: 2015, vence 2018 — **expirado** pero aún expuesto en el servidor.

---

### ⚠️ [ALTO] 3.5 — Token Endpoint sin Protección Rate-Limiting

Los endpoints `Token` y `TokenByCredential` aceptan peticiones sin límite de velocidad detectable, permitiendo ataques de fuerza bruta.

---

### ⚠️ [ALTO] 3.6 — Múltiples Servicios WCF sin Autenticación Aparente

Varios métodos WSDL no requieren token/autenticación:
- `GetCatalogoPaisesLada` — datos de países
- `GetCatalogoPlanesAseguramiento` — planes de seguro
- `GetCatalogoRegimenFiscal`, `GetCatalogoUsosCFDI`, `GetCatalogoFormasPagoSAT` — datos fiscales SAT
- `GetSucursales` — datos de sucursales
- `HomePageData`, `AnalysisCount` — datos agregados de pacientes
- `ImagingAnalysisList`, `SolicitudesImagenologia`, `EstudiosImagenologia` — datos de imágenes
- `PathologyAnalysisList`, `LaboratoryAnalysisList` — datos de laboratorio y patología
- `SignosVitales`, `Medicamentos`, `Alergias`, `HistoriaFamiliar`, `Dietas`, `NotasMedicas`, `Internamientos` — datos de pacientes
- `ObtieneInformacionEstadisticaCuentasCobrar` — datos financieros
- `Folio`, `Paciente`, `Empresa` — datos maestros

**Impacto:** Múltiples endpoints expuestos sin autenticación que entregan datos sensibles de pacientes, planes de seguro, y datos financieros.

---

### ℹ️ [MEDIO] 3.7 — Ruta de Código Fuente Expuesta

`Reference.map` revela ruta interna del servidor:
```
C:/Mis Codigos/HIS/ver 1.0/CMR.HIS.WebService.ComunicacionIMP/
```

Además, referencia a Web Service externo: `consultaPAIMP`

---

### ℹ️ [MEDIO] 3.8 — Múltiples Servicios con Operaciones Sensibles

| Servicio | Operaciones |
|---|---|
| Patologia/Imagenes.svc | `GuardarImagen`, `GuardarImagenCamara`, `getMiniaturaPatologia`, `GetImage` |
| ServicioTrabajos.svc | `GuardaImagenEscaner`, `ObtieneEtiquetas` |
| Hospitalizacion.svc | `listarpacientes` |

---

## 4. CLASES FLUTTER ENCONTRADAS (de libapp.so)

### 4.1 Módulos de Conexión
- `package:eme_salud/conexiones/ConectionSedes/sedes_request.dart`
- `package:eme_salud/conexiones/citas/agendar_citas.dart`

### 4.2 Modelos
- `package:eme_salud/models/data/analysis/` — analysis, appointment, imaging, pathology, report, webgl
- `package:eme_salud/models/data/connection/` — analysis, appointments, profile (photo, profile), records, splash
- `package:eme_salud/models/data/security/auth.dart` — autenticación
- `package:eme_salud/models/data/security/profile.dart`
- `package:eme_salud/models/data/records/records.dart`
- `package:eme_salud/models/data/notifications/local.dart`
- `package:eme_salud/models/data/database/database.dart`
- `package:eme_salud/models/data/configuration/configuration.dart`
- `package:eme_salud/models/data/dictionary/` — login, home, profile, records, datetime, expediente, shared
- `package:eme_salud/models/hospital/hospital.dart`

### 4.3 ViewModels
- `DebugConfigurationViewModel` — modo debug
- `AlergieViewModel`, `DietViewModel`, `ImagingAnalysisViewModel`, `ImagingImageViewModel`, `AnalysisViewModel` (records)
- `SplashViewModel`

### 4.4 Vistas
- `LoginPage`, `LoginForm` — login
- `Dashboard` — dashboard principal
- `ImagingAnalysis` — análisis de imágenes
- `AnalysisImage` — visualizador de imágenes
- `Appointments` — citas
- `Profile` — perfil
- `Records` — records médicos (alergias, dietas, notas, recetas, vitales, historial familiar)
- `DebugConfigurationPage` — pantalla de debug

### 4.5 Clases HTTP (Capa de comunicación)
- `HttpSplash`, `HttpBase`, `HttpLogin`, `HttpProfile`
- `HttpAppointments`, `HttpAlergies`, `HttpDiets`, `HttpEditProfile`
- `HttpImagingAnalysisList`, `HttpNotes`, `HttpPathologyAnalysisList`
- `HttpPrescriptions`, `HttpUserPhoto`, `HttpVitalSigns`
- `Auth2`, `TokenResult`, `LoginDict`, `LoginForm`
- `CatalogoServicios`, `CatalogoEstudiosImagenologia2`

---

## 5. RESUMEN DE VULNERABILIDADES

| # | Severidad | Hallazgo |
|---|---|---|
| 3.1 | 🔴 **Crítico** | GetContrasenaTabletas expone contraseña `cmrservice05` sin auth |
| 3.2 | 🔴 **Crítico** | Directory listing habilitado en múltiples directorios |
| 3.3 | 🔴 **Crítico** | debugMode=true en producción |
| 3.4 | 🟠 **Alto** | Certificado IMSS expuesto públicamente |
| 3.5 | 🟠 **Alto** | Sin rate-limiting en endpoint de autenticación |
| 3.6 | 🟠 **Alto** | Múltiples endpoints WCF sin autenticación |
| 3.7 | 🟡 **Medio** | Ruta interna del servidor expuesta |
| 3.8 | 🟡 **Medio** | Operaciones de escritura en servicios de patología/trabajos |

---

## 6. NOTAS ADICIONALES

- **Backend:** WCF .NET Framework con webHttpBinding + JSON
- **Namespace:** `IDigitales.HIS.Web.Servicios.Portal`
- **Versión:** 0.32.88.0
- **Ping Response:** `[ON] IDigitales.HIS.Web.Servicios, Version=0.32.88.0`
- **Servicios Integrados:** Facturación (CFDI SAT México), Laboratorio, Patología, PACS (WebUltimateGL), IMSS México
- **Origen Backend:** `C:/Mis Codigos/HIS/ver 1.0/`
