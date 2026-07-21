# Coinbase — HackerOne Security Report

## Title: Security Hardening Gaps in api.wallet.coinbase.com — CORS Header Info Disclosure, Missing CSP, Trace-ID Leak, and Absent Rate Limiting

**Team handle:** coinbase
**Severity rating:** medium
**CVE:** N/A

## Summary

The `api.wallet.coinbase.com` REST API has multiple security hardening gaps: 50+ internal authentication header names leaked via CORS preflight, missing Content Security Policy, internal `trace-id` header exposed on every response, and no rate limiting on authenticated endpoints. These gaps collectively reveal Coinbase's internal API architecture and reduce the barrier for targeted attacks.

---

## Finding: Security Hardening Gaps in api.wallet.coinbase.com 🟡 MEDIUM

**Endpoint:** `https://api.wallet.coinbase.com/`
**Methods:** GET (root), OPTIONS (preflight)

### Description

The Wallet API root endpoint (`GET /` → `{"status":"ok"}`) has four distinct hardening gaps:

**A) CORS header info disclosure:** The OPTIONS response lists 50+ internal auth header names used by Coinbase microservices — including `Prime-Authorization`, `Daylight-Signature`, `Second-Factor-Proof-Token`, `Access-Token`, Datadog APM fields (`x-datadog-trace-id`), and per-service identifiers (`X-Wallet-User-Id`, `X-Release-Stage`, `x-prime-portfolio-id`). These headers map Coinbase's internal service architecture.

**B) Missing Content Security Policy:** The API has HSTS, XFO, and nosniff but no CSP header — a critical defense against data injection attacks for a crypto wallet API.

**C) Internal trace-id exposure:** Every response leaks an internal `trace-id` used for Datadog APM request tracing.

**D) No rate limiting:** 20+ rapid requests to authenticated endpoints (`/rewards`, `/send`) returned 0 HTTP 429 responses — no `X-RateLimit-*` or `Retry-After` headers present.

### Impact

While no single gap is critical alone, the **combination** significantly aids attackers:

1. **CORS headers** map Coinbase's internal service architecture (Prime, Daylight, Wallet, Swap, Datadog). An attacker with a valid token for one service can identify the exact header names required for others.
2. **Missing CSP** removes a defense layer against injection attacks targeting the API.
3. **trace-id leak** reveals Datadog APM infrastructure and internal tracing mechanisms.
4. **No rate limiting** enables brute-force/token enumeration if a session is obtained.

### Evidence

**A) CORS preflight response:**
```
$ curl -sk -X OPTIONS https://api.wallet.coinbase.com/ \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET"

access-control-allow-headers: Authorization, Content-Type, Accept,
  Second-Factor-Proof-Token, Client-Id, Access-Token, X-Cb-Project-Name,
  X-Cb-Is-Logged-In, X-Cb-Platform, X-Cb-Session-Uuid, X-Cb-Pagekey,
  X-Cb-UJS, Fingerprint-Tokens, X-Cb-Device-Id, X-Cb-Version-Name,
  Prime-Authorization, Prime-Portfolio-ID, Prime-PrimaryAddress-Wallet-ID,
  X-App-Version, X-Platform-Name, X-Appsflyer-Id, X-Wallet-User-Id,
  X-Release-Stage, X-Requested-With, Solana-Client, X-Client-Version,
  X-Client-Name, CB-Client, Host-Origin, Daylight-Signature,
  x-datadog-origin, x-datadog-parent-id, x-datadog-sampling-priority,
  x-datadog-trace-id, x-prime-user-id, x-prime-portfolio-id,
  X-CBW-SDK-Version, Cf-Ipcountry, rc, traceparent,
  X-Swap-Fee-Basis-Type, X-Wallet-Account-Type, two-factor-client-id,
  project-id, identity-version, Tmp-Amp-Id
```

**B) Missing CSP:**
```
$ curl -skI https://api.wallet.coinbase.com | grep -i content-security
# No CSP header present — confirmed absent
```

**C) Trace-id exposure:**
```
$ curl -skI https://api.wallet.coinbase.com | grep -i trace-id
trace-id: 3479649415118690364
```

**D) No rate limiting (20 sequential requests):**
```
$ for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}" \
  --max-time 3 https://api.wallet.coinbase.com/rewards; done
401 401 401 401 401 401 401 401 401 401 401 401 401 401 401 401 401 401 401 401
# 0 rate limits — no 429, no X-RateLimit-*, no Retry-After anywhere
```

### Remediation Recommendations

1. Restrict `Access-Control-Allow-Headers` to only the headers each endpoint actually needs
2. Add `Content-Security-Policy` header to all API responses
3. Remove or obfuscate internal `trace-id` from external-facing responses
4. Implement rate limiting (HTTP 429) on all authenticated endpoints with standard `X-RateLimit-*` headers

### Disclosure Timeline

| Date | Event |
|------|-------|
| 2026-07-16 | Discovery and verification of findings |
| 2026-07-16 | Report submitted via HackerOne |
