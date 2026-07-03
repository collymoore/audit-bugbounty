# HackerOne Report — JetBlue VDP

## Finding 1: CORS Misconfiguration on Magnolia CMS Instances

**Target:** `cms.jetblue.com`, `legacycms.jetblue.com`
**Severity:** Medium
**CVSS:** CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N (6.1)
**Type:** CORS Misconfiguration / Security Misconfiguration
**CWE:** CWE-942 (Permissive Cross-domain Policy with Untrusted Domains)
**Reproducibility:** Always

### Summary

Both JetBlue Magnolia CMS instances (`cms.jetblue.com` and `legacycms.jetblue.com`) return `Access-Control-Allow-Origin: *` on all HTTP responses. This permissive CORS policy allows any external website to make authenticated cross-origin requests to the CMS, potentially enabling data exfiltration via CSRF-style attacks against authenticated admin users.

Additionally, the responses expose:
- Internal Magnolia Platform hostnames (`prod.author.jetblue-prod.magnolia-platform.io`)
- Spring Boot Actuator endpoints
- `x-magnolia-registration: Registered` header
- CSRF tokens and JSESSIONIDs

### Steps to Reproduce

1. Send a request with a custom Origin header:
   ```bash
   curl -sI -H "Origin: https://evil.com" https://cms.jetblue.com
   ```

2. Observe the response includes:
   ```
   access-control-allow-origin: *
   access-control-allow-credentials: true
   ```

3. Verify the internal redirect:
   ```bash
   curl -sI https://cms.jetblue.com/
   ```
   Response includes redirect to: `prod.author.jetblue-prod.magnolia-platform.io`

4. Access actuator endpoints:
   ```bash
   curl -sI https://cms.jetblue.com/actuator
   ```

### Proof of Concept

**Request:**
```http
GET / HTTP/2
Host: cms.jetblue.com
Origin: https://evil.com
```

**Response:**
```http
HTTP/2 302 Found
access-control-allow-origin: *
access-control-allow-credentials: true
x-magnolia-registration: Registered
location: https://prod.author.jetblue-prod.magnolia-platform.io/
```

### Business Impact

1. **Session hijacking of CMS administrators** — An attacker can craft a malicious webpage that, when visited by an authenticated JetBlue CMS admin, executes cross-origin requests to exfiltrate CSRF tokens, session cookies, and CMS content. Magnolia CMS manages the content of JetBlue's main website — including flight promotions, fares, baggage policies, and customer communications.

2. **Production content manipulation** — With a valid admin session token, an attacker could modify published content on `jetblue.com` (flight prices, promotion terms, landing pages), causing direct reputational and financial damage.

3. **Internal infrastructure disclosure** — Internal Magnolia platform hostnames (`prod.author.jetblue-prod.magnolia-platform.io`) reveal the internal AWS/Azure architecture, enabling targeted attacks against infrastructure that should remain hidden.

4. **Exposed Spring Boot Actuators** — Endpoints `/actuator`, `/actuator/health`, `/actuator/info` are accessible from the internet, exposing application health metrics, configuration details, and potentially credentials or internal routes.

### Remediation

1. Remove the wildcard `Access-Control-Allow-Origin: *` header
2. Implement an allowlist of trusted origins
3. Restrict Actuator endpoints to internal network only

---

## Finding 2: Unauthenticated SmartNotify API Configuration Disclosure

**Target:** `trackmybag.jetblue.com` (React SPA) → Backend API at `jetblue-smartnotify-prod-api.azurewebsites.net`
**Severity:** Medium
**CVSS:** CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N (5.3)
**Type:** Missing Authentication / Information Disclosure
**CWE:** CWE-306 (Missing Authentication for Critical Function)
**Reproducibility:** Always

### Summary

The JetBlue Track My Bag application at `trackmybag.jetblue.com` exposes a SmartNotify backend API at `jetblue-smartnotify-prod-api.azurewebsites.net` that responds to requests with no authentication required. The `GetMicrositeSettings` endpoint returns the full application configuration, including internal URLs and system settings.

### Steps to Reproduce

