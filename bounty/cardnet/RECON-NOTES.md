# CardNET (cardnet.com.do) — Subdomain HTTP Probing & Fingerprinting

**Target:** Consorcio de Tarjetas Dominicanas S.A. — Dominican Republic payment processor  
**Probe Date:** 2026-07-15  
**Subdomain Source:** subfinder  

---

## Live Services

| # | Subdomain | HTTP | Content-Length | Server | Title | Tech Stack | WAF |
|---|-----------|------|---------------|--------|-------|-----------|-----|
| 1 | www.cardnet.com.do | 200 | 78,298 | Apache | CardNET Nos Une \| CardNET | Nuxt.js (Vue), SSR | ✅ Imperva/Incapsula |
| 2 | autoservicio.cardnet.com.do | 302 | 1,727 | nginx | (ASP.NET login) | ASP.NET WebForms, nginx proxy | ✅ Imperva/Incapsula |
| 3 | auraportal.cardnet.com.do | 302 | 0 | — | (ASP.NET Login) | ASP.NET `Login.aspx` | ✅ Imperva/Incapsula |
| 4 | auraportalext.cardnet.com.do | 302 | 0 | — | (ASP.NET Login) | ASP.NET `Login.aspx` | ✅ Imperva/Incapsula |
| 5 | comercios.cardnet.com.do | 200 | 817 | — (no Server header) | Merchant Portal | Vue.js SPA (`/assets/index-*.js`), ASP.NET backend | ✅ Imperva/Incapsula |
| 6 | developers.cardnet.com.do | 200 | 212 | — | Developer Portal (Incapsula-gated) | Protected behind Incapsula challenge | ✅ Imperva/Incapsula |
| 7 | ecommerce.cardnet.com.do | 200 | 31 | Apache | (Odoo health OK) | Odoo backend health check `"OK"` | ✅ Imperva/Incapsula |
| 8 | **ecommerce.cardnet.com.do:6443** | **200** | 218 | **Apache** | **Login \| Soluciones CardNET** | **Odoo ERP** — full web client | ✅ Imperva/Incapsula |
| 9 | **ecommerce.cardnet.com.do:8443** | **200** | 890 | **Apache** | **CardNET \| BackOffice Comercios** | **AngularJS SPA** (`ng-app=app`) | ✅ Imperva/Incapsula |
| 10 | **empleos.cardnet.com.do** | **200** | 53,829 | **nginx** | **Solicitud de Empleo CardNET** | **Next.js** (React) job application portal | ✅ Imperva/Incapsula |
| 11 | epay.cardnet.com.do | 200 | 1,520 | Apache | CardNET \| Error | ASP.NET error landing, `NODE01` server | ✅ Imperva/Incapsula |
| 12 | **lab.cardnet.com.do** | **200** | 1,476 | **Apache** | **LAB CardNET \| Inicio** | ASP.NET landing page (NO WAF!) | **❌ None** |
| 13 | labservicios.cardnet.com.do | 200 (→404) | 15→1,843 | nginx | (SvelteKit 404) | **SvelteKit** app (`x-sveltekit-page: true`) | ✅ Imperva/Incapsula |
| 14 | **mesadeservicio.cardnet.com.do** | **200** | 17,499 | **nginx** | **ManageEngine ServiceDesk Plus** | **ManageEngine SDPlus** (ITSM/helpdesk) | ✅ Imperva/Incapsula |
| 15 | mercury.cardnet.com.do | 200 | 1,386 | Apache | CardNET \| Error | ASP.NET error landing (NO WAF!) | **❌ None** |
| 16 | mta-sts.acc.cardnet.com.do | 200 | 98 | nginx | MTA-STS Policy | Static TXT-like HTML | ❌ None |
| 17 | mta-sts.comunicaciones.cardnet.com.do | 200 | 98 | nginx | MTA-STS Policy | Static TXT-like HTML | ❌ None |
| 18 | **pagosrecurrentes.cardnet.com.do** | **200** | 256 | **IIS** | **PayNet** | **IIS / ASP.NET** — redirects to `/apaymentweb/default.aspx` | ✅ Imperva/Incapsula |
| 19 | **ser.cardnet.com.do** | **302** | 317 | **Apache** | (Odoo redirect) | **Odoo ERP** — redirects to `/web/login` | ✅ Imperva/Incapsula |
| 20 | servicios.cardnet.com.do | 200 | 1,520 | Apache | CardNET \| Error | ASP.NET error landing | ✅ Imperva/Incapsula |
| 21 | chk.cardnet.com.do | **403** | 199 | **CPWS** | 403 Forbidden | **Check Point Web Security** appliance | ❌ None |
| 22 | vacantes.cardnet.com.do | **400** | 334→466 | nginx | Bad Request | nginx, Incapsula-gated (likely alias of empleos) | ✅ Imperva/Incapsula |

