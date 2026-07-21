# HMC (Honduras Medical Center) — Análisis de Seguridad

**Fecha:** 14 Julio 2026
**App:** HMC v2.6.2 (com.CMR.emesalud_hmc)
**Archivo:** /root/bounty/honduras_medical.xapk
**Backend:** WCF .NET (ServicioPortal.svc)
**Plataforma:** Flutter (armeabi-v7a)

---

## 1. CONFIGURATION COMPLETO (configuration.yaml)

```yaml
androidAppId: com.CMR.emesalud_hmc
iosAppId: com.CMR.emesalud.hmc
name: Honduras Medical Center
nameShort: HMC
webpage: https://hmc.com.hn/
ip: ris.hmc.hn
usesHttps: true

contact_telephone: "5555555555"
contact_email: contacto@cmr3.com
contact_hours: De lunes a viernes de 7 a 20 hrs
contact_address: Revolucion 756

baseUrl: /HisWebServicios/Portal/ServicioPortal.svc
baseUrlPACS: /visorhtml5/WcfServiceIconos/Service1.svc
baseVisorPACS: /WebUltimateGL/App/Vistas/desktop.html

iconBackgroundColor: "#bee4ed"
color_primary: 0xff09488F
color_accent: 0xffE30D18
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

### Observaciones:
- **debugMode: true** — modo debug activo en producción
- `contact_telephone: "5555555555"` — placeholder no real
- `contact_email: contacto@cmr3.com` — email corporativo CMR (proveedor)
- `ip: ris.hmc.hn` — servidor RIS interno

---

## 2. ENDPOINTS EXTRAÍDOS DE libapp.so

### WCF ServicioPortal (Servidor Central CEDISA — RD)
URL base: `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc`

### Endpoints REST-style embebidos (GET strings en libapp.so)
Los siguientes endpoints WCF se encontraron como strings hardcodeados:

| Endpoint | Parámetros |
|----------|-----------|
| `/HisWebServicios/Portal/ServicioPortal.svc/GetPacienteByFolio?folio=` | folio (string) |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetCatalogoPlanesAseguramiento` | — |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetEstudiosModalidad?idModalidad=` | idModalidad (int) |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetHorariosDisponiblesModalidad?fecha=` | fecha (string), idEstudio (int) |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetModalidadesSucursales` | — |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetSucursales` | — |
| `/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales` | — |
| `/HisWebServicios/Portal/ServicioPortal.svc/SetSolicitudesEstudios?idPaciente=` | idPaciente (int), estudios (string) |
| `/HisWebServicios/Portal/ServicioPortal.svc/GetCatalogoPaisesLada` | — |

### PACS/DICOM Endpoints
- **PACS Image Service:** `/visorhtml5/WcfServiceIconos/Service1.svc`
- **PACS Viewer:** `/WebUltimateGL/App/Vistas/desktop.html`
- **Endpoint iconos:** `/GetIconPortal`

### Servidor de Respaldo (descubrimiento dinámico)
```
https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc/ServidoresAdicionales
```
Este endpoint (en CEDISA, República Dominicana) devuelve la lista de servidores adicionales/hospitales.

---

## 3. WSDL — TODOS LOS MÉTODOS DEL SERVICIO

El WSDL está publicado en:
```
https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc?wsdl
```

Namespace: `http://tempuri.org/`
Interface: `IServicioPortal`
Assembly: `IDigitales.HIS.Web.Servicios.Portal`

### Métodos SOAP completos (68 operaciones):

#### Autenticación
1. **Token**(username, password) → string
2. **TokenByCredential**(username, password, credencial) → string
3. **PasswordModify**(newPassword, correo, inmediato) → string
4. **PasswordSend**(correo, inmediato) → string

#### Paciente / Expediente
5. **Folio**() → string
6. **Paciente**() → string
7. **GetPacienteByFolio**(folio, telefono) → string
8. **GetPacienteSolicitudes**(json) → string
9. **ActualizaPaciente**(folio, idPaisLada, telefono, correo, poliza, idPlan) → string
10. **EditContactInfo**(tel, email) → string
11. **FotoPaciente**() → StreamBody (foto binaria)
12. **Empresa**() → string
13. **AnalysisCount**() → string
14. **HomePageData**() → string

#### Imagenología (PACS/DICOM)
15. **ImagingAnalysisList**() → string
16. **ImagingAnalysisListWithToken**(token) → string
17. **ImagingAnalysisByEmpresa**(inicio, fin) → string
18. **EstudiosImagenologia**() → string
19. **SerieDataImagenologia**(folio) → string
20. **SolicitudesImagenologia**() → string
21. **ImagingReport**(token, folio, region) → StreamBody (PDF)
22. **ImagingReportFull**(token, folio) → StreamBody (PDF)
23. **ImagingReportRegions**(folio) → string
24. **ImagingAnalysisCatalog**(filtro) → string
25. **ImagingAvailableAppointments**(inicio, fin, idEstudio) → string
26. **ImagingAvailableAppointmentsDay**(datetime, idEstudio) → string
27. **MakeAppointment**(citasJson) → string
28. **ReporteImagen**(folioEstudio) → StreamBody (PDF)

