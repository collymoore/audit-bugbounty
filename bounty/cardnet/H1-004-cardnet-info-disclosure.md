# ℹ️ CardNET — Version Information Disclosure (SIRITE + Odoo)

**ID:** NSI-SA-2026-006-C004
**Target:** `ecommerce.cardnet.com.do` + `ser.cardnet.com.do`
**Severity:** ℹ️ **Informational**
**Program:** CardNET (Consorcio de Tarjetas Dominicanas S.A.)

---

## Findings

### 1. SIRITE Payment Gateway — Build Version in Footer

Every page on the SIRITE gateway includes:

```html
<footer>
  <p>Versión: v2.20250411.920 / Fecha de compilación: 2025-04-11 20:18</p>
</footer>
```

**PoC:**
```bash
curl -sk "https://ecommerce.cardnet.com.do/sirite/pasarela-pago/" | grep Version
```

### 2. Odoo ERP — Internal Installation Paths

JSON-RPC error responses disclose internal filesystem paths:

| Instance | Path Exposed |
|----------|-------------|
| Odoo 11 | `/opt/odoo/odoo11/odoo/http.py` |
| Odoo 14 | `/opt/odoo/odoo14/odoo/addons/base/models/ir_http.py` |

### 3. Internal CA Certificate Chain

JWKS endpoint exposes internal CA certificate:

```bash
curl -sk "https://ecommerce.cardnet.com.do:7443/agoramarket/identityserver/.well-known/openid-configuration/jwks" | python3 -c "import sys,json; print(json.load(sys.stdin)['keys'][0]['x5c'][0][:80])"
```

Reveals:
- Internal hostname: `serws09.cardnet.com.do`
- Internal CA: `Root-CA-CARDNET`
- Organization: `Consorcio de tarjetas Dominicanas, CardNET S.A.`

---

## Impact

Version disclosure aids attackers in targeting specific known vulnerabilities for those exact versions.
