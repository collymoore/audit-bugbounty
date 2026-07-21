# Ecosistema DSegura — Reporte Consolidado

**Proyecto:** Rabid Bloodhound
**Fecha:** 10 Julio 2026
**Entidad:** Soluciones Tecnologicas DSegura SRL

---

## Resumen

Soluciones Tecnologicas DSegura SRL es una empresa dominicana de desarrollo de software que opera múltiples plataformas SaaS para gestión de préstamos, propiedades y cobros. Se identificaron vulnerabilidades críticas en 2 de sus 3 plataformas activas, exponiendo datos sensibles de clientes.

---

## Mapa del Ecosistema

```
Soluciones Tecnologicas DSegura SRL (RNC 1-32-293-XXX)
│
├── Delmirio Segura Soto — Director Ejecutivo
├── Deibis Segura — Gerente General / Desarrollador
│
├── PrestamistApp (prestamistapp.com) — Gestión de Préstamos
│   ├── Web v1: v1.prestamistapp.net (ASP.NET Core)
│   ├── Web v3: app3.prestamistapp.com (React SPA)
│   ├── API v3: api3.prestamistapp.net (ASP.NET Core + Swagger)
│   └── Apps: com.dsegura.prestamistapp / 2 / 3
│
├── GestInmueble (gestinmueble.com) — Gestión de Propiedades
│   ├── Web: gestinmueble.com (ASP.NET)
│   ├── API: api.gestinmueble.com (ASP.NET + Swagger)
│   └── App: gestinmueble (iOS)
│
└── Cobroh (cobroh.com) — Gestión de Préstamos (inactivo)
    └── Web: cobroh.com (sitio estático)
```

---

## Vulnerabilidades Encontradas

### PrestamistApp — 7 Hallazgos

| # | Vulnerabilidad | Severidad | Estado |
|---|---------------|-----------|--------|
| 1 | **Data Leak: 53 empresas expuestas sin auth** | 🔴 CRÍTICO | Disclosure enviado |
| 2 | **Open Registration con rol Admin** | 🔴 CRÍTICO | Disclosure enviado |
| 3 | **Stack Trace Leak (modo Development)** | 🟠 ALTO | Disclosure enviado |
| 4 | **Email Verification Bypass** | 🟠 ALTO | Disclosure enviado |
| 5 | **ASP.NET Core 1.0 desactualizado** | 🟡 MEDIO | Disclosure enviado |
| 6 | **Código debug en producción (TODO)** | 🟡 MEDIO | Disclosure enviado |
| 7 | **Swagger UI expuesto** | 🟡 MEDIO | Disclosure enviado |

**Disclosure:** ✅ Enviado 10 Jul 2026 a Delmirio Segura + Deibis Segura

### GestInmueble — 4 Hallazgos

| # | Vulnerabilidad | Severidad | Estado |
|---|---------------|-----------|--------|
| 1 | **Data Leak: 162 propiedades con GPS sin auth** | 🔴 ALTO | Documentado |
| 2 | **Data Leak: 4 usuarios con PII sin auth** | 🔴 ALTO | Documentado |
| 3 | **Open Registration con JWT automático** | 🟠 ALTO | Documentado |
| 4 | **Swagger UI expuesto** | 🟡 MEDIO | Documentado |

**Disclosure:** ⏳ Pendiente

---

## Datos Extraídos

| Fuente | Registros | Datos | Archivo |
|--------|-----------|-------|---------|
| PrestamistApp API | 53 empresas | Nombre, dirección, teléfono, email, RNC | `prestamistapp_leaked_data.json` |
| GestInmueble API | 162 propiedades | GPS, precios, descripciones, tipo | `gestinmueble_properties.json` |
| GestInmueble API | 4 usuarios | Nombre, teléfono, email | `gestinmueble_users.json` |

---

## Infraestructura Compartida

| Recurso | PrestamistApp | GestInmueble | Cobroh |
|---------|---------------|--------------|--------|
| Server IP | 209.126.103.94 | 173.214.170.82 | 173.214.170.82 |
| Web Server | IIS 10.0 | IIS 10.0 | IIS 10.0 |
| Framework | ASP.NET Core / ASP.NET | ASP.NET | ASP.NET (static) |
| Hosting | PleskWin | PleskWin | PleskWin |
| Auth | JWT | JWT | — |
| Swagger | ✅ api3.prestamistapp.net | ✅ api.gestinmueble.com | ❌ |
| WhatsApp | +1(849)864-1680 | +1(849)864-1680 | +1(849)864-1680 |

---

## Contactos Identificados

| Persona | Rol | Contacto |
|---------|-----|----------|
| Delmirio Brayan Segura Soto | CEO / Propietario | asdalan94@outlook.com |
| Deibis Segura Soto | Gerente General / Dev | deibisoto12@gmail.com, segura12s@gmail.com |
| DSegura SRL | Empresa | info@dsegura.com |
| WhatsApp Negocio | — | +1(849)864-1680 |
| Teléfono | — | +1(809)815-7252 |

---

## Archivos Generados

```
/root/bounty/
├── prestamistapp_nsi_propuesta.html      → Propuesta comercial (2 páginas)
├── prestamistapp_nsi_propuesta.pdf       → Propuesta PDF
├── prestamistapp_leaked_data.json        → 53 empresas (14KB)
├── prestamistapp_leaked_data.csv         → 53 empresas tabla (5KB)
├── prestamistapp-security-audit.md       → Reporte técnico PrestamistApp (10KB)
├── prestamistapp-data-leak-final.md      → Data leak específico (3.5KB)
├── gestinmueble_properties.json          → 162 propiedades GPS
├── gestinmueble_users.json               → 4 usuarios PII
├── gestinmueble-security-audit.md        → Reporte técnico GestInmueble (5KB)
└── rd-fintech-apks/
    └── prestamistapp_leaked_data.json
```
