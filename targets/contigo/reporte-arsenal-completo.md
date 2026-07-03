# Cyber-Neo — Auditoría Externa (Arsenal Completo)
## contigo.athenaosint360.cloud — Contigo (Credit Repair RD)

**Fecha:** 2026-07-01
**Tipo:** Black-box (arsenal completo)
**Herramientas:** subfinder, nuclei, ffuf, curl, whatweb, dig, openssl

---

### Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Riesgo General** | 🟢 **Bajo** |
| **Stack** | Next.js 15 (App Router) + FastAPI + sqladmin + Supabase + Stripe |
| **Subdominios** | 0 (solo contigo.athenaosint360.cloud) |
| **CVEs encontrados** | 0 |
| **Vulnerabilidades críticas** | 0 |
| **Vulnerabilidades altas** | 0 |
| **Vulnerabilidades medias** | 0 |
| **Informativos** | 4 |

---

### Stack Detectado

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 15 (App Router con i18n EN/ES) |
| **Backend** | FastAPI (puerto 8000) |
| **Admin Panel** | sqladmin (`/panel/*`) |
| **Base de datos** | Supabase (`kkoyjpasyzqgueccipom.supabase.co`) |
| **Pagos** | Stripe (api.stripe.com, js.stripe.com, billing.stripe.com) |
| **Email** | Resend (api.resend.com) |
| **Proxy** | Caddy (HTTPS + security headers) |
| **Hosting** | VPS propio (76.13.119.150) — mismo que NSI website |
| **SSL** | Let's Encrypt YE1 (válido hasta 2026-08-28) |

---

### Hallazgos

#### 🟢 CONT-01: /panel/login Expuesto Públicamente

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Ruta** | `/panel/` → 302 → `/panel/login` |
| **Status** | 400 (espera headers/cookies adecuados) |
| **Descripción** | El panel de administración sqladmin es accesible públicamente. Aunque requiere autenticación, su exposición incrementa el riesgo de ataques de fuerza bruta o credential stuffing. |
| **Riesgo** | Bajo — mientras tenga autenticación sólida |
| **Recomendación** | Restringir `/panel/*` por IP o VPN |

---

#### 🟢 CONT-02: Múltiples Security Headers Duplicados

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Cabeceras duplicadas** | CSP (3 veces), HSTS (2 veces), XFO (2 veces), XCTO (2 veces), Referrer-Policy (2 veces), Permissions-Policy (2 veces) |
| **Causa** | Caddy y Next.js están estableciendo las mismas cabeceras |
| **Riesgo** | Muy bajo — los navegadores usan la primera/última según especificación |
| **Recomendación** | Unificar: quitar headers duplicados de Caddy o Next.js |

---

#### 🟢 CONT-03: Missing security.txt

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Ruta** | `/.well-known/security.txt` |
| **Estado** | 404 |

---

#### 🟢 CONT-04: Robots.txt Permisivo

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Ruta** | `/robots.txt` |
| **Contenido** | `User-agent: * Allow: /` |
| **Descripción** | No bloquea ninguna ruta — permite crawlers en todas las páginas incluyendo panel admin (aunque Next.js catch-all lo maneja) |
| **Recomendación** | Bloquear `/panel/*`, `/api/*` en robots.txt |

---

### Controles Verificados

| Control | Resultado |
|---------|-----------|
| **HSTS** | ✅ `max-age=63072000; includeSubDomains; preload` |
| **CSP** | ✅ Triple capa (Caddy + Next.js + Report-Only) |
| **X-Frame-Options** | ✅ `DENY` |
| **X-Content-Type-Options** | ✅ `nosniff` |
| **Referrer-Policy** | ✅ `strict-origin-when-cross-origin` |
| **Permissions-Policy** | ✅ Restringida (camera, microphone, geolocation) |
| **X-XSS-Protection** | ✅ `1; mode=block` |
| **CORS** | ✅ Sin allow-origin abierto |
| **TLS** | ✅ Let's Encrypt (válido hasta 2026-08-28) |
| **Server leak** | ✅ Solo "Caddy" |
| **robots.txt** | ⚠️ Permisivo (Allow: /) |
| **security.txt** | ❌ Ausente |
| **Rate limiting** | ✅ No detectado (WAF no bloqueó) |

---

### Páginas Descubiertas (Sitemap — 24 URLs)

| Ruta | EN | ES |
|------|----|----|
| Home | `/en` | `/es` |
| Precios | `/en/pricing` | `/es/pricing` |
| Contacto | `/en/contact` | `/es/contact` |
| Tips | `/en/tips` | `/es/tips` |
| Blog | `/en/blog` | `/es/blog` |
| Calculadora | `/en/calculadora` | `/es/calculadora` |
| Directorio | `/en/directorio` | `/es/directorio` |
| Glosario | `/en/glosario` | `/es/glosario` |
| Seguridad Digital | `/en/seguridad-digital` | `/es/seguridad-digital` |
| Salud Financiera | `/en/salud-financiera` | `/es/salud-financiera` |
| Términos Legales | `/en/legal/terms` | `/es/legal/terms` |
| Privacidad | `/en/legal/privacy` | `/es/legal/privacy` |
| **Panel Admin** | `/panel/` → `/panel/login` | |

### Endpoints API Detectados

| Endpoint | Status | Nota |
|----------|--------|------|
| `/api/` | 404 | No expuesto directamente |
| `/api/track` | 405 | Endpoint de tracking (Method Not Allowed) |
| `/panel/` | 302 | Redirige a `/panel/login` |
| `/panel/login` | 400 | Login de sqladmin |

### Terceros Identificados

| Servicio | Uso |
|----------|-----|
| Supabase (`kkoyjpasyzqgueccipom.supabase.co`) | Base de datos + Auth |
| Stripe (`api.stripe.com`, `billing.stripe.com`, `js.stripe.com`) | Pagos |
| Resend (`api.resend.com`) | Emails transaccionales |
| Google Fonts | Tipografía |
| n8n (`n8n.athenaosint360.cloud`) | Workflow automation (CSP allowlist) |

---

### Conclusión

**Riesgo general: 🟢 BAJO**

Contigo es un proyecto más completo que sanacredito — Next.js full-stack con Stripe, Supabase, panel admin. Sin embargo, desde afuera no se encontraron vulnerabilidades explotables. La configuración de seguridad es sólida con triple capa de CSP, HSTS preload, y headers completos.

**Puntos a monitorear:**
- El panel admin `/panel/login` expuesto (riesgo bajo si auth es fuerte)
- Cabeceras duplicadas (limpieza cosmética)
- security.txt faltante
- robots.txt permisivo
