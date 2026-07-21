# 🟢 CardNET IdentityServer4 — EOL Product with Excessive Grant Types

**ID:** NSI-SA-2026-006-C002
**Target:** `https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/`
**Severity:** 🟡 **High** (EOL product, no security patches will ever be released)
**Program:** CardNET (Consorcio de Tarjetas Dominicanas S.A.)

---

## Summary

CardNET exposes an **IdentityServer4** (OIDC/OAuth2) instance on port 7443 that is:

1. **End-of-Life** — repository archived March 2025, no security patches ever again
2. **11 grant types enabled** — including dangerous/rare types: `password`, `client_credentials`, `implicit`, `onboarding`, `terminal`, `api`, `mobile`, `external_credentials`
3. **7 scopes** — `appmanager`, `terminalmanager`, `commercemanager`, `paramentermanager`, `usermanager`, `api`, `offline_access`
4. **JWKS public key exposed** — internal CA certificate chain visible

---

## PoC 1 — OIDC Discovery Endpoint

```bash
curl -sk "https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/.well-known/openid-configuration"
```

Returns full configuration including all endpoints and supported grant types.

## PoC 2 — Grant Types Enumeration

```json
{
  "grant_types_supported": [
    "authorization_code",
    "client_credentials",
    "refresh_token",
    "implicit",
    "password",
    "urn:ietf:params:oauth:grant-type:device_code",
    "onboarding",
    "terminal",
    "api",
    "mobile",
    "external_credentials"
  ]
}
```

**Notable:** `password` grant (ROPC) allows credential-stuffing. `onboarding`, `terminal`, `external_credentials` are custom non-standard grants.

## PoC 3 — Token Endpoint Live (requires client_id)

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=agoramarket&scope=api"
# Response: {"error":"invalid_client"} — endpoint is LIVE, client validation in place
```

## PoC 4 — Internal Certificate Leak via JWKS

```bash
curl -sk "https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/.well-known/openid-configuration/jwks"
```

Exposes internal CA certificate chain:
- **Internal hostname:** `serws09.cardnet.com.do`
- **CA:** `Root-CA-CARDNET` (internal)
- **OU:** Soporte Tecnico
- **Organization:** Consorcio de tarjetas Dominicanas, CardNET S.A.

---

## Exposed Endpoints

| Endpoint | Path | Status |
|----------|------|--------|
| Token | `/connect/token` | ✅ Live |
| Authorization | `/connect/authorize` | ✅ Live |
| UserInfo | `/connect/userinfo` | ✅ Live |
| EndSession | `/connect/endsession` | ✅ Live |
| Revocation | `/connect/revocation` | ✅ Live |
| Introspection | `/connect/introspect` | ✅ Live |
| Device Auth | `/connect/deviceauthorization` | ✅ Live |
| JWKS | `/.well-known/openid-configuration/jwks` | ✅ Public |
| CheckSession iframe | `/connect/checksession` | ✅ Live |

---

## Impact

| Issue | Risk |
|-------|------|
| Product EOL (archived) | 🔴 No security patches will ever be released |
| Password grant enabled | 🔴 Credential-stuffing if client_id+secret leaked |
| Custom grants (onboarding, terminal, etc.) | 🔴 Unknown validation logic |
| 11 grant types | 🟡 Massive attack surface |
| Internal CA chain leaked | 🟡 Reconnaissance intelligence |
| Public introspection/device auth | 🟡 Token manipulation vectors |

---

## Remediation

1. Upgrade to Duende.IdentityServer (commercial successor)
2. Disable unnecessary grant types (password, implicit, custom grants)
3. Restrict introspection endpoint access
4. Use separate signing certificates per environment

---

## Timeline

- **2026-07-15:** Discovery and verification
