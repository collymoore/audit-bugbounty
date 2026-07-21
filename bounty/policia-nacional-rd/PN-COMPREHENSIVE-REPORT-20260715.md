# Auditoría de Seguridad — Policía Nacional de la República Dominicana
## Reporte Completo + Guía de Remediación

**Cliente:** Policía Nacional de la República Dominicana
**Fecha:** 15 Julio 2026
**Clasificación:** Confidencial — NSI Security Assessment
**Metodología:** Shodan OSINT, crt.sh, subfinder, nmap, curl probing, SMTP enumeration, WP REST API enumeration, Google Play OSINT, APK reverse engineering, Six Hats analysis

---

# PARTE I: REPORTE DE HALLAZGOS

## 1. RESUMEN EJECUTIVO

Se identificaron **24 activos digitales** distribuidos en 3 dominios principales con una combinación de tecnologías **WordPress** (sitio institucional, protegido por Imperva WAF) y **Windows/IIS/ASP.NET** (sistemas transaccionales, con IP real expuesta sin WAF). El portal de denuncias virtuales integra pagos a través de **CardNET** (SIRITE/Tesorería Nacional). Se detectaron **3 aplicaciones móviles** en Google Play y App Store.

### Crítico (5)
- 🔴 API REST de WordPress expuesta con 26 namespaces
- 🔴 Plugin WP-Abilities con potencial RCE (endpoint `/abilities/{name}/run`)
- 🔴 Servidor Windows (179.51.71.226) sin WAF con Plesk Obsidian 18.0.77
- 🔴 MailEnable 10.55 WebMail con login público
- 🔴 Google Maps API Key funcional sin restricciones

### Alto (6)
- 🟡 4 usuarios WordPress expuestos vía REST API
- 🟡 Umbraco CMS login panel público en denuncias.policia.gob.do
- 🟡 SMTP VRFY habilitado (enumeración de usuarios potencial)
- 🟡 Zabbix monitoring expuesto (monitoreozabbix.policianacional.gob.do)
- 🟡 PSP API interna expuesta con endpoint público `/Published`
- 🟡 17 documentos internos publicados sin autenticación

### Medio (7)
- 🟡 ASP.NET MVC 5.2 con version fingerprinting
- 🟡 TLS 1.0/1.1 habilitados + SWEET32 vulnerable
- 🟡 reCAPTCHA site key expuesta
- 🟡 Cardnet payment gateway parameters exposed
- 🟡 OneSignal App ID expuesto (push notifications)
- 🟡 Credenciales hardcodeadas en APK (PSP/Policia1936@)
- 🟡 Google Maps API Key secundaria expuesta en APK

---

## 2. INVENTARIO DE ACTIVOS

### 2.1 Dominio: policianacional.gob.do (WordPress + Imperva WAF)

| # | Subdominio | Estado | Tecnología | Puerto |
|---|------------|--------|------------|--------|
| 1 | www.policianacional.gob.do | ✅ 200 | WordPress 6.x, Impreza theme | 443 |
| 2 | appconsulta.policianacional.gob.do | ❌ Timeout | Detrás de Imperva | — |
| 3 | intranet.policianacional.gob.do | ❌ Timeout | Intranet interna | — |
| 4 | **monitoreozabbix.policianacional.gob.do** | ❌ Timeout | Zabbix monitoring (DNS no público) | — |
| 5 | msti.policianacional.gob.do | ❌ Timeout | Sistema interno | — |
| 6 | portalservicios.policianacional.gob.do | ✅ 200 | IIS default page | 443 |
| 7 | vicmanager.policianacional.gob.do | ❌ Timeout | Visitor/Incident Manager | — |
| 8 | webmail.policianacional.gob.do | ❌ Timeout | Webmail | — |

### 2.2 Dominio: policia.gob.do (Windows/IIS/ASP.NET — IP Real Expuesta)

