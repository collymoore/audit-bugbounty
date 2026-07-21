# Staging OAuth2 Client Security Assessment

**Date**: 2026-07-15  
**Target**: Monzo Staging Environment  
**Scope**: OAuth2 redirect URI validation, credential scope, endpoint comparison  

---

## 1. Runtime Config Leakage via `__NEXT_DATA__`

**Verdict: 🔴 CRITICAL — Secrets exposed in client-side HTML**

Both `auth-s101.monzo.com` and `external-login.monzo-s101.com` embed the full runtime config (including `clientSecret`) in the `__NEXT_DATA__` JSON block inside the static HTML. This is visible to anyone who views the page source.

**Exposed credentials:**
| Field | Value |
|-------|-------|
| clientId | `oauth2client_0000AnnqpcxiZWadrXobz8` |
| clientSecret | `mnzpub.qlW+CBCH0mx1O63fJuAsM1zMpWcv7bRhXg/lA4E6EVtvU0+X5ByTa7/k0JKUXvvzYS655MaXP4rGCnFAQ8nzCw==` |
| apiPath | `https://api.s101.nonprod-ffs.io/` |
| environment | `staging` |

**Additional exposure:**
- Sentry DSN with private key: `https://b4dbfa7f8a72b14c76d15ab6a74a098b@o23827.ingest.sentry.io/4508201033596928`
- Sentry security report URI also exposed

**Note**: The secret uses a `mnzpub.` prefix, which may indicate a "public" (non-confidential) OAuth client type. However, even public clients should not have their secrets exposed in HTML source.

---

## 2. Redirect URI Validation Test

### Test 1: `redirect_uri=https://evil.com` on auth-s101.monzo.com

**Request:**
```
GET /oauth/authorize?response_type=code&client_id=oauth2client_0000AnnqpcxiZWadrXobz8&redirect_uri=https://evil.com&scope=openid&state=test123
Host: auth-s101.monzo.com
```

**Result**: HTTP 200 — Returns the SPA shell (Next.js 404 page). The request was **not rejected at the HTTP level**. The Next.js app serves a 404 page because `/oauth/authorize` is not a client-side route — the authorization is handled by the API backend.

### Test 2: `redirect_uri=https://evil.com` on API endpoint

**Request:**
```
GET /login/authorize?response_type=code&client_id=oauth2client_0000AnnqpcxiZWadrXobz8&redirect_uri=https://evil.com&scope=openid&state=test123
Host: api.s101.nonprod-ffs.io
```

**Result**: HTTP 200 — Returns the Monzo Login SPA (loading spinner page). The query params (including the evil `redirect_uri`) are embedded in the `__NEXT_DATA__` JSON within the page. **No immediate rejection was observed.**

### Test 3: `redirect_uri=https://monzo.com/oauth/callback` (control test)

**Result**: HTTP 200 — Identical SPA response. Same loading page. No redirect_uri validation visible at the HTTP request level.

**Assessment**: The redirect_uri validation likely occurs server-side during the interactive login flow (after the user authenticates), not at the initial authorization request. This is standard OAuth behavior, but the lack of upfront rejection means an attacker could craft a URL that looks legitimate until the user logs in.

---

## 3. Staging Credentials on Different Token Endpoints

### Test: Staging client credentials on Production token endpoint

**Endpoint**: `https://api.monzo.com/login/token`

**Grant type: `client_credentials`**
```json
Response: HTTP 400
{"error":"invalid_grant","error_description":"Invalid grant_type","code":"invalid_grant","message":"Invalid grant_type"}
```
→ Production endpoint rejects `client_credentials` grant type. Expected — only `authorization_code` is supported in the OIDC config.

**Grant type: `authorization_code` (with fake code)**
```json
Response: HTTP 400
{"error":"invalid_request","error_description":"Client not found","code":"bad_request.client_not_found","message":"Client not found"}
```
→ The staging client ID is **not recognized** by the production token endpoint. This confirms that client credentials are properly scoped to the staging environment. **No credential reuse across environments.**

**Verdict: ✅ Staging credentials are properly scoped to staging environment only.**

---

## 4. Staging vs Production OAuth Endpoint Comparison

| Feature | Staging | Production |
|---------|---------|------------|
| **Issuer** | `https://auth-s101.monzo.com` | `https://auth.monzo.com` |
| **Auth endpoint** | `https://api.s101.nonprod-ffs.io/login/authorize` | `https://api.monzo.com/login/authorize` |
| **Token endpoint** | `https://api.s101.nonprod-ffs.io/login/token` | `https://api.monzo.com/login/token` |
| **Userinfo endpoint** | `https://api.s101.nonprod-ffs.io/login/userinfo` | `https://api.monzo.com/login/userinfo` |
| **JWKS endpoint** | `https://api.s101.nonprod-ffs.io/login/jwks` | `https://api.monzo.com/login/jwks` |
| **Response types** | `["code"]` | `["code"]` |
| **Signing algorithm** | `ES256` | `ES256` |
| **Token endpoint auth** | `client_secret_basic` | `client_secret_basic` |
| **Scopes supported** | `["openid","email"]` | `["openid","email"]` |
| **Subject types** | `pairwise` | `pairwise` |

**Findings:**
- Both staging and production use **identical OAuth configuration** — same supported flows, algorithms, and auth methods.
- The only differences are the **domain names** (s101 subdomain vs production).
- Both use `client_secret_basic` auth method at the token endpoint.
- No weaker validation was detected in the OIDC metadata compared to production.
- Both enforce `pairwise` subject identifiers.

---

## 5. Additional Observations

### AWS WAF Protection
Both staging and production are behind **AWS WAF** (detected via the challenge script `5017571bdae0.eu-west-1.sdk.awswaf.com`).

### Same Build ID
Both `auth-s101.monzo.com` and `external-login.monzo-s101.com` share the same Next.js build ID (`iPrsZC9UB9b5ZvPRktyqW`), confirming they're the same application deployment.

### API routing pattern
The frontend SPA serves as the login UI, while actual OAuth logic (authorize, token, userinfo, JWKS) is handled by the API backend (`api.s101.nonprod-ffs.io`).

---

## Summary of Findings

| Issue | Severity | Status |
|-------|----------|--------|
| `clientSecret` exposed in HTML `__NEXT_DATA__` | 🔴 **HIGH** | Confirmed |
| Redirect URI not validated at HTTP request level | 🟡 **MEDIUM** | Needs interactive testing |
| Staging creds rejected by production token endpoint | ✅ Good | Scoped properly |
| Staging endpoint OIDC configuration identical to production | ✅ Good | No regression |
| Sentry DSN with private key exposed | 🟡 **MEDIUM** | Confirmed |

**Recommendation:**
1. The `clientSecret` and Sentry DSN in Next.js `__NEXT_DATA__` should be removed from client-side rendering since it's visible in the HTML source code.
2. Official OAuth security assessment should include a full interactive login flow to verify redirect_uri server-side validation in the backend.
