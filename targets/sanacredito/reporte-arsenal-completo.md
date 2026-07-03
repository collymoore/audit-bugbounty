# Cyber-Neo — Auditoría Externa (Arsenal Completo)
## sanacredito.com

**Fecha:** 2026-07-01
**Tipo:** Black-box (arsenal completo)
**Herramientas:** subfinder, nuclei, ffuf, whatweb, curl, dig, openssl

---

### Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Riesgo General** | 🟢 **Bajo** |
| **Plataforma** | Squarespace (SAAS gestionado) |
| **Subdominios** | 1 (solo `www`) |
| **CVEs encontrados** | 0 |
| **Vulnerabilidades críticas** | 0 |
| **Vulnerabilidades altas** | 0 |
| **Vulnerabilidades medias** | 1 |
| **Informativos** | 4 |

---

### Hallazgos

#### 🟠 SAN-01: Exposición de Configuración Interna via `?format=json`

| Campo | Valor |
|-------|-------|
| **Severidad** | Media |
| **Endpoint** | `https://www.sanacredito.com/?format=json` |
| **OWASP** | A05:2021 — Security Misconfiguration |
| **CWE** | CWE-200: Information Exposure |
| **Datos expuestos** | Site ID interno, identifier (`lychee-manatee-wlnk`), URL interna de Squarespace, timezone, social accounts, logo URLs, SSL setting, share button config |
| **URL interna** | `https://lychee-manatee-wlnk.squarespace.com` |
| **Instagram** | `@sanacredito` |
| **Timezone** | `America/Santo_Domingo` (AST, UTC-4) |
| **Nota** | Este es un endpoint nativo de Squarespace. No expone credenciales ni datos de clientes. Solo metadata del sitio. |
| **Riesgo** | Bajo — información de configuración del template, no datos sensibles de usuarios |

---

#### 🟢 SAN-02: Missing Security Headers

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **OWASP** | A05:2021 — Security Misconfiguration |
| **Headers faltantes** | `Content-Security-Policy`, `Referrer-Policy`, `Permissions-Policy` |
| **Headers presentes** | HSTS (180d) ✅, X-Frame-Options (SAMEORIGIN) ✅, X-Content-Type-Options (nosniff) ✅ |
| **Nota** | Squarespace no permite modificar estos headers desde el panel de administración |

---

#### 🟢 SAN-03: Missing security.txt

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Ruta** | `/.well-known/security.txt` |
| **Estado** | 404 |
| **Nota** | Squarespace permite crear esta página como página estática |

---

#### 🟢 SAN-04: Missing DMARC Record

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Registro** | `_dmarc.sanacredito.com` |
| **Estado** | No existe registro DMARC |
| **SPF existente** | `v=spf1 include:_spf.google.com ~all` |
| **Riesgo** | Bajo — correos spoofeados desde el dominio no tendrían protección DMARC |

---

#### 🟢 SAN-05: Store No Activa

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Estado** | Store no está en producción (sitio informativo) |
| **Carrito** | Vacío |
| **Nota** | Si la store se activa, la superficie de ataque aumenta |

---

### Controles Verificados

| Control | Resultado |
|---------|-----------|
| **HSTS** | `max-age=15552000` (180 días) ✅ |
| **X-Frame-Options** | `SAMEORIGIN` ✅ |
| **X-Content-Type-Options** | `nosniff` ✅ |
| **CSP** | ❌ Ausente |
| **Referrer-Policy** | ❌ Ausente |
| **Permissions-Policy** | ❌ Ausente |
| **CORS** | Sin headers CORS ✅ |
| **TLS** | Let's Encrypt, válido hasta 2026-08-17 ✅ |
| **Server leak** | Solo "Squarespace" (sin versión) ✅ |
| **robots.txt** | Presente, bloquea AI crawlers + format=json ✅ |
| **sitemap.xml** | Presente ✅ |
| **Rate limited** | Sí (429 después de varias requests) — WAF activo ✅ |
| **Git/Env leak** | 403 bloqueado por WAF ✅ |
| **DMARC** | ❌ Ausente |
| **SPF** | `include:_spf.google.com ~all` ✅ |
| **security.txt** | ❌ Ausente |

---

### DNS y Stack

```
A Records: 198.49.23.144, 198.49.23.145, 198.185.159.144, 198.185.159.145
MX:        smtp.google.com (1)
SPF:       v=spf1 include:_spf.google.com ~all
DMARC:     ❌ No configurado
TLS:       Let's Encrypt R13, valido hasta 2026-08-17
Plataforma: Squarespace
Email:     Google Workspace
CDN:       Squarespace CDN
reCAPTCHA: Enterprise v3
```

### Hallazgos de Ffuf

| Ruta | Status | Nota |
|------|--------|------|
| `/robots.txt` | 200 | 1.5KB, bloquea AI + format=json |
| `/sitemap.xml` | 200 | 2.4KB |
| `/config` | 302 | Redirige a SSO de Squarespace |
| `/.git` | 403 | Bloqueado por WAF |
| `/.env` | 403 | Bloqueado por WAF |
| `/account/` | 429 | Rate limited (bloqueo temporal) |
| `/search` | 403 | Bloqueado por robots.txt |
| `/commerce/digital-download/` | 405 | Method not allowed |
| `/api/ui-extensions/` | 404 | No existe |
| `/static/` | 404 | No existe |

---

### Conclusión

**Riesgo general: 🟢 BAJO**

Sitio Squarespace informativo. Sin cambios desde la auditoría del 29 Jun. Squarespace como plataforma SAAS tiene una superficie de ataque mínima — no hay file upload, no hay plugins vulnerables, no hay acceso a filesystem. Las únicas observaciones son limitaciones de la plataforma (headers de seguridad no configurables) y configuraciones de DNS (DMARC faltante).

**Si la store se activa (`isLive: true`), la superficie de ataque incrementa** (carrito, checkout, pagos).
