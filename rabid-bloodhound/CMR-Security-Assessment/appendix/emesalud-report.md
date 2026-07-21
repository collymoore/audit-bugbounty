# EME Salud (CMR Genérica) — Análisis de Seguridad

## 1. INFORMACIÓN GENERAL

- **App**: EME Salud (CMR genérica)
- **Paquete**: `com.CMR.eme_salud_cmr`
- **Backend**: WCF (Windows Communication Foundation) .NET / ASP.NET
- **Namespace interno**: `IDigitales.HIS.Web.Servicios.Portal`
- **Servidor**: `www.cmr-apps.com` → `208.88.122.212`
- **IIS**: Microsoft-IIS/10.0
- **ASP.NET**: 4.0.30319
- **Protocolo**: HTTP (sin TLS) — `usesHttps: false`
- **debugMode**: `true`
- **Framework**: Flutter (Dart compilado a native en `libapp.so`)
- **Industria**: Salud / Radiología (México / República Dominicana)
- **Desarrollador backend**: iDigitales HIS

### 1.1 Contactos de la app
- Teléfono: `5555555555` (placeholder)
- Email: `contacto@cmr3.com`
- Dirección: Revolución 756
- Web: `https://www.cmr-rx.com`

---

## 2. CONFIGURACIÓN (configuration.yaml)

| Clave | Valor |
|-------|-------|
| ip | www.cmr-apps.com |
| usesHttps | false |
| baseUrl | /HisWebServicios/Portal/ServicioPortal.svc |
| baseUrlPACS | /visorhtml5/WcfServiceIconos/Service1.svc |
| baseVisorPACS | /WebUltimateGL/App/Vistas/index.html |
| debugMode | true |
| hasImaging | true |
| hasLaboratory | false |
| hasPathology | false |
| canMakeAppointmets | true |

---

## 3. ENDPOINTS DEL SERVICIO PRINCIPAL

**Base**: `http://www.cmr-apps.com/HisWebServicios/Portal/ServicioPortal.svc`

### 3.1 Autenticación
| Endpoint | Descripción |
|----------|-------------|
| `Token` | Login usuario/contraseña → devuelve token |
| `TokenByCredential` | Login con credencial extra |
| `PasswordModify` | Cambio de contraseña por correo |
| `PasswordSend` | Envío de contraseña por correo |

### 3.2 Pacientes
| Endpoint | Descripción |
|----------|-------------|
| `Paciente` | Datos del paciente |
| `GetPacienteByFolio` | Búsqueda por folio + teléfono |
| `GetPacienteSolicitudes` | Solicitudes del paciente |
| `ActualizaPaciente` | Actualización de datos (teléfono, correo, póliza, plan) |
| `Folio` | Obtener folio |
| `FotoPaciente` | Foto del paciente (StreamBody) |
| `HomePageData` | Datos del dashboard |

### 3.3 Expediente Clínico
| Endpoint | Descripción |
|----------|-------------|
| `Alergias` | Alergias del paciente |
| `Medicamentos` | Medicamentos recetados |
| `Dietas` | Dietas |
| `SignosVitales` | Signos vitales |
| `HistoriaFamiliar` | Historia familiar |
| `NotasMedicas` | Notas médicas |
| `Internamientos` | Hospitalizaciones |
| `AnalysisCount` | Conteo de análisis |

### 3.4 Imagenología (PACS/DICOM)
| Endpoint | Descripción |
|----------|-------------|
| `ImagingAnalysisList` | Lista de estudios de imagen |
| `ImagingAnalysisListWithToken` | Lista con token |
| `ImagingAnalysisByEmpresa` | Por empresa y rango de fechas |
| `ImagingReport` | Reporte de imagen (PDF/Stream) |
| `ImagingReportFull` | Reporte completo (PDF/Stream) |
| `ImagingReportRegions` | Regiones del reporte |
| `ImagingAnalysisCatalog` | Catálogo de estudios |
| `ImagingAvailableAppointments` | Citas disponibles |
| `ImagingAvailableAppointmentsDay` | Citas por día |
| `MakeAppointment` | Crear cita |
| `EstudiosImagenologia` | Estudios de imagen |
| `SerieDataImagenologia` | Series DICOM |
| `SolicitudesImagenologia` | Solicitudes |
| `ReporteImagen` | Reporte de imagen (Stream) |
| `GetIcon` (Service1.svc) | Iconos PACS |
| `GetIconPortal` (Service1.svc) | Iconos portal |
| `GetOptions` (Service1.svc) | Opciones PACS |

### 3.5 Patología
| Endpoint | Descripción |
|----------|-------------|
| `PathologyAnalysisList` | Lista de estudios de patología |
| `PathologyImage` | Imagen de patología (Stream) |
| `ImagenPatologia` | Imagen por ruta |
| `EstudiosPatologia` | Estudios de patología |
| `ReportePatologia` | Reporte de patología (PDF/Stream) |

### 3.6 Laboratorio
| Endpoint | Descripción |
|----------|-------------|
| `LaboratoryAnalysisList` | Lista de estudios de laboratorio |