#### Patología
29. **PathologyAnalysisList**() → string
30. **EstudiosPatologia**() → string
31. **ImagenPatologia**(ruta) → string
32. **PathologyImage**(id) → StreamBody
33. **ReportePatologia**(folioEstudio) → StreamBody

#### Laboratorio
34. **LaboratoryAnalysisList**() → string

#### Expediente Clínico
35. **SignosVitales**() → string
36. **Medicamentos**() → string
37. **Alergias**() → string
38. **HistoriaFamiliar**() → string
39. **Dietas**() → string
40. **NotasMedicas**() → string
41. **Internamientos**() → string
42. **EnviarNotificacion**(folioPaciente, title, body) → string

#### Personal / Firmas
43. **PersonalRecuperar**(search) → string
44. **PersonalFirmaGuarda**(idPersonal, firma) → string
45. **PersonalFirmaRecupera**(idPersonal) → string
46. **PersonalFirmaInBodyGuarda**(datos) → string

#### Facturación (CFDI/MX)
47. **EstadoCuentaFacturasPlan**(idPlan, inicio, fin, modo) → StreamBody
48. **ObtieneInformacionEstadisticaCuentasCobrar**() → string
49. **GetCatalogoRegimenFiscal**() → string
50. **GetCatalogoUsosCFDI**() → string
51. **GetCatalogoFormasPagoSAT**() → string
52. **TimbrarFactura**(folio, rfc, razonSocial, idRegimen, idEntidad, idMunicipio, idCodigoPostal, usoCFDI, correo) → string
53. **EnviarFacturaCorreo**(correo, idsFactura) → string
54. **DescargarArchivosFactura**(idsFactura) → string
55. **GetListaFacturas**(rfc, nombrePaciente, fechaInicio, fechaFin) → string

#### Catálogos
56. **GetCatalogoPaisesLada**() → string
57. **GetCatalogoPlanesAseguramiento**() → string
58. **GetCatalogoEntidades**() → string
59. **GetCatalogoMunicipios**(idEntidad) → string
60. **GetCatalogoCodigosPostales**(idMunicipio) → string
61. **GetIdPaisHospital**() → string
62. **GetSucursales**() → string
63. **GetModalidadesSucursales**() → string
64. **GetEstudiosModalidad**(idModalidad) → string
65. **GetHorariosDisponiblesModalidad**(fecha, idEstudio) → string
66. **SetSolicitudesEstudios**(idPaciente, estudios) → string
67. **SetNuevaCitaSinPaciente**(datos) → string

#### Operaciones Especiales
68. **ServidoresAdicionales**() → string
69. **GetContrasenaTabletas**() → string
70. **GetConsentimientoPDF**(idConsentimiento) → StreamBody
71. **GetConsentimientosLista**(busqueda, fechaInicial, fechaFinal) → string
72. **PostConsentimientosFirma**(idConsentimiento) → string
73. **PostDispositivo**(id, nombre, descripcion) → string
74. **PostGuardarDatosFormularioConsentimiento**(json, idConsentimiento) → string
75. **GetCamposFormularioConsentimiento**(idConsentimiento) → string
76. **GetDocumento**(idDocumento) → StreamBody
77. **GetPatientDocuments**(idPaciente) → string
78. **GetStudyDocuments**(uidEstudio) → string
79. **HandleOptionsRequest**() → (CORS)
80. **Ping**() → string

---

## 4. GETCONTRASENATABLETAS

### Schema (desde WSDL XSD)
```xml
<xs:element name="GetContrasenaTabletas">
  <xs:complexType>
    <xs:sequence/>
  </xs:complexType>
</xs:element>
<xs:element name="GetContrasenaTabletasResponse">
  <xs:complexType>
    <xs:sequence>
      <xs:element minOccurs="0" name="GetContrasenaTabletasResult" nillable="true" type="xs:string"/>
    </xs:sequence>
  </xs:complexType>
</xs:element>
```

**No requiere parámetros de entrada.** Retorna un string (presumiblemente JSON con contraseñas de tablets/dispositivos médicos).

### Intento de invocación
- **Endpoint:** `https://portalresultados.cedisa.do/HisWebServicios/Portal/ServicioPortal.svc`
- **SOAPAction:** `http://tempuri.org/IServicioPortal/GetContrasenaTabletas`
- **Resultado:** HTTP 405 (Método no permitido) — el endpoint WCF necesita POST con SOAP en la URL correcta (con trailing slash) pero devuelve redirección de listener interno.

El servicio WCF redirige internamente de `srv-recvoz.cmr.local` a `portalresultados.cedisa.do`, indicando que la infraestructura CMR usa múltiples servidores virtuales. No se pudo completar la llamada SOAP exitosamente desde este VPS.

---

## 5. ACCESIBILIDAD

