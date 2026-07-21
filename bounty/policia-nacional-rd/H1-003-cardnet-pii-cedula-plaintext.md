# 🟡 PII Exposure — Cédula (National ID) Transmitted in Plaintext via CardNET Payment Gateway

**ID:** NSI-SA-2026-006-003
**Target:** `denuncias.policia.gob.do` + `ecommerce.cardnet.com.do`
**Severity:** 🟡 **Medium**
**Program:** Policía Nacional de la República Dominicana

---

## Summary

The PN's virtual complaints system transmits the citizen's **cédula** (Dominican national ID number, `numeroDocumento`) as a **plaintext POST parameter** to the CardNET payment gateway, without encryption at the application layer beyond HTTPS. This exposes personally identifiable information (PII) to:

- Server-side request logs on CardNET's infrastructure
- WAF/Imperva Incapsula logs
- Any intermediary proxies or monitoring systems
- TLS-terminating intermediaries

---

## Technical Details

### Data Flow

When a citizen proceeds to pay for a certificate (e.g., "Pérdida de Documentos" — RD$100), the PN frontend sends a POST request directly from the browser to CardNET:

```
Browser → POST https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion
```

The request body contains (URL-encoded):

```
codigoCentroRecaudacion=0020
codigoServicio=0252
montoServicio=100.00
nombre=Nombre%20Completo          ← Full name (PII)
numeroDocumento=00112345678       ← Cédula (PII) 🚩
tipoDocumento=CEDULA
idAutorizacionPortal=UUID
urlRetorno=https://...
```

### PoC — Cédula Visible in Plaintext POST

```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://denuncias.policia.gob.do/OfficialComplaint/Payment&nombre=Juan%20Perez&numeroDocumento=00112345678&tipoDocumento=CEDULA&medioPago=PagoEnLinea&idAutorizacionPortal=H1PIIPOC&numeroAutorizacion="
```

**The cédula (`00112345678`) and full name (`Juan Perez`) are transmitted in the POST body** — visible in server logs, WAF logs, and any intermediary that terminates TLS.

### Where the Data is Stored/Reflected

The cédula and name are rendered back in the payment confirmation page:

```html
<strong>Juan Perez</strong>
<strong>00112345678</strong>
```

---

## Impact

### 🟡 PII Leakage

The cédula (national ID number) is the primary identity document in the Dominican Republic, used for:
- Banking and financial transactions
- Government services
- Employment verification
- Property registration
- Notarized documents

Exposure in HTTP logs constitutes a **data privacy violation** under Dominican Law 172-13 (Ley de Protección de Datos Personales).

### Exposed Information per Transaction

| Data Point | PII Level | Example |
|------------|:---------:|---------|
| Cédula | 🔴 High | `00112345678` |
| Full name | 🟡 Medium | `Juan Perez` |
| Service type | ℹ️ Low | `0252` (Certificate) |
| Amount | ℹ️ Low | `RD$100.00` |
| Collection center | ℹ️ Low | `0020` (PN) |

---

## Remediation

1. **Encrypt sensitive PII at the application layer** — use field-level encryption for `numeroDocumento` and `nombre` before transmitting to CardNET
2. **Mask PII in logs** on both PN and CardNET infrastructure
3. **Minimize data transmitted** — use a session token or transaction reference instead of raw PII
4. **Audit CardNET's data retention and logging policies**

---

## Timeline

- **2026-07-15:** Discovery and verification

---

## Related Findings

- NSI-SA-2026-006-001: Missing Origin/CSRF Validation on CardNET Payment Gateway
- NSI-SA-2026-006-002: Client-Controlled idAutorizacionPortal (Weak Session Binding)
