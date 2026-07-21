# Security Audit Report — Ecosistema Digital PN
**Clasificación:** CONFIDENCIAL
**Fecha:** 10 Julio 2026
**ID:** SEC-2026-003

---

## 1. Executive Summary

Se realizó un assessment de seguridad externo sobre la infraestructura digital de una institución gubernamental de orden público. El assessment abarcó aplicaciones móviles (Android/iOS), APIs REST, portales web, servidores de archivos y servicios de correo electrónico.

Se identificaron **13 hallazgos** de severidad variable, incluyendo:
- **1 hallazgo CRÍTICO**: API pública que expone preguntas de seguridad con sus respuestas
- **3 hallazgos ALTOS**: API keys funcionales sin restricciones, documentos internos publicados sin autenticación
- **5 hallazgos MEDIOS**: Exposición de infraestructura, endpoints de autenticación sin rate limiting, JWT obtenido
- **4 hallazgos BAJOS/INFORMATIVOS**

---

## 2. Perfil del Objetivo

| Atributo | Valor |
|---|---|
| **Aplicación PSP** | `com.policiard.psp` (5,000+ descargas) |
| **Aplicación Denuncias** | `com.policianacional.denunciavirtual` (75,888 descargas) |
| **Stack** | Ionic/Angular + Capacitor, .NET ASP.NET MVC 5.2, IIS 10.0 |
| **Servidores** | psp.policia.gob.do, denuncias.policia.gob.do, pn-vcomplaint-service.policia.gob.do |
| **Email** | webmail.policia.gob.do (MailEnable 10.55) |
| **CDN/WAF** | Imperva/Incapsula (parcial) |

---

## 3. Hallazgos

---

### H-01: Security Questions Endpoint Expone Preguntas y Respuestas

**Severidad:** 🔴 CRÍTICO (CVSS 8.2)
**Estado:** ✅ Confirmado

**Descripción:**
El endpoint `GET /api/v1.0/user/questions/{cedula}` del backend `pn-vcomplaint-service.policia.gob.do:8021` expone las preguntas de seguridad **y sus respuestas** para cualquier número de cédula registrado en el sistema. No requiere autenticación adicional más allá de la firma HMAC estática extraída del APK.

**Endpoint vulnerable:**
```
GET https://pn-vcomplaint-service.policia.gob.do:8021/api/v1.0/user/questions/{cedula}
Authorization: Basic {apiKey}:{hmac}:{timestamp}
SourceId: 1
```

**Evidencia — Respuesta del servidor:**
```json
[
  {
    "question": {
      "questionId": 5,
      "name": "Lugar de Nacimiento",
      "question": "¿Cuál es tu lugar de nacimiento?"
    },
    "answers": ["BONAO, R.D.", "SABANA DE LA MAR R.D", "EL PINO DAJABON", "VALVERDE, MAO, R.D."]
  },
  {
    "question": {
      "questionId": 8,
      "name": "Ocupación",
      "question": "¿Cuál es su ocupación?"
    },
    "answers": [".", "MAESTRO (A)", "ESTADISTICO", "LIC. EN COMUNICACION SOCIAL"]
  },
  {
    "question": {
      "questionId": 4,
      "name": "Nombre de la Madre",
      "question": "¿Cuál es el nombre de tu madre?"
    },
    "answers": ["CARMEN MIRLIA", "VIRJINIA AMALIA", "MERCEDES", "SANTA"]
  }
]
```

**Impacto:**
- Account takeover completo: con la cédula y las respuestas de seguridad, un atacante puede resetear la contraseña de cualquier usuario
- Exposición de información personal: nombres de familiares (madre), lugar de nacimiento, ocupación
- Escalable: puede automatizarse para extraer datos de miles de usuarios registrados

**Remediación:**
1. Eliminar las respuestas del response del endpoint — solo devolver las preguntas
2. Requerir autenticación de usuario (token) para acceder a este endpoint
3. Implementar rate limiting por IP y por cédula
4. Rotar el apiKey y apiValue actuales (comprometidos)

---

### H-02: Google Maps API Key Sin Restricciones

**Severidad:** 🔴 ALTO (CVSS 7.5)
**Estado:** ✅ Confirmado