### 3.7 Personal / Staff
| Endpoint | Descripción |
|----------|-------------|
| `PersonalRecuperar` | **Búsqueda de personal por nombre** — EXPONE DATOS |
| `PersonalFirmaGuarda` | Guardar firma digital |
| `PersonalFirmaRecupera` | Recuperar firma |
| `PersonalFirmaInBodyGuarda` | Guardar firma in-body |

### 3.8 Facturación (CFDI/México SAT)
| Endpoint | Descripción |
|----------|-------------|
| `TimbrarFactura` | Timbrar factura ante SAT |
| `EnviarFacturaCorreo` | Enviar factura por correo |
| `DescargarArchivosFactura` | Descargar XML/PDF factura |
| `GetListaFacturas` | Lista de facturas por RFC |
| `GetInformacionCuenta` | Info de cuenta |
| `EstadoCuentaFacturasPlan` | Estado de cuenta por plan (PDF) |
| `ObtieneInformacionEstadisticaCuentasCobrar` | Estadísticas cuentas por cobrar |
| `GetCatalogoRegimenFiscal` | Catálogo regímenes fiscales SAT |
| `GetCatalogoUsosCFDI` | Catálogo usos CFDI |
| `GetCatalogoFormasPagoSAT` | Catálogo formas pago SAT |

### 3.9 Catálogos
| Endpoint | Descripción |
|----------|-------------|
| `GetSucursales` | Sucursales |
| `GetModalidadesSucursales` | Modalidades por sucursal |
| `GetEstudiosModalidad` | Estudios por modalidad |
| `GetHorariosDisponiblesModalidad` | Horarios disponibles |
| `SetSolicitudesEstudios` | Crear solicitudes de estudio |
| `SetNuevaCitaSinPaciente` | Crear cita sin paciente |
| `GetCatalogoPaisesLada` | Catálogo países + lada |
| `GetCatalogoPlanesAseguramiento` | Planes de aseguramiento |
| `GetCatalogoEntidades` | Catálogo entidades/estados |
| `GetCatalogoMunicipios` | Catálogo municipios |
| `GetCatalogoCodigosPostales` | Catálogo códigos postales |
| `GetIdPaisHospital` | ID país del hospital |
| `PostDispositivo` | Registrar dispositivo |

### 3.10 Consentimientos
| Endpoint | Descripción |
|----------|-------------|
| `GetConsentimientoPDF` | Descargar consentimiento (PDF) |
| `GetConsentimientosLista` | Lista de consentimientos |
| `PostConsentimientosFirma` | Firmar consentimiento |
| `GetCamposFormularioConsentimiento` | Campos de formulario |
| `PostGuardarDatosFormularioConsentimiento` | Guardar datos formulario |

### 3.11 Otros
| Endpoint | Descripción |
|----------|-------------|
| `ServidoresAdicionales` | **Enumera servidores adicionales** |
| `EnviarNotificacion` | Enviar notificación push (FCM) |
| `HandleOptionsRequest` | CORS preflight handler |
| `EditContactInfo` | Editar contacto |
| `GetContrasenaTabletas` | Obtener contraseña de tabletas |

---

## 4. SERVIDORES WCF ADICIONALES (PACS / CEDISA)

Descubiertos vía `ServidoresAdicionales`:

| Sucursal | URL | Dirección | Teléfono |
|----------|-----|-----------|----------|
| HERRERA | `https://herreraresultados.cedisa.do/` | Av. Isabel Aguiar Esq. Calle 2da, Herrera. Santo Domingo Oeste | 809-621-2020 |
| INCOCEGLA | `https://incoceglaresultados.cedisa.do/` | Av. Ortega y Gasset No. 105. Cristo Rey, Santo Domingo | 809-621-2020 |
| LAS AMERICAS | `https://americasresultados.cedisa.do/` | Av. Las Américas esq. Jesús Galíndez, Ensanche Ozama. Santo Domingo Este | 809-621-2020 |

También hay URL hardcodeada en `libapp.so`:
- `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales`

---

## 5. ENDPOINTS PACS (Visor de Imágenes)

- **WSDL**: `http://www.cmr-apps.com/visorhtml5/WcfServiceIconos/Service1.svc?wsdl`
- **Interfaz**: `IService1` (GetIcon, GetIconPortal, GetOptions)
- **Visor Web**: `http://www.cmr-apps.com/WebUltimateGL/App/Vistas/index.html` (WebUltimate GL)

---

## 6. HALLAZGOS CRÍTICOS

### 🔴 CRÍTICO: Exposición masiva de datos personales de staff
**Endpoint**: `PersonalRecuperar` — **SIN AUTENTICACIÓN**
- Búsqueda por nombre (`search` parameter), expone:
  - Nombres completos del personal
  - Cédulas/IDs
  - Roles laborales (ADMINISTRADOR, MÉDICO, RADIÓLOGO, etc.)
  - Especialidades médicas
  - Estado activo/inactivo
  - Fechas de última modificación
- **~120 registros expuestos** incluyendo administradores, radiólogos, personal de urgencias

