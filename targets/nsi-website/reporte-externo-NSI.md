# Cyber-Neo — Auditoría Externa
## nullsessionintelligence.com

**Fecha:** 2026-07-01
**Tipo:** Black-box (sin acceso a código fuente)
**Herramientas:** subfinder, nuclei, ffuf, curl, dig, openssl

---

### Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Riesgo General** | 🟢 **Bajo** |
| **Subdominios descubiertos** | 0 (solo `www`) |
| **CVEs encontrados** | 0 |
| **Rutas descubiertas** | 17 (todas Next.js catch-all) |
| **Vulnerabilidades críticas** | 0 |
| **Vulnerabilidades altas** | 0 |
| **Vulnerabilidades medias** | 0 |
| **Informativos** | 4 (4/4 corregidos) |

---

### Hallazgos

#### 🟢 NSI-01: Falta /.well-known/security.txt ✅ CORREGIDO

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Ruta** | `/.well-known/security.txt` |
| **OWASP** | A05:2021 — Security Misconfiguration |
| **Estado actual** | ✅ **Corregido** — Archivo sirviendo correctamente |
| **Verificación** | `curl -sL https://www.nullsessionintelligence.com/.well-known/security.txt` → contenido completo |
| **Remediación** | Creado `public/.well-known/security.txt` con contacto, encryption key, política de divulgación |

---

#### 🟢 NSI-02: /.env y /.git Next.js Catch-All (Falso Positivo) ✅ CORREGIDO

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Rutas** | `/.env`, `/.git` |
| **Estado actual** | ✅ **404 — Bloqueado por middleware** |
| **Verificación** | `curl -sI https://www.nullsessionintelligence.com/.git` → **404** (antes: 200) |
| **Remediación** | Middleware ahora detecta y bloquea explícitamente `/.git`, `/.env`, `/.ssh`, `/.aws`, `/.config` con 404 |

---

#### 🟢 NSI-03: /api Returns 200 (Next.js Catch-All) ✅ CORREGIDO

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Ruta** | `/api` |
| **Estado** | ✅ **404 — Bloqueado por middleware** |
| **Verificación** | `curl -sI https://www.nullsessionintelligence.com/api` → **404** (antes: 200); `/api/carrd-visits` → 200 intacto |
| **Remediación** | Middleware devuelve 404 para `/api` (path exacto). Rutas API reales (`/api/carrd-visits`) siguen funcionando. Páginas 404 personalizadas añadidas (`app/not-found.tsx`, `app/[locale]/not-found.tsx`). |

---

#### 🟢 NSI-04: X-Powered-By: Next.js Leak ✅ CORREGIDO

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Cabecera** | `x-powered-by: Next.js` |
| **OWASP** | A05:2021 — Security Misconfiguration |
| **Estado actual** | ✅ **Eliminado** — Cabecera no aparece en responses |
| **Verificación** | `curl -sI https://www.nullsessionintelligence.com | grep -i x-powered` → sin resultados |
| **Remediación** | `poweredByHeader: false` en `next.config.ts` + `-X-Powered-By` en `Caddyfile` |

---

### Remediation Status

| ID | Hallazgo | Severidad | Estado | Fix |
|----|----------|-----------|--------|-----|
| NSI-01 | security.txt faltante | 🟢 Info | ✅ Corregido | `public/.well-known/security.txt` |
| NSI-02 | `/.git` / `/.env` retornan 200 | 🟢 Info | ✅ Corregido | Bloqueo en middleware |
| NSI-03 | `/api` retorna 200 en catch-all | 🟢 Info | ✅ Corregido | Bloqueo en middleware + not-found pages |
| NSI-04 | X-Powered-By leak | 🟢 Info | ✅ Corregido | `next.config.ts` + Caddyfile |

**4/4 observaciones corregidas.**

---

### Controles Verificados ✅

| Control | Resultado |
|---------|-----------|
| **HSTS** | `max-age=31536000; includeSubDomains` ✅ |
| **CSP** | `default-src 'self'` con restricciones ✅ |
| **X-Frame-Options** | `DENY` ✅ |
| **X-Content-Type-Options** | `nosniff` ✅ |
| **Referrer-Policy** | `strict-origin-when-cross-origin` ✅ |
| **Permissions-Policy** | Restringida (camera, microphone, geolocation) ✅ |
| **CORS** | Sin Access-Control-Allow-Origin abierto ✅ |
| **TLS** | Let's Encrypt, válido hasta 2026-08-28 ✅ |
| **Server leak** | Solo "Caddy" (sin versión) ✅ |
| **robots.txt** | Presente, `/api`, `/_next`, `/ibo` bloqueados ✅ |
| **sitemap.xml** | Presente ✅ |
| **Directory listing** | Deshabilitado ✅ |
| **Zone transfer** | Denegado ✅ |
| **DMARC** | `p=quarantine` ✅ |
| **SPF** | `include:zohomail.com ~all` ✅ |
| **Puertos abiertos** | Solo 80/443 ✅ |
| **Subdominios** | Solo `www` ✅ |
| **.git leak** | No expuesto ✅ |
| **.env leak** | No expuesto ✅ |

---

### Resumen de Puertos y DNS

```
A Records:        76.13.119.150
MX:               mx.zoho.com (10), mx2.zoho.com (20), mx3.zoho.com (50)
SPF:              v=spf1 include:zohomail.com ~all
DMARC:            v=DMARC1; p=quarantine; rua=mailto:info@...
TLS:              Let's Encrypt, válido hasta 2026-08-28
```

---

### Recomendaciones Prioritarias

1. **Agregar security.txt** — Bajo esfuerzo, permite divulgación responsable
2. **Ocultar X-Powered-By** — Línea en Caddyfile
3. **Agregar redirect 404 explícito** — Para rutas no definidas en Next.js

---

### Conclusión

**El sitio de NSI está sólido desde afuera.** No se encontraron vulnerabilidades explotables. La configuración de seguridad (Caddy + security headers + DMARC + TLS) es correcta y profesional. Las únicas observaciones son informativas y de hardening fino.

**Riesgo general: 🟢 BAJO**
