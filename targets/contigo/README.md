# Contigo — Auditoría de Seguridad

## Target
`https://contigo.athenaosint360.cloud` — Plataforma de reparación de crédito RD (Ley 172-13)

## Estado: 🟢 BAJO RIESGO

**Última auditoría:** 2026-07-01 (arsenal completo)

## Stack
- **Frontend:** Next.js 15 (App Router, i18n EN/ES)
- **Backend:** FastAPI (puerto 8000)
- **Admin Panel:** sqladmin (`/panel/*`)
- **Base de datos:** Supabase (`kkoyjpasyzqgueccipom.supabase.co`)
- **Pagos:** Stripe (api, js, billing)
- **Email:** Resend
- **Proxy:** Caddy (HTTPS + security headers)
- **Hosting:** VPS propio (76.13.119.150)
- **SSL:** Let's Encrypt (válido hasta 2026-08-28)

## Hallazgos

| ID | Tipo | Severidad | Estado |
|----|------|-----------|--------|
| CONT-01 | `/panel/login` expuesto públicamente | 🟢 Info | Abierto |
| CONT-02 | Security headers duplicados (Caddy + Next.js) | 🟢 Info | Abierto |
| CONT-03 | Missing security.txt | 🟢 Info | Abierto |
| CONT-04 | Robots.txt permisivo (Allow: /) | 🟢 Info | Abierto |

## Controles verificados
- HSTS preload ✅
- CSP triple capa ✅
- X-Frame-Options ✅
- X-Content-Type-Options ✅
- Referrer-Policy ✅
- Permissions-Policy ✅
- X-XSS-Protection ✅
- Sin CORS abierto ✅
- Sin CVEs (nuclei: 0) ✅
- `/api/health` expone `{"status":"ok"}` ✅
- Sin exposición de `.git`/`.env` (catch-all de Next.js)

## Páginas (24 en sitemap)
Home, Pricing, Contact, Tips, Blog, Calculator, Directory, Glossary, Digital Security, Financial Health, Legal (Terms + Privacy) — todo EN/ES

## Endpoints API
- `/api/health` → 200 `{"status":"ok"}`
- `/api/track` → 405 (existe)
- `/panel/` → 302 → `/panel/login` (sqladmin)
- `/api/` → 404 (bloqueado)

## Terceros
Supabase, Stripe, Resend, Google Fonts, n8n

## Archivos
- `reporte-arsenal-completo.md` — Reporte completo
