# Informe de Análisis — Clínica Abreu XAPK

**Fecha**: 14 Julio 2026
**Archivo**: `/root/bounty/abreu.xapk`
**App**: Abreu v2.6.3 (code 56) — `com.CMR.emesalud_abreu`
**Framework**: Flutter (Dart → AOT native ARM64)
**Backend**: CEDISA / IDigitales HIS (NO Wix)
**Desarrollador**: CMR (emsalud)

---

## 1. Estructura del XAPK

| Archivo | Tamaño | Propósito |
|---|---|---|
| `com.CMR.emesalud_abreu.apk` | 10.2 MB | APK base (Flutter shell + assets) |
| `config.arm64_v8a.apk` | 25.5 MB | Librerías nativas ARM64 |
| `config.en.apk` | 25 KB | Recursos inglés |
| `config.fr.apk` | 21 KB | Recursos francés |
| `config.xxhdpi.apk` | 26 KB | Recursos pantalla densa |
| `icon.png` | 6.7 KB | Icono |
| `manifest.json` | 998 B | Metadatos XAPK |

## 2. AndroidManifest — Permisos

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.VIBRATE"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="com.CMR.emesalud_abreu.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"/>
<uses-permission android:name="com.android.vending.CHECK_LICENSE"/>
```

**⚠️ Crítico**: `android:usesCleartextTraffic="true"` — tráfico HTTP plano permitido.
**Protección**: PairIP SDK (`com.pairip.licensecheck`) para protección de licencia.

**Activities**:
- `com.CMR.emesalud_abreu.MainActivity` (Flutter, launcher)
- `io.flutter.plugins.urllauncher.WebViewActivity` (URLs externas)
- `com.pairip.licensecheck.LicenseActivity` (licencia)

## 3. Configuración (configuration.yaml)

Extraído de: `assets/flutter_assets/assets/hospital/configuration.yaml`

```yaml
androidAppId: com.CMR.emesalud_abreu
iosAppId: com.CMR.emesalud.abreu
name: Clínica Abreu
nameShort: Abreu
webpage: https://www.clinicaabreu.com.do/
ip: resultados.clinicaabreu.com.do
usesHttps: true
contact_telephone: 809 688 4411
contact_email: informacion@clinicaabreu.com.do
contact_address: Arzobispo Portes Santo Domingo, Santo Domingo, 10208
baseUrl: /HisWebServicios/Portal/ServicioPortal.svc
baseUrlPACS: /visorhtml5/WcfServiceIconos/Service1.svc
baseVisorPACS: /WebUltimateGL/App/Vistas/index.html
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

## 4. API Endpoints

### 4.1 Servidores Confirmados (RESPONDEN)

| URL | IP | Tecnología |
|---|---|---|
| `https://resultados.clinicaabreu.com.do/` | **190.167.33.178** | IIS / WCF .NET |
| `https://resultados.clinicaabreu.com.do/HisWebServicios/Portal/ServicioPortal.svc` | 190.167.33.178 | **WCF .NET** — "ServicioPortal Service" |
| `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales` | **66.98.69.202** | CEDISA hosting |

### 4.2 URLs Internas Filtradas

| URL | Contexto |
|---|---|
| `https://srv-recvoz.cmr.local/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales` | **Servidor interno CMR** (filtrado en respuesta 302) |

### 4.3 Endpoints WSDL (WCF SOAP) — ~50+ operaciones

**Servicio**: `IServicioPortal` — Namespace: `http://tempuri.org/`
**Namespace datos**: `http://schemas.datacontract.org/2004/07/IDigitales.HIS.Web.Servicios.Portal`
**Backend**: **IDigitales.HIS.Web.Servicios.Portal** (Sistema HIS de CEDISA)

#### Autenticación
| Operación | Descripción | Parámetros |
|---|---|---|
| `Token` | Login usuario/contraseña → token | `username`, `password` |
| `TokenByCredential` | Login por tipo credencial | `username`, `password`, `credencial` (int) |
| `PasswordModify` | Cambiar contraseña | `newPassword`, `correo`, `inmediato` |
| `PasswordSend` | Recuperar contraseña | `correo`, `inmediato` |

#### Paciente / Expediente
| Operación | Descripción |
|---|---|
| `Paciente` | Datos del paciente |
| `Folio` | Número de folio |
| `FotoPaciente` | Foto del paciente |
| `EditContactInfo` | Editar contacto (tel, email) |
| `GetPacienteByFolio` | Buscar paciente por folio |
| `GetPacienteSolicitudes` | Solicitudes del paciente |
| `ActualizaPaciente` | Actualizar datos paciente |
| `GetInformacionCuenta` | Información de cuenta |

