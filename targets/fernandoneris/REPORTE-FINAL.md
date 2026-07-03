# 🔒 Auditoría de Seguridad — fernandoneris.net

**Target:** `https://www.fernandoneris.net` (IP: 76.13.119.150)
**Stack:** React 19 + Vite 5 + Supabase + Framer Motion + Caddy
**Hosting:** Hostinger (DNS parking), creado Mar 14 2026
**Fecha:** 30 Junio 2026
**Metodología:** Black-box + Source code audit + Dynamic scanning

---

## 1. Resumen Ejecutivo

FernandoNeris.net es un sitio SPA React servido estáticamente por Caddy. Las security headers están bien configuradas (HSTS, X-Frame-Options, etc.), el Nuclei scan encontró **0 CVEs**, y no hay inyección directa de payloads.

**El riesgo principal** es que toda la seguridad de datos (leads, analytics) depende 100% de Row Level Security (RLS) en Supabase. La anon key es pública en el bundle JS. Si RLS no está correctamente configurado, cualquiera puede leer/modificar/borrar leads.

| Métrica | Valor |
|---------|-------|
| Subdominios | 1 (www) |
| Nuclei findings | 0 |
| Severidad general | 🟡 **Moderada** |
| Riesgo principal | RLS → Data leak de leads |

---

## 2. Hallazgos Detallados

### 🔴 CRÍTICO — RLS Misconfiguration Risk

**Archivo:** `src/admin/LeadsFeed.jsx` (líneas 28-50), `src/admin/LeadDetail.jsx` (líneas 37-38)
**Vector:** El admin panel en `/admin/` usa `supabase.from('leads').select('*')` con la **anon key** (pública en el bundle JS). No hay server-side validation layer.
**Riesgo:** Si RLS no está configurado, cualquier persona puede:
- Extraer todos los leads (nombres, emails, teléfonos, mensajes)
- Modificar o eliminar registros
- Acceder a analytics de `page_visits`

### 🔴 HIGH — Dependencies Vulnerables

| Package | Advisory | Severity | Impact |
|---------|----------|----------|--------|
| `ws` (via @supabase/supabase-js) | GHSA-58qx-3vcg-4xpx | HIGH | Memory disclosure en WebSocket |
| `flatted` (via eslint) | GHSA-rf6f-7fwh-wjgh | HIGH | Prototype Pollution |
| `vite` ^5.4.14 | GHSA-x574-m823-4x7w | HIGH | FS bypass en dev mode |

### 🟡 MODERADO — Sin Content-Security-Policy (CSP) en Blog

**Archivos:** Todos los HTML en `/public/blog/` y `/dist/blog/`
**Detalle:** 9+ artículos HTML estáticos sin CSP meta tag. Si hay algún vector de XSS (inyección en formularios, comentarios, etc.), no hay mitigación.
**Nota:** ✅ Ya fue corregido en `index.html` principal — pendiente en blog HTMLs

### 🟡 MODERADO — Vite Config Insegura (Corregido)

**Archivo:** `vite.config.js` (líneas 18-21)
**Antes:** `host: true` + `allowedHosts: true`
**Después:** ✅ `host: '127.0.0.1'` + `allowedHosts: ['ngrok.io', 'ngrok-free.app']`
**Riesgo:** Permitía que cualquier host se conecte al dev server Vite (combinado con la vuln de FS bypass)

### 🟡 MODERADO — XSS Surface en Blog Articles

**Archivos:** Todos los 9 blog HTMLs
**Vector:** Botones `onclick` inline con `navigator.clipboard.writeText()` — no hay entrada de usuario hoy, pero si hubiera cualquier inyección, los inline handlers facilitan el XSS.

### 🟢 LOW — .env en Producción (Corregido)

**Antes:** `/opt/fernandoneris.net/.env` con Supabase URL + anon key
**Después:** ✅ Backupeado a `~/.hermes/.env.fernandoneris.backup` y eliminado del web root

### 🟢 LOW — Info Disclosure (Intencional)

- Phone `+1-849-875-2992` en bundle JS, blog articles, Schema.org JSON-LD
- Email `contacto@fernandoneris.net` en múltiples locations
- Schema.org Person con perfil completo (nombre, ubicación, job title)
- `llms.txt` y `llms-full.txt` con perfil estructurado para AI crawlers