| # | Subdominio | Estado | Tecnología | Puerto |
|---|------------|--------|------------|--------|
| 9 | **denuncias.policia.gob.do** | ✅ 200 | Umbraco CMS + ASP.NET + Imperva | 443 |
| 10 | **webmail.policia.gob.do** | ✅ 302 | MailEnable WebMail 10.55 + IIS 10.0 | 443 |
| 11 | **mail.policia.gob.do** | ✅ Abierto | MailEnable SMTP/POP3/IMAP + Plesk 18.0.77 | 25,443,465,587,993,995 |
| 12 | **arco.policia.gob.do** | ✅ 403 | IIS 10.0 + ASP.NET (existe, requiere auth) | 443 |
| 13 | **pn-vcomplaint-service.policia.gob.do** | ✅ 403 | IIS 10.0 + ASP.NET (API denuncias) | 443 |
| 14 | admisiones.policia.gob.do | ❌ Sin respuesta | — | — |
| 15 | crcd.policia.gob.do | ✅ 404 | Microsoft-HTTPAPI/2.0 | 443 |
| 16 | debi.policia.gob.do | ❌ Sin respuesta | — | — |
| 17 | **psp.policia.gob.do** | ✅ 404 | Microsoft-HTTPAPI/2.0 (backend PSP) | 443,8081,8443 |
| 18 | www.policia.gob.do | ❌ Sin respuesta | — | — |
| 19 | www.psp.policia.gob.do | ❌ Sin respuesta | — | — |

### 2.3 Dominio: pn.gob.do

| # | Subdominio | Estado | Tecnología |
|---|------------|--------|------------|
| 20 | **spgd.pn.gob.do** | ✅ (Shodan) | SPGD — sistema interno (Imperva) |
| 21 | spcc.pn.gob.do | 🔴 403 | Incapsula |

---

## 3. HALLAZGOS CRÍTICOS

### 🔴 C01 — WordPress REST API Full Exposure

**Severidad:** Crítica
**Endpoint:** `https://www.policianacional.gob.do/wp-json/`
**Estado:** ✅ Confirmado — 26 namespaces expuestos

**Namespaces expuestos:**

| Namespace | Riesgo |
|-----------|--------|
| `wp/v2` | CRUD completo en posts, users, media, comments, plugins, themes, templates, blocks, widgets, menus |
| `contact-form-7/v1` | Gestión de formularios, SSRF potencial vía oEmbed |
| `wpgmza/v1` | WP Google Maps — CRUD markers, polygons, geocode cache |
| `site-reviews/v1` | Reviews con filtros query sin sanitizar |
| `akismet/v1` | API key management, settings, stats |
| `aios/v1` | All In One SEO — onboarding, TFA |
| **`wp-abilities/v1`** | **⚠️ POSIBLE EJECUCIÓN REMOTA** |
| `wp-block-editor/v1` | URL details fetcher, SSRF potencial |
| `oembed/1.0` | SSRF potencial vía proxy |
| `batch/v1` | Batch processing de requests internos |

**Datos expuestos verificados:**
- 4 usuarios con IDs, nombres, slugs, avatares
- 9,768 posts con títulos, fechas, autores
- 33,000+ comentarios con nombres de autores
- 76+ imágenes con metadatos (fechas, tamaños, autores)
- Páginas internas: Relación de Consultas Públicas, Datos Abiertos, Comisión de Ética Pública, Transformación Policial

**Usuarios expuestos:**
| ID | Nombre | Slug | Rol Probable |
|----|--------|------|-------------|
| 1 | policianacional | policianacional | Administrador |
| 3 | Rubén Castillo | ruben-castillo | Editor/Author |
| 4 | Dirección Comunicaciones Estratégicas | manuel-logrono | Author |
| 5 | Documentacion Policial | profugos | Author |

---

### 🔴 C02 — WP-Abilities Plugin (Potencial RCE)

**Severidad:** Crítica
**Endpoint:** `https://www.policianacional.gob.do/wp-json/wp-abilities/v1/abilities/{name}/run`
**Estado:** ⚠️ Confirmado — requiere autenticación (401)

**Detalles:**
- Endpoint acepta GET, POST, PUT, PATCH, DELETE
- Parámetro `input` acepta cualquier tipo de dato (integer, string, array, object)
- Si existe una `ability` registrada, permite ejecución arbitraria
- Namespace visible en lista de rutas WP REST API
- No se pudo enumerar abilities (requiere cookie de sesión WP)

