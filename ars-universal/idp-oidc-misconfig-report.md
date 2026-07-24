# IDP / OIDC Misconfiguration Report — Universal.com.do

**Date:** 2026-07-24  
**Targets:**
- PROD: `https://idp.universal.com.do`
- QA: `https://idp-qa.azurewebsites.net`
- DES: `https://idp-des.azurewebsites.net`

---

## 🔴 HIGH SEVERITY

### 1. Secrets Hardcoded in Client-Side JavaScript (main.js)
The production `main.js` (325 KB, publicly accessible) contains embedded secrets:

| Secret | Value | Type |
|---|---|---|
| `appInsights.InstrumentationKey` | `6a7069bb-7d69-48bd-a3c4-3bf7a7b2548a` | Azure App Insights key |
| `adobeSignApiKeyValue` | `3fb347b8e8554763aee2631108e9e18c` | Adobe Sign API key |
| `adobeSignApiKeyHeaderName` | `int-prod-key` | Adobe Sign header name |
| `googleMapsKey` | `AIzaSyCg9ZQw-FBXOj2mVznMOO80EoPTYfMzrrc` | Google Maps API key |

**Impact:** Anyone can extract these from the browser or by curling the JS. The Adobe Sign key in particular can be used server-to-server.

### 2. API Internal Endpoints Exposed in main.js
All backend API URLs are hardcoded and publicly visible:

- `https://api.universal.com.do/REST/Portal/Radicacion/v1`
- `https://api.universal.com.do/REST/reembolso/v1/api`
- `https://api.universal.com.do/integracion` (Adobe Sign)
- `https://api.universal.com.do/v2/REST/Reclamaciones/Auto`
- `https://api.universal.com.do/v4/REST/AppClientes/`
- `https://app-ars-autorizaciones-prod-eastus2.azurewebsites.net/`
- `https://app-ars-odontograma-api-prod-eastus2.azurewebsites.net/api`
- `https://app-ars-odontograma-prod-eastus2.azurewebsites.net`
- `https://app-ars-receta-electronica-api-prod-eastus2.azurewebsites.net`
- `https://app-gu-portales-api.azurewebsites.net`
- `https://universalapi-grupo-appv4.azurewebsites.net`

---

## 🟡 MEDIUM SEVERITY

### 3. Implicit Grant Enabled on All Three IDPs
All IDPs support `grant_types_supported: ["authorization_code", "client_credentials", "refresh_token", **"implicit"**, "device_code"]`.

**Test:** Implicit flow request accepted and processed:
```
GET /connect/authorize?client_id=appenlineaweb&response_type=id_token+token&scope=openid&redirect_uri=...&nonce=abc123
→ HTTP 302 → /error?errorId=... (fails on redirect_uri validation, NOT on grant type)
```

The implicit grant is deprecated by OAuth 2.1 and leaks access tokens into browser history/referrer headers.

### 4. No CORS Headers on Token Endpoint (All Environments)
`OPTIONS` to `/connect/token` returns **zero** `Access-Control-*` headers. This is defensive (prevents browser-based cross-origin token theft) but also atypical — legitimate SPAs should see proper CORS if they call it from their own origin. Worth verifying this is intentional rather than a missing configuration.

### 5. End Session Endpoint — No CSRF Protection (Logout CSRF)
```
GET /connect/endsession (no id_token_hint required)
→ HTTP 302 → /Account/Logout
```
An attacker can embed `<img src="https://idp.universal.com.do/connect/endsession">` on a malicious page to force-logout any authenticated user. **Medium: denial-of-service, no data exposure.**

### 6. QA/DEV IDPs Externally Reachable
Both QA (`idp-qa.azurewebsites.net`) and DES (`idp-des.azurewebsites.net`) are fully accessible from the public internet with no IP restrictions. All OIDC endpoints (including authorize, token, deviceauthorization) respond normally.

