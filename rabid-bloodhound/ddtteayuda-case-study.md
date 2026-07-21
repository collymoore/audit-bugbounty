# DDTeAyuda — Firebase Data Breach Case Study

**Target:** ddtteayuda.com (App: com.ddtteayuda.app)
**Tipo:** Firebase-only SPA (Vite + React + Firebase Auth + Firestore)
**Fecha auditoría:** Julio 9, 2026
**Hallazgo:** 🔴 **Data Breach — 7,452 perfiles comprometidos**
**Modelo:** 💰 Comercial NSI (no HackerOne)

---

## Findings

| # | Finding | Severidad | Detalle |
|---|---------|-----------|---------|
| 1 | **Open Registration** — Firebase Auth permite crear cuenta con cualquier email+password. Sin CAPTCHA, rate limit ni verificación de email requerida | 🔴 Critical | `signUp` con email+password devuelve `idToken` |
| 2 | **Firestore Data Breach** — Reglas permiten `read: if request.auth != null`. La verificación de email era client-side solamente | 🔴 Critical | **7,452 registros expuestos** |
| 3 | **API keys extras en APK** — 3 Firebase API keys extraídas del binario compilado Flutter | 🟡 Medium | `libapp.so` → strings → `AIzaSy` |

## Scope del Breach

| Dato | Cantidad |
|------|----------|
| Perfiles totales | **7,452** |
| Emails | 7,432 |
| Teléfonos | 6,290 |
| Cédulas (RD) | **3,807** |
| Direcciones | 3,855 |
| Coordenadas GPS | 3,079 |
| FCM push tokens | 6,080 |
| Admins expuestos | 11 |

## Root Cause

**Email verification ≠ Firestore security boundary.** Las reglas decían `allow read: if request.auth != null;` — cualquier usuario autenticado (verificado o no) podía leer TODA la base de datos vía REST API. La verificación de email solo controlaba el UI de la app, no el backend.

## OSINT

| Fuente | Info |
|--------|------|
| App Store (iOS) | Seller: **Ronny Correa De la Cruz** |
| Google Play | Publisher: **DANTEL VICTORIANO BELTRE GUERRERO** (dangerbeltre@gmail.com) |
| Instagram | @ddtteayuda — 700+ providers, creador: Dantel Beltre |
| Fundadores | Dantel Beltre (técnico) + Ronny Correa (CEO/negocio) |
| Stack | Flutter AOT, Firebase Auth + Firestore + Storage + FCM + Stripe |

## API Keys Extraídas

| Key | Fuente | Proyecto |
|-----|--------|----------|
| `AIzaSyBmsiSrpJwqO6OvsXMLAtTFJuCCMn-KT5o` | JS bundle (web) | ddt-te-ayuda ✅ |
| `AIzaSyBmV9TxLtmRAir81GZzaMK-gwyz1gITNXg` | APK `libapp.so` | ddt-te-ayuda ✅ |
| `AIzaSyDGar0LBozHHyZhccqyXZ70ZoYN35ChfAY` | APK `libapp.so` | Proyecto diferente |

## Modelo Comercial

| Fase | Contenido | Precio |
|------|-----------|--------|
| Fase 1 | Informe de hallazgos + exploitation | $3,000 |
| Fase 2 | Reporte ejecutivo + tabla de datos completa | $3,000 |
| **Paquete completo** | **Ambas fases + PDF profesional** | **$6,000** |

**Estado:** ❌ CERRADO — Cliente declinó por falta de fondos (10 Jul 2026)

## Artefactos

| Archivo | Ruta |
|---------|------|
| Propuesta HTML | `/root/bounty/ddtteayuda_nsi_propuesta.html` |
| Propuesta PDF | `/root/bounty/ddtteayuda_nsi_propuesta.pdf` |
| Reporte HTML | `/root/bounty/ddtteayuda_nsi_report.html` |
| Reporte PDF | `/root/bounty/ddtteayuda_nsi_report.pdf` |
| Datos extraídos (raw) | `/root/bounty/ddtteayuda_profiles_raw.json` (249MB) |
| Case study skill | `bug-bounty-hunter/references/ddtteayuda-firebase-case-study.md` |

## Lecciones

- **Siempre testear Firestore con 3 niveles:** sin auth (403), auth sin verificar (debe ser 403 en colecciones sensibles), auth verificado (solo sus datos)
- **Verificación de email NO es security boundary** en Firebase — solo controla UI, no reglas de Firestore
- **APK Flutter** extrae API keys vía `strings libapp.so | grep AIzaSy` — el binario AOT compilado conserva strings literales
- **SPF TXT record** puede revelar Project ID de Firebase: `dig target.com txt +short | grep firebase=`
