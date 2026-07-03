# 🛡️ Audit & Bug Bounty — NSI LLC

Proyecto unificado de auditoría de seguridad, bug bounty hunting y pentesting.

## 📁 Estructura

```
audit-bugbounty/
├── README.md              ← Este archivo
├── tools/
│   ├── env.sh             ← Source this to set up PATH + aliases
│   ├── mitmproxy/         ← Configs, scripts, filters
│   ├── burp/              ← Burp Suite configs, extensions
│   └── go-tools/          ← Go tool wrappers / launchers
├── targets/
│   ├── starbucks/         → /root/bounty/starbucks/
│   ├── _template/         ← Copy this for new targets
│   └── <nombre>/          ← Per-target recon data
├── reports/
│   └── <target>/          ← Findings, reports, H1 submissions
├── scripts/
│   ├── recon.sh           ← Full recon pipeline (subfinder → httpx → nuclei)
│   ├── scan.sh            ← nuclei scan wrapper
│   └── live-probe.sh      ← httpx probing
└── flows/
    ├── web-app-audit.md   ← Web app audit methodology
    ├── api-pentest.md     ← API pentesting checklist
    └── recon-pipeline.md  ← Reconnaissance pipeline steps
```

## 🛠️ Arsenal

### Reconnaissance

| Tool | Uso | Comando típico |
|------|-----|----------------|
| **subfinder** v2.14.0 | Subdomain discovery | `subfinder -d target.com -all -silent` |
| **httpx** v1.6.1 | HTTP probing | `httpx -silent -title -status-code -tech-detect` |
| **gau** v2.2.4 | Wayback URLs | `gau --subs target.com` |
| **waybackurls** | Historical URLs | `waybackurls target.com` |
| **katana** v1.6.1 | Web crawling | `katana -u https://target.com -d 3 -jc -kf all` |
| **anew** | Dedup | `cat file1 file2 \| anew > deduped.txt` |

### Fuzzing & Scanning

| Tool | Uso | Comando típico |
|------|-----|----------------|
| **ffuf** v2.1.0 | Directory/parameter fuzzing | `ffuf -w wordlist -u https://target.com/FUZZ` |
| **nuclei** v3.3.9 | Vulnerability scanning | `nuclei -l live.txt -t ~/nuclei-templates/` |
| **gf** | Pattern filtering | `gf xss urls.txt` |

### Interception & Proxies

| Tool | Uso | Comando típico |
|------|-----|----------------|
| **mitmproxy** v12.2.3 | Interactive HTTPS proxy | `mitmproxy` |
| **mitmweb** v12.2.3 | Web UI proxy | `mitmweb --listen-port 8081` |
| **mitmdump** v12.2.3 | Headless proxy dump | `mitmdump -w traffic.mitm` |
| **Burp Suite CE** 2026.3.3 | Full-featured proxy/scanner | `burpsuite` |

### Packet Capture

| Tool | Uso | Comando típico |
|------|-----|----------------|
| **tshark** v4.2.2 | CLI packet analyzer | `tshark -i eth0 -w capture.pcap` |
| **tcpdump** v4.99.4 | CLI packet sniffer | `tcpdump -i eth0 -w capture.pcap` |

## 🚀 Quick Start

```bash
cd /root/audit-bugbounty

# 1. Set up environment
source tools/env.sh
audit-tools-check        # Verify all tools

# 2. Full recon on a target
./scripts/recon.sh target.com

# 3. Or per-tool:
subfinder -d target.com | httpx -silent | nuclei -t ~/nuclei-templates/

# 4. Intercept traffic:
mitmweb --listen-port 8081   # Browser → proxy
# Set browser proxy to localhost:8081
```

## 🎯 Active Targets

| Target | Program | Status | Findings |
|--------|---------|--------|----------|
| Starbucks | HackerOne | 🟡 WordPress sin explorar | VULN-1, VULN-2 (ServiceNow, reportado) |
| -- | -- | -- | -- |

## 📊 Reportes

- Starbucks ServiceNow: `reports/starbucks/hackerone_report_final.md`
- Template: `targets/_template/`