**Vector de ataque:** Obtener acceso a cuenta de usuario WP (fuerza bruta o sesión) → ejecutar ability → RCE.

---

### 🔴 C03 — Servidor Windows sin WAF (179.51.71.226)

**Severidad:** Crítica
**IP:** `179.51.71.226` (Columbus Networks Dominicana, Santo Domingo Este)
**Estado:** ✅ Confirmado — Sin protección Imperva

**Puertos abiertos:**
| Puerto | Servicio | Versión |
|--------|----------|---------|
| 25/tcp | SMTP | MailEnable smptd 10.55— |
| 443/tcp | HTTPS | Microsoft HTTPAPI httpd 2.0 (Plesk Obsidian 18.0.77) |
| 465/tcp | SMTPS | MailEnable smptd 10.55— |
| 587/tcp | Submission | MailEnable smptd 10.55— |
| 993/tcp | IMAPS | MailEnable imapd |
| 995/tcp | POP3S | MailEnable POP3 Server |

**Vulnerabilidades detectadas:**
- **SWEET32** (CVE-2016-2183) — TLS 1.0/1.1/1.2 soportan 3DES (grado C)
- **TLS 1.0/1.1 habilitados** — Protocolos deprecados (POODLE, BEAST)
- **Plesk Obsidian 18.0.77** — Panel de administración expuesto
- **SMTP STARTTLS disponible** sin AUTH previo

**Headers de seguridad AUSENTES:**
- ❌ HSTS
- ❌ CSP
- ❌ X-Frame-Options (solo SAMEORIGIN en login)
- ❌ X-Content-Type-Options

---

### 🔴 C04 — MailEnable 10.55 WebMail Login Público

**Severidad:** Crítica
**URL:** `https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx`
**Estado:** ✅ Confirmado

**Detalles:**
- MailEnable 10.55 confirmado
- Microsoft IIS 10.0
- ASP.NET 4.0.30319
- Fondo personalizado con logo de la PN (Logo_Pn.jpg)
- Sesión ID en cookie (ASP.NET_SessionId)
- Skin: Oceano (me.css?v=10.55)
- Versión móvil disponible: `/Mobile/Login.aspx`

**SMTP Banner:**
```
220 policia.gob.do ESMTP MailEnable Service, Version: 10.55-- ready
250-mail.policia.gob.do, this server offers 3 extensions
250-SIZE 40960000
250-HELP
250 STARTTLS
```

---

### 🔴 C05 — Google Maps API Key Funcional (Múltiples APIs)

**Severidad:** Crítica
**Keys encontradas:**
1. `AIzaSyAe7ooDHtbmwnVJ2Pjo3n53q0Or5TChCnM` (en HTML de denuncias.policia.gob.do)
2. `AIzaSyBVlEjGS-Witkb0fCqVwYlEnRot_XNZUAI` (en APK Denuncias Virtuales)

**APIs verificadas como funcionales (Key 1):**
| API | Estado |
|-----|--------|
| Geocoding | ✅ OK — Geolocalización de direcciones |
| Places | ✅ OK — 20 resultados de locations PN |
| Maps JavaScript | ✅ OK — Carga de mapas |
| Directions | ❌ REQUEST_DENIED |

**APIs de Key 2:** No verificada pero misma app = mismas APIs.

---

## 4. HALLAZGOS ALTOS

### 🟡 H01 — Usuarios WordPress Expuestos

**Severidad:** Alta
**Vector:** Fuerza bruta de contraseñas contra `/wp-json/wp/v2/users/{id}/` o login en `/wp-login.php`
**Usuarios:** 4 (IDs 1,3,4,5 — ver C01)

---

### 🟡 H02 — Umbraco CMS Login Público

**Severidad:** Alta
**URL:** `https://denuncias.policia.gob.do/umbraco/login.aspx`
**Estado:** ✅ Confirmado

