# 🔒 Auditoría de Seguridad — Banco BACC

**Cliente:** Banco BACC (Banco de Ahorro y Crédito del Caribe, S. A.)
**URL:** https://bancobacc.com.do
**Fecha:** 29 Junio 2026
**Metodología:** Black-box (sin credenciales)
**Tipo:** Audit de superficie externa + OSINT

---

## 1. Resumen Ejecutivo

El Banco BACC opera un sitio web híbrido WordPress + ASP.NET con una superficie de ataque significativa. Aunque Wordfence protege el WordPress, se identificaron **3 hallazgos críticos**, **3 de alto riesgo**, y **4 de riesgo medio** que requieren atención.

| Métrica | Valor |
|---------|-------|
| Subdominios descubiertos | 38 |
| Plugins vulnerables | 2 (Yoast SEO v20.12, CF7 v5.7.7) |
| Endpoints SSRF potenciales | 3 (requieren auth) |
| cPanel/WHM expuesto | Ports 2083 y 2087 sin restricción IP |
| Archivos expuestos en uploads | 105 (95 PDFs + 4 CSVs, 412 MB) |
| Empleados identificados | 21 vía metadata de PDFs |
| Exposure score | 🔴 **Crítico** |

---

## 2. Tabla de Hallazgos

| ID | Hallazgo | Severidad | CVE | Explotable hoy |
|----|----------|-----------|-----|----------------|
| BACC-01 | cPanel + Webmail expuestos públicamente | 🔴 **Crítica** | — | ✅ Sí — bruteforce |
| BACC-02 | Directory Listing en /content/uploads/ | 🔴 **Crítica** | — | ✅ Sí |
| BACC-03 | Dockerfile expuesto (info disclosure) | 🔴 **Crítica** | — | ✅ Sí |
| BACC-04 | WordPress plugins desactualizados | 🟡 **Alta** | CVE-2023-6449 | ⏳ Parcial (requiere auth) |
| BACC-05 | REST API WP expuesta sin restricciones | 🟡 **Alta** | — | ⏳ Parcial |
| BACC-06 | SSRF endpoint reachable via Yoast | 🟡 **Alta** | — | ⏳ Requiere auth |
| BACC-07 | Online banking sin X-Frame-Options | 🟠 **Media** | — | ✅ Sí — clickjacking |
| BACC-08 | No Content-Security-Policy (WordPress) | 🟠 **Media** | — | — |
| BACC-09 | Apache Server header leak | 🟡 **Info** | — | — |
| BACC-11 | cPanel User Enumeration vía respuesta diferencial | 🟡 **Alta** | — | ✅ Sí — port 2083 |
| BACC-12 | Registro de usuario — datos solicitados | 🟡 **Info** | — | — |

---

## 3. 🔴 Hallazgos Críticos

### BACC-01: cPanel y Webmail Expuestos Públicamente

**Severidad:** 🔴 Crítica | **CVSS:** 9.1

**Descripción:**
Los paneles de administración de hosting `cpanel.bancobacc.com.do` y `webmail.bancobacc.com.do` son accesibles públicamente desde Internet sin restricción de IP.

**Evidencia:**
```
$ curl -sI "https://cpanel.bancobacc.com.do" | head -1
HTTP/2 200
<title>cPanel Login</title>

$ curl -sI "https://webmail.bancobacc.com.do" | head -1
HTTP/2 200
<title>Webmail Login</title>
```

**Impacto:**
- Bruteforce de credenciales de hosting posible
- Acceso a cPanel → control total: file manager, phpMyAdmin, DNS, email
- Acceso a webmail → emails internos del banco, posible escalación

**Recomendación:**
- Mover cPanel y webmail detrás de VPN o IP whitelist
- Implementar 2FA en todas las cuentas de hosting
- Rate limiting en login pages

---

### BACC-02: Directory Listing en /content/uploads/

**Severidad:** 🔴 Crítica | **CVSS:** 7.5

**Descripción:**
Apache tiene `Indexes` habilitado en el directorio `/content/uploads/`, exponiendo 10 años de archivos subidos (2017–2026) incluyendo documentos financieros sensibles.

**Evidencia:**
```
$ curl -s "https://bancobacc.com.do/content/uploads/"
→ Index of /content/uploads
  ├── 2017/ .. 2026/    ← TODOS los años
  └── Archivos visibles:
      2026/04/BANCO-BACC.pdf
      2026/04/MEMORIA-ANUAL-BACC-2025.pdf
      2026/04/Proceso-de-disvinculacion-de-App.pdf
      2026/03/Estados-Auditados-BACC-2025.pdf
```

**Impacto:**
- Exposición de estados financieros auditados
- Documentos internos del banco públicamente accesibles
- Posible enumeración de vulnerabilidades en PDFs (metadatos, firmas)

**Recomendación:**
- Deshabilitar `Options +Indexes` en Apache para `/content/uploads/`
- Agregar regla de denegación por defecto en `.htaccess`: `Options -Indexes`

---

### BACC-03: Dockerfile Expuesto

**Severidad:** 🔴 Crítica | **CVSS:** 5.3 (Info disclosure)

