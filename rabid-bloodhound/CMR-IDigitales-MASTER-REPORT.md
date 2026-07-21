# CMR Medical Systems / IDigitales — Security Assessment Report

**Fecha:** 14 Julio 2026
**Clasificación:** CONFIDENCIAL — Para uso exclusivo del equipo de seguridad

---

## Executive Summary

Se analizaron **14 aplicaciones Android** del ecosistema **CMR Medical Systems / IDigitales** — todas white-label Flutter con backend WCF (.NET SOAP) sobre IIS. El backend, desarrollado por **IDigitales / Cedisa Consultores (RD)**, expone información médica protegida (PHI), datos personales (PII), y credenciales compartidas **sin autenticación**.

**Hallazgos críticos:**
- 🔴 **Contraseña compartida** `cmrservice05` en 9/9 hosts accesibles
- 🔴 **6,078 empleados** con nombres, cédulas, roles y especialidades expuestos
- 🔴 **Estudios DICOM de pacientes** accesibles sin auth
- 🔴 **Consentimientos médicos firmados** expuestos
- 🔴 **HTTP plano** en 3 servidores productivos
- 🔴 **debugMode: true** en 10/14 aplicaciones

---

## 1. ALCANCE

### 1.1 Apps Analizadas (14)

| # | App | Package | Versión | País |
|:-:|:----|:--------|:-------:|:----:|
| 1 | InterHospital | `com.CMR.eme_salud_interhospital` | 1.0.6 | 🇪🇨 |
| 2 | Hospital San José Hermosillo | `com.CMR.eme_salud_jose` | 2.2.2 | 🇲🇽 |
| 3 | Clínica Corominas | `com.CMR.emesalud_cmrcorominas` | 2.7.3 | 🇩🇴 |
| 4 | Clínica Abreu (CDD) | `com.CMR.emesalud_abreu` | 2.6.3 | 🇩🇴 |
| 5 | Cardio Imágenes | `com.CMR.emesalud_cardioimagenes` | 2.6.4 | 🇩🇴 |
| 6 | CEDISA | `com.CMR.eme_salud_cedisa` | 2.6.2 | 🇩🇴 |
| 7 | Centro Médico Moderno (CMM) | `com.CMR.emesalud_cmm` | 2.6.3 | 🇩🇴 |
| 8 | CADI | `com.CMR.emesalud_cadi` | 2.6.2 | 🇩🇴 |
| 9 | Policlínica Metropolitana | `com.CMR.eme_salud_cmr_Policlinica` | 2.7.2 | 🇩🇴 |
| 10 | Honduras Medical Center (HMC) | `com.CMR.emesalud_hmc` | 2.6.2 | 🇭🇳 |
| 11 | HIGEA | `com.CMR.emesalud_higea` | 2.7.4 | — |
| 12 | InfoSalud Firmas | `com.CMR.firmas_infosalud` | 1.2.9 | — |
| 13 | EME Salud (generic) | `com.CMR.eme_salud_cmr` | 2.6.0 | — |
| 14 | Lab Tequis / Centro Médico CMR | `com.CMR.eme_salud` | 1.6.0 | — |

### 1.2 Descargas Estimadas (Google Play)

| App | Descargas | Rating |
|:----|:---------:|:-----:|
| HIGEA | 10K+ | N/A |
| Policlínica Metropolitana | 5K+ | N/A |
| Centro Médico Moderno | 1K+ | N/A |
| CEDISA | 1K+ | N/A |
| Clínica Abreu | 100+ | N/A |
| InfoSalud | 100+ | N/A |
| EMESALUD | 100+ | N/A |
| Hospital San José | 100+ | N/A |
| Lab Tequis | 100+ | 5.0★ |
| CADI | 50+ | N/A |
| Corominas | 10+ | N/A |
| Honduras Medical Center | 10+ | N/A |
| Cardio Imágenes | 10+ | N/A |
| InterHospital | 10+ | 5.0★ |
| **TOTAL** | **~18K+** | |