### 7. Same client_id Registered Across All Environments
`appenlineaweb` is a valid client on PROD, QA, and DES. If tokens from QA/DEV are not properly isolated, this could allow cross-environment token reuse.

---

## 🟢 LOW / INFO

### 8. Dynamic Client Registration — NOT Available (Good)
```
POST /connect/register → HTTP 404 (all environments)
```
Dynamic registration is disabled — prevents unauthorized clients.

### 9. Client Properly Restricted to authorization_code Grant
`appenlineaweb` returns `unauthorized_client` for:
- `client_credentials` grant  
- `password` grant
- `device_code` grant
- `refresh_token` (without a prior token)
- `enlineapi.fullAccess` scope via client_credentials

The client is correctly configured as a public client (authorization_code only).

### 10. JWKS Endpoint Exposed (Expected)
```
GET /.well-known/openid-configuration/jwks → 200
```
Returns RSA-256 public key (`kid: 54AD65478C9B089B5A0D1570C6FCA822`). This is normal OIDC behavior but confirms key material is exposed.

### 11. WebFinger Not Available
```
GET /.well-known/webfinger → HTTP 404
```

### 12. No Password Grant in grant_types_supported
Password grant is not listed in any environment's supported grants — correctly removed.

---

## 🆔 DISCOVERED CLIENT IDs

| Client ID | Environment | Source |
|---|---|---|
| `appenlineaweb` | PROD, QA, DES | main.js OIDC config |
| `SISACWeb` | QA | sisac_qa_js.js |

---

## 📊 OIDC SCOPE INVENTORY

### PROD (14 scopes)
`openid`, `roles`, `integraciones.fullAccess`, `unit.connectx.emitirPoliza`, `universal.cajacore.fullAccess`, `backendtest.fullAccess`, `universal.cotizador.ars.fullAccess`, `Universal.ARS.FlujoDeTareas.FullAccess`, `corporativo.comprasTracking.fullAccess`, `Universal.ConsultaPersona.FullAccess`, `universal.fiduciaria.fullAccess`, `remesasservice.fullAccess`, `universal.autoriweb.mvc.fullAccess`, `offline_access`

### QA (20 scopes)
Additional beyond PROD: `Universal.App.API.fullAccess`, `facturaelectronica.Api`, `universal.uplanner.fullaccess`, `salud.ivr.fullAccess`, `Universal.SegurosWeb.FullAccess`, `bizagi.ETL.fullAccess`, `Universal.APIReclamacionesAuto.FullAccess`, `Universal.ReclamacionesRiesgosGenerales.FullAccess`, `Universal.InfoPiezas.FullAccess`, `Universal.StorageService.FullAccess`, `renovaciones.fullAccess`, `universal.configuraciones.fullaccess`, `Universal.Corportativo.SegurosDeViajes.FullAccess`

### DES (19 scopes)
Unique scopes: `universal.activosfijos`, `facturaelectronicaapi`, `universal.facturaelectronica.fullaccess`, `ARS.Planes.FullAccess`, `Universal.AFI.Segmentacion.fullaccess`, `Universal.Experiencia.FullAccess`, `Universal.Cotizador.intermediario`

---

## 🛡️ RECOMMENDATIONS

1. **Remove hardcoded secrets from main.js** — move adobeSign key, googleMapsKey, and appInsights key to server-side or use environment-specific injection at build time
2. **Disable `implicit` grant** across all environments — migrate to authorization_code + PKCE
3. **Implement CSRF protection** on end_session endpoint (require `id_token_hint`)
4. **Restrict QA/DES IDP access** via IP whitelist or Azure Front Door / VPN
5. **Rotate exposed API keys** (adobeSign, appInsights, googleMaps)
6. **Review redirect URI whitelist** — ensure implicit flow redirect URIs are explicitly blocked, not just absent
7. **Enable `require_pkce`** for public clients like `appenlineaweb`
