#!/usr/bin/env python3
"""
NSI Shodan Recon Pipeline — Bug Bounty Arsenal
Integración de Shodan en el flujo de bug bounty.
API Key configurada vía `shodan init` en el VPS.
 
Uso:
  python3 nsi-shodan.py <target.com>      # Recon completo
  python3 nsi-shodan.py --ip <IP>         # Info de IP
  python3 nsi-shodan.py --net <CIDR>      # Escanear red
  python3 nsi-shodan.py --search <query>  # Búsqueda libre
"""

import subprocess, json, sys, os

SHODAN_CMD = "shodan"

def run(cmd):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        # Strip deprecation warnings
        lines = [l for l in r.stdout.split('\n') if 'UserWarning' not in l and 'pkg_resources' not in l]
        return '\n'.join(l for l in lines if l.strip())
    except subprocess.TimeoutExpired:
        return "[TIMEOUT]"

def recon_domain(domain):
    print(f"\n{'='*60}")
    print(f"🎯 NSI SHODAN RECON — {domain}")
    print(f"{'='*60}")
    
    print(f"\n📡 Domain info:")
    print(run([SHODAN_CMD, "domain", domain]))
    
    queries = [
        (f"hostname:{domain}", f"Servicios expuestos"),
        (f"ssl.cert.subject.CN:{domain}", f"Certificados SSL"),
    ]
    for query, desc in queries:
        result = run([SHODAN_CMD, "count", query])
        print(f"  {desc}: {result}")

def recon_ip(ip):
    print(f"\n{'='*60}")
    print(f"📍 NSI SHODAN IP — {ip}")
    print(f"{'='*60}")
    print(run([SHODAN_CMD, "host", ip]))

def recon_net(netblock):
    print(f"\n{'='*60}")
    print(f"🌐 NSI SHODAN NETBLOCK — {netblock}")
    print(f"{'='*60}")
    hunts = [
        (f"net:{netblock} port:3306", "MySQL expuesto"),
        (f"net:{netblock} port:3389", "RDP expuesto"),
        (f"net:{netblock} port:22", "SSH expuesto"),
        (f"net:{netblock} port:21", "FTP expuesto"),
        (f"net:{netblock} port:1433", "MSSQL expuesto"),
        (f"net:{netblock} port:6379", "Redis expuesto"),
        (f"net:{netblock} port:27017", "Mongo expuesto"),
        (f"net:{netblock} product:Apache", "Apache"),
        (f"net:{netblock} product:IIS", "IIS"),
        (f"net:{netblock} product:nginx", "Nginx"),
    ]
    for query, desc in hunts:
        result = run([SHODAN_CMD, "count", query])
        if result and '0' not in result:
            print(f"  {desc}: {result}")

def search_free(query):
    print(f"\n{'='*60}")
    print(f"🔎 NSI SHODAN SEARCH — {query}")
    print(f"{'='*60}")
    result = run([SHODAN_CMD, "search", "--fields", "ip_str,port,org,hostnames", query])
    print(result)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    if sys.argv[1] == "--ip" and len(sys.argv) > 2:
        recon_ip(sys.argv[2])
    elif sys.argv[1] == "--net" and len(sys.argv) > 2:
        recon_net(sys.argv[2])
    elif sys.argv[1] == "--search":
        search_free(' '.join(sys.argv[2:]))
    else:
        recon_domain(sys.argv[1])
