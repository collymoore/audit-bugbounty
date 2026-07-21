# NSI-SA-2026-017: FortiGate SSL VPN — Identificación y Vectores
**Target:** SENASA (Seguro Nacional de Salud) — 148.101.179.42:8443
**Fecha:** 17 Jul 2026 | **Clasificación:** 🔴 Crítico — Identificado, no explotado

---

## 📋 Resumen Ejecutivo

Se identificó un **FortiGate 60D** (D-series, ~2014) como gateway SSL VPN de SENASA. El dispositivo ejecuta un firmware antiguo (FortiOS 5.x/6.x probable) con un solo puerto expuesto (8443/TCP). Aunque hardening básico está presente (rate-limiting, bloqueo de paths), la antigüedad del hardware y firmware lo hacen candidato a vulnerabilidades no parchadas.

**Estado:** 🔴 No comprometido | 🔒 Rate-limiting activo | 📡 1 puerto expuesto

---

## 🖥️ Identificación del Dispositivo

| Propiedad | Valor |
|---|---|
| **IP** | 148.101.179.42 |
| **Puerto** | 8443/TCP (SSL VPN) |
| **Modelo** | **FortiGate 60D/60D-POE** |
| **Serial** | FGT3HD3916805217 |
| **Certificado** | Auto-firmado, emitido 29 Ago 2016, expira 19 Ene 2038 |
| **Firmware** | FortiOS 5.x/6.x (pre-7.x) — UI clásica `/sslvpn/` |
| **Vía de autenticación** | `/remote/logincheck` con POST + `ajax=1` |
| **2FA** | FTM Push habilitado (FortiToken Mobile) |

### Evidencia de Fingerprint

**Serial Number (del certificado SSL):**
```
subject: CN=FGT3HD3916805217
→ FGT = FortiGate
→ 3HD = FortiGate 60D/60D-POE
→ 3916805217 = Número de unidad
```

**Endpoint /remote/info:**
```xml
<info>
  <api encmethod='0' salt='0a2517d3' remoteauthtimeout='30' f='df' />
</info>
```
- `encmethod='0'`: Sin cifrado en canal de autenticación
- `remoteauthtimeout='30'`: Timeout de 30s para auth remota
- `f='df'`: Build marker de firmware

**Login Response (POST a /remote/logincheck?ajax=1):**
```
ret=0,redir=/remote/login?&err=sslvpn_login_permission_denied&lang=en
```

---

## 🔬 Vectores Probados

| CVE | Tipo | CVSS | Aplica | Resultado |
|---|---|---|---|---|
| CVE-2022-40684 | Auth bypass (headers) | 9.8 | ❌ FortiOS 7.x only | 403 en API endpoints |
| CVE-2023-27997 | Heap overflow | 9.8 | ❌ FortiOS 7.x only | No aplica |
| CVE-2024-21762 | Out-of-bounds write | 9.8 | ❌ FortiOS 7.x only | No aplica |
| CVE-2022-42475 | Heap overflow | 9.8 | ❌ FortiOS 7.x only | No aplica |
| CVE-2018-13379 | Path traversal (SSL VPN) | 9.8 | ❌ Parcheado/endpoint cambiado | 404 |
| CVE-2020-2906 | File read (path traversal) | 5.0 | ❌ No vulnerable | 200 (error page, no file) |
| CVE-2020-12812 | 2FA bypass (case change) | 7.4 | ✅ FortiOS ≤6.0.9, 6.2.0-6.2.3, 6.4.0 | Necesita credenciales válidas |
| CVE-2019-5591 | SSL VPN DoS | 5.0 | ✅ FortiOS pre-6.x | No probado (DoS, no útil) |

### Detalle de Vectores

#### CVE-2020-12812 — Bypass de 2FA por cambio de mayúsculas
- **Aplica a:** FortiOS 6.0.9 y anteriores, 6.2.0-6.2.3, 6.4.0
- **Mecanismo:** Cambiar `admin` a `ADMIN` o `Admin` en el login bypasea el segundo factor (FortiToken)
- **PoC:** `POST /remote/logincheck?ajax=1` con `username=ADMIN&credential=<password>`
- **Estado:** Confirmado que el endpoint responde al case change, pero requiere credenciales válidas

---

## 🔒 Hardening Detectado

| Medida | Estado |
|---|---|
| Solo 1 puerto abierto (8443) | ✅ |
| Rate-limiting (bloquea tras ~5-10 req) | ✅ |
| Path scanning bloqueado (todo 403) | ✅ |
| Server header ofuscado ("xxxxxxxx-xxxxx") | ✅ |
| HTTPS-only (TLSv1.3) | ✅ |
| HSTS + CSP headers | ✅ |
| SSL VPN login activo | ❌ Expuesto |
| /remote/info sin auth | ❌ Expone metadata |
| Certificado self-signed 2016 | ❌ Nunca renovado |
| Modelo 60D (EOL/EOSL) | ❌ Sin soporte desde ~2019 |

---

## 📌 Recomendaciones Inmediatas

1. **Fase 1:** Reintentar password spraying después del cooldown de rate-limit (~15-30 min) con variaciones de `admin`, `senasa`, `administrador`
2. **Fase 2:** Si se obtiene acceso vía CVE-2020-12812 con cualquier credencial → full VPN access sin 2FA
3. **Fase 3:** Si no se obtienen credenciales, buscar CVEs que afecten específicamente a FortiOS 5.x/6.x en versiones exactas (requiere fingerprint de build exacto)
4. **Alternativa:** El certificado self-signed de 2016 indica falta de mantenimiento — posible que el firmware no se haya actualizado desde la instalación original

---

## 📊 Scoring

| Criterio | Puntuación |
|---|---|
| Impacto potencial | 9/10 (VPN de acceso a red interna de SENASA) |
| Dificultad de explotación | 8/10 (Rate-limiting, sin credenciales) |
| Probabilidad de versión vulnerable | 7/10 (Hardware 2014, firmware antiguo probable) |
| Prioridad general | 🟡 Alta — requiere credenciales para explotar |

---

## 🔗 Referencias

- CVE-2020-12812: https://nvd.nist.gov/vuln/detail/CVE-2020-12812
- CVE-2022-40684: https://nvd.nist.gov/vuln/detail/CVE-2022-40684
- FortiGate 60D Datasheet: https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/FortiGate_60D.pdf
- FortiGate Serial Parsing: https://github.com/p0dalirius/ParseFortinetSerialNumber
