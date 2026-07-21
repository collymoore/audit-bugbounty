# 🟡 Missing Server-Sided Payment Validation — PN Denuncias Virtuales

**ID:** NSI-SA-2026-006-004
**Target:** `denuncias.policia.gob.do`
**Severity:** 🟡 **Medium**
**Program:** Policía Nacional de la República Dominicana

---

## Summary

The PN Denuncias Virtuales application delegates the entire payment flow to client-side JavaScript. The payment amount, service code, and payer data are computed in the browser and sent directly to the CardNET gateway via POST. The PN backend does **not** validate or verify the payment before processing the complaint.

---

## Technical Details

### Current Architecture

```
[User Browser]
      │
      ├── Step 1-8: Fill complaint form → POST to PN backend (multipart)
      │                 (images, videos, personal data, etc.)
      │
      └── Step 9: Payment (only for certificate services)
              │
              ├── Client-side JS fills hidden form fields
              │     COLLECTIONCENTERCODE = '0020'
              │     ServiceCode           = '0252'  
              │     Amount                = 100.00
              │     PayerName             = (from form)
              │     PayerDocument         = (from form)
              │
              └── POST directly to CardNET → ecommerce.cardnet.com.do
                         without PN backend validation
```

### Code Confirmation — PN Official Complaint JS Bundle

```javascript
function sa(){
    $("#txtCollectionCenterCode").val(COLLECTIONCENTERCODE);  // '0020'
    $("#slcCatalogServices").empty().append(`<option value="${ef}">${ef}</option>`);
    $("#txtAmount").val(or);             // Price from client-side variable
    $("#txtPayerName").val(wh);
    $("#txtPayerDocumentNumber").val(bh);
    $("#slcPayerDocumentType").empty().append(`<option value="${to}">${to}</option>`);

    botonPago.crear({
        configuracionBoton: { contenedor: "#payment-button-container", titulo: "Realizar Pago" },
        ambiente: PAYMENTENVIRONMENT,    // 'produccion'
        idAutorizacionPortal: no,
        cliente: {
            urlRetorno: `${BASE_RETURN_URL}?officialComplaintId=${no}`,
            data: {
                codigoCentroRecaudacion: "txtCollectionCenterCode",
                codigoServicio: "slcCatalogServices",
                montoServicio: "txtAmount",
                nombre: "txtPayerName",
                numeroDocumento: "txtPayerDocumentNumber",
                tipoDocumento: "slcPayerDocumentType"
            }
        }
    });
    $(".btn-pago.btn-form").click();    // Auto-trigger payment
}
```

### Key Finding — No Server-Side Validation Loop

The flow is:

```
1. User submits complaint → PN backend stores it (pending payment?)
2. Frontend gets price from client-side variable `or`
3. Frontend POSTs directly to CardNET ← NO PN backend involvement
4. CardNET returns payment form
5. User pays → CardNET redirects to `urlRetorno`
6. PN backend receives redirect → ??? (no verification of actual payment)
```

The `urlRetorno` includes `officialComplaintId=${no}`, but there is **no evidence** that the PN server verifies with CardNET that the payment was actually completed before processing the complaint.

---

## Impact

### 🟡 Business Logic Bypass

A sophisticated attacker who can:
- Manipulate client-side variables (via browser DevTools or extension)
- Or intercept and modify the POST to CardNET

Could potentially:
1. Change the price to RED$0
2. Or skip the payment step entirely if the PN backend doesn't check
3. Or submit the complaint without payment and have it processed anyway

### 🟡 Integrity of Payment Status

Since the payment status is communicated solely via URL redirect (`urlRetorno=${BASE_RETURN_URL}?officialComplaintId=${no}`), an attacker could:
1. Directly visit the return URL with a valid complaint ID
2. The PN backend would assume payment was completed
3. Process the complaint without actual payment

---

## Remediation

1. **Server-side payment verification** — the PN backend should verify payment status directly with CardNET before marking a complaint as paid
2. **Server-side amount calculation** — determine the price server-side based on the service type, not client-side variables
3. **Webhook/push notification** from CardNET to PN backend confirming payment, rather than relying on URL redirect
4. **Validate the `officialComplaintId`** in the return URL against an active session with a pending payment

---

## Timeline

- **2026-07-15:** Discovery and verification

---

## Related Findings

- NSI-SA-2026-006-001: Missing Origin/CSRF Validation on CardNET Payment Gateway
- NSI-SA-2026-006-002: Client-Controlled idAutorizacionPortal (Weak Session Binding)
- NSI-SA-2026-006-003: PII Exposure via Plaintext Cédula in Payment Parameters