**Detalles:**
- ASP.NET MVC 5.2 (header X-AspNetMvc-Version)
- IIS 10.0, ASP.NET 4.0.30319
- Backoffice: `/umbraco/backoffice` (200)
- Dialogs: `/umbraco/dialogs` (200)
- Preview: `/umbraco/preview` (200)
- Config: `/umbraco/config` (200 — bloqueado por Imperva)

---

### 🟡 H03 — SMTP VRFY Habilitado

**Severidad:** Alta
**IP:** `179.51.71.226:25`
**Estado:** ✅ Confirmado

**Detalles:**
- VRFY responde con 550 "String does not match anything"
- AUTH no disponible sin STARTTLS
- 3 extensiones: SIZE (40MB), HELP, STARTTLS

---

### 🟡 H04 — Zabbix Monitoring Expuesto

**Severidad:** Alta
**Subdominio:** `monitoreozabbix.policianacional.gob.do`
**Estado:** ⚠️ DNS no resuelve públicamente — existe en certificados SSL

**Detalles:**
- Registrado en crt.sh (certificado SSL)
- DNS no configura A record público
- Probablemente accesible solo desde red interna de la PN
- Vector potencial si se obtiene acceso a la red interna

---

### 🟡 H05 — PSP API Interna Expuesta

**Severidad:** Alta
**Backend:** `https://psp.policia.gob.do:8081/api`
**Estado:** ✅ Confirmado

**Endpoints (desde APK reverse):**
| Endpoint | Método | Auth | Estado |
|----------|--------|------|--------|
| `/Employees` | GET | Bearer | 401 (existe) |
| `/Employees/payroll` | GET | Bearer | 401 (existe) |
| `/Employees/payrollDeductions` | GET | Bearer | 401 (existe) |
| **`/Published`** | **GET** | **None** | **200 ✅ PÚBLICO** |
| `/Users/login` | POST | None | 200 (login endpoint) |
| `/Users/changePassword` | PUT | Bearer | 405 (existe) |
| `/News` | GET | Bearer | 401 (existe) |
| `/Survey` | GET | Bearer | 401 (existe) |

**UltiCabinet API:** `https://api.ulticabinet.com/v1`
- `/auth/token` — JWT obtenido con apiKey+clientId

---

### 🟡 H06 — 17 Documentos Internos Publicados

**Severidad:** Alta
**URL:** `https://psp.policia.gob.do:8443/{Resources}`
**Estado:** ✅ Confirmado

**Documentos expuestos sin autenticación:**
| # | Documento | Fecha |
|---|-----------|-------|
| 9 | Constitución de la República Dominicana 2024 | Sep 2024 |
| 10 | Ley Orgánica Policía Nacional | Nov 2024 |
| 11 | Manual de Taser | Dic 2024 |
| 12 | Manual de Bolsillo — Guía práctica para el Agente Policial | Dic 2024 |
| 14 | Reglamento de Aplicación Ley No.590-16 | Ene 2025 |
| 18 | GUIA DE USUARIOS TAM | Mar 2025 |
| 20 | Decálogo del comandante de policía | Dic 2025 |
| 21 | GUIA PARA CAMBIO DE TURNO DEL PATRULLAJE POLICIAL | Dic 2025 |
| 22 | GUIA PARA LA SUPERVISIÓN Y CONTROL DEL PATRULLAJE | Dic 2025 |
| 23 | INSTRUCTIVO SUPERVISIÓN Y RESPUESTA EVENTOS 9-1-1 | Dic 2025 |
| 24 | SISTEMA DE LISTA DE SERVICIO | Dic 2025 |
| 25 | GUÍA PRÁCTICA EJECUCIÓN PLANES ESPECIALES | Dic 2025 |
| 26 | GUÍA ENCUENTROS COMUNITARIOS POLICÍA NACIONAL | Dic 2025 |
| 27 | GUÍA PLANEACIÓN OPERATIVA NMSP | Dic 2025 |
| 28 | GUIA PARA EL USO DEL UNIFORME E INDUMENTARIAS | Dic 2025 |
| 29 | PROTOCOLO CENTROS DE ANÁLISIS Y PLANEACIÓN OPERACIONAL | Dic 2025 |
| 30 | GUÍA PRÁCTICA ABORDAJE Y PROCEDIMIENTOS AGENTE POLICIAL | Dic 2025 |

