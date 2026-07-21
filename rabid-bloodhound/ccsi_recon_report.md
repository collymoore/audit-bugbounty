# CCSI — Recon Report (10 Jul 2026)

## Target
- URL: https://ccsi.org.do
- Name: Clínica Cristiana de Salud Integral
- Location: San Juan de la Maguana, RD
- Phone: 809-557-4230
- Hosting: GoDaddy (72.167.67.100)
- www: NXDOMAIN

## Tech Stack
| Component | Version | Status |
|-----------|---------|--------|
| WordPress | 7.0.1 | ✅ Current |
| PHP | 7.4.33 | 🔴 EOL Nov 2022 |
| Server | Apache | GoDaddy |
| Theme | Astra | — |

## Plugins
| Plugin | Version | Risk |
|--------|---------|------|
| Elementor | 4.1.4 | 🟢 Current |
| Wordfence | 8.2.2 | 🟢 Current (security) |
| Integrate Firebase | 0.10.0 | 🟡 Low-known plugin |
| WPForms Lite | 1.10.2.1 | 🟡 Active contact form |
| Astra Starter Sites | — | 🟢 |
| Header Footer Elementor | — | 🟢 |
| WooCommerce | installed | 🔴 Cart/checkout 404 |

## Firebase
- Project: ccsi-36d7f
- API Key: AIzaSyCCv_U1_U0_yGrpKosqkpJsG17gQuauuqg
- Auth Domain: ccsi-36d7f.firebaseapp.com
- Firestore: 404 (not configured)
- RTDB: 404 (no databaseURL)
- Auth: CONFIGURATION_NOT_FOUND

## Security Headers
- HSTS: ❌
- CSP: ❌
- XFO: ❌
- X-Content-Type-Options: ❌

## Attack Surface
- ✅ /wp-login.php (200)
- ✅ xmlrpc.php (405, methods: multicall, pingback, mt.publishPost)
- ✅ /wp-json/wp/v2/users (401 — blocked but responds)
- ✅ PHP 7.4.33 EOL
- ❌ No Cloudflare
- ❌ No security headers

## Findings Summary
1. PHP 7.4.33 EOL — no security patches since Nov 2022
2. Integrate Firebase plugin — Firebase project not configured
3. xmlrpc active — brute force vector
4. wp-login exposed
5. No security headers
