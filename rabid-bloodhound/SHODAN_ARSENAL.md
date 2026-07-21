# NSI Shodan Arsenal — Bug Bounty Integration

## Setup
```bash
shodan init TU_API_KEY    # Obtener en https://account.shodan.io/
shodan info                # Verificar créditos disponibles
```

## Recon Rápido por Dominio
```bash
# Servicios expuestos
shodan count hostname:corominas.com.do

# Certificados SSL (dominios relacionados)
shodan search --fields ip_str,port,org ssl.cert.subject.cn:corominas.com.do

# Tecnologías
shodan search --fields ip_str,port,http.title hostname:corominas.com.do
```

## Recon por IP
```bash
shodan host 190.167.229.30    # Info completa de la IP
shodan host 162.210.96.116
```

## Buscar Redes (netblocks)
```bash
shodan count net:190.167.229.0/24
shodan search net:190.167.229.0/24 port:3306,3389,21,22,1433
shodan search --fields ip_str,port,org "190.167.229.0/24"
```

## Hunts Comunes para Bug Bounty
```bash
# 🎯 WordPress sin parche
shodan search http.component:"wordpress" country:DO

# 🎯 IIS + ASP.NET (targets RD)
shodan search "IIS" "ASP.NET" country:DO

# 🎯 Bases de datos expuestas
shodan search "MySQL" country:DO product:"MySQL" -port:3306

# 🎯 Firebase mal configurado
shodan search "firebase" "open" ".com.do"

# 🎯 RDP expuesto (potenciales servidores)
shodan search "country:DO port:3389"

# 🎯 Cámaras expuestas
shodan search "country:DO server:GoAhead"
```

## NSI Pipeline Script
```bash
python3 /home/nmoore/nsi-shodan.py corominas.com.do    # Recon completo
python3 /home/nmoore/nsi-shodan.py --ip 190.167.229.30  # Info de IP
python3 /home/nmoore/nsi-shodan.py --net 190.167.229.0/24  # Escanear red
```

## Shodan Monitor (Alertas Automáticas)
```bash
shodan alert create "corominas" 190.167.229.30    # Monitorear IP
shodan alert create "nsi-targets" corominas.com.do  # Monitorear dominio
shodan alert list                                    # Ver alertas activas
```

## Exportar Resultados
```bash
shodan download resultados.json.gz "hostname:corominas.com.do"
shodan parse --fields ip_str,port,org resultados.json.gz
```

## Integración con el Pipeline NSI
Agregar al Threat Intel watchdog (`nsi-threat-intel.py`):
- Buscar nuevas IPs/hosts del target semanalmente
- Alertar cuando aparezcan nuevos puertos en IPs conocidas
- Detectar exposiciones de datos (bases de datos abiertas, RDP, etc.)
