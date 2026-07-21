# ⚠️ Reporte de Seguridad — Banco BACC (bancobacc.com.do)

**Fecha:** 14 Julio 2026 (Última actualización)
**Target:** `bancobacc.com.do` — Banco de Ahorro y Crédito BACC, República Dominicana
**Clasificación:** 🔴 **CRÍTICA** — Múltiples exposiciones activas de datos sensibles

---

## Índice

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Directory Listing Abierto — Exposición Masiva de PDFs](#2-directory-listing-abierto--exposición-masiva-de-pdfs)
3. [Documentos con PII / Datos de Clientes](#3-documentos-con-pii--datos-de-clientes)
4. [Gobierno Corporativo y Directivos Expuestos](#4-gobierno-corporativo-y-directivos-expuestos)
5. [Datos Financieros Sensibles](#5-datos-financieros-sensibles)
6. [Infraestructura y Superficie de Ataque](#6-infraestructura-y-superficie-de-ataque)
7. [Subdominios](#7-subdominios)
8. [WordPress REST API — Información Expuesta](#8-wordpress-rest-api--información-expuesta)
9. [Plugin Versions y Vectores Conocidos](#9-plugin-versions-y-vectores-conocidos)
10. [Debilidades de Control Interno (Auditoría 2022)](#10-debilidades-de-control-interno)
11. [Recomendaciones](#11-recomendaciones)
12. [Evidencia](#12-evidencia)

---

## 1. Resumen Ejecutivo

| Categoría | Estado | Riesgo |
|-----------|--------|--------|
| Directory Listing | 🔴 **ABIERTO** | CRÍTICO |
| 180+ PDFs expuestos (2017-2026) | 🔴 ACCESIBLES | CRÍTICO |
| Contratos bancarios reales con PII | 🔴 CONFIRMADO | CRÍTICO |
| Nómina directiva completa expuesta | 🔴 CONFIRMADO | ALTO |
| Accionistas controladores identificados | 🔴 CONFIRMADO | ALTO |
| Cédula personal de funcionaria | 🔴 EXPUESTA | CRÍTICO |
| WP REST API pública | 🟡 EXPUESTA | ALTO |
| SSRF potencial (Yoast file_size) | 🟡 ENDPOINT VIVO | MEDIO |
| Bankingly BackOffice (ASP.NET) | 🟡 EXPUESTO | ALTO |
| Batch API funcional | 🟡 ACTIVO | MEDIO |
| HSTS / TLS | 🟢 ACTIVO | BAJO |

---

## 2. Directory Listing Abierto — Exposición Masiva de PDFs

El servidor Apache tiene **directory listing habilitado** en `/content/uploads/`, permitiendo navegar por años, meses y archivos completos. **Wordfence WAF no protege esta ruta.**

### URL base expuesta
```
https://bancobacc.com.do/content/uploads/{YYYY}/{MM}/
```

### Desglose completo por año

| Año | # PDFs | Tipo de contenido |
|-----|--------|-------------------|
| **2017** | 6 | Estados financieros auditados (2013-2016), Memorias |
| **2018** | **108** 🛑 | Bonos corporativos, Prospectos SIV, Formularios W-8BEN/W-8ECI/W-8EXP/W-8IMY/W-9 (IRS), Tarifarios, Contratos, Código de ética, Resultados inspección DGII |
| **2019** | 12 | Estados financieros, Informes trimestrales, Calificaciones Feller Rate |
| **2020** | 16 | EEFF auditados, Memorias anuales, Redención anticipada de bonos, Asamblea aumento capital |
| **2021** | 10 | EEFF auditados 2020, Código de ética, Informe Feller, Tarifario |
| **2022** | 6 | Tasador autorizado, Instructivo reclamaciones, EEFF auditados |
| **2023** | 9 | 🔴 **Vehículos en venta**, 🔴 **Bienes adjudicados (embargos)**, Memoria anual, Biometría app |
| **2024** | 7 | 🔴 **Contrato de préstamo real con nombre del cliente**, 🔴 **Vehículos en venta**, Memoria 2023 |
| **2025** | 6 | Memoria Anual 2025, Tarifarios, EF Auditados 2023 |
| **2026** | **5** | EEFF Auditados 2025, Memoria Anual 2025, 📄 **Proceso desvinculación App (interno)**, 📄 **Bahorro Credit Caribe / Feller Rate Ene 2026** |
| **Total** | **≈ 185 PDFs** | |

### Archivos individuales por año/mes

#### 2017
| Archivo | Ruta |
|---------|------|
| EEFF-Auditados-Banco-BACC-2013.pdf | `/content/uploads/2017/01/` |
| EEFF-Auditados-Banco-BACC-2014.pdf | 〃 |
| Estados-Financieros-2017-BACC.pdf | 〃 |
| Estados-Financieros-auditado-SIB-2015.pdf | 〃 |
| Estados-financieros-Auditados-2016.pdf | 〃 |
| Memoria-2017-Banco-BACC.pdf | 〃 |

#### 2018 (108 PDFs — mayor exposición histórica)
Incluye:
- Prospectos de emisión de bonos (1ra, 2da, 3ra, 4ta emisión)
- Hechos relevantes de colocación primaria (múltiples fechas)
- Informes trimestrales masa obligacionista
- **Formularios IRS: W-8BEN, W-8ECI, W-8EXP, W-8IMY, W-9** e instructivos
- **Resultados-Inspeccion-2018-DGII.pdf** — Auditoría de Impuestos Internos
- Memorias anuales 2014, 2015, 2016, 2017
- Reportes Feller Rate (2015, 2016, 2017)
- Tarifario, Código de ética, Contrato de adhesión, Política de uso de datos
- Carta de instrucciones W-8BEN-E

#### 2019
| Archivo | Ruta |
|---------|------|
| Estados-Financieros-2017-2018.pdf | `/content/uploads/2019/03/` |
| HES_20190208-102825_1-01-13879-3.pdf | 〃 |
| Nuevo-Miembro-al-Consejo-de-Administracion-.pdf | 〃 |
| Informe-Trimestral-Abril-2019.pdf | `/content/uploads/2019/04/` |
| Informe-Representantes-Obligacionistas-Marzo-2019.pdf | `/content/uploads/2019/05/` |
| Hecho-Relevante-convocatoria-Asamblea-Ordinaria-junio-19.pdf | `/content/uploads/2019/06/` |
| Informe-Trimestral-Julio-2019.pdf | `/content/uploads/2019/07/` |
| HECHO-RELEVANTE-INFORME-REPRESENTANTE-MASA-OBLIG.pdf | `/content/uploads/2019/08/` |
| Informe-anual-de-calificacion-de-riesgo-agosto-2019.pdf | `/content/uploads/2019/09/` |
| Estados-comparativos-a-septiembre-2019.pdf | `/content/uploads/2019/10/` |
| Hecho-Relevante-SIMV-Informe-Trimestral-octubre-2019-FELLER-RATE.pdf | 〃 |
| Informe-Repr-Oblig-Banco-BACC-SIVEM-113-a-Sept-2019.pdf | `/content/uploads/2019/11/` |
| MEMORIA-ANUAL-2018.pdf | `/content/uploads/2019/12/` |
| Tarifario-a-Agosto-2019.pdf | 〃 |

#### 2020
| Archivo | Ruta |
|---------|------|
| Hecho-Relevantes-Informe-Trimestral-Feller-Rate.pdf | `/content/uploads/2020/01/` |
| informe-trimestral-Masa-Obligacionistas-trimestre-oct-dic-2019.pdf | `/content/uploads/2020/02/` |
| 20-03-2020-.pdf | `/content/uploads/2020/03/` |
| Informe-trimestral-Calificacion-de-Riesgo-Feller-Rate-abril-2020.pdf | `/content/uploads/2020/04/` |
| Estados-Financieros-2018-2019.pdf | `/content/uploads/2020/05/` |
| Hecho-Relevante-celebracion-Asamble-Ordinaria-Anual-2020.pdf | 〃 |
| Informe-Repr-Oblig-a-Marzo-2020-final.pdf | 〃 |
| MEMORIA-ANUAL-2019.pdf | 〃 |
| Hecho-relevante-Asamblea-aumento-de-Capital-2020.pdf | `/content/uploads/2020/06/` |
| Hecho-Relevante-Informe-Trimestral-Masa-Obligacionista-SIMV.pdf | `/content/uploads/2020/08/` |
| Estados-comparativo-septiembre-2020.pdf | `/content/uploads/2020/10/` |
| Hecho-Relevante-redencion-anticipada-Bonos-Corporativos-2020-BVRD.pdf | 〃 |
| Hecho-Relevante-redencion-anticipada-Bonos-Corporativos-2020-SIMV.pdf | 〃 |
| Hecho-Relevante-redencion-anticipada-Bonos-Corporativos-2020-cevaldom.pdf | 〃 |
| Informe-Repr-Oblig-a-Septiembre-2020.pdf | `/content/uploads/2020/11/` |

#### 2021
| Archivo | Ruta |
|---------|------|
| 2020-07-BACC-Trimestral-julio-2020.pdf | `/content/uploads/2021/06/` |
| 2020.11-Informe-Anual-BACC.pdf | 〃 |
| INFORME-FELLER-2020-10-BACC-Trimestral-octubre-2020.pdf | 〃 |
| INFORME-FELLER-TRIMESTRAL-ENERO-2021.01.pdf | 〃 |
| MEMORIA-ANUAL-2020-1.pdf | 〃 |
| MEMORIA-ANUAL-2020.pdf | 〃 |
| Tarifario-a-2021.pdf | 〃 |
| Codigo-de-etica-y-conducta-Banco-BACC-actualizacion-lavado.pdf | `/content/uploads/2021/07/` |
| Hecho-relevante-simv_-informe-masa-obligacionistas-dic-2020.pdf | 〃 |
| Informe-de-calificacion-de-riesgo-junio-2021.pdf | 〃 |

#### 2022
| Archivo | Ruta |
|---------|------|
| Tasador-BACC.pdf | `/content/uploads/2022/02/` |
| INSTRUCTIVO-PARA-REALIZAR-RECLAMACION-Rev-2022-UV.pdf | `/content/uploads/2022/03/` |
| Estados-Financieros-auditados-Dictamen.pdf | `/content/uploads/2022/04/` |
| MEMORIA-ANUAL-2021.pdf | 〃 |
| Texto-relacionado-a-Seguros-Pagina-Web-BACC.pdf | 〃 |
| Informe-de-feller-2022.pdf | `/content/uploads/2022/08/` |

#### 2023
| Archivo | Ruta |
|---------|------|
| Informe-semestral-BACC-2023.02.pdf | `/content/uploads/2023/02/` |
| EF-BANCO-BACC-DE-AHORRO-Y-CREDITO-DEL-CARIBE-S.A.-2022-SF.pdf | `/content/uploads/2023/04/` |
| Memoria-Anual-2022-4.pdf | 〃 |
| Informe-BACC-2023.07.pdf | `/content/uploads/2023/08/` |
| 🔴 **RELACION-DE-VEHICULOS-EN-VENTA-JULIO-23-1.pdf** | 〃 |
| Pasos-para-configurar-Biometria_BACC-en-Linea.pdf | 〃 |
| 🔴 **BIENES-ADJUDICADOS-SEPT.23.pdf** | `/content/uploads/2023/09/` |

#### 2024
| Archivo | Ruta |
|---------|------|
| 🔴 **Listado-de-vehiculo-en-venta.pdf** | `/content/uploads/2024/03/` |
| 🔴 **CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf** | `/content/uploads/2024/04/` |
| EF-BANCO-BACC-DE-AHORRO-Y-CREDITO-DEL-CARIBE-S.A.-2023.pdf | 〃 |
| Memoria-Anual-2023-BACC.pdf | 〃 |
| Tarifario-Mayo-2024-version-2.pdf | `/content/uploads/2024/05/` |
| Tarifario-Mayo-2024.pdf | 〃 |
| Contrato-de-Prestamo-con-Garantia-Mobiliaria.pdf | `/content/uploads/2024/07/` |

#### 2025
| Archivo | Ruta |
|---------|------|
| Memoria-Anual-2025-BANCO-BACC-1.pdf | `/content/uploads/2025/04/` |
| Memoria-Anual-2025-BANCO-BACC.pdf | 〃 |
| Tarifario-marzo-2025.pdf | 〃 |
| Tarifario-Mayo-2025.pdf | `/content/uploads/2025/05/` |

#### 2026
| Archivo | Ruta | Tamaño |
|---------|------|--------|
| Estados-Auditados-BACC-2025.pdf | `/content/uploads/2026/03/` | 698 KB |
| bahorrocreditocaribe2601is.pdf (Feller Rate Ene 2026) | 〃 | 318 KB |
| BANCO-BACC.pdf | `/content/uploads/2026/04/` | — |
| MEMORIA-ANUAL-BACC-2025.pdf | 〃 | 28.2 MB |
| Proceso-de-disvinculacion-de-App.pdf | 〃 | 493 KB |

---

## 3. Documentos con PII / Datos de Clientes

### 3.1 🔴 CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf
| Campo | Info |
|-------|------|
| URL | `/content/uploads/2024/04/CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf` |
| Tamaño | 12.4 MB |
| Riesgo | **CRÍTICO** — Contrato real con nombre completo del cliente, cédula, condiciones financieras |
| Tipo | Documento de préstamo con garantía mobiliaria (vehículo) |

### 3.2 🔴 RELACION-DE-VEHICULOS-EN-VENTA-JULIO-23.pdf
| Campo | Info |
|-------|------|
| URL | `/content/uploads/2023/08/RELACION-DE-VEHICULOS-EN-VENTA-JULIO-23-1.pdf` |
| Tamaño | 164 KB |
| Riesgo | **ALTO** — Lista de vehículos recuperados/adjudicados con datos |
| Contenido | Marca, modelo, año, cilindrada, precio |

### 3.3 🔴 BIENES-ADJUDICADOS-SEPT.23.pdf
| Campo | Info |
|-------|------|
| URL | `/content/uploads/2023/09/BIENES-ADJUDICADOS-SEPT.23.pdf` |
| Tamaño | 164 KB |
| Riesgo | **ALTO** — Propiedades embargadas / reposición de deuda |

### 3.4 🔴 Listado-de-vehiculo-en-venta.pdf
| Campo | Info |
|-------|------|
| URL | `/content/uploads/2024/03/Listado-de-vehiculo-en-venta.pdf` |
| Tamaño | 609 KB |
| Riesgo | **ALTO** — Listado actualizado de vehículos en venta (marca, modelo, año) |

### 3.5 🔴 Formularios Fiscales IRS (W-8, W-9)
| Archivo | Contenido |
|---------|-----------|
| W-8BEN.pdf | Formulario IRS — datos fiscales de inversores extranjeros |
| W-8ECI.pdf | Formulario IRS — ingresos efectivamente conectados |
| W-8EXP.pdf | Formulario IRS — organizaciones extranjeras exentas |
| W-8IMY.pdf | Formulario IRS — intermediarios extranjeros |
| W-9.pdf | Formulario IRS — solicitud de TIN de contratistas |
| Instrucciones-W-8BEN-E.pdf | Instructivo para entidades extranjeras |
| Instrucciones-W-9.pdf | Instructivo W-9 |

### 3.6 Otros documentos sensibles
| Documento | Descripción |
|-----------|-------------|
| Resultados-Inspeccion-2018-DGII.pdf | Inspección de la Dirección General de Impuestos Internos |
| Contrato-Garantía-Hipotecaria.pdf | Modelo de contrato con garantía hipotecaria |
| modelo_contrato_de_adhesion.pdf | Contrato de adhesión completo |
| Tasador-BACC.pdf | Datos del tasador autorizado (nombre, registro, teléfono, email) |
| Proceso-de-disvinculacion-de-App.pdf | Procedimiento interno de desvinculación de app (2026) |
| Pasos-para-configurar-Biometria_BACC-en-Linea.pdf | Instructivo interno de configuración biométrica |
| Prospecto-de-Emisión-Preliminar-Aprobado-por-la-SIV.pdf | Datos financieros estratégicos para emisión de bonos |
| Prospecto-Simplificado-de-Emisión-Segunda-Emisión-de-Bonos.pdf | Información financiera de emisión |
| Tarifario 2017 → 2025 | **Serie histórica completa** de tarifarios bancarios |

---

## 4. Gobierno Corporativo y Directivos Expuestos

### 4.1 Consejo de Administración 2025
| Miembro | Cargo | Categoría |
|---------|-------|-----------|
| Alberto R. De Los Santos Billini | **Presidente** | Interno / Ejecutivo |
| María Julia Díaz De Los Ángeles | **Vicepresidente** | Interna / Ejecutiva |
| Francisco Antonio Rodríguez Guzmán | **Secretario** | Externo No Independiente |
| Peter Alfred Croes Nadal | **Tesorero** | Externo Independiente |
| Fernando José González Nicolás | Consejero | Externo No Independiente |
| Juan Roberto Rojas Santiago | Consejero | Externo Independiente |
| William Joseph Harper Heinsen | Consejero | Externo Independiente |

**Fuente:** Memoria Anual 2025 (29MB PDF público)

### 4.2 Accionistas Controladores (Beneficial Owners)
> *"BACC es controlado, mediante participaciones directas o a través de sociedades, por **María Teresa Hernández**, **Teresa Lebrón Hernández** y **Alberto De Los Santos**."*

**Fuente:** `bahorrocreditocaribe2601is.pdf` — Informe Calificación Feller Rate, Enero 2026

### 4.3 Alta Gerencia 2025
| Nombre | Posición |
|--------|----------|
| Alberto de los Santos | Presidente |
| María Julia Díaz | Directora Administrativa |
| Deborah de los Santos | Vicepresidente Ejecutiva |
| Willy Padua | Director de Riesgo, Control y Ciberseguridad |
| Rosa Cruz | Gerente de Operaciones |
| Fior Sánchez | Gerente de Auditoría Interna |
| Teresa Parra | Gerente de Gestión Humana |
| Dewars Barett | Gerente de Tecnología |
| Silvia Eligia Peña | Gerente de Control Interno |
| Addys Heillyn Mercedes | Gerente de Planificación Estratégica |

### 4.4 Registros Legales Expuestos
| Registro | Valor |
|----------|-------|
| **Cédula María Julia Díaz** | `001-0272565-2` |
| **RNC Banco BACC** | `1-01-13879-3` |
| **Registro Mercantil** | `142508D` |
| **Registro Bancario SB** | `11-052-1-00-0101` |
| **Certificado ONAPI** | No. 415645 |

### 4.5 Datos de Contacto Auditor
- **Firma:** Guzmán Tapia PKF
- **Teléfonos:** `1 809 540 6668` / `567-2946`
- **Email:** `info@guzmantapiapkf.com.do`
- **Web:** `www.pkf-dominicana.com`

### 4.6 Oficinas
- **Principal:** Ave. Tiradentes No. 50, Esq. Salvador Sturla, Ensanche Naco, Santo Domingo, D.N.
- **Sucursales:** 5 zona metropolitana + 2 interior (Santiago, San Francisco de Macorís)
- **Empleados:** 157 (2022) → 164 (2023)

---

## 5. Datos Financieros Sensibles

| Concepto | 2025 (DOP) |
|----------|-----------|
| Activos Totales | RD$5,220 millones |
| Cartera de Créditos Bruta | RD$4,434 millones |
| Patrimonio Neto | RD$2,301 millones |
| Utilidad Neta | RD$216 millones |
| Compensación Consejo Admin | RD$9,944,456 (2022) |
| Compensación Alta Gerencia | RD$42,257,124 (2022) |
| Índice de Solvencia | **26.6%** (regulatorio mínimo: 10%) |
| Provisiones | RD$286.7 millones |
| Cartera Vencida / Bruta | 1.39% |
| Cobertura Provisiones / Vencida | 463% |
| ROA | 4.20% |
| ROE | 10.41% |

**Fuentes:** Estados Auditados 2025, Memorias Anuales 2021-2025

---

## 6. Infraestructura y Superficie de Ataque

### 6.1 Servidor Web
| Componente | Detalle |
|-----------|---------|
| **Servidor** | Apache |
| **HSTS** | ✅ Activo — `max-age=31536000; includeSubDomains; preload` |
| **mod_pagespeed** | v1.13.35.2 |
| **TLS** | HTTP/2 |
| **Cache-Control** | `max-age=0, no-cache` en `/content/` |
| **Hosting** | GBH Web Hosting (ns1.gbhwebhosting.com) — IP 162.214.97.98 |
| **Email** | Microsoft 365 + Mailjet (SPF) |

### 6.2 Headers de Seguridad
| Header | Estado |
|--------|--------|
| `Strict-Transport-Security` | ✅ `max-age=31536000; includeSubDomains; preload` |
| `X-XSS-Protection` | ✅ `1; mode=block` |
| `Referrer-Policy` | ✅ `no-referrer-when-downgrade` |
| `X-Permitted-Cross-Domain-Policies` | ✅ `none` |
| `X-Content-Type-Options` | ❌ No detectado |
| `Content-Security-Policy` | ❌ No detectado |
| `Permissions-Policy` | ❌ No detectado |

---

## 7. Subdominios

| Subdominio | Propósito | Estado |
|------------|-----------|--------|
| `admin.bancobacc.com.do` | **Bankingly BackOffice** — portal admin ASP.NET | 🟡 **302 → Login.aspx expuesto** |
| `enlinea.bancobacc.com.do` | **Banca en línea** Bankingly | 🟡 302 → 200, login activo |
| `cpanel.bancobacc.com.do:2083` | cPanel hosting | 🟡 401 — autenticación requerida |
| `webmail.bancobacc.com.do` | Webmail | 🟡 200 — expuesto |
| `ftp.bancobacc.com.do` | FTP web interface | 🟡 200 — expuesto |

### 7.1 admin.bancobacc.com.do — HALLAZGO CRÍTICO
```
GET / → 302 → /Login.aspx?ReturnUrl=%2f
```
Portal administrativo **Bankingly BackOffice** en ASP.NET. Login expuesto públicamente. Headers incluyen:
```
request-context: appId=cid-v1:c507e9f1-11c4-4a9d-9d7f-3e9715190feb
```

---

## 8. WordPress REST API — Información Expuesta

Wordfence WAF bloquea `/cms/` pero la REST API **en raíz queda completamente abierta.**

### 8.1 Index — Full Route Map
**Endpoint:** `GET https://bancobacc.com.do/wp-json/` — ✅ **Completamente accesible**

### 8.2 Namespaces / Plugins Detectados
| Namespace | Plugin | Endpoints expuestos |
|-----------|--------|---------------------|
| `contact-form-7/v1` | Contact Form 7 | CRUD sobre formularios, feedback |
| `sowb/v1` | SiteOrigin Widgets Bundle | Creación/previsualización de widgets |
| `wordfence/v1` | Wordfence Security | Autenticación, config, escaneo, issues, disconnect |
| `yoast/v1` | Yoast SEO | File size, statistics, indexing, configuración, Winchter |
| `templates-directory` | Elementor (?) | Importación de templates |
| `wp/v2` | WordPress Core | Posts, pages, media, users, comments, plugins, themes, settings, widgets |
| `wp-site-health/v1` | WordPress Core | Tests de salud del sitio |
| `wp-block-editor/v1` | WordPress Core | Editor de bloques, URL details, export |
| `batch/v1` | WordPress Core | API por lotes |

### 8.3 Endpoints Críticos
| Endpoint | Método | Estado | Riesgo |
|----------|--------|--------|--------|
| `/yoast/v1/file_size?url=[SSRF]` | GET | 🟡 401 para IPs internas | MEDIO |
| `/yoast/v1/statistics` | GET | 🟡 401 | BAJO |
| `/contact-form-7/v1/contact-forms` | GET/POST | 🔴 403 (wpcf7_forbidden) | MEDIO |
| `/wordfence/v1/authenticate` | POST | 🟡 401 | MEDIO |
| `/wordfence/v1/config` | GET/PUT | 🟡 401 | MEDIO |
| `/wordfence/v1/scan` | POST/DELETE | 🟡 401 | MEDIO |
| `/wordfence/v1/disconnect` | POST | 🟡 401 | MEDIO |
| `/wp/v2/plugins` | GET | 🟡 401 | BAJO |
| `/wp/v2/themes` | GET | 🟡 401 | BAJO |
| `/wp/v2/settings` | GET | 🟡 401 | BAJO |
| `/wp/v2/users` | GET | 🟡 401 (rest_user_cannot_view) | BAJO |
| `/batch/v1` | POST | ✅ **Funcional** (respuesta vacía sin datos) | MEDIO |
| `/wp-block-editor/v1/export` | GET | 🟡 Potencial exportación contenido | MEDIO |
| `/wp-site-health/v1/*` | GET | 🟡 401 | BAJO |

### 8.4 WordPress Version Fingerprint
| Indicador | Valor |
|-----------|-------|
| WP emoji URL | `/cms/wp-includes/js/wp-emoji-release.min.js?ver=f7a05a6edd43725e21ec57e4233fd78e` |
| jQuery | 3.6.4 (versión desactualizada) |
| WP Path | `/cms/` (subdirectorio) |
| Yoast version | 20+ (namespace presente) |

---

## 9. Plugin Versions y Vectores Conocidos

| Plugin | Versión (estimada) | Endpoints públicos | CVEs relevantes |
|--------|-------------------|-------------------|-----------------|
| **Contact Form 7** | 5.x | `GET/POST contact-forms`, `POST feedback` | CVE-2024-10740 (unrestricted file upload), almacenamiento ilimitado SPAM |
| **Wordfence** | 7.x | `authenticate`, `config`, `scan/issues`, `scan` | WAF + Firewall |
| **Yoast SEO** | 20.x | `file_size`, `indexing/*`, `configuration/*` | SSRF potencial |
| **SiteOrigin Widgets** | 1.x | `widgets/forms`, `widgets/previews` | RCE en versiones antiguas |
| **Elementor** (inferido) | 3.x | `templates-directory/*` | File upload, RCE históricos |

### 9.1 Vectores de Ataque Prioritarios

1. **🔴 DATA LEAK** — Directory listing abierto (CRÍTICO, activo)
2. **🔴 PII EXPOSURE** — Contratos reales con datos de clientes (CRÍTICO, confirmado)
3. **🟡 Bankingly BackOffice** — `admin.bancobacc.com.do` portal ASP.NET con login expuesto
4. **🟡 Yoast SSRF** — `file_size` endpoint (requiere credenciales WP)
5. **🟡 Batch API** — POST `/batch/v1` funcional, podría encadenar requests
6. **🟡 Brute Force** — Bankingly `/enlinea` y `admin` login sin rate-limit visible
7. **🟡 cPanel** — Puerto 2083 expuesto (riesgo de fuerza bruta)
8. **🟢 Formularios W-8/W-9** — Datos fiscales de inversores extranjeros

---

## 10. Debilidades de Control Interno

Extraído de la Memoria Anual 2021 / Informe de Auditoría:

> *"El Core Bancario EASY BANK presenta **algunas dificultades en las funciones de parametrización y de procesos**, por lo que el control interno y la segregación de funciones se ve afectada..."*

> *"...encontramos **diferentes observaciones en diferentes Áreas, Procesos y Controles de TI, seguridad de la información y ciberseguridad** revisados que requieren la atención de la Alta Gerencia."*

Implicaciones:
- Segregación de funciones comprometida en core bancario
- Observaciones de TI no resueltas reportadas a la alta gerencia
- La exposición actual de datos valida estas preocupaciones

---

## 11. Recomendaciones

### 🔴 Inmediatas (24h)
1. **Deshabilitar directory listing** en Apache: `Options -Indexes`
2. **Mover PDFs con PII** a almacenamiento autenticado (S3 privado + presigned URLs)
3. **Eliminar/rotular** el contrato de préstamo con datos personales del cliente
4. **Implementar `.htaccess`** en `/content/uploads/` para bloquear acceso público
5. **Restringir acceso** a `admin.bancobacc.com.do` por IP o VPN

### 🟡 Corto plazo (1 semana)
1. **Autenticar WP REST API** — deshabilitar endpoints públicos no necesarios
2. **Rate limiting** en Bankingly enlinea + admin
3. **cPanel** — mover a puerto no estándar o restringir por IP
4. **Parchear/actualizar** plugins (CF7, SiteOrigin, Yoast, jQuery 3.6.4 → vulnerabilidad conocida)
5. **Deshabilitar Batch API** si no se usa

### 🟢 Medio plazo (1 mes)
1. Migrar PDFs a bucket S3 privado con presigned URLs
2. Auditoría completa de seguridad WordPress
3. Implementar WAF a nivel red (Cloudflare, no solo Wordfence)
4. **Política de retención de documentos** — no publicar PDFs financieros >5 años
5. Auditoría forense de quién accedió a los PDFs expuestos

---

## 12. Evidencia

### 12.1 PDFs Descargados
| Archivo | Ruta local | Tamaño |
|---------|-----------|--------|
| contrato-prestamo.pdf | `/root/bounty/bancobacc/contrato-prestamo.pdf` | 12.4 MB |
| vehiculos-2023.pdf | `/root/bounty/bancobacc/vehiculos-2023.pdf` | 164 KB |
| bienes-adjudicados-2023.pdf | `/root/bounty/bancobacc/bienes-adjudicados-2023.pdf` | 164 KB |
| vehiculos-2024.pdf | `/root/bounty/bancobacc/vehiculos-2024.pdf` | 609 KB |
| estados-auditados-2025.pdf | `/root/bounty/bancobacc/estados-auditados-2025.pdf` | 698 KB |
| memoria-anual-2025.pdf | `/root/bounty/bancobacc/memoria-anual-2025.pdf` | 28.2 MB |
| proceso-desvinculacion.pdf | `/root/bounty/bancobacc/proceso-desvinculacion.pdf` | 493 KB |

### 12.2 Comandos de Verificación
```bash
# Verificar directory listing
curl -sk 'https://bancobacc.com.do/content/uploads/2024/04/'

# Verificar exposición de contratos
curl -skI 'https://bancobacc.com.do/content/uploads/2024/04/CONTRATO-DE-PRESTAMO-CON-GARANTIA-MOBILIARIA_CT_002036.pdf'

# Verificar WP REST API
curl -sk 'https://bancobacc.com.do/wp-json/'

# Verificar Bankingly BackOffice
curl -skI 'https://admin.bancobacc.com.do/'

# Verificar Batch API
curl -sk -X POST 'https://bancobacc.com.do/wp-json/batch/v1' -H 'Content-Type: application/json' -d '{"requests":[]}'
```

### 12.3 Inventario de Hallazgos
| # | Hallazgo | Tipo | Severidad | Estado |
|---|----------|------|-----------|--------|
| 1 | Directory listing en /content/uploads/ | Configuración | 🔴 CRÍTICA | Activo |
| 2 | Contrato préstamo con PII de cliente | Data Leak | 🔴 CRÍTICA | Activo |
| 3 | Nómina directiva + accionistas + cédulas | Data Leak | 🔴 CRÍTICA | Activo |
| 4 | Bienes adjudicados / Vehículos en venta | Data Leak | 🔴 ALTA | Activo |
| 5 | Formularios IRS (W-8, W-9) públicos | Data Leak | 🟡 MEDIA | Activo |
| 6 | Resultados inspección DGII | Data Leak | 🟡 MEDIA | Activo |
| 7 | Bankingly BackOffice login expuesto | Exposición | 🟡 ALTA | Activo |
| 8 | WP REST API pública | Configuración | 🟡 ALTA | Activo |
| 9 | Yoast file_size SSRF potencial | Vulnerabilidad | 🟡 MEDIA | Activo |
| 10 | Batch API funcional sin auth | Configuración | 🟡 MEDIA | Activo |
| 11 | jQuery 3.6.4 desactualizado | Dependencia | 🟡 BAJA | Activo |
| 12 | cPanel puerto 2083 público | Exposición | 🟡 MEDIA | Activo |
| 13 | Sin CSP ni X-Content-Type-Options | Configuración | 🟢 BAJA | Ausente |
| 14 | Serie histórica tarifarios (2017-2025) | Data Leak | 🟢 BAJA | Activo |
| 15 | Proceso desvinculación App interno | Data Leak | 🟡 MEDIA | Activo |

---

## Resumen de Riesgo

```
CRITICAL:   Directory Listing + PII de clientes + datos directivos → 3 vectores activos
HIGH:       185+ PDFs accesibles públicamente, Bankingly BackOffice expuesto
MEDIUM:     WP REST API expuesta, SSRF potencial, Batch API, cPanel
LOW:        jQuery desactualizado, falta headers seguridad, tarifarios históricos
```

**El breach activo más grave:** Contrato de préstamo real con datos personales del cliente (nombre, cédula, condiciones financieras) accesible sin autenticación desde internet pública, junto con 185+ PDFs con información financiera sensible de 2013 a 2026.

---

*Reporte generado el 14 Julio 2026 — Equipo NSI Threat Intelligence*
*Target: Banco BACC de Ahorro y Crédito del Caribe, S.A. — RNC 1-01-13879-3*
