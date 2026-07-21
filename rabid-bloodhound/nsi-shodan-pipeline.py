#!/usr/bin/env python3
"""
NSI Shodan Recon Pipeline — Bug Bounty Arsenal
Integración de Shodan en el flujo de bug bounty.
 
Uso:
  shodan init API_KEY                     # Configurar API key
  python3 nsi-shodan.py <target.com>      # Recon completo
  python3 nsi-shodan.py --ip <IP>         # Info de IP
  python3 nsi-shodan.py --net <CIDR>      # Escanear red
"""

import subprocess, json, sys, os

SHODAN_CMD = "shodan"

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return r.stdout.strip()

def recon_domain(domain):
    """Recon completo de dominio"""
    print(f"\n{'='*50}")
    print(f"🎯 NSI SHODAN RECON — {domain}")
    print(f"{'='*50}")
    
    # 1. Info del dominio
    print(f"\n📡 DOMAIN INFO:")
    print(run([SHODAN_CMD, "domain", domain]))
    
    # 2. Buscar servicios expuestos
    queries = [
        (f"hostname:{domain}", f"Servicios en {domain}"),
        (f"ssl.cert.subject.CN:{domain}", f"Certificados SSL"),
        (f"http.title:{domain}", f"Títulos HTTP"),
    ]
    
    for query, desc in queries:
        print(f"\n🔍 {desc}:")
        result = run([SHODAN_CMD, "count", query])
        print(f"  Resultados: {result}")

def recon_ip(ip):
    """Info de una IP específica"""
    print(f"\n{'='*50}")
    print(f"📍 NSI SHODAN IP — {ip}")
    print(f"{'='*50}")
    
    result = run([SHODAN_CMD, "host", ip])
    print(result)

def recon_net(netblock):
    """Escanear un netblock"""
    print(f"\n{'='*50}")
    print(f"🌐 NSI SHODAN NETBLOCK — {netblock}")
    print(f"{'='*50}")
    
    queries = [
        (f"net:{netblock}", f"Servicios en {netblock}"),
        (f"net:{netblock} product:Apache", "Apache servers"),
        (f"net:{netblock} product:IIS", "IIS servers"),
        (f"net:{netblock} product:nginx", "Nginx servers"),
        (f"net:{netblock} \"230 Login\"", "FTP público"),
        (f"net:{netblock} \"220\" \"vsFTPd\"", "FTP servers"),
        (f"net:{netblock} port:3306", "MySQL expuesto"),
        (f"net:{netblock} port:3389", "RDP expuesto"),
        (f"net:{netblock} port:22", "SSH expuesto"),
        (f"net:{netblock} port:21", "FTP expuesto"),
        (f"net:{netblock} \"default password\"", "Default creds"),
    ]
    
    for query, desc in queries:
        result = run([SHODAN_CMD, "count", query])
        if result and "0" not in result:
            print(f"  {desc}: {result}")

def search_find(target):
    """Búsqueda libre"""
    print(f"\n{'='*50}")
    print(f"🔎 NSI SHODAN SEARCH — {target}")
    print(f"{'='*50}")
    
    queries = [
        (target, "Resultados generales"),
        (f"hostname:{target} port:443", "HTTPS"),
        (f"hostname:{target} port:80", "HTTP"),
        (f"hostname:{target} \"230 Login\"", "FTP anónimo"),
        (f"hostname:{target} \"x-powered-by\"", "Tech stack"),
        (f"hostname:{target} \"Server:\"", "Servidores"),
    ]
    
    for query, desc in queries:
        result = run([SHODAN_CMD, "count", query])
        print(f"  {desc}: {result}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    # Check if shodan is initialized
    status = run([SHODAN_CMD, "info"])
    if "Credits" not in status:
        print("⚠️  Shodan no inicializado. Ejecuta: shodan init TU_API_KEY")
        print("   (Regístrate en https://account.shodan.io/ para obtener API key)")
        sys.exit(1)
    
    if sys.argv[1] == "--ip" and len(sys.argv) > 2:
        recon_ip(sys.argv[2])
    elif sys.argv[1] == "--net" and len(sys.argv) > 2:
        recon_net(sys.argv[2])
    elif sys.argv[1] == "--search" and len(sys.argv) > 2:
        search_find(sys.argv[2])
    else:
        recon_domain(sys.argv[1])