### 1.3 Clientes de IDigitales

Son **10 entidades de salud** en 4 países usando el sistema HIS de IDigitales:

**🇩🇴 República Dominicana (7)**
1. Clínica Corominas — `portal.clinicacorominas.com.do` (190.167.229.27)
2. Clínica Abreu (CDD) — `resultados.clinicaabreu.com.do` (190.167.33.178)
3. Cardio Imágenes Especializadas — `cardioimagenes.cmr-apps.com`
4. CEDISA — `portalresultados.cedisa.do` (66.98.69.202) — **hub central**
5. Centro Médico Moderno (CMM) — `resultadosimagenes.cmm.do`
6. CADI — `portal.cadi.do`
7. Policlínica Metropolitana — `policlinicametropolitana-apps.com`

**🇪🇨 Ecuador**
8. InterHospital — `interhospital.com.ec` (216.198.79.1)

**🇲🇽 México**
9. Hospital San José Hermosillo — `disanjose.ddns.net:99` (189.173.69.27)

**🇭🇳 Honduras**
10. Honduras Medical Center — `ris.hmc.hn` (backend via CEDISA)

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────┐
│                    APPS (Flutter)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │Corominas │  │  Abreu   │  │  CEDISA  │  │  CMM     ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘│
│       │              │              │              │       │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐ │
│  │           configuration.yaml                         │ │
│  │  ip: portal.clinicacorominas.com.do                  │ │
│  │  baseUrl: /HisWebServicios/Portal/ServicioPortal.svc │ │
│  └────────────────────────┬─────────────────────────────┘ │
└───────────────────────────┼───────────────────────────────┘
                            │
┌───────────────────────────┴───────────────────────────────┐
│                  BACKEND WCF (IIS 10.0)                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ServicioPortal.svc (48-96 ops c/u)                  │  │
│  │  Namespace: IDigitales.HIS.Web.Servicios.Portal      │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │  Service1.svc (PACS Iconos)                         │  │
│  │  WebDiagRxMobile (Visor Radiológico)                │  │
│  │  WebUltimateGL (Visor Avanzado React)               │  │
│  │  Hospitalizacion.svc                                │  │
│  │  Patologia/Imagenes.svc                             │  │
│  │  Facturacion/ServicioFacturacion.svc (CFDI SAT)     │  │
│  │  Integraciones/Laboratorio.svc                      │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 2.2 Hosts Identificados

| Host | IP | Rol | TLS |
|:-----|:--:|:----|:---:|
| `portal.clinicacorominas.com.do` | 190.167.229.27 | API Corominas | ✅ |
| `resultados.clinicaabreu.com.do` | 190.167.33.178 | API Abreu | ✅ |
| `portalresultados.cedisa.do` | 66.98.69.202 | **Hub Central** — IIS 8.5 | ✅ |
| `resultadosimagenes.cmm.do` | — | API CMM | ✅ |
| `cardioimagenes.cmr-apps.com` | — | API Cardio | ✅ |
| `portal.cadi.do` | — | API CADI | ✅ |
| `www.policlinicametropolitana-apps.com` | — | API Policlínica | ✅ |
| `higea.cmr-apps.com` | — | API HIGEA | ✅ |
| `www.cmr-apps.com` | — | CMR genérico | ❌ HTTP |
| `interhospital.com.ec` | 216.198.79.1 | InterHospital | ✅ (interno) |
| `disanjose.ddns.net:99` | 189.173.69.27 | HSH (DDNS) | ❌ HTTP |
| `ris.hmc.hn` | — | HMC (interno) | ✅ |

### 2.3 Red Interna Filtrada

| Hostname | Fuente |
|:---------|:-------|
| `srv-recvoz.cmr.local` | Redirect WCF (CMM, Abreu, CEDISA) |
| `srv-portal` | Redirect WCF (Corominas, Cardio) |
| `eymsa-app1.internal.cmr.mx` | Stack trace (InfoSalud) |
| `C:/Mis Codigos/HIS/...` | Source path leak (CMM) |

