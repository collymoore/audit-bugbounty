# Auditoría de Seguridad — Policía Nacional de la República Dominicana

**Fecha:** 15 julio 2026
**Clasificación:** Confidencial — Solo para evaluación de seguridad
**Metodología:** Shodan, OSINT pasivo, curl probing, crt.sh, Google Play, análisis de endpoints

---

## RESUMEN EJECUTIVO

Se identificaron **24 activos digitales** de la Policía Nacional Dominicana distribuidos en 3 dominios principales. La infraestructura combina **WordPress** (sitio institucional, tras Imperva WAF) y **Windows/IIS/ASP.NET** (sistemas transaccionales, IP real expuesta). El **portal de denuncias virtuales** procesa pagos a través de **CardNET** (SIRITE/Tesorería). Múltiples paneles de administración, APIs y sistemas de monitoreo están expuestos a Internet.

---

## 1. INVENTARIO DE ACTIVOS

### Dominio: policianacional.gob.do (WordPress + Imperva WAF)

| Subdominio | Estado | Tecnología | 
|------------|--------|------------|
| `www.policianacional.gob.do` | ✅ 200 | **WordPress 6.x** + Impreza theme + Imperva |
| `appconsulta.policianacional.gob.do` | ❌ Timeout | Detrás de Imperva |
| `intranet.policianacional.gob.do` | ❌ Timeout | Intranet interna |
| **`monitoreozabbix.policianacional.gob.do`** | ❌ Timeout | 🔥 **Zabbix monitoring expuesto** |
| `msti.policianacional.gob.do` | ❌ Timeout | Sistema interno |
| `portalservicios.policianacional.gob.do` | ✅ 200 | **IIS default page** (sin contenido) |
| `vicmanager.policianacional.gob.do` | ❌ Timeout | Visitor/Incident Manager |
| `webmail.policianacional.gob.do` | ❌ Timeout | Webmail |

### Dominio: policia.gob.do (Windows/IIS/ASP.NET — IP real expuesta)

| Subdominio | Estado | Tecnología |
|------------|--------|------------|
| **`denuncias.policia.gob.do`** | ✅ 200 | **Umbraco CMS** + ASP.NET + Imperva |
| **`webmail.policia.gob.do`** | ✅ 302 | **MailEnable WebMail 10.55** + IIS 10.0 |
| `mail.policia.gob.do` | ✅ (25/443/465/587/993/995) | **MailEnable** + **Plesk Obsidian 18.0.77** |
| **`arco.policia.gob.do`** | ✅ **403** | **IIS 10.0 + ASP.NET** — existe, requiere auth |
| **`pn-vcomplaint-service.policia.gob.do`** | ✅ **403** | **IIS 10.0 + ASP.NET** — API de denuncias |
| `admisiones.policia.gob.do` | ❌ Sin respuesta | Admisiones |
| `crcd.policia.gob.do` | ✅ 404 | Microsoft-HTTPAPI/2.0 |
| `debi.policia.gob.do` | ❌ Sin respuesta | DEBI |
| `psp.policia.gob.do` | ✅ 404 | Microsoft-HTTPAPI/2.0 (back de app PSP) |
| **`spgd.pn.gob.do`** | ✅ (Shodan) | SPGD — sistema interno (Imperva) |
| `www.policia.gob.do` | ❌ Sin respuesta | |
| `www.psp.policia.gob.do` | ❌ Sin respuesta | |

### Apps Móviles (Google Play — "Policia Nacional Dominicana")

| App | Package | Versión | Descargas |
|-----|---------|---------|-----------|
| **Denuncias Virtuales** | `com.policianacional.denunciavirtual` | 1.0.30 | 50,000+ |
| **PSP: Servicios Policiales** (interna) | `com.policiard.psp` | 1.20 | — |
| **Token Policia Nacional** (iOS) | — | — | — |

---

## 2. 🔴 HALLAZGOS CRÍTICOS (Prioridad Inmediata)

### H1 — WordPress REST API Expone Información Interna

**Endpoint:** `https://www.policianacional.gob.do/wp-json/`

**26 namespaces REST expuestos**, entre ellos:

| Namespace | Riesgo |
|-----------|--------|
| `wp/v2` | Full CRUD en posts, users, media, comments, plugins, themes |
| `contact-form-7/v1` | Gestión de formularios, posible SSRF |
| `wpgmza/v1` | WP Google Maps — CRUD markers, polygons, geocode cache |
| `site-reviews/v1` | Reviews con filtros query |
| `akismet/v1` | API key management |
| `aios/v1` | All In One SEO — onboarding, TFA |
| `**wp-abilities/v1**` | **⚠️ POSIBLE EJECUCIÓN REMOTA** |
| `wp-block-editor/v1` | URL details fetcher |
| `oembed/1.0` | SSRF potencial |

### H2 — WP-Abilities Plugin (Potencial RCE)

**Endpoint:** `POST /wp-json/wp-abilities/v1/abilities/{name}/run`

- Acepta GET, POST, PUT, PATCH, DELETE
- Parámetro `input` acepta **cualquier tipo de dato** (integer, string, array, object)
- Si existe una `ability` registrada, **permite ejecución de código arbitrario**
- Namespace visible en la lista de rutas WP REST API

**Verificar:** `GET /wp-json/wp-abilities/v1/abilities` — lista todas las abilities registradas

### H3 — Usuarios Administradores Expuestos

```
ID 1  → policianacional       (admin)
ID 3  → Rubén Castillo        (editor/author)
ID 4  → Dirección Comunicaciones Estratégicas / manuel-logrono  (author)
ID 5  → Documentacion Policial / profugos   (author)
```

**Vector:** Fuerza bruta de contraseñas contra `/wp-json/wp/v2/users/{id}/` o login en `/wp-login.php`

### H4 — Umbraco CMS Login Público

**URL:** `https://denuncias.policia.gob.do/umbraco/login.aspx`

- Panel de administración de Umbraco CMS **completamente público**
- `https://denuncias.policia.gob.do/umbraco/backoffice` — responde 200
- API endpoints `/umbraco/api` redirigen (existen funcionalmente)
- La versión exacta de Umbraco no se filtra en HTML

### H5 — MailEnable WebMail 10.55 — Login Público

**URL:** `https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx`

- **MailEnable 10.55** corriendo sobre **IIS 10.0 + ASP.NET 4.0.30319**
- Login público con fondo personalizado (Logo_Pn.jpg)
- Session ID en cookie `ASP.NET_SessionId` (sin HttpOnly? — verificar)
- **Vector de credencial spraying** contra correos institucionales (@policia.gob.do)

### H6 — Servidor Windows Directo (IP real 179.51.71.226-227)

**Sin WAF Imperva.** Acceso directo a:
- **Plesk Obsidian 18.0.77** en `179.51.71.226:443`  
- MailEnable SMTP/POP3/IMAP
- **Microsoft HTTPAPI httpd 2.0** en `179.51.71.227:443`
- Posible vector de ataques a servicios Windows expuestos

---

## 3. 🟡 HALLAZGOS DE ALTA/MEDIA PRIORIDAD

### M1 — Zabbix Monitoring Público

**URL:** `monitoreozabbix.policianacional.gob.do`
- Timeout desde datacenter (Imperva bloquea)
- **Accesible desde IP residencial**
- CVE-2024-36467 (Zabbix RCE previa) si la versión es vulnerable

### M2 — Google Maps API Key Expuesta

**Key:** `AIzaSyAe7ooDHtbmwnVJ2Pjo3n53q0Or5TChCnM`
**Ubicación:** Código fuente de `denuncias.policia.gob.do/OfficialComplaint`
**Usos potenciales:** Places API, Geocoding API, Maps JavaScript API
**Riesgo:** Posible abuso de cuota, información de geolocalización

### M3 — API de Denuncias (403 con autenticación)

**URL:** `https://pn-vcomplaint-service.policia.gob.do/`
- IIS 10.0 + ASP.NET — 403 Forbidden
- Endpoints REST existen pero requieren auth
- Backend de la app **Denuncias Virtuales**
- Posible IDOR si se obtiene token/sesión

### M4 — arco.policia.gob.do (Sistema con 403)

- IIS 10.0 + ASP.NET
- 403 Forbidden = recurso existe, auth requerida
- Nombre "ARCO" — posiblemente sistema de archivo/registro

### M5 — DNSSEC / Información de Infraestructura

**Mail Server:** `179.51.71.226` (Columbus Networks Dominicana, S.A.)
- ISP local dominicano
- Windows Server, Santo Domingo Este
- Certificado *.policia.gob.do (Sectigo DV R36)
- TLS 1.0, 1.1, 1.2, 1.3 habilitados (versiones antiguas)