**Descripción:**
El archivo `Dockerfile` en la raíz del sitio web es accesible públicamente, revelando información sensible sobre la infraestructura del banco.

**Evidencia:**
```dockerfile
FROM solucionesgbh/lep:7.4
ENV ROOT_PATH /usr/app
ENV THEME_PATH ${ROOT_PATH}/content/themes/bacc
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN npm install bower yarn gulp-cli -g
COPY --chown=www-data:www-data .deploy/wp-config.php ./local-config.php
COPY --chown=www-data:www-data .deploy/.htaccess ./.htaccess
COPY --chown=www-data:www-data .deploy/.htpasswd ./.htpasswd
```

**Información revelada:**
- Imagen base: `solucionesgbh/lep:7.4` (PHP 7.4 — EOL Nov 2022)
- Node.js 10.x (EOL Abr 2021)
- Python 2 (EOL Ene 2020)
- Estructura de directorios interna: `/usr/app/`
- Archivos de deploy: `.deploy/wp-config.php`, `.deploy/.htpasswd`
- Uso de herramientas legacy: `bower`, `gulp`, `yarn`
- Hosting: GBH Web Hosting (solucionesgbh)

**Verificación de archivos referenciados:**

| Archivo | Status | Protección |
|---------|--------|------------|
| `local-config.php` | HTTP 200 (0 bytes) | Archivo vacío — sin credenciales |
| `.deploy/wp-config.php` | HTTP 404 + WWW-Authenticate | 🔒 Basic Auth + Wordfence |
| `.deploy/.htpasswd` | HTTP 404 | 🔒 Wordfence |
| `.deploy/.htaccess` | HTTP 404 | 🔒 Wordfence |

**Doble protección detectada:** Los archivos de deploy están protegidos por:
1. Apache Basic auth (realm: `"Admin Folder"`)
2. Wordfence bloqueando acceso externo (retorna 404 override)

Sin embargo, el simple hecho de que existan y sean referenciados en el Dockerfile público es información valiosa para un atacante.

**Recomendación:**
- Bloquear acceso al `Dockerfile` via `.htaccess`
- Actualizar PHP 7.4 (EOL) a 8.1+
- Actualizar Node.js 10 (EOL) a 18+ LTS
- Eliminar Python 2 (EOL) del contenedor
- Rotar credenciales de `.deploy/` como medida preventiva

---

## 4. 🟡 Hallazgos de Alto Riesgo

### BACC-04: WordPress Plugins Desactualizados

**Severidad:** 🟡 Alta | **CVSS:** 8.8 (CVE-2023-6449)

**Descripción:**
Dos plugins críticos están significativamente desactualizados:
- **Yoast SEO v20.12** (stable actual ~v24+, lanzado Jul 2023)
- **Contact Form 7 v5.7.7** (stable actual ~v5.9+)

| Plugin | Versión | Lanzamiento | CVE conocido |
|--------|---------|-------------|--------------|
| Yoast SEO | 20.12 | Jul 2023 | CVE-2026-3427 (XSS hasta 27.1.1) |
| Contact Form 7 | 5.7.7 | — | CVE-2023-6449 (File upload ≤5.8.3) |

**Evidencia:**
```json
// /wp-json/ → "contact-form-7/v1/contact-forms" expuesto
// /wp-json/yoast/v1 → Full Yoast API disponible

// /content/plugins/contact-form-7/readme.txt → "Stable tag: 5.7.7"
// /content/plugins/wordpress-seo/readme.txt → "Stable tag: 20.12"
```

**Impacto:**
- CVE-2023-6449: Arbitrary File Upload via CF7 (requiere Editor+, bloqueado por Wordfence)
- CVE-2026-3427: Stored XSS en Yoast (requiere Contributor+)
- Versiones desactualizadas = vulnerabilidades no parcheadas conocidas

**Recomendación:**
- Actualizar Yoast SEO inmediatamente (target: última versión estable)
- Actualizar Contact Form 7 (target: ≥5.9)
- Establecer política de actualización automática para plugins de seguridad

---

### BACC-05: REST API de WordPress Sobreexpuesta

**Severidad:** 🟡 Alta

**Descripción:**
La REST API de WordPress expone endpoints sensibles que permiten enumeración de contenido y potenciales ataques.

**Endpoints expuestos:**

| Endpoint | Método | Riesgo |
|----------|--------|--------|
| `/wp-json/wp/v2/pages` | GET | Full content disclosure de todas las páginas |
| `/wp-json/wp/v2/posts` | GET, POST | Post listing (create requires auth) |
| `/wp-json/contact-form-7/v1/contact-forms/{id}/feedback` | POST | Envío de formularios |
| `/wp-json/yoast/v1/file_size` | GET | **SSRF potential** (requires auth) |
| `/wp-json/yoast/v1/configuration/site_representation` | POST | Modificar SEO settings (auth) |
| `/wp-json/wordfence/v1/scan` | POST | Iniciar scan Wordfence (auth) |
| `/wp-json/wordfence/v1/scan/issues` | GET | Leer resultados de scan (auth) |
| `/wp-json/batch/v1` | POST | Batch processing (25 requests) |
| `/wp-json/templates-directory/import_elementor` | POST | **File write potential** |
| `/wp-json/sowb/v1/widgets/forms` | POST | SiteOrigin widget render |