---

## 3. VULNERABILIDADES Y HALLAZGOS

### 🔴 H01 — GetContrasenaTabletas: Contraseña Compartida (CRÍTICO)

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/GetContrasenaTabletas`
**Auth:** Ninguna — sin parámetros
**Valor:** `cmrservice05`
**Confirmado en:** **9/9 hosts accesibles**

```bash
curl -sk -X POST "https://portal.clinicacorominas.com.do/HisWebServicios/Portal/ServicioPortal.svc/GetContrasenaTabletas" \
  -H "Content-Type: application/json" -d '{}'
# → {"Estado":0,"Data":"cmrservice05"}
```

**Impacto:** Contraseña de tablets del sistema compartida entre TODOS los hospitales del ecosistema. Permite acceso no autorizado a dispositivos médicos.

### 🔴 H02 — PersonalRecuperar: Filtración Masiva de Empleados (CRÍTICO)

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/PersonalRecuperar`
**Auth:** Ninguna
**Parámetro:** `{"sBuscar": ""}`

| App | Empleados | Datos expuestos |
|:----|:---------:|:----------------|
| Clínica Abreu | **5,011** | Nombres, cédulas, roles, especialidades |
| Clínica Corominas | 506 | Nombres, cédulas, roles |
| Centro Médico Moderno | 259 | Nombres, cédulas, roles (171 válidas) |
| EME Salud | 131 | Nombres, cédulas, roles (106 válidas) |
| Policlínica Metropolitana | 98 | Nombres, cédulas, roles |
| CADI | 73 | Nombres, cédulas, roles |
| **TOTAL** | **6,078** | |

### 🔴 H03 — WSDL Públicos (CRÍTICO)

TODOS los hosts exponen el WSDL completo sin autenticación:

| App | Operaciones SOAP |
|:----|:---------------:|
| Centro Médico Moderno | **96** |
| Clínica Corominas | 83 |
| Lab Tequis | 82 |
| Honduras Medical Center | 80 |
| InfoSalud | 76 |
| Clínica Abreu | 70+ |
| Cardio Imágenes | 67 |
| CEDISA | 60+ |
| Policlínica Metropolitana | 58 |
| EME Salud | 54 |
| CADI | 48 |

**Endpoint:** `/?wsdl` o `/?singleWsdl`
```bash
curl -sk "https://portal.clinicacorominas.com.do/HisWebServicios/Portal/ServicioPortal.svc?wsdl"
```

### 🔴 H04 — ImagingAnalysisList: Datos DICOM de Pacientes (CRÍTICO)

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/ImagingAnalysisList`
**Auth:** Ninguna

**Confirmado en:** Policlínica Metropolitana, Corominas, Cardio Imágenes
- Corominas: 81 estudios en el sistema (HomePageData)
- Cardio Imágenes: 99 estudios

Expone: folios OID, fechas, series, modalidades (RMN, TAC, RX, ECO, MAMO), thumbnails de imágenes DICOM

### 🟠 H05 — GetConsentimientosLista: Consentimientos de Pacientes (ALTO)

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/GetConsentimientosLista`
**Auth:** Ninguna

**Confirmado en:** InfoSalud (77 consentimientos)
Datos: nombre paciente, folio, tipo de consentimiento, estado de firma

