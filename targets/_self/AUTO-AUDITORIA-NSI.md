# Auto-Auditoría de Seguridad — NSI LLC Infrastructure

**Fecha:** 01 Julio 2026
**Herramientas:** subfinder, httpx, nuclei, curl
**IP Pública:** 76.13.119.150
**Propietario:** Null Session Intelligence LLC

---

## 1. Alcance Real

| Activo | ¿Pertenece a NSI? | IP | Estado |
|--------|-------------------|-----|--------|
| `76.13.119.150` | ✅ Sí — VPS principal | — | Bajo control |
| `fernandoneris.net` | ✅ Sí | 76.13.119.150 | Bajo control |
| `nullsessionintelligence.com` | ✅ Sí | 76.13.119.150 | Bajo control |
| `nsi.agency` | ❌ No | 13.248.169.48 (AWS) | Fuera de alcance |

---

## 2. Superficie de Ataque — Activos NSI

### Puertos Abiertos (76.13.119.150)

| Puerto | Servicio | Estado |
|--------|----------|--------|
| 22 | SSH | ✅ Abierto |
| 80 | HTTP | ✅ Abierto |
| 443 | HTTPS | ✅ Abierto |
| 8080-9000, 2082-2087 | Varios | ❌ Cerrados |

### fernandoneris.net (React SPA + Caddy)

| Aspecto | Resultado |
|---------|-----------|
| **Server** | Caddy (sin versión — seguro) |
| **HTTP→HTTPS** | ✅ Redirección forzada 308 |
| **HSTS** | ✅ max-age=31536000; includeSubDomains |
| **CSP** | ✅ `default-src 'self'; frame-ancestors 'none'` |
| **X-Frame-Options** | ✅ DENY |
| **X-Content-Type-Options** | ✅ nosniff |
| **Referrer-Policy** | ✅ strict-origin-when-cross-origin |
| **Permissions-Policy** | ✅ Restrictiva |
| **CVEs Críticos/Altos** | 0 |
| **Exposiciones** | llms.txt (intencional) |

### nullsessionintelligence.com

| Aspecto | Resultado |
|---------|-----------|
| **Server** | Caddy |
| **Redirección** | 308 → https://www.nullsessionintelligence.com/ |
| **Seguridad** | Misma configuración que fernandoneris.net |

---

## 3. Subdominios (Activos NSI)

| Dominio | Subdominios | Nota |
|---------|-------------|------|
| fernandoneris.net | www | Solo 1 |
| nullsessionintelligence.com | www | Solo 1 |

---

## 4. Hallazgos

| Severidad | Hallazgo | Estado |
|-----------|----------|--------|
| ✅ Bueno | Sin CVEs críticos/altos detectados | Pasa |
| ✅ Bueno | Security headers completos y correctos | Pasa |
| ✅ Bueno | Sin directorios sensibles expuestos (SPA routing) | Pasa |
| ✅ Bueno | Sin exposición de versión de servidor | Pasa |

---

## 5. Nota: nsi.agency

El dominio `nsi.agency` **no pertenece a NSI LLC**. Sus DNS están en Afternic (GoDaddy) y apuntan a IPs de AWS Global Accelerator (13.248.169.48 / 76.223.54.146). Los 18 subdominios descubiertos (cpanel, dev, mail, webmail, etc.) son registros DNS zombies en infraestructura ajena — fuera del alcance de esta auditoría.