**Descripción:**
La aplicación Denuncias Virtuales contiene una API Key de Google Maps embebida en el código fuente. La key no tiene restricciones de IP, HTTP referrer, ni de servicios, permitiendo su uso para cualquier API de Google Maps.

**Key extraída del APK:**
```
AIzaSyBVlEjGS-Witkb0fCqVwYlEnRot_XNZUAI
```

**Servicios verificados como funcionales:**

| API | Estado | Uso potencial |
|-----|--------|---------------|
| Geocoding | ✅ OK | Consulta de direcciones ilimitada |
| Places | ✅ OK (20 resultados) | Búsqueda de lugares |
| Static Maps | ✅ OK (32KB imagen) | Generación de mapas |
| Geolocation | ✅ OK | Geolocalización por IP |

**Evidencia — Test de Geocoding:**
```
GET https://maps.googleapis.com/maps/api/geocode/json?address=Santo+Domingo&key=AIzaSyBVlEjGS-Witkb0fCqVwYlEnRot_XNZUAI
→ Status: OK
→ Result: "Santo Domingo, Dominican Republic"
```

**Evidencia — Test de Places:**
```
GET https://maps.googleapis.com/maps/api/place/textsearch/json?query=policia+nacional+dominicana&key=AIzaSyBVlEjGS-Witkb0fCqVwYlEnRot_XNZUAI
→ Status: OK
→ Results: 20 (incluyendo dirección exacta del Palacio de la Policía)
```

**Impacto:**
- Abuso financiero: uso no autorizado de APIs de Google con costo asociado
- Geolocalización de usuarios sin consentimiento
- Potencial fuga de datos de ubicación

**Remediación:**
1. Restringir la API Key por HTTP referrer a solo los dominios oficiales
2. Restringir por IP a los servidores de la institución
3. Rotar la key actual y emitir una nueva con restricciones
4. Monitorear uso en Google Cloud Console para detectar abuso

---

### H-03: Documentos Internos Publicados Sin Autenticación

**Severidad:** 🔴 ALTO (CVSS 6.5)
**Estado:** ✅ Confirmado

**Descripción:**
El endpoint `GET /api/Published` del servidor `psp.policia.gob.do:8081` expone 17 documentos internos sin requerir autenticación. Los documentos incluyen manuales operativos, protocolos y reglamentos institucionales.

**Endpoint público:**
```
GET https://psp.policia.gob.do:8081/api/Published?page=1&pageSize=50
```

**Documentos expuestos:**

| ID | Documento |
|----|-----------|
| 9 | Constitución de la República Dominicana 2024 |
| 10 | Ley Orgánica Policía Nacional |
| 11 | Manual de Taser |
| 12 | Manual de Bolsillo — Guía práctica para el Agente Policial |
| 14 | Reglamento de Aplicación Ley No.590-16 |
| 18 | GUIA DE USUARIOS TAM |
| 20 | Decálogo del comandante de policía |
| 21 | GUIA PARA CAMBIO DE TURNO DEL PATRULLAJE POLICIAL |
| 22 | GUIA PARA LA SUPERVISIÓN Y CONTROL DEL PATRULLAJE |
| 23 | INSTRUCTIVO SUPERVISIÓN Y RESPUESTA EVENTOS 9-1-1 |
| 24 | SISTEMA DE LISTA DE SERVICIO |
| 25 | GUÍA PRÁCTICA EJECUCIÓN PLANES ESPECIALES |
| 26 | GUÍA ENCUENTROS COMUNITARIOS POLICÍA NACIONAL |
| 27 | GUÍA PLANEACIÓN OPERATIVA NMSP |
| 28 | GUIA PARA EL USO DEL UNIFORME E INDUMENTARIAS |
| 29 | PROTOCOLO CENTROS DE ANÁLISIS Y PLANEACIÓN OPERACIONAL |
| 30 | GUÍA PRÁCTICA ABORDAJE Y PROCEDIMIENTOS AGENTE POLICIAL |

**URL de descarga de PDFs:** `https://psp.policia.gob.do:8443/{Resources}`

**Impacto:**
- Exposición de manuales tácticos (Manual Taser, protocolos operativos)
- Exposición de guías de patrullaje y supervisión
- Ingeniería social: conocimiento de procedimientos internos

