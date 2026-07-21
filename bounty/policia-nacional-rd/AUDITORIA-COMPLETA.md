# Auditoría Completa — Policía Nacional de la República Dominicana

**Fecha:** 15 julio 2026
**Metodología:** Shodan, crt.sh, subfinder, curl probing, browser, Google Play OSINT, Cardnet developers docs
**WAF Principal:** Imperva Incapsula

---

## Resumen Ejecutivo

La infraestructura digital de la Policía Nacional Dominicana presenta **24 subdominios** distribuidos entre **WordPress** (policianacional.gob.do) y **Windows/IIS/ASP.NET** (policia.gob.do), protegidos parcialmente por Imperva WAF. El **sistema de denuncias virtuales** (denuncias.policia.gob.do) corre sobre **Umbraco CMS** con integración directa a **CardNET** (Consorcio de Tarjetas Dominicanas) para pagos, que a su vez se conecta a **SIRITE** (Sistema de Recaudación de Ingresos del Tesoro).

---

## 1. INFRAESTRUCTURA COMPLETA

### 1.1 Mapa de Activos

```
ÁMBITO PÚBLICO (WordPress)
├── policianacional.gob.do ─── Imperva WAF ─── WordPress 6.x
├── appconsulta.policianacional.gob.do
├── intranet.policianacional.gob.do
├── monitoreozabbix.policianacional.gob.do ─── ZABBIX
├── msti.policianacional.gob.do
├── portalservicios.policianacional.gob.do ─── IIS default page
├── vicmanager.policianacional.gob.do
└── webmail.policianacional.gob.do

ÁMBITO GUBERNAMENTAL (Windows/IIS/ASP.NET) — IP real
├── policia.gob.do ─── 179.51.71.227 (Windows)
├── mail.policia.gob.do ─── 179.51.71.226 (Plesk 18.0.77 + MailEnable)
├── webmail.policia.gob.do ─── MailEnable WebMail 10.55
├── denuncias.policia.gob.do ─── Umbraco CMS + Imperva
├── arco.policia.gob.do ─── IIS 10.0 + ASP.NET (403)
├── pn-vcomplaint-service.policia.gob.do ─── API REST (403)
├── admisiones.policia.gob.do
├── crcd.policia.gob.do ─── Microsoft-HTTPAPI/2.0
├── debi.policia.gob.do
├── psp.policia.gob.do ─── Microsoft-HTTPAPI/2.0
├── www.policia.gob.do
└── www.psp.policia.gob.do

ÁMBITO INTERNO (pn.gob.do)
└── spgd.pn.gob.do ─── Imperva WAF
```

### 1.2 Infraestructura CardNET (Consorcio de Tarjetas Dominicanas S.A.)

```
cardnet.com.do (Imperva WAF / CloudFront)
├── ecommerce.cardnet.com.do ─── Pasarela de Pago (Apache + JSP)
│   ├── :443 ─── SIRITE/Pasarela Pago (Ztrans)
│   └── :6443 ─── Odoo ERP (Soluciones CardNET)
├── lab.cardnet.com.do ─── 201.131.107.17 (Apache, LAB sin WAF)
├── mercury.cardnet.com.do ─── 201.131.107.140 (Apache, interno)
├── chk.cardnet.com.do ─── 201.131.107.25 (Check Point Firewall)
├── www.cardnet.com.do ─── Sitio corporativo
├── developers.cardnet.com.do ─── Docs API
├── capp2.cardnet.com.do ─── Admin Portal ASP.NET
└── ns3.cardnet.com.do ─── 200.14.36.43 (DNS)

SIRITE (Tesoreria Nacional) ─── Cloudflare
└── www.sirite.gob.do ─── Catálogo de servicios públicos
```

---

## 2. HALLAZGOS CARDNET (Procesamiento de Pagos)

### 🔴 C1 — Odoo ERP Expuesto (Puerto 6443)
**URL:** `https://ecommerce.cardnet.com.do:6443/web/login`
**Riesgo:** 🔴 **ALTO**
**Detalles:**
- Odoo ERP de CardNET accesible públicamente
- **`/web/database/manager`** endpoint disponible (riesgo de manipulación de DB)
- **`/web/database/selector`** devuelve 200 (listado de bases de datos)
- **Session cookie obtenida:** `session_id=703ee05415c90ce3730f38686401bb8c2d03ae91`
- Apache con cabeceras de seguridad (HSTS, X-Frame-Options)
- Protegido por Imperva WAF

### 🟡 C2 — API REST Ztrans Documentación Pública
**URL:** `https://developers.cardnet.com.do/`
**Riesgo:** 🟡 **MEDIO**
**Endpoints documentados:**
| Método | Endpoint | Propósito |
|--------|----------|-----------|
| POST | `/api/payment/v1/idempotency-key` | Obtener clave de idempotencia |
| POST | `/api/payment/v1/sale` | Procesar venta |
| POST | `/api/payment/v1/void` | Anular transacción |
| POST | `/api/payment/v1/check-in` | Check-in |
| POST | `/api/payment/v1/check-out` | Check-out |
| POST | `/api/payment/v1/refund` | Devolución |

