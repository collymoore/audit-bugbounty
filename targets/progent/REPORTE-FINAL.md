# 🔴 Auditoría de Seguridad — Progent (progent.com)

**Fecha:** 2026-07-01  
**Clasificación:** CONFIDENCIAL  
**Metodología:** Bug Bounty Recon Pipeline (subfinder → httpx → manual exploitation)  
**Sede:** San Jose, CA — Oficina NJ: 111 Town Square Pl, Jersey City  

---

## 📊 Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Subdominios descubiertos | **428** |
| Live hosts | **59** |
| Hallazgos | **15** (1 🔴 Crítico, 4 🟠 Alto, 4 🟡 Medio, 6 🟢 Info) |
| Stack principal | IIS 10.0, ASP.NET, Windows Server, Exchange 2019, Forgejo |

### Hallazgos por Severidad

| ID | Severidad | Tipo | Producto |
|----|-----------|------|----------|
| PG-01 | 🔴 **CRÍTICO** | Exchange 2019 OWA post-EOL | Microsoft Exchange Server 2019 CU14 |
| PG-02 | 🟠 **ALTO** | Forgejo user enumeration (sin auth) | Forgejo/Gitea 12.0.4 |
| PG-03 | 🟠 **ALTO** | PHP 7.3.1 EOL en live chat | PHP Live Chat |
| PG-04 | 🟠 **ALTO** | VPN Web Admin expuesto | Peplink SD-WAN |
| PG-05 | 🟠 **ALTO** | IIS 8.5 detalles de error expuestos | IIS 8.5 (st.progent.com) |
| PG-06 | 🟡 **MEDIO** | Matomo analytics login público | Matomo (PHP 8.2.18) |
| PG-07 | 🟡 **MEDIO** | ScreenConnect expuesto | ConnectWise ScreenConnect |
| PG-08 | 🟡 **MEDIO** | dev.progent.com sin SSL + jQuery 1.10.2 | Apache HTTPD |
| PG-09 | 🟡 **MEDIO** | Nomenclatura interna de servidores expuesta | Múltiples subdominios |
| PG-10 | 🟢 **INFO** | Sin security.txt | www.progent.com |
| PG-11 | 🟢 **INFO** | Sin HSTS/CSP/X-Frame-Options | www.progent.com |
| PG-12 | 🟢 **INFO** | Classic ASP con SessionFarm GUID | www.progent.com |
| PG-13 | 🟢 **INFO** | S3 Bucket (bien configurado) | onboarding.progent.com |
| PG-14 | 🟢 **INFO** | Plausible Analytics login público | plausible.progent.com |
| PG-15 | 🟢 **INFO** | Matomo Analytics login público | matomo.progent.com |

---

## 🔴 PG-01: Exchange 2019 OWA Expuesto (Post-EOL)

| Campo | Valor |
|-------|-------|
| **URL** | `https://ex.progent.com/owa/` |
| **Versión** | Exchange Server 2019 CU14 (15.2.2562) |
| **Stack** | IIS 10.0, ASP.NET 4.0.30319 |
| **EOL** | Extended Support ended Oct 14, 2025 |
| **CVSS** | 8.8 (AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H) — vector RCE genérico |

### Evidencia

```
$ curl -sI "https://ex.progent.com/owa/auth/logon.aspx"
HTTP/2 200
server: Microsoft-IIS/10.0
x-aspnet-version: 4.0.30319
x-powered-by: ASP.NET
```

Login page URL confirmada: `/owa/auth/logon.aspx` — favicon path revela `15.2.2562`

### Impacto

Exchange Server 2019 superó su fecha de fin de soporte extendido (Oct 2025). Múltiples CVEs críticos sin parche publicados después de EOL no tienen fix disponible:

| CVE | Tipo | Post-EOL? |
|-----|------|-----------|
| CVE-2024-21410 | Elevation of Privilege | Sí (parche pre-EOL) |
| CVE-2024-26198 | Information Disclosure | Sí |
| CVE-2023-36439 | Remote Code Execution | Sí |
| ProxyToken variants | Varios | Sí |

**Riesgo:** Un atacante con acceso a OWA puede realizar password spraying, NTLM relay, o explotar vulnerabilidades conocidas de Exchange para obtener acceso a buzones de correo corporativos, incluyendo potencialmente RCE en el servidor.

