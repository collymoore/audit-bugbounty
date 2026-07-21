# 🏥 CMR/EMESALUD — Ecosistema Completo de Apps Clínicas

## Arquitectura Común
- **Frontend:** Flutter white-label (misma app base, config por hospital)
- **Backend:** WCF (.svc) sobre IIS
- **Auth:** Bearer token + login_token
- **Imágenes:** PACS via `/visorhtml5/WcfServiceIconos/Service1.svc`

## Apps Dominicanas 🇩🇴

| # | App | Package | Website | API Host | Puerto |
|:-:|:----|:--------|:--------|:---------|:------:|
| 1 | 🏥 **Clínica Corominas** | `com.CMR.eme_salud_corominas` | clinicacorominas.com | `(subagent)` | 443 |
| 2 | 🏥 **Clínica Abreu** | `com.CMR` | clinicabreu.com | `(subagent)` | - |
| 3 | ❤️ **Cardio Imágenes** | `com.CMR.emesalud_cardioimagenes` | cardioimagenes.com.do | `cardioimagenes.cmr-apps.com` | 443 |
| 4 | 🏥 **CEDISA** | `com.CMR.eme_salud_cedisa` | cedisa.do | `portalresultados.cedisa.do` | 443 |
| 5 | 🏥 **Centro Médico Moderno** | `com.CMR.emesalud_cmm` | cmm.do | `resultadosimagenes.cmm.do` | 443 |
| 6 | 🏥 **CADI** | `com.CMR.emesalud_cadi` | cmm.do | `portal.cadi.do` | 443 |
| 7 | 🏥 **Policlínica Metropolitana** | `com.CMR.eme_salud_cmr_Policlinica` | policlinicametropolitana.org | `policlinicametropolitana-apps.com` | 443 |

## Apps Internacionales

| # | App | País | API Host | Acceso |
|:-:|:----|:----:|:---------|:------:|
| 8 | InterHospital | 🇪🇨 | `interhospital.com.ec` | ❌ Interno |
| 9 | Hospital San José Hermosillo | 🇲🇽 | `disanjose.ddns.net:99` | ❌ Interno |
| 10 | Honduras Medical Center | 🇭🇳 | `ris.hmc.hn` | ❌ Interno |

## Apps CMR Genéricas

| # | App | API Host | Notas |
|:-:|:----|:---------|:------|
| 11 | **HIGEA** (Centro Diagnóstico) | `higea.cmr-apps.com` | HTTPS |
| 12 | **InfoSalud Firmas** | `www.cmr-apps.com` | HTTP (debugMode!) |
| 13 | **EME Salud** (generic) | `www.cmr-apps.com` | HTTP (debugMode!) |
| 14 | **Laboratorio Tequis** | CMR generic | App base sin hospital |

## Endpoints WCF (comunes a todas)

```
/HisWebServicios/Portal/ServicioPortal.svc       ← API principal
/HisWebServicios/Portal/ServicioPortal.svc?wsdl  ← WSDL
/visorhtml5/WcfServiceIconos/Service1.svc        ← PACS imágenes
/visorhtml5/WebDiagRxMobile                      ← Visor radiológico
/WebUltimateGL/App/Vistas/index.html             ← Visor avanzado
```

## Auth
```
Authorization: Bearer {token}
login_token (almacenado en SQLite local)
```

## Hallazgos de Seguridad

1. **debugMode: true** en varias apps (Cardio Imágenes, CEDISA, CMM, Honduras, EME Salud, InfoSalud)
2. **HTTP sin HTTPS** en EME Salud (generic) e InfoSalud — credenciales en texto plano
3. **DDNS** para Hospital San José (`disanjose.ddns.net:99`) — puerto no-estándar
4. **WCF endpoints no públicos** — todos los .svc están en intranet hospitalaria
5. **Mismo API key de Google Maps** (`AIzaSyBVlEjGS-Witkb0fCqVwYlEnRot_XNZUAI`) en Denuncias Virtuales — verificar si funciona en otras APIs
6. **Firebase** presente en todas (FCM para notificaciones push)
