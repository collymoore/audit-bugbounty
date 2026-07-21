# 🟡 CardNET Payment Gateway — Client-Controlled idAutorizacionPortal (Weak Session Binding)

**ID:** NSI-SA-2026-006-002
**Target:** `ecommerce.cardnet.com.do` (CardNET — Consorcio de Tarjetas Dominicanas)
**Severity:** 🟡 **Medium**
**Program:** Policía Nacional de la República Dominicana

---

## Summary

The `idAutorizacionPortal` parameter in the CardNET payment transaction flow is **fully controllable from the client-side**. The UUID generation is performed client-side via `Math.random()`, and the gateway accepts any arbitrary value submitted in the POST request. This allows an attacker to:

1. Initiate payment transactions with arbitrary authorization IDs
2. Bypass any server-side session linking the payment to a legitimate PN complaint
3. Potentially replay or manipulate payment sessions

---

## Technical Details

### Weak Client-Side UUID Generation

The JavaScript library (`pasarela-pago.js`) generates the authorization ID client-side:

```javascript
function getUuid(){
    return (Math.random().toString(36).substring(2,15) +
            Math.random().toString(36).substring(2,15)).toUpperCase();
}
```

`Math.random()` is **not cryptographically secure** and can be predicted with enough samples.

### Arbitrary Value Accepted

The gateway accepts any value for `idAutorizacionPortal` without validation:

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://denuncias.policia.gob.do/OfficialComplaint/Payment&nombre=HackerOne&numeroDocumento=99999999999&tipoDocumento=PASAPORTE&medioPago=PagoEnLinea&idAutorizacionPortal=H1-PROOF-OF-CONCEPT-12345-ARBITRARY&numeroAutorizacion="
```

**Result:** HTTP 200 — The payment form is returned with the arbitrary ID embedded in the session.

### PN Frontend Code Reference

In the PN's `officialcomplaint` JS bundle, the `idAutorizacionPortal` is passed directly:

```javascript
botonPago.crear({
    configuracionBoton: { contenedor: "#payment-button-container", titulo: "Realizar Pago" },
    ambiente: PAYMENTENVIRONMENT,    // 'produccion'
    idAutorizacionPortal: no,        // <-- where 'no' = officialComplaintId
    ...
});
```

The value `no` (the PN complaint ID) is used as the authorization portal ID, creating a weak link between the PN complaint and the CardNET transaction. However, since this value originates from client-side JavaScript and is sent to CardNET without server-side verification on the CardNET side, it can be spoofed.

---

## Impact

### 🟡 Transaction Session Manipulation

An attacker can initiate a CardNET payment session with:
- Any `idAutorizacionPortal` value
- Any `numeroDocumento` (cédula) value
- Any `nombre` (payer name)
- Any `urlRetorno`

The gateway does not verify that the `idAutorizacionPortal` corresponds to a legitimate PN complaint or that the payer data matches a registered user.

### 🟡 Potential Replay Attack

If the CardNET backend uses `idAutorizacionPortal` as a uniqueness constraint, an attacker could:
1. Observe a legitimate transaction in progress
2. Replay the same authorization ID with different parameters
3. Potentially cause payment processing errors or duplicate sessions

---

## Remediation

1. **Server-side UUID generation** — the authorization ID should be generated on the PN server, not client-side
2. **Validate idAutorizacionPortal** on the CardNET side — ensure it corresponds to an active, authorized session
3. **Use cryptographically secure random values** (`crypto.getRandomValues()` in browser, or `secrets` module server-side)

---

## Timeline

- **2026-07-15:** Discovery and verification

---

## Related Findings

- NSI-SA-2026-006-001: Missing Origin/CSRF Validation on CardNET Payment Gateway
- NSI-SA-2026-006-003: PII Exposure via Plaintext Cédula in Payment Parameters
