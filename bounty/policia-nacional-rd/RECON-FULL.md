# Reconocimiento Completo — Policía Nacional de la República Dominicana

**Fecha:** 15 julio 2026
**Metodología:** Shodan, crt.sh, subfinder, curl probing, Google Play OSINT
**WAF:** Imperva/Incapsula (protección parcial)

---

## 1. INVENTARIO DE DOMINIOS Y SUBDOMINIOS

### policianacional.gob.do (WordPress + Imperva WAF)
| Subdominio | Estado | Tecnología |
|------------|--------|------------|
| www.policianacional.gob.do | ✅ 200 | WordPress 6.x, Impreza theme, Imperva WAF |
| appconsulta.policianacional.gob.do | ❌ Timeout | Detrás de Imperva |
| intranet.policianacional.gob.do | ❌ Timeout | Intranet interna |
| **monitoreozabbix.policianacional.gob.do** | ❌ Timeout | 🔥 **ZABBIX EXPUESTO** |
| msti.policianacional.gob.do | ❌ Timeout | Sistema interno |
| portalservicios.policianacional.gob.do | ✅ 200 | IIS Windows Server (default page) |
| vicmanager.policianacional.gob.do | ❌ Timeout | Visitor/incident manager? |
| webmail.policianacional.gob.do | ❌ Timeout | Webmail |
| **denuncias.policia.gob.do** | ✅ 200 | **Umbraco CMS + ASP.NET + Imperva** |
| **spgd.pn.gob.do** | ✅ (Shodan) | SPGD — sistema interno (detrás de Imperva) |

### policia.gob.do (Windows/IIS/ASP.NET - IP real: 179.51.71.226-227)
| Subdominio | Estado | Tecnología |
|------------|--------|------------|
| webmail.policia.gob.do | ✅ 302 → /Mondo/lang/sys/login.aspx | **MailEnable WebMail 10.55** + IIS 10.0 + ASP.NET 4.0.30319 |
| denuncias.policia.gob.do | ✅ 200 | **Umbraco CMS** / Denuncias Virtuales |
| arco.policia.gob.do | ✅ **403** | **IIS 10.0 + ASP.NET** — existe pero restringido |
| pn-vcomplaint-service.policia.gob.do | ✅ **403** | **IIS 10.0 + ASP.NET** — API de denuncias |
| mail.policia.gob.do | ✅ 25/443/465/587/993/995 | **MailEnable** en Plesk Obsidian 18.0.77 |
| admisiones.policia.gob.do | ❌ Sin respuesta | Admisiones |
| crcd.policia.gob.do | ✅ 404 (Microsoft-HTTPAPI/2.0) | Servicio Windows existente |
| debi.policia.gob.do | ❌ Sin respuesta | DEBI |
| psp.policia.gob.do | ✅ 404 (Microsoft-HTTPAPI/2.0) | **PSP — Servicios Policiales** (app móvil) |
| www.policia.gob.do | ❌ Sin respuesta | |
| www.psp.policia.gob.do | ❌ Sin respuesta | |

---

## 2. INFRAESTRUCTURA

### Servidor de Correo (179.51.71.226)
| Item | Detalle |
|------|---------|
| **IP** | 179.51.71.226 |
| **ISP** | Columbus Networks Dominicana, S.A. |
| **Ubicación** | Santo Domingo Este, RD |
| **OS** | **Windows Server** |
| **Panel** | **Plesk Obsidian 18.0.77** |
| **Mail** | **MailEnable 10.55** (SMTP, SMTPS, POP3S, IMAPS) |
| **Web** | IIS con cert *.policia.gob.do (Sectigo DV R36) |
| **SSL** | TLS 1.0, 1.1, 1.2, 1.3 |
| **Puertos** | 25, 443, 465, 587, 993, 995 |

### Servidor Web policia.gob.do (179.51.71.227)
| Item | Detalle |
|------|---------|
| **IP** | 179.51.71.227 |
| **OS** | **Windows Server** |
| **HTTP** | Microsoft HTTPAPI httpd 2.0 |
| **Certificado** | *.policia.gob.do (Sectigo) |

### Firewall WAF
| Item | Detalle |
|------|---------|
| **Proveedor** | **Imperva Incapsula** |
| **IPs** | 45.60.86-115.180 (Singapore) |
| **Protege** | policianacional.gob.do, denuncias.policia.gob.do, spgd.pn.gob.do |

---

## 3. HALLAZGOS CRÍTICOS

