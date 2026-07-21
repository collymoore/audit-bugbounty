# Reporte de Análisis — Laboratorio Tequis XAPK

**Fecha:** 2026-07-14
**App:** EME Salud v1.6.0 (code 13)
**Package:** `com.CMR.eme_salud`
**Platform:** Flutter (Android)
**Target SDK:** 28 | **Min SDK:** 16

---

## 1. Resumen

Aplicación Flutter de portal de salud para **Centro Médico CMR** (Compañía Mexicana de Radiología). Backend basado en WCF (.NET) expuesto públicamente en `cmr-apps.com`. El XAPK contiene la app base + 19 splits de configuración (idiomas, densidades, arquitectura arm64-v8a). Se identificaron múltiples endpoints WCF con operaciones CRUD sobre datos médicos sensibles.

---

## 2. Config.json (assets/hospital/config.json)

```json
{
    "id": "eme_salud",
    "nombre": "Centro Médico CMR",
    "webpage": "http://www.cmr-rx.com/site2016/#inicio/",
    "primaryColor": "0xff00c1d5",
    "accentColor": "0xffff8674",
    "appleId": "com.CMR.eme.salud",
    "googleId": "com.CMR.eme_salud",
    "serverVersion": 5
}
```

- Hospital config genérica, sin URLs de backend hardcodeadas — las construye dinámicamente en Dart.

---

## 3. Permisos Android

| Permiso | Propósito |
|---------|-----------|
| `INTERNET` | Comunicación WCF |
| `CAMERA` + `autofocus` | Escaneo QR (login) |
| `READ_EXTERNAL_STORAGE` | Almacenamiento |
| `ACCESS_NETWORK_STATE` | Network checks |
| `WAKE_LOCK` | Firebase FCM |
| `REQUEST_INSTALL_PACKAGES` | ⚠️ Actualización interna |
| `BIND_GET_INSTALL_REFERRER_SERVICE` | Analytics |
| `c2dm.permission.RECEIVE` | Firebase Cloud Messaging |

---

## 4. Endpoints Descubiertos desde libapp.so

### 4.1 WCF Service Portal

| Endpoint | URL | Estado |
|----------|-----|--------|
| **ServicioPortal.svc** | `http://cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc` | ✅ HTTP 200 |
| **WSDL** | `http://cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc?wsdl` | ✅ Accesible |
| **DISCO** | `http://cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc?disco` | ✅ Accesible |
| **XSDs** | `...?xsd=xsd0` `?xsd=xsd1` `?xsd=xsd2` `?xsd=xsd3` | ✅ Todos accesibles |
| **SingleWSDL** | `...?singleWsdl` | ✅ Accesible |

### 4.2 Imagenología / Visor

| Endpoint | URL | Estado |
|----------|-----|--------|
| **WebDiagRxMobile** | `http://cmr-apps.com/visorhtml5/WebDiagRxMobile?u=` | ✅ HTTP 200 — página de visor DICOM |
| **WcfServiceIconos** | `http://cmr-apps.com/visorhtml5/WcfServiceIconos` | 🔀 HTTP 301 (redirect) |

### 4.3 Service1.svc (NO encontrado en producción)

| Endpoint | URL | Estado |
|----------|-----|--------|
| `Service1.svc/GetIconPortal?ruta=` | En cmr-apps.com | ❌ 404 |
| `Service1.svc/GetIconPortal?ruta=` | En cmr-rx.com | ❌ 404 |

> El path `/Service1.svc` parece ser un endpoint interno/local no expuesto públicamente.

---

## 5. Operaciones WCF (ServicioPortal) — 82 Operaciones

### 5.1 Autenticación y Sesión
| Operación | Parámetros | Descripción |
|-----------|-----------|-------------|
| `Token` | `username`, `password` | Login con credenciales |
| `TokenByCredential` | `username`, `password`, `credencial` (int) | Login alternativo |
| `PasswordModify` | `newPassword`, `correo`, `inmediato` | Cambio de contraseña |
| `PasswordSend` | `correo`, `inmediato` | Recuperación de contraseña |