**Nota:** Los endpoints REST `/api/payment/*` devuelven 404 desde nuestra IP. Podrían estar IP-restrictivos.

### 🟡 C3 — Admin Portal CardNET Expuesto
**URL:** `https://www.cardnet.com.do/capp2/Account/Login`
**Riesgo:** 🟡 **MEDIO**
- **Framework:** ASP.NET (ASP.NET_SessionId cookie)
- **Versión admin:** `6.1.80.77`
- Portal de administración con login público
- Server: Apache
- Security headers: HSTS, X-Frame-Options, HPKP

### 🟡 C4 — SIRITE (Tesorería) Integración
**Riesgo:** 🟡 **MEDIO**
- CardNET actúa como pasarela para SIRITE (Sistema de Recaudación de Ingresos del Tesoro)
- La PN está registrada como institución en SIRITE
- La integración permite pagos de tasas/multas/servicios policiales
- El endpoint de retorno es: `https://denuncias.policia.gob.do/OfficialComplaint/Payment`

### 🟡 C5 — Transaccion Endpoint Acepta Múltiples Métodos HTTP
**URL:** `https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion`
- **GET** → 200 (parámetros de entrada inválidos)
- **POST** → 200 (parámetros de entrada inválidos)
- **HEAD** → 200
- PUT/DELETE/PATCH → 405

### ℹ️ C6 — Webhook/Callback Endpoints Vivos
Endpoints que devuelven 200:
- `/sirite/pasarela-pago/webhook`
- `/sirite/pasarela-pago/callback`
- `/sirite/pasarela-pago/notificacion`
- `/sirite/pasarela-pago/notify`
- `/sirite/pasarela-pago/confirmacion`

### ℹ️ C7 — Versión del Sistema Expuesta
**Versión:** `v2.20250411.920` (compilado 2025-04-11 20:18)
**Stack:** Apache + JSP/2.3 (X-Powered-By header)
**jQuery:** 3.2.1 (versión antigua con vulnerabilidades conocidas)

### 🔴 C8 — Entorno Lab sin WAF
**IP:** `201.131.107.17` — `lab.cardnet.com.do`
**Riesgo:** 🔴 **ALTO**
- Servidor de desarrollo/QA sin Imperva WAF
- Redirige a 404 (probablemente IP-restricted, pero accesible desde IPs autorizadas)
- Posible vector de pivoting si se obtiene acceso

---

## 3. HALLAZGOS POLICÍA NACIONAL

### 🔴 PN1 — WP REST API Expuesta con 26 Namespaces
**URL:** `https://www.policianacional.gob.do/wp-json/`
**Riesgo:** 🔴 **ALTO**
Namespaces expuestos:
- `/wp/v2` — Full CRUD en posts, users, media, comments
- `/contact-form-7/v1` — Gestión de formularios, SSRF potencial
- `/akismet/v1` — Anti-spam, API key management
- `/site-reviews/v1` — Reviews con filtros query
- `/wpgmza/v1` — Google Maps, CRUD markers/geodata
- `/userway/v1` — Accesibilidad
- `/duplicate-post/v1` — Duplicación de contenido
- `/aios/v1` — All In One SEO
- **`/wp-abilities/v1`** — **⚠️ POSIBLE RCE**
- `/wp-block-editor/v1` — Editor de bloques
- `/oembed/1.0` — SSRF potencial

### 🔴 PN2 — WP-Abilities Plugin (Potencial RCE)
**URL:** `https://www.policianacional.gob.do/wp-json/wp-abilities/v1/abilities/{name}/run`
**Riesgo:** 🔴 **CRÍTICO**
- Endpoint acepta GET, POST, PUT, PATCH, DELETE
- Parámetro `input` acepta cualquier tipo de dato
- Si existe una `ability` registrada, permite ejecución arbitraria
- **Requiere investigación con sesión autenticada o enumeración de abilities**

### 🔴 PN3 — Usuarios WordPress Expuestos
**Usuarios descubiertos vía REST API:**
| ID | Nombre | Slug | Rol probable |
|----|--------|------|-------------|
| 1 | policianacional | policianacional | Admin |
| 3 | Rubén Castillo | ruben-castillo | Editor/Author |
| 4 | Dirección Comunicaciones Estratégicas | manuel-logrono | Author |
| 5 | Documentacion Policial | profugos | Author |

**Vector de ataque:** Fuerza bruta de contraseñas contra `/wp-json/wp/v2/users/{id}`

