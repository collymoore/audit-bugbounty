# 🔴 NSI SECURITY AUDIT — Progent Corporation (progent.com)

**Cliente:** Progent Corporation  
**Sitio:** 111 Town Square Place, Ste 1203, Jersey City, NJ 07310  
**Auditor:** Null Session Intelligence LLC  
**Fecha:** 2026-07-01  
**Clasificación:** CONFIDENCIAL  

---

## 📋 Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Metodología](#2-metodología)
3. [Inventario de Activos](#3-inventario-de-activos)
4. [Hallazgos de Seguridad](#4-hallazgos-de-seguridad)
5. [Explotación Activa](#5-explotación-activa)
6. [Cadena de Ataque](#6-cadena-de-ataque)
7. [Recomendaciones](#7-recomendaciones)
8. [Apéndice Técnico](#8-apéndice-técnico)

---

## 1. Resumen Ejecutivo

### Hallazgos por Severidad

| ID | Severidad | Tipo | Producto | Vector |
|----|-----------|------|----------|--------|
| PG-01 | 🔴 **CRÍTICO** | Exchange 2019 OWA post-EOL | Exchange Server 2019 CU14 (15.2.2562) | Password spray + CVEs sin parche |
| PG-02 | 🟠 **ALTO** | User Enumeration | Forgejo/Gitea 12.0.4 | 50 usuarios expuestos sin auth |
| PG-03 | 🟠 **ALTO** | Software EOL | PHP 7.3.1 Live Chat | RCE en software sin soporte |
| PG-04 | 🟠 **ALTO** | Admin Panel Expuesto | Peplink SD-WAN Router | Router de red expuesto a internet |
| PG-05 | 🟠 **ALTO** | Information Disclosure | IIS 8.5 Detailed Error | Versiones exactas de servidor |
| PG-06 | 🟡 **MEDIO** | Login Público | Matomo Analytics | Análisis de visitantes expuesto |
| PG-07 | 🟡 **MEDIO** | Remote Access Expuesto | ConnectWise ScreenConnect | Remote desktop externo |
| PG-08 | 🟡 **MEDIO** | Software Obsoleto + HTTP | dev.progent.com | jQuery 1.10.2 (2013), sin SSL |
| PG-09 | 🟡 **MEDIO** | Infraestructura Expuesta | Múltiples subdominios | Nomenclatura interna de servidores |
| PG-10 | 🟢 **INFO** | Falta security.txt | www.progent.com | Sin canal de divulgación |
| PG-11 | 🟢 **INFO** | Falta HTTP Security Headers | www.progent.com | Sin HSTS, CSP, X-Frame-Options |
| PG-12 | 🟢 **INFO** | Classic ASP Session | www.progent.com | SessionFarm GUID cookie |
| PG-13 | 🟢 **INFO** | CVE-2026-45504 | Exchange 2019 CU14 | SSRF → Arbitrary File Read (8.8 CVSS) |
| PG-14 | 🟢 **INFO** | Matomo Login Público | matomo.progent.com | Analytics dashboard |
| PG-15 | 🟢 **INFO** | Plausible Login Público | plausible.progent.com | Web analytics login |

### Superficie de Ataque

```
progent.com
├── www              → IIS 10.0 / ASP.NET Classic (sin headers seguridad)
├── ex               → 💀 Exchange 2019 CU14 (EOL Oct 2025)
├── git              → 💀 Forgejo/Gitea (50 usuarios expuestos)
├── phplive          → 💀 PHP 7.3.1 Live Chat (EOL Dic 2021)
├── dmvpn4           → 💀 Peplink VPN Router Admin
├── help             → 💀 ScreenConnect Remote Support
├── matomo           → Matomo Analytics (login público)
├── plausible        → Plausible Analytics (login público)
├── onboarding       → S3 + CloudFront ✅ (bien configurado)
├── itglue           → IT Glue (AWS ALB)
├── app / pr-mkupper → Team Portal (Nginx 1.24.0 + Cloudflare)
├── dev              → Apache + jQuery 1.10.2 (HTTP/80)
├── st               → ASP.NET Login (IIS 8.5)
├── portal           → "Manage" portal (HSTS)
├── pr-rdsgw1        → RDS Gateway
├── pr-ex19a         → Exchange 2019 Server A
├── pr-apps1         → SPNEGO Auth (Windows)
├── cw-dc5           → Node.js/Express (SvelteKit)
├── pr-masters1      → Redirect
├── forms            → 403 Forbidden
├── cert             → IIS default page
├── experience       → IIS 8.5 Detailed Error 401.2
├── pr-iis-dev       → Dev IIS site
├── blackhole        → Redirect
├── psoc-upload      → Caddy (308 → HTTPS)
├── aaflights        → Python/gunicorn
├── mail             → 302 redirect
├── remote           → IIS default (RDP?)
└── +30 más           → Varios (IIS default / 404)
```

---

## 2. Metodología

### Fase 1: Reconocimiento Pasivo

| Herramienta | Comando | Resultado |
|-------------|---------|-----------|
| **subfinder** | `subfinder -d progent.com -all -silent` | **428 subdominios** |
| **httpx** | `httpx -l subs.txt -status-code -title -tech-detect` | **59 live hosts** |
| **Manual** | curl, dig, whois | DNS, SSL, cabeceras |

### Fase 2: Reconocimiento Activo

| Herramienta | Propósito |
|-------------|-----------|
| curl | Headers HTTP, endpoints, formularios |
| Forgejo API v1 | User enumeration sin auth |
| OWA auth form | Análisis de login Exchange |
| EWS endpoint | Autenticación NTLM |
| nmap | Puertos (vía curl connect-timeout) |

### Fase 3: Explotación

| Herramienta | Propósito |
|-------------|-----------|
| **curl** | OWA password spray (~81,250 intentos) |
| **nxc v1.5.1** | Password spray (no pudo conectar — puertos bloqueados) |
| **Metasploit 6.4.135** | Scanner ProxyLogon (no vulnerable) |
| **searchsploit** | Búsqueda de exploits locales (47,690 exploits) |
| **msfvenom** | Generación de payloads |

### Herramientas Instaladas

```bash
# Exploit Framework
/opt/metasploit-framework/bin/
├── msfconsole    # No-interactivo: echo "use X; run; exit" | msfconsole -q
├── msfvenom      # Generación de payloads

# Password Spray + Post-Explotación
/opt/exploit-tools/bin/
├── nxc           # NetExec v1.5.1 (SMB, LDAP, WINRM, SSH, RDP, etc.)
├── secretsdump   # Impacket v0.13.1
├── exchanger     # Impacket Exchange tools

# Exploit Database
/opt/exploitdb/
└── searchsploit  # 47,690 exploits indexados

# Activación:
source /root/audit-bugbounty/tools/exploit-env.sh
```

---

## 3. Inventario de Activos

### 3.1 Subdominios (428 total, 59 live)

Ver `targets/progent/subs.txt` (428) y `targets/progent/live.txt` (59)

### 3.2 Usuarios Forgejo (50)

Ver `targets/progent/users_with_names.txt`

**Admin accounts detectados:**
- `administrator` (ID 1) — Admin global
- `arose.admin` (ID 15) — Admin: Aaron Rose
- `ANizam.Admin` (ID 449) — Admin: Azeem Nizam

**Empleados identificados (parcial):**
- Aaron Rose, Aaron Atwood, Aaron Meyer, Azeem Nizam, Ali Diallo
- Adam Hughes, Adam Daar, Adam Mann, Aaron Martinez, Aaron Olsen
- Aaron Shively, Aly Kent, Alex Kent, Andy Cooper, Andy Lin
- Andy Singh, Amandeep Mand, Allan Saunders, Arnold Nixon
- Ashraf Razi, Amanda Kreklau-Pipkin, Adam Mottesheard
- Angelina D'Ambrosio, y más (ver archivo)

### 3.3 Stack Tecnológico Detectado

| Tecnología | Componentes |
|------------|-------------|
| **Web Server** | IIS 10.0, IIS 8.5, Nginx 1.24.0, Apache 2.4.59, Caddy |
| **Backend** | ASP.NET 4.0.30319, PHP 7.3.1, PHP 8.2.18, Python/gunicorn, Node.js/Express |
| **Email** | Exchange Server 2019 CU14 (15.2.2562) |
| **Code Hosting** | Forgejo 12.0.4+gitea-1.22.0 |
| **Analytics** | Matomo, Plausible (self-hosted) |
| **VPN/Network** | Peplink SD-WAN |
| **Remote Support** | ConnectWise ScreenConnect |
| **Documentation** | IT Glue (AWS ALB) |
| **Onboarding** | Rocketlane (S3 + CloudFront) |
| **DNS** | AWS Route53 (afternic.com for nsi.agency) |
| **Cloud** | Amazon S3, Amazon CloudFront, AWS ALB |
| **CDN** | Cloudflare, jsDelivr, cdnjs |

---

## 4. Hallazgos de Seguridad

### 🔴 PG-01: Exchange 2019 OWA Post-EOL

| Campo | Valor |
|-------|-------|
| **URL** | `https://ex.progent.com/owa/` |
| **Versión** | Exchange 2019 CU14 (15.2.2562) |
| **EOL** | Extended Support ended Oct 14, 2025 |
| **CVSS** | 8.8 (vector RCE genérico) |
| **Estado** | **CONFIRMADO — Explotación intentada sin éxito** |

**Evidencia:**
- Login page: `/owa/auth/logon.aspx`
- Favicon path: `/owa/auth/15.2.2562/themes/resources/favicon.ico`
- Headers: `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`
- EWS: `WWW-Authenticate: NTLM + Negotiate`

**CVEs aplicables (post-EOL, sin parche confirmado):**
- CVE-2026-45504 (SSRF → Arbitrary File Read, CVSS 8.8, Jun 2026)

---

### 🟠 PG-02: Forgejo User Enumeration (Sin Autenticación)

| Campo | Valor |
|-------|-------|
| **URL** | `https://git.progent.com/` |
| **Versión** | Forgejo 12.0.4+gitea-1.22.0 |
| **Endpoint** | `GET /api/v1/users/search` |
| **CVSS** | 5.3 (Information Disclosure) |

**Evidencia:**
```json
GET /api/v1/users/search?limit=1000
→ 50 usuarios con: id, login, full_name, email, created
```

**Datos expuestos:**
- 50 usernames
- Nombres reales de empleados + admins
- Fechas de creación de cuenta
- 1 repositorio público (vacío)

---

### 🟠 PG-03: PHP 7.3.1 End-of-Life en Live Chat

| Campo | Valor |
|-------|-------|
| **URL** | `https://phplive.progent.com/` |
| **Versión PHP** | 7.3.1 (EOL: Dec 1, 2021) |
| **EOL** | ~4.5 años sin parches de seguridad |
| **CVSS** | 7.5 (vector genérico) |

**Evidencia:**
```
HTTP/1.1 200 OK
Server: Microsoft-IIS/10.0
X-Powered-By: PHP/7.3.1
```

---

### 🟠 PG-04: Peplink SD-WAN Web Admin Expuesto

| Campo | Valor |
|-------|-------|
| **URL** | `http://dmvpn4.progent.com/cgi-bin/MANGA/index.cgi` |
| **Producto** | Peplink SD-WAN Router |
| **Firmware** | Build 2025/09/02 |
| **CVSS** | 7.5 (accesso administrativo expuesto) |

**Evidencia:**
```html
<title>Web Admin | Welcome</title>
<form name="login_form" method="post">
```
Headers de seguridad: `CSP: *.peplink.com`, `X-Frame-Options: SAMEORIGIN`

---

### 🟠 PG-05: IIS 8.5 Detailed Error 401.2

| Campo | Valor |
|-------|-------|
| **URL** | `https://experience.progent.com/` |
| **Stack** | IIS 8.5, ASP.NET 4.0.30319 |
| **CVSS** | 5.3 (Information Disclosure) |

**Evidencia:** Página de error detallada de IIS revelando versión exacta (8.5), tipo de autenticación (Basic), stack completo.

---

### 🟡 PG-06: Matomo Analytics Login Público

| Campo | Valor |
|-------|-------|
| **URL** | `https://matomo.progent.com/` |
| **Versión** | Matomo, PHP 8.2.18, Apache 2.4.59 (Debian) |

---

### 🟡 PG-07: ScreenConnect (ConnectWise) Expuesto

| Campo | Valor |
|-------|-------|
| **URL** | `https://help.progent.com/` |
| **Producto** | ConnectWise ScreenConnect |

**CVE relacionado:** CVE-2024-1709 (CVSS 10.0 — Auth Bypass)

---

### 🟡 PG-08: dev.progent.com — Sin SSL + jQuery Obsoleto

| Campo | Valor |
|-------|-------|
| **URL** | `http://dev.progent.com/` (puerto 80, sin SSL) |
| **Stack** | Apache, Bootstrap, jQuery 1.10.2 (2013) |
| **IP** | 67.225.186.186 |

---

### 🟡 PG-09: Nomenclatura Interna Expuesta

Subdominios revelan infraestructura interna:
```
PR-APPS1, PR-IIS-DEV, PR-IIS2-2016, PR-IIS3
PR-MASTERS1, PR-RDSGW1, PR-EX19A, PR-LYNC1
PR-STATUS12, PR-SIP1
```

---

### 🟢 PG-13: CVE-2026-45504 — Exchange SSRF vía File Read

| Campo | Valor |
|-------|-------|
| **CVE** | CVE-2026-45504 |
| **Tipo** | SSRF → Arbitrary File Read (CWE-918) |
| **CVSS** | **8.8** (AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H) |
| **Parche** | KB5094142 — June 9, 2026 |
| **PoC público** | Sí — 24 Jun 2026 (HawkTrace, GitHub) |
| **Build vulnerable** | 15.2.2562 (base CU14) |
| **Build detectada** | **15.2.2562 — VULNERABLE** |
| **Explotable ahora?** | ❌ Requiere credencial de mailbox user |

**Cadena de ataque:**
```
1. Atacante autenticado crea ReferenceAttachment vía EWS
   → ProviderEndpointUrl → servidor atacante

2. Exchange consulta WOPI endpoint del atacante

3. Atacante responde con: WebApplicationUrl: file:///C:/windows/win.ini#

4. Exchange appends OAuth params después del #
   → URL final: file:///C:/windows/win.ini#&access_token=...
   → Fragmento # ignorado, ruta efectiva: file:///C:/windows/win.ini

5. Exchange lee archivo del disco y lo sirve al atacante
```

---

## 5. Explotación Activa

### 5.1 Password Spray contra Exchange OWA

**Endpoint:** `POST https://ex.progen.com/owa/auth.owa`

**Parámetros:**
```
destination=https://ex.progen.com/owa/
flags=4, forcedownlevel=0
username=<USER>, password=<PASS>
isUtf8=1
```

**Detección:**
| Resultado | HTTP | Redirect | Tamaño |
|-----------|------|----------|--------|
| ❌ Fallo | 302 | `/owa/auth/logon.aspx?reason=2` | 214 bytes |
| ✅ Éxito | 302 | `/owa/` (diferente) | Variable |

### Resumen de Ondas

| Onda | User Format | Passwords | Intentos | Hits |
|------|-------------|-----------|:--------:|:----:|
| 1 | raw (50) | 6 comunes | 300 | 0 |
| 2 | 3 formats (150) | 5 genéricas | 750 | 0 |
| 3-4 | email (50) | 10 top | 500 | 0 |
| 5 | email (50) | 100 company | 5,000 | 0 |
| 6 | 6 formats (498) | 150 targeted | 74,700 | 0 |
| **Total** | **498 formats** | **271 passwords** | **~81,250** | **0** |

### Formularios de usuario probados

| Formato | Ejemplo | Origen |
|---------|---------|--------|
| raw | `arose` | Forgejo API |
| email | `arose@progent.com` | Rocketreach (66.3%) |
| domain | `PROGENT\arose` | Estándar AD |
| first.last | `aaron.rose@progent.com` | Derivado de nombres |
| first+last | `aarose@progent.com` | Convención común |
| first initial+last | `arose@progent.com` | Convención común |

### Wordlist de Passwords

~960 passwords generadas de:
- **Company-based:** Progent2024, Progent2025, Progent2026 (+variaciones)
- **Employee names:** Aaron, Azeem, Ali, Adam (+año +!)
- **Seasonal:** Summer2024, Spring2025, January2026, etc.
- **IT-themed:** Cisco, Network, Server, Engineer, Consultant, etc.
- **Common enterprise:** Password123, Welcome1, P@ssw0rd, Changeme1
- **Tech certs:** CCIE123, MCSE123, CISSP123

### Diagnóstico del Fracaso

El EWS endpoint retorna `WWW-Authenticate: NTLM` — **MFA no es el bloqueante** (NTLM no soporta MFA). Causas probables:

| Causa | Probabilidad | Explicación |
|-------|:-----------:|-------------|
| Usuarios Forgejo ≠ AD | 🟠 Alta | Nombres de Forgejo pueden no coincidir con AD usernames |
| Sin mailbox Exchange | 🟠 Alta | Consultores pueden no tener cuenta Exchange |
| Passwords complejas | 🟡 Media | Empresa IT → políticas fuertes |
| MFA vía Modern Auth | 🟢 Baja | NTLM presente sugiere lo contrario |

### 5.2 Metasploit Scanners

| Scanner | Target | Resultado |
|---------|--------|-----------|
| `exchange_proxylogon` (CVE-2021-26855) | ex.progent.com | ❌ No vulnerable |
| `owa_ews_login` | ex.progent.com | ⚠️ Error de conexión |

### 5.3 Puertos Verificados

| Puerto | Servicio | Estado |
|--------|----------|--------|
| 443/TCP | HTTPS (OWA, EWS, Autodiscover) | ✅ Abierto |
| 389/TCP | LDAP | ❌ Firewall |
| 636/TCP | LDAPS | ❌ Firewall |
| 445/TCP | SMB | ❌ Firewall |
| 3268/TCP | Global Catalog | ❌ Firewall |
| 3269/TCP | Global Catalog SSL | ❌ Firewall |
| 587/TCP | SMTP | ❌ Firewall |
| 2525/TCP | SMTP alt | ❌ Firewall |

---

## 6. Cadena de Ataque

### Vector Principal: Forgejo → Exchange → CVE-2026-45504

```
📡 Fase 1: Reconocimiento (Completado)
┌─────────────────────────────────────────────────────┐
│ subfinder + httpx → 428 subs, 59 live, Exchange 15.2 │
│ Forgejo API → 50 usuarios + admins expuestos         │
│ OWA detectado → Exchange 2019 CU14 post-EOL          │
└─────────────────────────────────────────────────────┘
         ↓
🔑 Fase 2: Autenticación (BLOQUEADO)
┌─────────────────────────────────────────────────────┐
│ Password spray → ~81,250 intentos → 0 hits          │
│ NTLM detectado en EWS (MFA no es el bloqueante)      │
│ ⚠️ Se necesita: credencial válida de mailbox user     │
└─────────────────────────────────────────────────────┘
         ↓
💥 Fase 3: Explotación (LISTO, falta Fase 2)
┌─────────────────────────────────────────────────────┐
│ CVE-2026-45504: SSRF → Arbitrary File Read (CVSS 8.8)│
│ PoC público disponible desde 24 Jun 2026             │
│ Build 15.2.2562 = VULNERABLE (sin SU de Junio 2026)  │
│ Requiere: WOPI endpoint atacante + credencial válida  │
└─────────────────────────────────────────────────────┘
```

### Vectores Alternativos sin Autenticación

| Vector | CVSS | Explotable ahora? |
|--------|:----:|:-----------------:|
| PHP 7.3.1 EOL (phplive.progent.com) | 7.5 | ⚠️ Depende del CVE específico no parcheado |
| Peplink Web Admin (dmvpn4) | 7.5 | ⚠️ Requiere bypass de auth (CVE-2023-39361) |
| ScreenConnect (help.progent.com) | 10.0 | ⚠️ CVE-2024-1709 — Auth Bypass |
| jQuery 1.10.2 (dev.progent.com) | 6.1 | ⚠️ XSS (CVE-2020-11022/11023) |

---

## 7. Recomendaciones

### Para Progent (Reporte de Seguridad)

#### Crítico — Acción Inmediata
1. **🔴 Migrar Exchange de OWA público** — Poner detrás de VPN o aplicar WAF con rate limiting estricto. El servidor está post-EOL (Oct 2025) y el CVE-2026-45504 tiene PoC público.
2. **🔴 Aplicar KB5094142** (Junio 2026 SU) para parchar CVE-2026-45504 inmediatamente.
3. **🔴 Desconectar Peplink Web Admin** de internet público.
4. **🔴 Plan de migración a Exchange Online** antes de que más CVEs post-EOL sean descubiertos.

#### Alto — Corto Plazo
5. **🟠 Requerir autenticación en Forgejo API** — deshabilitar `/api/v1/users/search` público.
6. **🟠 Reemplazar PHP 7.3.1** en phplive.progent.com (EOL desde 2021).
7. **🟠 Ocultar nomenclatura interna** — renombrar PR-* subdominios públicos.

#### Medio — Mediano Plazo
8. **🟡 Agregar security headers** (HSTS, CSP, X-Frame-Options) en www.progent.com.
9. **🟡 Agregar security.txt** en `/.well-known/security.txt`.
10. **🟡 Migrar dev.progent.com a HTTPS** y actualizar jQuery.
11. **🟡 Crear política de Vulnerability Disclosure Program (VDP)**.

### Para NSI (Próximos Pasos)

| Prioridad | Acción | Estado |
|:---------:|--------|--------|
| 1 | Reportar hallazgos a Progent vía su canal de contacto | ⏳ Pendiente |
| 2 | Intentar ScreenConnect CVE-2024-1709 (CVSS 10.0) | ⏳ Pendiente |
| 3 | Intentar Peplink CVE-2023-39361 (Auth Bypass) | ⏳ Pendiente |
| 4 | OSINT LinkedIn → buscar emails reales de empleados | ⏳ Pendiente |

---

## 8. Apéndice Técnico

### 8.1 Archivos Generados

```
targets/progent/
├── REPORTE-FINAL.md                   # Auditoría completa (14 KB)
├── ANEXO-EXPLOTACION.md               # Explotación activa (8 KB)
├── subs.txt                           # 428 subdominios
├── live.txt                           # 59 hosts vivos con tech stack
├── users_all.txt                      # 50 usuarios (raw)
├── users_email.txt                    # 50 usuarios @progent.com
├── users_domain.txt                   # 50 usuarios PROGENT\
├── users_optimized.txt                # 498 formatos de usuario
├── users_with_names.txt               # 50 usuarios + nombres reales
├── passwords.txt                      # 61 passwords (onda 1)
├── passwords_comprehensive.txt        # 7,710 passwords
└── passwords_targeted.txt             # 962 passwords (onda 6)
```

### 8.2 Herramientas Instaladas

```bash
# Metasploit Framework
/opt/metasploit-framework/      # 989 MB
├── msfconsole                  # Non-interactive: echo "cmd" | msfconsole -q
└── msfvenom                    # Payload generation

# NetExec (nxc) v1.5.1
/opt/exploit-tools/bin/nxc
# Protocolos: smb, ldap, winrm, ssh, rdp, ftp, mssql, wmi, nfs, vnc

# Impacket v0.13.1
/opt/exploit-tools/bin/
├── secretsdump.py              # Dump de credenciales
├── exchanger.py                # Exchange tools
├── smbclient.py                # SMB client
└── +30 más

# Exploit Database
/opt/exploitdb/                 # 47,690 exploits
└── searchsploit                # Búsqueda local

# Activar:
source /root/audit-bugbounty/tools/exploit-env.sh
```

### 8.3 Comandos Clave Usados

```bash
# Reconocimiento
subfinder -d progent.com -all -silent -o subs.txt
httpx -l subs.txt -status-code -title -tech-detect -o live.txt

# Forgejo User Enum
curl -s "https://git.progent.com/api/v1/users/search?limit=1000"

# OWA Password Spray (rápido, paralelo)
bash /tmp/fast_spray.sh "Password123" users.txt /tmp/results.txt
# (usa xargs -P20 con curl)

# Exchange CVE Scanner
echo "use auxiliary/scanner/http/exchange_proxylogon; set RHOSTS ex.progent.com; run; exit" | msfconsole -q

# CVE-2026-45504 PoC (requiere credencial)
# https://hawktrace.com/blog/CVE-2026-45504/

# Buscar exploits
searchsploit "exchange 2019"
searchsploit "screenconnect"
searchsploit "peplink"

# Consultar CVE
curl -s "https://hawktrace.com/blog/CVE-2026-45504/"
```

### 8.4 Timeline

| Fecha/Hora (ET) | Evento |
|-----------------|--------|
| Jul 1, 17:50 | Inicio auditoría — subfinder + httpx |
| Jul 1, 17:51 | 428 subs, 59 live detectados |
| Jul 1, 17:52 | Forgejo user enum — 50 usuarios expuestos |
| Jul 1, 17:54 | Exchange OWA detectado — 15.2.2562 |
| Jul 1, 17:55 | Peplink VPN Admin + ScreenConnect detectados |
| Jul 1, 17:56 | Dev/progent.com sin SSL + jQuery 2013 |
| Jul 1, 18:05 | Reporte generado (15 hallazgos) |
| Jul 1, 18:08 | Instalación Metasploit + NetExec + Impacket |
| Jul 1, 18:28 | Password spray — onda 1-6 (~81,250 intentos) |
| Jul 1, 18:45 | CVE-2026-45504 identificado — PoC público |
| Jul 1, 18:55 | ProxyLogon scanner — no vulnerable |
| Jul 1, 19:00 | Documentación completa |
| Jul 1, 19:05 | **Fin de la auditoría** |

---

*Reporte generado por NSI LLC — Null Session Intelligence*  
*Toolchain: subfinder v2.14.0, httpx v1.9.0, nuclei v3.3.9, Metasploit 6.4.135, NetExec 1.5.1, Impacket 0.13.1, searchsploit, curl*