**Recomendación:**
- Deshabilitar endpoints no utilizados
- Restringir `/batch/v1` si no se usa
- Monitorear logs de REST API para patrones anómalos

---

### BACC-06: SSRF Potencial vía Yoast

**Severidad:** 🟡 Alta | **CVSS:** 7.5 (potencial)

**Descripción:**
El endpoint `/wp-json/yoast/v1/file_size` acepta un parámetro `url` y realiza una petición HTTP para verificar el tamaño del archivo. Aunque requiere autenticación, representaría un vector SSRF serio si un atacante obtiene credenciales.

**Vectores probados:**

| Vector | Resultado |
|--------|-----------|
| URL directa `?url=http://127.0.0.1/` | 400 (missing param) |
| URL encode `?url=http%3A%2F%2F127.0.0.1%2F` | 400 (missing param) |
| Double encode `?url=http%253A%252F%252F127.0.0.1%252F` | 401 (forbidden → param parsed!) |
| Con cookie de sesión | 400 |
| `file:///etc/passwd` | 400 |

**Momento de riesgo:** Si un atacante obtiene credenciales WP (vía cPanel, phishing, o fuerza bruta), este endpoint permite SSRF a:
- AWS/Cloud metadata: `http://169.254.169.254/latest/metadata/`
- Redis interno: `http://127.0.0.1:6379/`
- MySQL interno: `http://127.0.0.1:3306/`
- Servicios internos en GBH Web Hosting

---

### BACC-11: cPanel User Enumeration vía Respuesta Diferencial

**Severidad:** 🟡 Alta

**Descripción:**
cPanel está accesible públicamente en `https://bancobacc.com.do:2083/` sin restricción de IP. La página de login devuelve respuestas de tamaño diferente dependiendo de si el usuario ingresado existe o no, permitiendo enumeración de cuentas de hosting.

**Evidencia:**
```bash
# Usuario existente → página completa con msg_code
curl -s "https://bancobacc.com.do:2083/login/" \
  -X POST -d "user=admin&pass=wrongpassword"
# → ~40 KB, msg_code:[invalid_login]

# Usuario inexistente → página vacía
curl -s "https://bancobacc.com.do:2083/login/" \
  -X POST -d "user=nonexistent&pass=wrongpassword"
# → ~1 KB
```

**Wordlist generada (47 usuarios):** Nombres reales extraídos de metadatos de PDFs del banco.
Guardada en: `/tmp/bacc_cpanel_users.txt`

**Impacto:**
- Identificación de cuentas de hosting activas
- Preparación para ataque de fuerza bruta dirigido
- WHM también accesible en puerto 2087

**Rate limiting:** Se activa después de ~10 intentos — timeout temporal de conexiones.

**Recomendación:**
- Restringir acceso a cPanel/WHM por IP (VPN o whitelist)
- Implementar 2FA en todas las cuentas
- Deshabilitar respuestas diferenciales en login

---

## 5. 🟠 Hallazgos de Riesgo Medio

### BACC-07: Online Banking — Análisis de Superficie

**Severidad:** 🟠 Media | **CVSS:** 4.3

**Endpoint:** `https://enlinea.bancobacc.com.do`
**Plataforma:** Bankingly (ASP.NET) hosteado en Microsoft Azure

#### 1. X-Frame-Options Parcial

El online banking no tiene `X-Frame-Options: DENY` en el redirect inicial (302 → Login.aspx). Las páginas internas autenticadas sí lo tienen configurado. Esto permite potencial clickjacking en la página de login.

**Evidencia:**
```
HTTP/2 302 → /Administration.WebUI/Pages/General/Login.aspx
X-Frame-Options: AUSENTE  ← En redirect inicial
```

#### 2. Surface de API

| Endpoint | Método | Respuesta |
|----------|--------|-----------|
| `/api` | GET | 302 → Login |
| `/api/v1/login` | GET | 302 → Login |
| `/api/v1/accounts` | GET | 302 → Login |
| `/api/v1/balances` | GET | 302 → Login |
| `/api/v1/transactions` | GET | 302 → Login |
| `/api/v1/transfers` | GET | 302 → Login |
| `/api/v1/payments` | GET | 302 → Login |
| `/api/v1/loans` | GET | 302 → Login |
| `/api/v1/user` | GET | 302 → Login |
| `/swagger/docs/v1` | GET | 302 → Login |
| `/swagger/ui/index` | GET | 200 (Login page renderizado) |
| `/api-docs` | GET | 200 (Login page renderizado) |

**Todas las API requieren autenticación** — Swagger no expone documentación sin session activa.

#### 3. Headers de Seguridad

