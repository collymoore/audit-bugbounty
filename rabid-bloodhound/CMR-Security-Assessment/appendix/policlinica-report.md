# Policlínica Metropolitana — Análisis de Seguridad XAPK

**Fecha:** 14 Julio 2026  
**App:** Policlínica Metropolitana (PCM)  
**Package:** `com.CMR.eme_salud_cmr_Policlinica`  
**Versión:** 2.7.2 (código 53)  
**Tipo:** Flutter (CMR HIS)  
**Origen:** ApkPure  

---

## 1. Información General de la App

### configuration.yaml (assets/hospital/)
```yaml
androidAppId: com.CMR.eme_salud_cmr_Policlinica
iosAppId: com.CMR.eme.salud.PCM
name: Policlinica Metropolitana
nameShort: PCM
webpage: https://policlinicametropolitana.org/
ip: www.policlinicametropolitana-apps.com   # ← Resuelve a 187.188.114.79
usesHttps: true
contact_telephone: "5555555555"
contact_email: contacto@cmr3.com
contact_hours: De lunes a viernes de 7 a 20 hrs
contact_address: Revolucion 756
baseUrl: /HisWebServicios/Portal/ServicioPortal.svc
baseUrlPACS: /visorhtml5/WcfServiceIconos/Service1.svc
baseVisorPACS: /WebUltimateGL/App/Vistas/index.html
iconBackgroundColor: "#bee4ed"
debugMode: true          # ← ¡DEBUG HABILITADO!
hasImaging: true
hasLaboratory: false
hasPathology: false
hasDirectory: false
canMakeAppointmets: false
hasBanner: true
hasRecord: false
showAppointments: false
```

### Permisos Android
- `INTERNET`, `WRITE_EXTERNAL_STORAGE`, `READ_EXTERNAL_STORAGE`
- `POST_NOTIFICATIONS`, `VIBRATE`, `ACCESS_NETWORK_STATE`
- `WAKE_LOCK`, `RECEIVE_BOOT_COMPLETED`, `FOREGROUND_SERVICE`

### Stack Tecnológico
- **Frontend:** Flutter (Dart) — Android SDK 35 (target 35, min 21)
- **Backend:** WCF .NET Framework 4.0.30319 (Windows Server / IIS)
- **WebView DICOM:** WebUltimateGL (visor PACS HTML5)
- **PACS Iconos:** WcfServiceIconos/Service1.svc
- **Servidor adicional:** `portalresultados.cedisa.do` (CEDISA, IP: 66.98.69.202)
- **Base de datos:** SQL Server (inferido por namespace `IDigitales.HIS.Web.Servicios.Portal`)

---

## 2. Endpoints Descubiertos

### 2.1 ServicioPrincipal WCF (ServicioPortal.svc)
**URL Base:** `https://www.policlinicametropolitana-apps.com/HisWebServicios/Portal/ServicioPortal.svc`

El WSDL **solo es accesible con `www.`** (sin www devuelve 404).

**58 operaciones expuestas:**

#### Autenticación y Cuenta
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `Token` | username, password | Autenticación |
| `TokenByCredential` | username, password, credencial | Autenticación |
| `PasswordModify` | newPassword, correo, inmediato | Modificación |
| `PasswordSend` | correo, inmediato | Recuperación |

#### Pacientes
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `Paciente` | (ninguno) | Información |
| `GetPacienteByFolio` | folio, telefono | Búsqueda |
| `GetPacienteSolicitudes` | json | Búsqueda |
| `ActualizaPaciente` | folio, idPaisLada, telefono, correo, poliza, idPlan | Modificación |
| `Folio` | (ninguno) | Información |
| `FotoPaciente` | (ninguno) | Stream (imagen) |
| `EditContactInfo` | tel, email | Modificación |