### 🔴 CRÍTICO: Comunicación sin TLS (HTTP plano)
- `usesHttps: false` — Todo el tráfico viaja en texto claro
- Credenciales de login, tokens, PHI (Protected Health Information) viajan en HTTP
- No hay cifrado en transporte — sujeto a MITM

### 🔴 CRÍTICO: Auth débil / Bypass
- `Token` y `TokenByCredential` devuelven string vacío con credenciales inválidas
- Múltiples endpoints aceptan requests **sin ningún token** y responden
- Sistema de autenticación probablemente basado en el usuario+empresa, no en JWT robusto

### 🟠 ALTO: Exposición de infraestructura
- **ServidoresAdicionales** sin auth — revela URLs internas, direcciones físicas, teléfonos
- Endpoints de facturación CFDI expuestos (TimbrarFactura, DescargarArchivosFactura)
- PasswordSend/PasswordModify expuestos — vector de enumeración de cuentas
- Mensaje de error `EnviarNotificacion` revela stack trace interno de .NET:
  ```
  System.Net.WebException: The remote server returned an error: (404) Not Found.
     at System.Net.HttpWebRequest.GetResponse()
     at IDigitales.HIS.Web.Servicios.Portal.Bussines.FCMNotification.Send(String topic, String title, String body)
  ```

### 🟠 ALTO: Información tecnológica expuesta
- **IIS 10.0**, **ASP.NET 4.0.30319** — versiones específicas
- Namespace interno: `IDigitales.HIS.Web.Servicios.Portal`
- Clase interna: `Bussines.FCMNotification` (Firebase Cloud Messaging)
- XSD schemas completamente accesibles
- `debugMode: true` en configuración

### 🟠 ALTO: CORS extremadamente permisivo
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Accept, ..., Authorization, X-Requested-With, Cache-Control
Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS
```
Cualquier sitio web puede hacer peticiones AJAX a estos endpoints.

### 🟡 MEDIO: Password recovery expuesto
- `PasswordSend` revela "Correo no válido" — permite enumeración de emails registrados
- `PasswordModify` permite cambio de contraseña con solo correo

### 🟡 MEDIO: PII fields en XSD
Los schemas XSD revelan los campos de datos personales manejados: `folio`, `paciente`, `telefono`, `correo`, `poliza`, `plan`, `rfc`, `razonSocial`, `domicilio`, etc.

### 🟡 MEDIO: Staff directory público
- PersonalRecuperar funciona como LDAP público
- Múltiples usuarios "ADMINISTRADOR" expuestos — vectores de ataque de fuerza bruta

---

## 7. VECTORES DE ATAQUE RECOMENDADOS

1. **Fuerza bruta a login**: Con la lista de empleados del endpoint `PersonalRecuperar`, intentar credenciales comunes
2. **Enumeración de correos**: Vía `PasswordSend`
3. **Acceso a datos de pacientes**: Con un token válido, acceder a estudios de imagen, reportes, PDFs
4. **Man-in-the-Middle**: Todo en HTTP plano — interceptar tráfico en redes WiFi
5. **Cross-Site Request Forgery**: Por CORS permisivo y falta de tokens CSRF
6. **Inyección SQL**: Los parámetros como `folio`, `search`, `idPaciente` no muestran evidencia de sanitización

---

## 8. NOTAS TÉCNICAS

- **Flutter**: App compilada a código nativo (`lib/armeabi-v7a/libapp.so`, 8.6 MB)
- **Dart HTTP classes identificados**: `HttpAuthHandler`, `HttpSplash`, `HttpProfile`, `HttpLogin`, `HttpUserPhoto`, `HttpAppointments`, `HttpAlergies`, `HttpDiets`, `HttpEditProfile`, `HttpImagingAnalysisList`, `HttpNotes`, `HttpPathologyAnalysisList`, `HttpPrescriptions`, `HttpVitalSigns`
- **SQLite**: Se usa SQLite local (`PRAGMA user_version = 15`, `DELETE FROM`, `INSERT`)
- **Android**: No se encontraron `lib/` nativos en el APK extraído (solo el original XAPK los tiene)
- **Cédula Mexicana**: El staff directory incluye cédulas profesionales mexicanas

---

## 9. RESUMEN DE EXPOSICIÓN

| Categoría | Expuesto | Sin Auth |
|-----------|----------|----------|
| Catálogos públicos | ✅ | ✅ |
| Staff directory | ✅ | ✅ |
| Sucursales/direcciones | ✅ | ✅ |
| Infraestructura adicional | ✅ | ✅ |
| Login endpoint | ✅ | ✅ |
| Password reset | ✅ | ✅ |
| Estudios de pacientes | ⚠️ (requiere token) | ❌ |
| Reportes/PDFs de pacientes | ⚠️ (requiere token) | ❌ |
| Facturación CFDI | ⚠️ | ❌ |
| Imágenes DICOM | ⚠️ (requiere token) | ❌ |

**El servidor WCF de CMR es funcionalmente un backend multi-hospital con auth débil, HTTP plano, y múltiples endpoints expuestos sin autenticación.**