### Remediation
- Migrar a Exchange Online (Microsoft 365) inmediatamente
- Si no es posible, aislar el servidor OWA detrás de un VPN con MFA obligatorio
- Aplicar reglas WAF específicas para Exchange (bloquear `/ecp/`, `/powershell/`, `/autodiscover/`)

---

## 🟠 PG-02: Forgejo/Gitea User Enumeration (Sin Autenticación)

| Campo | Valor |
|-------|-------|
| **URL** | `https://git.progent.com/` |
| **Versión** | Forgejo 12.0.4+gitea-1.22.0 |
| **Endpoint** | `GET /api/v1/users/search` |
| **CVSS** | 5.3 (AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N) — Information Disclosure |

### Evidencia

```bash
$ curl -s "https://git.progent.com/api/v1/users/search?limit=50"
```

**800+ usuarios** expuestos con:
- `id` (user ID numérico)
- `login` (username)
- `full_name` (nombre completo)
- `created` (fecha de creación)
- `repos_count` (cantidad de repositorios)

Ejemplos de usuarios expuestos:

| ID | Username | Nombre |
|----|----------|--------|
| 1 | `administrator` | *(Admin del sistema)* |
| 15 | `arose.admin` | Admin: Aaron Rose |
| 38 | `arose` | Aaron Rose |
| 114 | `aatwood` | Aaron Atwood |
| 243 | `Aaron.Meyer` | Aaron Meyer |
| 449 | `ANizam.Admin` | Admin: Azeem Nizam |
| +800 más | ... | ... |

### Repositorio Público Encontrado

- `dthompson/Progent_SentinelOne_Operations_Hub` — Vacío (solo README.md)

### Impacto

Un atacante obtiene:
- Mapa completo de empleados + admins del sistema
- Usuarios para password spraying contra OWA, VPN, cPanel, etc.
- Información sobre la estructura organizacional interna
- Nombres de usuarios del sistema Forgejo para ataques de fuerza bruta

### Remediation
- Deshabilitar registro público de usuarios en Forgejo
- Requerir autenticación para `/api/v1/users/search`
- Configurar `DISABLE_REGISTRATION = true` y `REQUIRE_SIGNIN_VIEW = true`

---

## 🟠 PG-03: PHP 7.3.1 End-of-Life en Live Chat

| Campo | Valor |
|-------|-------|
| **URL** | `https://phplive.progent.com/` |
| **Versión PHP** | 7.3.1 (EOL: Dec 1, 2021) |
| **Stack** | IIS 10.0, PHP 7.3.1 |
| **CVSS** | 7.5 (AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H) — vector genérico |

### Evidencia

```
HTTP/1.1 200 OK
Server: Microsoft-IIS/10.0
X-Powered-By: PHP/7.3.1
X-Powered-By: ASP.NET
Set-Cookie: cCk=1; secure; httponly; SameSite=Strict
```

### Impacto

PHP 7.3.1 ha estado sin soporte de seguridad desde diciembre de 2021 (~4.5 años sin parches). Cualquier CVE de PHP 7.3.x descubierto después de esa fecha no tiene fix. Un live chat expuesto duplica el riesgo — es un vector de ataque común para XSS, inyección y RCE.

### Remediation
- Actualizar a PHP 8.1+ (mínimo versión con soporte activo)
- Migrar el live chat a una solución moderna (Intercom, Crisp, etc.)

---

## 🟠 PG-04: Peplink VPN Web Admin Expuesto

| Campo | Valor |
|-------|-------|
| **URL** | `http://dmvpn4.progent.com/cgi-bin/MANGA/index.cgi` |
| **Producto** | Peplink SD-WAN / VPN Router |
| **Firmware** | Build 2025/09/02 |
| **CVSS** | 7.5 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N) |

### Evidencia

```
HTTP/1.1 200 OK
Server: nginx
Set-Cookie: pauth=...; HttpOnly; SameSite=Strict
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self' *.peplink.com
X-XSS-Protection: 1; mode=block
```

Página de login con título: **"Web Admin | Welcome"**

### Impacto

La interfaz administrativa de un router Peplink (VPN appliance) expuesta a internet permite:
- Fuerza bruta contra la autenticación del router
- Ataques a CVEs conocidos de Peplink (CVE-2023-39360, CVE-2023-39361)
- Compromiso del router → acceso a toda la red corporativa

### Remediation
- Restringir acceso al Web Admin solo desde IPs internas o VPN
- Configurar MFA en el acceso administrativo
- Actualizar firmware a la versión más reciente