#### Imagenología (PACS)
| Operación | Descripción |
|---|---|
| `ImagingAnalysisList` | Lista análisis imagenología |
| `ImagingAnalysisListWithToken` | Lista análisis con token |
| `ImagingAnalysisByEmpresa` | Análisis por empresa (rango fechas) |
| `EstudiosImagenologia` | Estudios de imagenología |
| `SerieDataImagenologia` | Series DICOM por folio |
| `SolicitudesImagenologia` | Solicitudes pendientes |
| `ImagingReport` | Reporte (token, folio, región) → stream PDF |
| `ImagingReportFull` | Reporte completo PDF |
| `ImagingReportRegions` | Regiones del reporte |
| `ImagingAnalysisCatalog` | Catálogo de análisis con filtro |
| `ImagingAvailableAppointments` | Citas disponibles |
| `ImagingAvailableAppointmentsDay` | Citas por día |
| `MakeAppointment` | Crear cita (JSON) |
| `ReporteImagen` | Reporte imagen por folioEstudio |

#### Patología
| Operación | Descripción |
|---|---|
| `PathologyAnalysisList` | Lista análisis patología |
| `PathologyImage` | Imagen patología por ID |
| `ReportePatologia` | Reporte patología PDF |
| `EstudiosPatologia` | Estudios de patología |
| `ImagenPatologia` | Imagen por ruta |

#### Laboratorio
| Operación | Descripción |
|---|---|
| `LaboratoryAnalysisList` | Lista análisis laboratorio |
| `AnalysisCount` | Conteo de análisis |

#### Historial Clínico
| Operación | Descripción |
|---|---|
| `SignosVitales` | Signos vitales |
| `Medicamentos` | Medicamentos |
| `Alergias` | Alergias |
| `HistoriaFamiliar` | Historia familiar |
| `Dietas` | Dietas |
| `NotasMedicas` | Notas médicas |
| `Internamientos` | Hospitalizaciones |

#### Facturación (SAT México)
| Operación | Descripción |
|---|---|
| `EstadoCuentaFacturasPlan` | Estado de cuenta PDF |
| `ObtieneInformacionEstadisticaCuentasCobrar` | Estadísticas cuentas cobrar |
| `GetListaFacturas` | Lista de facturas |
| `TimbrarFactura` | Timbrar CFDI (SAT México) |
| `EnviarFacturaCorreo` | Enviar factura por correo |
| `DescargarArchivosFactura` | Descargar XML/PDF factura |

#### Catálogos
| Operación | Descripción |
|---|---|
| `GetSucursales` | Sucursales |
| `GetModalidadesSucursales` | Modalidades por sucursal |
| `GetEstudiosModalidad` | Estudios por modalidad |
| `GetHorariosDisponiblesModalidad` | Horarios disponibles |
| `SetSolicitudesEstudios` | Solicitar estudios |
| `SetNuevaCitaSinPaciente` | Nueva cita sin paciente |
| `GetCatalogoPaisesLada` | Países y códigos Lada |
| `GetCatalogoPlanesAseguramiento` | Planes de aseguramiento |
| `GetCatalogoEntidades` | Entidades (México SAT) |
| `GetCatalogoMunicipios` | Municipios |
| `GetCatalogoCodigosPostales` | Códigos postales |
| `GetCatalogoRegimenFiscal` | Régimen fiscal SAT |
| `GetCatalogoUsosCFDI` | Usos CFDI SAT |
| `GetCatalogoFormasPagoSAT` | Formas de pago SAT |

#### Consentimientos
| Operación | Descripción |
|---|---|
| `GetConsentimientoPDF` | PDF consentimiento por ID |
| `GetConsentimientosLista` | Lista consentimientos |
| `PostConsentimientosFirma` | Firmar consentimiento |
| `GetCamposFormularioConsentimiento` | Campos formulario |
| `PostGuardarDatosFormularioConsentimiento` | Guardar formulario |
| `GetContrasenaTabletas` | Contraseña tabletas |

#### Documentos / Notificaciones
| Operación | Descripción |
|---|---|
| `GetDocumento` | Documento |
| `GetPatientDocuments` | Documentos del paciente |
| `GetStudyDocuments` | Documentos del estudio |
| `EnviarNotificacion` | Enviar notificación push |
| `HandleOptionsRequest` | CORS preflight |

#### Personal
| Operación | Descripción |
|---|---|
| `PersonalRecuperar` | Buscar personal |
| `PersonalFirmaGuarda` | Guardar firma |
| `PersonalFirmaRecupera` | Recuperar firma |
| `PersonalFirmaInBodyGuarda` | Guardar firma in-body |

#### Infraestructura
| Operación | Descripción |
|---|---|
| `ServidoresAdicionales` | Servidores adicionales |
| `HomePageData` | Datos homepage |
| `Empresa` | Datos empresa |
| `Ping` | Health check |
| `GetIdPaisHospital` | ID país del hospital |

### 4.4 Endpoints Adicionales desde Dart

| Path | Descripción |
|---|---|
| `/FotoPaciente` | Foto del paciente (HTTP GET) |
| `/GetIconPortal` | Icono portal |
| `/visorhtml5/WcfServiceIconos/Service1.svc` | PACS WCF (iconos) |
| `/WebUltimateGL/App/Vistas/index.html` | Visor PACS web |

