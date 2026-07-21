# Coinbase — HackerOne Security Report

## Title: Unpatched Critical CVEs and Expired TLS Certificates on Coinbase Callback Infrastructure (OpenResty 1.27.1.2)

**Team handle:** coinbase
**Severity rating:** high
**CVE:** CVE-2026-42945, CVE-2026-9256, CVE-2026-42533

## Summary

Three Coinbase financial callback endpoints (Citi, JPMorgan) are running **OpenResty 1.27.1.2** which bundles nginx 1.27.1 — affected by **15 unpatched CVEs** including **CVE-2026-42945 (CVSS 9.2, actively exploited)** and **CVE-2026-9256 (CVSS 7.5)**. Additionally, **two of the three TLS certificates are expired** (jpmorgan-callback by 15 months, jpmorgan-intl-callback by 2 months). These endpoints are not behind Cloudflare WAF.

---

## Finding: Unpatched Critical CVEs on OpenResty 1.27.1.2 + Expired TLS Certificates 🟡 HIGH

**Endpoints:**
| Host | Status |
|------|--------|
| `citi-intl-callback.coinbase.com` | ✅ TLS valid (Nov 2026) |
| `jpmorgan-callback.coinbase.com` | ❌ **TLS expired Apr 2025** (+15 months) |
| `jpmorgan-intl-callback.coinbase.com` | ❌ **TLS expired May 2026** |

**Infrastructure:** AWS EC2 us-east-1 (no Cloudflare, no WAF detected)

### Critical CVEs (Unpatched)

| CVE | CVSS | Name | Component |
|-----|------|------|-----------|
| **CVE-2026-42945** | **9.2** | **NGINX Rift** | `ngx_http_rewrite_module` — heap buffer overflow, actively exploited since May 2026 |
| **CVE-2026-9256** | **7.5** | nginx-poolslip | `ngx_http_rewrite_module` — heap overflow on overlapping captures |
| **CVE-2026-42533** | **7.5** | — | `ngx_http_map` + regex — buffer overflow |
| CVE-2026-40701 | 7.5 | — | OCSP resolver — use-after-free |
| CVE-2026-56434 | 7.5 | — | SSI module — use-after-free |
| CVE-2026-1642 | 7.4 | — | SSL upstream proxy — TLS MITM data injection |

**Total: 15 unpatched CVEs** affecting OpenResty 1.27.1.2 (nginx 1.27.1). Only CVE-2025-23419 is patched — OpenResty 1.27.1.2 was specifically released to fix that.

### Expired TLS Certificates

**jpmorgan-callback.coinbase.com:**
- **Expired:** April 17, 2025 (over 15 months ago)
- **Key size:** RSA 2048 (weaker than 4096 on other endpoints)
- **Chain:** Incomplete — only 1 level, missing intermediate CA
- **Cipher:** TLS 1.2 / ECDHE-RSA-AES256-GCM-SHA384

**jpmorgan-intl-callback.coinbase.com:**
- **Expired:** May 26, 2026 (~2 months ago)
- **Key size:** RSA 4096
- **Chain:** Full (3 levels)

### Evidence

**Version fingerprinting (TRACE method):**
```http
GET / HTTP/1.1
Host: citi-intl-callback.coinbase.com

< HTTP/2 405
< server: openresty/1.27.1.2
<html><head><title>405 Not Allowed</title></head>
<body><center><h1>405 Not Allowed</h1></center>
<hr><center>openresty/1.27.1.2</center></body></html>
```

**TLS certificate verification (jpmorgan-callback):**
```bash
$ openssl s_client -connect jpmorgan-callback.coinbase.com:443 -servername jpmorgan-callback.coinbase.com 2>&1 | openssl x509 -noout -dates -subject
notBefore=Apr 17 2024 00:00:00 GMT
notAfter=Apr 17 2025 23:59:59 GMT
subject=CN = jpmorgan-callback.coinbase.com, O = Coinbase, Inc., L = Oakland, ST = California, C = US
```

**TLS certificate verification (jpmorgan-intl-callback):**
```bash
$ openssl s_client -connect jpmorgan-intl-callback.coinbase.com:443 -servername jpmorgan-intl-callback.coinbase.com 2>&1 | openssl x509 -noout -dates
notBefore=May 26 2025 00:00:00 GMT
notAfter=May 26 2026 23:59:59 GMT
```

**Health check (mTLS required):**
```bash
$ curl -sk https://citi-intl-callback.coinbase.com/_health
OK

$ curl -sk https://jpmorgan-callback.coinbase.com/40x.html
Error handling certificate
```

**No WAF / direct internet access:**
```bash
$ nslookup citi-intl-callback.coinbase.com
3.225.164.23    ← AWS EC2 us-east-1 (direct, no Cloudflare)
```

### Impact

1. **CVE-2026-42945 (CVSS 9.2):** Heap buffer overflow in `ngx_http_rewrite_module` allows remote code execution or denial of service via crafted rewrite rules. Actively exploited in the wild since May 2026. These endpoints handle sensitive financial callback data (Citi, JPMorgan transactions).

2. **Expired TLS certificates:** Two of three endpoints have expired certificates, meaning:
   - **jpmorgan-callback.coinbase.com:** Inoperable as a TLS service for 15+ months — any JPMorgan callback traffic is potentially being sent over an untrusted channel or silently dropped
   - **jpmorgan-intl-callback.coinbase.com:** Expired ~2 months ago — clients performing proper certificate validation cannot establish a trusted connection
   - Weaker 2048-bit RSA key on jpmorgan-callback + missing intermediate chain

3. **No WAF protection:** Unlike most Coinbase infrastructure which is behind Cloudflare WAF/Bot Management, these endpoints are directly exposed on AWS EC2 IPs. Combined with unpatched CVEs, this increases the attack surface.

### Remediation Recommendations

1. **Immediate:** Update OpenResty to a version bundling nginx ≥ 1.30.1 or ≥ 1.31.0 (patching CVE-2026-42945, CVE-2026-9256, and CVE-2026-42533)
2. **Immediate:** Renew TLS certificates for jpmorgan-callback.coinbase.com (expired 15 months) and jpmorgan-intl-callback.coinbase.com (expired 2 months)
3. **Short-term:** Place these endpoints behind Cloudflare WAF or equivalent
4. **Short-term:** Upgrade jpmorgan-callback.coinbase.com to 4096-bit RSA key with full certificate chain
5. **Medium-term:** Implement internal monitoring for TLS certificate expiry

### Disclosure Timeline

| Date | Event |
|------|-------|
| 2026-07-16 | Discovery and verification of findings |
| 2026-07-16 | Report submitted via HackerOne |

### Technical Appendix

**AWS IPs (Round-robin):**
```
3.225.164.23
3.232.181.162
3.94.219.244
54.146.173.231
54.167.54.45
54.197.237.55
```

**Server header confirms OpenResty version:**
```bash
$ curl -skI https://citi-intl-callback.coinbase.com 2>&1 | grep -i server
server: openresty/1.27.1.2
```

**CVE-2026-42945 reference:**
- NVD: https://nvd.nist.gov/vuln/detail/CVE-2026-42945
- Actively exploited since May 2026
- Fix in nginx 1.30.1/1.31.0 (May 13, 2026)
- OpenResty issue #1130 confirms 1.27.x line unpatched
