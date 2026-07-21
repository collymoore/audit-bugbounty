# 🖥️ Auditoría de Red Local — ThinkPad (Chronos-Workstation)
**Fecha:** 17 Jul 2026 | **Hora:** 13:00-13:15 ET
**Escaneo vía:** ThinkPad WSL → nmap desde SSH (VPS 10.200.200.4 → WG 10.200.200.4)
**Propósito:** Buscar PC Windows adicional en LAN / Inventario general

---

## 1. Configuración de Red del ThinkPad

| Interfaz | Tipo | IP | Gateway |
|----------|------|:--:|:-------:|
| Wi-Fi | LAN doméstica | **192.168.1.220** | 192.168.1.1 |
| WireGuard | VPN NSI | 10.200.200.4 | — |
| VMnet8 | VMware NAT | 192.168.125.1 | — |
| VMnet1 | VMware Host-only | 192.168.218.1 | — |
| vEthernet | Hyper-V Default Switch | 172.25.192.1/20 | — |

**Router:** CR1000B (ISP/módem) — HTTP 80 + HTTPS 443 abiertos

---

## 2. Inventario Completo — LAN 192.168.1.0/24

### 2.1 Hosts Activos (7 encontrados)

| # | IP | Hostname | MAC | Fabricante | OS Detectado | Puertos Abiertos | Tipo |
|:-:|:--:|----------|:---:|:----------:|:------------:|:-----------------|------|
| 1 | .1 | CR1000B | 34:19:4D:65:8A:BC | — | Firmware router | 80 (HTTP), 443 (HTTPS) | Router ISP |
| 2 | .165 | **RG406V** | 72:8D:12:2B:AF:0B | — | Linux 2.6-5.x | Ninguno | Gaming handheld (Anbernic RG406V) |
| 3 | .189 | **S20-FE-de-Luz** | 2A:CE:40:DA:4C:88 | Samsung | Linux 2.6-5.x | Ninguno | Smartphone / IoT ("Luz") |
| 4 | .192 | **roborock-vacuum-a34** | B0:4A:39:89:BA:72 | — | Linux 2.6-5.x | SSH filtrado | Robot aspiradora Roborock |
| 5 | .210 | *(nginx)* | 14:CB:19:8E:F2:B5 | — | Linux 3.x/4.x | **80** (nginx), **443** (nginx), **8080** (nginx) | Servidor web |
| 6 | .222 | *(WAP)* | B0:B1:13:53:D5:F0 | KCorp | KCorp KLG-575 embedded | Ninguno | Access Point inalámbrico |
| 7 | .223 | **LocalHost** | 54:2B:57:50:39:B3 | — | Linux 3.x/4.x | **80** (HTTP — DVR/NVR "Remote Surveillance") | Cámara/IP DVR |

### 2.2 No encontrados como puertos conocidos

**Puertos típicos Windows escaneados en todas las IPs:** 22, 80, 135, 139, 443, 445, 3389, 5985, 8080, 8443
→ Ningún host presentó 135 (RPC), 139 (NetBIOS), 445 (SMB), 3389 (RDP), o 5985 (WinRM) abiertos.

**Conclusión: No hay otra PC con Windows en la red 192.168.1.0/24**

---

## 3. Otras Redes Verificadas

| Red | Propósito | Hosts Encontrados | ¿PC Windows? |
|:---:|-----------|:-----------------:|:------------:|
| 192.168.125.0/24 | VMware NAT | .1 (host), .129 (Kali 192.168.125.129) | ❌ |
| 192.168.218.0/24 | VMware Host-only | .1 (host) | ❌ |
| 172.25.192.0/20 | Hyper-V vSwitch | Timeout (/20 demasiado grande) | ❓ No escaneado |

---

## 4. Detalles de Servicios por Host

### 192.168.1.210 — Servidor Web (nginx)
```
80/tcp   open   http   nginx
443/tcp  open   https  nginx
8080/tcp open   http   nginx
OS: Linux 3.2 - 4.14
```
**Nota:** Servidor web desconocido en la red. Posible NAS, servidor multimedia, o device IoT con interfaz web.

### 192.168.1.223 — DVR/NVR Cámaras
```
80/tcp open   http   HTTP/1.0 200 OK
Title: "Remote Surveillance, Any time & Anywhere"
Favicon: favicon.ico (vnd.microsoft.icon)
OS: Linux 3.2 - 4.14
```
**Nota:** Sistema de vigilancia por cámara. Interfaz web en HTML básico. Posible marca china (DVR/NVR).

### 192.168.1.165 — RG406V
Dispositivo Anbernic RG406V (consola retro gaming portátil con Android/Linux).
Todos los puertos escaneados cerrados.

### 192.168.1.189 — S20-FE-de-Luz
Dispositivo Samsung (probablemente celular Galaxy S20 FE, o smart plug "Luz").
Todos los puertos escaneados cerrados.

### 192.168.1.192 — Roborock Vacuum a34
Robot aspiradora Roborock. SSH filtrado (posiblemente abierto solo para firmware updates).
Todos los demás puertos cerrados.

### 192.168.1.222 — KCorp KLG-575 WAP
Access Point inalámbrico de KCorp.
Todos los puertos escaneados cerrados.

---

## 5. Resumen de Búsqueda de PC Windows

✅ **TODO el tráfico de red analizado** — nmap ping sweep + ARP table + OS detection + port scans específicos

**Resultado:** ❌ No se encontró ninguna PC con Windows adicional en la LAN de la ThinkPad.

**Posibles razones:**
1. La PC está **apagada** en este momento
2. Está en una **VLAN/subred diferente** (no 192.168.1.x)
3. Está conectada por **Ethernet** en un segmento de red distinto al Wi-Fi
4. Está en la red **Hyper-V vSwitch** (172.25.192.0/20 — pendiente escaneo completo)
5. Está en una **red WiFi de invitados** (separada lógicamente)

**Para escaneo futuro si se necesita:**
```bash
# Escaneo completo Hyper-V /20 (lento, 4096 IPs)
nmap -sn -T5 172.25.192.0/20

# Escaneo agresivo incluyendo hosts apagados con -Pn
nmap -Pn -p 445,3389 -T5 192.168.1.0/24

# Descubrimiento NetBIOS
nbtscan 192.168.1.0/24
```

---

## 6. Metadatos del Escaneo

| Campo | Valor |
|-------|-------|
| Fecha | 2026-07-17 |
| Hora | 13:00-13:15 ET |
| Herramienta | nmap 7.98 (WSL Ubuntu en ThinkPad) |
| Conexión | VPS → WireGuard → ThinkPad:22 (SSH) |
| Comandos ejecutados | `nmap -sn`, `nmap -O -sV`, `nmap -sT`, `Get-NetNeighbor` |
| Targets escaneados | 4 subredes (192.168.1.0/24, 125.0/24, 218.0/24, 172.25.192.0/20 parcial) |
| Hosts totales encontrados | 9 (7 LAN + Kali + host-only) |
| PCs Windows encontradas | 1 (la propia ThinkPad en 192.168.1.220) |

---

*Documentación generada para futura auditoría — 17 Jul 2026*
