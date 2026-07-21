# CardNET — Full Recon Report
**Target:** cardnet.com.do (Consorcio de Tarjetas Dominicanas S.A.)
**Date:** 2026-07-15
**Analyst:** NSI — Null Session Intelligence

---

## Infrastructure

| Type | Value |
|------|-------|
| Main A Records | 45.223.24.139, 45.223.18.139 (BunnyCDN) |
| Nameservers | ns1.cardnet.com.do, ns2.cardnet.com.do |
| MX | Sophos Email, Office 365 |
| IP Block | 201.131.107.0/24 (origin servers) |
| WAF | Imperva Incapsula (selective) |

---

## 🔴 Critical Findings

### 1. IdentityServer4 OIDC — Port 7443 (ecommerce.cardnet.com.do)
- **URL:** `https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/`
- **OIDC Issuer:** `https://agoramarket.cardnet.com.do/identityserver`
- **Grant types enabled:** password, client_credentials, authorization_code, implicit, refresh_token, device_code, **onboarding**, **terminal**, **api**, **mobile**, **external_credentials**
- **Scopes:** appmanager, terminalmanager, commercemanager, usermanager, api, offline_access
- **JWKS:** RSA256 public key obtained
- **/connect/token** returns 400 (needs valid client_id)
- **/connect/authorize** returns 302 (redirects to login)
- **/connect/userinfo** returns 401 (needs token)
- **/connect/introspect** returns 401
- ⚠️ **Password grant + client_credentials + onboarding + external_credentials** all enabled

### 2. Odoo 14 ERP — ser.cardnet.com.do (2nd Instance)
- **URL:** `https://ser.cardnet.com.do/web/login`
- **Version:** Odoo 14 (path: `/opt/odoo/odoo14/`)
- **DB Manager:** `/web/database/manager` → 200 OK (39KB)
- **Session cookie obtained**
- **Server:** Apache, HSTS enabled

### 3. Odoo 11 ERP — ecommerce.cardnet.com.do:6443
- **URL:** `https://ecommerce.cardnet.com.do:6443/web/login`
- **Version:** Odoo 11 (path: `/opt/odoo/odoo11/`)
- **DB Manager:** Accessible (admin-disabled, but page renders)
- **Imperva WAF**

### 4. ManageEngine ServiceDesk Plus v15.2
- **URL:** `https://mesadeservicio.cardnet.com.do/`
- **Version:** 15.2 (confirmed in JS)
- **SSO:** SAML configured
- **Endpoints:** /login, /servlet/McLoginServlet, /GetListServlet, /Link/Version
- **ITSM platform** — known CVE surface

---

## 🟡 Medium Findings

### 5. AngularJS BackOffice — Port 8443
- **URL:** `https://ecommerce.cardnet.com.do:8443/`
- **Title:** "CardNET | BackOffice Comercios"
- **Tech:** AngularJS SPA (legacy framework)
- **Vendor CSS:** `/css/vendor-d408c3ddc0.css`, `/css/app-07226c728b.css`

### 6. Merchant Portal SPA — comercios.cardnet.com.do
- **Tech:** Vite/React (Quasar Framework)
- **Login:** Email + Password
- **API:** `https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver` (OAuth2)
- **Pwd recovery:** `/api/v1/user/recover-password-merchant`
- **No WAF**

### 7. Self-Service Portal — autoservicio.cardnet.com.do
- **URL:** `https://autoservicio.cardnet.com.do/login.aspx`
- **Tech:** ASP.NET WebForms
- **Login:** Cédula/RNC + Password
- **Features:** Password change, forgot password
- **WAF:** Imperva Incapsula

### 8. PayNet — pagosrecurrentes.cardnet.com.do
- **URL:** `https://pagosrecurrentes.cardnet.com.do/apaymentweb/default.aspx`
- **Tech:** ASP.NET (IIS)
- **Service:** Recurring payments platform
- **WAF:** Imperva Incapsula

---

## ⬜ Low/Info

| Subdomain | Service | Notes |
|-----------|---------|-------|
| lab.cardnet.com.do | LAB Apache | No WAF, development page |
| labservicios.cardnet.com.do | Health API | `{"status":"ok"}` |
| empleos.cardnet.com.do | Next.js Jobs | Job application portal |
| comercios.cardnet.com.do | Merchant Portal | React SPA, no WAF |
| chk.cardnet.com.do | Check Point FW | CPWS 403 |
| mercury.cardnet.com.do | Legacy Apache | Error page, no WAF |
| www.cardnet.com.do | Corporate | BunnyCDN |

---

## H1-Quality Report Candidates

| Priority | Finding | Target | Impact |
|:--------:|---------|--------|--------|
| 🔴 #1 | Odoo 14 DB Manager Exposed | ser.cardnet.com.do | DB enumeration/management |
| 🔴 #2 | Odoo 11 DB Manager Accessible | ecommerce:6443 | DB operations |
| 🔴 #3 | IdentityServer4 Excessive Grant Types | ecommerce:7443 | Password grant, onboarding, custom grants |
| 🟡 #4 | CSRF/Missing Origin — Payment Gateway | ecommerce:443 | Phishing (already documented) |
| 🟡 #5 | ManageEngine ServiceDesk v15.2 | mesadeservicio | Known CVEs (research pending) |
| 🟡 #6 | AngularJS Legacy Framework | ecommerce:8443 | Legacy vulns |
