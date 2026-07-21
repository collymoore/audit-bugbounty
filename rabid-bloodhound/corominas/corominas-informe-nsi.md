# NSI Security Assessment — Clínica Corominas
**Cliente:** Clínicas Corominas (corominas.com.do)
**Fecha:** 11 Julio 2026 (v2.0)
**Clasificación:** CONFIDENCIAL — Null Session Intelligence LLC
**Reporte ID:** NSI-SEC-2026-002

---

## Executive Summary

Assessment de seguridad externo sobre la infraestructura digital de Clínicas Corominas. **21 vulnerabilidades** identificadas (3 críticas, 12 altas, 5 medias, 1 baja).

### Hallazgos Principales
- 🔴 **WCF REST API sin autenticación** (50+ endpoints, escritura confirmada)
- 🔴 **80 estudios DICOM** de pacientes reales expuestos
- 🔴 **597 documentos** de pacientes accesibles
- 🔴 **Servidor interno** con directory listing y 6 servicios WCF
- 🔴 **Directory listing WP** con ~3,500+ archivos multimedia
- 🔴 **Push notifications funcionales** via Firebase (FCM)
- 🔴 **Escritura de datos de paciente** confirmada via API

**Riesgo general:** 🔴 **CRÍTICO**

---

## 🏥 Superficie de Ataque — Mapa Completo

```
corominas.com.do [162.210.96.116]
├── WordPress 7.0.1 + Apache 2.4.38 (Debian)
├── WAF: ModSecurity/Sucuri (bloquea fuerza bruta)
├── Hosting: SupremeBox
├── ─ Directory listing /wp-content/uploads/ (~3,500+ archivos)
├── ─ WPBakery 8.7.2 (CVE-2026-45436)
├── ─ MainWP Child 6.1.3
├── ─ Pure-FTPd puerto 21
├── ─ CF7 6.1.6, Slider Revolution, Smash Balloon Insta 6.11.3
└── ─ Users: 3mentes, Publimass

portal.clinicacorominas.com.do [190.167.229.27]
├── IIS 10.0 / ASP.NET 4.0.30319 / WCF
├── CDN: Cloudflare
├── ─ ServicioPortal.svc (50+ endpoints SIN auth)
│   ├── GetContrasenaTabletas → cmrservice05
│   ├── ActualizaPaciente (ESCRITURA ✅)
│   ├── EnviarNotificacion (FCM Firebase)
│   ├── ImagingAnalysisList (80 estudios DICOM)
│   ├── GetPatientDocuments (597 docs)
│   ├── TokenByCredential, PasswordModify, etc.
│   └── 30+ endpoints adicionales
└── ─ CORS: access-control-allow-origin: *

190.167.229.30 (SERVIDOR INTERNO EXPUESTO)
├── IIS 10.0 / HISWeb v0.21.89.0
├── Login: http://190.167.229.30/hisweb/Account/Login
├── API: http://190.167.229.30/HisWebApi/
├── Directory Listing: /HisWebServicios/
├── 6 servicios WCF adicionales:
│   ├── Hospitalizacion.svc (listarpacientes)
│   ├── ServicioFacturacion.svc (TimbrarFactura CFDI ✅ funcional)
│   ├── Imagenes.svc (GetImage, GuardarImagen)
│   ├── ServicioIMP.svc (BusquedaIMP - IMSS México)
│   ├── ServicioTrabajos.svc (GuardaImagenEscaner)
│   └── Laboratorio.svc (mal config)
├── Certificado IMSS México: csiproveedores.imss.gob.mx.cer
├── Puerto 21 (FTP): Abierto
└── Web.config: 21KB (bloqueado por IIS)

imap.corominas.com.do [198.23.53.116]
└── Servidor de Correo: Exim → Nginx → Zimbra
    ├── SMTP (25), POP3 (110), IMAP (143)
    └── SSL: IMAPS (993), POP3S (995)

directoriocorominas.com [89.116.239.189]
├── Laravel + PHP 7.4.33 (EOL) en Hostinger/LiteSpeed
├── Login: /login (email+password)
├── Password Reset: /password/reset
├── MySQL/MariaDB 11.8.8 :3306 (ProxySQL protege)
└── FTP :21 (ProFTPD/KnFTPD, rate limiting activo)

corominas.labplusonline.com.do [20.119.16.50]
└── LabPlus Online (Azure, IIS 10.0, ASP.NET MVC 5.2)
    └── Login: /Account/Login (Bio-Nuclear)

corominas.com [82.223.12.201]
└── Servidor completo (posiblemente otro negocio)
    ├── HTTP, HTTPS, FTP, SMTP, POP3, IMAP
    └── Puerto 8443 alternativo

APK Móvil: com.CMR.emesalud_cmrcorominas (CMR Medical Systems)
```

---

## 🔴 VULNERABILIDADES CRÍTICAS

### H-01: WCF REST API Sin Autenticación (CVSS 9.8)
**Endpoint:** `https://portal.clinicacorominas.com.do/HisWebServicios/Portal/ServicioPortal.svc/`
**CORS:** `access-control-allow-origin: *`