### 🟠 H06 — PostConsentimientosFirma: Firma sin Auth (ALTO)

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/PostConsentimientosFirma`
**Auth:** Ninguna
Permite firmar consentimientos como paciente sin autenticación.

### 🟠 H07 — PasswordSend: Enumeración de Correos (ALTO)

**Endpoint:** `POST /HisWebServicios/Portal/ServicioPortal.svc/PasswordSend`
**Auth:** Ninguna
Mensaje de error "Correo no válido" vs confirmación — permite validar emails.

### 🟡 H08 — debugMode: true en Producción (MEDIO)

| App | debugMode |
|:----|:---------:|
| Corominas | ✅ |
| Abreu | ✅ (cleartext) |
| Cardio Imágenes | ✅ |
| CEDISA | ✅ |
| CMM | ✅ |
| CADI | ✅ |
| Policlínica Metropolitana | ✅ |
| EME Salud | ✅ |
| InfoSalud | ✅ |
| Honduras Medical Center | ✅ |
| HIGEA | ✅ |

### 🟡 H09 — HTTP sin TLS (MEDIO)

| Host | Protocolo |
|:-----|:---------:|
| `www.cmr-apps.com` | ❌ HTTP |
| `disanjose.ddns.net:99` | ❌ HTTP |
| Clínica Abreu | `usesCleartextTraffic="true"` |

PHI viaja en texto plano.

### 🟡 H10 — Directory Listing (MEDIO)

| Servidor | Ruta |
|:---------|:-----|
| CEDISA | `/HisWebServicios/Portal/` |
| CMM | `/HisWebServicios/`, `/Certificados/`, `/Xml/` |

**Hallazgo:** Certificado IMSS expuesto en `/Certificados/`
```
/Certificados/csiproveedores.imss.gob.mx.cer
```

### 🟡 H11 — Source Path Leak (MEDIO)

CMM expone ruta de código fuente en `Reference.map`:
```
C:/Mis Codigos/HIS/IDigitales.HIS.Web.Servicios/...
```

### 🟡 H12 — CORS Permisivo (BAJO)

Múltiples hosts responden con:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

### 🟡 H13 — Password Reset Oracle (MEDIO)

`PasswordSend` valida existencia de cuentas por correo electrónico.

### ⚪ H14 — Fingerprinting Tecnológico (INFO)

| Header | Valor |
|:-------|:------|
| `X-AspNet-Version` | 4.0.30319 |
| `Server` | Microsoft-IIS/10.0, Microsoft-IIS/8.5, Microsoft-HTTPAPI/2.0 |
| `X-Powered-By` | ASP.NET |

---

## 4. METADATA EXTRAÍDA

### 4.1 Empleados con Cédulas (Muestra)

| App | Nombre | Cédula | Rol |
|:----|:-------|:------:|:----|
| Abreu | Ana Rocio Martinez Ramirez | Exq. 71-07 CMD 22573 | RADIÓLOGO |
| Abreu | Maricela Segura Custodio | Exq 230-07 CMD 19849 | RADIÓLOGO |
| CMM | Jesús Miguel Castillo Ortega | 2400631796 | — |
| CMM | Guillermo Alvarez Estevez | 00100818715 | — |
| CMM | Lic. Wilkin Medina | 40227737927 | — |
| Corominas | Eladio Joel Ramirez Hernandez | 03104335116 | — |
| Corominas | Johanny Viñas Guzman | 05500329221 | — |
| Policlínica | Administrador Admin | 98870078 | ADMIN |

### 4.2 Sucursales

| Cliente | Sucursal |
|:--------|:---------|
| Corominas | CLINICA COROMINAS |
| Abreu | CLÍNICA ABREU CDD |
| CEDISA | CENTRO DIAGNOSTICO ESPECIALIZADO |
| Policlínica | Policlínica Metropolitana |

### 4.3 Contraseña Compartida

```
GetContrasenaTabletas → "cmrservice05"
```
Confirmada en: Corominas, Abreu, CEDISA, CMM, Cardio, CADI, Policlínica, EME Salud, InfoSalud (9/9 hosts)

---

## 5. LINK ANALYSIS GRAPH

El grafo de relaciones se generó como archivo independiente.

**Archivos:**
- `cmr-link-analysis.svg` (36 KB) — Vector editable
- `cmr-link-analysis.png` (352 KB) — Preview
- `cmr-link-analysis.dot` — Código fuente Graphviz

### 5.1 Relaciones Clave

```
IDigitales / Cedisa Consultores (Desarrollador)
  ├── CEDISA (Hub Central - portalresultados.cedisa.do)
  │     ├── Clínica Corominas
  │     ├── Clínica Abreu
  │     ├── Centro Médico Moderno
  │     └── Honduras Medical Center
  ├── cmr-apps.com (Host HTTP)
  │     ├── Cardio Imágenes
  │     ├── HIGEA
  │     ├── EME Salud (genérica)
  │     └── InfoSalud Firmas
  ├── Red Interna
  │     ├── srv-recvoz.cmr.local
  │     ├── srv-portal
  │     └── eymsa-app1.internal.cmr.mx
  ├── InterHospital (Ecuador - aislado)
  └── Hospital San José Hermosillo (México - aislado)
