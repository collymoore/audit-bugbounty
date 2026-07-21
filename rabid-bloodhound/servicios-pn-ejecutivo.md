---
name: servicios-pn-gob-do-ejecutivo
description: Executive summary for servicios.pn.gob.do bug bounty findings
---

# 📋 Reporte Ejecutivo: servicios.pn.gob.do
## Policía Nacional de República Dominicana — Portal de Servicios

**Fecha:** Julio 12, 2026
**Analista:** Hermes — NSI LLC
**Estado:** 🔴 Vulnerabilidades críticas identificadas

---

## Resumen

El portal de servicios de la Policía Nacional (servicios.pn.gob.do) expone **16 servicios ciudadanos** (certificaciones vehiculares, validación de celulares y postulación) con **3 hallazgos críticos/alto riesgo** que comprometen datos personales de ciudadanos dominicanos.

---

## Hallazgos Clave

### 🔴 CRÍTICO — Endpoint de Exposición Masiva de PII
- **Endpoint:** `/account/findcedula/{cedula}`
- **Datos expuestos:** Nombre completo, apellidos, fecha de nacimiento, género, nacionalidad
- **Impacto:** 11M+ ciudadanos dominicanos potencialmente expuestos
- **Estado:** Requiere sesión autenticada (pero sin autorización granular — IDOR)

### 🔴 CRÍTICO — Endpoint de Cédula Secundario
- **Endpoint:** `/wfp/getcedulaname/{cedula}`
- **Misma vulnerabilidad:** Exposición de datos personales a través de segundo endpoint confirmado funcional

### 🔴 ALTO — UltiCabinet SSO Password Grant
- **Proveedor:** auth.ulticabinet.com
- **Riesgo:** Password grant type habilitado para cliente `policia`
- **Impacto:** Ataque de fuerza bruta contra cuentas PN si se obtiene client_secret

---

## Vectores de Explotación Inmediatos

1. **Registrar cuenta** en UltiCabinet usando cédula de prueba + email temporal
2. **Autenticarse** en servicios.pn.gob.do con la cuenta creada
3. **Extraer PII masivamente** vía `/account/findcedula/{cedula}` iterando cédulas
4. **Probar IDOR** en servicios S99/S75/S97 modificando IDs de solicitudes
5. **Buscar client_secret** en JS bundles, repositorios públicos, o APKs

---

## Recomendaciones Inmediatas

| # | Acción | Prioridad |
|---|--------|-----------|
| 1 | Deshabilitar `password` grant type en UltiCabinet | 🔴 Crítica |
| 2 | Agregar autorización granular a `/account/findcedula` | 🔴 Crítica |
| 3 | Rate limiting en todos los endpoints de autenticación | 🔴 Crítica |
| 4 | Implementar CSP completo en servicios.pn.gob.do | 🟡 Alta |
| 5 | Corregir HTTP 500 en policia.gob.do | 🟡 Alta |
| 6 | Deshabilitar client_ids no utilizados en UltiCabinet | 🟡 Alta |

---

## Contacto

**Policía Nacional RD:** (809) 682-2151 / info@policia.gob.do
**Dirección:** Ave. Leopoldo Navarro No. 402, Gazcue, Santo Domingo, DN