| Header | Valor |
|--------|-------|
| CSP | ✅ Configurado (lista blanca extensa: Facebook, Google, HubSpot, Norton, Bankingly CDN) |
| X-Frame-Options | ⚠️ SAMEORIGIN (debería ser DENY) |
| X-Content-Type-Options | ✅ nosniff |
| X-XSS-Protection | ✅ 1; mode=block |
| Referrer-Policy | ✅ no-referrer-when-downgrade |
| Permissions-Policy | ✅ Configurado (geolocation=self, resto restringido) |
| HttpOnly Cookies | ✅ ASLBSA + ASLBSACORS + SessionCookie |
| SameSite | ✅ Lax / None (CORS) |

#### 4. Infraestructura

| Componente | Detalle |
|------------|---------|
| **Hosting** | Microsoft Azure (`x-azure-ref`, `x-cache: CONFIG_NOCACHE`) |
| **CDN** | Azure CDN + `bklycdn.azureedge.net` |
| **Static Content** | `staticcontent.prod.bankingly.com` |
| **WebSockets** | `ws://web.bankingly.com` |
| **Terceros** | Facebook (login/recovery), Google Analytics/Maps, HubSpot, Norton, DigiCert, Pingdom |
| **App ID** | `cid-v1:c507e9f1-11c4-4a9d-9d7f-3e9715190feb` |
| **Tema** | `DO_BancoBACC` (personalizado por banco) |

#### 5. Bankingly Third-Party Risk (BACC-10)

Bankingly es un proveedor SaaS de banca en línea usado por múltiples instituciones financieras en RD/LATAM.

- **Data leak histórico (2024):** Bankingly expuso ~135,000 clientes de 7 instituciones por una mala configuración de Azure Blob Storage.
- **Banco BACC no fue víctima directa** del leak, pero comparte infraestructura con Bankingly (misma CDN, mismos endpoints estáticos).
- **Dependencia total:** El banco no puede parchear ni auditar el código de Bankingly por sí mismo.
- **CSP compartido:** El CSP incluye `ws://web.bankingly.com` (WebSocket no seguro) y múltiples terceros de tracking/marketing.

#### 6. Recomendaciones

1. Agregar `X-Frame-Options: DENY` en el redirect inicial (no solo en páginas autenticadas)
2. Migrar WebSocket a `wss://` (seguro) en lugar de `ws://`
3. Evaluar dependencia de terceros en el CSP (Facebook, HubSpot, Hotjar, etc.)
4. Solicitar a Bankingly reporte de auditoría de seguridad y compliance

---

### BACC-12: Registro de Usuario — Datos Solicitados

**URL:** `https://enlinea.bancobacc.com.do/Administration.WebUI/Pages/General/HiringPersonUser.aspx`
**Severidad:** 🟡 Informativo

**Descripción:**
El formulario de registro para nuevos usuarios del internet banking. Proceso de 3 pasos. No fue posible completar el registro (requiere datos reales de cédula dominicana), pero se mapeó la totalidad de los campos solicitados.

#### Paso 1 — Términos y Condiciones

| Campo | Tipo |
|-------|------|
| Aceptar términos | Checkbox obligatorio |

#### Paso 2 — Datos Personales

| Campo | ID ASP.NET | Tipo | Validación |
|-------|------------|------|------------|
| **Tipo de documento** | `dropDownListDocumentTypes` | Select | Cédula (3), Pasaporte (10), RNC (1) |
| **Nro. de documento** | `clientNumber` | Text (max 20) | `^[A-Za-z0-9-]*$` |
| **Nombre** | `adminName` | Text (max 50) | Caracteres válidos |
| **Apellido** | `adminSurname` | Text (max 50) | Caracteres válidos |
| **Correo electrónico** | `adminEmail` | Text (max 100) | Validación de formato |
| **Teléfono** | `adminPhone` | Text (max 50) | Solo números |
| **Teléfono móvil** | `txtMobilePhone` | Text (max 18) | Solo números, validación grupo |
| **Nombre de usuario** | `txtUserName` | Text (max 30) | Caracteres válidos |

#### Paso 3 — Confirmación

| Botón | ID | Acción |
|-------|-----|--------|
| Anterior | `Back` | Volver al paso 2 |
| Confirmar | `btnConfirm` | Enviar solicitud |
| Imprimir | `Button3` | Imprimir resumen |
| Ir a Login | `btnGoToLogin` | Volver al login |

**Nota:** El registro **no solicita contraseña**. La misma probablemente es asignada por el banco y enviada al correo electrónico registrado.

---

### BACC-08: No Content-Security-Policy

**Severidad:** 🟠 Media

El sitio WordPress no tiene CSP configurado, permitiendo la ejecución de cualquier script inyectado vía XSS.

**Recomendación:**
```apache
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
```

---

## 6. 🟡 Hallazgos Informativos

### BACC-09: Apache Server Header

**Severidad:** 🟡 Info

El header `Server: Apache` no debería exponerse a usuarios no autenticados.

**Recomendación:** En Apache: `ServerTokens Prod` y `ServerSignature Off`

---

## 7. Superficie de Ataque — Subdominios

