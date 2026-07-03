# Cyber-Neo — Auditoría Externa (Arsenal Completo)
## athenaosint360.cloud — ATHENA Suite OSINT Platform

**Fecha:** 2026-07-01
**Tipo:** Black-box (arsenal completo)
**Herramientas:** subfinder, nuclei, ffuf, curl, dig, psql, openssl

---

### Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Riesgo General** | 🔴 **CRÍTICO** |
| **Stack** | SPA (Vite/React) + FastAPI + PostgreSQL + Caddy |
| **Subdominios** | 6 descubiertos |
| **CVEs encontrados** | 1 (CVE-2019-9193 — PostgreSQL command exec) |
| **Vulnerabilidades críticas** | 1 |
| **Vulnerabilidades altas** | 1 (PostgreSQL sin auth) |
| **Vulnerabilidades medias** | 1 (API backend caído 502) |
| **Informativos** | 4 |

---

### 🔴 HALLAZGOS CRÍTICOS

#### 🔴 CRIT-001: PostgreSQL Expuesto Públicamente Sin Autenticación

| Campo | Valor |
|-------|-------|
| **Severidad** | 🔴 **CRÍTICA** |
| **Puerto** | 5432 (PostgreSQL 15.18) |
| **OWASP** | A01:2021 — Broken Access Control |
| **CWE** | CWE-306: Missing Authentication |
| **Estado** | ✅ Confirmado — conexión exitosa sin contraseña |
| **Comando** | `PGPASSWORD="" psql -h athenaosint360.cloud -U postgres` |
| **Acceso** | `postgres` es SUPERUSER — Create role, Create DB, Replication, Bypass RLS |
| **Datos expuestos** | Honcho DB: sessions, messages, peers, workspaces, collections, documents, embeddings, queue |
| **Explotación** | CVE-2019-9193 permite ejecución de comandos RCE en el servidor via `COPY ... PROGRAM` |
| **Impacto** | 🔴 Pérdida total de confidencialidad. Cualquier persona en internet puede leer MODIFICAR la base de datos completa de ATHENA Suite |

**Verificación:**
```
$ PGPASSWORD="" psql -h athenaosint360.cloud -U postgres -c "SELECT version();"
PostgreSQL 15.18 (Debian 15.18-1.pgdg12+1) on x86_64-pc-linux-gnu
```

---

#### 🟡 HIGH-001: API Backend Caído (502 Bad Gateway)

| Campo | Valor |
|-------|-------|
| **Severidad** | Alta |
| **Ruta** | `/api/v1/*` |
| **Estado** | 502 Bad Gateway |
| **Descripción** | El backend FastAPI de ATHENA (athena_api:3000) no está respondiendo. El proxy Caddy reenvía a un servicio caído. |
| **Riesgo** | Denegación de servicio — plataforma OSINT no operativa |

---

#### 🟢 INFO-001: Subdominios Descubiertos

| Subdominio | Uso |
|------------|-----|
| `workspace.athenaosint360.cloud` | Hermes Workspace UI |
| `contigo.athenaosint360.cloud` | Contigo Credit Repair |
| `n8n.athenaosint360.cloud` | n8n Workflow Automation |
| `notable.athenaosint360.cloud` | Notable Services |
| `vault.athenaosint360.cloud` | Vaultwarden (Password Manager) |
| `vidaclara.athenaosint360.cloud` | VidaClara AI Assistant |

---

#### 🟢 INFO-002: SPA Catch-All Routing

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Rutas todas 200** | 17/17 rutas devuelven el SPA index.html (973 bytes) |
| **Incluye** | `/.git`, `/.env`, `/api`, `/admin`, `/wp-admin`, `/backup` |
| **Riesgo** | Bajo — es catch-all de SPA, no archivos reales |

---

#### 🟢 INFO-003: Missing security.txt

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Ruta** | `/.well-known/security.txt` |
| **Estado** | 200 — pero sirve el SPA, no el archivo real |

---

#### 🟢 INFO-004: Missing DNS Records

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **MX** | Apunta a sí mismo (loop) |
| **TXT** | Ninguno (sin SPF) |
| **DMARC** | No configurado |
| **SPF** | No configurado |

---

### Controles Verificados

| Control | Resultado |
|---------|-----------|
| **HSTS** | `max-age=31536000; includeSubDomains` ✅ |
| **CSP** | `default-src 'self'` ✅ |
| **X-Frame-Options** | `DENY` ✅ |
| **X-Content-Type-Options** | `nosniff` ✅ |
| **Referrer-Policy** | `strict-origin-when-cross-origin` ✅ |
| **Permissions-Policy** | Restringida ✅ |
| **Server leak** | Solo "Caddy" ✅ |
| **CORS** | Sin headers abiertos ✅ |
| **TLS** | Let's Encrypt, válido hasta 2026-08-28 ✅ |
| **PostgreSQL** | 🔴 **Expuesto sin auth — CRÍTICO** |
| **API v1** | 🟡 502 Bad Gateway |
| **security.txt** | ❌ No configurado |

---

### Stack Detectado

| Capa | Tecnología |
|------|-----------|
| **Frontend** | SPA (Vite + React) — servido por Caddy |
| **Styling** | Tailwind + Google Fonts (Playfair Display, Space Grotesk, Fira Code, Inter) |
| **Backend** | FastAPI (502 — caído) |
| **Base de datos** | PostgreSQL 15.18 (🔴 expuesto sin auth) |
| **Proxy** | Caddy 2.11.2 |
| **Hosting** | VPS propio (76.13.119.150) |
| **SSL** | Let's Encrypt YE2 |

### Endpoints API

| Endpoint | Status | Nota |
|----------|--------|------|
| `/api/v1/` | 502 | Backend caído |
| `/api/v1/health` | 502 | Backend caído |
| `/api/v1/projects` | 502 | Backend caído |
| `/api/v1/tools` | 502 | Backend caído |
| `/api/health` | 200 | SPA catch-all (no real) |
| `/api/` | 200 | SPA catch-all |
| `/openapi.json` | 200 | SPA catch-all |
| `/swagger` | 200 | SPA catch-all |
| `/graphql` | 200 | SPA catch-all |
| `/assets/` | 404 | Assets no expuestos |

---

### Conclusión

**Riesgo general: 🔴 CRÍTICO**

El hallazgo principal es la exposición pública de PostgreSQL 15.18 sin autenticación en el puerto 5432. El usuario `postgres` tiene permisos de SUPERUSER, lo que permite acceso total a la base de datos Honcho (sesiones, mensajes, workspaces) y potencial ejecución remota de comandos (CVE-2019-9193).

**⚠️ REQUIERE ACCIÓN INMEDIATA:**
1. Bloquear puerto 5432 en firewall de Hostinger e iptables
2. Configurar autenticación por contraseña en PostgreSQL (`pg_hba.conf`)
3. Verificar que no haya habido accesos no autorizados
4. Restaurar API backend de ATHENA (502)
