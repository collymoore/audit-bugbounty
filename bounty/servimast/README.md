# SERVIMAST JPM SRL

## Overview

| Field | Value |
|-------|-------|
| **Target** | `38.252.231.220` |
| **Org** | SERVIMAST JPM SRL |
| **Location** | Concepción de La Vega, República Dominicana |
| **Updated** | 2026-07-07 |
| **Open Ports** | **573 puertos** |

---

## 🔴 Finding #1 — Servidor con 573 puertos abiertos

**IP:** `38.252.231.220`

Este host tiene **573 puertos TCP abiertos**, lo cual es extremadamente inusual.
Características sospechosas:
- Puerto `23` (Telnet) abierto
- Puerto `21` (FTP) abierto
- Puerto `445` (SMB) abierto
- Range masivo de puertos 8000–12500 casi todos abiertos
- Puertos de gestión expuestos

Posibles interpretaciones:
1. **DMZ/NAT escaneable** desde afuera — el router/firewall responde a todo
2. **Servidor mal configurado** (firewall desactivado, modo promiscuo)
3. **Honeypot**

---

## 📋 Puertos de Interés

| Puerto | Servicio | Notas |
|--------|----------|-------|
| 21 | FTP | Posible anónimo |
| 23 | Telnet | Sin cifrar |
| 80 | HTTP | No responde a probes directas |
| 443 | HTTPS | No responde a probes directas |
| 445 | SMB | Windows file sharing |
| 3306 | MySQL | Base de datos expuesta |
| 5601 | Kibana | Dashboard expuesto |
| 6379 | Redis | Sin auth probable |
| 8080 | HTTP-Proxy | No responde |
| 8443 | HTTPS-alt | No responde |
| 8834 | Nessus | Posible escáner de vulnerabilidades |
| 27017 | MongoDB | Base de datos NoSQL expuesta |

---

## 🔍 Datos Shodan

```
38.252.231.220
City:                    Concepción de La Vega
Country:                 Dominican Republic
Organization:            SERVIMAST JPM SRL
Updated:                 2026-07-07T09:12:35.144000
Number of open ports:    573
```

### Puertos completos (sample de los más relevantes)
```
13, 15, 19, 21, 23, 25, 53, 70, 79, 80, 81, 82, 84, 88, 92,
102, 113, 175, 179, 195, 221, 264, 427, 443, 445, 465, 467,
502, 541, 548, 636, 685, 771, 789, 885, 902, 947, 993, 995,
999, 1024, 1195, 1200, 1207, 1224, 1234, 1249, 1291, 1414,
1604, 1911, 1925, 1955, 1965, 1975, 1990, 2000, 2001, 2002,
2008, 2059, 2064, 2070, 2078, 2081, 2083, 2095, 2121, 2154,
2181, 2249, 2250, 2345, 2351, 2379, 2404, 2453, 2455, 2480,
2549, 2551, 2560, 2628, 3000, 3001, 3046, 3058, 3060, 3073,
3076, 3079, 3108, 3113, 3120, 3128, 3138, 3154, 3161, 3183,
3188, 3260, 3269, 3299, 3301, 3306, 3337, 3388, 3400, 3524,
3542, 3551, 3590, 3780, 3790, 3842, 3922, 4001, 4063, 4165,
4200, 4250, 4282, 4321, 4343, 4344, 4431, 4434, 4443, 4455,
4499, 4500, 4505, 4506, 4567, 4602, 4786, 4899, 5001, 5005,
5007, 5010, 5025, 5061, 5093, 5130, 5172, 5222, 5225, 5232,
5239, 5241, 5244, 5253, 5268, 5275, 5357, 5432, 5446, 5494,
5495, 5560, 5601, 5602, 5650, 5660, 5801, 5900, 5901, 5938,
5984, 5986, 5991, 5998, 6001, 6006, 6008, 6020, 6060, 6308,
6379, 6432, 6433, 6440, 6514, 6600, 6662, 6664, 6666, 6697,
6699, 6887, 7016, 7070, 7085, 7171, 7218, 7434, 7443, 7474,
7493, 7547, 7548, 7634, 7657, 7777, 7788, 7801, 7822, 7998,
8000, 8001, 8008, 8009, 8010, 8013, 8015, 8020, 8032, 8042,
8045, 8057, 8060, 8066, 8077, 8080, 8090, 8099, 8112, 8115,
8118, 8121, 8123, 8126, 8129, 8130, 8136, 8139, 8163, 8177,
8186, 8193, 8200, 8411, 8418, 8421, 8435, 8441, 8442, 8455,
8478, 8524, 8528, 8545, 8578, 8588, 8593, 8606, 8649, 8702,
8704, 8705, 8723, 8764, 8791, 8827, 8834, 8837, 8868, 8872,
8876, 8880, 8883, 8887, 8889, 9000, 9001, 9002, 9017, 9018,
9019, 9029, 9042, 9043, 9048, 9060, 9072, 9076, 9078, 9080,
9089, 9090, 9092, 9094, 9095, 9100, 9159, 9160, 9170, 9176,
9184, 9191, 9199, 9216, 9243, 9261, 9295, 9300, 9304, 9333,
9399, 9445, 9454, 9513, 9530, 9600, 9658, 9761, 9802, 9869,
9908, 9943, 9944, 10002-10182, 10250, 10397, 10443, 10554,
10909, 11000, 11112, 11288, 11300, 11434, 12000, 12111-12572,
13380, 13554, 14147, 14344, 14406-14907, 15805, 16010-16280,
16402, 16443, 16992, 16993, 17000, 17042, 17182, 17443, 17517,
17926, 18004-18121, 18789, 19071, 19080, 19363, 19443,
20050-21515, 22444, 23023, 24082, 25001-25952, 25565,
27015, 27017, 27604, 28015, 28080, 28823, 29092, 29155,
30000-30113, 30443, 31697, 32101, 32764, 32800, 33060,
33389, 34392, 35051, 35531, 36517, 36743-37080, 37352,
40005, 42420, 43080, 43200, 43954, 44158, 44307, 44410,
44732, 44818, 46443, 46881, 47183, 47594, 47990,
48001-48618, 49152, 49682-53878, 54138, 54816, 55350,
55443, 55470, 55553, 55554, 56962, 57001, 57778, 57779,
58000, 59806, 60030, 60968, 61613, 61616, 61617, 62078,
62260, 63256, 63260
```

---

## ⚠️ Notas Técnicas

- **No responde a probes HTTP/HTTPS directas** desde esta IP (timeout/connection refused)
- Shodan muestra 573 puertos abiertos pero nació sin banners para la mayoría
- Posible firewall perimetral que reporta puertos como "abiertos" sin realmente servirlos
- Se recomienda scan nmap más detallado desde VPS con `-sV` para identificar servicios reales

## 🗓️ Recolección

- **Fecha:** 2026-07-16
- **Fuente:** Shodan
- **Creditos restantes:** 89 query / 100 scan