#### Imagenología (DICOM/Radiology)
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `ImagingAnalysisList` | **(ninguno)** | Lista completa |
| `ImagingAnalysisListWithToken` | token | Lista |
| `ImagingAnalysisByEmpresa` | inicio, fin | Lista |
| `ImagingAnalysisCatalog` | filtro | Catálogo |
| `ImagingReport` | token, folio, region | Stream (PDF) |
| `ImagingReportFull` | token, folio | Stream (PDF) |
| `ImagingReportRegions` | folio | Información |
| `EstudiosImagenologia` | (ninguno) | Catálogo |
| `SerieDataImagenologia` | folio | Series DICOM |
| `SolicitudesImagenologia` | (ninguno) | Solicitudes |
| `ReporteImagen` | folioEstudio | Stream |
| `GetIconPortal` | - | Ícono (PACS) |

#### Patología
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `PathologyAnalysisList` | (ninguno) | Lista |
| `PathologyImage` | id | Stream |
| `EstudiosPatologia` | (ninguno) | Catálogo |
| `ImagenPatologia` | ruta | Imagen |
| `ReportePatologia` | folioEstudio | Stream |

#### Laboratorio
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `LaboratoryAnalysisList` | (ninguno) | Lista |

#### Citas
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `ImagingAvailableAppointments` | inicio, fin, idEstudio | Disponibilidad |
| `ImagingAvailableAppointmentsDay` | datetime, idEstudio | Disponibilidad por día |
| `MakeAppointment` | citasJson | Crear cita |
| `SetNuevaCitaSinPaciente` | datos | Crear cita sin paciente |
| `SetSolicitudesEstudios` | idPaciente, estudios | Solicitar estudios |
| `GetModalidadesSucursales` | (ninguno) | Modalidades |
| `GetEstudiosModalidad` | idModalidad | Estudios |
| `GetHorariosDisponiblesModalidad` | fecha, idEstudio | Horarios |
| `GetSucursales` | (ninguno) | Sucursales |

#### Historia Clínica
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `SignosVitales` | (ninguno) | Signos vitales |
| `Medicamentos` | (ninguno) | Medicamentos |
| `Alergias` | (ninguno) | Alergias |
| `HistoriaFamiliar` | (ninguno) | Historia familiar |
| `Dietas` | (ninguno) | Dietas |
| `NotasMedicas` | (ninguno) | Notas médicas |
| `Internamientos` | (ninguno) | Hospitalizaciones |

#### Administrativo / Facturación
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `EstadoCuentaFacturasPlan` | idPlan, inicio, fin, modo | Stream (PDF) |
| `ObtieneInformacionEstadisticaCuentasCobrar` | (ninguno) | Estadísticas |
| `TimbrarFactura` | folio, rfc, razonSocial, regimen, etc. | CFDI |
| `EnviarFacturaCorreo` | correo, idsFactura | Envío |
| `DescargarArchivosFactura` | idsFactura | Descarga |
| `GetListaFacturas` | rfc, nombrePaciente, fechaInicio, fechaFin | Lista |
| `GetInformacionCuenta` | folio, monto | Información |

#### Catálogos / Maestros
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `GetCatalogoPaisesLada` | (ninguno) | Países |
| `GetCatalogoPlanesAseguramiento` | (ninguno) | Planes |
| `GetCatalogoEntidades` | (ninguno) | Entidades (MX) |
| `GetCatalogoMunicipios` | idEntidad | Municipios |
| `GetCatalogoCodigosPostales` | idMunicipio | CP |
| `GetCatalogoRegimenFiscal` | (ninguno) | Regímenes fiscales (MX) |
| `GetCatalogoUsosCFDI` | (ninguno) | Usos CFDI |
| `GetCatalogoFormasPagoSAT` | (ninguno) | Formas pago SAT |
| `GetIdPaisHospital` | (ninguno) | País hospital |

#### Consents / Documentos
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `GetConsentimientoPDF` | idConsentimiento | Stream (PDF) |
| `GetConsentimientosLista` | busqueda, fechaInicial, fechaFinal | Lista |
| `PostConsentimientosFirma` | idConsentimiento | Firma |
| `GetCamposFormularioConsentimiento` | idConsentimiento | Formulario |
| `PostGuardarDatosFormularioConsentimiento` | json, idConsentimiento | Guardar |
| `GetDocumento` | idDocumento | Stream |
| `GetPatientDocuments` | idPaciente | Documentos |
| `GetStudyDocuments` | uidEstudio | Documentos |