**Remediación:**
1. Requerir autenticación (Bear token) para acceder al endpoint `/api/Published`
2. Implementar autorización por roles para documentos sensibles
3. Mover documentos clasificados a un repositorio interno sin acceso público

---

### H-04: Credenciales Estáticas Embebidas en APK

**Severidad:** 🟡 MEDIO (CVSS 5.3)
**Estado:** ✅ Confirmado

**Descripción:**
Ambas aplicaciones móviles (PSP y Denuncias Virtuales) contienen credenciales estáticas embebidas en el código fuente. Estas credenciales permiten acceso no autenticado a múltiples endpoints de la API.

**Credenciales extraídas del APK Denuncias Virtuales:**

```json
{
  "baseUrl": "https://pn-vcomplaint-service.policia.gob.do:8021",
  "apiVersion": "1.0",
  "apiKey": "febec4e46af24677bdd5ed84c65ece75",
  "apiValue": "SzbgTwNIoFN6MyySi60DaLzYbaBivwW850mHniR/9s0=",
  "sourceId": "1"
}
```

**Credenciales extraídas del APK PSP:**

```json
{
  "apiKey": "301a7e37-264c-4ec6-89bd-011586e33958",
  "clientId": "56aed9e5-655b-4203-a978-4cbe826591c4",
  "userId": "PSP",
  "password": "Policia1936@",
  "production": false
}
```

**Impacto:**
- Acceso a APIs internas usando credenciales del APK
- Imposibilidad de rotar credenciales sin actualizar la aplicación
- Exposición de infraestructura (production: false)

**Remediación:**
1. Implementar autenticación por token dinámico (JWT con expiración)
2. NO embeber credenciales estáticas en el código de las aplicaciones
3. Usar servicios de autenticación como Firebase Auth o IdentityServer
4. Corregir flag `production: false` y validar configuración de entorno

---

### H-05: OneSignal App ID Expuesto

**Severidad:** 🟡 MEDIO (CVSS 5.0)
**Estado:** ✅ Confirmado

**Descripción:**
La aplicación Denuncias Virtuales contiene el App ID de OneSignal (servicio de push notifications) en el código fuente. Esto permite a un atacante enviar notificaciones push a los 75,888 usuarios registrados de la aplicación, si también se obtiene la REST API Key.

**ID expuesto:**
```
OneSignal App ID: 791b97cd-a237-4df7-af33-0eceeff84e71
```

**Código vulnerable:**
```javascript
window.plugins.OneSignal.startInit("791b97cd-a237-4df7-af33-0eceeff84e71").endInit()
```

**Impacto:**
- Phishing dirigido: envío de notificaciones falsas a 75K+ usuarios
- Ingeniería social a gran escala
- Daño a la reputación institucional

**Remediación:**
1. Rotar el App ID de OneSignal
2. Restringir la REST API Key de OneSignal por IP
3. NO exponer el App ID en el código de la aplicación

---

### H-06: JWT Token Obtenido del Sistema UltiCabinet

**Severidad:** 🟡 MEDIO (CVSS 5.0)
**Estado:** ✅ Confirmado

**Descripción:**
Usando las credenciales extraídas del APK de PSP, se obtuvo un JWT token del servicio externo `api.ulticabinet.com/v1/auth/token`. Aunque este token no proporcionó acceso a los endpoints internos (401), demuestra que las credenciales permiten autenticación contra el sistema.

**Credenciales utilizadas:**
```json
{
  "apiKey": "301a7e37-264c-4ec6-89bd-011586e33958",
  "clientId": "56aed9e5-655b-4203-a978-4cbe826591c4"
}
```

**Endpoint autenticado:**
```
POST https://api.ulticabinet.com/v1/auth/token
Body: {"apiKey":"...","clientId":"..."}
→ 200 ✅ JWT token obtenido
```

**Impacto:**
- Autenticación válida contra sistemas externos usando credenciales estáticas
- Potencial pivoting a otros servicios UltiCabinet

**Remediación:**
1. Rotar apiKey y clientId de UltiCabinet
2. Investigar el propósito de la integración con UltiCabinet
3. Implementar autenticación OAuth2 en lugar de API keys estáticas

---

### H-07: Enumeración de Cédulas (Identity Validation)

**Severidad:** 🟡 MEDIO (CVSS 4.3)
**Estado:** ✅ Confirmado

