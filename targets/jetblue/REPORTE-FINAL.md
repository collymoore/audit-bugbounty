# 🔒 Auditoría de Seguridad — JetBlue (HackerOne VDP)

**Programa:** VDP (sin bounty) — https://hackerone.com/jetblue
**Scope:** `*.jetblue.com` + 13 subdominios específicos
**Fecha:** 30 Junio 2026

---

## 1. Resumen

| Métrica | Valor |
|---------|-------|
| Subdominios descubiertos | 936 |
| Hosts vivos | 245 |
| Hallazgos reportables | 7 |
| Severidad máxima | 🔴 Medium (VDP) |

---

## 2. Hallazgos Reportables

### 🔴 MEDIUM — CORS Misconfiguration en Magnolia CMS

| Subdominio | Estado | Tech |
|------------|--------|------|
| `cms.jetblue.com` | 302 | Magnolia CMS + Varnish |
| `legacycms.jetblue.com` | 302 | Magnolia CMS + Varnish |

Ambos devuelven `Access-Control-Allow-Origin: *` en TODAS las respuestas. Cualquier sitio externo puede hacer peticiones cross-origin desde el navegador de una víctima autenticada.

**Info adicional expuesta:**
- Internal Magnolia Platform URLs: `prod.author.jetblue-prod.magnolia-platform.io`
- `x-magnolia-registration: Registered`
- CSRF tokens y JSESSIONID en requests no autenticados
- `/actuator`, `/actuator/info`, `/actuator/health` accesibles (redirect a infraestructura interna)

### 🔴 MEDIUM — SmartNotify API sin Autenticación

**Target:** `jetblue-smartnotify-prod-api.azurewebsites.net` (hardcodeado en bundle JS de trackmybag)

**Endpoint abierto:** `GET /api/MicrositeSettings/GetMicrositeSettings` → **HTTP 200** sin auth, devuelve config completa:
```json
{"carrierCode":"B6","fileClaimUrl":"https://app.nettracer.aero/pax/jetblue/bso/login",...}
```

**Otros endpoints mapeados desde source:**
- `GET  /api/Events/GetEncryptedString?surname=X&pnr=X` → datos de pasajeros encriptados (sin auth)
- `POST /api/CreateTracerRecord/CreateTracerRecord` → crear registros de equipaje
- `POST /api/PassengerNotification/SavePassengerNotificationMethods`

### 🟡 LOW — Internal Infrastructure Disclosure

- `cms.jetblue.com` redirige a `prod.author.jetblue-prod.magnolia-platform.io`
- `legacycms.jetblue.com` redirige a `legacyprod.author.jetblue-prod.magnolia-platform.io`
- Internal AWS/Azure hostnames expuestos en redirects y headers

### 🟡 LOW — Sabre SSO Manager Full API Surface Expuesta

**Target:** `sabre-sso-manager.jetblue.com` (200, React SPA)

En bundle JS:
- **Azure MSAL Config:** Client ID `9b55c20c-1a99-4160-b6b9-19276ebca6eb`, Authority `login.microsoftonline.com/d9217073-9527-487c-9687-b6bbd93ed621`
- **Backend API:** `sabre-sso-manager-prod.azurewebsites.net`
- **CRUD endpoints:** `GET/PATCH /items/epr/{EPR}` para gestionar mapeos SSO
- **CSV import/export** para bulk SSO mapping

### 🟡 LOW — Dev/Staging API Header Leak

`www-dev2.jetblue.com` y `www-stg2.jetblue.com` exponen:
```
access-control-allow-origin: *
access-control-allow-headers: ..., ocp-apim-subscription-key, x-auth-token
```
El header `ocp-apim-subscription-key` revela uso de Azure API Management.

### 🟢 LOW — Source Map Disponible

`trackmybag.jetblue.com/static/js/main.8828e13e.js.map` — 4.5MB de código fuente completo sin compilar.

---

## 3. Infraestructura Interna Expuesta

| Servicio | Subdominio | Accesible? |
|----------|-----------|-----------|
| Grafana | `grafana.it.jetblue.com` | 🔒 OAuth2 + Azure AD |
| Kibana | `kibana.it.jetblue.com` | 🔒 403 |
| Elasticsearch | `elasticsearch.it.jetblue.com` | 🔒 403 |
| Prometheus | `prometheus-*.it.jetblue.com` | 🔒 401 Basic |
| SonarQube | `sonarqube.it.jetblue.com` | 🔒 302 |
| Jenkins | `*.jenkins*.it.jetblue.com` | ❌ No resuelve DNS |
| Jira | `jira.it.jetblue.com` | 🔒 |
| Confluence | `confluence.it.jetblue.com` | 🔒 |
| Bitbucket | `bitbucket.it.jetblue.com` | 🔒 |
| Artifactory | `artifactory.it.jetblue.com` | 🔒 |
| Sabre SSO | `sabre-sso-manager.jetblue.com` | ✅ 200 (React SPA) |
| SmartNotify API | `jetblue-smartnotify-prod-api.azurewebsites.net` | ✅ 200 sin auth |

