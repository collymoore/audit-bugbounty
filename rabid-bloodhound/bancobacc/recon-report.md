# Recon Report — bancobacc.com.do (Banco BACC)
Date: 2026-07-14

## 🔴 Directory Listing Abierto
**URL:** `https://bancobacc.com.do/content/uploads/{year}/{month}/`
**Total PDFs expuestos:** 181+ (2017–2026)

### Documentos Sensibles
| Archivo | Contenido | Ruta |
|---------|-----------|------|
| Tasador-BACC.pdf | Nombre, registro, teléfono, email de tasador autorizado | 2022/02/ |
| Proceso-desvinculacion-App.pdf | Procedimiento interno de eliminación de cuentas (Abril 2026) | 2026/04/ |
| Resultados-Inspeccion-DGII.pdf | Resultados inspección DGII 2018 (escaneado, requiere OCR) | 2018/01/ |
| EEFF Auditados 2013-2025 | Estados financieros auditados por firma independiente | Multiple |
| Memorias Anuales 2014-2025 | 127 páginas c/u — consejo, resultados, estrategia | Multiple |
| Informes Feller Rate | Calificaciones de riesgo 2015-2022 | 2018/01/, 2022/08/ |
| Prospectos Emisión Bonos Corp. | Aprobados por SIV, incluyen datos financieros | 2018/09/ |
| W-8BEN, W-9 | Formularios IRS para inversores extranjeros | 2018/01/ |

## 🔴 WordPress REST API (WAF Bypass)
Wordfence bloquea `/cms/` pero la REST API en raíz queda ABIERTA:
- `https://bancobacc.com.do/wp-json/` — JSON completo con namespaces
- **Yoast SEO v20.12** — SSRF potencial en `/yoast/v1/file_size` (requiere auth)
- **Wordfence endpoints** — `/authenticate`, `/config`, `/scan`, `/disconnect` expuestos
- **Contact Form 7** — `/contact-form-7/v1/contact-forms` (403 pero expuesto)
- **Batch API** — `/batch/v1` habilitado

## 🔴 Subdominios Expuestos
| Subdominio | Propósito | Estado |
|------------|-----------|--------|
| `admin.bancobacc.com.do` | **Bankingly BackOffice** — portal admin ASP.NET | Login expuesto |
| `enlinea.bancobacc.com.do` | **Banca en línea** Bankingly | Login expuesto |
| `cpanel.bancobacc.com.do:2083` | cPanel hosting | Auth req |
| `webmail.bancobacc.com.do` | Webmail | Auth req |
| `ftp.bancobacc.com.do` | FTP web interface | Auth req |

## 🔴 Infraestructura
- **Hosting:** GBH Web Hosting (ns1.gbhwebhosting.com) — IP 162.214.97.98
- **Email:** Microsoft 365 + Mailjet (SPF)
- **CMS:** WordPress en `/cms/`
- **WAF:** Wordfence (parcial — solo protege `/cms/` paths)
- **Server:** Apache / mod_pagespeed 1.13.35.2
- **HSTS:** Activo con includeSubDomains