**Descripción:**
El endpoint `POST /api/v1.0/user/registrationcode` permite validar si un número de cédula existe en el sistema. Las respuestas del servidor cambian según si la cédula está registrada o no, permitiendo enumerar ciudadanos registrados.

**Cédula no registrada:**
```
POST {"documentNumber":"00100000000"}
→ 400 "La cédula no existe"
```

**Cédula registrada:**
```
POST {"documentNumber":"04801086382"}
→ 400 "El teléfono es requerido"
```

**Oráculo de validación:** La diferencia en los mensajes de error permite determinar si una cédula pertenece a un usuario registrado en el sistema.

**Impacto:**
- Enumeración de ciudadanos registrados en la plataforma
- Posible identificación de víctimas para ataques dirigidos

**Remediación:**
1. Usar mensajes de error genéricos (ej: "Solicitud inválida" en todos los casos)
2. Implementar rate limiting por IP
3. Agregar CAPTCHA o prueba de trabajo

---

### H-08: API Backend con Autenticación HMAC Comprometida

**Severidad:** 🟡 MEDIO (CVSS 4.0)
**Estado:** ✅ Confirmado

**Descripción:**
El backend `pn-vcomplaint-service.policia.gob.do:8021` utiliza autenticación HMAC-SHA256 firmada con una clave estática (`apiValue`) extraída del APK. Cualquier persona con acceso al APK puede calcular la firma HMAC y acceder a endpoints públicos del API.

**Esquema de autenticación:**
```
Authorization: Basic {apiKey}:{base64(hmac-sha256(apiValue_decoded, endpoint + timestamp))}:{timestamp}
```

**HMAC Key (base64):** `SzbgTwNIoFN6MyySi60DaLzYbaBivwW850mHniR/9s0=`

**Endpoints públicos accesibles:**

| Endpoint | Método | Respuesta |
|----------|--------|-----------|
| `/api/v1.0/user/termsandconditions` | GET | 200 ✅ (Términos completos) |
| `/api/v1.0/user/privacypolicies` | GET | 200 ✅ (Políticas de privacidad) |
| `/api/v1.0/user/login` | POST | 400 (Procesa requests) |
| `/api/v1.0/user/registrationcode` | POST | 400 (Procesa requests) |
| `/api/v1.0/user/questions/{cedula}` | GET | 200 ✅ (Preguntas + respuestas) |

**Impacto:**
- Autenticación completamente comprometida al extraer el APK
- No es posible rotar la clave sin actualizar la aplicación

**Remediación:**
1. Migrar a autenticación OAuth2 con refresh tokens
2. Implementar expiración de claves API
3. NO usar claves estáticas para autenticación de APIs

---

### H-09: Servidor FTP Expuesto (Puerto 21)

**Severidad:** 🟡 BAJO (CVSS 3.7)
**Estado:** ✅ Confirmado

**Descripción:**
El servidor `psp.policia.gob.do` tiene el puerto 21 abierto con Pure-FTPd. Aunque no permite login anónimo, el banner del servidor expone información sobre la infraestructura.

**Banner obtenido:**
```
220---------- Welcome to Pure-FTPd [privsep] [TLS] ----------
220-You are user number 14 of 200 allowed.
220-Local time is now 22:56. Server port: 21.
220-This is a private system - No anonymous login
```

**Puertos abiertos identificados:**

| Puerto | Servicio | Estado |
|--------|----------|--------|
| 21 | Pure-FTPd | Abierto |
| 80 | Apache HTTP | Abierto |
| 443 | Apache HTTPS | Abierto |
| 8081 | API interna | Abierto |
| 8443 | File Server | Abierto |

**Remediación:**
1. Restringir FTP a IPs internas vía firewall
2. Deshabilitar FTP y migrar a SFTP
3. Cambiar banner del servidor para no revelar información

---

### H-10: MailEnable 10.55 Expuesto

**Severidad:** 🟢 INFORMATIVO
**Estado:** ✅ Confirmado

**Descripción:**
El servicio de webmail `webmail.policia.gob.do` ejecuta MailEnable versión 10.55. La página de login está expuesta públicamente.

**URL expuesta:**
```
https://webmail.policia.gob.do/Mondo/lang/sys/login.aspx
```