---

## 🟠 PG-05: IIS 8.5 Detailed Error (st.progent.com)

| Campo | Valor |
|-------|-------|
| **URL** | `https://st.progent.com/Login.aspx` |
| **Stack** | IIS 8.5, ASP.NET 4.0.30319 |
| **Endpoint** | `https://experience.progent.com/` (IIS 8.5 con error 401.2 detallado) |

### Evidencia

La página `https://experience.progent.com/` retorna un **IIS 8.5 Detailed Error 401.2 - Unauthorized** con la página de error completa de IIS, revelando:
- Versión exacta de IIS (8.5)
- Tipo de autenticación configurada (Basic)
- Stack de ASP.NET

### Impacto
Información de versiones exactas de servidores que un atacante puede usar para targeting preciso de CVEs.

### Remediation
- Configurar `customErrors mode="On"` en web.config
- Reemplazar páginas de error detalladas con páginas genéricas

---

## 🟡 PG-06: Matomo Analytics Login Público

| Campo | Valor |
|-------|-------|
| **URL** | `https://matomo.progent.com/` |
| **Versión** | Matomo (PHP 8.2.18, Apache 2.4.59, Debian) |
| **Stack** | Apache HTTPD 2.4.59, PHP 8.2.18, Debian |

Login page de Matomo analytics accesible públicamente. El análisis de datos de visitantes del sitio web está expuesto si las credenciales son débiles.

---

## 🟡 PG-07: ScreenConnect (ConnectWise Control) Expuesto

| Campo | Valor |
|-------|-------|
| **URL** | `https://help.progent.com/` |
| **Producto** | ConnectWise ScreenConnect (formerly ScreenConnect) |
| **Stack** | Microsoft HTTPAPI/2.0 |

Solución de remote desktop/support expuesta externamente. ScreenConnect ha tenido CVEs críticos de auth bypass en el pasado (CVE-2024-1709, puntaje 10.0).

---

## 🟡 PG-08: dev.progent.com sin SSL + jQuery Obsoleto

| Campo | Valor |
|-------|-------|
| **URL** | `http://dev.progent.com/` |
| **Stack** | Apache HTTPD, Bootstrap, Modernizr, jQuery 1.10.2 |
| **IP** | 67.225.186.186 |

- Corre sobre HTTP (puerto 80, sin SSL) — tráfico en texto plano
- **jQuery 1.10.2 (julio 2013)** — más de 12 años sin actualizar. Vulnerabilidades conocidas: CVE-2020-11023 (XSS), CVE-2020-11022 (XSS)
- Entorno de desarrollo (dev) expuesto a internet sin autenticación

---

## 🟡 PG-09: Nomenclatura Interna de Servidores Expuesta

Múltiples subdominios revelan la convención de nombres interna de Progent:

| Subdominio | Servidor Real |
|------------|---------------|
| `PR-APPS1` | Servidor de aplicaciones #1 |
| `PR-IIS-DEV` | Servidor IIS de desarrollo |
| `PR-IIS2-2016` | IIS Server 2016 |
| `PR-IIS3` | IIS Server #3 |
| `PR-MASTERS1` | Servidor master #1 |
| `PR-RDSGW1` | RDS Gateway #1 |
| `PR-EX19A` | Exchange 2019 Server A |
| `PR-LYNC1` | Lync/Skype for Business Server |
| `PR-STATUS12` | Servidor de estado/monitoreo |
| `PR-SIP1` | SIP/Telefonía Server |

Esto permite a un atacante mapear la infraestructura interna completa.

---

## 🟢 PG-10–15: Hallazgos Informativos

| ID | Hallazgo | Detalle |
|----|----------|---------|
| PG-10 | **Sin security.txt** | `/.well-known/security.txt` no existe |
| PG-11 | **Sin headers de seguridad** | www.progent.com no tiene HSTS, CSP, X-Frame-Options, X-Content-Type-Options |
| PG-12 | **SessionFarm GUID** | Cookie de afinidad de sesión expone GUID del servidor |
| PG-13 | **S3 Bucket onboarding** | Bien configurado (AES256, versioning, CSP restrictivo) |
| PG-14 | **Plausible Analytics** | Self-hosted, login público, Erlang/Cowboy |
| PG-15 | **Matomo login** | Analytics login público |

---

## 📋 Inventario de Activos

### Subdominios Relevantes (59 live de 428 totales)