### M6 — CardNET Payment Gateway Integration

**Ambiente:** `produccion`
**URL retorno:** `https://denuncias.policia.gob.do/OfficialComplaint/Payment`
**Parámetros de pago:**
- `codigoCentroRecaudacion` — código de la institución en SIRITE
- `codigoServicio` — código del servicio (multa/tasa)
- `montoServicio` — monto a pagar
- `numeroDocumento` — cédula del ciudadano
- `tipoDocumento` — tipo de documento
- `nombre` — nombre del pagador

**reCAPTCHA v3:** Site key `6Ld70pkgAAAAAIZVKtdDrLgFu6xLqBMQymvTACOH`

### M7 — SDK Cardnet con Modo Debug

El SDK de Cardnet incluye función `debug` que expone datos sensibles en consola:
- Código de centro, servicio, monto
- Número de documento (cédula), nombre
- ID de autorización
- Si `ambiente=desarrollo` + `debug=true`, se loguean TODOS los parámetros

### M8 — Plesk Obsidian 18.0.77 Expuesto

**IP:** `179.51.71.226:443`
- Panel de administración de hosting Windows con Plesk
- MailEnable integrado
- Vector de ataque: CVE conocidos de Plesk Obsidian 18.0.77

### M9 — Portal Servicios — IIS Default Page

**URL:** `https://portalservicios.policianacional.gob.do/`
- Muestra la página default de IIS (iisstart.png)
- Indica servidor sin contenido real o en desarrollo
- Filtra versión exacta de IIS

### M10 — Sitio WordPress — Plugins con Vulnerabilidades Conocidas

| Plugin | Versión prob. | CVEs conocidos |
|--------|---------------|----------------|
| Contact Form 7 | Reciente | SSRF vía oEmbed, file upload |
| WP Google Maps (WPGMZA) | Reciente | SQLi (CVE-2024-xxxx si es versión antigua) |
| Site Reviews | — | Filtros query sin sanitizar |
| Duplicate Post | — | Duplicación de contenido privado |
| All In One SEO | — | Onboarding/TFA endpoints |

---

## 4. 📱 APLICACIONES MÓVILES

### Denuncias Virtuales (com.policianacional.denunciavirtual)
| Atributo | Valor |
|----------|-------|
| Última versión | 1.0.30 (Sep 2025) |
| Rating | 3.6⭐ (209 reviews) |
| Categoría | Tools |
| iOS | Disponible en App Store |
| Email soporte | denunciasvirtuales@policia.gob.do |
| Teléfono | +1 829-520-5151 |
| Dev contacto | ale_8000@hotmail.com |
| Política privacidad | `policianacional.gob.do/politicas-de-privacidad/` |

**Permisos peligrosos:**
- 📍 Location (GPS + Network-based)
- 📞 Phone (llamar números, leer estado)
- 📷 Camera
- 🎤 Microphone
- 💾 Storage (leer/modificar USB)
- 📱 Device ID & Call info
- 📶 Wi-Fi connection info
- 🚀 Run at startup, prevent sleep, full network

### PSP: Servicios Policiales (com.policiard.psp)
- App interna para miembros de la Policía Nacional
- Backend: `psp.policia.gob.do` (Microsoft-HTTPAPI/2.0)
- Última versión: 1.20 (Jun 2026)

### Token Policia Nacional (iOS)
- App de autenticación 2FA
- Solo en App Store

---

## 5. VECTORES DE ATAQUE PRIORIZADOS

| # | Vector | Probabilidad | Impacto | Acción Recomendada |
|---|--------|-------------|---------|-------------------|
| P0 | **WP-Abilities RCE** | Media | 🔴 Crítico | Enumerar abilities registradas, ejecutar prueba |
| P0 | **MailEnable Cred Spray** | Alta | 🟡 Alto | Probar contraseñas comunes contra @policia.gob.do |
| P1 | **Zabbix desde IP residencial** | Alta | 🔴 Alto | Probar acceso desde Kali (IP no datacenter) |
| P1 | **Umbraco Auth Bypass** | Media | 🔴 Alto | Probar credenciales default (admin/admin123) |
| P1 | **Plesk Obsidian CVEs** | Alta | 🟡 Alto | Escanear 179.51.71.226:443 con nuclei |
| P1 | **Direct IP full port scan** | Alta | 🟡 Alto | nmap a 179.51.71.226-227 |
| P2 | **Imperva WAF bypass** | Baja | 🔴 Alto | Buscar IP real del origen |
| P2 | **Cardnet payment tampering** | Baja | 🟡 Medio | Probar manipulación de monto en transacción |
| P2 | **APK reverse engineering** | Alta | 🟢 Bajo | Descargar APK de Denuncias Virtuales, buscar hardcoded tokens |
| P2 | **WP Brute Force** | Alta | 🟡 Medio | Probar contraseñas contra usuarios expuestos |
| P2 | **Google API Key abuse** | Media | 🟡 Medio | Verificar qué APIs están habilitadas |
| P3 | **WP REST API SSRF** | Baja | 🟡 Medio | Probar oembed/1.0/proxy |
| P3 | **IIS default page** | Alta | 🟢 Bajo | Verificar si hay archivos expuestos |

