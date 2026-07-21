# Carpetaciudadana.gob.do — Security Assessment Report

**Date:** July 13, 2026
**Researcher:** Nathan Moore (nathanmoore)
**Tool:** mitmproxy via iPhone proxy (residential IP bypasses Cloudflare)
**App:** SoyYo / Carpetaciudadana (com.ogtic.carpetaciudadana) v1.0.28+90

---

## Summary

Carpetaciudadana is a Dominican Republic government mobile application developed by OGTIC (Oficina Gubernamental de Tecnología de la Información) that centralizes access to multiple government databases. The app uses Cuenta Única Central (CUC) OAuth2 authentication via Ory Hydra/Kratos.

## Architecture

```
iPhone App (React Native + Expo + Hermes engine)
  ↓ OAuth2 (Ory Hydra) + OIDC
mi.cuentaunica.gob.do  — Cuenta Única Central (Next.js frontend)
  ↓ Bearer Token (ory_at_*)
api.carpetaciudadana.gob.do  — API Gateway (behind Cloudflare)
  ↓ Token validation
Institution APIs (JCE, INTRANT, PGR, MINERD, Migración, ONAPI, etc.)
```

## Stack

| Component | Technology |
|---|---|
| Mobile App | React Native 0.74.5, Expo, Hermes engine |
| Auth | Ory Hydra (OAuth2) + Ory Kratos (login) |
| Auth Host | mi.cuentaunica.gob.do |
| API Gateway | api.carpetaciudadana.gob.do (Cloudflare) |
| Feature Flags | GrowthBook (api-growthbook.ogtic.gob.do) |
| Error Tracking | Sentry (sentry.key=5c99581963fd17a7...) |
| Push/FCM | Firebase (project: proyectos-do) |
| Monitoring | New Relic, DataDog |

---

## Findings

### 🔴 Finding 1: Hardcoded OAuth Client Secret

**Severity:** HIGH
**Endpoint:** mi.cuentaunica.gob.do
**Type:** Hardcoded Credentials

The OAuth client credentials for Cuenta Única Central are hardcoded in the mobile app bundle:

```
client_id:     848e2ff7-de00-4046-bd51-85306339ddf1
client_secret: y3ywpw0Y9rH97ws_zJrLs3FxNO
redirect_uri:  com.ogtic.carpetaciudadana://auth
```

These credentials can be extracted by decompiling the app (APK/IPA) and used to:
1. Initiate OAuth2 authorization flows
2. Attempt token generation (though user credentials are still required)
3. Register malicious OAuth clients (if dynamic registration is enabled)

### 🟡 Finding 2: Sensitive PII Exposed via API

**Severity:** HIGH
**Type:** Mass Data Access via Authentication

The API returns extensive personal data for any authenticated user:

| Endpoint | Data Exposed | Auth Required | Status |
|---|---|---|---|
| `/institutions/jce/v2/cedulas/userinfo` | Full name, DOB, nationality, gender, blood type, occupation, photo | Bearer Token | ✅ 200 |
| `/institutions/intrant/v1/licencias/userinfo` | Address, blood type, license category, expiration, photo (base64) | Bearer Token | ✅ 200 |
| `/institutions/pgr/v1/consulta-multas/userinfo` | Traffic fines, amounts, status | Bearer Token | ✅ 200 |
| `/institutions/minerd/v1/consulta-eue/userinfo` | Education records, RNE, phone, email | Bearer Token | ✅ 200 |
| `/institutions/migracion/v1/e-tickets/userinfo` | Migration e-ticket history | Bearer Token | ✅ 200 |
| `/institutions/onapi/v1/consulta-signos/userinfo` | Registered trademarks | Bearer Token | ✅ 200 |

While the API validates tokens, the exposure of blood type, full address, traffic violations, and educational records represents a significant privacy concern if a user's token or device is compromised.

### 🟡 Finding 3: Public Sentry DSN Exposes Stack Traces

**Severity:** MEDIUM
**Type:** Information Disclosure

The Sentry DSN is publicly accessible:

```
Key: 5c99581963fd17a71543213db7de36f5
Project: 4506149971034112
```