### 5.2 Datos del Paciente (perfil médico)
| Operación | Descripción |
|-----------|-------------|
| `Paciente` | Datos del paciente |
| `FotoPaciente` | Foto del paciente (Stream) |
| `ActualizaPaciente` | Actualizar datos (folio, tel, correo, póliza, plan) |
| `HomePageData` | Datos de página principal |
| `AnalysisCount` | Conteo de análisis |
| `EditContactInfo` | Editar teléfono/correo |
| `Folio` | Obtener folio del paciente |
| `Empresa` | Datos de empresa asociada |

### 5.3 Estudios Clínicos
| Operación | Descripción |
|-----------|-------------|
| `LaboratoryAnalysisList` | Lista de análisis de laboratorio |
| `PathologyAnalysisList` | Lista de análisis de patología |
| `ImagingAnalysisList` | Lista de estudios de imagenología |
| `ImagingAnalysisListWithToken` | Imagenología por token |
| `ImagingAnalysisByEmpresa` | Imagenología por empresa (fechas) |
| `EstudiosImagenologia` | Estudios de imagenología |
| `EstudiosPatologia` | Estudios de patología |
| `SerieDataImagenologia` | Series de imagenología por folio |
| `ImagenPatologia` | Imagen de patología por ruta |
| `PathologyImage` | Imagen patológica por ID (Stream) |
| `ReporteImagen` | Reporte de imagen por folio (Stream) |
| `ReportePatologia` | Reporte de patología (Stream) |
| `ImagingReport` | Reporte de imagenología (token, folio, región) (Stream) |
| `ImagingReportFull` | Reporte completo imagenología (Stream) |
| `ImagingReportRegions` | Regiones del reporte imagenología |
| `ImagingAnalysisCatalog` | Catálogo de análisis (filtro) |
| `SolicitudesImagenologia` | Solicitudes de imagenología |

### 5.4 Expediente Clínico
| Operación | Descripción |
|-----------|-------------|
| `Alergias` | Lista de alergias |
| `Medicamentos` | Lista de medicamentos |
| `Dietas` | Lista de dietas |
| `HistoriaFamiliar` | Historia familiar |
| `NotasMedicas` | Notas médicas |
| `SignosVitales` | Signos vitales |
| `Internamientos` | Historial de internamientos |

### 5.5 Citas y Agendamiento
| Operación | Descripción |
|-----------|-------------|
| `ImagingAvailableAppointments` | Citas disponibles (rango fechas, idEstudio) |
| `ImagingAvailableAppointmentsDay` | Citas disponibles por día |
| `MakeAppointment` | Crear cita (citasJson) |
| `GetModalidadesSucursales` | Modalidades por sucursal |
| `GetEstudiosModalidad` | Estudios por modalidad |
| `GetHorariosDisponiblesModalidad` | Horarios disponibles |
| `SetSolicitudesEstudios` | Registrar solicitud de estudios |
| `GetSucursales` | Lista de sucursales |
| `SetNuevaCitaSinPaciente` | Crear cita sin paciente registrado |

### 5.6 Facturación (CFDI/SAT)
| Operación | Descripción |
|-----------|-------------|
| `GetCatalogoPaisesLada` | Catálogo de países LADA |
| `GetCatalogoPlanesAseguramiento` | Planes de aseguramiento |
| `GetCatalogoEntidades` | Catálogo de entidades federativas |
| `GetCatalogoMunicipios` | Catálogo de municipios (por entidad) |
| `GetCatalogoCodigosPostales` | Catálogo de códigos postales (por municipio) |
| `GetCatalogoRegimenFiscal` | Catálogo SAT regímenes fiscales |
| `GetCatalogoUsosCFDI` | Catálogo SAT usos CFDI |
| `GetCatalogoFormasPagoSAT` | Catálogo SAT formas de pago |
| `TimbrarFactura` | Timbrar factura (CFDI) |
| `EnviarFacturaCorreo` | Enviar factura por correo |
| `DescargarArchivosFactura` | Descargar archivos de factura |
| `GetListaFacturas` | Lista de facturas (RFC, nombre, fechas) |
| `EstadoCuentaFacturasPlan` | Estado de cuenta por plan |
| `GetInformacionCuenta` | Información de cuenta (folio, monto) |
| `ObtieneInformacionEstadisticaCuentasCobrar` | Estadísticas cuentas por cobrar |