### 🔴 H1 — WordPress REST API expone usuarios
**Endpoint:** `https://www.policianacional.gob.do/wp-json/wp/v2/users`
**Datos expuestos:**
| ID | Nombre | Slug | Link |
|----|--------|------|------|
| 1 | policianacional | policianacional | /author/policianacional/ |
| 3 | Rubén Castillo | ruben-castillo | /author/ruben-castillo/ |
| 4 | Dirección Comunicaciones Estratégicas | manuel-logrono | /author/manuel-logrono/ |
| 5 | Documentacion Policial | profugos | /author/profugos/ |

### 🔴 H2 — WordPress REST API full exposure (26 namespaces)
Plugins detectados desde `/wp-json/`:
- **Contact Form 7** (contact-form-7/v1) — CSRF, file upload
- **Akismet** (akismet/v1) — API key management endpoints
- **Site Reviews** (site-reviews/v1) — query params filtrables
- **WP Google Maps** (wpgmza/v1) — full CRUD en markers/maps
- **Userway** (userway/v1) — accessibility plugin
- **Duplicate Post** (duplicate-post/v1)
- **All In One SEO** (aios/v1/onboarding)
- **WP-Abilities** (wp-abilities/v1) — **EJECUCIÓN DE CÓDIGO** (/abilities/{name}/run)
- Batch API endpoint `/batch/v1`

### 🔴 H3 — WP-Abilities plugin (Ejecución remota)
**Endpoint:** `wp-abilities/v1/abilities/{name}/run`
Permite GET, POST, PUT, PATCH, DELETE con parámetro `input` de cualquier tipo.
⚠️ **Potencial RCE si hay una ability registrada.**

### 🔴 H4 — Umbraco CMS en denuncias.policia.gob.do
**Path:** `/umbraco/` — 200 OK
**Path:** `/umbraco/login.aspx` — 200 OK
**Path:** `/umbraco/backoffice` — 200 OK
Umbraco es un CMS ASP.NET. Login panel accesible públicamente.

### 🔴 H5 — Google Maps API Key expuesta
**Key:** `AIzaSyAe7ooDHtbmwnVJ2Pjo3n53q0Or5TChCnM`
**Ubicación:** En el HTML de `denuncias.policia.gob.do/OfficialComplaint`
**Estado:** REQUEST_DENIED para APIs legacy — pero puede tener otras APIs habilitadas (Places, Geocoding, etc.)

### 🟡 M1 — reCAPTCHA Site Key expuesta
**Key:** `6Ld70pkgAAAAAIZVKtdDrLgFu6xLqBMQymvTACOH`
Útil para ataques de billing/proxy scoring bypass.

### 🟡 M2 — Zabbix Monitoring expuesto
**Subdominio:** monitoreozabbix.policianacional.gob.do
Probablemente Zabbix dashboard accesible desde internet. Timeout desde VPS (Imperva bloquea), pero puede ser accesible desde IP residencial.

### 🟡 M3 — Plesk Obsidian 18.0.77
En el mail server (179.51.71.226:443). Plesk panel expuesto a internet.
Panel de administración de hosting Windows con MailEnable.

### 🟡 M4 — MailEnable 10.55 WebMail
**URL:** `https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx`
MailEnable WebMail con login público. Fondo personalizado con logo de la PN.
**Headers:** ASP.NET 4.0.30319, IIS 10.0, Session ID en cookie.

### 🟡 M5 — IIS Windows Server página default
**URL:** `https://portalservicios.policianacional.gob.do/`
Muestra la página default de IIS (iisstart.png). Servidor sin configurar o en desarrollo.

### 🟡 M6 — Cardnet Payment Gateway Integration
**URL:** `https://ecommerce.cardnet.com.do/sirite/pasarela-pago/`
La PN usa Cardnet (BHD/Banco Popular) para pagos en línea.
Endpoint de transacción: `/pasarela-pago/transaccion`
Parámetros: codigoCentroRecaudacion, codigoServicio, montoServicio, numeroDocumento, tipoDocumento

### ℹ️ I1 — API de Denuncias (pn-vcomplaint-service)
**Host:** pn-vcomplaint-service.policia.gob.do
**Respuesta:** 403 Forbidden (IIS 10.0 + ASP.NET)
API REST para el servicio de denuncias virtuales. Endpoints existen pero requieren auth.

### ℹ️ I2 — arco.policia.gob.do (403)
Sistema interno ARCO (quizás Archivo o algún acrónimo). 403 con IIS/ASP.NET.

---

## 4. APLICACIONES MÓVILES