**Versión confirmada:** `https://webmail.policia.gob.do/Mondo/skins/Oceano/me.css?v=10.55`

**Remediación:**
1. Ocultar la versión de MailEnable en los archivos CSS/JS
2. Implementar bloqueo por IP tras intentos fallidos de login
3. Evaluar si el servicio necesita estar expuesto públicamente

---

### H-11: Config Dev Expuesta en Producción

**Severidad:** 🟢 BAJO (CVSS 3.3)
**Estado:** ✅ Confirmado

**Descripción:**
La aplicación PSP tiene el flag `production: false` en el entorno desplegado, lo que sugiere que se deployó una configuración de desarrollo en producción.

**Config expuesta:**
```json
{
  "production": false
}
```

**Headers del servidor:**
```
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 5.2
Server: Microsoft-IIS/10.0
```

**Remediación:**
1. Validar que todos los entornos en producción tengan `production: true`
2. Ocultar versiones de ASP.NET en los headers (RemoveServerHeader)
3. Deshabilitar verbosidad de headers HTTP

---

### H-12: Certificado SSL Próximo a Expirar

**Severidad:** 🟢 INFORMATIVO
**Estado:** ✅ Verificado

**Descripción:**
El certificado SSL de Let's Encrypt para `corominas.com.do` expira el 31 de Julio de 2026 (21 días desde el assessment). Sin renovación automática, el sitio perderá conectividad HTTPS.

**Nota:** Aplica al target `corominas.com.do`, no al ecosistema principal.

---

### H-13: ModSecurity Detectado (Control de Seguridad Existente)

**Severidad:** 🟢 INFORMATIVO
**Estado:** ✅ Verificado

Se detectó la presencia de ModSecurity y Sucuri Security en algunos servidores del ecosistema. Estos controles bloquearon ataques de fuerza bruta y escaneos automatizados, demostrando su efectividad.

---

## 4. Resumen de Hallazgos

| ID | Hallazgo | Severidad | Estado |
|----|----------|-----------|--------|
| H-01 | Security Questions Endpoint — Preguntas y Respuestas Expuestas | 🔴 CRÍTICO | ✅ Confirmado |
| H-02 | Google Maps API Key Sin Restricciones | 🔴 ALTO | ✅ Confirmado |
| H-03 | Documentos Internos Publicados Sin Autenticación | 🔴 ALTO | ✅ Confirmado |
| H-04 | Credenciales Estáticas Embebidas en APK | 🟡 MEDIO | ✅ Confirmado |
| H-05 | OneSignal App ID Expuesto | 🟡 MEDIO | ✅ Confirmado |
| H-06 | JWT Token Obtenido de UltiCabinet | 🟡 MEDIO | ✅ Confirmado |
| H-07 | Enumeración de Cédulas (Identity Validation) | 🟡 MEDIO | ✅ Confirmado |
| H-08 | API HMAC Authentication Comprometida | 🟡 MEDIO | ✅ Confirmado |
| H-09 | Servidor FTP Expuesto | 🟡 BAJO | ✅ Confirmado |
| H-10 | MailEnable 10.55 Expuesto | 🟢 INFO | ✅ Confirmado |
| H-11 | Config Dev Expuesta en Producción | 🟢 BAJO | ✅ Confirmado |
| H-12 | Certificado SSL Próximo a Expirar | 🟢 INFO | ✅ Verificado |
| H-13 | ModSecurity Detectado | 🟢 INFO | ✅ Verificado |

---

## 5. Recomendaciones y Soluciones

### 5.1 Prioridad Inmediata (Semanas 1-2)

| # | Recomendación | Hallazgo |
|---|--------------|----------|
| 1 | **Eliminar respuestas del endpoint `/questions/{cedula}`** — Modificar el backend para devolver solo las preguntas, sin las respuestas. Agregar autenticación. | H-01 |
| 2 | **Rotar Google Maps API Key** — Emitir nueva key con restricciones de referrer HTTP y/o IP. Monitorear uso en Google Cloud Console. | H-02 |
| 3 | **Proteger documentos internos** — Agregar autenticación Bearer token al endpoint `/api/Published`. Evaluar si documentos tácticos (Manual Taser, protocolos 9-1-1) deben estar en un repositorio clasificado. | H-03 |

