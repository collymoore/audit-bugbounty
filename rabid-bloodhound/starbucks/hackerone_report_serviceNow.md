# HackerOne Report — Starbucks Bug Bounty

## Title: Unauthenticated Information Disclosure via ServiceNow Portal API and Backend UI Exposure

**Target:** customerservice.starbucks.com  
**Severity:** Medium/High  
**Type:** Information Disclosure / Security Misconfiguration  
**Platform:** ServiceNow (build: 06-19-2026_0859)  
**Instance:** starbuckshelp  

---

### Summary

The Starbucks ServiceNow customer service portal at `customerservice.starbucks.com` exposes sensitive configuration data and backend login pages **without authentication**. Two distinct issues were discovered:

---

### VULN-1: Unauthenticated Access to Portal API Configuration

**Endpoint:** `GET /api/now/sp/page`  
**Response:** HTTP 200  
**Auth required:** None

The ServiceNow portal API endpoint returns the full portal configuration, including:

- **Guest user data:** sys_id, username, email, language preference, name
- **Portal theme configuration:** CSS, footer, header structure
- **Page metadata:** human_readable_url, title, static_title
- **Container configuration** (empty in default response but structure exposed)

**Request:**
```http
GET /api/now/sp/page HTTP/2
Host: customerservice.starbucks.com
```

**Response (537 bytes):**
```json
{
  "result": {
    "user": {
      "sys_id": "5136503cc611227c0183e96598c4f706",
      "preferred_language_dv": "English",
      "user_name": "guest",
      "logged_in": false,
      "can_debug": false,
      "name": "Guest",
      "can_debug_admin": false,
      "last_name": "Guest",
      "avatar": "",
      "first_name": "",
      "email": "guest@example.com",
      "preferred_language": "en"
    },
    "page": {
      "human_readable_url": "",
      "css": "",
      "has_custom_main_tag": false,
      "untranslated_title": "",
      "title": "",
      "static_title": ""
    },
    "theme": { "footer": {}, "header": {} },
    "containers": []
  }
}
```

**Additional parameter:** `?id=login` returns login-specific page configuration with widget data, option schemas, and additional metadata.

---

### VULN-2: ServiceNow Backend UI Exposed on Portal Hostname

The ServiceNow backend administrative interface is accessible on the same hostname as the public customer portal. This includes:

| Endpoint | Status | Size | Description |
|----------|--------|------|-------------|
| `/login.do` | 200 OK | 44 KB | ServiceNow admin login page |
| `/pwd_reset.do` | 200 OK | 22 KB | Password reset interface |
| `/auth_redirect.do` | 200 OK | 21 KB | Authentication redirect handler |
| `/error.do` | 302 → login | - | Error handler redirecting to login |
| `/cache.do` | 302 → login | - | Cache management redirect |
| `/$pwd_reset.do` | 301 Moved | - | Password reset alias |

The login pages expose:
- **CSRF tokens** (`g_ck`) for potential session attacks
- **Build dates and version information**
- **Internal ServiceNow globals and API endpoints**
- **Instance ID:** `8495d317dbe2b41042b321c4059619cf`
- **Portal ID:** `7c6a408c1b049110b6f1a60abc4bcb8a`

**Request (unauthorized):**
```http
GET /login.do HTTP/2
Host: customerservice.starbucks.com
```

Response: 200 OK, 44KB — Full ServiceNow login page with session tokens and internal metadata.

---

### Additional findings (Lower Severity)

| Finding | Severity | Details |
|---------|----------|---------|
| 26+ Internal sys_ids leaked | Medium | Instance, portal, theme, user, and page sys_ids exposed in HTML source |
| SAML SSO configuration visible | Medium | IDP URL (`sts-vis-cloud1.starbucks.com`), SSO flow metadata accessible |
| Portal page enumeration | Medium | Pages enumerable via `?id=` parameter without auth |
| Angular directives accessible | Low | `/angular.do?sysparm_type=get_partial&name=directive.snImageUploader` returns internal templates |

---

### Impact

1. **Information Disclosure:** An attacker can enumerate portal configuration, guest user structure, and internal sys_ids used for ServiceNow ACL bypasses
2. **Brute-force attack surface:** The exposed `/login.do` and `/pwd_reset.do` endpoints allow unauthenticated attackers to perform password spraying, credential stuffing, and account enumeration against Starbucks internal ServiceNow instance
3. **Phishing vector:** The exposed authentication pages can be cloned for targeted phishing campaigns against Starbucks employees and partners
4. **SAML SSO reconnaissance:** The visible SAML configuration enables attackers to identify the SSO provider and potentially craft attacks against the identity provider

---

### Steps to Reproduce

1. Navigate to `https://customerservice.starbucks.com/api/now/sp/page` in any browser or curl
2. Observe the JSON response containing guest user data and portal configuration
3. Navigate to `https://customerservice.starbucks.com/login.do`
4. Observe the ServiceNow backend login page without any authentication

### Remediation Suggestion

1. Restrict `/api/now/sp/page` to return minimal data or require authentication
2. Block `/login.do`, `/pwd_reset.do`, `/auth_redirect.do`, `/error.do`, and `/cache.do` at the web server/load balancer level for unauthenticated users
3. Implement hostname segregation between the public portal and admin backend
4. Remove internal sys_ids, version data, and SAML configuration from unauthenticated responses
5. Rate-limit access to authentication endpoints

---

**Reported by:** nathanmoore (HackerOne)  
**Date:** June 24, 2026  
**Testing methodology:** Manual recon via curl and browser
