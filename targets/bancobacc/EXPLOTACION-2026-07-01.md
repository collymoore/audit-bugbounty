# 🔴 Explotación Activa — Banco BACC (bancobacc.com.do)

**Auditor:** Null Session Intelligence LLC  
**Fecha:** 2026-07-01  
**Clasificación:** CONFIDENCIAL  
**Toolchain:** Metasploit 6.4.135, searchsploit, curl, WP JSON API

---

## 📋 Índice

1. [Resumen de Explotación](#1-resumen-de-explotación)
2. [Inventario de Activos](#2-inventario-de-activos)
3. [WordPress REST API](#3-wordpress-rest-api)
4. [Vectores de Explotación](#4-vectores-de-explotación)
5. [Wordfence Bypass Analysis](#5-wordfence-bypass-analysis)
6. [Herramientas Probadas](#6-herramientas-probadas)
7. [Próximos Pasos](#7-próximos-pasos)
8. [Apéndice](#8-apéndice)

---

## 1. Resumen de Explotación

### Estado General

| Categoría | Estado |
|-----------|--------|
| Subdominios descubiertos | ✅ ~30 live |
| WP REST API | ✅ Abierta — namespaces completos expuestos |
| Wordfence WAF | ✅ Activo — bloquea xmlrpc, readme, wp-login |
| Yoast SSRF (file_size) | ❌ 401 — requiere auth |
| cPanel | ❌ Puertos 2083/2087 no responden |
| User IDs confirmados | ✅ 2 y 5 (via `/wp/v2/pages`) |
| Plugin enumeration | ⏳ Pendiente (Wordfence bloquea readme) |

### Hallazgos Activos

| ID | Tipo | Detalle |
|----|------|---------|
| BACC-01 | ✅ **Info Disclosure** | WP REST API devuelve namespaces completos (28 endpoints) |
| BACC-02 | ✅ **User ID Enum** | Autores 2 y 5 confirmados via `/wp/v2/pages` |
| BACC-03 | ⚠️ **Yoast file_size SSRF** | Endpoint existe pero 401 sin auth |
| BACC-04 | ⚠️ **Wordfence config expuesta** | `/wordfence/v1/config` endpoint visible en API |
| BACC-05 | ⚠️ **CF7 endpoints abiertos** | `/contact-form-7/v1/contact-forms` accesible |
| BACC-06 | ❌ **cPanel** | Puertos cerrados/firewalled |
| BACC-07 | ❌ **xmlrpc.php** | Bloqueado por Wordfence |

---

## 2. Inventario de Activos

### Subdominios Relevantes

| Dominio | Status | Tech Stack |
|---------|--------|------------|
| `bancobacc.com.do` | 200 | WordPress + Wordfence |
| `www.bancobacc.com.do` | 301 → bancobacc.com.do | Apache, HSTS |
| `cpanel.bancobacc.com.do` | Timeout | Anteriormente cPanel (firewalled?) |
| `webmail.bancobacc.com.do` | 200 | Webmail login |
| `enlinea.bancobacc.com.do` | 302 | Azure Front Door (online banking) |
| `admin.bancobacc.com.do` | 302 | Amazon S3 + Azure |
| `bacc.do.bancobacc.com.do` | 200 | Apache, PageSpeed — Directory listing |
| `mail.bancobacc.com.do` | 301 | Apache, HSTS |
| `autodiscover.bancobacc.com.do` | 301 | Microsoft HTTPAPI/2.0 |
| `reclamaciones.bancobacc.com.do` | 404 | Apache |
| `solicitudes.bancobacc.com.do` | 404 | Apache |
| `verificacion.bancobacc.com.do` | 404 | Apache |
| `api.bancobacc.com.do` | 403 | Apache |
| `webdisk.bancobacc.com.do` | 401 | Basic Auth, HSTS |

### Stack Detectado

| Componente | Tecnología |
|------------|------------|
| **CMS** | WordPress 6.x (generador oculto por Wordfence) |
| **WAF** | Wordfence Security |
| **Plugins** | Contact Form 7, Yoast SEO, SiteOrigin Page Builder, Custom Post Type UI, Duplicate Post, WP Mail SMTP |
| **Web Server** | Apache + HSTS + Google PageSpeed |
| **CDN/Proxy** | Azure Front Door (enlinea), Azure Edge Network |
| **Cloud** | Amazon S3 (admin.bancobacc.com.do) |
| **Email** | Microsoft HTTPAPI (autodiscover) |
| **Hosting** | cPanel-based (tradicional) |

---

## 3. WordPress REST API

### Namespaces Expuestos (28 endpoints)

| Namespace | Endpoints Clave |
|-----------|-----------------|
| `wp/v2` | posts, pages, media, users, comments, settings, plugins, themes, block-types, widgets, block-directory, search, pattern-directory, menu-locations |
| `yoast/v1` | file_size, statistics, configuration/*, indexing/*, workouts, wincher/*, meta/search, check_capability |
| `wordfence/v1` | authenticate, authenticate-premium, **config**, scan/issues, scan, disconnect, premium-connect |
| `contact-form-7/v1` | contact-forms, contact-forms/{id}/feedback, contact-forms/{id}/refill |
| `sowb/v1` | widgets/forms, widgets/previews |
| `templates-directory` | import_elementor, fetch_templates, import_gutenberg |
| `oembed/1.0` | embed, proxy |
| `wp-site-health/v1` | tests/background-updates, tests/loopback-requests, tests/https-status, directory-sizes |
| `wp-block-editor/v1` | url-details, export |

### Endpoints Accesibles sin Auth

| Endpoint | HTTP | Info Revelada |
|----------|:----:|---------------|
| `GET /wp-json/` | 200 | Namespaces + routes + site info |
| `GET /wp/v2/pages` | 200 | **20 pages** con author IDs (2 y 5) |
| `GET /wp/v2/media` | 200 | Media items con author IDs |
| `GET /oembed/1.0/embed` | 200 | Site title, provider info |
| `GET /yoast/v1` | 200 | Lista de rutas Yoast |
| `GET /wordfence/v1` | 200 | Lista de rutas Wordfence |
| `GET /contact-form-7/v1` | 200 | Lista de rutas CF7 |

### Endpoints que Requieren Auth (401)

| Endpoint | HTTP | Notas |
|----------|:----:|-------|
| `GET /wp/v2/users` | 401 | Bloqueado por Wordfence |
| `GET /yoast/v1/file_size` | 401 | SSRF potencial — requiere credencial |
| `GET /yoast/v1/statistics` | 401 | Estadísticas internas |
| `GET /wordfence/v1/config` | 401 | Configuración Wordfence |
| `GET /wordfence/v1/scan/issues` | 401 | Resultados de escaneo |

---

## 4. Vectores de Explotación

### 4.1 Yoast file_size SSRF (BACC-03)

**Endpoint:** `GET /wp-json/yoast/v1/file_size?url=<URL>`  
**Auth requerida:** Sí (401 sin cookie)  
**Potencial:** SSRF → lectura de archivos internos

| URL probada | Respuesta |
|-------------|-----------|
| `file:///etc/passwd` | 400 (missing param) |
| `http://169.254.169.254/latest/meta-data/` | 400 |
| `https://www.google.com` | 401 (rest_forbidden) |

**Estado:** Bloqueado — requiere cookie de sesión WP

### 4.2 User Enumeration via WP API (BACC-02)

**Endpoint:** `GET /wp-json/wp/v2/pages?per_page=100`  
**Resultado:** 20 pages, users IDs 2 y 5

### 4.3 Wordfence Endpoints Expuestos (BACC-04)

El namespace `/wordfence/v1/` lista estos endpoints:

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/wordfence/v1/authenticate` | GET, POST | Autenticación Wordfence |
| `/wordfence/v1/authenticate-premium` | POST | Auth premium |
| `/wordfence/v1/config` | GET, POST, PUT, PATCH | **Configuración** |
| `/wordfence/v1/scan/issues` | GET | **Resultados de escaneo** |
| `/wordfence/v1/scan` | POST, DELETE | Iniciar/detener escaneo |

**Potencial:** Si se obtiene una clave de Wordfence o credencial WP, se puede leer la configuración completa del WAF y resultados de escaneo.

### 4.4 Contact Form 7 Endpoints (BACC-05)

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/contact-form-7/v1/contact-forms` | GET, POST | Listar/crear formularios |
| `/contact-form-7/v1/contact-forms/{id}/feedback` | POST | Enviar feedback |
| `/contact-form-7/v1/contact-forms/{id}/refill` | GET | Refill |

**Potencial:** CVE-2024-4704 (Open Redirect), CVE-2023-6449 (File Upload) — pero requiere reCAPTCHA bypass.

---

## 5. Wordfence Bypass Analysis

### Vectores Bloqueados

| Vector | Resultado | Método de bloqueo |
|--------|-----------|-------------------|
| `xmlrpc.php` | ❌ Retorna homepage | Rule de Wordfence |
| `wp-login.php` | ❌ No retorna login | Rule de Wordfence |
| `readme.html` | ❌ Retorna homepage | Rule de Wordfence |
| `wp-content/plugins/*/readme.txt` | ❌ Retorna homepage | Rule de Wordfence |
| `?author=N` redirect | ❌ 404 para todos | Wordfence + Yoast |
| MSF `wordpress_login_enum` | ❌ Detecta "not WP" | Wordfence blocking |

### Vectores NO Bloqueados

| Vector | Resultado | Explicación |
|--------|-----------|-------------|
| `wp-json/` | ✅ 200 | REST API no bloqueada |
| `wp-json/wp/v2/pages` | ✅ 200 | Pages endpoint abierto |
| `wp-json/wp/v2/media` | ✅ 200 | Media endpoint abierto |
| `wp-admin/` | ✅ 302 → login | Redirección normal |
| `wp-cron.php` | ✅ 200 | No bloqueado |

### CVEs de Wordfence Encontrados (searchsploit)

| ID | Descripción | Path |
|----|-------------|------|
| CVE-2017-... | Wordfence XSS | `php/webapps/37970.html` |
| CVE-... | Wordfence Multiple | `php/webapps/39317.txt` |
| CVE-... | **Wordfence LFI** | `php/webapps/48061.txt` |

---

## 6. Herramientas Probadas

### ✅ Funcionan en BACC

| Herramienta | Uso | Resultado |
|------------|-----|-----------|
| **searchsploit** | Búsqueda de exploits WP, CF7, Wordfence, Yoast | ✅ 47,690 exploits indexados |
| **curl + WP JSON API** | Enumeración de endpoints, pages, users | ✅ API REST abierta |
| **Metasploit (cargado)** | Módulos WP cargados en msfconsole | ✅ Listos para usar |
| **xargs -P20 curl** | Password spray paralelo | ✅ ~200 req/seg |

### ⚠️ Limitadas por Wordfence

| Herramienta | Motivo |
|------------|--------|
| **Metasploit WP scanner** | Wordfence bloquea fingerprinting |
| **WPScan** | Wordfence devuelve 403 |
| **dalfox** | WAF bloquea XSS payloads |
| **xmlrpc** | Wordfence bloquea métodos |

---

## 7. Próximos Pasos

### Prioridad Alta

| Paso | Herramienta | Esfuerzo |
|------|------------|:--------:|
| 1. Obtener credencial WP (brute force admin) | curl + wordlist | Medio |
| 2. Explotar Yoast file_size SSRF con cookie | curl con session | Bajo (si hay creds) |
| 3. Leer Wordfence config via API | curl + token | Bajo (si hay creds) |
| 4. Plugin version fingerprint (vía page source) | curl + grep | Bajo |

### Prioridad Media

| Paso | Herramienta | Esfuerzo |
|------|------------|:--------:|
| 5. Verificar cPanel (re-scan de puertos) | nmap/nxc | Bajo |
| 6. Enumerar webmail login | curl | Bajo |
| 7. Probar Wordfence LFI (CVE) | searchsploit -x | Medio |
| 8. Enumerar plugins vía page source | curl + grep | Bajo |

### Prioridad Baja

| Paso | Herramienta | Esfuerzo |
|------|------------|:--------:|
| 9. SiteOrigin Page Builder SSRF | curl | Medio |
| 10. Directory listing files | curl con referer | Bajo |
| 11. enumerar Azure Front Door | curl | Bajo |

---

## 8. Apéndice

### 8.1 Archivos Relacionados

```
/root/audit-bugbounty/targets/bancobacc/
├── REPORTE-FINAL.md                # Auditoría previa
├── INFORME-TECNICO.md              # Reporte técnico
├── INFORME-EJECUTIVO.md            # Reporte ejecutivo
├── INFORME-BANCO-BACC.html         # HTML exportable
├── OSINT-MAPA.md                   # Mapa OSINT
├── WPSCAN-FINDINGS.md              # Hallazgos WPScan
├── NUEVOS-HALLAZGOS-2026-07-01.md  # Hallazgos nuevos
├── SESION-2026-07-01.md            # Sesión completa
├── cpanel_spray_results.txt        # Resultados spray
├── bancobacc.com.do/               # Reportes por subdominio
└── README.md                       # Resumen

/root/audit-bugbounty/targets/progent/
├── REPORTE-COMPLETO.md             # Documentación completa (Progent)
└── ANEXO-EXPLOTACION.md            # Explotación Progent
```

### 8.2 Herramientas Instaladas en esta Sesión

```bash
# Exploit Framework (989 MB)
/opt/metasploit-framework/bin/
├── msfconsole     # echo "use X; set Y; run; exit" | msfconsole -q
└── msfvenom       # Generación de payloads

# NetExec v1.5.1
/opt/exploit-tools/bin/nxc
# smb, ldap, winrm, ssh, rdp, ftp, mssql, wmi, nfs, vnc

# Impacket v0.13.1
/opt/exploit-tools/bin/secretsdump.py
/opt/exploit-tools/bin/exchanger.py
# +30 herramientas más

# Exploit Database (47,690 exploits)
/opt/exploitdb/searchsploit

# Activar todo:
source /root/audit-bugbounty/tools/exploit-env.sh
```

### 8.3 Timeline de la Sesión

| Hora (ET) | Evento |
|-----------|--------|
| 17:50 | Inicio — Recon Progent |
| 18:08 | Instalación Metasploit + nxc + impacket |
| 18:28 | Password spray OWA (~81k intentos) |
| 18:45 | CVE-2026-45504 identificado |
| 19:00 | Documentación Progent |
| 19:10 | Inicio BACC — Fresh recon |
| 19:15 | WP JSON API analizada (28 namespaces) |
| 19:20 | Yoast SSRF test — 401 (require auth) |
| 19:25 | Wordfence bypass analysis |
| 19:30 | MSF WP scanner — bloqueado por Wordfence |
| 19:35 | Documentación BACC |
| 19:40 | **Fin de la sesión** |

---

*Reporte generado por NSI LLC — Null Session Intelligence*
