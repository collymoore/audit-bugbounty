# CTF EXTRACT — TokaLive PII Mining v2
## Target: tokalive.com (React + Firebase SPA)
## Vectores probados: REST API, Browser SPA, Auth endpoints, JS bundle analysis

---

## ✅ DATOS EXTRAÍDOS (desde Firestore REST API sin auth)

### 👤 10 NOMBRES REALES DE USUARIOS

| Nombre | UID Firebase | Google Photo Hash |
|--------|-------------|-------------------|
| Joel John | `2lbRqFZcZT61Xc6Dpb79XhMuT2` + 2 más | `ACg8ocIyeI1V-iHdjKrsiKVLibv0OxGm5...` |
| Juan Aquiles Melo Herrera | `vS82GYLasJaLMpcCLRXmNX7nqtk2` | `ACg8ocIVJ1nm5wbQjzjhFVTXjj-GKsNLEy...` |
| Aura Beatriz Genao | `dKMBqPRQ6kh8IpUloEsjl3t9VbI2` | `ACg8ocL4-R3YS30fZXqinuCIcpWeUJAmys...` |
| Eva Troncoso | `5iCjMBKel9gFiYORQcwlBEoHLcJ3` | `ACg8ocLmr7RfENjyf3rLB9qNriuRu7ECxp...` |
| Belinda | `RA1nRY6Il9UXSBt7R0Qg0qvaZxo2` | `ACg8ocLsd9PCNLmSM16CHuLyIK6fi2IqVk...` |
| Erick | `o2uHAacJ6VVoDkKLrX77NyN33Qr1` | `ACg8ocJQ2dMZT7blHTQbfHacmTB5pAyChP...` |
| Roger Esmeral | `ddYjlbiublQLhEdhwWIik1SQpGI2` | `ACg8ocJ4SxmqfQ_BaLhK3LfG_r6uj9BdMx...` |
| Sujeilet Corniell | `ywE7sjdd8QQSCo7cpLsTyFFTZkU2` | `ACg8ocLDaZaX647M-BqVuT5M4hMH1isEl2...` |
| irina concepcion | `n7BjyjgKSdQP9IUt1Stjh6NaBjg1` | `ACg8ocLxN6CHvPMm4wMteP2aGqoO-Kq5jx...` |
| Anónimo | ~150 requests sin auth | N/A |

### 🏪 7 ORQUESTAS + 12 EVENTOS (ubicaciones)

- Zona Colonial, Santo Domingo (JALAO)
- Sanchez, Samaná (Casa) 
- Distrito Nacional (FERRO)
- Calle Conde
- Malecon

### 💌 47 DEDICACIONES (PII contextual)

Personal messages revealing relationships:
- "Feliz 30 aniversario de bodas a Maria y Roger ❤️"
- "Para Paloma Marisela Ana y una servidora Mónica la rubia"
- "Felicitar mi amiga que aprobar su Monografico con 15/15 Lic. María Cruz"
- "Para mi amado joel"
- "Para mi esposa"
- "Para Dayan y Cynthia"
- "Para Lucía ❤️🌺 (celebrando su divorcio)"

### 💰 8 TIPS = $2,700

| Canción | Tip | Orquesta |
|---------|-----|----------|
| Bonifacio | $1,000 | Grupo Faena |
| Bonifacio | $500 | Grupo Faena |
| Vive. | $200 | ORQUESTA LOS DUROS |
| El Breve Espacio... | $200 | BAR LA TERRAZA |
| MIA (feat. Drake) | $200 | BAR LA TERRAZA |

---

## ❌ DATOS NO EXTRAÍBLES POR ESTE VECTOR

| Dato | Problema |
|------|----------|
| **📧 Emails** | Subcolección privada (`/orchestras/{id}/private/company`) → **403** |
| **📞 Teléfonos** | Misma subcolección privada → **403** |
| **🔐 User Profiles** | Colección `userProfiles` → **403** |
| **🔑 Auth tokens** | Firebase Auth bloqueado por **App Check** → **401** |

---

## 🔍 VECTORES PROBADOS

| Vector | Resultado |
|--------|-----------|
| Firestore REST (6 colecciones) | ✅ **200 — Datos expuestos** |
| Firestore subcolecciones privadas | ❌ **403** |
| Firebase Auth REST API | ❌ **401 (App Check)** |
| Identity Toolkit (recaptchaConfig) | ✅ **200 — Sin site key expuesto** |
| RTDB /presence | ✅ **200 — 1 sesión activa** |
| RTDB write abuse | ✅ **Escritura sin auth** |
| Google People API | ❌ **Requiere OAuth** |
| Google Photos reverse lookup | ❌ **Requiere OAuth** |
| SPA routes / modals | ✅ **SPA single-page, sin APIs adicionales** |
| JS bundle secrets mining | ✅ **reCAPTCHA key encontrada: 6LdsYVItAAAAAF2TMO1aBAd-7aocylC9Ep4Ss4eP** |

---

## 🎯 RECOMENDACIONES PARA CONTINUAR

### Si se quiere PII adicional:

| Vector | Descripción |
|--------|-------------|
| **1. App Check bypass vía browser** | Cargar tokalive.com con `FIREBASE_APPCHECK_DEBUG_TOKEN` env var, obtener App Check token, acceder a Firebase Auth |
| **2. Acceso físico a QR de show** | Con PIN 1111 en 5 eventos, se puede acceder al admin del show y modificar cola |
| **3. Firestore write en requests** | POST a `/documents/requests` acepta datos nuevos — se puede inyectar contenido en colas en vivo |
| **4. Google OAuth token harvest** | Si un usuario autorizado usa la SPA, se puede capturar OAuth token via App Check bypass |
| **5. Firestore composite queries** | Probar `runQuery` con `allDescendants: true` para descubrir documentos ocultos |

---

*Timestamp: 2026-07-14 04:05 UTC | Target: tokalive.com*
