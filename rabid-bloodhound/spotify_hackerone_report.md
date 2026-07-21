# HackerOne Report — Spotify Confidence (app.confidence.spotify.com)

## VULN-1: CORS Misconfiguration on GraphQL Endpoint

**Severity:** High (CVSS 7.5 — AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)

**Endpoint:** `https://graphql-konfidens.spotify.com/graphql`

**Summary:** The GraphQL endpoint used by the Confidence experimentation platform (Backstage app at app.confidence.spotify.com) has a permissive CORS policy (`Access-Control-Allow-Origin: *`) combined with custom Apollo GraphQL headers that can leak schema information and allow cross-origin data exfiltration.

**Evidence:**
```http
OPTIONS /graphql HTTP/2
Host: graphql-konfidens.spotify.com
Origin: https://evil.com
Access-Control-Request-Method: POST

HTTP/2 200
access-control-allow-origin: *
access-control-allow-methods: DELETE,POST,GET,OPTIONS,PUT
access-control-allow-headers: authorization,x-confidence-build-version,x-apollo-tracing,apollo-query-plan-experimental,origin,content-type,x-confidence-request-id,accept
access-control-max-age: 604800
```

**Impact:** Any website can make authenticated cross-origin requests to this GraphQL endpoint from a victim's browser session. The exposed Apollo headers (`apollo-query-plan-experimental`, `x-apollo-tracing`) could allow schema inference and query plan discovery.

---

## VULN-2: Google Picker API Key Exposed in Client-Side Code

**Severity:** Medium (CVSS 5.3 — AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)

**Endpoint:** `https://app.confidence.spotify.com/`

**Summary:** A Google Picker API key is hardcoded in the Backstage configuration embedded within the HTML source of the SPA.

**Evidence:**
```html
<script type="backstage.io/config">
[{
  "context": "app-config.yaml",
  "data": {
    "app": {
      "google": {
        "pickerApiKey": "AIzaSyAa0prTJZv5g5piMTFhNBYhqrV1UUC9_Oc"
      }
    }
  }
}]
</script>
```

**Impact:** The API key is restricted (Picker API only) but still represents an exposed credential in client-side code.

---

## VULN-3: Internal Service URLs Exposed in Client Configuration

**Severity:** Medium (CVSS 4.3 — AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)

**Summary:** The Backstage app configuration exposes internal service URLs:

- `baseUrl: http://localhost:3000`
- `backend: { baseUrl: http://localhost:7007 }`
- Build commit hash: `6153bf621a376232e3f7d13e9ae164d047598fc2`

---

## VULN-4: Backstage App Configured in Public Mode

**Severity:** Low

**Summary:** Meta tag `backstage-app-mode: public` suggests the Backstage instance is configured as a public app rather than internal-only.