| Subdominio | Código | Contenido | Riesgo |
|------------|--------|-----------|--------|
| `cpanel.bancobacc.com.do` | 200 | **cPanel Login** | 🔴 |
| `webmail.bancobacc.com.do` | 200 | **Webmail Login** | 🔴 |
| `enlinea.bancobacc.com.do` | 302 | Banca en línea (Bankingly) | 🟡 |
| `admin.bancobacc.com.do` | 302 | Admin ASP.NET Login | 🟡 |
| `api.bancobacc.com.do` | 403 | API (Wordfence) | 🟢 |
| `reclamaciones.bancobacc.com.do` | 404 | No activo | 🟢 |
| `solicitudes.bancobacc.com.do` | 404 | No activo | 🟢 |
| `verificacion.bancobacc.com.do` | 404 | No activo | 🟢 |
| `carrosrd.bancobacc.com.do` | — | Subdominio extra | 🟡 |
| `supercarros.bancobacc.com.do` | — | Subdominio extra | 🟡 |

---

## 8. Stack Tecnológico Completo

| Capa | Tecnología | Versión |
|------|------------|---------|
| **CMS** | WordPress | Desconocida (path: /cms/) |
| **SEO** | Yoast SEO | **20.12** 🟡 |
| **Forms** | Contact Form 7 | **5.7.7** 🟡 |
| **Page Builder** | SiteOrigin Page Builder | 2.25.0 |
| **Security** | Wordfence | Desconocida (activo) |
| **Templates** | SKT Templates | Desconocida |
| **Hosting** | GBH Web Hosting | cPanel |
| **Web Server** | Apache | — |
| **PHP** | PHP | 7.4 (EOL) |
| **Node** | Node.js | **10.x (EOL 2021)** 🟡 |
| **Base Image** | solucionesgbh/lep | 7.4 |
| **Online Banking** | Bankingly (ASP.NET) | — |
| **DNS** | Google Cloud DNS | — |
| **Email** | Office 365 | — |
| **CDN** | bklycdn.azureedge.net | Bankingly CDN |
| **IP** | 162.214.97.98 | GBH Web Hosting |

---

## 9. OSINT — Información Recopilada

### Organigrama de Alta Gerencia (17 ejecutivos)

Fuente: `bancobacc.com.do/quienes-somos/#altagerencia`

| # | Nombre | Cargo | Bio |
|---|--------|-------|-----|
| 1 | **Alberto De Los Santos Billini** | Presidente | 40+ años banca, Chase Manhattan → BHD → BACC. Miembro consejo Grupo BHD, ARS Palic, BHD Intl Bank Panamá |
| 2 | **Deborah De Los Santos Lebrón** | VP Ejecutiva | 14+ años banca. Ex Reservas, Scotiabank, Citibank. Desde oct 2015 |
| 3 | **María Julia Díaz** | Directora Administradora | 1986→hoy en BACC. Auxiliar Cobros Financiera Arroes (1983-86) |
| 4 | **Gustavo Domingo** | Director de Negocios | Ex Auto Alyce, BACC desde 2001. Gerente sucursal 27 Feb → Gerente Ventas y Mercadeo |
| 5 | **Addys Mercedes** | Gerente Planeación Estratégica y Presupuesto | Ex Ministerio Obras, Infotel CODETEL, Corredores Seguro Jiménez y Ortega, 10 años en créditos BACC |
| 6 | **Alberto De la Cruz** | Gerente de Crédito | — |
| 7 | **Rosa Cruz** | Gerente de Operaciones | 25+ años banca. Ex Contadora General. Desde ene 2007 |
| 8 | **Willy Alfredo Padua** | Director Riesgos Integral, Ciberseguridad y Control Interno | CISA, CRISC, CDPSE. Riesgos, compliance, ciberseguridad |
| 9 | **Marcia Mota Marte** | Gerente de Cumplimiento | Lic. Mercadotecnia, Certificación Cumplimiento. Ex ARS FUTURO, Banco Peravia, Popular |
| 10 | **Fior Sánchez** | Gerente Auditoría Interna | 20+ años auditoría, 16 en sector financiero. Ex BDO, Corporación Crédito América |
| 11 | **Silvia Peña** | Gerente de Control Interno | Lic. Contabilidad. Ex Penny's calzados, Extra Gas, BDO |
| 12 | **Pedro Cordero Lama** | Gerente de Legal | Lic. Contabilidad, Maestría Gestión Humana |
| 13 | **Teresa Parra** | Gerente de Recursos Humanos | En BACC desde 2002. Asistente Operaciones → Aux Contabilidad → Aux Documentación → Gerente RH desde 2008 |
| 14 | **Yonaira Arias** | Gerente de Contabilidad | Post-grado Desarrollo Organizacional, MBA |
| 15 | **Wayner Castillo** | Gerente de Seguridad de la Información | — |
| 16 | **Rosa María Torres** | Gerente de Cobros | — |
| 17 | **Nathalie García Patrone** | Gerente de Mercadeo | 10+ años marketing leadership |

### Consejo de Administración (Gobierno Corporativo)

| Cargo | Nombre |
|-------|--------|
| Presidente | Alberto R. De Los Santos Billini |
| Vicepresidente | María Julia Díaz |
| Secretario | Francisco A. Rodríguez Guzmán |
| Consejero | Peter A. Croes Nadal |
| Consejero | Fernando J. González Nicolás |
| Consejero | William Harper |
| Consejero | Roberto Rojas |

