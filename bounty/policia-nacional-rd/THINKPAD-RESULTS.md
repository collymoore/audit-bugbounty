# Explotación desde ThinkPad (IP Residencial)

## Resultados vs VPS

| Recurso | Desde VPS | Desde ThinkPad | Diferencia |
|---------|-----------|----------------|------------|
| WP /users | ✅ Visible | ✅ Visible | Sin cambio |
| WP /posts | ❌ Imperva block | ✅ Visible con mobile UA | Igual |
| WP /media | ❌ Imperva block | ✅ **Full data + EXIF** | **Mejor** |
| WP /plugins | ❌ Imperva block | 401 (requires auth) | Igual |
| WP-Abilities | ❌ Imperva block | 401 (requires auth) | Igual |
| CF7 Forms | ❌ Imperva block | 403 (requires auth) | Igual |
| Zabbix | DNS no resuelve | DNS no resuelve | Igual |
| Denuncias portal | ✅ 200 + Imperva | ✅ 200 + Imperva | Igual |

**Conclusión:** Imperva está en el DNS del dominio, por lo que desde cualquier IP se pasa por el WAF. La IP residencial no evita Imperva.

## Zabbix
`monitoreozabbix.policianacional.gob.do` existe en crt.sh pero NO resuelve en DNS público. El subdominio está registrado en el certificado SSL pero no tiene DNS A record. **Posiblemente solo accesible desde la red interna de la PN.**

## Imágenes WP Expuestas desde ThinkPad
- 2026/07/ — fotos de pasantía de 2,421 estudiantes
- Upload por user ID 4 (Dirección Comunicaciones Estratégicas / manuel-logrono)
- EXIF data con timestamps de creación
- Acceso completo via REST API: `/wp-json/wp/v2/media?per_page=100`
