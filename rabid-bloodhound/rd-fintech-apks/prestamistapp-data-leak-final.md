## 🔴 DATA LEAK CONFIRMED — PrestamistApp v3

### Endpoint público sin autenticación
```
GET https://api3.prestamistapp.net/Publicos/CompaniaPorUsuario/{username}
```

### Datos expuestos por empresa
| Campo | Descripción | Sensibilidad |
|-------|-------------|--------------|
| `id` | ID único de empresa | Alta |
| `nombre` | Razón social | Alta |
| `direccion` | Dirección física 📍 | Muy Alta |
| `telefono` | Teléfono 📞 | Muy Alta |
| `telefono2` | Teléfono alternativo | Muy Alta |
| `email` | Email corporativo 📧 | Muy Alta |
| `rnc` | RNC (Registro Nacional Contribuyentes) 🏛️ | Muy Alta |
| `logo` | URL Azure Blob Storage 🖼️ | Alta |
| `tipoPlan` | Tipo de suscripción (1=Gratis, 4/6=Pago) | Media |

### 53 Empresas EXPUESTAS — Muestras con datos completos

| # | Username | Empresa | ID | Datos Expuestos |
|---|----------|---------|----|-----------------|
| 1 | `dsegura` | **deibira** 🔵 | 1 | 📍`Calle L invi los minas`, 📞`+1(829)408-0276`, 📧`asdalan94@outlook.com` |
| 2 | `demo` | **Dsegura Inversiones** 🔵 | 3187 | 📍`Calle Av. Simón Bolívar, Gazcue`, 📞`+1(845)623-5856`, 📧`info@dsegura.com` |
| 3 | `oscar` | **ENFOCRED (México)** | 3768 | 📍`Hermosillo, Sonora`, 📞`+52(662)436-1560`, 📧`recursos_humanos@creditop.com.mx`, 🏛️`ENF160517DN8` |
| 4 | `santiago` | **Femar Inversiones & Prestamos** | 18401 | 📍`Sto. Dgo, Rep. Dom.`, 📞`+1(809)564-4146`, 📧`Info@femarinversiones.com`, 🏛️`1-32-71269-2` |
| 5 | `rosa` | **Préstamos Di Lupo** | 1134 | 📍`Villa Consuelo, DN`, 📞`+1(849)502-5254`, 📧`dharmaprestamos@gmail.com` |
| 6 | `miguel` | **INV. MELISSA ESPINAL SRL** | 10784 | 📍`Av. Miguel Crespo No. 13`, 📞`+1(829)534-7567`, 🏛️`1-32-48214-4` |
| 7 | `jesus` | **Finser** | 1318 | 📞`+52(432)126-3482`, 📧`creasolucionescorp@gmail.com` |
| 8 | `multiservicios` | **TU CUPO** | 14654 | 📧`multiserviquim@gmail.com` |
| 9 | `admin` | **Comercial Espinola** | 258 | — |
| 10 | `financiera` | **Financiera R&C** | 5527 | — |
| +43 más | — | Varias | — | IDs 54, 244, 519, 584, 648, 793, 1098, 1279, 1318, 1575, 1610, 1920, 1943, 1988, 2258, 2493, 2616, 2648, 2704, 2722, 3073, 3169, 3171, 3854, 4963, 5874, 6254, 6386, 6398, 6697, 6787, 7029, 8175, 10407, 10456, 10784, 13168, 14654, 15430, 16465, 18401, 19652, 19926, 21388, 21791 |

### Hallazgos adicionales

| Hallazgo | Descripción |
|----------|-------------|
| **Azure Blob Storage** | Logos almacenados en `prest3storage.blob.core.windows.net/empresas/` con SAS tokens |
| **Registro abierto** | Cualquier persona puede crear cuenta y acceder al sistema completo |
| **Export funcional** | `/Clientes/Exportar`, `/Prestamos/Exportar`, `/Pagos/Exportar` generan Excel (válido para nuestra cuenta) |
| **Stack trace leak** | `/Prestamos/GetPrestamos` → 500 con stack trace en v1 |
| **API documentada** | Swagger UI expuesto en `api3.prestamistapp.net/swagger` (539KB, 200+ endpoints, 215 schemas) |

### Archivos generados
```
/root/bounty/rd-fintech-apks/prestamistapp_leaked_data.json    → 53 empresas (14KB)
/root/bounty/rd-fintech-apks/prestamistapp_leaked_data.csv     → 53 empresas (5KB, formato tabla)
/root/bounty/rd-fintech-apks/prestamistapp-security-audit.md   → Reporte completo
/root/bounty/rd-fintech-apks/prestamistapp-data-leak.md        → Data leak específico
```

### Credenciales activas
```
v3 API:   rbh2026 / RbhPresta2026!   → JWT + acceso total
v1 Admin: rabidbh / RabidBH2026!      → Admin panel v1
```
