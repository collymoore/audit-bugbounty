# Reconnaissance Pipeline

## Phase 1: Passive Recon

```
Target: example.com
├── WHOIS / DNS records
├── Cert.sh (SSL certificate transparency)
├── Shodan / Censys
├── Social media (LinkedIn, Twitter, GitHub)
├── Google dorking (site:target.com intitle:login)
└── Tech stack identification (Wappalyzer, whatweb)
```

**Tools:** `subfinder`, `gau`, `waybackurls`, `curl`

## Phase 2: Active Recon

```
├── Subdomain enumeration
│   └── subfinder -d target.com -all -silent > subs.txt
├── HTTP probing
│   └── httpx -l subs.txt -status-code -title -tech-detect > live.txt
├── Port scanning
│   └── nmap -sV -sC -p- target.com
└── Web crawling
    └── katana -list live.txt -d 3 -jc -kf all
```

**Tools:** `subfinder`, `httpx`, `nmap`, `katana`

## Phase 3: Content Discovery

```
├── Directory bruteforce
│   └── ffuf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u https://target.com/FUZZ
├── Parameter fuzzing
│   └── ffuf -w params.txt -u https://target.com/api/endpoint?FUZZ=test
├── Wayback machine
│   └── gau --subs target.com | gf xss
│   └── waybackurls target.com | grep -E ".js|.json|.yaml"
└── JS endpoint extraction
    └── curl target.com/main.js | grep -oP '"/api/[^"]+' | sort -u
```

**Tools:** `ffuf`, `gau`, `waybackurls`, `gf`, `curl`

## Phase 4: Vulnerability Scanning

```
├── Automated scanner
│   └── nuclei -l live.txt -c 50 -t ~/nuclei-templates/
├── Specific checks
│   └── nuclei -t takeovers/    ← Subdomain takeover
│   └── nuclei -t exposures/    ← Cloud / config exposure
│   └── nuclei -t misconfig/    ← Security misconfigs
└── Manual verification
    └── burpsuite / mitmproxy
```

**Tools:** `nuclei`, `burpsuite`, `mitmproxy`

## Phase 5: Reporting

```
├── Document each finding with reproduction steps
├── Include curl commands or browser screenshots
├── Classify severity (CVSS if applicable)
└── Submit via HackerOne / Bugcrowd
```