## 5. Secrets y API Keys

- **`debugMode: true`** — Modo debug activo en producción
- No se encontraron API keys de terceros (Google Maps, Firebase, etc.)
- Sin hardcodeo de tokens JWT o secrets de OAuth
- Autenticación: Login via `Token(username, password)` → string token
- `com.android.vending.CHECK_LICENSE` — Verificación licencia Google Play

## 6. Patrones de Autenticación

1. **SOAP Login**: `Token(username, password)` → token string
2. **SOAP Login alternativo**: `TokenByCredential(username, password, credencial)` — soporta múltiples tipos de credencial
3. **Bearer tokens**: Código Dart reference a `Authorization` header y `Bearer`
4. **Token en URL**: `ImagingAnalysisListWithToken(token)`, `ImagingReport(token, folio, region)`
5. **Password recovery**: `PasswordModify(newPassword, correo)`, `PasswordSend(correo)`
6. **Sin HMAC ni Basic Auth hardcodeados**

## 7. Estructura del Backend

```
CLÍNICA ABREU APP (Flutter)
├── resultados.clinicaabreu.com.do (190.167.33.178) ← CEDISA hosting principal
│   └── HisWebServicios/Portal/ServicioPortal.svc ← WCF .NET (IIS)
│       ├── Token / TokenByCredential (Auth)
│       ├── Paciente / Folio / FotoPaciente (Paciente)
│       ├── ImagingAnalysisList / ImagingReport (PACS)
│       ├── PathologyAnalysisList / ReportePatologia (Patología)
│       ├── LaboratoryAnalysisList (Laboratorio)
│       ├── SignosVitales / Medicamentos / Alergias (Expediente)
│       ├── GetSucursales / GetEstudiosModalidad (Catálogos)
│       ├── TimbrarFactura / GetListaFacturas (SAT CFDI México)
│       └── ServidoresAdicionales (Discovery)
│
├── portalresultados.cedisa.do (66.98.69.202) ← Backend CEDISA
│   └── HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales
│
├── srv-recvoz.cmr.local ← INTERNO (red local CMR)
│   └── HisWebServicios/Portal/ServicioPortal.svc
│
├── Visor PACS:
│   ├── resultados.clinicaabreu.com.do/visorhtml5/WcfServiceIconos/Service1.svc
│   └── resultados.clinicaabreu.com.do/WebUltimateGL/App/Vistas/index.html
│
└── Librerías nativas:
    ├── libapp.so (7.8 MB) — Lógica Dart compilada AOT
    ├── libflutter.so (10.1 MB) — Engine Flutter
    ├── libjniPdfium.so + libmodpdfium.so (~5 MB) — Visor PDF
    └── libc++_shared.so (1 MB) — C++ runtime
```

## 8. Confirmación: ¿Wix o Backend Propio?

**NO usa Wix.** El NSI Threat Intel reportó Wix como plataforma web pública, pero la app móvil usa un backend **propio**:

| Aspecto | Hallazgo |
|---|---|
| Backend | **IDigitales HIS** (WCF .NET) en servidores CEDISA |
| Framework | **Flutter** → comunicación SOAP/XML |
| API | **WCF SOAP** (~70 operaciones RESTful) |
| Hosting | **CEDISA** (portalresultados.cedisa.do) |
| Dominio app | `resultados.clinicaabreu.com.do` (190.167.33.178) |
| Interno | `srv-recvoz.cmr.local` (red CMR) |

**Conclusión**: Clínica Abreu terceriza su app mobile a **CMR Salud (emsalud)**, que a su vez usa **CEDISA (IDigitales)** para el backend HIS. El sitio web público (`clinicaabreu.com.do`) puede estar en Wix, pero la app móvil tiene su propia infraestructura completamente separada.

## 9. Hallazgos de Seguridad

| Severidad | Hallazgo |
|---|---|
| 🔴 **ALTO** | `usesCleartextTraffic="true"` — HTTP plano permitido |
| 🔴 **ALTO** | `debugMode: true` en configuración de producción |
| 🟡 **MEDIO** | Servidor interno `srv-recvoz.cmr.local` expuesto en respuesta 302 |
| 🟡 **MEDIO** | WSDL público expone todas las operaciones sin autenticación |
| 🟡 **MEDIO** | Sin rate limiting visible en endpoints |
| 🟢 **INFO** | Sin API keys de terceros hardcodeadas |
| 🟢 **INFO** | PairIP SDK para protección de licencia |
| 🟢 **INFO** | SAT CFDI endpoints sugieren facturación México |

## 10. Archivos Generados

- `/root/bounty/abreu-extract/` — Extracción completa del XAPK
- `/root/bounty/abreu-extract/configuration.yaml` — Config de la app
- `/root/bounty/abreu-extract/AndroidManifest_clean.xml` — Manifest decodificado
- `/root/bounty/abreu-extract/apk_full/` — APK base completo
- `/root/bounty/abreu-extract/native_so/lib/arm64-v8a/libapp.so` — Código Dart compilado
