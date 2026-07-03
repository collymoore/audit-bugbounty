# 🔒 Auditoría de Seguridad Externa — Banco BACC
## Informe Ejecutivo para Alta Gerencia y CISO

**Clasificación:** CONFIDENCIAL
**Fecha:** 01 Julio 2026
**Objetivo:** bancobacc.com.do
**Tipo:** Black-box (sin credenciales)
**Duración:** 2 sesiones (29 Jun - 01 Jul 2026)

---

## 1. Resumen de Riesgo

| Métrica | Valor |
|---------|-------|
| **Riesgo General** | 🔴 **CRÍTICO** |
| Hallazgos Críticos | 3 |
| Hallazgos Altos | 7 |
| Hallazgos Medios | 8 |
| Hallazgos Informativos | 3 |
| **Total Hallazgos** | **21** |
| CVEs Identificados | 21 adicionales en plugins |
| **Exposición Total** | **37 issues de seguridad** |

### Impacto al Negocio

Banco BACC presenta **múltiples vulnerabilidades críticas** que exponen:

- **Datos de clientes** a través de directory listing con más de 105 archivos (PDFs + CSVs) expuestos públicamente
- **Infraestructura interna** revelada vía Dockerfile y metadata de documentos
- **Potencial de compromiso total del sitio web** via cPanel expuesto (ahora mitigado — puerto no responde)
- **Ataques de phishing dirigido** vía Open Redirect en formulario de contacto
- **Clickjacking** en la plataforma de banca en línea

---

## 2. Hallazgos Críticos — Acción Inmediata Requerida

### 🔴 BACC-01: Infraestructura de Administración Expuesta
**Riesgo:** Acceso no autorizado al panel de control del hosting
**Impacto:** Compromiso total del sitio web, defacement, robo de datos
**Estado:** Puerto 2083 actualmente no responde (posible mitigación reciente)

### 🔴 BACC-02: Directorio de Uploads con Listado Público
**Riesgo:** Exposición de documentos internos del banco (2017-2026)
**Impacto:** Fuga de información sensible de empleados, operaciones y clientes
**Evidencia:** 105 archivos (95 PDFs + 4 CSVs, 412 MB)
**Datos expuestos:** Nombres de empleados, metadatos con rutas internas de Windows

### 🔴 BACC-03: Dockerfile Expuesto
**Riesgo:** Revelación de configuración interna del servidor
**Impacto:** Fingerprinting de infraestructura, posibles credenciales embedidas

---

## 3. Riesgos Altos

### 🟡 BACC-04/17-37: WordPress Severamente Desactualizado
**6 plugins vulnerables** con **21 CVEs documentados:**

| Plugin | Versión | Última | CVEs | Riesgo Principal |
|--------|---------|--------|------|------------------|
| Contact Form 7 | 5.7.7 | 6.1.6 | 4 | File Upload, Open Redirect |
| Page Builder SiteOrigin | 2.25.0 | 2.34.5 | 6 | **Local File Inclusion**, Stored XSS |
| Yoast SEO | 20.12 | 27+ | 6 | Stored XSS, **IDOR Information Exposure** |
| WP Mail SMTP | 3.8.2 | 4.9.0 | 1 | **SMTP Password Exposure** |
| Duplicate Post | 4.5 | — | 1 | Arbitrary Post Duplication |
| Custom Post Type UI | 1.13.7 | — | 1 | Unauthenticated Post Type Modification |

### 🟡 BACC-05: REST API de WordPress Expuesta
Permite enumeración de contenido y usuarios (parcialmente bloqueada por Wordfence)

### 🟡 BACC-06: SSRF Potencial vía Yoast SEO
Tres endpoints accesibles con autenticación — riesgo de escaneo de red interna

### 🟡 BACC-11: Enumeración de Usuarios vía cPanel
El panel de control revela si un usuario existe mediante respuesta diferencial

---

## 4. Riesgos Medios

| ID | Hallazgo | Impacto |
|----|----------|---------|
| BACC-07 | Clickjacking en banca en línea | Suplantación de interfaz bancaria |
| BACC-08 | Sin Content-Security-Policy | XSS, data exfiltración |
| BACC-13 | WordPress 6.2.6 obsoleto | 2 CVEs conocidos sin parche |
| BACC-14 | mod_pagespeed expuesto | Fingerprinting, info disclosure |
| BACC-15 | WP-Cron accesible externamente | Potencial DoS |

---

## 5. Línea de Tiempo de Remediación

| Prioridad | Acción | Tiempo Estimado |
|-----------|--------|-----------------|
| 🔴 **Inmediato** | Deshabilitar directory listing en /content/uploads/ | 1 hora |
| 🔴 **Inmediato** | Actualizar WordPress 6.2.6 → última versión estable | 4 horas |
| 🔴 **Inmediato** | Actualizar Contact Form 7 (5.7.7 → 6.1.6) | 1 hora |
| 🔴 **Inmediato** | Actualizar Page Builder SiteOrigin (2.25.0 → 2.34.5) | 2 horas |
| 🟡 **Corto plazo** | Actualizar Yoast SEO (20.12 → última) | 2 horas |
| 🟡 **Corto plazo** | Actualizar WP Mail SMTP (3.8.2 → 4.9.0) | 1 hora |
| 🟡 **Corto plazo** | Implementar X-Frame-Options en banca en línea | 30 min |
| 🟠 **Mediano plazo** | Implementar Content-Security-Policy | 4 horas |
| 🟠 **Mediano plazo** | Remediación de plugins restantes | 2 horas |
| ℹ️ **Monitoreo** | Auditoría periódica de plugins y versiones | Continuo |

---

## 6. Recomendaciones Estratégicas

1. **Actualización inmediata** de todos los plugins de WordPress (6 de 8 están desactualizados)
2. **Implementar WAF a nivel de aplicación** además de Wordfence (Cloudflare, Sucuri)
3. **Deshabilitar directory listing** en servidor web (Apache)
4. **Política de seguridad de contenido (CSP)** para prevenir XSS y data exfiltración
5. **Segmentación de red** — separar WordPress del hosting compartido
6. **Auditoría de seguridad trimestral** con pruebas de penetración externas

---

*Informe generado por NSI LLC — Null Session Intelligence*
*Clasificación: CONFIDENCIAL — Solo para distribución interna*