---

## 4. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **CDN/WAF** | Varnish, Fastly, Cloudflare, Akamai (Imperva) |
| **Cloud** | AWS (CloudFront, S3), Azure (Front Door, App Service, AD) |
| **CMS** | Magnolia CMS (Java) |
| **Frontend** | React, React SPA (Vite, create-react-app) |
| **Backend** | Java, ASP.NET, Node.js |
| **API Gateway** | Azure API Management |
| **Monitoring** | Prometheus, Grafana, Kibana, Elasticsearch |
| **CI/CD** | Jenkins, SonarQube, Artifactory |
| **Auth** | Azure AD, Okta, Sabre SSO |
| **DevOps** | Atlassian (Jira, Confluence, Bitbucket) |

---

## 5. Observaciones

- JetBlue usa **Varnish + Fastly + Cloudflare + Akamai** — multi-CDN, bien defendido
- La mayoría de los endpoints críticos (Prometheus, Kibana, ES) están detrás de nginx con auth
- Los hallazgos más sólidos son los **CORS misconfiguration** y la **SmartNotify API sin auth**
- Las Azures Functions/App Services (`*.azurewebsites.net`) están fuera del scope declarado (`*.jetblue.com`) pero la API expuesta en el bundle de trackmybag.jetblue.com (que SÍ está en scope) es reportable
- VDP (sin bounty) pero vale la pena para construir reputación en HackerOne

---

## 6. Comandos de Verificación

```bash
# CORS misconfiguration
curl -sI -H "Origin: https://evil.com" https://cms.jetblue.com | grep -i access-control

# SmartNotify API sin auth
curl -s "https://jetblue-smartnotify-prod-api.azurewebsites.net/api/MicrositeSettings/GetMicrositeSettings"

# Source map
curl -sI "https://trackmybag.jetblue.com/static/js/main.8828e13e.js.map" | grep -i content-length

# Dev CORS leak
curl -sI -H "Origin: https://evil.com" https://www-dev2.jetblue.com | grep -i access-control
```

---

## 7. HackerOne VDP Context

### ¿Qué es un VDP?

**VDP = Vulnerability Disclosure Program.** Programa donde:
- Reportas vulnerabilidades ✅
- **No pagan bounty** en efectivo ❌
- Ganas reputación en HackerOne + gracias públicas
- Sirve para construir perfil y acceder a programas privados que SÍ pagan

### Signal Requirement

JetBlue aplica **Signal Requirement** — una métrica que HackerOne usa para medir la calidad de tus reportes basada en:
- Reportes válidos vs inválidos
- Reportes duplicados
- Reportes out-of-scope

> **⚠️ Temporalmente waived para nuevos usuarios** — pero igual, cada reporte inválido baja tu Signal y puede bloquearte de programas futuros.

### Estrategia de Submission

| Finding | In-scope? | Riesgo Signal | Recomendación |
|---------|-----------|---------------|---------------|
| 1. CORS Magnolia CMS | ✅ `*.jetblue.com` | 🟢 Bajo — PoC sólido, reproducible | **Someter primero** |
| 2. SmartNotify API | ⚠️ `azurewebsites.net` (fuera de scope) referenciado desde `trackmybag.jetblue.com` (en scope) | 🟡 Medio — borderline scope | **Esperar a tener Signal positivo** |
| 3. Dev CORS + Header leak | ✅ `*.jetblue.com` | 🟢 Bajo — en scope, reproducible | **Someter después de Finding 1** |

### Orden recomendado

```
Round 1 → Finding 1 (CORS Magnolia CMS)
Round 2 → Finding 3 (Dev CORS leak)  
Round 3 → Finding 2 (SmartNotify API) — solo si R1 y R2 son aceptados
```

### HackerOne Report Files

| Archivo | Path |
|---------|------|
| Reporte completo EN (3 findings) | `/root/audit-bugbounty/targets/jetblue/hackerone_report.md` |
| Reporte auditoría ES | `/root/audit-bugbounty/targets/jetblue/REPORTE-FINAL.md` |
| Subdominios raw | `/root/audit-bugbounty/targets/jetblue/subs_raw.txt` |
| Live hosts | `/root/audit-bugbounty/targets/jetblue/live.txt` |

### Artefactos de Recon

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| `subs_raw.txt` | 936 lines | Todos los subdominios descubiertos |
| `live.txt` | 245 lines | Hosts vivos con status, tech, IP |

---

*Auditoría realizada por Hermes — NSI LLC Bug Bounty Program*