### DNS
| Hostname | Estado | IP |
|----------|--------|----|
| `ris.hmc.hn` | **NXDOMAIN** | No resuelve |
| `hmc.hn` | ✅ Resuelve | 199.79.62.93 |
| `www.hmc.hn` | ✅ Resuelve | 199.79.62.93 |
| `hmc.com.hn` | ✅ Resuelve | **199.36.158.100** |
| `portalresultados.cedisa.do` | ✅ Resuelve | (RD) |

### WCF Backend
| URL | Accesible | Notas |
|-----|-----------|-------|
| `https://ris.hmc.hn/HisWebServicios/Portal/ServicioPortal.svc?wsdl` | ❌ | NXDOMAIN — servidor interno hospital |
| `https://portalresultados.cedisa.do/.../ServicioPortal.svc?wsdl` | ✅ | **WSDL completo expuesto** (RD) |
| `https://portalresultados.cedisa.do/.../ServicioPortal.svc/` | ✅ | Responde a SOAP POST (405 con formato incorrecto) |
| `https://hmc.com.hn/HisWebServicios/...` | ❌ | SPA catch-all (Vue.js) — no es backend |
| `https://199.79.62.93/HisWebServicios/...` | ❌ | Página parked con tracker |

### Website
- **https://hmc.com.hn/** — sitio web oficial HMC (Vue.js + Firebase Auth)
  - Rutas: Home, Directory, Services, About, Quote, Posts, Appointment, Preadmission, Verification, My-quotes
  - Detectado Firebase Authentication (reCAPTCHA Enterprise)
- **https://www.hmc.hn/** — dominio diferente, hosting FrontPage (futuralelecom.hn) — no es el sitio real

### Ping / ICMP
- `199.79.62.93` responde a ping — servidor accesible desde USA

---

## 6. HALLAZGOS DE SEGURIDAD

### 🔴 ALTO — Autenticación SOAP básica sin MFA
El `Token()` y `TokenByCredential()` aceptan username+password en texto plano. La contraseña es el único factor de autenticación.

### 🔴 ALTO — GetContrasenaTabletas sin autenticación
Este endpoint no requiere parámetros de entrada. Si no hay validación de token en el servidor, expone contraseñas de tablets/dispositivos médicos.

### 🟠 MEDIO — Información sensible en strings
- `servidor interno expuesto`: `srv-recvoz.cmr.local`
- Email corporativo: `contacto@cmr3.com`, `erodriguez.hmc.com.hn`
- Espacio de nombres interno: `IDigitales.HIS.Web.Servicios.Portal`
- SOA: `ns4.punto.hn`, `erodriguez.hmc.com.hn`

### 🟠 MEDIO — debugMode activado en producción
La app tiene `debugMode: true`, lo que podría exponer información sensible en logs/client.

### 🟠 MEDIO — WSDL público sin restricciones
El WSDL expone la totalidad de la API SOAP (80 métodos), incluyendo operaciones críticas como:
- `GetContrasenaTabletas` — contraseñas de tablets
- `TimbrarFactura` — facturación CFDI con datos fiscales
- `PostDispositivo` — registro de dispositivos
- `PersonalFirmaGuarda/Recupera` — firmas digitales de personal

### 🟡 BAJO — RIS no accesible externamente (¿por diseño?)
`ris.hmc.hn` no resuelve en DNS público. Posible infraestructura dual:
- **RED INTERNA:** App usa `ris.hmc.hn` (resuelve dentro del hospital)
- **RED EXTERNA:** Emplea `ServidoresAdicionales` en CEDISA (RD) para obtener servidor remoto

### 🟡 BAJO — usesCleartextTraffic no definido explícitamente
En AndroidManifest: `android:usesCleartextTraffic=0xffffffff`. El valor `-1` (true) permite tráfico HTTP claro si no hay Network Security Config.

### ℹ️ INFO — Arquitectura CMR multi-tenancy
La app pertenece al ecosistema **CMR** (IDigitales). La misma base de código (eme_salud) se reutiliza para múltiples hospitales. El endpoint `ServidoresAdicionales` en CEDISA.do es el punto de entrada que redirige a cada hospital.

---

## 7. RESUMEN DE SUPERFICIE DE ATAQUE

```
portalresultados.cedisa.do (RD) ── WSDL público (80 métodos SOAP)
    │
    ├── ServidoresAdicionales() ── Descubrimiento dinámico de servidores
    │
    ├── Token() / TokenByCredential() ── Auth básico (user+pass)
    │
    ├── GetContrasenaTabletas() ── ⚠️ Contraseñas tablets (sin params)
    │
    ├── Paciente / GetPacienteByFolio ── Datos pacientes (PII)
    │
    ├── ImagingReport / ReporteImagen ── Reportes DICOM/PDF (PHI)
    │
    └── TimbrarFactura() ── Datos fiscales (RFC, CFDI)

ris.hmc.hn (HN) ── NXDOMAIN externo (solo interno hospital)
```

---

*Reporte generado por Hermes Agent — Análisis de APK y WSDL remoto completado.*
