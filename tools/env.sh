#!/bin/bash
# ============================================================
# Audit & Bug Bounty — Environment Setup
# Source this file:  source tools/env.sh
# ============================================================

# --- Go tools (subfinder, nuclei, ffuf, katana, httpx, gau, etc) ---
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# --- mitmproxy (installed in psychohistory venv, linked globally) ---
export MITMPROXY_SSLKEYLOGFILE="${HOME}/sslkeylogfile.txt"

# --- Burp Suite ---
alias burpsuite='java -jar /opt/burpsuite_community.jar'
alias burp='burpsuite'

# --- mitmproxy shortcuts ---
alias mitm='mitmproxy'
alias mitmw='mitmweb --listen-port 8081'
alias mitmd='mitmdump'

# --- tshark / tcpdump ---
alias pcap='sudo tshark'
alias sniff='sudo tcpdump'

# --- Quick recon aliases ---
alias subscan='subfinder -d'
alias probe='httpx -silent -title -status-code -tech-detect'
alias ffuf-dir='ffuf -w /usr/share/wordlists/dirb/common.txt -u'
alias nuclei-scan='nuclei -c 50'

# --- Helper: verify all tools ---
audit-tools-check() {
    echo "=== Go Tools ==="
    for t in subfinder nuclei ffuf katana httpx gau waybackurls gf anew; do
        which "$t" >/dev/null 2>&1 && echo "  ✅ $t" || echo "  ❌ $t"
    done
    echo "=== Proxies ==="
    which mitmproxy >/dev/null 2>&1 && echo "  ✅ mitmproxy" || echo "  ❌ mitmproxy"
    which mitmdump >/dev/null 2>&1 && echo "  ✅ mitmdump" || echo "  ❌ mitmdump"
    which mitmweb >/dev/null 2>&1 && echo "  ✅ mitmweb" || echo "  ❌ mitmweb"
    [ -f /opt/burpsuite_community.jar ] && echo "  ✅ Burp Suite CE" || echo "  ❌ Burp Suite CE"
    echo "=== Packet Capture ==="
    which tshark >/dev/null 2>&1 && echo "  ✅ tshark (v$(tshark --version 2>&1 | head -1 | grep -oP '\d+\.\d+\.\d+'))" || echo "  ❌ tshark"
    which tcpdump >/dev/null 2>&1 && echo "  ✅ tcpdump" || echo "  ❌ tcpdump"
}