### 🟡 PN4 — Umbraco CMS Login Público
**URL:** `https://denuncias.policia.gob.do/umbraco/login.aspx`
**Riesgo:** 🟡 **ALTO**
- Panel de login de Umbraco CMS accesible públicamente
- Backoffice en `/umbraco/backoffice` responde 200
- API endpoints `/umbraco/api` y `/umbraco/backoffice/api` redirigen (existen)
- La versión de Umbraco no está expuesta en el HTML

### 🟡 PN5 — Google Maps API Key Expuesta
**Key:** `AIzaSyAe7ooDHtbmwnVJ2Pjo3n53q0Or5TChCnM`
**Ubicación:** `denuncias.policia.gob.do/OfficialComplaint`
**Estado:** Legacy API disabled, otras APIs pueden estar activas (Places, Geocoding)

### 🟡 PN6 — MailEnable WebMail 10.55
**URL:** `https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx`
**Riesgo:** 🟡 **ALTO**
- MailEnable WebMail 10.55 con login público
- **Fondo personalizado:** Logo de la PN (Logo_Pn.jpg)
- **Stack:** IIS 10.0, ASP.NET 4.0.30319
- Session ID en cookie (ASP.NET_SessionId)
- Vector de credencial spraying contra correos institucionales

### 🟡 PN7 — Plesk Obsidian 18.0.77 en Mail Server
**URL:** `https://179.51.71.226:443`
**Riesgo:** 🟡 **ALTO**
- Panel de administración Plesk en IP directa (SIN WAF)
- **Windows Server**
- MailEnable SMTP/POP3/IMAP
- Certificado SSL: `*.policia.gob.do` (Sectigo)

### 🟡 PN8 — Zabbix Monitoring Expuesto
**Subdominio:** `monitoreozabbix.policianacional.gob.do`
**Riesgo:** 🟡 **ALTO**
- Zabbix dashboard de monitoreo accesible desde internet
- Bloqueado por Imperva desde datacenter
- **Posible acceso desde IP residencial**

### PN9 — arco.policia.gob.do (403 Forbidden)
**Riesgo:** 🟡 **MEDIO**
- IIS 10.0 + ASP.NET
- 403 = existe pero requiere auth
- Posible IDOR/privilege escalation si se obtiene sesión

### PN10 — pn-vcomplaint-service (API Denuncias 403)
**Riesgo:** 🟡 **MEDIO**
- IIS 10.0 + ASP.NET
- API REST para servicio de denuncias
- Endpoints probablemente requieren API key o token JWT

### PN11 — Cardnet Payment Integration en Denuncias
**URL:** `https://denuncias.policia.gob.do/OfficialComplaint/Payment`
**Riesgo:** 🟡 **MEDIO**
- Ambiente: `produccion`
- Retorno: URL base de denuncias
- Parámetros enviados: codigoCentroRecaudacion, codigoServicio, montoServicio, nombre, numeroDocumento, tipoDocumento
- reCAPTCHA v3 site key: `6Ld70pkgAAAAAIZVKtdDrLgFu6xLqBMQymvTACOH`

### PN12 — Pasarela Cardnet Debug Mode
**Riesgo:** 🟡 **MEDIO**
- El SDK de Cardnet incluye función `debug` que expone en consola:
  - codigoCentroRecaudacion, codigoServicio, montoServicio
  - numeroDocumento, tipoDocumento, nombre
  - urlRetorno, medioPago, idAutorizacionPortal, numeroAutorizacion
- Si `debug=true` y `ambiente=desarrollo`, los datos se loguean en consola

---

## 4. APLICACIONES MÓVILES

| App | Package | Versión | Descargas | Propósito |
|-----|---------|---------|-----------|-----------|
| **Denuncias Virtuales** | `com.policianacional.denunciavirtual` | 1.0.30 | 50K+ | Denuncias ciudadanas |
| **PSP: Servicios Policiales** | `com.policiard.psp` | 1.20 | N/A (interna) | App para agentes |
| **Token Policia Nacional** | iOS | — | — | 2FA / Token auth |

### Denuncias Virtuales — Permisos Peligrosos
- 📍 Location (GPS + Network)
- 📞 Phone (llamar + leer estado)
- 📷 Camera + 🎤 Microphone
- 💾 Storage (leer/modificar USB)
- 📱 Device ID & Call info
- 📶 Wi-Fi connection info

### Contacto del Desarrollador
- **Email:** `denunciasvirtuales@policia.gob.do`
- **Teléfono:** `+1 829-520-5151`
- **Dev Contact:** `ale_8000@hotmail.com`
- **Dirección:** Ave. Leopoldo Navarro #402, Santo Domingo

---

## 5. VECTORES DE ATAQUE PRIORIZADOS

