---
name: policia-gob-do-case-study
description: Bug bounty case study for policia.gob.do — Policía Nacional RD main site
severity: LOW (no explotable)
exploitable: NO
status: CERRADO
---

# 🇩🇴 Caso de Estudio: policia.gob.do — Policía Nacional RD (Sitio Principal)

## ⚠️ VEREDICTO: NO CRÍTICO — NO EXPLOTABLE — CERRADO

| Factor | Resultado |
|--------|-----------|
| **Vulnerabilidad encontrada** | ❌ No |
| **Explotable** | ❌ No |
| **Superficie de ataque** | 🟡 Limitada (webmail + SMTP) |
| **WAF/CDN** | ❌ Sin WAF (IP directa 179.51.71.226) |

---

## Resumen

El sitio principal de la Policía Nacional (`policia.gob.do`) está **completamente caído** (HTTP 500 en todas las rutas). El servidor IIS 10.0 está mal configurado o la aplicación web está rota. Se identificaron servicios periféricos funcionales pero sin vectores de entrada explotables.

---

## Infraestructura

| Componente | Detalle |
|-----------|---------|
| **IP** | 179.51.71.226 (Santo Domingo Este, RD) |
| **ISP** | Columbus Networks Dominicana, S.A. |
| **Servidor** | Microsoft-IIS/10.0 |
| **ASP.NET** | v4.0.30319 |
| **Panel** | Plesk Obsidian 18.0.77 (certificado wildcard `*.policia.gob.do`) |
| **Correo** | MailEnable 10.55 (SMTP 25/465/587, POP3 995, IMAP 993) |
| **Webmail** | MailEnable Web Mail 10.55 en webmail.policia.gob.do |
| **Certificado** | Sectigo DV, wildcard `*.policia.gob.do` |

---

## Hallazgos

| # | Hallazgo | Severidad | Explotable |
|---|----------|-----------|------------|
| H1 | HTTP 500 en TODAS las rutas del sitio principal | 🟡 MEDIUM | ❌ Sin stack trace expuesto |
| H2 | MailEnable Web Mail 10.55 expuesto | 🟢 LOW | ❌ Sin credenciales |
| H3 | SMTP sin open relay | 🟢 LOW | ❌ Auth requerido |
| H4 | Plesk Obsidian en servidor | 🟢 LOW | ❌ Puerto 8443 cerrado |
| H5 | Forgot password deshabilitado (404) | 🟢 LOW | ❌ No funcional |

---

## Vectores Probados

| Vector | Resultado |
|--------|-----------|
| HTTP 500 — ¿stack trace expuesto? | ❌ No — solo mensaje genérico IIS |
| SMTP — ¿open relay? | ❌ No — "requires authentication" |
| SMTP — VRFY/EXPN | ❌ No revela usuarios |
| Webmail — credenciales por defecto | ❌ Fallaron admin/admin, admin/policia |
| Webmail — forgot password | ❌ 404 — deshabilitado |
| Webmail — mobile portal | ❌ 404 |
| WebAdmin — panel admin | ❌ 404 |
| Plesk — acceso público | ❌ Puerto cerrado |
| policianacional.gob.do | ❌ Imperva WAF (Incapsula) — sin acceso |

---

## Puertos Abiertos

| Puerto | Servicio | Estado |
|--------|----------|--------|
| 25/tcp | SMTP (MailEnable 10.55) | ✅ Responde |
| 443/tcp | HTTPS (IIS 10.0) | ✅ HTTP 500 |
| 465/tcp | SMTPS (MailEnable) | ✅ Responde |
| 587/tcp | SMTP Submission | ✅ Responde |
| 993/tcp | IMAPS | ✅ Responde |
| 995/tcp | POP3S (MailEnable) | ✅ Responde |

---

## Subdominios Identificados

| Subdominio | Resuelve | Estado |
|------------|----------|--------|
| policia.gob.do | 179.51.71.226 | 🔴 HTTP 500 |
| mail.policia.gob.do | 179.51.71.226 | 🔄 303 redirect |
| webmail.policia.gob.do | 179.51.71.226 | ✅ MailEnable login |
| www.policia.gob.do | — | ❌ No resuelve |
| policianacional.gob.do | 45.60.86.180 (Incapsula) | 🔒 WAF |

---

## Lecciones

- El sitio principal está **caído** — posible incidente no reportado
- MailEnable expuesto pero sin vectores de entrada
- Sin WAF = el servidor es accesible directamente, pero no hay nada que explotar
- La IP 179.51.71.226 es RD directo (no CDN) — podría ser útil para futuro OSINT

---

## Estado: CERRADO

**Razón:** Sin vectores de entrada explotables. Sin credenciales, sin registro público, sin data leaks, sin CVEs aplicables.

**Recomendación:** Monitorear por si el sitio principal vuelve a estar funcional o aparecen credenciales filtradas en el futuro.

---

## Archivos Relacionados

- `/root/.hermes/screenshots/pn/servicios_pn_waf_block.png` — WAF block (servicios.pn.gob.do)
- `/root/.hermes/screenshots/pn/servicios_pn_home.png` — Homepage servicios.pn.gob.do
