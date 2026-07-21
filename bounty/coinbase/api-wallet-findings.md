# API Wallet Coinbase — Security Assessment Findings

**Target:** `https://api.wallet.coinbase.com/`
**Hosted on:** Cloudflare (CF-Ray, CF-NEL, `__cf_bm` cookies)
**Date:** 2026-07-16

---

## 1. Endpoint Discovery

### Accessible Endpoints

| Endpoint | Method | Status | Response |
|----------|--------|--------|----------|
| `/` | GET | **200** | `{"status":"ok"}` |
| `/?*` | GET | **200** | `{"status":"ok"}` (any query string) |
| `/.env` | GET | **403** | Cloudflare WAF block (Attention Required page) |
| `/.git/config` | GET | **403** | Cloudflare WAF block |
| All others (`/v1`, `/v2`, `/api`, etc.) | GET/POST/PUT/DELETE | **404** | `404 page not found` |

### Endpoints tested (all 404)
- `/v1`, `/v2`, `/api`, `/v1/`, `/v2/`, `/api/`, `/api/v1`, `/api/v2`, `/v3`
- `/rest`, `/rest/v1`, `/rpc`, `/jsonrpc`
- `/status`, `/health`, `/ping`, `/version`, `/config`
- `/account`, `/accounts`, `/user`, `/users`, `/wallet`, `/wallets`
- `/balance`, `/balances`, `/transactions`
- `/auth`, `/login`, `/token`, `/tokens`, `/oauth`, `/callback`, `/webhook`, `/webhooks`
- All `v1/*` paths (user, accounts, transactions, prices, currencies, time, etc.)
- Path traversal attempts (`../etc/passwd`, URL-encoded variants) → **400**
- Debug endpoints (`/__inspect`, `/actuator/*`, `/debug/*`, `/healthz`, `/readyz`) → all **404**
- Node.js debug endpoints (`/sockjs-node`, `/webpack-dev-server`) → all **404**
- IDOR numeric paths (`/users/1`, `/accounts/1`, `/wallet/1`) → all **404**

### Key Finding: Single Endpoint Surface
The API exposes **only** the root `/` endpoint which returns a health-check-style `{"status":"ok"}`. No functional API methods are exposed under this host publicly. All authenticated functionality is likely gated behind CDN-level routing (Cloudflare) or occurs on subdomains/ports not tested here.

---

## 2. Authentication & Authorization

### No-Auth Access Test
- **GET `/` with no auth headers** → HTTP **200** `{"status":"ok"}`
- **GET `/` with no Origin header, minimal headers** → HTTP **200**
- **GET `/` with `Authorization: Bearer invalid_token_xyz`** → HTTP **200**
- **POST `/` with any auth headers** → HTTP **404**

**Finding: Root endpoint is completely unauthenticated.** It returns the same response regardless of auth headers, no auth tokens, or invalid tokens. No access control at the health-check layer.

### Host Header Manipulation
- Empty Host header → **HTTP 400** (properly rejected)
- `Host: evil.com` → **HTTP 403** (Cloudflare blocks mismatched Host)

---

## 3. OpenAPI / Swagger Documentation

| Path | Status |
|------|--------|
| `/docs` | 404 |
| `/swagger.json` | 404 |
| `/openapi.json` | 404 |
| `/api-docs` | 404 |
| `/swagger` | 404 |
| `/redoc` | 404 |

**Finding: No API documentation exposed.** No Swagger, OpenAPI, or ReDoc endpoints were found.

---

## 4. GraphQL

| Path | Method | Status |
|------|--------|--------|
| `/graphql` | GET | 404 |
| `/graphql` | POST (introspection query) | 404 |
| `/v1/graphql` | GET | 404 |
| `/v1/graphql` | POST (introspection query) | 404 |
| `/graphql/v1` | GET | 404 |
| `/graphiql` | GET | 404 |
| `/playground` | GET | 404 |

**Finding: No GraphQL endpoints exposed.** Introspection queries returned 404 for all tested paths.

---

## 5. CORS Configuration Analysis

### Summary
The server returns CORS headers on **every response** (including simple GET requests), but critically **no `Access-Control-Allow-Origin`** header is ever set.