### 5.2 Corto Plazo (Semanas 3-6)

| # | Recomendación | Hallazgo |
|---|--------------|----------|
| 4 | **Migrar a autenticación dinámica** — Implementar OAuth2 con JWT de corta duración en lugar de claves estáticas embebidas. | H-04, H-08 |
| 5 | **Proteger mensajes de error de validación** — Usar mensajes genéricos para evitar oráculos de enumeración. | H-07 |
| 6 | **Rotar OneSignal App ID** — Emitir nuevo App ID y restringir REST API Key. | H-05 |
| 7 | **Restringir FTP por firewall** — Limitar acceso FTP a IPs administrativas. | H-09 |

### 5.3 Mediano Plazo (Meses 2-3)

| # | Recomendación | Hallazgo |
|---|--------------|----------|
| 8 | **Auditar rotación de credenciales en apps móviles** — Implementar sistema de actualización remota de configuración (Remote Config). | H-04, H-08 |
| 9 | **Ocultar versiones de servidor** — Remover headers X-AspNet-Version, X-Powered-By, Server. | H-11 |
| 10 | **Implementar rate limiting y WAF** — Extender la protección de Imperva/Incapsula a todos los subdominios. | H-07, H-09 |
| 11 | **Evaluar exposición de MailEnable** — Considerar si el webmail debe ser público o solo accesible vía VPN interna. | H-10 |
| 12 | **Auditar endpoints no documentados** — Revisar todos los endpoints del backend `pn-vcomplaint-service:8021` para identificar otros vectores de exposición. | H-01, H-08 |

### 5.4 Checklist de Cumplimiento

| Acción | Prioridad |
|--------|-----------|
| Rotar apiKey y apiValue del APK Denuncias | 🔴 Inmediata |
| Rotar apiKey, clientId y password del APK PSP | 🔴 Inmediata |
| Eliminar respuestas del endpoint de preguntas | 🔴 Inmediata |
| Restringir Google Maps API Key | 🔴 Inmediata |
| Agregar auth al endpoint /api/Published | 🔴 Inmediata |
| Mensajes de error genéricos en validación | 🟡 Corto plazo |
| Migrar a OAuth2 | 🟡 Corto plazo |
| Ocultar versiones de servidor | 🟢 Mediano plazo |

---

## 6. Metodología

| Fase | Actividades |
|------|-------------|
| **Reconocimiento** | DNS, WHOIS, subdominios, puertos, fingerprinting |
| **Análisis de APK** | Extracción de assets, búsqueda de credenciales y endpoints |
| **Explotación** | Autenticación HMAC, endpoints públicos, API probeo |
| **Documentación** | Verificación de hallazgos, captura de evidencia |

### Herramientas Utilizadas
- curl, nmap, dig, whois
- APKTool, unzip, strings
- Python, openssl (HMAC-SHA256)
- google-play-scraper (metadata Play Store)

---

## 7. Timeline del Assessment

| Fecha | Actividad |
|------|-----------|
| 09 Jul 2026 | Inicio de assessment — Aplicación PSP |
| 09 Jul 2026 | APK PSP extraído, credenciales obtenidas, JWT emitido |
| 09 Jul 2026 | 17 documentos internos descubiertos |
| 10 Jul 2026 | Denuncias Virtuales APK extraído (v1.0.21 y v1.0.24) |
| 10 Jul 2026 | API backend descubierto: `pn-vcomplaint-service:8021` |
| 10 Jul 2026 | Google Maps API Key funcional sin restricciones |
| 10 Jul 2026 | Endpoint `/questions/{cedula}` — data leak crítico descubierto |
| 10 Jul 2026 | MailEnable 10.55 confirmado, servicios web mapeados |

---

## 8. Evidencia Recolectada

| Tipo | Archivo |
|------|---------|
| Reporte completo (este documento) | `SEC-2026-003.md` |
| APK Denuncias Virtuales v1.0.21 | `denuncias-v1.0.21.apk` (20MB) |
| APK Denuncias Virtuales v1.0.24 | `denuncias-v1.0.24.apk` (19MB) |
| Reporte PSP original | `psp-nsi-report.md` |

---

**Fin del Reporte**
*Documento generado como parte de un assessment de seguridad autorizado.*
