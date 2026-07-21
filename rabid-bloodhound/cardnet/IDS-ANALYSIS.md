# 🔴 Análisis de Seguridad — IdentityServer4 OIDC
## Objetivo: ecommerce.cardnet.com.do:7443/agoramarket/identityserver/

**Cliente:** CardNET (Consorcio de Tarjetas Dominicanas S.A.) — Procesador de Pagos de RD  
**Fecha del análisis:** $(date +%Y-%m-%d)  
**Analista:** Hermes Agent (ATHENA Suite)  
**Severidad General:** 🔴 **CRÍTICA** — IdentityServer4 EOL + Múltiples Grant Types Inseguros + Superficie de Ataque Extensa

---

## 1. 🎯 Identificación del Activo

| Propiedad | Valor |
|---|---|
| **URL** | `https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/` |
| **Issuer** | `https://agoramarket.cardnet.com.do/identityserver` |
| **IP** | `45.223.18.139` |
| **Servidor** | `Kestrel` (ASP.NET Core) |
| **CDN/WAF** | `Imperva` (`X-CDN: Imperva`, `X-Iinfo` header presente) |
| **Certificado TLS** | GlobalSign RSA OV SSL CA 2018, válido Dic 2025 – Ene 2027 |
| **Hostname Real Interno** | `serws09.cardnet.com.do` (del CN del certificado JWKS) |

### Certificado TLS Público
```
CN=ecommerce.cardnet.com.do
O=CONSORCIO DE TARJETAS DOMINICANAS, S.A.
L=Santo Domingo, ST=Distrito Nacional, C=DO
Issuer: GlobalSign RSA OV SSL CA 2018
```

### Certificado JWKS (Firma de Tokens)
```
CN=serws09.cardnet.com.do
O=Consorcio de tarjetas Dominicanas, CardNET S.A.
OU=Soporte Tecnico
Issuer: Root-CA-CARDNET (CA interna)
```

---

## 2. 📡 Endpoints OIDC Expuestos (11 endpoints)

| Endpoint | Ruta | Exposición |
|---|---|---|
| **Authorization** | `/connect/authorize` | ✅ Público |
| **Token** | `/connect/token` | ✅ Público |
| **UserInfo** | `/connect/userinfo` | ✅ Público (requiere token) |
| **EndSession** | `/connect/endsession` | ✅ Público |
| **CheckSession iframe** | `/connect/checksession` | ✅ Público |
| **Revocation** | `/connect/revocation` | ✅ Público |
| **Introspection** | `/connect/introspect` | ✅ Público ⚠️ |
| **Device Authorization** | `/connect/deviceauthorization` | ✅ Público ⚠️ |
| **JWKS** | `/.well-known/openid-configuration/jwks` | ✅ Público (RSA256) |
| **OpenID Config** | `/.well-known/openid-configuration` | ✅ Público |

> **⚠️ Introspección Pública**: El endpoint de introspección de tokens no requiere autenticación en el nivel de red. Aunque requiere client_id/client_secret, la exposición es riesgosa.

---

## 3. 🔐 Grant Types Habilitados (11) — Análisis de Riesgo

### 3.1 `password` (Resource Owner Password Credentials — ROPC) 🔴 CRÍTICO

**Riesgo:** **MÁXIMO**. El grant type password (ROPC) está considerado **DEPRECATED** y **PROHIBIDO** por:
- **RFC 9700** (OAuth 2.0 Security Best Current Practice): "The resource owner password credentials grant MUST NOT be used."
- **OAuth Security BCP**: Prohíbe explícitamente ROPC
- **NIST SP 800-63**: No permite autenticación con solo contraseña en sistemas de alto impacto

**Riesgos específicos:**
1. **Credenciales en texto plano** a través de la red (mitigado parcialmente por TLS, pero el servidor ve la contraseña)
2. **No soporta MFA/2FA** — autenticación delegada sin verificación adicional
3. **Brute force directo** contra `/connect/token` — sin rate limiting visible (Imperva puede mitigar)
4. **Credential stuffing** — ataque masivo de contraseñas contra el endpoint
5. **Token de por vida del usuario** — una vez obtenido, el atacante tiene acceso hasta expiración

