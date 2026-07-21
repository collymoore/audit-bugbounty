# CardNET Odoo Instances - PII & Auth Bypass Investigation

**Date:** 2026-07-15
**Target:** CardNET payment processing Odoo instances (Dominican Republic)

---

## 1. Target Overview

### Instance A: Odoo 14 (Production/Backend)
- **URL:** https://ser.cardnet.com.do
- **Odoo Version:** 14.0 (`/opt/odoo/odoo14/`)
- **Title:** "SER - CardNet"
- **Server:** Apache + Imperva CDN/WAF
- **DB Manager:** Accessible at `/web/database/manager` but **admin-disabled** (`list_db = False`)
- **Known DB:** Single-tenant (DB name from login screen redirect)
- **Website Module:** No public pages accessible (all `/page/*`, `/shop/*` return 404)
- **Login:** Redirects to CardNET error page (HTTP 502 "Servicio no disponible")

### Instance B: Odoo 11 (E-commerce)
- **URL:** https://ecommerce.cardnet.com.do:6443
- **Odoo Version:** 11.0 (`/opt/odoo/odoo11/`)
- **Title:** "Login | Soluciones CardNET"
- **Company:** CardNET (`data-oe-company-name="CardNET"`)
- **Server:** Apache + Imperva CDN/WAF
- **DB Manager:** Accessible at `/web/database/manager` but **admin-disabled** (`list_db = False`)
- **Known DB Name:** `odoo` (confirmed via JSON-RPC session response)
- **Website Module:** Present but minimal (only `/` and `/website/info` resolve)
- **Custom Module:** `ncfonnet` (NCF tax receipt integration for Dominican Republic)

---

## 2. Master Password Brute-force (All Failed)

Tried 13 master passwords on both instances against `/web/database/backup`, `/web/database/duplicate`, `/web/database/create`:

| Password | Odoo 14 /backup | Odoo 11 /backup | Odoo 14 /duplicate | Odoo 11 /duplicate |
|----------|:----------------:|:----------------:|:------------------:|:------------------:|
| admin | Access Denied | Access denied | Access Denied | Access denied |
| admin123 | Access Denied | Access denied | Access Denied | Access denied |
| cardnet | Access Denied | Access denied | Access Denied | Access denied |
| cardnet2026 | Access Denied | Access denied | Access Denied | Access denied |
| 0020 | Access Denied | Access denied | Access Denied | Access denied |
| 0252 | Access Denied | Access denied | Access Denied | Access denied |
| password | Access Denied | Access denied | Access Denied | Access denied |
| 123456 | Access Denied | Access denied | Access Denied | Access denied |
| root | Access Denied | Access denied | Access Denied | Access denied |
| cardnet123 | Access Denied | Access denied | Access Denied | Access denied |
| pn001 | Access Denied | Access denied | Access Denied | Access denied |
| sirite | Access Denied | Access denied | Access Denied | Access denied |
| tesoreria | Access Denied | Access denied | Access Denied | Access denied |

**Result:** All return "Access Denied" because `list_db = False` in the Odoo config. Cannot confirm if any master password is correct.

---

## 3. Authentication Bypass Attempts

### 3.1 Session Cookie Reuse (Odoo 14)
- **Provided Cookie:** `session_id=1f366bf729c08dc2c85a30e26617162c8012ed72`
- **Status:** **EXPIRED**
  - `/web/session/get_session_info` → `Odoo Session Expired` (code 100)
  - All authenticated endpoints redirect to login

### 3.2 Session Cookie Reuse (Odoo 11 - from auth probe)
- **Cookie obtained:** `session_id=6558c1edf1a45418f5815c07ab3490775346cfb1` (from failed auth attempt)
- **Status:** Session created but `uid: false` (unauthenticated)
  - `/web` → HTTP 303 (redirect to login)
  - `/web/session/get_session_info` → HTTP 400

### 3.3 JSON-RPC Authentication (Odoo 11 on db=odoo)
Tried 5 users × 9 passwords (45 combinations) on db=odoo:
- **Users:** admin, cardnet, admin@cardnet.com.do, info@cardnet.com.do, soporte@cardnet.com.do, test
- **Passwords:** admin, admin123, cardnet, cardnet2026, password, 123456, root, cardnet123, test
- **Result:** All returned `"uid": false` — **no successful authentication**

### 3.4 JSON-RPC Authentication (Odoo 14)
Tried multiple DB names (`cardnet`, `ser-cardnet`, `odoo`, `ser`, `production`, `cardnet14`):
- **Result:** No valid responses from JSON-RPC — proxy likely intercepting

---

## 4. CVE-2021-23203 - PDF Report Access

### Test on Odoo 14
| Endpoint | HTTP Status |
|----------|:-----------:|
| `/report/pdf/sale.report_saleorder/1` | 302 (redirect to login) |
| `/report/pdf/account.report_invoice/1` | 302 |
| `/report/pdf/account.report_invoice/2` | 302 |
| `/report/download/sale.report_saleorder/1` | 302 |

### Test on Odoo 11
| Endpoint | HTTP Status |
|----------|:-----------:|
| `/report/pdf/sale.report_saleorder/1` | 302 (redirect to login) |
| `/report/pdf/account.report_invoice/1` | 302 |

**Result:** All PDF report endpoints redirect to login — **not publicly accessible.**

---

## 5. /web/content & File Access

