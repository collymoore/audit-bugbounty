# Cyber-Neo — ATHENA Suite Auditoría Completa
## athenaosint360.cloud (Post-Fix)

**Fecha:** 2026-07-01
**Tipo:** Black-box + post-remediation

---

### Estado Comparativo

| Métrica | Pre-Fix | Post-Fix | Cambio |
|---------|:-------:|:--------:|:------:|
| **Riesgo General** | 🔴 CRÍTICO | 🟢 **BAJO** | ✅ |
| **PostgreSQL expuesto** | 🔴 Sin auth | 🔒 127.0.0.1 | ✅ |
| **TimescaleDB expuesto** | 🔴 0.0.0.0:5434 | 🔒 127.0.0.1:5434 | ✅ |
| **Qdrant expuesto** | 🔴 0.0.0.0:6333-6334 | 🔒 127.0.0.1:6333-6334 | ✅ |
| **amiga_web directo** | 🔴 0.0.0.0:3005 | 🔒 127.0.0.1:3005 | ✅ |
| **Nuclei findings** | 36 (críticos) | **0** | ✅ |
| **Puertos externos** | 10+ abiertos | Solo 80, 443, 9922 | ✅ |

---

### Firewall Architecture (Post-Fix)

```
Layer 1: Hostinger Hypervisor
  → ACCEPT: 80, 443, UDP 443, UDP 51820, TCP 9922
  → is_synced: true

Layer 2: iptables INPUT (policy DROP)
  → ACCEPT: lo, ESTABLISHED/RELATED, 80, 443, UDP 443, 9922, UDP 51820
  → DROP: todo lo demás

Layer 3: iptables DOCKER-USER
  → DROP: 5434(TimescaleDB), 6333-6334(Qdrant), 3005(amiga_web),
           8002(CopyTrade), 8642(Gateway), 8899, 3001, 9119(Dashboard)

Layer 4: Docker 127.0.0.1 bind
  → timescaledb: 127.0.0.1:5434
  → qdrant: 127.0.0.1:6333-6334
  → amiga_web: 127.0.0.1:3005
```

---

### Hallazgos (Post-Fix)

#### 🔴 CRIT-001 (CORREGIDO): PostgreSQL Expuesto Sin Auth

| Campo | Valor |
|-------|-------|
| **Estado** | ✅ **Corregido** |
| **Fix** | INPUT policy DROP + contenedores bindeados a 127.0.0.1 |
| **Acceso desde fuera** | 🔒 Bloqueado |
| **Acceso local** | ✅ Funcional (127.0.0.1:5432 y 127.0.0.1:5434) |

#### 🟡 HIGH-001: API Backend Caído (502 Bad Gateway)

| Campo | Valor |
|-------|-------|
| **Severidad** | Alta |
| **Ruta** | `/api/v1/*` |
| **Estado** | 502 Bad Gateway — athena_api caído |
| **Riesgo** | Plataforma OSINT no operativa |
| **Nota** | No relacionado con firewall |

#### 🟢 INFO: Subdominios

| Subdominio | Estado | Uso |
|------------|--------|-----|
| `workspace.athenaosint360.cloud` | 502 | Hermes Workspace |
| `contigo.athenaosint360.cloud` | 307 ✅ | Contigo Credit Repair |
| `n8n.athenaosint360.cloud` | 502 | n8n (posiblemente caído) |
| `notable.athenaosint360.cloud` | 502 | Notable Services |
| `vault.athenaosint360.cloud` | 200 ✅ | Vaultwarden |
| `vidaclara.athenaosint360.cloud` | 502 | VidaClara AI |

#### 🟢 INFO: Security Headers

| Header | Estado |
|--------|--------|
| HSTS | `max-age=31536000; includeSubDomains` ✅ |
| CSP | `default-src 'self'` ✅ |
| X-Frame-Options | `DENY` ✅ |
| X-Content-Type-Options | `nosniff` ✅ |
| Referrer-Policy | `strict-origin-when-cross-origin` ✅ |
| Permissions-Policy | Restringida ✅ |
| Server leak | Solo "Caddy" ✅ |
| CORS | Sin headers abiertos ✅ |

---

### Puertos Externos (Post-Fix)

```
ANTES (pre-fix):   80, 443, 5434, 6333, 6334, 3005, 8002, 8642, 8899, 3001, 9119, 9922
AHORA (post-fix):  80, 443, 9922
```

### Stack Detectado

- **Frontend:** SPA (Vite + React) — Caddy reverse proxy
- **Backend API:** FastAPI ✅ (502 — caído)
- **Bases de datos:** PostgreSQL 15.18 (Honcho) + TimescaleDB (Time series)
- **Vector DB:** Qdrant v1.18.1
- **Proxy:** Caddy v2.11.2
- **SSL:** Let's Encrypt YE2 (válido hasta 2026-08-28)

---

### Conclusión

**Riesgo general: 🟢 BAJO**

PostgreSQL ya no está expuesto. Todas las bases de datos y servicios críticos están bindeados a 127.0.0.1 con triple capa de firewall. La única observación pendiente es el API backend caído (502) que impide que la plataforma OSINT funcione — no es un problema de seguridad sino de disponibilidad.
