# Monzo Bug Bounty — Recon Findings

## Target: Monzo (Intigriti — monzopublicbugbountyprogram)
## Bounty: £50–£12,500

---

## 🏆 FINDING 1: OAuth Client Secret Hardcoded in Production HTML
**Severity: HIGH** | **Endpoint:** `auth.monzo.com` (Next.js SPA)

The `__NEXT_DATA__` JSON in the HTML response contains the full OAuth runtimeConfig:

| Field | Value |
|-------|-------|
| clientId | `oauth2client_0000Anvymwf9DuwnMsAJCz` |
| clientSecret | `mnzpub.H1sqLYd9T87y9C1PvUqno2K9PxQX+R+/AqLh97DJqcM9SKYJu//aMg73MDHUvAiE/vPBHcq45SxBlB4+ut1x4w==` |
| apiPath | `https://internal-api.monzo.com/` |
| publicApiPath | `https://api.monzo.com/` |
| sentryDSN | Exposed |
| environment | `production` |

**Impact:** Client credentials exposed client-side allow:
- Token generation via client_credentials grant
- Knowledge of internal OAuth architecture
- Potential authorization code interception if redirect_uri validation is weak
- Sentry DSN exposure enables data injection into error monitoring

**Evidence:** curl https://auth.monzo.com | grep __NEXT_DATA__

---

## 🏆 FINDING 2: OAuth Client Secret Hardcoded in Staging HTML
**Severity: HIGH** | **Endpoint:** `auth-s101.monzo.com`

Identical vulnerability in staging environment with different credentials:

| Field | Value |
|-------|-------|
| clientId | `oauth2client_0000AnnqpcxiZWadrXobz8` |
| clientSecret | `mnzpub.qlW+CBCH0mx1O63fJuAsM1zMpWcv7bRhXg/lA4E6EVtvU0+X5ByTa7/k0JKUXvvzYS655MaXP4rGCnFAQ8nzCw==` |
| apiPath | `https://api.s101.nonprod-ffs.io/` |
| baseUrl | `https://external-login.monzo-s101.com` |
| environment | `staging` |

**Impact:** Same as Finding 1.

---

## 🏆 FINDING 3: Internal API Exposed Publicly
**Severity: MEDIUM** | **Endpoint:** `internal-api.monzo.com`

Internal API responds to requests without authentication for root and health check:

| Endpoint | Status | Response |
|----------|--------|----------|
| `/` | 200 | `{"host":"internal-api.monzo.com","name":"Monzo API"}` |
| `/ping` | 200 | `{"ping":"pong"}` |
| `/accounts` | 401 | `"unauthorized.auth_required"` |
| `/pots` | 401 | `"unauthorized.auth_required"` |
| `/profile` | 401 | `"unauthorized.auth_required"` |
| `/config` | 401 | `"unauthorized"` |
| `/feed` | 400 | `"bad_request.missing_param.account_id"` |
| `/transactions` | 400 | `"bad_request.missing_param.account_id"` |
| `/webhooks` | 400 | `"bad_request.missing_param.account_id"` |

**Impact:** API endpoint enumeration reveals Monzo's internal architecture. 401/400 response codes confirm real endpoints exist (vs 404 for non-existent paths).

---

## 🏆 FINDING 4: Staging Environments Accessible
**Severity: MEDIUM** | **Endpoints:** Multiple s101 subdomains

| Host | Status | Purpose |
|------|--------|---------|
| api.s101.nonprod-ffs.io | 200 | Staging API |
| auth-s101.monzo.com | 200 | Staging auth |
| external-login.monzo-s101.com | 200 | Staging login |
| web-s101.monzo.com | 200 | Staging web app |
| verify-s101.monzo.com | 200 | Staging verify |
| webviews-s101.monzo.com | 200 | Staging webviews |
| staffonboarding-s101.monzo.com | 200 | Staff onboarding staging |

Staging environments run Next.js + S3 + CloudFront with weaker security posture.
`fincrime-signals-staging.monzo.com` requires mTLS client certificate — unusual for staging.

---

## 🏆 FINDING 5: CSP Information Disclosure
**Severity: LOW** | **Source:** auth.monzo.com

Content-Security-Policy reveals internal infrastructure:

```
connect-src: internal-api.monzo.com, api.s101.nonprod-ffs.io,
  static-assets.monzo-s101.com, *.sdk.awswaf.com, *.token.awswaf.com
```

---

## 🛡️ Security Observations

- **No WAF on internal API** — direct AWS, not behind Cloudflare
- **Staging/prod use different client secrets** — good separation
- **Token expiry:** 30h (prod) vs 59min (staging)
- **All JWTs signed with ES256** (ECDSA P-256)
- **AWS WAF** (awswaf.com) on auth endpoints only

## 📁 Recon Data

```
/root/bounty/monzo/
├── subs_all.txt    (168 subdominios)
├── live.txt        (hosts vivos)
└── (report files)
```