#### Personal / Staff / Dispositivos
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `PersonalRecuperar` | search | Búsqueda |
| `PersonalFirmaGuarda` | idPersonal, firma | Guardar firma |
| `PersonalFirmaRecupera` | idPersonal | Recuperar firma |
| `PersonalFirmaInBodyGuarda` | datos | Guardar firma |
| `PostDispositivo` | id, nombre, descripcion | Registrar |
| `EnviarNotificacion` | folioPaciente, title, body | Enviar push |
| `ServidoresAdicionales` | (ninguno) | Servidores extra |

#### Seguridad / Utilidades
| Operación | Parámetros | Tipo |
|-----------|-----------|------|
| `GetContrasenaTabletas` | **(ninguno)** | **CONTRASEÑA PLANA** |
| `HandleOptionsRequest` | (ninguno) | CORS |
| `AnalysisCount` | (ninguno) | Conteo |
| `Ping` | (ninguno) | Health check |
| `HomePageData` | (ninguno) | Datos inicio |

### 2.2 PACS y Visor DICOM
**URLs:**
- `https://www.policlinicametropolitana-apps.com/visorhtml5/WcfServiceIconos/Service1.svc` (WSDL accesible)
- `https://www.policlinicametropolitana-apps.com/WebUltimateGL/App/Vistas/index.html`
- `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc` (mismo WSDL, otra instancia)

**Service1.svc - 3 operaciones:**
- `GetIcon` — Obtener icono DICOM
- `GetIconPortal` — Icono portal
- `GetOptions` — Opciones del visor

---

## 3. Hallazgos CRÍTICOS

### ⚠️ H01 — GetContrasenaTabletas Expone Contraseña en Texto Plano
**Severidad:** **CRÍTICO**  
**Endpoint:** `ServicioPortal.svc/GetContrasenaTabletas`  
**Sin autenticación requerida.**

**Respuesta obtenida:**
```json
{"GetContrasenaTabletasResult":"{\"Estado\":0,\"Data\":\"cmrservice05\",\"Error\":null}"}
```

**Contraseña expuesta:** `cmrservice05`

Cualquier atacante puede obtener esta contraseña de tablets sin credenciales.

### ⚠️ H02 — ImagingAnalysisList Expone Datos DICOM Reales Sin Autenticación
**Severidad:** **CRÍTICO**  
**Endpoint:** `ServicioPortal.svc/ImagingAnalysisList`  
**Sin parámetros, sin auth.**

La respuesta incluye datos reales de pacientes: estudios DICOM (RMN, TAC, Rayos X, Ultrasonido), folios OID (`1.2.840.113619...`), fechas de estudio, modalidades (MR, CT, DX, US, RF), IDs de series, y rutas de acceso a thumbnails/series de imágenes médicas.

### ⚠️ H03 — Múltiples Endpoints Públicos Sin Autenticación
Los siguientes endpoints devuelven datos **sin requerir autenticación**:

| Endpoint | Datos Devueltos |
|----------|----------------|
| `GetSucursales` | Sucursal: Policlínica Metropolitana, teléfono +58-212-9080100 (Venezuela), horarios |
| `GetModalidadesSucursales` | Modalidades de imagenología (RM, CT, etc.) |
| `GetCatalogoPaisesLada` | Todos los países con códigos de área (245 registros) |
| `GetCatalogoPlanesAseguramiento` | Planes de aseguramiento |
| `ServidoresAdicionales` | Lista de servidores adicionales (vacío) |
| `AnalysisCount` | Conteo de análisis |
| `GetIdPaisHospital` | ID del país del hospital |
| `Ping` | Confirmación de servicio activo |

### ⚠️ H04 — WSDL Completamente Accesible
**Severidad:** Media  
**URL:** `https://www.policlinicametropolitana-apps.com/HisWebServicios/Portal/ServicioPortal.svc?wsdl`

El WSDL (55KB) expone todas las operaciones, tipos de datos, y esquemas XSD completos. Permite a cualquier atacante generar clientes SOAP para llamar a cualquier operación.

**Solo accesible con `www.`** — sin `www.` da 404 (configuración de binding incorrecta).

