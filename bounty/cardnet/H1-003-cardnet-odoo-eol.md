# 🟡 CardNET — End-of-Life Odoo ERP Instances (v11 + v14)

**ID:** NSI-SA-2026-006-C003
**Target:** `ser.cardnet.com.do` + `ecommerce.cardnet.com.do:6443`
**Severity:** 🟡 **Medium**
**Program:** CardNET (Consorcio de Tarjetas Dominicanas S.A.)

---

## Summary

CardNET exposes two End-of-Life Odoo ERP instances with publicly accessible database manager pages. Both versions are EOL and no longer receive security patches.

## Details

| Instance | Version | URL | EOL Since |
|----------|---------|-----|:---------:|
| Odoo v11 | 11.0 | `ecommerce.cardnet.com.do:6443` | Mar 2022 |
| Odoo v14 | 14.0 | `ser.cardnet.com.do` | Ene 2024 |

## Evidence

### PoC 1 — Version Fingerprinting via Error Disclosure

Odoo 11:
```bash
curl -sk -X POST "https://ecommerce.cardnet.com.do:6443/jsonrpc" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"call","params":{"service":"db","method":"list","args":[""]},"id":1}'
```
Response error traceback shows: `/opt/odoo/odoo11/` ✅

Odoo 14:
```bash
curl -sk -X POST "https://ser.cardnet.com.do/jsonrpc" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"call","params":{"service":"db","method":"list","args":[""]},"id":1}'
```
Response error traceback shows: `/opt/odoo/odoo14/` ✅

### PoC 2 — DB Manager Pages Publicly Accessible

```bash
# Odoo 14 DB manager (ser.cardnet.com.do)
curl -sk -o /dev/null -w "HTTP %{http_code} | Size: %{size_download}\n" \
  "https://ser.cardnet.com.do/web/database/manager"
# HTTP 200 | Size: 39967

# Odoo 11 DB manager (ecommerce:6443)
curl -sk -o /dev/null -w "HTTP %{http_code} | Size: %{size_download}\n" \
  "https://ecommerce.cardnet.com.do:6443/web/database/manager"
# HTTP 200 | Size: 36906
```

### PoC 3 — Session Cookies Issued

```bash
curl -skI "https://ser.cardnet.com.do/web/login" | grep -i set-cookie
# session_id=1f366bf729c08dc2c85a30e26617162c8012ed72
```

---

## Impact

| Issue | Risk |
|-------|------|
| EOL software (no security patches) | 🔴 Exploitable CVEs never fixed |
| DB manager publicly accessible | 🟡 Information disclosure |
| Version fingerprinting via error messages | 🟡 Internal path disclosure |
| Session cookies issued without auth | ℹ️ Reconnaissance |

---

## Remediation

1. Upgrade to supported Odoo version
2. Restrict `/web/database/manager` to internal network only
3. Disable detailed error messages in production
4. Audit for known CVEs applicable to Odoo 11 + 14