### Headers Returned
```
access-control-allow-headers: Authorization, Content-Type, Accept, Second-Factor-Proof-Token, Client-Id, Access-Token, X-Cb-Project-Name, X-Cb-Is-Logged-In, X-Cb-Platform, X-Cb-Session-Uuid, X-Cb-Pagekey, X-Cb-UJS, Fingerprint-Tokens, X-Cb-Device-Id, X-Cb-Version-Name, Authorization, Cache-Control, If-None-Match, Prime-Authorization, Prime-Portfolio-ID, Prime-PrimaryAddress-Wallet-ID, X-App-Version, X-Platform-Name, X-Appsflyer-Id, X-Wallet-User-Id, X-Release-Stage, X-Requested-With, Solana-Client, X-Client-Version, X-Client-Name, X-CB-Device-ID, X-CB-Is-Logged-In, X-CB-Pagekey, X-CB-Platform, X-CB-Project-Name, X-CB-Session-UUID, X-CB-UJS, X-CB-Version-Name, CB-Client, Host-Origin, Daylight-Signature, x-datadog-origin, x-datadog-parent-id, x-datadog-sampling-priority, x-datadog-trace-id, x-prime-user-id, x-prime-portfolio-id, X-CBW-SDK-Version, Origin, Cf-Ipcountry, rc, traceparent, X-Swap-Fee-Basis-Type, X-Wallet-Account-Type, two-factor-client-id, project-id, identity-version, Tmp-Amp-Id
access-control-allow-methods: GET,POST,DELETE,PUT
access-control-allow-private-network: true
access-control-expose-headers: (empty)
access-control-max-age: 7200
vary: Origin
```

### CORS Tests with Different Origins

| Origin Test | ACAO Header | Status |
|-------------|-------------|--------|
| `https://evil.com` | **MISSING** | Not vulnerable to cross-origin reads |
| `null` | **MISSING** | Not vulnerable |
| `https://attacker.example.com` | **MISSING** | Not vulnerable |
| `https://google.com` | **MISSING** | Not vulnerable |
| No Origin header | **MISSING** | N/A |

### Missing Header: `access-control-allow-credentials`
This header is **not set** — which is correct (credentials not allowed cross-origin).

### Findings & Risks

#### MEDIUM: CORS Information Leakage (50+ Auth Header Names)
The `access-control-allow-headers` header leaks the **complete list of authentication tokens and custom headers** the API expects. This includes:
- `Access-Token`, `Client-Id` — Standard auth tokens
- `Second-Factor-Proof-Token` — 2FA bypass vector indication
- `Prime-Authorization`, `Prime-Portfolio-ID`, `Prime-PrimaryAddress-Wallet-ID` — Coinbase Prime auth
- `Daylight-Signature` — Daylight (institutional trading platform) integration
- `X-CB-Device-Id`, `X-CB-Session-Uuid` — Device/session tracking
- `Fingerprint-Tokens` — Browser fingerprinting
- `x-datadog-*` (origin, parent-id, sampling-priority, trace-id) — Datadog APM tracing headers
- `X-Swap-Fee-Basis-Type` — Swap fee configuration
- `X-Wallet-Account-Type` — Account type enumeration
- `two-factor-client-id` — 2FA client identifier
- `Solana-Client` — Solana blockchain integration
- `X-CBW-SDK-Version` — SDK version tracking
- `rc` — Feature flag / release candidate control
- `traceparent` — W3C trace context
- `Host-Origin` — Origin tracking
- `Tmp-Amp-Id` — AMP analytics identifier

#### LOW: `access-control-allow-private-network: true`
This header explicitly **allows requests from private network contexts** (local network, localhost). In combination with other vulnerabilities, this could enable attacks from malicious pages on the same network.

#### LOW: CORS headers returned unconditionally
CORS headers are returned on all responses (not just OPTIONS preflight), increasing the attack surface for information gathering.

---

## 6. Rate Limiting Analysis

### Test Results

| Test | Requests | Duration | Result |
|------|----------|----------|--------|
| Sequential burst | 20 | ~7s | All 200 — **no throttling** |
| Sequential | 60 (two batches of 30) | ~18-20s | All 200 — **no throttling** |
| Rapid sequential | 100 | ~31s (~3 req/s) | All 200 — **no throttling** |
| Aggressive sequential | 100+ total | Continuous | All 200 — **no throttling** |

### Response Times
- Average: **~280–400ms** per request
- No observed degradation over time
- No `Retry-After` header ever seen
- No `X-RateLimit-*` headers ever seen

### Rate Limit Headers
**None present.** No `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`, or any custom rate-limit headers returned.