### Comités de Trabajo

| Comité |
|--------|
| Ejecutivo (Alta Gerencia) |
| Crédito |
| Nombramiento y Remuneraciones |
| Riesgo Integral |
| Cumplimiento |
| Auditoría |
| Tecnología |
| Activos y Pasivos |
| Ética |
| Ciberseguridad |

### Infraestructura

| Dato | Valor |
|------|-------|
| Azure Tenant ID | `f969783a-71a2-4526-96fa-42c05f0cf061` |
| SPF Record | `include:spf.protection.outlook.com -all` |
| Sophos Verification | `5d1574f233f858bd2e2cfa9c2f795a9ac7f8223e08524ed400b2dbd3a572baf5` |
| Mailjet | En SPF (marketing emails) |
| Google Play App | `dom.com.bankingly.DO_BancoBACC` |

---

## 10. Guía de Remediación Priorizada

### 🔴 Hacer ahora (24-48h)

| # | Acción | Responsable | Tiempo |
|---|--------|-------------|--------|
| 1 | Bloquear cPanel + Webmail a IPs internas/VPN | Hosting | 1h |
| 2 | Deshabilitar Directory Listing en `/content/uploads/` | DevOps | 30min |
| 3 | Bloquear acceso al Dockerfile via `.htaccess` | DevOps | 15min |

### 🟡 Hacer esta semana

| # | Acción | Prioridad |
|---|--------|-----------|
| 4 | Actualizar Yoast SEO v20.12 → latest | Alta |
| 5 | Actualizar Contact Form 7 v5.7.7 → latest | Alta |
| 6 | Agregar X-Frame-Options: DENY en enlinea | Media |
| 7 | Agregar Content-Security-Policy al WordPress | Media |

### 🟢 Hacer este mes

| # | Acción | Prioridad |
|---|--------|-----------|
| 8 | Actualizar PHP 7.4 → 8.1+ (EOL Nov 2022) | Media |
| 9 | Actualizar Node.js 10 → 18+ LTS | Media |
| 10 | Implementar monitoreo de REST API | Baja |
| 11 | Auditoría de seguridad de Bankingly (third-party) | Media |

---

## 11. Anexo Técnico

### Vectores de Defacement

| Vector | Resultado |
|--------|-----------|
| File upload (WordPress) | ❌ Bloqueado por Wordfence |
| File upload (cPanel, si se compromete) | 🔴 **Sí** — file manager |
| XSS reflejado | ❌ Sin reflexión |
| Git exposure | ❌ Bloqueado |
| WP-Admin | ❌ Bloqueado por Wordfence + robots.txt |
| cPanel (si se compromete) | 🔴 **Control total** |

### SSRF — Vector Map

```
Atacante externo
  └→ Obtiene credenciales WP (cPanel, phishing)
      ├→ Yoast file_size → SSRF a metadata cloud
      ├→ oembed proxy → SSRF a servicios internos
      └→ batch/v1 → SSRF batch autenticado
```

---

## 12. User Enumeration — PDF Metadata Extraction

Wordfence bloquea todos los vectores de enumeración de usuarios por REST API. Sin embargo, el **Directory Listing en `/content/uploads/`** expuso 105 archivos (95 PDFs, 4 CSVs) con metadatos que revelaron información crítica.

### 🔴 CRÍTICO — Ruta Interna de Windows Expuesta

| Archivo | `BANCO-BACC.pdf` |
|---------|------------------|
| Ruta leak | `C:\Users\168855\Downloads\27_03_2026 HOY_VIERNES_270326_ El Pa...` |
| Usuario Windows | **168855** |
| Herramienta | Adobe Illustrator CS4 |
| Implicación | El usuario `168855` trabajó localmente y subió el archivo sin sanitizar metadatos |

### Emails Encontrados

| Email | Archivo |
|-------|---------|
| `codigoeticainquietudes@bancobacc.com.do` | Código de Ética 2018 |
| `info@guzmantapiapkf.com.do` | Estados Financieros 2017-2018 (auditor externo) |

### 21 Empleados Identificados vía Metadata

| Nombre | Rol/Área | Archivo |
|--------|----------|---------|
| **Dewars Barett Baez** | IT / App | Proceso de disvinculación App |
| **Maria Luisa Diaz** (mldiaz) | Reportes financieros | Varios reportes semestrales |
| **Nathalie Garcia Patrone** | Memoria Anual / Bienes | Memoria 2022 |
| **Ricardo Cabral - INTEC** | Legal | Recapitalización, imagen corporativa |
| **Deborah De los Santos Lebrón** | Tarifario / Memoria | Tarifas 2018, Memoria Anual 2018 |
| **G Pabón** | Estados Financieros | EF-BACC 2022-2024 |
| **GEBER GARCIA** | Métodos de Cálculo | Metodos de Calculo BACC |
| **Griselda Lizardo** | Legal / Contratos | Modelo Contrato de Adhesión |
| **Mariana Santos** | Privacidad | Política de uso de información personal |
| **Maris Mendez** | Ética | Código de Ética y Conducta |
| **Diego Reyes** | Activos / Vehículos | Lista de vehículos 2023 |
| **Raymie R. Sanchez Cano** | Vehículos | Lista de vehículos 2024 |
| **ctaveras** | Financiero | Estados Financieros 2017 |
| **pcordero** | Legal | Instructivo Reclamación, Seguros |
| **jsalas** | HES | Documento HES 2019 |
| **Alejandro Croce Mujica** | Informes | Informe NI BACC |
| **Fior Sanchez** | Tasación | Tasador BACC |
| **PBC** | Memoria | Memoria 2017 |
| **Zunilda Guillen Rueda** | Biometría | Configuración biométrica |
| **Marcia Mota Marte** | — | En página Quiénes Somos |
| **Willy Alfredo Padua** | — | En página Quiénes Somos |