### Non-Responding (Connection Timeout / DNS / Refused)

All of the following returned HTTP 000 (no response on port 443):

ach.cardnet.com.do, analytics.cardnet.com.do, ath.cardnet.com.do, autoconfig.cardnet.com.do, autodiscover.cardnet.com.do, certauth.fs.cardnet.com.do, correoseguro.cardnet.com.do, csrp.cardnet.com.do, desarrolladores.cardnet.com.do, dialin.cardnet.com.do, expe.cardnet.com.do, fs.cardnet.com.do, lab02.cardnet.com.do, lyncdiscover.cardnet.com.do, mail.acc.cardnet.com.do, mail.cardnet.com.do, meet.cardnet.com.do, monitor.cardnet.com.do, ns1.cardnet.com.do, ns2.cardnet.com.do, ns3.cardnet.com.do, origin.cardnet.com.do, security.cardnet.com.do, sentry.cardnet.com.do, shop.cardnet.com.do, stream.cardnet.com.do, uranus.cardnet.com.do, vacnet.cardnet.com.do, vcnet.cardnet.com.do, video.cardnet.com.do, vlcnet.cardnet.com.do, wac.cardnet.com.do, www.auraportal.cardnet.com.do, www.auraportalext.cardnet.com.do

These are likely DNS-only records (MX, NS, autodiscover, etc.) with no HTTP service, or internal-only hosts.

---

## Interesting Findings

### 🚨 Exposed Without WAF (No Incapsula)

| Host | Risk | Details |
|------|------|---------|
| **lab.cardnet.com.do** | **HIGH** | ASP.NET landing page, NO WAF protection. "LAB CardNET" — likely a staging/dev environment. Direct origin access. |
| **mercury.cardnet.com.do** | **MEDIUM** | Apache server, ASP.NET error stub. NO WAF. Named `mercury` — possibly a legacy/internal server. |
| **chk.cardnet.com.do** | **MEDIUM** | **Check Point Web Security** (CPWS) appliance responding with 403. NO WAF — the CPWS itself is the security layer. Named `chk` (Check). |
| **mta-sts.*.cardnet.com.do** | **LOW** | Static MTA-STS policy files on nginx. Expected. |

### Odoo ERP Exposure (High Value)

**ecommerce.cardnet.com.do:6443** — Full Odoo web client accessible:
- Odoo database selector accessible at `/web/database/selector`
- Login page at `/web/login`
- CSRF token exposed: `e8c1659d9fc6d6b393cf5fd11a8fb61823068342o`
- Company: CardNET, Website ID: 1
- Domain cookies include `session_id` with 90-day expiry

**ser.cardnet.com.do** — Separate Odoo instance:
- Redirects to `/web/login?redirect=https%3A%2F%2Fser.cardnet.com.do%2F`
- Named `ser` (Servicios) — internal services Odoo

### ManageEngine ServiceDesk Plus

**mesadeservicio.cardnet.com.do** — Full IT helpdesk / ITSM platform exposed:
- Title: "ManageEngine ServiceDesk Plus"
- Session cookie: `SDPSESSIONID`
- nginx proxy with Incapsula WAF
- CSP allows `cardnet.com.do` and `mesadeservicio.cardnet.com.do`

### Dev & Staging Environments

| Host | Tech | Notes |
|------|------|-------|
| developers.cardnet.com.do | (Incapsula-gated) | Developer portal, blocked by Incapsula challenge |
| lab.cardnet.com.do | ASP.NET | LAB environment, **NO WAF** |
| labservicios.cardnet.com.do | SvelteKit | LAB servicios app (returns 404 on root) |
| empleos.cardnet.com.do | Next.js (React) | Job application portal, Incapsula-protected |

### BackOffice / Admin Portals

| Host | Port | Tech | Notes |
|------|------|------|-------|
| ecommerce.cardnet.com.do | **8443** | AngularJS | BackOffice Comercios (merchant backoffice) |
| autoservicio.cardnet.com.do | 443 | ASP.NET WebForms | Self-service merchant portal |
| auraportal.cardnet.com.do | 443 | ASP.NET | Aura portal (login.aspx) |
| auraportalext.cardnet.com.do | 443 | ASP.NET | Aura portal external (login.aspx) |
| comercios.cardnet.com.do | 443 | Vue.js SPA | Merchant Portal |