**Cómo explotar:**
```bash
# Ataque de fuerza bruta / credential stuffing
curl -sk -X POST "https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password&username=admin&password=admin123&scope=api"
# Si existe un cliente configurado con ROPC habilitado, retorna access_token
```

### 3.2 `implicit` 🔴 CRÍTICO

**Riesgo:** MÁXIMO. El implicit grant está **DEPRECATED** (OAuth 2.1 lo eliminó).

**Problemas:**
1. Access token via fragmento de URL — queda en historial del navegador
2. Fugas via `Referer` header a páginas externas
3. No soporta refresh tokens
4. Vulnerable a token interception por extensiones/plugins maliciosos

### 3.3 `client_credentials` 🟡 MEDIO

**Riesgo:** Depende de la protección del client_secret. Aceptable para comunicaciones servidor-servidor.

**Vectores:**
1. Client secret débil → compromiso total del cliente
2. Client secret embebido en código fuente mobile/frontend
3. Over-provisioning de scopes en client_credentials

### 3.4 `authorization_code` 🟢 BAJO (con S256)

Con PKCE S256 es seguro. Pero `code_challenge_methods_supported` incluye `plain` — lo que sugiere que hay clientes que usan PKCE `plain` (sin hash), débil a interceptación.

### 3.5 `refresh_token` 🟡 MEDIO

**Riesgo:** Si se obtiene un refresh_token, permite acceso prolongado sin reautenticación. Debe tener rotación y expiración.

### 3.6 `device_code` 🟡 MEDIO-ALTO

**Riesgo:**
1. **Device Code Phishing**: El flujo device_code es explotable para phishing. Atacante inicia device flow, muestra código al usuario, usuario lo autentica en otro dispositivo/secundario.
2. **Polling del token endpoint**: El dispositivo víctima hace polling al token endpoint — detectable pero explotable.
3. **Sin autenticación de dispositivo**: No hay way de verificar qué dispositivo inicia el flujo.

### 3.7 `onboarding` (Custom Extension Grant) 🔴 ALTO

**Riesgo:** Grant type **CUSTOM** desconocido. Sin acceso al código del `IExtensionGrantValidator` implementado.

**Qué podría ser:** Proceso de registro/onboarding de nuevos usuarios o terminales. Potencialmente permite:
1. **Creación de cuentas sin verificación** si la validación es débil
2. **Auto-registro masivo** — creación automatizada de cuentas
3. **Escalada de privilegios** si onboarding otorga tokens con scopes amplios

**Cómo probar:**
```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=onboarding&client_id=onboarding_client&scope=api"
```

### 3.8 `terminal` (Custom Extension Grant) 🔴 ALTO

**Riesgo:** Muy probablemente relacionado con **terminales de pago** (POS). Esto es crítico por:
1. **Autorización de terminales de pago** — validación de terminales físicos
2. Potencial para **crear terminales fraudulentos**
3. **Token de operaciones de pago** — si este grant emite tokens para transacciones
4. Podría permitir a un atacante simular un terminal POS comprometido

### 3.9 `api` (Custom Extension Grant) 🟡 MEDIO

**Riesgo:** Grant type para autenticación de API a API. Depende de implementación.

### 3.10 `mobile` (Custom Extension Grant) 🟡 MEDIO-ALTO

**Riesgo:** Para aplicaciones mobile. Puede implicar:
1. Validación más débil para UX mobile
2. Almacenamiento de client_secret en apps mobile (inseguro)
3. Posible bypass de verificaciones de seguridad

### 3.11 `external_credentials` (Custom Extension Grant) 🔴 ALTO

**Riesgo:** Este grant sugiere **integración con proveedores de identidad externos** (token exchange, federación).

**Implicaciones de seguridad:**
1. **Token translation** — intercambio de tokens externos por tokens internos
2. Si la validación de credenciales externas es débil, permite **falsificación de identidad**
3. **Confusión de emisor** — ataque donde un token de un proveedor externo es aceptado como válido
4. Si usa JWT de terceros (Google, Facebook, etc.), la validación de `aud` y `iss` es crítica