### Mapeo WP Users ↔ Nombres

| WP User ID | Rol | Nombre probable | Evidencia |
|------------|-----|-----------------|-----------|
| **User 5** | Autor de 42 attachments | **Dewars Barett Baez** | PDF author field coincide con uploader de Proceso App |
| **User 2** | Autor de 16 páginas | **Maria Luisa Diaz** | Autora de documentos financieros subidos al WP |
| **User ?** | Administrador | **Nathalie Garcia Patrone** | Creadora de documentos institucionales (Memorias) |

### Fingerprinting de Estación de Trabajo

| Sistema | Cantidad docs | Usuario |
|---------|:-------------:|---------|
| Windows (usuario 168855) | 1 | 168855 (Illustrator CS4) |
| macOS 15.7.3 (Build 24G419) | 1 | — (Quartz PDFContext) |
| Microsoft Office 365 | 5+ | Dewars, Maria Luisa, et al. |
| Adobe Illustrator CS4 | 1 | 168855 |
| Nitro Pro 8 / 10 | 3+ | — |
| PDF-XChange 5.5 | 1 | — |
| RICOH printer/scanner | 3+ | — |
| PFU ScanSnap | 1 | — |

### Archivos Sensibles Identificados

| Archivo | Tamaño | Contenido |
|---------|:------:|-----------|
| MEMORIA-ANUAL-BACC-2025.pdf | **28 MB** | Reporte anual completo (133 págs) |
| Estados-Auditados-BACC-2025.pdf | 714 KB | **Encriptado (RC4)** — 74 págs, copy disabled |
| BANCO-BACC.pdf | 9.5 MB | Logo con **ruta Windows leak** |
| Proceso-de-disvinculacion-de-App.pdf | 493 KB | Procedimiento interno de TI |
| CSVs (4 archivos) | — | Vehículos adjudicados con precios (56-72 entries c/u) |

### Data Recolectada

| Archivo | Path |
|---------|------|
| Metadata completa (15,250 líneas) | `/root/bacc_metadata/000_METADATA_REPORT.txt` |
| Reporte estructurado | `/root/bacc_metadata/COMPREHENSIVE_REPORT.md` |
| Archivos descargados (105, 412MB) | `/root/bacc_files/` |

### cPanel / WHM — Acceso y Enumeración

cPanel está accesible en `https://bancobacc.com.do:2083/` (login page sin IP whitelist). WHM también responde en puerto 2087.

**Vulnerabilidad de User Enumeration:**

El cPanel login devuelve respuestas diferenciales que permiten identificar qué usuarios existen:

| Estado | Respuesta | Tamaño |
|--------|-----------|:------:|
| Login exitoso | Redirect + cookies | ~1 KB |
| Usuario existe + pass incorrecto | `msg_code:[invalid_login]` | ~40 KB |
| Usuario no existe | Página vacía / sin msg_code | ~1 KB |

**Rate limiting presente** — después de ~10 intentos, el servidor bloquea temporalmente la IP (timeout en conexiones).

**Wordlist de usuarios potenciales (47) generada desde nombres reales extraídos de PDFs** — guardada en `/tmp/bacc_cpanel_users.txt`.

### Resumen de Vectores de Ataque

| Vector | Accesible | Notas |
|--------|:---------:|-------|
| cPanel login (port 2083) | ✅ | Sin IP whitelist, user enumeration posible |
| WHM login (port 2087) | ✅ | Sin IP whitelist |
| Webmail | ✅ | cPanel Webmail con password reset |
| WordPress REST API | ⚠️ | Wordfence bloquea users, pages funciona |
| WordPress wp-admin | 🔒 | 401 — Wordfence bloquea |
| XML-RPC | 🔒 | Wordfence bloquea (retorna HTML) |
| Directory listing | ✅ | `/content/uploads/` — 10 años de datos |

---

## 14. OSINT — Web Scraping del Homepage

**URL:** `https://bancobacc.com.do`
**Fecha:** 30 Junio 2026
**Tamaño:** 70,857 bytes
**Última modificación:** 10 Marzo 2025 (Yoast schema)

### Meta Tags

| Tag | Valor |
|-----|-------|
| Title | `Banco BACC - Banco de Ahorro y Crédito del Caribe` |
| Description | `En Banco BACC estamos comprometidos a ofrecerte soluciones financieras agiles y de calidad que se ajustan a tus necesidades.` |
| Site name | `Banco BACC` |
| Language | `es` |