### ⚠️ H05 — debugMode: true en Producción
**Severidad:** Media  
El archivo de configuración tiene `debugMode: true`, lo que en Flutter puede exponer trazas de depuración, stack traces detallados y comportamiento verboso.

### ⚠️ H06 — PasswordSend Reconoce Correos Válidos
**Severidad:** Media  
Endpoint `PasswordSend` — responde con "Correo no válido" vs. respuesta de éxito. Permite enumeración de correos electrónicos registrados.

### ⚠️ H07 — WSDL Duplicado en Servidor CEDISA
**Severidad:** Baja  
Mismo servicio WSDL disponible en `portalresultados.cedisa.do` (IP: 66.98.69.202), ampliando la superficie de ataque.

### ⚠️ H08 — Exposición de Namespace Interno y Tecnologías
**Severidad:** Baja  
- Namespace: `IDigitales.HIS.Web.Servicios.Portal` (revela backend HIS de IDigitales)
- Server: `Microsoft-HTTPAPI/2.0`, `ASP.NET 4.0.30319`
- Sin headers de seguridad (no HSTS, no X-Content-Type-Options)

---

## 4. Pruebas Realizadas

| Prueba | Resultado |
|--------|-----------|
| WSDL sin www | 404 Not Found |
| WSDL con www | ✅ **200 OK** — 55KB, todas las ops |
| GetContrasenaTabletas | ✅ **200 OK** — Contraseña: `cmrservice05` |
| GetSucursales | ✅ **200 OK** — Datos sucursal Venezuela |
| GetModalidadesSucursales | ✅ **200 OK** — Modalidades DICOM |
| GetCatalogoPaisesLada | ✅ **200 OK** — 245 países |
| GetCatalogoPlanesAseguramiento | ✅ **200 OK** — 1 plan |
| ImagingAnalysisList | ✅ **200 OK** — Estudios DICOM reales |
| ServidoresAdicionales | ✅ **200 OK** — Lista vacía |
| AnalysisCount | ✅ **200 OK** — Resultado vacío |
| Ping | ✅ **307** — Healthy |
| Token (creds inválidas) | ✅ **200 OK** — TokenResult vacío |
| Folio | ✅ **200 OK** — FolioResult vacío |
| GetPacienteByFolio | ✅ **200 OK** — Task status |
| PasswordSend | ✅ **200 OK** — "Correo no válido" |
| Service1.svc (PACS) | ✅ **200 OK** — WSDL accesible |
| Visor WebUltimateGL | ✅ **200 OK** — Página HTML cargada |

---

## 5. Resumen de Riesgos

| ID | Hallazgo | Severidad | Estado |
|----|----------|-----------|--------|
| H01 | Contraseña de tablets en texto plano | **CRÍTICO** | ✅ Confirmado |
| H02 | Estudios DICOM sin autenticación | **CRÍTICO** | ✅ Confirmado |
| H03 | Múltiples endpoints públicos | **ALTA** | ✅ Confirmado |
| H04 | WSDL expuesto públicamente | **MEDIA** | ✅ Confirmado |
| H05 | debugMode=true en producción | **MEDIA** | ✅ Confirmado |
| H06 | Enumeración de correos vía PasswordSend | **MEDIA** | ✅ Confirmado |
| H07 | Servicio duplicado en CEDISA | **BAJA** | ✅ Confirmado |
| H08 | Fingerprinting de stack tecnológico | **BAJA** | ✅ Confirmado |

---

## 6. Recomendaciones

1. **CRÍTICO:** Implementar autenticación/autorización en TODOS los endpoints, especialmente `GetContrasenaTabletas` e `ImagingAnalysisList`.
2. **CRÍTICO:** Rotar inmediatamente la contraseña `cmrservice05`.
3. **ALTA:** Restringir acceso al WSDL y endpoints WCF solo a IPs internas o mediante VPN.
4. **MEDIA:** Deshabilitar `debugMode` en producción.
5. **MEDIA:** Implementar headers de seguridad (HSTS, CSP, X-Frame-Options).
6. **MEDIA:** Validar que PasswordSend no permita enumeración de correos.
7. **BAJA:** Revisar binding HTTPS (www vs no-www inconsistente).
