# Monzo JS Bundle Secrets Analysis

**Date:** 2026-07-15
**Targets:** auth.monzo.com (production), auth-s101.monzo.com (staging)
**Build ID:** `iPrsZC9UB9b5ZvPRktyqW`
**Asset CDN:** `https://static-assets.monzo.com/external-login/b443a230719cdedee62e6aa4fc505b430057bc01/_next/static/`

---

## 1. JS Bundle Inventory

Downloaded and analyzed 8 JS bundles from the Next.js asset CDN:

| Bundle | Size | Description |
|---|---|---|
| `chunks/pages/_app-fed409b598cce13c.js` | **1,773 KB** | Main app bundle (~350KB minified, contains all app logic) |
| `chunks/framework-0bff4c72fef67389.js` | 127 KB | Next.js framework runtime |
| `chunks/main-1ec379cf854fce99.js` | 118 KB | Sentry + webpack bootstrap |
| `chunks/polyfills-c67a75d1b6f99dc8.js` | 89 KB | Browser polyfills |
| `chunks/webpack-e620e6d673956443.js` | 5 KB | Webpack runtime |
| `chunks/pages/index-34262a3dbb3ff71a.js` | 1.6 KB | Page entry chunk |
| `_buildManifest.js` | 0.7 KB | Build manifest |
| `_ssgManifest.js` | 0.1 KB | SSG manifest |

---

## 2. Secrets Found in `__NEXT_DATA__` (Production — auth.monzo.com)

The `__NEXT_DATA__` JSON embedded in the HTML page source contains the full `runtimeConfig`:

```json
{
  "runtimeConfig": {
    "apiPath": "https://internal-api.monzo.com/",
    "publicApiPath": "https://api.monzo.com/",
    "baseUrl": "https://auth.monzo.com",
    "clientId": "oauth2client_0000Anvymwf9DuwnMsAJCz",
    "clientSecret": "mnzpub.H1sqLYd9T87y9C1PvUqno2K9PxQX+R+/AqLh97DJqcM9SKYJu//aMg73MDHUvAiE/vPBHcq45SxBlB4+ut1x4w==",
    "sentryDSN": "https://769da963a2469f6cc88737849e16e844@o23827.ingest.sentry.io/4508201033596928",
    "sentryReportUri": "https://o23827.ingest.sentry.io/api/4508201033596928/security/?sentry_key=769da963a2469f6cc88737849e16e844",
    "localeCookieDomain": ".monzo.com",
    "environment": "production"
  }
}
```

### Credentials Exposed:

| Secret | Value | Risk |
|---|---|---|
| **clientSecret** (OAuth) | `mnzpub.H1sqLYd9T87y9C1PvUqno2K9PxQX+R+/AqLh97DJqcM9SKYJu//aMg73MDHUvAiE/vPBHcq45SxBlB4+ut1x4w==` | Can mint OAuth client credentials tokens |
| **clientId** | `oauth2client_0000Anvymwf9DuwnMsAJCz` | Identifies the OAuth client |
| **sentryDSN** | `https://769da963a2469f6cc88737849e16e844@o23827.ingest.sentry.io/4508201033596928` | Can inject fake errors/events into Sentry |
| **sentryReportUri** | Full security report URI | Security event ingestion endpoint |
| **Internal API** | `https://internal-api.monzo.com/` | Backend API base path |
| **Public API** | `https://api.monzo.com/` | Public API base path |

---

## 3. Secrets Found in `__NEXT_DATA__` (Staging — auth-s101.monzo.com)

```json
{
  "runtimeConfig": {
    "apiPath": "https://api.s101.nonprod-ffs.io/",
    "publicApiPath": "https://api.s101.nonprod-ffs.io/",
    "baseUrl": "https://external-login.monzo-s101.com",
    "clientId": "oauth2client_0000AnnqpcxiZWadrXobz8",
    "clientSecret": "mnzpub.qlW+CBCH0mx1O63fJuAsM1zMpWcv7bRhXg/lA4E6EVtvU0+X5ByTa7/k0JKUXvvzYS655MaXP4rGCnFAQ8nzCw==",
    "sentryDSN": "https://b4dbfa7f8a72b14c76d15ab6a74a098b@o23827.ingest.sentry.io/4508201033596928",
    "sentryReportUri": "https://o23827.ingest.sentry.io/api/4508201033596928/security/?sentry_key=b4dbfa7f8a72b14c76d15ab6a74a098b",
    "environment": "staging"
  }
}
```

