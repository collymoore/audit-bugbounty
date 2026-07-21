# 🟡 CardNET SIRITE Payment Gateway — Missing Origin Validation + PII Exposure

**ID:** NSI-SA-2026-006-C001
**Target:** `https://ecommerce.cardnet.com.do/sirite/pasarela-pago/`
**Severity:** 🟡 **High**
**Program:** CardNET (Consorcio de Tarjetas Dominicanas S.A.)

---

## Summary

The CardNET SIRITE payment gateway exposes multiple security issues:

1. **No Origin/CSRF validation** — the `/transaccion` endpoint accepts POST from any origin
2. **PII in plaintext** — citizen ID numbers (`numeroDocumento`) transmitted in POST body
3. **Arbitrary parameter injection** — any name, ID, return URL accepted without validation
4. **Unauthenticated credit card form** — no session required to access payment form

---

## Affected Endpoint

```
POST https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion
Content-Type: application/x-www-form-urlencoded
```

Parameters reflected from user input:

| Parameter | Issue |
|-----------|-------|
| `nombre` | 🚩 No validation — arbitrary name accepted |
| `numeroDocumento` | 🚩 No validation — any ID number accepted |
| `urlRetorno` | 🚩 No validation — attacker-controlled redirect |
| `idAutorizacionPortal` | 🚩 Client-controlled session ID |

---

## PoC 1 — Cross-Origin Access

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Origin: https://attacker-controlled.com" \
  -H "Referer: https://attacker-controlled.com/" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://attacker-controlled.com/steal&nombre=Test%20User&numeroDocumento=00112345678&tipoDocumento=CEDULA&medioPago=PagoEnLinea&idAutorizacionPortal=POC001&numeroAutorizacion="
```

**Response:** HTTP 200 — Full payment form returned (9KB+) with credit card fields.

## PoC 2 — PII Reflection (20+ Test Cases)

All 20+ arbitrary ID numbers and names tested are reflected in the response:

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://ecommerce.cardnet.com.do/return&nombre=Pedro%20Sanchez%20De%20La%20Cruz&numeroDocumento=00400000000&tipoDocumento=CEDULA&medioPago=PagoEnLinea&idAutorizacionPortal=POCPII&numeroAutorizacion="
```

**Response reflects:**
```
<strong> Pedro Sanchez De La Cruz </strong>
<strong> 00400000000 </strong>
```

No server-side validation — the gateway simply echoes input data.

## PoC 3 — No Authentication Required

The endpoint is accessible without any session token, API key, or authentication cookie. The response includes:

```html
<form action="/sirite/pasarela-pago/procesa-pago" method="post">
  <input type="text" name="inputNumTarjeta" />    <!-- Credit card number -->
  <input type="text" name="inputCvc" />            <!-- CVV -->
  <input type="hidden" name="sessionTracking" />
  <input type="hidden" name="gcaptcharesponse" />
  <input type="hidden" name="H-CSRFTOKEN" />
  <button type="submit">Realizar Pago</button>
</form>
```

---

## Impact

| Vector | Impact |
|--------|--------|
| No Origin validation | Attacker embeds real CardNET payment form from any site |
| PII in POST body | National ID + name visible in Imperva WAF logs, Apache logs, proxies |
| No auth required | Anyone can initiate payment sessions |
| urlRetorno controlable | Post-payment redirect hijack |

---

## Remediation

1. Validate Origin/Referer headers on `/transaccion`
2. Encrypt PII fields at application layer (beyond TLS)
3. Require authentication for payment initiation
4. Validate `urlRetorno` against allowlist
5. Server-side validation of `idAutorizacionPortal`

---

## Timeline

- **2026-07-15:** Discovery and verification
