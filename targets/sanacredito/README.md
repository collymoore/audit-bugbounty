# Sanacredito — Auditoría de Seguridad

## Targets
- **Principal:** `https://www.sanacredito.com` (Squarespace)
- **DNS:** `sanacredito.com.do` → NXDOMAIN (no resuelve)

## Estado: 🟢 BAJO RIESGO

**Última auditoría:** 2026-07-01 (arsenal completo)
**Auditoría previa:** 2026-06-29

## Stack
- **Plataforma:** Squarespace (SAAS gestionado)
- **Hosting:** Squarespace CDN (IPs: 198.49.23.144-145, 198.185.159.144-145)
- **Email:** Google Workspace (MX: smtp.google.com)
- **DNS:** Google Cloud DNS
- **SSL:** Let's Encrypt (válido hasta 2026-08-17)
- **Idioma:** es-DO
- **Zona horaria:** America/Santo_Domingo (AST, UTC-4)
- **ID interno:** `lychee-manatee-wlnk.squarespace.com`

## Hallazgos

| ID | Tipo | Severidad | Estado |
|----|------|-----------|--------|
| SAN-01 | `?format=json` expone config interna | 🟠 Media | Abierto (Squarespace feature) |
| SAN-02 | Missing CSP, Referrer-Policy, Permissions-Policy | 🟢 Info | Abierto (no configurable en SS) |
| SAN-03 | Missing security.txt | 🟢 Info | Abierto |
| SAN-04 | Missing DMARC record | 🟢 Info | Abierto |
| SAN-05 | Store no activa (`isLive: false`) | 🟢 Info | Abierto |

## Controles verificados
- HSTS (180d) ✅
- X-Frame-Options (SAMEORIGIN) ✅
- X-Content-Type-Options (nosniff) ✅
- WAF bloquea `.git`/`.env` (403) ✅
- Rate limiting (429) ✅
- Sin CORS abierto ✅
- Sin CVEs (nuclei: 0) ✅
- robots.txt bloquea AI crawlers + format=json ✅

## Data points
- **Email:** info@sanacredito.com
- **Teléfono:** 809-310-0883
- **Instagram:** @sanacredito
- **Competidor directo de:** Contigo (reparación de crédito RD)

## Archivos
- `README.md` — Este archivo
- `reporte-arsenal-completo.md` — Reporte completo del arsenal 2026-07-01
- `defacement-audit.md` — Auditoría de vectores de defacement
- `format_json_dump.json` — Raw dump del endpoint `?format=json`
- `index.html` — HTML del home (291KB)
- `katana_raw.txt` — 204 URLs crawl
- `nuclei_results.txt` — 0 findings
