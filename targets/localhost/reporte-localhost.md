# Auditoría Localhost — NSI VPS
## srv1350870 (76.13.119.150) — Ubuntu 24.04

**Fecha:** 2026-07-01
**Enfoque:** Servicios locales, configuraciones, contenedores, usuarios

---

### Resumen

| Aspecto | Estado |
|---------|--------|
| **Contenedores** | 29 (25 running, 1 unhealthy) |
| **Redes Docker** | 13 |
| **Volúmenes** | 21 |
| **Servicios systemd** | 19 activos |
| **Usuarios humanos** | 6 (root, ubuntu, deploy, admin-cockpit, tradingview) |

---

### 1. Puertos en 0.0.0.0 (Protegidos por INPUT DROP)

| Puerto | Servicio | Proceso | Riesgo |
|:------:|----------|---------|:------:|
| 22 | SSH | sshd | 🟡 DROP en iptables, pero bind en 0.0.0.0 |
| 44322-44323 | Performance Co-Pilot | pmproxy | 🟢 Monitoreo |
| 3001 | Hermes Workspace | node | 🟢 Protegido por INPUT DROP |
| 8002 | Copy Trade | python3 | 🟢 Protegido por INPUT DROP |
| 8642 | Hermes Gateway | hermes | 🟢 Protegido por INPUT DROP |
| 8899 | Servicio Python | python | 🟢 Protegido por INPUT DROP |
| 9119 | Hermes Dashboard | hermes | 🟢 Protegido por INPUT DROP |
| 9922 | SSH | sshd | 🟢 Puerto alterno |

### 2. Puertos en 127.0.0.1 (Solo local — seguros)

| Puerto | Servicio |
|:------:|----------|
| 5432 | PostgreSQL (docker-proxy x3 + Honcho) |
| 5433 | PostgreSQL nativo |
| 5434 | TimescaleDB |
| 3000 | athena_api |
| 3002 | uptime-kuma |
| 3003 | nsi_web |
| 3005 | amiga_web |
| 3090 | credit-repair-web |
| 6333-6334 | Qdrant |
| 8000 | credit-repair-api |
| 8222 | Vaultwarden |
| 8400 | Honcho API |
| 9050 | Tor (ATHENA) |
| 9999 | Dozzle |

### 3. Puertos en 10.200.200.1 (WireGuard VPN)

| Puerto | Servicio |
|:------:|----------|
| 8001 | CPSI Oracle API |
| 44321 | Performance Co-Pilot (pmcd) |

---

### 4. Estado de Contenedores

| Contenedor | Estado | Puerto Público |
|------------|:------:|:--------------:|
| infrastructure_caddy | ✅ healthy | 80, 443 |
| nsi_web | ✅ healthy | 127.0.0.1:3003 |
| athena_api | ✅ healthy | 127.0.0.1:3000 |
| athena_postgres | ✅ healthy | interno |
| athena_neo4j | ✅ healthy | interno |
| athena_tool_runner | ✅ healthy | interno |
| athena_workers | ✅ healthy | interno |
| athena_redis | ✅ healthy | interno |
| athena_flaresolverr | ✅ up | interno |
| athena_searxng | ✅ healthy | interno |
| athena_tor | ✅ healthy | interno |
| credit-repair-web | ✅ healthy | 127.0.0.1:3090 |
| credit-repair-api | ✅ healthy | 127.0.0.1:8000 |
| credit-repair-db | ✅ healthy | interno |
| amiga_web | ✅ up | 127.0.0.1:3005 |
| amiga_postgres | ✅ healthy | interno |
| amiga_redis | ✅ up | interno |
| timescaledb | ✅ up | 127.0.0.1:5434 |
| qdrant | ✅ up | 127.0.0.1:6333-6334 |
| vaultwarden | ✅ healthy | 127.0.0.1:8222 |
| uptime-kuma | ✅ healthy | 127.0.0.1:3002 |
| dozzle | ✅ up | 127.0.0.1:9999 |
| watchtower | ✅ healthy | interno |
| n8n_postgres | ✅ healthy | interno |
| honcho-api-1 | ❌ **unhealthy** | 127.0.0.1:8400 |
| honcho-redis-1 | ✅ healthy | interno |
| honcho-database-1 | ✅ healthy | 127.0.0.1:5432 |
| cv_export_service | ✅ healthy | interno |

### 5. Servicios Systemd

| Servicio | Estado |
|----------|:------:|
| hermes-gateway | ✅ running |
| hermes-dashboard | ✅ running |
| hermes-workspace | ✅ running |
| cpsi-copy-trade | ✅ running |
| cpsi-oracle-api | ✅ running |
| cli-proxy | ✅ running |
| docker | ✅ running |
| actions.runner (GitHub) | ✅ running |

### 6. Usuarios con Shell

| Usuario | UID | Shell |
|---------|:---:|-------|
| root | 0 | /bin/bash |
| ubuntu | 1000 | /bin/bash |
| deploy | 1001 | /bin/bash |
| admin-cockpit | 1002 | /bin/bash |
| tradingview | 1003 | /bin/bash |
| telebot | 995 | /usr/sbin/nologin |

---

### Hallazgos

#### 🟡 LOCAL-01: Puerto 22 SSH en 0.0.0.0

| Campo | Valor |
|-------|-------|
| **Severidad** | Baja |
| **Detalle** | SSH escucha en 0.0.0.0:22 aunque iptables tiene DROP. El puerto 22 sigue activo en sshd_config |
| **Riesgo** | Bajo — iptables lo bloquea, pero si alguien hace `iptables -F`, el 22 queda expuesto |
| **Recomendación** | Eliminar `Port 22` de sshd_config, dejar solo `Port 9922` |

#### 🟢 LOCAL-02: Honcho API Unhealthy

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Detalle** | `honcho-api-1` lleva 3+ horas unhealthy en puerto 8400 |
| **Impacto** | Memoria conversacional entre sesiones puede no estar funcionando |

#### 🟢 LOCAL-03: Performance Co-Pilot Expuesto

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Detalle** | pmproxy escucha en 0.0.0.0:44322-44323 (monitoreo del sistema) |
| **Riesgo** | Bajo — información de rendimiento, no crítica |

#### 🟢 LOCAL-04: GitHub Actions Runner

| Campo | Valor |
|-------|-------|
| **Severidad** | Info |
| **Detalle** | Runner de GitHub Actions activo (contigo-rd) — 5.9 MB RSS |
| **Nota** | Consume recursos constantemente |

---

### Conclusión

**Riesgo local: 🟢 BAJO**

25 contenedores funcionando correctamente. 5 servicios en 0.0.0.0 protegidos por INPUT DROP. Puerto 22 recomendado a eliminar. Honcho API unhealthy (3h+).

| Total contenedores | Saludables | Unhealthy |
|:------------------:|:----------:|:---------:|
| 29 | 28 | 1 (honcho) |
