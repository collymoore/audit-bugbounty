---
title: BAC Credomatic — Target Intelligence Dossier
author: NSI (Null Session Intelligence LLC)
created: 2026-07-16
status: active — pending scope verification
classification: future-target
---

# 🎯 BAC Credomatic — Target Dossier

## 1. Datos Generales

| Campo | Valor |
|-------|-------|
| **Grupo** | BAC Credomatic (BAC LATAM) |
| **HQ** | San José, Costa Rica |
| **Org Shodan** | `BAC LATAM SSC SOCIEDAD ANONIMA` |
| **Presencia** | Centroamérica (CR, NI, HN, GT, SV) + Panamá |
| **Negocio** | Banca personal, corporativa, tarjetas de crédito, seguros |
|**Programas BB** | No verificado — buscar en H1 / Bugcrowd / Intigriti |
|**Fecha último scan** | 2026-07-16 |
|**Shodan credits usado** | ~20 queries |

## 2. Superficie de Ataque — Shodan

### 2.1 Netblock BAC LATAM (todo en CR, no RD)

| IP | Hostname | Puertos | Función |
|----|----------|---------|---------|
| `200.115.18.9` | `*.bac.net` | 443 | Portal corporativo principal |
| `200.115.18.39` | **`h2htest.baccredomatic.com`** | 443, 222 | ⚠️ STAGING |
| `200.115.18.42` | `oauthservice.baccredomatic.com` | 443 | OAuth service |
| `auth.baccredomatic.com` | CNAME | 301 → /login/ | Auth portal |
| `190.113.97.67-80` | cache.google.com | 80 | Forward proxies (BAC org) |

### 2.2 ⚠️ STAGING: h2htest.baccredomatic.com (PRIORIDAD 1)

```
Aplicación:  GoAnywhere MFT (Fortra/HelpSystems)
Título:      "GAMFT Stagging - Login" (typo deliberado?)
Stack:       Java / PrimeFaces (Aristo) / JSF / JSESSIONID
Puerto 443:  Login page (2-step: username → password)
Puerto 222:  Abierto — posible REST API / SSH / admin listener
```

**Cabeceras de seguridad (presentes):**
- `X-FRAME-OPTIONS: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Cache-Control: no-cache, no-store, must-revalidate`
- HttpOnly + Secure en JSESSIONID

**🧪 Live probes (2026-07-16):**

| Probeta | Resultado |
|---------|-----------|
| `CVE-2024-0204 — POST /GoAnywhere/rest/v1/health` (222) | Sin respuesta |
| `CVE-2024-0204 — POST /rest/v1/health` (222) | Sin respuesta |
| `Port 222 — GET /Login` | Sin respuesta |
| `Port 222 — GET /api/v1/health` | Sin respuesta |
| `Version string in resources` | `v=BDUBWS` (PrimeFaces build hash) |
| `auth.baccredomatic.com` | `301 → /login/` |
| `SSL h2htest` | TLS 1.2 + 1.3, GlobalSign OV, `CN=h2htest.baccredomatic.com` |
| `SSL oauthservice` | TLS 1.2 ONLY (no 1.3), `CN=*.baccredomatic.com` |

> ⚠️ Puerto 222 no respondió a probes HTTP directos — podría ser SSH, non-HTTP protocol, o requerir header específico.

**Paths verificados:**

| Path | Status | Notas |
|------|--------|-------|
| `/webclient/Login.xhtml` | 200 | Login full page |
| `/webclient/Dashboard.xhtml` | 302 | Redirect → login |
| `/GoAnywhere/` | 404 | |
| `/api/` | 404 | |
| `/rest/` | 404 | |
| `/ws/` | 404 | |

**Session timeout:** 300s (5 min) — visible en JS: `SessionTimeoutCounterModule(300)`

### 2.3 OAuth Service: oauthservice.baccredomatic.com

| Aspecto | Valor |
|---------|-------|
| TLS | 1.2 solamente (no 1.3) |
| `.well-known/openid-configuration` | Sin respuesta |
| `.well-known/oauth-authorization-server` | Sin respuesta |
| Cert | `*.baccredomatic.com` — GlobalSign OV SSL |
| Función | Desconocida (no respondió a probes HTTP básicas) |

### 2.4 Auth Portal: auth.baccredomatic.com

- Responde 301 → `https://auth.baccredomatic.com/login/`
- No inspeccionado aún

## 3. CVEs Relevantes

### 3.1 GoAnywhere MFT (producto Fortra)

| CVE | Score | Tipo | Requisito |
|-----|-------|------|-----------|
| **CVE-2024-0204** | **9.8** CRITICAL | Auth bypass REST API | Versión < 7.4.1 |
| **CVE-2024-0205** | **8.8** HIGH | Improper authentication | Versión < 7.4.1 |
| CVE-2024-0206 | 7.5 HIGH | XXE | Versión < 7.4.1 |
| CVE-2023-49888 | 7.2 HIGH | Java deserialization | Versión < 7.1.2 |

**CVE-2024-0204 — Ruta de ataque:**
```
POST /GoAnywhere/rest/v1/health  (puerto 222)
→ Si bypass funciona → RCE en el contexto del STAGING
```

⚠️ Es STAGING — probablemente corre versión más vieja que producción.

### 3.2 PrimeFaces

| CVE | Score | Tipo |
|-----|-------|------|
| CVE-2024-28135 | 8.1 | EL Injection |
| CVE-2023-45323 | 7.5 | XSS via upload |

## 4. Vectores Prioritarios

| # | Prioridad | Vector | Acción |
|---|-----------|--------|--------|
| 🟥 | **P1** | CVE-2024-0204 en GoAnywhere (staging) | Probar bypass REST API en puerto 222 |
| 🟧 | **P2** | Puerto 222 desconocido | Nmap -sV para identificar servicio |
| 🟧 | **P3** | OAuth misconfiguration | Probar SSRF, open redirect, token leakage |
| 🟨 | **P4** | auth.baccredomatic.com | Inspeccionar login page |
| 🟨 | **P5** | Google forward proxies (BAC org) | Verificar qué exponen |

## 5. Notas Operativas

- **Sin presencia en RD** — toda la infraestructura está en Costa Rica
- **H2H** en hostname = probablemente "Host-to-Host" (transferencias interbancarias)
- **Typo "Stagging"** sugiere poca revisión en el entorno
- No hay credenciales por defecto obvias (admin/admin no probado formalmente)
- **Staging** es el entry point ideal — suele tener menos hardening que prod

## 6. Próximos Pasos

- [x] Shodan recon completo (org BAC LATAM SSC SOCIEDAD ANONIMA)
- [x] Probes HTTP a staging (puertos 443 + 222)
- [x] Probar CVE-2024-0204 paths contra staging
- [x] Identificar GoAnywhere MFT + PrimeFaces + JSF stack
- [x] Verificar `auth.baccredomatic.com` (301 → /login/)
- [ ] Verificar si BAC está en HackerOne / Bugcrowd / Intigriti como target
- [ ] Nmap a `200.115.18.39` full port scan (-p-)
- [ ] Nmap -sV a puerto 222 (identificar protocolo no-HTTP)
- [ ] Probar CVE-2024-0204 PoC avanzado con headers específicos
- [ ] Fuzzing de directorios GoAnywhere con wordlist especializada
- [ ] Investigar BAC LATAM en GitHub / leaks
- [ ] Probar credenciales genéricas (admin/admin, admin/Admin123, etc.)
- [ ] Navegar `auth.baccredomatic.com/login/` completo

---

*Documento preparado por NSI — Null Session Intelligence LLC*
*2026-07-16 · Rev 1.0*
