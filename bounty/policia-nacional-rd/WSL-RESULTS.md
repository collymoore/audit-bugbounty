# WSL desde ThinkPad — Resultados de Explotación

## Capacidades WSL vs VPS

| Recurso | VPS | WSL (ThinkPad) | Diferencia |
|---------|-----|----------------|------------|
| nmap puertos | ❌ No disponible | ✅ 26s scan completo | **Ganó WSL** |
| SMTP VRFY | ✅ Parcial | ✅ 550 "no match" | Similar |
| WP users | ✅ 4 users | ✅ 4 users confirmados | Igual |
| WP posts | ✅ Con mobile UA | ✅ 20 títulos recientes | Igual |
| WP media | ❌ Imperva block | ✅ **76+ imágenes con metadatos** | **Ganó WSL** |
| WP-Abilities | 401 auth | 401 auth | Igual |
| CF7 | 403 | 403 | Igual |
| Batch API | ✅ Funciona | ✅ Funciona (solo POST/PUT/DELETE/PATCH) | Igual |

## Datos WP Extraídos desde WSL

### Últimos titulares PN (15 julio 2026)
- Captura de presuntos asaltantes en Pedro Brand
- Activación búsqueda de "El Chino" y "El Japonés" en Puerto Plata
- Entrega de presunto autor de muerte de adolescente en Santiago
- Apresamiento de dos mujeres por fraude con tarjeta bancaria
- Captura de cuatro hombres en Montecristi
- PN e ITLA culminan capacitación en IA para oficiales
- Pasantía de 2,421 estudiantes
- Reunión 150 del Plan de Seguridad Ciudadana
- Reducción histórica de homicidios (Fuerza de Tarea Conjunta)

### Media / Fotos
76+ imágenes en julio 2026, todas subidas por user ID 4 (Dirección Comunicaciones Estratégicas)
Tamaños: 100KB - 897KB, formato JPEG
Upload path: wp-content/uploads/2026/07/{uuid}-scaled.jpeg

## Estado de la Auditoría

### ✅ Completado desde VPS
- Shodan: infraestructura completa mapeada (CardNET, PN, SIRITE)
- WP REST API: users, posts, pages, comments, plugins, media
- IPs directas: Plesk, MailEnable, IIS mapeados
- SMTP: MailEnable 10.55 confirmado
- Umbraco: ASP.NET MVC 5.2, login panel expuesto

### ✅ Completado desde WSL/ThinkPad
- nmap: Puerto a puerto confirmado
- WP media: 76+ imágenes extraídas
- WP posts confirmados sin bloqueo Imperva
- SMTP VRFY probado

### ⏳ Pendiente (requiere Kali o VM con internet)
- **Zabbix**: monitoreozabbix.policianacional.gob.do no resuelve DNS público
- **APK decompile** de Denuncias Virtuales
- **Imperva bypass** (encontrar IP real del origen)