**Note:** Same Sentry project (o23827) shared between production and staging — monitoring data should be segregated.

---

## 4. Source Code Secrets (Extracted from Source Maps)

Source maps are **publicly accessible** on the CDN (all return HTTP 200) and contain full `sourcesContent` with original TypeScript source code.

### 4a. OAuth Client Credentials Flow

**File:** `lib/client-access-token/index.ts` (from source map)

The app uses `getEnv('clientSecret')` to mint OAuth client credentials tokens:

```typescript
const localStorageKey = 'Monzo::clientAccessToken'

export async function newClientAccessToken(): Promise<AccessToken> {
  const clientId = getEnv('clientId')         // from runtimeConfig
  const clientSecret = getEnv('clientSecret')  // from runtimeConfig
  const apiPath = getEnv('apiPath')            // from runtimeConfig

  const client = new ApiClient({ baseUrl: apiPath })
  const { expires_in, access_token } = await createClientAccessToken(client)({
    clientId,
    clientSecret,
  })
  return { expiresAt, token: access_token }
}
```

### 4b. OAuth Token Endpoint

**File:** `lib/api/oauth2/createClientAccessToken.ts`

```typescript
export const createClientAccessToken =
  (client: ApiClient) =>
  ({ clientId, clientSecret }: CreateClientAccessToken) => {
    return client
      .unauthenticated()
      .url('oauth2/token')
      .formUrl({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      })
      .post()
      .json(CreateClientAccessTokenSchema.parse)
  }
```

This means: **Client credentials grant to `https://internal-api.monzo.com/oauth2/token` using the exposed `mnzpub.*` clientSecret.** The resulting `access_token` is stored in `localStorage['Monzo::clientAccessToken']`.

### 4c. AWS WAF Anti-Automation Bypass Details

**File:** `lib/awsWaf.ts` (full source extracted from source map)

The implementation reveals:

1. Uses `window.AwsWafIntegration` SDK injected by AWS WAF challenge script
2. **Token is cached per email** for 4 minutes (`TOKEN_MAX_AGE_MS = 4 * 60 * 1000`)
3. **Forces token refresh** per email via `forceRefreshToken()` to defeat SDK's ~5s in-memory cache
4. Token sent as `x-aws-waf-token` header on magic link requests
5. **Deliberate anti-automation:** The comment in source says *"This is DELIBERATE: the WebACL is left standard-looking (long immunity, replayable / distributable tokens) so it appears off-the-shelf, while real browsers mint a distinct token per email."*

### 4d. API Client Architecture

**File:** `lib/apiClient.ts`

```typescript
export const apiClient = new ApiClient({
  get baseUrl() { return getEnv('apiPath') },
  tokenProvider: getClientAccessToken,
})
```

All API calls go through `apiClient.authenticated()` which:
1. Gets a bearer token from `getClientAccessToken()` (reads localStorage first, then mints new one)
2. Sets `Authorization: Bearer <token>` header
3. Calls the base URL from `runtimeConfig.apiPath`

### 4e. Sentry Configuration

**File:** `main.js` bundle — Sentry release info:

```javascript
SENTRY_RELEASE = { id: "b443a230719cdedee62e6aa4fc505b430057bc01" }
SENTRY_RELEASES["external-login@monzo"] = { id: "b443a230719cdedee62e6aa4fc505b430057bc01" }
```

Sentry error filtering logic in `_app.js`:
- HTTP 401/403/404/412 errors are **silently ignored** (not reported to Sentry)
- HTTP 400 errors are sampled at 1% (`HIGH` sample rate = 0.01)
- `bizops` app errors are **never reported** to Sentry

### 4f. Feature Flags & Capabilities

Found in source code:

| Flag | Purpose |
|---|---|
| `feature_magic_link_login` | Controls magic link login flow |
| `feature_unauth_qr_login` | Controls QR code login for unauthenticated users |
| `ifttt_tc_hack` | Shows IFTTT terms & conditions |
| `signup` intent | Routes to sign-up vs. log-in flow |