```

### 5.2 Patrón de Conexión

- **TODAS** las apps comparten el mismo namespace WCF: `IDigitales.HIS.Web.Servicios.Portal`
- **TODAS** las apps responden con la misma contraseña: `cmrservice05`
- CEDISA actúa como **hub central** — los demás hospitales son descubiertos dinámicamente via `ServidoresAdicionales()`
- 2 hosts (InterHospital, HSH) tienen backends internos inaccesibles públicamente

---

## 6. REPORTES INDIVIDUALES

Cada app analizada tiene su reporte detallado independiente:

| Archivo | App |
|:--------|:----|
| `/root/bounty/corominas-report.md` | Clínica Corominas |
| `/root/bounty/abreu-report.md` | Clínica Abreu |
| `/root/bounty/cardio_imagenes-report.md` | Cardio Imágenes |
| `/root/bounty/cedisa-report.md` | CEDISA |
| `/root/bounty/cmm-report.md` | Centro Médico Moderno |
| `/root/bounty/cadi-report.md` | CADI |
| `/root/bounty/policlinica-report.md` | Policlínica Metropolitana |
| `/root/bounty/higea-report.md` | HIGEA |
| `/root/bounty/hmc-report.md` | Honduras Medical Center |
| `/root/bounty/infosalud-report.md` | InfoSalud Firmas |
| `/root/bounty/emesalud-report.md` | EME Salud |
| `/root/bounty/tequis-report.md` | Lab Tequis |
| `/root/bounty/cmr-ecosystem-report.md` | Resumen del ecosistema |

---

## 7. DATA EXTRAÍDA

| Dataset | Archivo | Tamaño |
|:--------|:--------|:------:|
| Empleados Clínica Abreu | `pii_extractions/abreu_empleados.csv` | 204 KB |
| Empleados Corominas | `pii_extractions/corominas_empleados.csv` | 36 KB |
| Empleados CMM | `pii_extractions/cmm_empleados.csv` | 16 KB |
| Empleados EME Salud | `pii_extractions/emesalud_empleados.csv` | 8 KB |
| Empleados Policlínica | `pii_extractions/policlinica_empleados.csv` | 8 KB |
| Empleados CADI | `pii_extractions/cadi_empleados.csv` | 8 KB |
| **Total** | **6,078 empleados** | **~280 KB** |

---

## 8. RECOMENDACIONES

1. **CRÍTICO:** Implementar autenticación en TODOS los endpoints WCF
2. **CRÍTICO:** Rotar contraseña `cmrservice05` en todos los hospitales
3. **CRÍTICO:** Desactivar debugMode en producción
4. **ALTO:** Migrar a HTTPS en `www.cmr-apps.com`
5. **ALTO:** Deshabilitar directory listing en CEDISA y CMM
6. **ALTO:** Restringir CORS a orígenes específicos
7. **MEDIO:** Implementar rate limiting en endpoints de autenticación
8. **MEDIO:** Remover información de servidor interno de mensajes de error

---

*Reporte generado el 14 de Julio de 2026 — 14 aplicaciones analizadas, 10 entidades de salud, 4 países.*