### Denuncias Virtuales
| Item | Detalle |
|------|---------|
| **Package** | `com.policianacional.denunciavirtual` |
| **Play Store** | `Policia Nacional Dominicana` (developer) |
| **Última versión** | 1.0.30 (Sep 2025) |
| **Descargas** | 50,000+ |
| **Rating** | 3.6⭐ (209 reviews) |
| **iOS** | App Store: Denuncias Virtuales |
| **Sitio** | https://denuncias.policia.gob.do/ |
| **Email** | denunciasvirtuales@policia.gob.do |
| **Teléfono** | +1 829-520-5151 |
| **Permisos peligrosos** | Location (GPS+Network), Phone (llamar, leer estado), Cámara, Micrófono, Almacenamiento, ID del dispositivo |
| **Contacto dev** | ale_8000@hotmail.com |

### PSP: Servicios Policiales
| Item | Detalle |
|------|---------|
| **Package** | `com.policiard.psp` |
| **Última versión** | 1.20 (Jun 2026) |
| **Propósito** | App interna para miembros de la Policía Nacional |
| **Backend** | psp.policia.gob.do (Microsoft-HTTPAPI/2.0) |

### Token Policia Nacional
| Item | Detalle |
|------|---------|
| **Disponible** | iOS App Store |
| **Propósito** | Autenticación 2FA / Token de seguridad |

---

## 5. VECTORES DE ATAQUE POTENCIALES

| # | Vector | Severidad | Descripción |
|---|--------|-----------|-------------|
| 1 | **WP-Abilities RCE** | 🔴 Crítica | `/wp-abilities/v1/abilities/{name}/run` podría permitir ejecución remota |
| 2 | **Umbraco login público** | 🔴 Alta | Panel expuesto sin rate limiting aparente |
| 3 | **MailEnable cred spray** | 🟡 Media | Login público en webmail.policia.gob.do |
| 4 | **Plesk panel expuesto** | 🟡 Media | Puerto 443 con Plesk Obsidian en mail server |
| 5 | **Zabbix externo** | 🟡 Media | monitoreozabbix.policianacional.gob.do — posible acceso desde IP residencial |
| 6 | **Google API Key abuse** | 🟡 Media | AIzaSyAe7ooDHtbmwnVJ2Pjo3n53q0Or5TChCnM — verificar qué APIs tiene habilitadas |
| 7 | **WP User Enum** | 🟢 Baja | 4 usuarios expuestos vía REST API |
| 8 | **CF7 SSRF** | 🟢 Baja | Contact Form 7 podría tener SSRF vía oEmbed |
| 9 | **WPGMZA Data leak** | 🟢 Baja | WP Google Maps REST API expone markers, polygons, geocode cache |
| 10 | **Imperva bypass** | 🟡 Media | Si se encuentra la IP real del origen, el WAF se evade completamente |
| 11 | **Direct IP access** | 🟡 Media | 179.51.71.226-227 son IPs reales sin WAF |
| 12 | **pn-vcomplaint-service API** | 🟡 Media | Endpoints REST existen pero requieren autenticación — probar IDOR |

---

## 6. WORDPRESS PLUGINS DETECTADOS

| Plugin | Endpoint REST | Riesgo |
|--------|---------------|--------|
| Contact Form 7 | `/contact-form-7/v1` | SSRF, file upload |
| Akismet | `/akismet/v1` | Anti-spam (bajo) |
| Site Reviews | `/site-reviews/v1` | Filtros query |
| WP Google Maps | `/wpgmza/v1` | CRUD markers, data leak |
| Userway | `/userway/v1` | Accesibilidad |
| Duplicate Post | `/duplicate-post/v1` | Duplicación |
| All In One SEO | `/aios/v1/onboarding` | SEO |
| **WP-Abilities** | **`/wp-abilities/v1`** | **⚠️ POSIBLE RCE** |
| Impreza Theme | (theme) | US Builder page builder |

---

## 7. RECOMENDACIONES INMEDIATAS

1. **Deshabilitar `/wp-json/wp/v2/users`** — info disclosure de usuarios
2. **Restringir `/umbraco/`** — el login panel no debería ser público
3. **Rotar Google Maps API Key** — o restringir por HTTP referrer
4. **Mover Zabbix a VPN interna** — monitoreo no debería estar en DNS público
5. **Revisar WP-Abilities plugin** — verificar qué abilities están registradas
6. **Desactivar página default de IIS** en portalservicios.policianacional.gob.do
7. **Configurar rate limiting** en webmail y Umbraco login

---

*Reporte generado el 15 julio 2026. Shodan credits usados: ~12 de 90.*