---

## 4. ⚙️ Scopes Expuestos

| Scope | Propósito Probable | Riesgo |
|---|---|---|
| `appmanager` | Gestión de aplicaciones | 🟡 Administrativo |
| `terminalmanager` | Gestión de terminales POS | 🔴 Operaciones de pago |
| `commercemanager` | Gestión de comercios | 🔴 Datos de comercios |
| `paramentermanager` | Gestión de parámetros/settings | 🔴 Configuración del sistema |
| `usermanager` | Gestión de usuarios | 🔴 CRUD de usuarios |
| `api` | Acceso general a API | 🟡 Scope genérico |
| `offline_access` | Tokens de larga duración | 🟡 Refresco persistente |

> **⚠️ Scopes administrativos expuestos**: `usermanager` y `terminalmanager` en un servidor público permiten orquestación administrativa.

---

## 5. 🐛 CVEs Conocidos — IdentityServer4

| CVE | Descripción | Impacto | Afecta |
|---|---|---|---|
| **CVE-2024-39694** | **Open Redirect** en IdentityServer. URL maliciosa tratada como local/trusted, redirige a sitios no confiables. | 🟡 Medio (phishing) | IdentityServer4 (TODAS las versiones, sin soporte) |
| **GHSA-ff4q-64jc-gx98** | Open redirect vía `redirect_uri` y `post_logout_redirect_uri` | 🟡 Medio (phishing) | IdentityServer4 (TODAS) |
| **Múltiples bugs** | Repositorio IdentityServer4 archivado en GitHub: "multiple known security vulnerabilities and bugs" | 🔴 Desconocido | IdentityServer4 (EOL) |
| **Issue #795** | `PostLogoutRedirectURI` no se valida si `idTokenHint` está ausente | 🟡 Medio | Logout CSRF |