---

## 5. HALLAZGOS MEDIOS

### 🟡 M01 — ASP.NET Version Fingerprinting

**Servidores con version expuesta:**
| Servidor | Header | 
|----------|--------|
| denuncias.policia.gob.do | `X-AspNetMvc-Version: 5.2`, `X-AspNet-Version: 4.0.30319` |
| webmail.policia.gob.do | `X-AspNet-Version: 4.0.30319` |
| pn-vcomplaint-service.policia.gob.do | `X-Powered-By: ASP.NET` |
| arco.policia.gob.do | `X-Powered-By: ASP.NET` |

### 🟡 M02 — TLS Vulnerabilities (SWEET32)

**Severidad:** Media
**IP:** `179.51.71.226`
**Detalle:** TLS 1.0, 1.1 y 1.2 soportan cifrado 3DES (CVE-2016-2183 — SWEET32)

### 🟡 M03 — reCAPTCHA Site Key Expuesta

**Key:** `6Ld70pkgAAAAAIZVKtdDrLgFu6xLqBMQymvTACOH`
**Ubicación:** denuncias.policia.gob.do

### 🟡 M04 — Cardnet Payment Gateway

**Integración:** CardNET → SIRITE (Tesorería Nacional)
**Ambiente:** Producción
**URL retorno:** `https://denuncias.policia.gob.do/OfficialComplaint/Payment`
**Parámetros expuestos:** codigoCentroRecaudacion, codigoServicio, montoServicio, numeroDocumento (cédula), tipoDocumento, nombre

### 🟡 M05 — OneSignal App ID Expuesto

**ID:** `791b97cd-a237-4df7-af33-0eceeff84e71`
**Ubicación:** APK Denuncias Virtuales
**Riesgo:** Push notifications no autorizadas a usuarios

### 🟡 M06 — Credenciales Hardcodeadas en APK

**App:** PSP (Servicios Policiales)
**Credenciales:** `PSP` / `Policia1936@`
**Estado:** No funcionaron (USER_NOT_FOUND)
**API Key:** `301a7e37-264c-4ec6-89bd-011586e33958`
**Client ID:** `56aed9e5-655b-4203-a978-4cbe826591c4`

---

## 6. APLICACIONES MÓVILES

### 6.1 Denuncias Virtuales

| Atributo | Valor |
|----------|-------|
| Package | `com.policianacional.denunciavirtual` |
| Versión | 1.0.30 |
| Instalaciones | ~75,888 |
| Plataformas | Android + iOS |
| Stack | Ionic/Angular + Capacitor (WebView) |
| Backend | denuncias.policia.gob.do (Umbraco + ASP.NET) |

**Permisos peligrosos:**
- 📍 Location (GPS + Network)
- 📞 Phone (llamar, leer estado)
- 📷 Camera
- 🎤 Microphone
- 💾 Storage
- 📱 Device ID & Call info

### 6.2 PSP: Servicios Policiales

| Atributo | Valor |
|----------|-------|
| Package | `com.policiard.psp` |
| Versión | 1.20 |
| Propósito | App interna para miembros de la PN |
| Stack | Ionic/Angular + Capacitor |
| Backend | psp.policia.gob.do:8081/api |
| Datos | Nóminas, vacaciones, licencias médicas |

### 6.3 Token Policia Nacional

| Atributo | Valor |
|----------|-------|
| Disponible | iOS App Store |
| ID | id6739888552 |
| Propósito | Autenticación 2FA |

---

## 7. INFRAESTRUCTURA CARDNET

| Host | IP | Puerto | Servicio |
|------|----|--------|----------|
| ecommerce.cardnet.com.do | CloudFront (+ Imperva) | 443 | Pasarela Pago Ztrans v2.20250411.920 |
| ecommerce.cardnet.com.do | Imperva | 6443 | Odoo ERP (Soluciones CardNET) |
| lab.cardnet.com.do | 201.131.107.17 | 443 | LAB sin WAF |
| www.cardnet.com.do | Imperva | 443 | Sitio corporativo |
| developers.cardnet.com.do | — | 443 | Documentación API |