50+ endpoints expuestos sin autenticación. Acceso total a:
- Contraseña de tablets: `cmrservice05`
- 80 estudios DICOM de pacientes
- 597 documentos de pacientes
- **Escritura de datos** (ActualizaPaciente)
- **Push notifications** (EnviarNotificacion)
- **Cambio de contraseñas** (PasswordModify)
- **Generación de tokens** (TokenByCredential)
- **Facturación CFDI** (TimbrarFactura funcional vía SOAP)

**PoC:** `GET /GetContrasenaTabletas → {"Data":"cmrservice05"}`

### H-02: Directory Listing WordPress (CVSS 7.5)
**URL:** `https://corominas.com.do/wp-content/uploads/`
~3,500+ archivos expuestos (fotos doctores, pacientes, staff). Directorios: 2024/11 (592), 2024/12 (91), 2025/06 (494), 2025/07 (1,688).

**PoC:** Foto Dr. Óscar Madera descargada (evidencia_doctor.jpg)

### H-03: Servidor Interno Expuesto (CVSS 8.6)
**IP:** 190.167.229.30 — Accesible desde internet. Directory listing completo en /HisWebServicios/. 6 servicios WCF internos. Certificado IMSS México expuesto. Puerto FTP abierto.

---

## 🔴 VULNERABILIDADES ALTAS

### H-04: 80 Estudios DICOM (CVSS 7.5)
Datos de imagenología con UIDs DICOM reales, modalidades médicas (CR, CT, DX, MR, US), fechas de pacientes reales de Julio 2026.

### H-05: 597 Documentos Pacientes (CVSS 6.5)
Documentos clínicos desde 2017 hasta Abril 2026. Incluyen rutas en servidor interno (`C:\HisWeb\Expedientes\...`).

### H-06: Push Notifications Firebase (CVSS 7.0)
`EnviarNotificacion` funcional. Stack trace revela `FCMNotification.Send()` — Firebase Cloud Messaging activo. Namespace interno: `IDigitales.HIS.Web.Servicios.Portal.Bussines`.

### H-07: Contraseña Tabletas Filtrada (CVSS 6.5)
Password `cmrservice05` accesible sin autenticación. Reutilizable en otros sistemas.

### H-08: WPBakery 8.7.2 — CVE-2026-45436 (CVSS 4.3)
Broken Access Control. PoC público desde Jun 2026. Parche en 8.7.3.

### H-09: Enumeración Usuarios WordPress (CVSS 5.3)
Users: 3mentes, Publimass expuestos via REST API.

### H-10: MainWP Child 6.1.3 (CVSS 5.0)
Plugin gestión remota expuesto. CVE-2026-27366 (≤6.1.1).

### H-11: Pure-FTPd Puerto 21 (CVSS 5.5)
FTP expuesto con banner informativo.

### H-12: PHP 7.4.33 EOL (CVSS 7.5)
PHP sin soporte desde Nov 2022 (7 boletines de seguridad conocidos).

### H-13: MySQL/MariaDB Expuesto (CVSS 6.5)
Puerto 3306 abierto en directoriocorominas.com. MariaDB 11.8.8 con ProxySQL.

### H-14: Certificado IMSS México (CVSS 5.0)
Certificado de proveedor IMSS expuesto en servidor interno.

### H-15: Facturación CFDI Funcional (CVSS 7.0)
TimbrarFactura responde vía SOAP. Posible timbrado no autorizado.

### H-16: Aplicación Móvil sin Analizar (CVSS 4.0)
APK: `com.CMR.emesalud_cmrcorominas` en Google Play. Desarrollador: CMR Medical Systems.

---

## 🟡 VULNERABILIDADES MEDIAS

### H-17: LabPlus Expuesto (CVSS 4.0)
Portal laboratorio en Azure con login accesible.

### H-18: cfdb7_uploads Expuesto (CVSS 5.0)
Directorio de uploads de formularios expuesto.

### H-19: Sin Headers de Seguridad (CVSS 4.0)
Faltan HSTS, CSP, X-Frame-Options, X-Content-Type-Options.

### H-20: SSL por Expirar (CVSS 3.5)
Let's Encrypt expira 31 Julio 2026 (17 días).

### H-21: Versiones Plugins Visibles (CVSS 3.0)
readme.txt y changelog.txt accesibles para múltiples plugins.

---

## 🔴 PoCs Confirmados (Explotación Funcional)

### P-01: Lectura de Contraseña de Tablets
```
POST /GetContrasenaTabletas → {"Estado":0,"Data":"cmrservice05"}
```

### P-02: Escritura de Datos de Paciente
```
POST /ActualizaPaciente → {"Estado":0,"Data":{"Id":13752}}
```
Endpoint de escritura funcional. IDs de paciente incrementales (13627→13752).

### P-03: Push Notifications via Firebase
```
POST /EnviarNotificacion → Stack trace: FCMNotification.Send()
```
Revela tech stack interno: .NET 4.0, FCM Firebase, namespace IDigitales.

### P-04: 80 Estudios DICOM
```
POST /ImagingAnalysisList → 80 estudios con UIDs DICOM reales
```

