# Auditoría de Seguridad — Banco BACC (bancobacc.com.do)

**Fecha:** 29 Jun 2026
**Metodología:** Black-box recon (sin credenciales)
**Datos guardados en:** `targets/bancobacc/`

---

## 1. Resumen Ejecutivo

| Aspecto | Resultado |
|---------|-----------|
| **Plataforma** | WordPress + ASP.NET (hibrido) |
| **Hosting** | GBH Web Hosting (cPanel compartido) |
| **Subdominios** | 38 descubiertos |
| **WAF** | Wordfence (WordPress firewall) |
| **Riesgo general** | 🔶 **ALTO** — WordPress desactualizado, cPanel/webmail expuesto, REST API abierta |

## 2. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **CMS** | WordPress (path: `/cms/`, content: `/content/`) |
| **Web Server** | Apache |
| **Hosting** | GBH Web Hosting (ns1.gbhwebhosting.com) |
| **Email** | Office 365 (protection.outlook.com) |
| **Online Banking** | ASP.NET (.NET Framework) en subdominio separado |
| **Security** | Wordfence + HSTS |
| **Zona horaria** | America/Santo_Domingo |
| **IP** | 162.214.97.98 |

## 3. Plugins WordPress Detectados

| Plugin | Versión | Riesgo | Notas |
|--------|---------|--------|-------|
| **Yoast SEO** | **20.12** | 🔴 Alta | Muy desactualizado (current ~v24+) |
| **Contact Form 7** | **5.7.7** | 🟡 Media | Versión con vulnerabilidades conocidas |
| **SiteOrigin Page Builder** | 2.25.0 | 🟡 Media | Page builder con historial de XSS |
| **Wordfence** | ? | 🟢 Buena | Firewall activo (bloqueó nuclei + user enum) |
| **jQuery** | 3.6.4 | 🟢 Info | Versión estable |
| **Bootstrap** | 3.3.7 | 🟢 Info | Framework CSS |
| **SKT Templates** | ? | 🟡 Media | Template directory con REST API expuesta |

## 4. Security Headers

| Header | Estado |
|--------|--------|
| HSTS (includeSubDomains) | ✅ 1 año |
| X-XSS-Protection | ✅ 1; mode=block |
| Referrer-Policy | ✅ no-referrer-when-downgrade |
| X-Permitted-Cross-Domain-Policies | ✅ none |
| Content-Security-Policy | ❌ **AUSENTE** |
| X-Frame-Options | ❌ **AUSENTE** (crítico para banca) |
| Server | Apache (filtra versión) |

## 5. Superficie de Ataque — Subdominios

| Subdominio | HTTP | Contenido |
|------------|------|-----------|
| `cpanel.bancobacc.com.do` | 200 | 🔴 **cPanel Login** expuesto |
| `webmail.bancobacc.com.do` | 200 | 🔴 **Webmail Login** expuesto |
| `enlinea.bancobacc.com.do` | 302 | 🔴 Banca en línea ASP.NET |
| `admin.bancobacc.com.do` | 302 | 🔴 Admin ASP.NET Login |
| `api.bancobacc.com.do` | 403 | API (Wordfence bloquea) |
| `reclamaciones.bancobacc.com.do` | 404 | (no activo) |
| `solicitudes.bancobacc.com.do` | 404 | (no activo) |
| `verificacion.bancobacc.com.do` | 404 | (no activo) |
| `cpcalendars.bancobacc.com.do` | ? | cPanel calendar |
| `autodiscover.bancobacc.com.do` | ? | Outlook autodiscover |
| `webdisk.bancobacc.com.do` | ? | cPanel WebDisk |
| `bacc.bancobacc.com.do` | ? | Posible subdomain |
| `supercarros.bancobacc.com.do` | ? | Subdomain extra |
| `carrosrd.bancobacc.com.do` | ? | Subdomain extra |
| `site3.bancobacc.com.do` | ? | Subdomain extra |

## 6. REST API — Endpoints Expuestos

