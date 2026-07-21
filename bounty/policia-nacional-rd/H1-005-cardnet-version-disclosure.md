# ℹ️ Version Information Disclosure — SIRITE Payment Gateway

**ID:** NSI-SA-2026-006-005
**Target:** `ecommerce.cardnet.com.do`
**Severity:** ℹ️ **Informational** (Low)
**Program:** Policía Nacional de la República Dominicana

---

## Summary

The CardNET SIRITE payment gateway exposes its exact build version and compilation timestamp in the HTML footer of every response page.

---

## Technical Details

### Version String

Every response page from the SIRITE gateway includes:

```html
<footer style="text-align: center; font-size: 7pt; color: #dddddd;">
    <div class="footer">
        <p>Versión: v2.20250411.920 / Fecha de compilación: 2025-04-11 20:18</p>
    </div>
</footer>
```

### PoC

```bash
curl -sk "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/" | grep -i "version"
# Output: Versión: v2.20250411.920 / Fecha de compilación: 2025-04-11 20:18
```

### Exposed Information

| Field | Value |
|-------|-------|
| Version | v2.20250411.920 |
| Build date | 2025-04-11 |
| Build time | 20:18 UTC |
| Application | SIRITE Payment Gateway |
| Platform | Java/Spring (inferred from JSP templates) |
| Web server | Apache (confirmed from response headers) |

---

## Impact

### ℹ️ Attack Surface Intelligence

Knowing the exact build version allows an attacker to:
1. Search for known vulnerabilities in that specific version
2. Determine the patch cadence and security update frequency
3. Target exploitation attempts based on the version's known weaknesses

While this is low-severity alone, in combination with the other findings (CSRF, weak auth, PII exposure), it provides an attacker with valuable reconnaissance data.

---

## Remediation

1. Remove or obfuscate version information from HTML responses
2. Use generic version strings (e.g., "v2.x") instead of exact build timestamps
3. Move version information to internal headers only (e.g., `X-Version` internal header)

---

## Timeline

- **2026-07-15:** Discovery and verification

---

## Related Findings

- NSI-SA-2026-006-001: Missing Origin/CSRF Validation on CardNET Payment Gateway
- NSI-SA-2026-006-003: PII Exposure via Plaintext Cédula in Payment Parameters