### 4g. Internal API Operations Referenced

Code references these internal operations (bizops/support tooling):

- Payments: `paymentsByAccount`, `suspensePayment`, `fasterPaymentsFraudCasesByAccountID`
- Accounts: `accountById`, `listPots`, `getMonzoIBAN`, `transactionsByAccountId`
- Cards: `cardsOrdersAndAccountForUser`, `orderCard`, `neonCardStatus`
- Fraud: `fraudProtectInvestigation`, `accountTakeoverUserStatus`, `cifasCases`
- Support: `listAnnouncements`, `bizopsTask`, `getTasks`, `customerSearch`
- Loans: `loanContexts`, `borrowingProducts`, `flexAccounts`, `monzoFlexAccounts`
- Compliance: `listCustomerRiskAssessments`, `customerSars`, `insolvenciesData`

---

## 5. Source Map Accessibility

**5 of 6 source maps are publicly accessible** on the CDN:

| Source Map | HTTP Status | Size | Content |
|---|---|---|---|
| `_app.js.map` | **200** | **4,633 KB** | Full TS sources (767 files) |
| `main.js.map` | **200** | **443 KB** | Full sources (100 files) |
| `framework.js.map` | **200** | **311 KB** | Full sources (8 files) |
| `index.js.map` | **200** | **6 KB** | Full sources |
| `webpack.js.map` | **200** | **22 KB** | Full sources (19 files) |
| `polyfills.js.map` | 404 | — | Not available |

All accessible source maps contain `sourcesContent` with original TypeScript source code. This is a significant information disclosure vulnerability.

### Monzo-specific source files (from source maps):
```
lib/client-access-token/index.ts
lib/client-access-token/schemas.ts
lib/api/oauth2/createClientAccessToken.ts
lib/awsWaf.ts
lib/apiClient.ts
lib/api/magic-link/startMagicLink.ts
lib/api/magic-link/hooks.ts
lib/api/client/fallbackClientContent.tsx
lib/api/client/getClientContent.ts
lib/api/client/hooks.ts
lib/api/hooks/useCreateQueryClient.ts
components/MagicLinkLogin/index.tsx
components/LoginAside/index.tsx
contexts/ClientContent/Provider.tsx
hooks/useParsedUrlParams.ts
pages/_app.tsx
utils/customLog.ts
```

---

## 6. Attack Surface Summary

| # | Finding | Severity | Impact |
|---|---|---|---|
| 1 | **OAuth clientSecret exposed** (`mnzpub.*`) | **Critical** | Can mint bearer tokens via `POST /oauth2/token` with `grant_type=client_credentials` |
| 2 | **Source maps publicly accessible** | **High** | Full application source code (TypeScript) available for any route/API analysis |
| 3 | **Sentry DSN exposed** (prod + staging) | **Medium** | Can inject arbitrary error events into Monzo's Sentry; staging/prod share same project |
| 4 | **Internal API URLs exposed** | **Medium** | Full internal API base URLs (`internal-api.monzo.com`, `api.s101.nonprod-ffs.io`) enable targeted attacks |
| 5 | **LocalStorage OAuth token persistence** | **Medium** | `Monzo::clientAccessToken` stored in localStorage — accessible to any JS on the same origin |
| 6 | **WAF bypass details documented in source** | **Medium** | Anti-automation strategy fully explained in source comments |
| 7 | **Internal bizops endpoint names** | **Low** | Hundreds of internal operation names leaked |

---

## 7. Remediation Recommendations

1. **Remove `clientSecret` from client-side `runtimeConfig`** — move OAuth client credentials grant to a server-side proxy
2. **Disable public source map access** — add CDN rules to block .map file access (or use Sentry's source map upload instead)
3. **Separate Sentry projects** for production vs. staging environments
4. **Add authentication** to the internal API endpoints (or at minimum network-restrict them)
5. **Use httpOnly cookies** instead of localStorage for OAuth tokens (to prevent XSS token theft)
6. **Review WAF approach** — publishing anti-automation strategies in source code undermines their effectiveness
