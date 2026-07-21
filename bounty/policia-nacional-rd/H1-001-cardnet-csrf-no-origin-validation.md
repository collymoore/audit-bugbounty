# 🔴 CardNET Payment Gateway — Missing Origin/CSRF Validation (Unauthenticated Payment Form Access)

**ID:** NSI-SA-2026-006-001
**Target:** `ecommerce.cardnet.com.do` (CardNET — Consorcio de Tarjetas Dominicanas)
**Severity:** 🔴 **High**
**Program:** Policía Nacional de la República Dominicana

---

## Summary

The CardNET payment gateway endpoint `/sirite/pasarela-pago/transaccion` accepts POST requests from **any origin** without CSRF tokens, origin validation, or authentication. An attacker can craft a cross-origin request that returns the **legitimate CardNET credit card payment form** with attacker-controlled parameters, making it a highly effective phishing vector against users of the PN virtual complaints system.

---

## Steps to Reproduce

1. Send a POST request to the CardNET transaction endpoint from any origin:

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Origin: https://attacker-controlled.com" \
  -H "Referer: https://attacker-controlled.com/fake-cardnet.html" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://attacker-controlled.com/steal&nombre=Victim%20User&numeroDocumento=00112345678&tipoDocumento=CEDULA&medioPago=PagoEnLinea&idAutorizacionPortal=ARBITRARY&numeroAutorizacion="
```

2. The gateway responds with HTTP 200 and the **full legitimate payment form** (9,006 bytes):

```
HTTP/1.1 200 OK
Content-Type: text/html;charset=ISO-8859-1

<html>
<head>
    <title>(None - form title: "Procesar Pago")</title>
    <link href="/sirite/pasarela-pago/static/css/validacion.tarjeta.css" />
</head>
<body>
    <h3>Procesar Pago</h3>
    <strong>Policía Nacional</strong>
    <strong>RD$100.00</strong>
    <strong>00112345678</strong>

    <form action="/sirite/pasarela-pago/procesa-pago" method="post">
        <input type="text" name="inputNumTarjeta" />       <!-- Card number -->
        <input type="text" name="inputCvc" />               <!-- CVV -->
        <input type="hidden" name="sessionTracking" />      <!-- Tracked -->
        <input type="hidden" name="gcaptcharesponse" />     <!-- reCAPTCHA -->
        <input type="hidden" name="H-CSRFTOKEN" />          <!-- CSRF token -->
        <button type="submit">Realizar Pago</button>
    </form>
</body>
</html>
```

3. The form action (`/sirite/pasarela-pago/procesa-pago`) submits card data to the legitimate CardNET processing endpoint.

---

## Impact

### 🔴 Phishing Attack Vector (Critical)

An attacker can create a convincing phishing page that:
1. Mirrors the PN "Denuncias Virtuales" interface
2. Silently POSTs to the **real** CardNET transaction endpoint
3. Displays the **legitimate** CardNET payment form (with PN branding verified)
4. After payment, `urlRetorno` redirects the victim to an attacker-controlled URL

The victim sees:
- The authentic CardNET payment form
- PN branding ("Policía Nacional")
- The correct service description and amount
- Legitimate CardNET URL in the address bar (if opened in a new window)

This defeats typical anti-phishing training because the actual payment page **is** the real CardNET gateway.

### 🟡 CSRF Transaction Initiation

An attacker could force a user's browser to initiate a payment transaction by embedding a hidden form submission. The `idAutorizacionPortal` parameter is fully controllable (see companion finding NSI-SA-2026-006-002).

### 🟡 Redirect to Attacker-Controlled URL

The `urlRetorno` parameter is not validated. After a successful or cancelled payment, the user is redirected to whatever URL the attacker specifies:

```bash
urlRetorno=https://attacker-controlled.com/steal
```

---

## Affected Endpoint

```
POST https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion
Content-Type: application/x-www-form-urlencoded
```

**Parameters accepted without validation:**

| Parameter | Example | Note |
|-----------|---------|------|
| `codigoCentroRecaudacion` | `0020` | PN collection center code |
| `codigoServicio` | `0252` | Certificate service code |
| `montoServicio` | `100.00` | Amount in RD$ |
| `urlRetorno` | Attacker-controlled 🚩 | **No origin validation** |
| `nombre` | Arbitrary | Payer name |
| `numeroDocumento` | Arbitrary | Cédula number |
| `idAutorizacionPortal` | Arbitrary 🚩 | **Client-controlled** |

---

## Remediation

1. **Validate Origin/Referer headers** — reject requests from unexpected origins
2. **Require CSRF tokens** on the `/transaccion` endpoint
3. **Validate `urlRetorno`** against an allowlist of known PN return URLs
4. **Require authentication/session** — the user must have a valid PN session to initiate a payment
5. **Validate `idAutorizacionPortal`** server-side — ensure it matches an active, authorized payment session

---

## Timeline

- **2026-07-15:** Discovery and verification
- **2026-07-15:** Report prepared

---

## Related Findings

- NSI-SA-2026-006-002: Client-Controlled idAutorizacionPortal (Weak Session Binding)
- NSI-SA-2026-006-003: PII Exposure via Plaintext Cédula in Payment Parameters
- NSI-SA-2026-006-004: Missing Server-Side Payment Validation