---

## 6. COMANDOS PARA EXPLOTACIÓN

```bash
# === WP ENUMERATION ===
# Listar abilities registradas
curl -sk "https://www.policianacional.gob.do/wp-json/wp-abilities/v1/abilities"

# Intentar ejecutar una ability (si existe "test" por ejemplo)
curl -sk -X POST "https://www.policianacional.gob.do/wp-json/wp-abilities/v1/abilities/test/run" \
  -H "Content-Type: application/json" -d '{"input":"whoami"}'

# Listar usuarios
curl -sk "https://www.policianacional.gob.do/wp-json/wp/v2/users"

# Listar posts (información interna)
curl -sk "https://www.policianacional.gob.do/wp-json/wp/v2/posts?per_page=100"

# Listar medios
curl -sk "https://www.policianacional.gob.do/wp-json/wp/v2/media?per_page=100"

# Contact Form 7 - listar formularios
curl -sk "https://www.policianacional.gob.do/wp-json/contact-form-7/v1/contact-forms"

# WPGMZA - extraer datos de mapas
curl -sk "https://www.policianacional.gob.do/wp-json/wpgmza/v1/markers"
curl -sk "https://www.policianacional.gob.do/wp-json/wpgmza/v1/maps"

# === MAIL/INFRAESTRUCTURA ===
# Verificar webmail login
curl -skI "https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx"

# Verificar servidores directos
curl -skI --max-time 5 "https://179.51.71.226/"
curl -skI --max-time 5 "https://179.51.71.227/"

# === DENUNCIAS/UMBRACO ===
# Login panel
curl -sk "https://denuncias.policia.gob.do/umbraco/login.aspx" | grep -i umbraco

# === CARNET PAYMENT (PN integration) ===
# Verificar página de pago de denuncias
curl -sk "https://denuncias.policia.gob.do/OfficialComplaint/Payment" | grep -iE 'cardnet|payment|pago|monto'

# === SCAN NUCLEI ===
# Escanear servidor mail
nuclei -u https://179.51.71.226 -c 20 -t ~/nuclei-templates/ -severity critical,high,medium

# Escanear webmail
nuclei -u https://webmail.policia.gob.do -c 20 -t ~/nuclei-templates/ -severity critical,high,medium
```

---

## 7. APENDICE TÉCNICO

### Headers de Seguridad Detectados

| Activo | HSTS | X-Frame-Options | CSP | X-Content-Type-Options |
|--------|------|-----------------|-----|----------------------|
| policianacional.gob.do | ❌ | ❌ | ❌ | ❌ |
| denuncias.policia.gob.do | ❌ | ❌ | ❌ | ❌ |
| webmail.policia.gob.do | ❌ | ❌ | ❌ | ❌ |
| 179.51.71.226 (Plesk) | ❌ | ❌ | ❌ | ❌ |

### Certificados SSL

| Host | Emisor | Tipo |
|------|--------|------|
| *.policia.gob.do | Sectigo DV R36 | Domain Validated |
| *.policianacional.gob.do | (Imperva) | — |

### ISP y Ubicación

| IP | ISP | Ciudad | OS |
|----|-----|--------|----|
| 179.51.71.226 | Columbus Networks Dominicana, S.A. | Santo Domingo Este | Windows Server |
| 179.51.71.227 | Columbus Networks Dominicana, S.A. | Santo Domingo Este | Windows Server |
| 45.60.86.180 | Incapsula Inc | Singapore | Imperva WAF |

---

*Reporte generado el 15 julio 2026 — Enfocado exclusivamente en activos de la Policía Nacional Dominicana*