> **IdentityServer4 está oficialmente DEPRECATED y EOL.** El repositorio fue archivado en GitHub (DuendeArchive/IdentityServer4).  
> Migración requerida a [Duende IdentityServer](https://duendesoftware.com/) (licencia comercial) o [Open IdentityServer](https://openidentityserver.com/).

---

## 6. 🧪 Pruebas Realizadas

### 6.1 OIDC Configuration — ✅ Accesible
```json
200 OK - .well-known/openid-configuration devuelto completo
```

### 6.2 JWKS Keys — ✅ Accesible
```
Clave RSA256 pública obtenida (kid: 6EA037337E26A15053511038C4F17C88ACB558AA)
Única clave de firma — sin rotación de claves visible
```

### 6.3 Token Endpoint — Password Grant
```bash
POST /connect/token grant_type=password → "invalid_client"
```
**Interpretación:** El servidor valida client_id. Requiere un client_id específico configurado para ROPC.

### 6.4 Token Endpoint — Client Credentials
```bash
POST /connect/token grant_type=client_credentials → "invalid_client"
```
**Interpretación:** No hay client válido con ese client_id.

### 6.5 Authorization Endpoint
```bash
GET /connect/authorize → 302 Redirect a /home/error (errorId presente)
```
Redirect funcional con error handling visible.

### 6.6 Device Authorization
```bash
POST /connect/deviceauthorization → "invalid_client"
```

### 6.7 Revocation
```bash
POST /connect/revocation → "invalid_client"
```

### 6.8 UserInfo
```bash
GET /connect/userinfo → "GM-0003: You must either set Authority or IntrospectionEndpoint"
```
Respuesta de un **API Gateway custom** (no de IdentityServer4 directamente).

---

## 7. 🏗️ Arquitectura Inferida

```
[Internet] → Imperva (CDN/WAF) → ecommerce.cardnet.com.do:7443 → 
    [Kestrel / ASP.NET Core] → API Gateway (custom, error GM-0003) → 
        → agoramarket.cardnet.com.do/identityserver (IdentityServer4)
        → Servicios internos: appmanager, terminalmanager, commercemanager, usermanager
```

**Nota:** La resolución DNS de `agoramarket.cardnet.com.do` es **interna** (no resuelve desde Internet público). El reverse proxy (posiblemente nginx o IIS ARR) enruta desde `ecommerce.cardnet.com.do:7443/agoramarket/identityserver/` al Issuer interno.

---

## 8. 🚨 Resumen de Hallazgos Críticos

| # | Hallazgo | Severidad | Acción Recomendada |
|---|---|---|---|
| 1 | **IdentityServer4 EOL/Sin soporte** | 🔴 CRÍTICO | Migrar a Duende IdentityServer u Open IdentityServer |
| 2 | **Password Grant (ROPC) habilitado** | 🔴 CRÍTICO | Deshabilitar — viola RFC 9700, OAuth BCP, NIST |
| 3 | **Implicit Grant habilitado** | 🔴 CRÍTICO | Deshabilitar — reemplazar por authorization_code + PKCE |
| 4 | **Custom grants (onboarding, terminal, external_credentials)** | 🔴 ALTO | Auditar implementación de IExtensionGrantValidator |
| 5 | **Introspection endpoint público** | 🟡 MEDIO | Bloquear a nivel de firewall/WAF |
| 6 | **Scopes administrativos públicos** | 🟡 MEDIO | Revisar qué clientes pueden solicitar usermanager, terminalmanager |
| 7 | **PKCE "plain" soportado** | 🟡 MEDIO | Exigir S256 solamente |
| 8 | **Sin claims_supported definido** | 🟢 INFO | Implementar claims para validación de tokens |
| 9 | **CVE-2024-39694 Open Redirect** | 🟡 MEDIO | Migrar a versión con fix (requiere Duende) |
| 10 | **Firma única RSA256 sin rotación** | 🟡 MEDIO | Implementar rotación de claves y múltiples keys |

---

## 9. 📋 Recomendaciones Prioritarias

### Inmediatas (0-30 días)
1. 🔴 **Deshabilitar password grant** — eliminar ROPC de todos los clientes
2. 🔴 **Deshabilitar implicit grant** — migrar a authorization_code + PKCE S256
3. 🟡 **Deshabilitar PKCE "plain"** — solo S256
4. 🟡 **Restringir introspection endpoint** por IP/firewall

### Corto Plazo (30-90 días)
5. 🔴 **Migrar de IdentityServer4** a Duende IdentityServer (comercial) o IdentityServer (open source fork)
6. 🔴 **Auditar custom grants** (onboarding, terminal, external_credentials)
7. 🟡 **Implementar rate limiting** en token endpoint contra brute force

### Mediano Plazo (90-180 días)
8. 🟡 **Revisar scopes** — scopes administrativos no deben ser públicos
9. 🟡 **Implementar rotación de JWKS**
10. 🟢 **Implementar monitoring** de abusos en token endpoint

---

## 10. 🔗 Referencias

- [RFC 9700 - OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700)
- [IdentityServer4 GitHub (DuendeArchive)](https://github.com/DuendeArchive/IdentityServer4)
- [CVE-2024-39694 - NVD](https://nvd.nist.gov/vuln/detail/CVE-2024-39694)
- [GHSA-ff4q-64jc-gx98 - Open Redirect](https://github.com/advisories/GHSA-ff4q-64jc-gx98)
- [Duende IdentityServer - Password Grant Docs](https://docs.duendesoftware.com/identityserver/tokens/password-grant/)
- [OAuth 2.1 - Authorization Server Considerations](https://oauth.net/2.1/)
- [Snyk - IdentityServer4 Vulnerabilities](https://security.snyk.io/package/nuget/identityserver4)
- [IdentityServer4 EOL Announcement](https://thenewstack.io/rsk-forks-open-identityserver/)
- [Open IdentityServer (Fork)](https://openidentityserver.com/)

---

*Reporte generado por Hermes Agent (ATHENA Suite OSINT Platform)*  
*Target: ecommerce.cardnet.com.do | CardNET — Consorcio de Tarjetas Dominicanas S.A.*
