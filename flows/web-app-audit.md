# Web Application Audit — Methodology

## 1. Reconnaissance
- [ ] Subdomain enumeration: `subfinder -d target.com -all`
- [ ] HTTP probing: `httpx -l subs.txt -title -status-code -tech-detect`
- [ ] Technology fingerprinting: `whatweb`, Wappalyzer
- [ ] JS bundle analysis: download + grep for endpoints, API keys

## 2. Information Gathering
- [ ] Check `/robots.txt`, `/sitemap.xml`, `/.well-known/`
- [ ] Check HTTP security headers: CSP, HSTS, X-Frame-Options
- [ ] Identify auth mechanisms: JWT, OAuth, session cookies
- [ ] Directory bruteforce: `ffuf -w /usr/share/wordlists/dirb/common.txt -u https://target.com/FUZZ`

## 3. Proxy Interception (mitmproxy / Burp)
1. Start proxy: `mitmweb --listen-port 8081`
2. Configure browser → proxy localhost:8081
3. Install mitmproxy CA cert in browser
4. Browse the app manually, capture all traffic
5. Look for hidden API endpoints, parameters, tokens

## 4. Vulnerability Testing
- [ ] **XSS**: reflected, stored, DOM-based
- [ ] **SQLi**: `' OR 1=1--`, parameter fuzzing
- [ ] **IDOR**: increment IDs in URLs/params
- [ ] **SSRF**: internal host fuzzing
- [ ] **Open Redirect**: `?url=//evil.com`
- [ ] **CSRF**: missing tokens on state-changing requests
- [ ] **JWT attacks**: alg=none, weak secret, expired tokens
- [ ] **Rate limiting**: brute force login endpoints
- [ ] **File upload**: path traversal, double extension, SVG XSS

## 5. API Security
- [ ] Enumerate API versions: `/api/v1`, `/api/v2`
- [ ] Check for mass assignment
- [ ] GraphQL introspection: `query { __schema { types { name } } }`
- [ ] API key leakage in JS bundles
- [ ] CORS misconfiguration: `curl -H "Origin: https://evil.com"`

## 6. Infrastructure
- [ ] Port scanning: Nmap common ports
- [ ] Subdomain takeover: `nuclei -t takeovers/`
- [ ] Cloud storage enumeration: `nuclei -t exposures/`
- [ ] SSL/TLS: weak ciphers, expired certs

## 7. Reporting
- [ ] Document each finding with POC (curl command or screenshot)
- [ ] Classify severity: Critical / High / Medium / Low / Info
- [ ] Write HackerOne/Bugcrowd report template
