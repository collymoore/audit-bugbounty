---
name: servicios-pn-gob-do-case-study
description: Bug bounty case study for servicios.pn.gob.do — Policía Nacional RD
severity: MEDIUM (no explotable sin sesión)
exploitable: NO
---

# 🇩🇴 Caso de Estudio: servicios.pn.gob.do — Policía Nacional RD

## ⚠️ VEREDICTO: NO CRÍTICO — NO EXPLOTABLE

| Factor | Resultado |
|--------|-----------|
| **Vulnerabilidad encontrada** | ✅ Sí — PII leak endpoint `/account/findcedula/{cedula}` |
| **Explotable sin sesión** | ❌ No — requiere autenticación |
| **Registro público** | ❌ Bloqueado — `/Account/Register` → AccessDenied |
| **WAF** | ✅ CSIRT-RD + Link11 — fuerte |
| **Vector de explotación** | ❌ No viable actualmente |

---

## Resumen

Se identificaron **endpoints con potencial crítico** para fuga masiva de PII:
- `GET /account/findcedula/{cedula}` → nombres, apellidos, DOB, género, nacionalidad
- `POST /wfp/getcedulaname/{cedula}` → mismo tipo de datos

**Pero:** Sin registro público ni credenciales existentes, no hay forma de obtener una sesión válida para explotarlos.

---

## Hallazgos

| # | Hallazgo | Severidad | Explotable |
|---|----------|-----------|------------|
| H1 | `/account/findcedula/{cedula}` — endpoint PII | 🔴 CRITICAL (potencial) | ❌ No sin sesión |
| H2 | `/wfp/getcedulaname/{cedula}` — 2do endpoint PII | 🔴 CRITICAL (potencial) | ❌ No sin sesión |
| H3 | UltiCabinet password grant type | 🟡 MEDIUM | ❌ Requiere client_secret |
| H4 | Forgot password endpoint | 🟢 LOW | ❌ No sin CSRF válido |
| H5 | Security headers débiles (CSP) | 🟢 LOW | ❌ No explotable solo |
| H6 | policia.gob.do → HTTP 500 | 🟡 MEDIUM | ⚠️ Posible info leak |

---

## ¿Por qué NO es crítico?

1. **WAF fuerte** — CSIRT-RD + Link11 bloquean patrones maliciosos (473)
2. **Sin registro público** — No se pueden crear cuentas nuevas
3. **Sin credenciales filtradas** — No hay combos conocidos
4. **Sin client_secret** — No se puede explotar password grant
5. **Endpoints PII requieren sesión** — Sin auth no hay data leak

---

## Lecciones

- Tiene **potencial crítico** si se obtiene una sesión
- Recomendable **monitorear** por si aparecen credenciales filtradas en el futuro
- La superficie de ataque es **limitada** por el WAF y control de acceso

---

## Archivos

- `/root/bounty/servicios-pn-findings.md` — Hallazgos técnicos
- `/root/bounty/servicios-pn-ejecutivo.md` — Reporte ejecutivo
- `/root/.hermes/screenshots/pn/` — 4 screenshots de evidencia