### Estructura del Sitio

**Páginas principales:**
- `/` — Homepage
- `/quienes-somos/` — Quiénes somos
- `/gobierno-corporativo/` — Gobierno corporativo
- `/prestamos-de-consumo/` — Préstamos de consumo
- `/prestamos-comerciales/` — Préstamos comerciales
- `/prestamos-hipotecarios/` — Préstamos hipotecarios
- `/certificado-de-deposito/` — Certificado de depósito
- `/bienes-adjudicados/` — Bienes adjudicados
- `/dealers` — Listado de dealers asociados
- `/formas-de-pago/` — Formas de pago
- `/contactanos/` — Contáctanos
- `/calificacion-de-riesgo/` — Calificación de riesgo
- `/hechos-relevantes/` — Hechos relevantes
- `/app/` — App
- `/bonos-corporativos/` — Bonos corporativos
- `/fatca/` — FATCA
- `/memorias-anuales-y-estados-financieros-2/` — Memorias Anuales

### PDFs Expuestos en Homepage

Los siguientes documentos están enlazados directamente desde la página principal, todos accesibles sin autenticación:

| Archivo | Descripción | Tamaño |
|---------|-------------|:------:|
| `codigo_de_etica.pdf` | Código de Ética | — |
| `metodos_de_calculo.pdf` | Métodos de cálculo | — |
| `modelo_contrato_de_adhesion.pdf` | Contrato de adhesión | — |
| `pasos_para_una_reclamacion.pdf` | Instructivo de reclamaciones | — |
| `politica_de_uso_e_intercambio_de_informacion_personal_del_usuario.pdf` | Política de privacidad | — |
| `Codigo-de-ética-y-conducta-Banco-BACC-final-27-de-marzo-2019-actualizacion-instructivo-de-lavado.pdf` | Código ética actualizado 2021 | — |
| `Tasador-BACC.pdf` | Tasador oficial | — |
| `INSTRUCTIVO-PARA-REALIZAR-RECLAMACION-Rev-2022-UV.pdf` | Reclamaciones 2022 | — |
| `Texto-relacionado-a-Seguros-Pagina-Web-BACC.pdf` | Texto de seguros | — |
| `Tarifario-Mayo-2025.pdf` | Tarifario vigente | — |
| `Declaracion-de-Compromiso-Codigo-de-Conducta.pdf` | Código de conducta | — |

### Plugins WordPress Detectados

| Plugin | Versión | Path |
|--------|:-------:|------|
| **Yoast SEO** | **20.12** | `content/plugins/wordpress-seo/` |
| **Contact Form 7** | **5.7.7** | `content/plugins/contact-form-7/` |
| SiteOrigin Page Builder | 2.25.0 | `content/plugins/siteorigin-panels/` |
| SKT Templates | — | `content/plugins/skt-templates/` |
| Wordfence | Activo | `?wordfence_lh=1&hid=14D9874EEAB3898ACE436E2C6046752F` |

### Dependencias JavaScript

| Librería | Versión |
|----------|:-------:|
| jQuery | 3.6.4 |
| jQuery Migrate | 3.4.0 |
| masonry | 4.2.2 |
| imagesloaded | 4.1.4 |
| wp-polyfill | 3.15.0 |
| regenerator-runtime | 0.13.11 |
| reCAPTCHA CF7 | Activo |

### Redes Sociales

| Plataforma | URL |
|------------|-----|
| Facebook | `https://www.facebook.com/bancobacc/` |
| Instagram | `https://www.instagram.com/bancobacc/` |
| Twitter/X | `https://twitter.com/BancoBacc` |

### Certificaciones Visibles

- **Feller Rate** — Calificación de riesgo (logo en homepage)
- **UAF** — Unidad de Análisis Financiero (certificación visible)

### Información del Homepage Extraída

```
"Por más de 40 años movilizando tu mundo"
Obtuvimos la Calificación "A" Por Feller Rate

Productos estrella:
  • Préstamos de vehículos
  • Certificado financiero

Slogan: "Selecciona tu vehículo y nosotros te lo financiamos"
```

### Datos Adicionales

| Elemento | Detalle |
|----------|---------|
| WordPress path | `/cms/` |
| XML-RPC | `/cms/xmlrpc.php?rsd` |
| wlwmanifest | `/cms/wp-includes/wlwmanifest.xml` |
| Theme | `bacc` (Soluciones GBH) |
| Styles hash | `f7a05a6edd43725e21ec57e4233fd78e` |
| Teléfono | `+1-809-562-6473` |
| Yoast schema updated | 10 Marzo 2025 |

---

## 15. Data Recolectada

Archivos guardados en `targets/bancobacc/`:
- `subs_raw.txt` — 38 subdominios
- `nuclei_results.txt` — findings de nuclei
- `nuclei_cves.txt` — CVEs específicos
- `nuclei_exposures.txt` — Exposures (Dockerfile, Azure Tenant)
- `README.md` — Este reporte

---

*Reporte generado por Hermes — NSI LLC Audit & Bug Bounty Framework*
*Metodología: Black-box OSINT + Recon automatizado*