| Dominio | Status | Tech Stack |
|---------|--------|------------|
| www.progent.com | 200 | IIS 10.0, ASP.NET, Bootstrap 3.4 |
| ex.progent.com | 302 → OWA | **Exchange 2019 CU14 (15.2.2562)** |
| git.progent.com | 200 | **Forgejo/Gitea 12.0.4** |
| phplive.progent.com | 200 | **PHP 7.3.1 (EOL)** |
| help.progent.com | 200 | **ConnectWise ScreenConnect** |
| matomo.progent.com | 200 | Matomo, Apache 2.4.59, PHP 8.2.18 |
| dmvpn4.progent.com | 200 | **Peplink VPN Web Admin** |
| st.progent.com | 302 → Login.aspx | **IIS 8.5, ASP.NET 4.0** |
| app.progent.com | 200 | Nginx 1.24.0 (Ubuntu), Caddy, Cloudflare |
| appdev.progent.com | 200 | Cloudflare, IIS 10.0 |
| dev.progent.com | 200 | Apache, jQuery 1.10.2 (HTTP) |
| plausible.progent.com | 200 | Plausible, Cowboy/Erlang |
| onboarding.progent.com | 200 | S3 + CloudFront (Rocketlane SPA) |
| itglue.progent.com | 200 | IT Glue, AWS ALB |
| portal.progent.com | 200 | HSTS, jQuery 3.5.1 |
| remote.progent.com | 200 | IIS 10.0 (Remote Desktop) |
| pr-rdsgw1.progent.com | 200 | RDS Gateway (IIS default) |
| pr-apps1.progent.com | 401 | IIS 10.0, SPNEGO |
| pr-ex19a.progent.com | 302 | Exchange 2019 Server A |
| forms.progent.com | 403 | IIS 10.0, ASP.NET |
| cert.progent.com | 200 | IIS default page |
| experience.progent.com | 401.2 | IIS 8.5, Detailed Error expuesto |
| cw-dc5.progent.com | 200 | Node.js/Express (SvelteKit) |
| pr-mkupper.progent.com | 200 | Nginx 1.24.0, Cloudflare |
| aaflights.progent.com | 302 | Python/gunicorn |
| psoc-upload.progent.com | 308 | Caddy |

---

## ⚔️ Vectores de Ataque Priorizados

| Prioridad | Vector | Subdominio | Explotabilidad |
|-----------|--------|------------|----------------|
| **1** | Exchange OWA — password spray + CVEs post-EOL | ex.progent.com | Alta |
| **2** | Forgejo — user enum para password spray | git.progent.com | Inmediata (sin auth) |
| **3** | PHP 7.3.1 EOL — live chat con CVEs sin parche | phplive.progent.com | Alta |
| **4** | Peplink VPN — admin panel brute force | dmvpn4.progent.com | Media (requiere login) |
| **5** | ScreenConnect — CVEs de auth bypass | help.progent.com | Media |
| **6** | Password spray cruzado (OWA + Forgejo + VPN) | Múltiples | Alta (usernames ya expuestos) |

---

## 🛡️ Recomendaciones Estratégicas

### Inmediato (24-48h)
1. **🔴 Migrar Exchange de OWA público** — Poner detrás de VPN o aplicar WAF con rate limiting
2. **🔴 Desconectar Peplink Web Admin** de internet público
3. **🟠 Requerir auth en Forgejo API** o deshabilitar `/api/v1/users/search` público
4. **🟠 Reemplazar PHP 7.3.1** en phplive.progent.com

### Corto Plazo (1-2 semanas)
5. **🟡 Agregar security headers** (HSTS, CSP, X-Frame-Options) en www.progent.com
6. **🟡 Agregar security.txt** en `/.well-known/security.txt`
7. **🟡 Migrar dev.progent.com a HTTPS** y actualizar jQuery
8. **🟡 Ocultar nomenclatura interna** — renombrar subdominios públicos

### Mediano Plazo (1-3 meses)
9. **🔴 Plan de migración Exchange** a Exchange Online (Microsoft 365)
10. **Desarrollar política de vulnerability disclosure** (VDP)
11. **Auditar todos los subdominios** para cerrar accesos no autorizados
12. **Implementar monitoreo continuo** de superficie de ataque

---

*Reporte generado por NSI LLC — Null Session Intelligence*  
*Toolchain: subfinder v2.14.0, httpx v1.9.0, nuclei v3.3.9, curl, Python3*