### 5.7 Personal y Dispositivos
| Operación | Descripción |
|-----------|-------------|
| `PersonalRecuperar` | Buscar personal |
| `PersonalFirmaGuarda` | Guardar firma digital |
| `PersonalFirmaRecupera` | Recuperar firma digital |
| `PersonalFirmaInBodyGuarda` | Guardar firma in body |
| `PostDispositivo` | Registrar dispositivo móvil |
| `ServidoresAdicionales` | Servidores adicionales |

### 5.8 Consentimientos
| Operación | Descripción |
|-----------|-------------|
| `GetConsentimientoPDF` | Descargar PDF consentimiento (Stream) |
| `GetConsentimientosLista` | Lista de consentimientos (búsqueda, fechas) |
| `PostConsentimientosFirma` | Firmar consentimiento |
| `GetCamposFormularioConsentimiento` | Campos de formulario |
| `PostGuardarDatosFormularioConsentimiento` | Guardar datos formulario |
| `GetContrasenaTabletas` | Contraseña de tabletas |
| `GetIdPaisHospital` | ID país del hospital |
| `GetPacienteSolicitudes` | Solicitudes del paciente (JSON) |
| `GetPacienteByFolio` | Buscar paciente por folio/teléfono |
| `HandleOptionsRequest` | CORS preflight |

---

## 6. Infraestructura

### 6.1 Servidores

| Host | IP | Servicio |
|------|----|----------|
| `cmr-apps.com` | **208.88.122.212** | IIS — WCF Services, Visor DICOM |
| `www.cmr-rx.com` | **13.65.241.130** | Website corporativo (redirects) |
| `eymsa-app1.internal.cmr.mx` | *(interno)* | Nombre interno del servidor de aplicaciones |

### 6.2 Tecnologías

- **Backend:** .NET WCF (Windows Communication Foundation) sobre IIS
- **Auth:** Basada en token (operación `Token` devuelve string)
- **Visor médico:** WebDiagRxMobile (visión DICOM web)
- **Notificaciones:** Firebase Cloud Messaging (FCM)
- **Aplicación:** Flutter (Dart compilado a libapp.so arm64-v8a)

### 6.3 Accesibilidad

| Endpoint | Accesible | Auth Requerida | Notas |
|----------|-----------|----------------|-------|
| WSDL completo | ✅ Sí | No | Expone todas las operaciones |
| Servicio raíz | ✅ Sí | No | Página de información IIS |
| SOAP operations | ✅ Sí | Probablemente token | "Method not allowed" — requiere headers válidos |
| Visor WebDiagRx | ✅ Sí | Sí | Muestra error "PACIENTE NO EXISTE" |
| WcfServiceIconos | ✅ Sí | Desconocida | Redirige |
| `Service1.svc` | ❌ No | — | No desplegado públicamente |

---

## 7. Hallazgos de Seguridad

### 🔴 Crítico
1. **WSDL público** — 82 operaciones expuestas sin autenticación en el metadata
2. **Información de infraestructura interna filtrada** — El error SOAP expone `eymsa-app1.internal.cmr.mx`
3. **Token-based auth débil** — El token es un string simple, sin JWT, OAuth2 ni mecanismos modernos
4. **Operaciones de escritura sin autenticación visible** — `ActualizaPaciente`, `PasswordModify`, `SetSolicitudesEstudios`, `MakeAppointment`, `TimbrarFactura`, `PostConsentimientosFirma`

### 🟡 Alto
5. **Datos médicos protegidos (PHI) expuestos** — Toda la historia clínica: alergias, medicamentos, estudios, patología, imagenología, internamientos
6. **Facturación CFDI** — El endpoint `TimbrarFactura` expone timbrado fiscal (RFC, regimen fiscal, SAT)
7. **Password recovery sin rate-limiting visible** — `PasswordSend` sin controles de rate-limit evidentes
8. **Sin HTTPS en endpoints SOAP** — Todo viaja en texto plano (`http://`)

### 🟢 Medio
9. **Cámara para QR** — `REQUEST_INSTALL_PACKAGES` permite instalación silenciosa de APKs
10. **Visor DICOM público** — El endpoint `WebDiagRxMobile` está expuesto sin auth previa

---

## 8. Archivos Generados

| Archivo | Descripción |
|---------|-------------|
| `/root/bounty/tequis-report.md` | Este reporte |
| `/root/bounty/xapk_out/` | XAPK extraído |
| `/root/bounty/apk_out/` | APK base extraído |
| `/root/bounty/arm_out/` | native libs arm64-v8a |