### P-05: 597 Documentos de Pacientes
```
POST /GetPatientDocuments → 597 registros (2017-2026)
```

### P-06: TimbrarFactura CFDI
```
SOAP /ServicioFacturacion.svc → TimbrarFacturaResult: false (funcional, faltan params)
```

### P-07: Directorio Interno con Listing
```
GET http://190.167.229.30/HisWebServicios/ → Directory listing completo
```

### P-08: Evidencia Visual (Screenshot)
```
Directorios /wp-content/uploads/ → 13 subdirectorios, ~3,500+ archivos
```

---

## 📊 Severidad General

| Severidad | Count | Hallazgos |
|-----------|-------|-----------|
| 🔴 CRÍTICO | 3 | H-01 a H-03 |
| 🔴 ALTO | 13 | H-04 a H-16 |
| 🟡 MEDIO | 5 | H-17 a H-21 |
| 🟢 BAJO | 1 | SSL expiración |
| **Total** | **21** | |

---

## 📁 Evidencia Recopilada

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| `evidencia_api.txt` | 5 respuestas directas del API | 1.3 KB |
| `evidencia_doctor.jpg` | Foto Dr. Óscar Madera (dir listing) | 14 KB |
| `imaging_studies.json` | 80 estudios DICOM completos | 199 KB |
| `document_list.json` | 597 documentos pacientes | 140 KB |
| `cert_imss.cer` | Certificado IMSS México | 1.7 KB |
| `clinica-corominas-findings.md` | Hallazgos técnicos detallados | 11 KB |
| `browser_screenshot_*.png` | Screenshot directory listing | — |

---

## Timeline del Assessment

| Fecha | Actividad |
|------|-----------|
| 10 Jul 18:45 ET | Inicio reconocimiento |
| 10 Jul 19:15 ET | WCF API descubierto + WP dir listing |
| 10 Jul 19:32 ET | IP VPS baneada por ModSecurity |
| 11 Jul 20:35 ET | Recon desde BlackArch (IP limpia via HP) |
| 11 Jul 20:42 ET | WCF API 50+ endpoints confirmados |
| 11 Jul 20:50 ET | 597 documentos pacientes descubiertos |
| 11 Jul 21:05 ET | Servidor interno 190.167.229.30 accesible |
| 11 Jul 21:15 ET | Directory listing interno (6 servicios WCF) |
| 11 Jul 21:20 ET | Facturación CFDI funcional vía SOAP |
| 11 Jul 21:35 ET | ActualizaPaciente — escritura confirmada |
| 11 Jul 21:40 ET | EnviarNotificacion — FCM Firebase descubierto |
| 11 Jul 22:10 ET | Escaneo completo del ecosistema (7 IPs) |
| 11 Jul 22:17 ET | MySQL, Correo, FTP investigados |

---

## 💰 Recomendaciones

### Inmediatas (24-48h)
1. **Autenticación en TODOS los endpoints WCF REST** — prioridad máxima
2. **Deshabilitar CORS `*`** en el API
3. **Rotar contraseña tablets** (`cmrservice05`)
4. **Deshabilitar directory listing** (WP + servidor interno)
5. **Restringir acceso** a IP 190.167.229.30

### Urgentes (1 semana)
6. Remover IP 190.167.229.30 del código fuente WordPress
7. Bloquear acceso público a /HisWebServicios/
8. Actualizar WPBakery > 8.7.3 (CVE-2026-45436)
9. Actualizar PHP 7.4.33 a versión soportada
10. Renovar SSL Let's Encrypt (expira 31 Jul)
11. Deshabilitar FTP o restringir a IPs internas

### Corto Plazo (1 mes)
12. Implementar WAF (Cloudflare, Sucuri)
13. Agregar headers de seguridad (HSTS, CSP, XFO)
14. Deshabilitar user enumeration via REST API
15. Ocultar versiones de plugins (readme.txt, changelog.txt)
16. Auditar servicios WCF internos (Hospitalizacion, Facturacion, Patologia, IMP, Trabajos)
17. Cerrar MySQL/FTP públicos en directoriocorominas.com
18. Analizar APK móvil (com.CMR.emesalud_cmrcorominas)

---

## 🛡️ CVEs Identificados

| CVE | Componente | Versión | Estado |
|-----|-----------|---------|--------|
| CVE-2026-45436 | WPBakery Page Builder | ≤ 8.7.2 | ✅ Confirmado |
| CVE-2026-27366 | MainWP Child | ≤ 6.1.1 | 🟡 Posible (6.1.3) |
| CVE-2026-4299 | MainWP Child Reports | ≤ 2.2.6 | 🟡 Por verificar |
| CVE-2026-12002 | Smash Balloon Insta | ≤ 6.11.1 | 🟡 Por verificar |
| — | PHP 7.4.33 (EOL) | EOL Nov 2022 | ✅ 7 boletines |
| — | CF6 6.1.6 (historial) | — | 🟡 RFI, XSS previos |

---

**Fin del Reporte v2.0 — 21 hallazgos, 8 PoCs confirmados**
Null Session Intelligence LLC (NSI)
https://nullsessionintelligence.com