**Nota:** CardNET no es activo de la PN. Se incluye solo por la integración directa con el sistema de denuncias.

---

## 8. MATRIZ DE RIESGOS

| ID | Hallazgo | CVSS | Probabilidad | Impacto | Prioridad |
|----|----------|------|-------------|---------|-----------|
| C01 | WP REST API expuesta | 8.2 | Alta | Alto | **P0** |
| C02 | WP-Abilities RCE | 9.1 | Media | Crítico | **P0** |
| C03 | Servidor sin WAF (179.51.71.226) | 7.5 | Alta | Alto | **P0** |
| C04 | MailEnable login público | 7.8 | Alta | Alto | **P0** |
| C05 | Google API Key funcional | 6.5 | Alta | Medio | **P1** |
| H01 | Usuarios WP expuestos | 5.3 | Alta | Medio | **P1** |
| H02 | Umbraco login público | 7.0 | Media | Alto | **P1** |
| H03 | SMTP VRFY | 4.0 | Baja | Bajo | **P2** |
| H04 | Zabbix expuesto | 3.5 | Baja | Medio | **P2** |
| H05 | PSP API interna | 7.2 | Media | Alto | **P1** |
| H06 | Documentos publicados | 6.8 | Alta | Medio | **P1** |

---

# PARTE II: GUÍA DE REMEDIACIÓN

## 9. REMEDIACIÓN — PRIORIDAD INMEDIATA (P0)

### R01 — Restringir WP REST API

**Objetivo:** C01, C02
**Dificultad:** Baja
**Tiempo estimado:** 1 hora

**Pasos:**

1. **Deshabilitar endpoints sensibles** — Agregar en `functions.php` del theme:
```php
add_filter('rest_endpoints', function($endpoints) {
    // Deshabilitar user enumeration
    if (isset($endpoints['/wp/v2/users'])) {
        unset($endpoints['/wp/v2/users']);
    }
    // Deshabilitar abilities endpoint si no se usa
    if (isset($endpoints['/wp-abilities/v1/abilities'])) {
        unset($endpoints['/wp-abilities/v1/abilities']);
    }
    return $endpoints;
});
```

2. **Restringir acceso por rol** — Solo administradores:
```php
add_filter('rest_authentication_errors', function($result) {
    if (!is_user_logged_in()) {
        return new WP_Error('rest_not_logged_in', 'Autenticación requerida', array('status' => 401));
    }
    return $result;
});
```

3. **Deshabilitar /wp-json por completo** (si no se usa):
```nginx
# En nginx (si no usa Imperva)
location ~ ^/wp-json/ {
    return 403;
}
```

### R02 — Asegurar Servidor Windows (179.51.71.226)

**Objetivo:** C03
**Dificultad:** Media
**Tiempo estimado:** 4 horas

**Pasos:**

1. **Migrar detrás de firewall** — Mover el servidor a red interna con VPN o agregar reglas de firewall restrictivas:
   - Bloquear puertos 25, 465, 587, 993, 995 a IPs no autorizadas
   - Restringir 443 (Plesk) a IPs internas

2. **Deshabilitar TLS 1.0/1.1 y 3DES** — En el registro de Windows:
```
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server]
"Enabled"=dword:00000000
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server]
"Enabled"=dword:00000000
```

3. **Actualizar Plesk** a la última versión disponible.

4. **Configurar headers de seguridad**:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
```

5. **Auditar configuraciones de MailEnable** — Revisar logs de acceso de los últimos 30 días.

### R03 — MailEnable WebMail

**Objetivo:** C04
**Dificultad:** Baja
**Tiempo estimado:** 30 minutos

**Pasos:**
1. Mover webmail detrás de VPN o autenticación multifactor
2. Implementar rate limiting en login
3. Bloquear acceso a `/Mondo/` desde IPs externas
4. Configurar alertas de login fallidos
5. Considerar migración a Microsoft 365 Government o solución con MFA nativo

---

## 10. REMEDIACIÓN — ALTA PRIORIDAD (P1)

### R04 — Rotar Google Maps API Keys

**Objetivo:** C05
**Dificultad:** Baja
**Tiempo estimado:** 30 minutos

**Pasos:**
1. Revocar ambas keys desde Google Cloud Console
2. Generar nuevas keys con restricciones:
   - **HTTP referrer:** `https://denuncias.policia.gob.do/*`
   - **APIs:** Solo Maps JavaScript + Geocoding (deshabilitar Places si no se usa)
