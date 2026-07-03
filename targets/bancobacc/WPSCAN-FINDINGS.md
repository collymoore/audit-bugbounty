# WPScan API Results — Bancobacc (2026-07-01)

**API Token:** wpscan-api-token (Vaultwarden)
**Plan:** Free (16 requests usados, 0 restantes)
**WordPress:** 6.2.6 (Insecure)
**Theme:** bacc v1.0 (Soluciones GBH)

## Plugins Identificados (8)

| Plugin | Versión | Última | CVEs | Riesgo |
|--------|---------|--------|------|--------|
| Contact Form 7 | 5.7.7 | 6.1.6 | 4 | 🔴 Crítico |
| Page Builder by SiteOrigin | 2.25.0 | 2.34.5 | 6 | 🔴 Crítico |
| Yoast SEO | 20.12 | ~27+ | 6 | 🔴 Crítico |
| WP Mail SMTP | 3.8.2 | 4.9.0 | 1 | 🟡 Alto |
| Yoast Duplicate Post | 4.5 | — | 1 | 🟠 Medio |
| Custom Post Type UI | 1.13.7 | — | 1 | 🟠 Medio |
| SO Widgets Bundle | 1.52.0 | — | 0 | ℹ️ Info |
| (plugin adicional) | — | — | — | — |

## Inventario Completo de CVEs

### WordPress Core (6.2.6 → 6.8.3)
- **CVE-2025-58674** — Author+ DOM Stored XSS
- **CVE-2025-58246** — Contributor+ Sensitive Data Disclosure

### Contact Form 7 (5.7.7 → 6.1.6)
- **CVE-2023-6449** — Authenticated (Editor+) Arbitrary File Upload
- **CVE-2024-2242** — Reflected Cross-Site Scripting
- **CVE-2024-4704** — Unauthenticated Open Redirect
- **CVE-2025-3247** — Order Replay Vulnerability

### Page Builder by SiteOrigin (2.25.0 → 2.34.5)
- **CVE-2024-2202** — Contributor+ Stored XSS
- **CVE-2024-4361** — Contributor+ Stored XSS via shortcode
- **CVE-2024-12240** — Contributor+ Stored XSS via Row Label
- **CVE-2025-1459** — Contributor+ Stored XSS
- **CVE-2026-2448** — Contributor+ Local File Inclusion
- **CVE-2026-13295** — Authenticated (Contributor+) Stored XSS

### Yoast SEO (20.12 → 27+)
- **CVE-2023-40680** — Authenticated (SEO Manager+) Stored XSS
- **CVE-2024-4041** — Reflected Cross-Site Scripting
- **CVE-2024-4984** — Authenticated (Contributor+) Stored XSS
- **CVE-2026-1293** — Contributor+ Stored XSS
- **CVE-2026-3427** — Contributor+ Stored XSS via 'jsonText' Block Attribute
- **CVE-2025-14481** — Contributor+ IDOR to Sensitive Information Exposure

### Otros Plugins
- **WP Mail SMTP 3.8.2 → CVE-2024-6694** — Admin+ SMTP Password Exposure
- **Duplicate Post 4.5 → CVE-2026-1217** — Contributor+ Arbitrary Post Duplication/Overwrite
- **Custom Post Type UI 1.13.7 → CVE-2025-12826** — Unauthenticated Custom Post Type Modification

## Resumen

| Métrica | Valor |
|---------|-------|
| Plugins con CVEs | 6 de 8 |
| Total CVEs identificados | 21 |
| CVEs que requieren auth | 16 |
| CVEs sin auth (exploitables directamente) | 5 |
| Hallazgos previos (BACC-01 a 16) | 16 |
| **Total acumulado** | **37 hallazgos** |
