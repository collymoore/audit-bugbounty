# POLITUR — Security Assessment Report

**Target:** Dirección Central de Policía de Turismo (POLITUR) — República Dominicana
**Date:** 2026-07-16
**Classification:** NSI — Null Session Intelligence LLC
**Status:** Recon complete — pending disclosure

---

## Infrastructure Overview

| Domain | Tech Stack | IP | WAF |
|--------|-----------|----|-----|
| `politur.gob.do` | WordPress 6.8.5 | 172.64.148.168 / 104.18.39.88 | Cloudflare (OGTIC) |
| `servicios.politur.gob.do` | ASP.NET MVC 5.2 / IIS 10.0 | 172.64.148.168 / 104.18.39.88 | Cloudflare (OGTIC) |
| Origin server | IIS 10.0 / Windows | `200.26.171.13` | None (direct) |

---

## Finding 1 — WordPress REST API Bypass 🟡 MEDIUM

**Summary:** OGTIC's Cloudflare WAF rule blocks `https://politur.gob.do/wp-json/wp/v2/users` but does **not** block `https://politur.gob.do/?rest_route=/wp/v2/users`.

**Evidence:**
```bash
# Blocked:
$ curl -sk https://politur.gob.do/wp-json/wp/v2/users → HTTP 403 (OGTIC blocked)

# Bypass works:
$ curl -sk "https://politur.gob.do/?rest_route=/wp/v2/users&per_page=100"
```
**Exposed data:**
- 3 WordPress users: `stiven-diaz` (ID 1), `web-master` (ID 2), `redesociales` (ID 9)
- Full post content, categories, meta data, Yoast SEO structured data
- Author slugs, gravatar hashes, post dates

**Impact:** Information disclosure — user enumeration, post metadata, and author identification without authentication.

---

## Finding 2 — WordPress Author Enumeration 🟡 MEDIUM

**Summary:** Author enumeration via `/?author=N` reveals valid usernames.

**Evidence:**
```bash
$ curl -sI "https://politur.gob.do/?author=1" | grep -i location
  → /author/stiven-diaz/
$ curl -sI "https://politur.gob.do/?author=2" | grep -i location
  → /author/web-master/
```

**Users discovered:**
| ID | Username | Role (estimated) |
|----|----------|-----------------|
| 1 | stiven-diaz | Administrator / Editor |
| 2 | web-master | Administrator |
| 9 | redesociales | Author / Social Media |

---

## Finding 3 — Outdated WordPress Plugins 🟢 LOW

| Plugin | Version | Latest | CVEs |
|--------|---------|--------|------|
| Download Manager | 3.3.20 | 3.3.52 | CVE-2026-14343 (Stored XSS), CVE-2026-2571 (Missing capability check) |
| WP-Polls | 2.77.3 | — | Tested up to WP 6.7 only |
| Asgaros Forum | 3.4.0 | — | CVE-2026-57365 (DOM XSS via reCAPTCHA addon) |

---

## Finding 4 — ASP.NET Web Services Exposed 🟢 LOW

**Summary:** ASMX web services exist on `servicios.politur.gob.do` but require authentication (302 redirect to login).

**Paths found (all return 302):**
- `/servicios.asmx` — Generic service endpoint
- `/incidentes.asmx` — Incident management
- `/reportes.asmx` — Reports
- `/usuarios.asmx` — User management
- `/auth.asmx`, `/api.asmx`, `/login.asmx`, `/ws.asmx`

**Note:** WSDL access (`?wsdl`) also blocked by auth. Properly gated but exposes internal API structure via endpoint naming.

---

## Finding 5 — Origin Server Exposed 🟢 LOW

**Summary:** Origin IP `200.26.171.13` (IIS 10.0) is directly accessible on the internet. Only serves default IIS page via direct IP (no app content).

**Evidence:**
```bash
$ curl -skI "https://200.26.171.13/"
  → HTTP/1.1 200 OK | Server: Microsoft-IIS/10.0 | 476 bytes (default IIS page)
$ curl -skI "https://200.26.171.13:8443/"
  → HTTP/1.1 403 Forbidden (IIS access denied)
```

---

## Attack Surface Summary

| # | Risk | Finding | Status |
|---|------|---------|--------|
| 1 | 🟡 | WP REST API bypass via `?rest_route=` | Confirmed |
| 2 | 🟡 | WP Author enumeration (3 users) | Confirmed |
| 3 | 🟢 | Outdated Download Manager 3.3.20 | Confirmed |
| 4 | 🟢 | ASMX web services exposed (auth-gated) | Confirmed |
| 5 | 🟢 | Origin IP exposed (IIS 10.0) | Confirmed |

---

## Disclosure

Target: gob.do domain (República Dominicana)
Channel: CSIRT RD / OGTIC / Direct disclosure
Status: ⏳ Pending user decision

---

*NSI — Null Session Intelligence LLC · 2026-07-16*
