# Clínica Corominas — Reporte de Hallazgos
**Target:** corominas.com.do (162.210.96.116)
**Fecha:** 10 Julio 2026

---

## 🔴 CRÍTICO — Directory Listing Activo

La raíz `/wp-content/uploads/` tiene **directory listing habilitado**. Cualquier persona puede navegar y descargar TODOS los archivos subidos desde 2016.

### Archivos expuestos:
| Ruta | Archivos | Contenido |
|------|----------|-----------|
| `uploads/2025/07/` | **1,688** | Imágenes doctores, eventos, pacientes |
| `uploads/2025/06/` | **494** | Fotos actividades médicas |
| `uploads/2024/11/` | **592** | Imágenes institucionales |
| `uploads/2024/12/` | **91** | Más contenido |
| `uploads/2025/02/` | **35** | Staff clínica |
| `uploads/2025/05/` | **79** | Eventos |
| Otras carpetas | ~400+ | Varios años |
| **TOTAL** | **~3,500+** | |

### Directorios expuestos:
- **cfdb7_uploads/** — Formularios (posibles datos personales)
- **sb-instagram-feed-images/** — Imágenes Instagram
- **mainwp/** — MainWP backup data
- **sucuri/** — Logs de seguridad (listing bloqueado pero accesible)
- **redux/** — Opciones de tema

### Ejemplos de archivos expuestos (nombres reales):
```
felicitacion-dr.-oscar-madera-la-informacion-170x300-1.jpg
invitacion-residentes-accidente-cerebrovascular-214x300-1.jpg
Yuleysi-Severino-Adelissa-Rodriguez-Luisa-Espaillat-Massiel-Santana-Ivonne-Canto-Madelyn-Ramos-y-Patricia-Lizardo-300x175-1.jpg
redes-operativo-cardiologico-300x300-1.jpg
```

### URLs de acceso público:
- `https://corominas.com.do/wp-content/uploads/` — Padre (ALL dirs)
- `https://corominas.com.do/wp-content/uploads/2025/07/` — +1,688 archivos
- `https://corominas.com.do/wp-content/uploads/2025/06/` — +494 archivos
- `https://corominas.com.do/wp-content/uploads/cfdb7_uploads/` — Form uploads
- `https://corominas.com.do/wp-content/uploads/sb-instagram-feed-images/` — IG media

---

## 🟡 ALTO — Información de Sistema Expuesta

### 1. Usuarios WP Enumerados (REST API abierta)
| ID | Username | Rol |
|----|----------|-----|
| 2 | **3mentes** | Autor/Editor |
| 3 | **Publimass** | Autor/Editor |

URL: `https://corominas.com.do/wp-json/wp/v2/users/`

### 2. WPBakery 8.7.2 — CVE-2026-45436
Afectado por **Broken Access Control**. Permite a atacantes no autenticados acceder a funcionalidades del page builder. Presente en:
```
/wp-content/plugins/js_composer/
```

### 3. MainWP Child 6.1.3
Plugin de gestión remota multisitio expuesto públicamente:
```
/wp-content/plugins/mainwp-child/readme.txt
```

### 4. WordPress 7.0.1
Versión actual. No hay CVSS críticos conocidos para 7.0.1 específicamente.

### 5. Pure-FTPd en puerto 21
Banner expuesto: `Pure-FTPd [privsep] [TLS]`. Sin acceso anónimo pero expuesto a fuerza bruta.
```
220-This is a private system - No anonymous login
220 You will be disconnected after 15 minutes of inactivity.
```

---

## 🟢 MEDIO — Info Adicional

| Hallazgo | Detalle |
|----------|---------|
| **SSL** | Let's Encrypt — expira 31 Jul 2026 (3 semanas) |
| **PHP** | 7.4+ según readme.html |
| **ModSecurity** | Activo (bloqueó xmlrpc.php, POST sospechosos) |
| **Sucuri** | Plugin de seguridad instalado (no evitó listing) |
| **Contact Form 7** | v6.1.6 — actualizado |
| **Quform** | Plugin formularios con sesión activa |
| **Instagram Feed** | v6.11.3 — imágenes expuestas |
| **WPBakery Frontend** | `?vc_action=vc_inline` responde 200 |
| **XML-RPC** | Bloqueado (412) por ModSecurity |
| **WAF/Cloudflare** | ❌ No detectado — DNS directo |

---

## 📋 Resumen de Vectores Explotables

| # | Vector | Severidad | Estado |
|---|--------|-----------|--------|
| 1 | **Directory listing uploads/** | 🔴 CRÍTICO | ✅ Confirmado |
| 2 | **~3,500+ archivos multimedia públicos** | 🔴 ALTO | ✅ Confirmado |
| 3 | **Enumeración usuarios WP** | 🟡 MEDIO | ✅ Confirmado |
| 4 | **WPBakery 8.7.2 Auth Bypass (CVE-2026-45436)** | 🟡 MEDIO | 🕵️ Probando |
| 5 | **cfdb7_uploads expuesto** | 🟡 MEDIO | ⚠️ Vacío actualmente |
| 6 | **FTP puerto 21 abierto** | 🟡 BAJO | ❌ No anónimo |
| 7 | **SSL por expirar (31 Jul)** | 🟢 BAJO | Info |
| 8 | **MainWP Child expuesto** | 🟢 BAJO | Info |

---

## Evidencia Visual
Screenshot subido: directory listing de `/wp-content/uploads/` y `/wp-content/uploads/2025/07/` (1,688 archivos).