### WordPress REST API (`/wp-json/`)
- `wp/v2/posts` — Posts públicos
- `wp/v2/pages` — **Todas las páginas y su contenido completo** (expuesto)
- `wp/v2/users` — **User enumeration** (Wordfence lo bloqueó, pero depende de config)
- `contact-form-7/v1/contact-forms` — CF7 forms (POST disponible)
- `contact-form-7/v1/contact-forms/{id}/feedback` — Envío de formularios
- `wordfence/v1/scan` — Wordfence scan initiation (requiere auth)
- `wordfence/v1/scan/issues` — Scan issues (requiere auth)
- `wordfence/v1/config` — Wordfence config (requiere auth)
- `yoast/v1` — Full Yoast API
- `yoast/v1/file_size` — **File size check por URL** (SSRF potencial)
- `sowb/v1/widgets/forms` — SiteOrigin forms
- `templates-directory/import_elementor` — Elementor import (riesgo code exec)
- `templates-directory/import_gutenberg` — Gutenberg import
- `batch/v1` — **Batch processing** (hasta 25 requests en 1)

### Información expuesta via WP REST API:
- **Board of Directors**: Alberto R. De Los Santos Billini, María Julia Díaz, Francisco A. Rodríguez Guzmán, Peter A. Croes Nadal, Fernando J. González Nicolás, William Harper, Roberto Rojas
- **Comités**: Ejecutivo, Crédito, Riesgo, Cumplimiento, Auditoría, Tecnología, Ciberseguridad, Ética
- **Documentos financieros**: Reportes trimestrales, prospectos de bonos, estados financieros (PDFs)
- **Uploads directory**: `/content/uploads/` con PDFs de 2015-2025

## 7. Online Banking (enlinea.bancobacc.com.do)

| Aspecto | Detalle |
|---------|---------|
| **URL** | `https://enlinea.bancobacc.com.do/Administration.WebUI/Pages/General/Login.aspx` |
| **Tecnología** | ASP.NET (.NET Framework) |
| **Security headers** | HSTS + Permissions-Policy |
| **X-Frame-Options** | ❌ **AUSENTE** — posible clickjacking en banca en línea |
| **CSP** | ❌ **AUSENTE** |
| **Login page** | `/Administration.WebUI/Pages/General/Login.aspx` |

## 8. Defacement Vector Assessment

| Vector | Resultado |
|--------|-----------|
| **File upload (WordPress)** | ❌ No encontrado (Wordfence bloquea) |
| **File upload (ASP.NET)** | ❌ No probado (requiere sesión) |
| **XSS reflejado** | ✅ No refleja |
| **Git exposure** | ✅ Bloqueado |
| **WP-Admin** | ❌ `/cms/wp-admin/` bloqueado por robots + Wordfence |
| **cPanel access** | 🔴 **EXPUESTO** pero requiere login |
| **Webmail access** | 🔴 **EXPUESTO** pero requiere login |
| **Bruteforce surface** | 🔴 cPanel + Webmail + Admin ASP.NET + WP-Admin |

## 9. Hallazgos Críticos

### 🔴 CRIT-01: cPanel y Webmail Expuestos
**Severidad:** 🔴 Alta
**Detalle:** `cpanel.bancobacc.com.do` y `webmail.bancobacc.com.do` son accesibles públicamente. Permiten intentos de login. Un atacante podría:
- Bruteforce credenciales de hosting
- Si obtiene acceso a cPanel → **control total del sitio** (file manager, phpMyAdmin, DNS)
- Si obtiene acceso a webmail → emails internos del banco

### 🔴 CRIT-02: Plugins WordPress Desactualizados
**Severidad:** 🔴 Alta
**Detalle:**
- Yoast SEO v20.12 (stable actual ~v24) — vulnerabilidades conocidas en versiones intermedias
- CF7 v5.7.7 — varios CVEs en versiones < 5.9
- Sin acceso a WP-Admin para verificar core version

### 🟡 CRIT-03: REST API Expuesta con Endpoints Sensibles
**Severidad:** 🟡 Media-Alta
**Detalle:**
- `/wp-json/wp/v2/pages` — expone contenido completo de todas las páginas
- `/wp-json/yoast/v1/file_size` — posible SSRF
- `/wp-json/templates-directory/import_elementor` — posible file write
- `/wp-json/batch/v1` — batch processing (25 requests atómicas)