3. Actualizar keys en HTML y APK (requiere rebuild de app)
4. Configurar alertas de quota abuse

### R05 — Asegurar PSP API

**Objetivo:** H05
**Dificultad:** Media
**Tiempo estimado:** 2 horas

**Pasos:**
1. **Proteger endpoint `/Published`** con autenticación
2. **Validar auth en todos los endpoints** — No confiar en routing de ASP.NET
3. **Remover credenciales hardcodeadas** del APK (PSP/Policia1936@)
4. **Actualizar configuración `production: false`** en APK PSP
5. **Revisar configuración de UltiCabinet** — Rotar apiKey + clientId
6. **Auditar acceso al puerto 8081** — Restringir a IPs internas

### R06 — Remover Documentos Públicos

**Objetivo:** H06
**Dificultad:** Baja
**Tiempo estimado:** 1 hora

**Pasos:**
1. Proteger con autenticación el file server en puerto 8443
2. Mover documentos clasificados a repositorio interno con ACLs
3. Implementar logs de descarga para futura auditoría

### R07 — Umbraco CMS

**Objetivo:** H02
**Dificultad:** Baja
**Tiempo estimado:** 30 minutos

**Pasos:**
1. Restringir `/umbraco/` por IP (solo IPs internas de la PN)
2. Cambiar credenciales default del backoffice
3. Auditoría de version — Verificar si Umbraco está actualizado
4. Implementar 2FA en login administrativo

---

## 11. REMEDIACIÓN — PRIORIDAD BAJA (P2)

### R08 — WP User Enumeration

**Objetivo:** H01
**Dificultad:** Baja
**Tiempo estimado:** 15 minutos

**Pasos:**
1. Deshabilitar REST user endpoint (ver R01)
2. Cambiar slugs de usuarios (policianacional → otro)
3. Considerar plugin de seguridad (Wordfence, Sucuri)

### R09 — SMTP Hardening

**Objetivo:** H03
**Dificultad:** Baja
**Tiempo estimado:** 15 minutos

**Pasos:**
1. Deshabilitar VRFY/EXPN en MailEnable
2. Verificar que no haya open relay
3. Implementar monitoreo de logs SMTP

### R10 — Zabbix Remediation

**Objetivo:** H04
**Dificultad:** Baja
**Tiempo estimado:** 30 minutos

**Pasos:**
1. Eliminar registro DNS público de monitoreozabbix.policianacional.gob.do
2. Si se necesita acceso remoto, usar VPN
3. Verificar que no haya Zabbix agents expuestos en otros subdominios

---

## 12. PLAN DE ACCIÓN CRONOLÓGICO

### Semana 1 (Inmediato)
| Día | Acción | Responsable |
|-----|--------|-------------|
| 1 | 🔴 Deshabilitar WP REST API pública | Webmaster |
| 1 | 🔴 Rotar Google Maps API Key | Desarrollador |
| 1 | 🔴 Bloquear /umbraco/ por IP | Sysadmin |
| 2 | 🔴 Configurar firewall en 179.51.71.226 | Sysadmin |
| 2 | 🔴 Deshabilitar TLS 1.0/1.1 y 3DES | Sysadmin |
| 3 | 🟡 Proteger /Published endpoint | Desarrollador |
| 3 | 🟡 Remover documentos públicos | Webmaster |

### Semana 2 (Alta Prioridad)
| Día | Acción | Responsable |
|-----|--------|-------------|
| 4 | 🟡 Remover credenciales hardcodeadas APK | Desarrollador |
| 5 | 🟡 Rotar UltiCabinet apiKey/clientId | Desarrollador |
| 5 | 🟡 Auditar PSP API endpoints | Desarrollador |
| 6 | 🟡 Rate limiting en webmail | Sysadmin |