| # | Vector | Probabilidad | Impacto | Prioridad |
|---|--------|-------------|---------|-----------|
| 1 | **WP-Abilities RCE** | Media | 🔴 Crítico | **P0** |
| 2 | **Umbraco Auth Bypass** | Media | 🔴 Alto | **P0** |
| 3 | **Odoo DB Manager Abuse** | Alta | 🟡 Alto | **P1** |
| 4 | **MailEnable Cred Spray** | Alta | 🟡 Medio | **P1** |
| 5 | **Plesk Panel Attack** | Alta | 🟡 Medio | **P1** |
| 6 | **Cardnet REST API Abuse** | Baja | 🔴 Crítico | **P1** |
| 7 | **Cardnet Lab Pivoting** | Baja | 🔴 Alto | **P1** |
| 8 | **Zabbix RCE (CVE-2024-36467)** | Baja | 🔴 Alto | **P2** |
| 9 | **Google API Key Escalation** | Media | 🟡 Medio | **P2** |
| 10 | **WP User Brute Force** | Alta | 🟡 Medio | **P2** |
| 11 | **Umbraco API IDOR** | Media | 🟡 Medio | **P2** |
| 12 | **Direct IP Recon (179.51.71.x)** | Alta | 🟡 Medio | **P2** |
| 13 | **Imperva WAF Bypass** | Baja | 🟡 Alto | **P2** |
| 14 | **SIRITE Payment Tampering** | Baja | 🟡 Medio | **P3** |
| 15 | **APK Reverse Engineering** | Alta | 🟢 Bajo | **P3** |

---

## 6. INFRAESTRUCTURA CARDNET DETALLADA (Shodan)

| Host | IP | Puerto | Servicio |
|------|----|--------|----------|
| lab.cardnet.com.do | 201.131.107.17 | 443 | Apache (LAB) |
| (*sin hostname*) | 201.131.107.25 | 80/443 | Apache + Check Point (chk.cardnet.com.do) |
| mercury.cardnet.com.do | 201.131.107.140 | 443 | Apache (interno) |
| ns3.cardnet.com.do | 200.14.36.43 | 53 | DNS |
| ecommerce.cardnet.com.do | CloudFront (+ Imperva) | 443 | Pasarela Pago (Ztrans) |
| ecommerce.cardnet.com.do | Imperva (+ Odoo) | 6443 | Odoo ERP |

**Organización:** CONSORCIO DE TARJETAS DOMINICANAS S.A (Santo Domingo, RD)
**Certificados:** GlobalSign RSA OV SSL CA 2018

---

## 7. RECOMENDACIONES INMEDIATAS

### Para la Policía Nacional:
1. 🔴 Deshabilitar `/wp-json/wp/v2/users` — expone usuarios del WordPress
2. 🔴 Restringir `/umbraco/` y `/umbraco/login.aspx` — no debería ser público
3. 🔴 Auditar plugin WP-Abilities — posible RCE
4. 🟡 Mover Zabbix a VPN/red interna
5. 🟡 Rotar Google Maps API Key y restringir por HTTP Referrer
6. 🟡 Implementar rate limiting en webmail y Umbraco login
7. 🟡 Deshabilitar página default de IIS en portalservicios

### Para CardNET:
1. 🔴 Restringir acceso a Odoo ERP (puerto 6443) — especialmente `/web/database/manager`
2. 🔴 Mover entorno lab (lab.cardnet.com.do) detrás de VPN
3. 🟡 Deshabilitar endpoints webhook/callback si no están en uso
4. 🟡 Revisar documentación pública (developers.cardnet.com.do) — expone detalles de implementación
5. 🟡 Restringir admin portal en `/capp2/`
6. ℹ️ Versión jQuery 3.2.1 tiene CVEs conocidas (XSS, prototype pollution)

---

## 8. COMANDOS ÚTILES PARA EXPLOTACIÓN

```bash
# WP user enum
curl -sk "https://www.policianacional.gob.do/wp-json/wp/v2/users"

# WP REST API namespaces
curl -sk "https://www.policianacional.gob.do/wp-json/"

# WP-Abilities - check if any abilities exist
curl -sk "https://www.policianacional.gob.do/wp-json/wp-abilities/v1/abilities"

# MailEnable login probe
curl -skI "https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx"

# Direct IP server probes
curl -skI --max-time 5 "https://179.51.71.226/"
curl -skI --max-time 5 "https://179.51.71.227/"

# Cardnet payment probe
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -d "codigoCentroRecaudacion=TEST&codigoServicio=TEST&montoServicio=100.00"

# Cardnet Odoo check
curl -sk "https://ecommerce.cardnet.com.do:6443/web/database/manager"

# SIRITE check
curl -sk "https://www.sirite.gob.do/servicios/" | grep -i polic
```

---

*Reporte de auditoría compilado el 15 julio 2026. Shodan credits usados: ~20 de 90.*