1. Access the settings endpoint without any authentication:
   ```bash
   curl -s "https://jetblue-smartnotify-prod-api.azurewebsites.net/api/MicrositeSettings/GetMicrositeSettings"
   ```

2. Observe the full configuration response:
   ```json
   {
     "carrierCode": "B6",
     "fileClaimUrl": "https://app.nettracer.aero/pax/jetblue/bso/login",
     ...
   }
   ```

### Proof of Concept

**Request:**
```http
GET /api/MicrositeSettings/GetMicrositeSettings HTTP/1.1
Host: jetblue-smartnotify-prod-api.azurewebsites.net
```

**Response (200 OK):**
```json
{
  "carrierCode": "B6",
  "isCustomsFormEnabled": false,
  "isBagTrackingEnabled": true,
  "isAhlCreationEnabled": true,
  "isPassengerNotificationEnabled": false,
  "isBagSelectionEnabled": false,
  "isEncryptedRequestRequired": true,
  "isPnrOnlySearchEnabled": false,
  "fileClaimUrl": "https://app.nettracer.aero/pax/jetblue/bso/login"
}
```

### Business Impact

1. **Baggage handling system configuration exposed** — The SmartNotify API powers the bag tracking application (`trackmybag.jetblue.com`). Without authentication, anyone on the internet can retrieve the complete system configuration, including third-party URLs such as Nettracer (the baggage tracing system used by airlines).

2. **Gateway to passenger data** — Additional endpoints mapped in the JS bundle (`GetEncryptedString`, `CreateTracerRecord`, `SavePassengerNotificationMethods`) could allow access to passenger data (PNR, surnames, contact methods) and the creation of fraudulent baggage records.

3. **Fraud risk for baggage claims** — The `fileClaimUrl` endpoint points to `app.nettracer.aero/pax/jetblue/bso/login` — the baggage claims tool. Knowledge of this URL combined with the ability to create baggage records could facilitate fraudulent claims.

4. **Regulatory compliance risk** — Exposure of baggage handling systems without authentication may violate aviation data security regulations (TSA, IATA).

### Remediation

1. Require authentication on the SmartNotify API endpoints
2. Implement API key or token-based access control
3. Restrict public access to the Azure App Service

---

## Finding 3: Dev/Staging Environment CORS and Internal Header Disclosure

**Target:** `www-dev2.jetblue.com`
**Severity:** Low
**CVSS:** CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:N/A:N (3.1)
**Type:** CORS Misconfiguration / Information Disclosure
**CWE:** CWE-942 (Permissive Cross-domain Policy with Untrusted Domains)
**Reproducibility:** Always

### Summary

The JetBlue development environment at `www-dev2.jetblue.com` returns `Access-Control-Allow-Origin: *` and discloses internal API header names in its CORS configuration.

### Steps to Reproduce

```bash
curl -sI -H "Origin: https://evil.com" https://www-dev2.jetblue.com
```

**Response includes:**
```
access-control-allow-origin: *
access-control-allow-headers: Origin, x-b3-traceid, x-b3-spanid, Authorization, Content-Type, ocp-apim-subscription-key, x-auth-token
access-control-allow-methods: POST, GET, OPTIONS, DELETE, PUT
```

The `ocp-apim-subscription-key` header confirms Azure API Management is in use with a subscription key pattern.

### Business Impact

1. **Internal API Management header disclosure** — The `ocp-apim-subscription-key` header reveals that JetBlue uses Azure API Management with subscription-based API keys. This exposes the internal authentication mechanism, allowing attackers to understand how to structure valid requests against protected APIs.

2. **Distributed tracing infrastructure exposed** — Zipkin headers (`x-b3-traceid`, `x-b3-spanid`) expose the internal distributed tracing system, revealing service topology, dependencies, and data flow paths within JetBlue's infrastructure.

3. **Development environment with open CORS** — Development environments typically have less protected data and more permissive configurations, but the wildcard CORS allows malicious scripts to interact with development APIs that may share infrastructure with production systems.

### Remediation

Remove wildcard CORS origin from development environments and restrict allowed headers to only what is necessary.

---

## Timeline

- **2026-06-30** — Discovery and verification
- **2026-06-30** — Report prepared for submission

**Reported by:** @nathanmoore