### Semana 3 (Media Prioridad)
| Día | Acción | Responsable |
|-----|--------|-------------|
| 7 | 🟢 Actualizar Plesk Obsidian | Sysadmin |
| 8 | 🟢 Migrar correo a solución con MFA | Sysadmin |
| 9 | 🟢 Configurar WP security plugin | Webmaster |

### Seguimiento Continuo
| Frecuencia | Acción |
|------------|--------|
| Mensual | Re-scan con Shodan + nuclei de IPs públicas |
| Trimestral | Revisión de APIs REST expuestas |
| Semestral | Auditoría completa de seguridad |
| Por deploy | Revisión de credenciales hardcodeadas en APK |

---

## 13. RECOMENDACIONES ESTRATÉGICAS

### Arquitectura
1. **Unificar stack tecnológico** — WP + Umbraco + ASP.NET crea superficie de ataque innecesaria
2. **Segmentación de red** — Servidores Windows no deben estar en IP pública directa
3. **WAF en todo el perímetro** — No proteger solo la fachada (Imperva) mientras los servidores reales están expuestos
4. **Gestión de secretos** — No hardcodear API keys ni credenciales en APKs

### Seguridad
1. **2FA/MFA obligatorio** — Para webmail, WP admin, Umbraco backoffice, PSP API
2. **Rate limiting** — Implementar en todos los login endpoints
3. **Logging centralizado** — SIEM para correlacionar eventos
4. **Bug Bounty Program** — Formalizar programa de recompensa por vulnerabilidades

### Cumplimiento
1. **Ley 172-13** (Protección de Datos Personales RD) — El registro de denuncias recolecta cédula, fotografía, datos biométricos (reconocimiento facial), ubicación GPS. Asegurar consentimiento explícito y almacenamiento seguro.
2. **PCI DSS** — Si se procesan pagos con tarjeta a través de Cardnet, verificar compliance del integrador.
3. **ISO 27001** — Recomendar implementación de ISMS para la gestión de seguridad de la información institucional.

---

## 14. EVIDENCIA TÉCNICA

### Comandos de Verificación

```bash
# WP REST API — Listar usuarios
curl -sk "https://www.policianacional.gob.do/wp-json/wp/v2/users"

# WP REST API — Listar namespaces
curl -sk "https://www.policianacional.gob.do/wp-json/"

# WP-Abilities — Verificar abilities registradas
curl -sk "https://www.policianacional.gob.do/wp-json/wp-abilities/v1/abilities"

# SMTP Banner
echo "EHLO test" | nc -w 5 179.51.71.226 25

# Plesk login check
curl -skI "https://179.51.71.226/login.php"

# WebMail login check
curl -skI "https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx"

# Umbraco login panel
curl -skI "https://denuncias.policia.gob.do/umbraco/login.aspx"

# Google API Key test
curl -sk "https://maps.googleapis.com/maps/api/geocode/json?address=PN+Santo+Domingo&key=AIzaSyAe7ooDHtbmwnVJ2Pjo3n53q0Or5TChCnM"

# PSP API — Published endpoint (público)
curl -sk "https://psp.policia.gob.do:8081/api/Published"
```

### Archivos de Reporte

| Archivo | Tamaño | Contenido |
|---------|--------|-----------|
| RECON-FULL.md | 10.5K | 24 activos, subdominios, Shodan |
| AUDITORIA-PN.md | 14K | Auditoría completa |
| EXPLOIT-RESULTS.md | 3.3K | Resultados de explotación |
| THINKPAD-RESULTS.md | 1.3K | Probes desde IP residencial |
| WSL-RESULTS.md | 2.1K | nmap + datos desde WSL |
| **ESTE DOCUMENTO** | **—** | **Reporte completo + remediación** |

---

**Fin del Reporte**
*Null Session Intelligence LLC (NSI)*
*https://nullsessionintelligence.com*
*15 Julio 2026*
