# Banco BACC (bancobacc.com.do) — Findings
Date: 2026-07-14

## Scope
bancobacc.com.do — Banco BACC de Ahorro y Crédito del Caribe, S.A.

## WordPress Info
- Site: `bancobacc.com.do`
- WP-JSON: **Público** — full route map exposed
- WP-API namespaces: oembed/1.0, contact-form-7/v1, sowb/v1, wordfence/v1, yoast/v1, templates-directory, wp/v2, wp-site-health/v1, wp-block-editor/v1
- WP Users listing: **Blocked** (401 — `rest_user_cannot_view`)
- `wp/v2/plugins` endpoint exposed (requires auth to list)
- `wp/v2/settings` endpoint exposed (requires auth to write)
- Wordfence WAF present: `/wordfence/v1/*` — validates Authorization header format

## CRITICAL: Directory Listing — FULLY OPEN
**Path:** `/content/uploads/{year}/{month}/`

A recursive index of ALL uploaded files from 2017-2026 is accessible.

### Total exposed: 150+ PDFs

#### 2026 (current year — 5 PDFs)
- `Estados-Auditados-BACC-2025.pdf` — Audited financial statements
- `bahorrocreditocaribe2601is.pdf`
- `BANCO-BACC.pdf`
- `MEMORIA-ANUAL-BACC-2025.pdf`
- `Proceso-de-disvinculacion-de-App.pdf`

#### Sensitive documents found across all years
- **Client contracts:** `CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf` (2024 — contains customer name)
- **Client PII exposure:** `RELACION-DE-VEHICULOS-EN-VENTA-JULIO-23-1.pdf` (2023) — vehicle list with owner data
- **Foreclosed properties:** `BIENES-ADJUDICADOS-SEPT.23.pdf` (2023)
- **Vehicle list:** `Listado-de-vehiculo-en-venta.pdf` (2024)
- **IRS tax forms:** W-8BEN, W-8ECI, W-8EXP, W-8IMY, W-9 — US tax forms with foreign investor data
- **DGII audit results:** `Resultados-Inspeccion-2018-DGII.pdf` — Dominican IRS inspection findings
- **Financial statements:** EEFF Auditados 2013-2025, multiple years
- **Annual reports:** Memorias Anuales 2014-2025
- **Bond offerings:** Full prospectuses, placement notices, Feller-Rate credit ratings
- **Internal policies:** Código de Ética, Política de uso de información, Contratos de adhesión
- **App deactivation guide:** `Proceso-de-disvinculacion-de-App.pdf` (2026 — could expose app uninstall/security workaround)

## Yoast SEO — file_size endpoint
- **Path:** `/wp-json/yoast/v1/file_size?url=X`
- Accepts URL parameter — potential SSRF vector
- Currently returns `rest_forbidden` (401) for internal addresses
- Returns `rest_missing_callback_param` (400) when url param is malformed
- **Fix recommended:** Disable endpoint or add proper URL allowlist

## Infrastructure
- **HTTPS (HSTS):** Active — max-age=31536000, includeSubDomains, preload
- **Server:** Apache with mod_pagespeed v1.13.35.2
- **cPanel:** `cpanel.bancobacc.com.do:2083` — accessible (401 Unauthorized)
- **Enlinea (Bankingly):** `enlinea.bancobacc.com.do` — 302 → 200 OK

## Vectors assessed
| Vector | Status | Notes |
|--------|--------|-------|
| Yoast SSRF | Blocked (401) | Needs auth for internal URLs |
| CF7 forms | Blocked (403) | wpcf7_forbidden |
| Wordfence API | Blocked (401) | Token required |
| WP Users | Blocked (401) | rest_user_cannot_view |
| Directory listing | **OPEN** | 150+ PDFs exposed |
| cPanel | Open port | Only 401 auth |
| Bankingly | **Live** | Could test default creds |

## Risk Rating: **HIGH**
- **Data exposure via directory listing** is the most critical finding
- Financial documents 2013-2025, client contracts, IRS forms, and current-year audited statements are publicly accessible with no authentication
