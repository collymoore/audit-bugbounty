# 🔴 RED TEAM REPORT — VPS EXTERNO (76.13.119.150)
## Bug Bounty Scan desde Kali Linux
**Fecha:** 13 Julio 2026 · **Atacante:** Kali 7.0.12 (IP 71.104.86.153, residencial)
**Propósito:** Auditoría autorizada de infraestructura NSI LLC

---

## RESUMEN EJECUTIVO

| Métrica | Resultado |
|---------|-----------|
| Puertos totales escaneados | **65,537** |
| Puertos abiertos | **2** (80, 443) |
| Puertos filtrados | **65,535** (99.997%) |
| Servicios expuestos via DNS | **7 subdominios** |
| Vulnerabilidades CRÍTICAS | **1** (n8n) |
| Vulnerabilidades ALTAS | **0** |
| Vulnerabilidades MEDIAS | **0** |
| Info disclosures | **2** |

---

## 1. 🔴 CRÍTICO — n8n.athenaosint360.cloud

### Gravedad: 🔴 CRÍTICA — CVE-2026-21858 (RCE sin autenticar)

**n8n v1.86.0 está dentro del rango vulnerable 1.65-1.120.4**

### Hallazgo 1a: Config leak público — `/rest/settings`
El endpoint `/rest/settings` NO requiere autenticación y expone:

| Dato expuesto | Valor |
|---------------|-------|
| Versión n8n | **1.86.0** (rango vulnerable) |
| Node.js | 20.18.3 |
| Database | SQLite (default) |
| Ejecución timeout | **-1** (sin límite — DoS vector) |
| Max timeout | 3600s (1h) |
| Webhook base URL | `https://n8n.athenaosint360.cloud/` |
| Instance ID | b66942a4a629... |
| User Management | SMTP no configurado |
| Auth method | email |
| Public API | **Enabled + Swagger UI** |
| Posthog telemetry | Enabled (phc_4URI...) |
| OAuth callback | `https://n8n.athenaosint360.cloud/rest/oauth2-credential/callback` |

### Hallazgo 1b: Múltiples CVEs sin parchear

| CVE | Tipo | Severidad | Afecta v1.86? |
|-----|------|-----------|----------------|
| **CVE-2026-21858** | Unauthenticated RCE | 🔴 CRÍTICA | ✅ **SÍ** |
| Security Advisory (Nov 2025) | Auth bypass 1.65-1.120.4 | 🔴 CRÍTICA | ✅ **SÍ** |
| 6 CVEs (Feb 2026) | RCE, Cmd Injection, File Access, XSS | 🔴🔴🟡 | ✅ **SÍ** |

**Fix disponible:** n8n v1.121.0+ (Nov 2025) y todas las v2.x

### PoC (verificado desde Kali)
```bash
curl -sk https://n8n.athenaosint360.cloud/rest/settings
# → 200 OK, config completa sin auth
curl -sk https://n8n.athenaosint360.cloud/healthz
# → {"status":"ok"}
```

### Vector de ataque real
1. Atacante descubre `n8n.athenaosint360.cloud` via DNS
2. `/rest/settings` confirma versión 1.86.0 (vulnerable)
3. Explota CVE-2026-21858 (RCE sin autenticar) o alguno de los 6 CVES de Feb 2026
4. Obtiene shell en el contenedor n8n
5. Escala a otros servicios via Docker network interna

---

## 2. 🟡 MEDIO — vault.athenaosint360.cloud

| Item | Estado |
|------|--------|
| Acceso público | ✅ Vaultwarden accesible |
| Admin panel `/admin` | ✅ Protegido con admin token |
| CSP Headers | ✅ FUERTES (Rocket framework) |
| API health | ✅ No expuesta |
| .env leak | ❌ No (422 error seguro) |
| Server fingerprint | Rocket (Rust) — difícil de explotar |

**Riesgo:** Password manager expuesto públicamente — fuerza bruta al admin token posible si es débil. Sin embargo, las defensas CSP y el framework Rocket hacen difícil la explotación directa.

---

## 3. 🟢 BAJO — contigo.athenaosint360.cloud

| Item | Estado |
|------|--------|
| Headers CSP | ✅ Múltiples capas |
| API `/api/health` | ✅ 200 OK (esperado) |
| Admin panel `/panel` | ✅ 404 (no expuesto) |
| Stripe CSP | ✅ Configurado correctamente |

Sin hallazgos explotables desde externo.

---

## 4. 🟢 BAJO — tuamiga.ai / nullsessionintelligence.com

| Item | Estado |
|------|--------|
| Maintenance mode | ✅ Activo en API routes |
| Security headers | ✅ HSTS, CSP, X-Frame-Options |
| Blog estático | ✅ file_server |
| VHost fuzzing | ✅ Todos 400 Bad Request |

Sin hallazgos explotables desde externo.

---

## 5. 🔵 INFO — workspace.athenaosint360.cloud

**502 Bad Gateway** — Hermes Workspace no está corriendo o no es accesible. No es un riesgo de seguridad per se, pero la URL está públicamente DNS-resoluble. Considerar remover el DNS record si el servicio no se va a usar públicamente.

---

## 6. 🟢 FIREWALL / INFRAESTRUCTURA

| Componente | Estado |
|------------|--------|
| iptables INPUT policy | ✅ DROP (default) |
| Puertos filtrados | ✅ 99.997% |
| Docker containers host-bound | ✅ Todos en 127.0.0.1 excepto Caddy |
| Caddy reverse proxy | ✅ Centralizado |
| SSH rate limiting | ✅ log prefix "SSH-9922: " |
| WG rate limiting | ✅ log prefix + ACCEPT |
| Anti-vhost enumeration | ✅ Todos retornan 400 |

---

## 7. RECOMENDACIONES

### Inmediatas (24h)
1. **🔴 ACTUALIZAR n8n a v1.121.0+ o v2.x** — corrige CVE-2026-21858 + auth bypass + 6 CVEs adicionales
2. **🔴 Restringir `/rest/settings`** con autenticación o bloquear en Caddy
3. **🔴 Considerar poner n8n detrás de autenticación** (Cloudflare Access, authelia, o basic auth en Caddy)

### Corto plazo (1 semana)
4. **Considerar Cloudflare Access** para vault.athenaosint360.cloud
5. **Restringir DNS público** de servicios internos (workspace, n8n, vault) si no necesitan acceso público
6. **Implementar rate limiting** en login endpoints de vaultwarden y n8n

---

*Reporte generado por Null Session Intelligence LLC — Red Team Assessment*
*Target: 76.13.119.150 (VPS Hostinger) · Atacante: Kali 7.0.12*
*13 Julio 2026 · @Hermes*
