# Nuevos Hallazgos — Re-scan Bancobacc (2026-07-01)

**Herramientas nuevas:** wpscan, dalfox, trufflehog
**WAF:** Wordfence — bloqueó wpscan (API token required), dalfox (sin resultados), impidió enumeración de usuarios.

## Hallazgos Adicionales (no documentados en REPORTE-FINAL.md)

### BACC-13: WordPress 6.2.6 Desactualizado (Insecure)
- **Severidad:** 🟡 Alta
- **Detalle:** WPScan identificó WP v6.2.6 (lanzado Jun 2024). Varias versiones posteriores con parches de seguridad.
- **Ruta:** https://bancobacc.com.do/cms/wp-includes/js/dist/components.min.js
- **Evidencia:** md5sum f81f08a5f21c1e1ec522a46b6d95b796
- **Riesgo:** Versión con CVEs conocidos sin parchear. Actualizar a la última versión estable.

### BACC-14: mod_pagespeed Expuesto en Headers
- **Severidad:** 🟠 Media
- **Detalle:** Apache mod_pagespeed v1.13.35.2-0 expuesto en headers HTTP. Este módulo de optimización tiene historial de vulnerabilidades de info disclosure.
- **Header:** `x-mod-pagespeed: 1.13.35.2-0`
- **Riesgo:** Fingerprinting del stack. Versiones antiguas de mod_pagespeed han tenido XSS y divulgación de información.

### BACC-15: WP-Cron Habilitado Sin Autenticación
- **Severidad:** 🟠 Media
- **Detalle:** WP-Cron accesible externamente en /cms/wp-cron.php. Puede ser usado para ataques de denegación de servicio o activación de tareas programadas sin autenticación.
- **Ruta:** https://bancobacc.com.do/cms/wp-cron.php
- **Riesgo:** Potencial de DoS y ejecución no autorizada de tareas programadas.

### BACC-16: Custom Theme "bacc" por Desarrollador Tercero
- **Severidad:** 🟡 Info
- **Detalle:** El tema activo es "bacc v1.0" por Soluciones GBH. Tema personalizado con potencial de vulnerabilidades no auditadas.
- **Ruta:** /content/themes/bacc/
- **Riesgo:** Los temas personalizados no reciben actualizaciones de seguridad automáticas.

## Notas Técnicas

- Wordfence bloqueó wpscan (403) hasta usar --random-user-agent
- wpscan sin API token no puede enumerar plugins vulnerables con CVEs
- dalfox no pudo completar el scan — Wordfence bloqueó las requests XSS
- No se encontraron secretos en JS (el sitio no tiene JS bundles)
- Bankingly (admin.bancobacc.com.do) tiene JS minificado sin secretos expuestos
- Las 3 herramientas nuevas recomendadas por Opus se instalaron y verificaron; su utilidad en targets con WAF fuerte es limitada