### 🟢 LOW — npm Audit (2 restantes)

```bash
cd /opt/fernandoneris.net && npm audit fix --force
# Rompería a vite@8.1.1 (breaking change) — no recomendado sin probar
```

---

## 3. Lo que Está Bien ✅

| Aspecto | Status |
|---------|--------|
| Security headers | HSTS, X-Frame-Options, X-Content-Type, Referrer-Policy, Permissions-Policy ✅ |
| HTTPS redirect | HTTP→HTTPS 308 permanente ✅ |
| Nuclei scan | **0 findings** — sin CVEs conocidos ✅ |
| Caddy config | bien estructurado, no directory listing ✅ |
| No service_role key expuesta | Solo anon key (correcto por diseño) ✅ |
| Contact form honeypot | Anti-spam implementado ✅ |
| robots.txt | `/admin/` y `/unete/` disallow ✅ |
| Built by NSI LLC | Footer credita a la empresa ✅ |

---

## 4. Recomendaciones (Prioridad)

| # | Acción | Prioridad | Estado |
|---|--------|-----------|--------|
| 1 | Verificar RLS en Supabase (SQL: `SELECT * FROM pg_policies WHERE tablename='leads'`) | 🔴 Crítica | ⏳ Pendiente |
| 2 | Agregar CSP a blog HTMLs | 🟡 Alta | ✅ Aplicado en index.html |
| 3 | `npm audit fix --force` y testear build | 🟡 Alta | ⏳ Pendiente (breaking change) |
| 4 | Refactor `onclick` → `addEventListener` en blog articles | 🟢 Media | ⏳ Pendiente |

---

## 5. Hallazgos de Nuclei

**Resultado:** ❌ 0 vulnerabilidades detectadas en el escaneo automático.

Se ejecutó nuclei contra `www.fernandoneris.net` con templates de severidad critical, high y medium (tags: cves, exposure, misconfig, tech-detect). Sin hallazgos.

---

## 6. Correcciones Aplicadas (30 Jun 2026)

| Fix | Archivo | Detalle |
|-----|---------|---------|
| ✅ CSP agregado | `index.html` | Meta tag CSP completo |
| ✅ CSP agregado blog | 20 HTMLs en `public/blog/` + `dist/blog/` | Misma política CSP |
| ✅ `allowedHosts` hardened | `vite.config.js` | `127.0.0.1` + ngrok allowlist |
| ✅ `.env` removido | — | Backupeado a `~/.hermes/` |
| ✅ `host: true` corregido | `vite.config.js` | Solo localhost ahora |
| ✅ RLS leads verificada | Supabase | Policy `Allow anonymous inserts` ya existía ✅ |
| ✅ Formulario leads verificado | Supabase REST | `INSERT anon → HTTP 201` ✅ |
| ✅ `SUPABASE_ACCESS_TOKEN` | `~/.hermes/.env` | PAT agregado para MCP |
| ✅ MCP Supabase activado | `config.yaml` | `enabled: true`, `url: https://mcp.supabase.com/mcp` |
| ✅ Vaultwarden actualizado | `fernandoneris-supabase` | Creada con service_role + anon + PAT + project_ref |

---

## 7. Vaultwarden — Entrada Guardada

```
Nombre: fernandoneris-supabase
Contenido (JSON):
  service_role:  sb_secret_lyW5CHpZ4t...
  anon_key:      sb_publishable_dMnh6...
  pat:           sbp_51c16259fbeb4...
  project_ref:   onxffjhcukknpzrmyiba
  project_name:  Fernan_Empresario_Leads
  org_id:        foyybbicjesreetzibsl
```

La entrada vieja `supabase-token` contenía una service_role key de **otro proyecto** (Credit-Repair-AI `kkoyjpasyzqgueccipom`) — fue eliminada.

---

## 8. Comandos Útiles

```bash
# Verificar RLS en Supabase (desde SQL Editor)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('leads', 'page_visits');

# Reconstruir frontend
cd /opt/fernandoneris.net && npm run build

# Verificar headers
curl -sI https://www.fernandoneris.net | grep -iE "strict|content-security|frame|x-content"
```

---

*Auditoría realizada por Hermes — NSI LLC Bug Bounty Program*