### Finding: NO Rate Limiting Detected
The API does not appear to enforce any rate limiting at the application layer. Cloudflare-level rate limiting may exist at higher thresholds, but none was triggered at 100+ requests in ~30 seconds. This could enable:
- Brute-force attacks on any authenticated endpoints behind the health-check layer
- Denial-of-wallet (API cost exhaustion)
- Credential stuffing if auth endpoints become accessible

---

## 7. Response Headers Analysis

### Security Headers Present
```
strict-transport-security: max-age=15552000; includeSubDomains  ✅ (HSTS, 180 days)
x-content-type-options: nosniff                                ✅
x-frame-options: SAMEORIGIN                                     ✅
x-xss-protection: 1; mode=block                                 ✅ (legacy but present)
x-dns-prefetch-control: off                                     ✅
x-download-options: noopen                                      ✅
cache-control: no-store                                         ✅
```

### Security Headers Missing
```
Content-Security-Policy                                       ❌
Permissions-Policy                                            ❌
Referrer-Policy                                               ❌
```

### Additional Headers
```
server: cloudflare
trace-id: <per-request UUID>                                 (internal tracing exposed)
nel: {"report_to":"cf-nel","success_fraction":0.01,...}      (Network Error Logging)
cf-cache-status: BYPASS
set-cookie: cb_dm=...; Domain=coinbase.com; HttpOnly; Secure
set-cookie: __cf_bm=...; Domain=wallet.coinbase.com; HttpOnly; SameSite=None; Secure
```

**Note:** The `trace-id` header exposes internal request tracing IDs that could aid in correlating requests server-side.

---

## 8. Infrastructure

| Property | Value |
|----------|-------|
| DNS | `api.wallet.coinbase.com` → `172.64.149.196`, `104.18.38.60` (Cloudflare) |
| Shared IP | `wallet.coinbase.com` resolves to the same IPs |
| CDN | Cloudflare (BYPASS cache on all responses) |
| Backend | Appears to be a Node.js-style server or Go service behind Cloudflare |
| Cookies | `cb_dm` (device measurement, 10yr expiry, coinbase.com domain), `__cf_bm` (bot management, 30min) |

---

## 9. Risk Summary

| Severity | Issue | Description |
|----------|-------|-------------|
| 🟡 **MEDIUM** | CORS header information leakage | 50+ auth/security header names leaked in `access-control-allow-headers` across all responses, revealing internal auth architecture (Prime, Daylight, 2FA tokens, Datadog tracing) |
| 🟡 **MEDIUM** | No rate limiting on root endpoint | 100+ requests returned all 200 with no throttling; potential for abuse on any authenticated endpoints |
| 🔵 **LOW** | `access-control-allow-private-network: true` | Private network access permitted, though no ACAO header is set to actually allow cross-origin reads |
| 🔵 **LOW** | `trace-id` header exposed | Internal request tracing IDs visible per-request |
| 🔵 **LOW** | Missing CSP/Permissions-Policy/Referrer-Policy | Standard security headers absent |
| ✅ **NONE** | Direct API access without auth | Only health-check endpoint is accessible; all real functionality returns 404 |
| ✅ **NONE** | GraphQL exposure | No GraphQL endpoints found |
| ✅ **NONE** | OpenAPI/Swagger exposure | No API documentation endpoints found |
| ✅ **NONE** | CORS cross-origin reads | No `access-control-allow-origin` header means browsers won't allow cross-origin reads |
| ✅ **NONE** | Host header injection | Invalid Host → 400/403 |
| ✅ **NONE** | Path traversal | Returns 400 |
| ✅ **NONE** | Debug/admin endpoint exposure | All return 404 |

---

## 10. Recommendations

1. **Remove CORS headers from non-preflight responses** — The CORS headers (especially `access-control-allow-headers`) should only appear on OPTIONS preflight responses, not on every GET/POST. The header name leakage reveals internal architecture.
2. **Remove `trace-id` from response headers** — Internal tracing correlation IDs should not be exposed to clients.
3. **Add rate limiting** — Even at the Cloudflare WAF level, rate limiting should be enforced on all endpoints.
4. **Add missing security headers** — CSP, Permissions-Policy, and Referrer-Policy.
5. **Review `access-control-allow-private-network: true`** — Confirm this configuration is intentional and necessary.
6. **Review `cb_dm` cookie scope** — Cookie is set with `Domain=coinbase.com` from `wallet.coinbase.com`, potentially shared across all coinbase.com subdomains.
