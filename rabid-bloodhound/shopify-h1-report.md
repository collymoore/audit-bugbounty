# Shopify — HackerOne Security Report

## Title: Internal Employee Identity Exposure via Minerva OIDC and Over-Exposed Okta Grants

**Team handle:** shopify  
**Severity rating:** medium  
**CVE:** N/A (configuration issues)

---

## Summary

Shopify's internal employee identity infrastructure exposes multiple OAuth 2.0 / OIDC endpoints with insecure configuration options that could be leveraged as part of a broader attack chain. Two independent attack surfaces were identified:

1. **Minerva OIDC (Internal Employee IdP)** — Public OIDC discovery metadata exposes internal-only claims (`employee_id`, `device_context`, internal `username`)
2. **Shopify Okta** — Authorization server advertises insecure grant types (`password`, `device_code`) and `none` token endpoint auth methods

---

## Finding 1: Minerva OIDC — Internal Claims Exposure 🟡 MEDIUM

**Endpoint:** `https://minerva.shopifycloud.com/.well-known/openid-configuration`  
**Status:** HTTP 200 — publicly accessible, no authentication required

The Minerva OIDC provider (Shopify's internal employee identity system) exposes `claims_supported` in its public OIDC discovery document, which includes **custom internal Shopify claims**:

```
claims_supported:
  - employee_id      ← Internal employee identifier (CUSTOM, non-standard)
  - device_context   ← Device management context (CUSTOM, non-standard)
  - username         ← Internal username
  - preferred_username
  - name, given_name, family_name
  - email
```

### Impact

While the `userinfo` endpoint (`/oauth/userinfo`) requires authentication (HTTP 401 without a valid token), the public exposure of these custom claims in the OIDC discovery metadata reveals:

- That Shopify uses `employee_id` as an internal identifier (can be used in social engineering)
- The existence of a `device_context` claim (device management tracking)
- Internal username formats

An attacker who obtains a valid Minerva token (via phishing, credential stuffing, or SSRF) would know exactly which claims to request, including employee_id and device_context — internal identifiers not intended for external consumption.

### Evidence

- OIDC discovery: `https://minerva.shopifycloud.com/.well-known/openid-configuration`
- JWKS endpoint: `https://minerva.shopifycloud.com/oauth/discovery/keys` (4 RSA keys)
- Token endpoint: `https://minerva.shopifycloud.com/oauth/token`
- Userinfo endpoint: `https://minerva.shopifycloud.com/oauth/userinfo`
- Introspect endpoint: `https://minerva.shopifycloud.com/oauth/introspect`

All endpoints serve HTTP 200 (discovery, JWKS) or respond (token, introspect, userinfo). Only the token/userinfo endpoints require valid client credentials.

**Screenshots:** N/A — all evidence is verifiable via direct API calls documented above.

---

## Finding 2: Okta Over-Exposed Grant Types 🟡 MEDIUM

**Endpoint:** `https://shopify.okta.com/.well-known/openid-configuration`  
**Status:** HTTP 200 — publicly accessible, no authentication required

Shopify's internal Okta authorization server advertises the following insecure grant types:

### 2a. Password Grant Type (Resource Owner Password Credentials)
```
grant_types_supported:
  - password
```
The `password` grant allows direct authentication via username + password. While this is blocked at the Okta policy level (confirmed: 401 `invalid_client` with the discovered client_id), its presence in the public OIDC document encourages credential stuffing attacks against employees.

### 2b. Device Code Grant
```
grant_types_supported:
  - urn:ietf:params:oauth:grant-type:device_code
```
Device authorization endpoint exposed: `https://shopify.okta.com/oauth2/v1/device/authorize`

The device code flow can be used in phishing attacks — an attacker can generate a device code and trick an employee into entering it on a legitimate-looking Okta login page, granting the attacker an access token.

### 2c. Token Endpoint Auth Method `none`
```
token_endpoint_auth_methods_supported:
  - none
introspection_endpoint_auth_methods_supported:
  - none
revocation_endpoint_auth_methods_supported:
  - none
```

The `none` auth method is enabled on the token, introspection, and revocation endpoints. For public OAuth clients (SPAs, mobile apps) this is standard when combined with PKCE. However, **any public client_id discovered** could be used to obtain tokens without a client_secret. A leaked or brute-forced client_id combined with `none` auth method would allow unauthorized token acquisition.

### Impact

These configurations are attack-chain enablers:
1. **Device code + phishing**: An attacker generates a device code → sends a phishing email to Shopify employees → employee authenticates on Okta → attacker receives valid tokens with `employee_id` and `device_context` claims
2. **Password grant + credential stuffing**: Although policy-blocked, a misconfiguration in a specific Okta application could expose it
3. **none auth method + leaked client_id**: Any Okta SPA client_id discovered in JavaScript bundles, documentation, or error messages can be used to obtain tokens without a secret

---

## Remediation Recommendations

1. **Minerva OIDC**: Remove `employee_id`, `device_context`, and internal `username` from `claims_supported` in the public OIDC discovery document. Either restrict the discovery endpoint or use opaque claims in the public configuration.
2. **Okta Policy Review**: Disable the `password` and `device_code` grant types in the authorization server policy (they should not appear in `grant_types_supported` if disabled at the policy level).
3. **none auth method**: If no public OAuth clients exist, remove `none` from `token_endpoint_auth_methods_supported`. If public clients exist, enforce PKCE (already supported: `code_challenge_methods_supported: ["S256"]`).
4. **Audit public client_ids**: Review all Okta applications with `public` client type and ensure they require PKCE.

---

## Disclosure Timeline

| Date | Event |
|------|-------|
| 2026-07-13 | Discovery and verification of findings |
| 2026-07-13 | Report submitted via HackerOne |

---

## Technical Appendix

### OIDC Discovery — Minerva
```
GET https://minerva.shopifycloud.com/.well-known/openid-configuration
→ 200 OK
```

### OIDC Discovery — Shopify Okta
```
GET https://shopify.okta.com/.well-known/openid-configuration
→ 200 OK
```

### Device Authorization Endpoint
```
POST https://shopify.okta.com/oauth2/v1/device/authorize
Content-Type: application/x-www-form-urlencoded

client_id={valid_client_id}&scope=openid profile
```

### Token Endpoint Auth Bypass Attempt (requires valid public client_id)
```
POST https://shopify.okta.com/oauth2/v1/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id={public_client_id}&code={auth_code}&redirect_uri={registered_uri}
```
No `client_secret` needed when `token_endpoint_auth_method` is `none`.

---

## Credits

- **Reporter:** Nathan Moore (nathanmoore)
- **Methodology:** Public OIDC discovery enumeration, OAuth 2.0 security assessment
