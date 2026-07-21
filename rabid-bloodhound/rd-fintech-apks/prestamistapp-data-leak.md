## UPDATE: Data Leak Confirmed

### New Finding: Public API Exposes Company PII

**Endpoint:** `GET https://api3.prestamistapp.net/Publicos/CompaniaPorUsuario/{UserName}`

**Authentication:** NONE required

**Data exposed per company:**

| Field | Example |
|-------|---------|
| Company ID | `3187` |
| Company Name | `Dsegura Inversiones` |
| Address | `Calle Avenida Simón Bolívar, Gazcue` |
| Phone | `+18456235856` |
| Email | `info@dsegura.com` |
| RNC/Tax ID | `1-32-71269-2` (for Femar Inversiones) |
| Logo URL | `https://prest3storage.blob.core.windows.net/empresas/company_3187.jpeg?...` |
| UI Color | `#17a2b8` |
| Plan Type | `1` (Free) |

### Companies Exposed (sample of 30+)

| # | Username | Company | ID | Phone | Email |
|---|----------|---------|----|-------|-------|
| 1 | `dsegura` | deibira | 1 | +18294080276 | asdalan94@outlook.com |
| 2 | `test` | TEST SRL | 54 | — | — |
| 3 | `admin` | Comercial Espinola | 258 | — | — |
| 4 | `carlos` | Jl | 244 | — | — |
| 5 | `luis` | Luis | 519 | — | — |
| 6 | `jose` | JyJ prestamo | 793 | — | — |
| 7 | `rafael` | D' La Rosa | 1098 | — | — |
| 8 | `admin1` | Kxkkkss | 1126 | — | — |
| 9 | `admin2` | Gggg | 1575 | — | — |
| 10 | `pedro` | MetroUno Limitada | 2258 | — | — |
| 11 | `credito` | Credi invierte | 2648 | — | — |
| 12 | `manuel` | Arbol | 2722 | — | — |
| 13 | `inversiones` | Inversiones EGLN SRL | 3073 | — | — |
| 14 | `prestamo` | Presta-3.0 | 3171 | — | — |
| 15 | **`demo`** | **Dsegura Inversiones** | **3187** | **+18456235856** | **info@dsegura.com** |
| 16 | **`oscar`** | **ENFOCRED** | **3768** | **+526624361560** | **recursos_humanos@creditop.com.mx** |
| 17 | `prestamosexpress` | A&O préstamos Express | 3854 | — | — |
| 18 | **`financiera`** | Financiera R&C | 5527 | — | — |
| 19 | `ana` | Inversiones JG | 5874 | — | — |
| 20 | `servicios` | Servicios múltiples | 6398 | — | — |
| 21 | `usuario` | NUEVA PERSONA | 8175 | — | — |
| 22 | `santo` | Inversiones santo | 13168 | — | — |
| 23 | `asesoria` | Asesoria | 15430 | — | — |
| 24 | `maria` | Créditos BM | 16465 | — | — |
| 25 | **`santiago`** | **Femar Inversiones & Prestamos** | **18401** | **+18095644146** | **Info@femarinversiones.com** |
| 26 | `banco` | Sioviel | 19926 | — | — |
| 27 | `rapiprestamo` | RapiPrestamo | 21388 | — | — |
| 28 | `prestamos` | INVERSIONES JAEDEN | 21791 | — | — |

### Additional Leaks

**Azure Storage SAS Token (time-limited):**
```
https://prest3storage.blob.core.windows.net/empresas/company_3187.jpeg?sv=2023-11-03&se=2026-07-10T12:20:28Z&sr=c&sp=r&sig=71eVdUFJ8QFUL6eSmMXyTsJBCnY6Urxw9jWav4gfZAc%3D
```

### Credentials
```
v3 API: rbh2026 / RbhPresta2026!
v1 Web: rabidbh / RabidBH2026!
```

### Impact
An attacker can enumerate thousands of lending companies in Latin America, extract their business PII (address, phone, email, RNC), and potentially use the company names for social engineering or targeted attacks against their loan data.