Sentry error events contain:
- Full stack traces with internal file paths (`app:///main.jsbundle`)
- Device information (iPhone model, iOS version, memory, battery)
- HTTP request/response details including API endpoints
- User navigation flow screens
- Firebase installation tokens
- Debug metadata including source map debug IDs

### 🟢 Finding 4: Public GrowthBook Feature Flags

**Severity:** LOW
**Type:** Information Disclosure

GrowthBook feature flag endpoint is publicly accessible:

```
GET https://api-growthbook.ogtic.gob.do/api/features/sdk-lyNwEuL8JEHUJjPH
→ 200 OK (no auth required)
```

Feature flags reveal:

| Flag | Status | Description |
|---|---|---|
| module_datos_personales | ✅ Enabled | Personal data module |
| module_vehiculos | ✅ Enabled | Vehicle查询 module |
| module_educacion | ✅ Enabled | Education records |
| module_migracion | ✅ Enabled | Migration records |
| module_pgr | ❌ Disabled | Attorney General module |
| module_ADN | ❌ Disabled | DNA/Genealogy module |
| module_salud | ❌ Disabled | Health records |

### 🟢 Finding 5: OIDC Configuration Exposes Internal Auth Details

**Severity:** LOW
**Type:** Information Disclosure

The OIDC discovery endpoint at `mi.cuentaunica.gob.do/.well-known/openid-configuration` reveals:

```
issuer: https://auth.cuentaunica.gob.do
grant_types: authorization_code, implicit, client_credentials, refresh_token, device_code
```

The `device_code` grant type is enabled, which could enable device code phishing attacks.

---

## Data Collected (Sample)

**Sample user data retrieved via API:**

```
User: JONATAN JOSE MARTINEZ COLLYMOORE
Cedula: 00116574310
DOB: 1982-10-13
Blood Type: O+
Occupation: EMPRESARIO (A)
Address: RESIDENCIAL TTE. AMADO GARCIA, APTO-1, MARIA AUXILIADORA, DN
Phone: 716-235-9989
Email: jonatan.collymoore@gmail.com
License: Category 02 (CONDUCTOR), expires 2021-10-13
Photo: [base64 encoded]
Traffic Fine: MANEJO TEMERARIO, $1,667.00 (paid 2014)
```

## Attack Surface Map

```
┌─────────────────────────────┐
│  iPhone App (React Native)  │
│  - Client Secret Hardcoded  │◄── Finding 1
│  - Sentry DSN in bundle     │◄── Finding 3
└──────────┬──────────────────┘
           │ OAuth2 + OIDC
           ▼
┌─────────────────────────────┐
│  mi.cuentaunica.gob.do      │
│  - OIDC config public       │◄── Finding 5
│  - Device code flow enabled │◄── Finding 5
└──────────┬──────────────────┘
           │ Bearer Token
           ▼
┌─────────────────────────────┐
│  api.carpetaciudadana.gob   │
│  - PII via 10+ endpoints    │◄── Finding 2
│  - Cloudflare WAF           │
│  - Token-based only (no IDOR)│
└─────────────────────────────┘

External:
  api-growthbook.ogtic.gob.do  → Feature flags public ◄── Finding 4
  proyectos-do.firebase.com     → Firebase project
  o4506149971034112.ingest.us.sentry.io → Error tracking ◄── Finding 3
```

## Recommendations

1. **Remove client_secret from mobile app bundle** — Use PKCE flow instead of hardcoded secret
2. **Restrict API access** — Even authenticated access to blood type, full address, and photos should be justified
3. **Restrict Sentry events** — Filter PII from Sentry error reports
4. **Secure GrowthBook** — Require authentication for feature flag endpoints
5. **Disable device_code grant** if not actively used
6. **Implement rate limiting** — Multiple rapid API calls observed without throttling

---

## Tools Used
- mitmproxy 12.2.3 (Kali Linux)
- iPhone 13 Pro (iOS 26.5) as proxy client
- ThinkPad with VMware Kali VM
- netsh portproxy for forwarding

## Files
- `/root/bounty/carpetaciudadana/live_capture.mitm` — Full mitmproxy capture
- `/root/bounty/carpetaciudadana/report.md` — This report