### Odoo 11 - Partially Exposed
| ID | HTTP Status | Size | Notes |
|:--:|:-----------:|:----:|-------|
| 1 | 200 | 0 | Empty attachment stub |
| 2 | 200 | 0 | Empty attachment stub |
| 3 | 200 | 0 | Empty attachment stub |
| 10 | 200 | 0 | Empty attachment stub |
| 16 | 200 | 122 | Minimal/default content |
| 100 | 200 | 0 | Empty attachment stub |
| 119 | 200 | 122 | Minimal/default content |
| 1000 | 404 | 233 | Not found |
| **4898853** | **200** | **146304** | CSS asset (web.assets_common.0.css) |
| **3175448** | **200** | **226034** | CSS asset (web.assets_frontend.0.css) |
| **3175449** | **200** | **97775** | CSS asset (web.assets_frontend.1.css) |
| **4898856** | **200** | - | JS asset (web.assets_common.js) |

**Finding:** `/web/content/` on Odoo 11 allows direct access to attachment IDs without authentication for CSS/JS assets. However, no PII-bearing attachments were found in IDs 1-50000.

### Odoo 14
| Endpoint | HTTP Status |
|----------|:-----------:|
| `/web/content/1` | 302 (redirect) |
| `/web/content/100` | 302 |
| `/web/content?model=ir.attachment&id=1` | 404 |

**Result:** `/web/content` on Odoo 14 is properly protected (redirects to login).

---

## 6. /web/image Endpoint Access

### Odoo 11
| Endpoint | HTTP Status | Size | Type |
|----------|:-----------:|:----:|:----:|
| `web/image/res.users/1/image` | 200 | 1192 | PNG 64×64 grayscale (default avatar) |
| `web/image/res.users/2/image` | 404 | 1192 | Not found |
| `web/image/res.partner/1/image` | 200 | 1192 | Default avatar |
| `web/image/res.partner/2/image` | 404 | 1192 | Not found |
| `web/image/res.partner/3/image` | 200 | 1192 | Default avatar |
| `web/image/res.company/1/logo` | 200 | 1192 | PNG 64×64 grayscale |
| `web/image/res.users/1/image_medium` | 200 | 1192 | Default avatar |

Scanned IDs 1-20 for res.partner images — **all return default size (1192 bytes)**. No custom user photos or PII found.

---

## 7. Exposed CardNET Custom Module

### ncfonnet (NCF - Dominican Republic Tax Receipt System)
- **Endpoint:** `/ncfonnet/update_payment`
- **Status:** **LIVE** (found in sitemap.xml)
- **GET:** Returns HTTP 500 (Internal Server Error)
- **POST (form):** Returns HTTP 500 with "500: Internal Server Error"
- **POST (JSON):** Returns HTTP 400 (Bad Request - wrong content type)
- **Other endpoints:** All return 404 (`/ncfonnet/update`, `/ncfonnet/create`, `/ncfonnet/validate`, etc.)

The form POST caused the Odoo template renderer to produce an error page with the word "sí" (Spanish for "yes") visible in an input placeholder — suggesting a confirmation dialog triggered by the endpoint when accessed without the correct parameters.

**This is the most promising finding** — it's a custom module for NCF (Comprobantes Fiscales) tax receipt/payment processing in the Dominican Republic that:
1. Exists on the production e-commerce server
2. Is accessible without authentication
3. Returns server errors instead of 404
4. Likely processes payment webhooks/callbacks

---

## 8. Infrastructure Discovery

### Server Stack
- **Web Server:** Apache (on both instances)
- **CDN/WAF:** Imperva (X-CDN: Imperva headers on all responses)
- **SSL:** Valid certificates for *.cardnet.com.do
- **Security Headers:**
  - HSTS: `max-age=31536000; includeSubDomains`
  - X-Frame-Options: SAMEORIGIN
  - X-XSS-Protection: 1; mode=block
  - X-Content-Type-Options: nosniff
- **Blocked paths:** `/.env` → HTTP 403 (Imperva WAF blocking)

### Odoo Paths
- **Odoo 14:** `/opt/odoo/odoo14/`
- **Odoo 11:** `/opt/odoo/odoo11/`

### Sitemap (Odoo 11)
```
https://ecommerce.cardnet.com.do:6443/ncfonnet/update_payment
https://ecommerce.cardnet.com.do:6443/website/info
https://ecommerce.cardnet.com.do:6443/
```

---

## 9. Summary

| Attack Vector | Odoo 14 (ser.cardnet.com.do) | Odoo 11 (ecommerce:6443) |
|---------------|:----------------------------:|:------------------------:|
| **DB Manager accessible** | ✅ Yes (admin-disabled) | ✅ Yes (admin-disabled) |
| **Master Password** | ❌ All Access Denied | ❌ All Access denied |
| **Session Cookie** | ❌ Expired | ❌ Unauthenticated |
| **JSON-RPC Login** | ❌ Proxy interference | ❌ All 45 combos failed |
| **CVE-2021-23203 PDF** | ❌ Redirects to login | ❌ Redirects to login |
| **/web/content/** | ❌ Redirects to login | ⚠️ Assets exposed, no PII |
| **/web/image/** | ❌ Redirects | ⚠️ Default avatars only |
| **Password Reset** | N/A | ❌ Returns 400 |
| **Custom Module (ncfonnet)** | ❌ 404 (not installed) | ⚠️ **500 errors - live but requires auth** |

### Final Verdict
**No PII was successfully extracted.** Both instances are hardened with:
- DB manager disabled (`list_db = False`)
- Imperva WAF protection
- Apache reverse proxy separation
- Proper authentication on data-bearing endpoints
- Valid TLS certificates with HSTS

The most notable finding is the **`/ncfonnet/update_payment`** endpoint — a custom CardNET Odoo module for NCF (Dominican Republic tax receipt) payment processing that is accessible without proper authentication and returns error pages. This endpoint may be exploitable with correct payment reference IDs or if CSRF-protected form handlers can be bypassed.
