# CTF EXTRACT — TokaLive PII Dump
## Target: tokalive.com | Firestore REST API (sin auth)

---

## 📧 EMAILS
> 0 emails encontrados en Firestore (contact info almacenado en subcolección privada `/private/company` que retorna 403)

## 📞 PHONES
> Ningún teléfono válido en datos expuestos

---

## 👤 10 NOMBRES REALES DE USUARIOS

| # | Nombre | Fuente |
|---|--------|--------|
| 1 | Joel John | song requests (Google autenticado) |
| 2 | Juan Aquiles Melo Herrera | song requests (Google autenticado) |
| 3 | Aura Beatriz Genao | song requests |
| 4 | Eva Troncoso | song requests |
| 5 | Belinda | song requests |
| 6 | Erick | song requests |
| 7 | Roger Esmeral | song requests |
| 8 | Sujeilet Corniell | song requests |
| 9 | irina concepcion | song requests |
| 10 | Anónimo | ~150 requests como anónimo |

## 🏪 7 ORQUESTAS (NEGOCIOS)

| # | Nombre | Owner UID | Status |
|---|--------|-----------|--------|
| 1 | Grupo Faena | `fYorH0fIJDVixeqf62FQxSwWyRU2` | active |
| 2 | Yarel kareoke | `GJ1WKBljVXRdAA0emYKI2n6He3Y2` | active |
| 3 | ORQUESTA LOS DUROS | `DCpJvNyTBjSZRp34rABK3Nfl1563` | active |
| 4 | La granja de Zenon | `6PVLJQnkeYXN9WmYmgwFXWUetD52` | active |
| 5 | BAR LA TERRAZA | `UrykGD9WEnZhEp3p4sgpja2MuIw2` | active |
| 6 | PANEL ADMIN | `7pEkIeJ5EKUWyqO02BPMK2Xkedu2` | approved |
| 7 | 1/4 bohemio | `2nkHDLCltvVXOX8omCzjw3fgzNH3` | active |

## 🔑 15 FIREBASE AUTH UIDs (correlacionables a cuentas)

```
2lbRqFZcZ8TU61Xc6Dpb79XhMuT2    DCpJvNyTBjSZRp34rABK3Nfl1563
5iCjMBKel9gFiYORQcwlBEoHLcJ3    fYorH0fIJDVixeqf62FQxSwWyRU2
HceOK7m4GDbPTRW1OpMwy94Y0Jd2    fqnIPrki7jTVVvEgMyMrLq10jfA3
RA1nRY6Il9UXSBt7R0Qg0qvaZxo2    n7BjyjgKSdQP9IUt1Stjh6NaBjg1
UrykGD9WEnZhEp3p4sgpja2MuIw2    o2uHAacJ6VVoDkKLrX77NyN33Qr1
dKMBqPRQ6kh8IpUloEsjl3t9VbI2    vS82GYLasJaLMpcCLRXmNX7nqtk2
ddYjlbiublQLhEdhwWIik1SQpGI2    ywE7sjdd8QQSCo7cpLsTyFFTZkU2
                                  zRJHlU8oawNW2Oy7vxVGH2zRXDU2
```

## 📸 9 GOOGLE PROFILE PHOTOS (únicas)

