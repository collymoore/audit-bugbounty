# Auditoría de Vectores de Defacement — Sana Crédito

**Target:** https://www.sanacredito.com
**Plataforma:** Squarespace (SAAS gestionado)

---

## Resumen: 🟢 SUPERFICIE MÍNIMA

Squarespace es una plataforma SAAS cerrada. No hay acceso a archivos del servidor, no hay
plugins que auditar, no hay subida de archivos, no hay temas personalizados vulnerables.

---

## 1. File Upload / Webshell

| Vector | Resultado | Evidencia |
|--------|-----------|-----------|
| `/upload` | ❌ 404 | No existe |
| `/uploads` | ❌ 404 | No existe |
| `/admin/upload` | ❌ 404 | No existe |
| `/commerce/digital-download/` | ❌ 405 (Method Not Allowed) | Bloquea POST |
| POST con file a cualquier ruta | ❌ 404 | No hay endpoint de subida |
| Subir a `/api/` | ❌ 404 | No expuesto |

**Conclusión:** ❌ No hay vector de file upload. Squarespace no permite subir archivos
arbitrarios desde el frontend.

---

## 2. Administración / Paneles

| Ruta | HTTP | Nota |
|------|------|------|
| `/admin` | 404 | No existe |
| `/config` | 302 → OAuth login | Redirige a login de Squarespace |
| `/wp-admin` | 404 | No es WordPress |
| `/manager` | 404 | No existe |

**Conclusión:** ❌ Sin acceso a panel. El único panel (`/config`) redirige a OAuth de
Squarespace que requiere credenciales válidas.

---

## 3. Archivos Sensibles

| Ruta | HTTP | Nota |
|------|------|------|
| `/.git/config` | **403** | Bloqueado por WAF |
| `/.env` | **403** | Bloqueado por WAF |
| `/wp-config.php` | 404 | No existe |
| `/backup` | 404 | No existe |

**Conclusión:** ✅ Squarespace bloquea archivos sensibles con 403.

---

## 4. Directory Listing

| Ruta | HTTP | Directory listing visible |
|------|------|--------------------------|
| `/static/` | 404 | ❌ No |
| `/images/` | 404 | ❌ No |
| `/assets/` | 404 | ❌ No |

**Conclusión:** ✅ No hay directory listing.

---

## 5. XSS / HTML Injection

| Parámetro | Payload | Reflecta? |
|-----------|---------|-----------|
| `?q=` | `<script>alert(1)</script>` | ❌ No refleja |
| `?s=` | `<script>alert(1)</script>` | ❌ No refleja |
| `?search=` | `<script>alert(1)</script>` | ❌ No refleja |
| `?query=` | `<script>alert(1)</script>` | ❌ No refleja |

**Conclusión:** ✅ Squarespace sanitiza output. Sin XSS reflejado.

---

## 6. JSON Endpoints (Info Disclosure - ya documentado)

| Endpoint | Contenido |
|----------|-----------|
| `?format=json` | ✅ Expone website config completo |
| `?format=json-pretty` | ✅ Mismos datos en pretty-print |
| `?format=main-content` | ✅ Solo HTML del contenido principal |
| `?format=page-context` | ✅ Contexto de página actual |

⚠️ **Solo lectura.** Estos endpoints no permiten modificar datos. El riesgo es
información expuesta (email, teléfono, config), no defacement.

---

## 7. WAF / Protecciones Detectadas

| Protección | Detectada |
|------------|-----------|
| Squarespace WAF | ✅ Bloquea `.git`, `.env` con 403 |
| Rate limiting | No detectado (solo 1 request por test) |
| User-Agent filtering | ❌ No detectado (todos los agents devuelven mismo resultado) |
| HSTS | ✅ 180 días + includeSubDomains |
| X-Frame-Options | ✅ SAMEORIGIN (previene clickjacking) |
| CSP | ❌ Ausente |

---

## 🛡️ Veredicto Final: DEFACEMENT RESISTENTE

```
Riesgo de defacement:   🟢 MUY BAJO
Vector más probable:    🔐 Compromiso de cuenta Squarespace (phishing/cred theft)
```

Este sitio **no es defaceable** por los vectores tradicionales porque:

1. No hay subida de archivos
2. No hay WordPress/plugins vulnerables
3. No hay acceso a filesystem
4. No hay XSS reflejado
5. Squarespace maneja el servidor/server-side

Si un atacante quisiera defacear este sitio, **necesitaría**:
- Credenciales del dueño (phishing, cred stuffing)
- Acceso a la cuenta de Squarespace
- O comprometer Squarespace mismo (0-day improbable)

Para efectos de **nuestra competencia vs Contigo**, esto confirma que Sana Crédito
es un sitio informático estático — sin funcionalidad interactiva, sin store activa.
Contigo tiene más funcionalidad pero también más superficie de ataque que auditar.