### Payment Systems

| Host | Tech | Notes |
|------|------|-------|
| epay.cardnet.com.do | Apache, ASP.NET | ePay error page, server `NODE01` |
| pagosrecurrentes.cardnet.com.do | **IIS** | "PayNet" — recurring payments. Redirects to `/apaymentweb/default.aspx` |
| ecommerce.cardnet.com.do:6443 | Apache, Odoo | Odoo ecommerce/ERP |
| ser.cardnet.com.do | Apache, Odoo | Internal services Odoo |

### Infrastructure Observations

- **HPKP (HTTP Public Key Pinning)** active on: `ecommerce.cardnet.com.do`, `www.cardnet.com.do` — notably uses SHA256 of empty string `47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=` as backup pin (weak practice)
- **HSTS**: `max-age=31536000; includeSubDomains` on most hosts
- **X-Frame-Options: SAMEORIGIN** — common across all apps
- **CSP**: Varies per app — some have `default-src 'unsafe-inline'` (weak)
- **Server naming**: `NODE01` visible on epay

---

## WAF Coverage Summary

| Status | Count | Hosts |
|--------|-------|-------|
| ✅ Imperva/Incapsula | **16** | auraportal, auraportalext, autoservicio, comercios, developers, ecommerce (all ports), empleos, epay, labservicios, mesadeservicio, pagosrecurrentes, ser, servicios, vacantes, www.cardnet |
| ❌ No WAF | **6** | chk (CPWS self-protected), lab.cardnet, mercury, mta-sts.acc, mta-sts.comunicaciones |

All 33 remaining subdomains had no HTTP response.

---

## Non-Standard Port Probe Results

| Target | Port | HTTP | Server | Title | Notes |
|--------|------|------|--------|-------|-------|
| ecommerce.cardnet.com.do | **6443** | 200 | Apache | Login \| Soluciones CardNET | **Odoo ERP web client** |
| ecommerce.cardnet.com.do | **8443** | 200 | Apache | CardNET \| BackOffice Comercios | **AngularJS BackOffice** |
| ecommerce.cardnet.com.do | 8080 | 000 | — | — | No response |
| ecommerce.cardnet.com.do | 443 | 200 | Apache | (Odoo health OK) | Same as main |
| www.cardnet.com.do | 8443 | 301 | — | — | Redirects to HTTPS 443 |
| www.cardnet.com.do | 8080 | 301 | — | — | Redirects to HTTPS 443 |
| www.cardnet.com.do | 6443 | 301 | — | — | Redirects to HTTPS 443 |
| correoseguro.cardnet.com.do | 8443 | 000 | — | — | No response |
| correoseguro.cardnet.com.do | 587 | 000 | — | — | No SMTP response |
| correoseguro.cardnet.com.do | 993 | 000 | — | — | No IMAP response |
| epay.cardnet.com.do | 8443 | 000 | — | — | No response |
| epay.cardnet.com.do | 6443 | 000 | — | — | No response |

---

## Technology Stack Summary

| Technology | Hosts |
|-----------|-------|
| **Odoo ERP** | ecommerce.cardnet.com.do:6443, ser.cardnet.com.do |
| **ASP.NET WebForms** | autoservicio, auraportal, auraportalext, epay, mercury, servicios, lab |
| **Vue.js SPA** | comercios.cardnet.com.do |
| **AngularJS** | ecommerce.cardnet.com.do:8443 (BackOffice) |
| **Next.js (React)** | empleos.cardnet.com.do |
| **Nuxt.js (Vue)** | www.cardnet.com.do (main site) |
| **SvelteKit** | labservicios.cardnet.com.do |
| **ManageEngine** | mesadeservicio.cardnet.com.do |
| **IIS /.NET** | pagosrecurrentes.cardnet.com.do (PayNet) |
| **Check Point CPWS** | chk.cardnet.com.do |
| **nginx** | autoservicio, empleos, labservicios, mesadeservicio, mta-sts, vacantes |
| **Apache** | ecommerce, epay, lab, mercury, ser, servicios, www.cardnet |

---

*Probe completed 2026-07-15. All checks performed with `curl` (HTTPS, follow redirects). WAF detection via Incapsula/Imperva cookies (`visid_incap*`, `incap_ses*`) and headers (`X-CDN: Imperva`, `X-Iinfo`).*