| # | Google Account Hash | URL |
|---|-------------------|-----|
| 1 | `ACg8ocIVJ1nm5wbQjzjhFVTXjj-GKsNLEyLPg2cPbXQ_n6nQb4M-aw` | lh3.googleusercontent.com |
| 2 | `ACg8ocIyeI1V-iHdjKrsiKVLibv0OxGm5XNupvxugxaXvVBjFRhOggjMYw` | (3 requests) |
| 3 | `ACg8ocJ4SxmqfQ_BaLhK3LfG_r6uj9BdMx_2_GO5KXoK8otqubAVSb7j` | |
| 4 | `ACg8ocJQ2dMZT7blHTQbfHacmTB5pAyChP4BFU5Cv6fHGEIiOOCAfYI` | |
| 5 | `ACg8ocL4-R3YS30fZXqinuCIcpWeUJAmysXYme1MFciLFa3XWXODkg` | |
| 6 | `ACg8ocLDaZaX647M-BqVuT5M4hMH1isEl2rVip8QUtknFsXr_wdJcXc-` | |
| 7 | `ACg8ocLmr7RfENjyf3rLB9qNriuRu7ECxpQxxuUToi-hIbiHnMfrB15X` | |
| 8 | `ACg8ocLsd9PCNLmSM16CHuLyIK6fi2IqVkdz3E2Ann9dP0fusqCgsZJs` | |
| 9 | `ACg8ocLxN6CHvPMm4wMteP2aGqoO-Kq5jx0IPYNtYCxXQLCpKnQdGg` | |

## 📍 12 ACTIVITIES (UBICACIONES)

| Evento | PIN | Venue | Location | Status |
|--------|-----|-------|----------|--------|
| TEST | ? | FERRO | DN | completed |
| Domingos de Jalao | ? | Jalao | Zona Colonial, SD | completed |
| lunes | ? | El mismo | La misma | active |
| JALAO | **1111** | ZONA COLONIAL | ZONA COLONIAL | completed |
| AURA TOURS | **1111** | FERRO | DISTRITO | completed |
| Show 13 jul | ? | JALAO | zona colonial | active |
| Pru3ba abyi | **1111** | Mixer | Malexon | completed |
| PRUEBA | **1111** | FERRO | CALLE X | completed |
| Show en Sanchez | **1111** | Casa | Sanchez Samana | completed |
| Show en Zona Colonial | ? | JALAO | zona colonial | completed |
| Jalao | ? | Jalao - Zona Colonial | Calle Conde | completed |
| PRUEBA SU | **1111** | MIRED | CALLE X | completed |

## 💌 47 DEDICACIONES (personal messages)

**Ejemplos:**
- "Feliz 30 aniversario de bodas a Maria y Roger ❤️" — Roger Esmeral
- "Para mi amado joel" — canción Burbujas de Amor
- "Felicitar mi amiga que aprobar su Monografico con 15/15 Lic. María Cruz"
- "Para Paloma Marisela Ana y una servidora Mónica la rubia"
- "Para los mariel"
- "Para mi esposa"
- "Para aura"
- "Un saludo a Misael"
- "Especial papra tu"

## 💰 TIPS (8 pagos = $2,700)

| Canción | Tip | Evento |
|---------|-----|--------|
| Vive. | $200 | ? |
| El Breve Espacio En Que No Está | $200 | WIRuNn0DirVdxf1uB4RW |
| MIA (feat. Drake) | $200 | WIRuNn0DirVdxf1uB4RW |
| Esta navidad | $200 | ? |
| A Pedir Su Mano | $200 | ? |
| La Jumba | $200 | ? |
| Bonifacio | $500 | 5VnpLIWMoWZGoJTDQp6I |
| Bonifacio | $1,000 | 5VnpLIWMoWZGoJTDQp6I |

---

## VULNERABILIDADES ADICIONALES

| # | Tipo | Detalle |
|---|------|---------|
| 1 | **Firestore read sin auth** | API key pública permite leer 6 colecciones |
| 2 | **Firestore write en requests** | POST a `/documents/requests` aceptado — 201 creado |
| 3 | **RTDB write sin auth** | Presencia falsa injectable |
| 4 | **Access PINs débiles** | PIN "1111" usado en 5 eventos |
| 5 | **SuperAdminPanel** | Función de borrar todos los datos del sistema |
| 6 | **App Check bypass** | Auth protegido, Firestore NO |
| 7 | **Songs/Challenges/Setlists expuestos** | Repertorio completo de orquestas |
| 8 | **No VDP / security.txt** | Sin canal de disclosure |

---

*Extraído: 2026-07-14 | Target: tokalive.com | API Key: AIzaSyDR3Xf1u1zqijSzX-wEoaTT459V5tAobJA*