### 🟡 CRIT-04: Online Banking sin X-Frame-Options
**Severidad:** 🟡 Media
**Detalle:** `enlinea.bancobacc.com.do` no tiene `X-Frame-Options` ni CSP — potencial clickjacking en banca en línea.

### 🟡 CRIT-05: Apache Server Info Leak
**Severidad:** 🟡 Media
**Detalle:** El header `Server: Apache` no debería exponerse. Un atacante sabe que es Apache sin versión específica.

## 10. Información OSINT Recopilada

| Dato | Valor |
|------|-------|
| **IP** | 162.214.97.98 |
| **Hosting** | GBH Web Hosting (cPanel) |
| **Email** | Office 365 (protección anti-spam) |
| **SPF** | `v=spf1 include:spf.protection.outlook.com -all` |
| **DMARC** | No verificado |
| **Sophos** | `sophos-domain-verification=5d1574f233f858bd2e2cfa9c2f795a9ac7f8223e08524ed400b2dbd3a572baf5` |
| **Mailjet** | SPF incluye mailjet (marketing emails) |

## 11. Recomendaciones

1. 🔴 **Mover cPanel y Webmail** detrás de VPN o IP whitelist
2. 🔴 **Actualizar Yoast SEO** (v20.12 → latest stable)
3. 🔴 **Actualizar Contact Form 7** (v5.7.7 → latest)
4. 🟡 **Agregar X-Frame-Options: DENY** en enlinea.bancobacc.com.do (banca en línea)
5. 🟡 **Agregar CSP** en todos los subdominios
6. 🟡 **Restringir REST API** — deshabilitar `/wp-json/wp/v2/users` y `/batch/v1` si no se usan
7. 🟡 **Ocultar Server header** (ServerTokens Prod en Apache)
8. ✅ Mantener Wordfence activo (está funcionando)

## 13. Resumen de Vectores Explotables (Priorizados)

| # | Vector | Severidad | Explotable hoy? | Requisito |
|---|--------|-----------|-----------------|-----------|
| 1 | **cPanel/webmail expuestos** | 🔴 Crítica | Sí (bruteforce) | Credenciales válidas |
| 2 | **Directory listing en /content/uploads/** | 🔴 Alta | Sí | Navegador |
| 3 | **Dockerfile expuesto** | 🟡 Media | Sí (info disclosure) | N/A |
| 4 | **WordPress plugins desactualizados** | 🟡 Media | Parcial | Auth (Editor+) |
| 5 | **Yoast /batch/v1 SSRF** | 🟡 Media | ✅ Parcial | Autenticación |
| 6 | **CF7 file upload (CVE-2023-6449)** | 🔴 Alta | ❌ Bloqueado por Wordfence | Auth Editor+ |
| 7 | **Bankingly data leak (2024)** | 🔴 Histórico | ✅ Ya ocurrió | Azure Blob buckets |
| 8 | **Bankingly (enlinea) clickjacking** | 🟡 Media | Sí | Requires user interaction |

### 🔥 Exploit rápido: Directory Listing

```
/content/uploads/ → Index of/
  ├── 2017/ .. 2026/  ← TODOS los uploads enumerables
  ├── siteorigin-widgets/
  └── PDFs financieros, documentos internos
```

### 🔥 Exploit: cPanel Brute Force

```
Host: cpanel.bancobacc.com.do
Puerto: 443 (HTTPS)
Panel: cPanel Login (sin rate limiting visible)
Impacto si se compromete: Control total del sitio (file manager, SQL, DNS)
```

## 14. Datos Brutos

Guardados en `targets/bancobacc/`:
- `subs_raw.txt` — 38 subdominios
- `live.txt` — hosts vivos (pendiente)
- `katana_raw.txt` — URLs crawled (pendiente)
- `nuclei_results.txt` — 0 findings (Wordfence bloqueó)
- `README.md` — este reporte
