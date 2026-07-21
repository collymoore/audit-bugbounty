# Spotify Confidence Bug Bounty — Case Study

**Report:** HackerOne #3852894
**Fecha envío:** Julio 9, 2026
**Target:** `app.confidence.spotify.com` (Backstage Confidence experimentation platform)
**Estado:** 📩 Recibido — pendiente triage

---

## Findings

| ID | Finding | Severidad | CVSS |
|----|---------|-----------|------|
| VULN-1 | CORS Misconfiguration en GraphQL — `graphql-konfidens.spotify.com` con `Access-Control-Allow-Origin: *` + Apollo headers expuestos (tracing, query plan) | 🔴 High | 7.5 |
| VULN-2 | Google Picker API Key hardcodeada en Backstage config HTML: `AIzaSyAa0prTJZv5g5piMTFhNBYhqrV1UUC9_Oc` | 🟡 Medium | 5.3 |
| VULN-3 | URLs internas expuestas en config: `localhost:3000`, `localhost:7007`, build commit `6153bf621a376232e3f7d13e9ae164d047598fc2` | 🟡 Medium | 4.3 |
| VULN-4 | Backstage en modo público (`backstage-app-mode: public`) | ⚪ Low | — |

## Metodología

1. Recon inicial desde Kali (IP residencial 71.104.x.x vía ThinkPad)
2. Detección de Backstage config via extracción `<script type="backstage.io/config">` del HTML
3. Análisis manual de GraphQL endpoint con curl + verificación CORS
4. Validación de API key contra Google Picker API

## Artefactos

| Archivo | Ruta |
|---------|------|
| Reporte H1 | `/root/bounty/spotify_hackerone_report.md` |
| Subdominios raw | `/root/bounty/spotify/subs_raw.txt` |
| Live hosts | `/root/bounty/spotify/live.txt` |
| Live URLs | `/root/bounty/spotify/live_urls.txt` |
| Nuclei results | `/root/bounty/spotify/nuclei_results.txt` |
| Lista completa subs VPS | `/root/bounty/spotify_subs_raw.txt` |

## Lecciones

- Backstage SPA apps frecuentemente exponen config completa en `backstage.io/config` script tag — Google API keys, URLs internas, build commits
- CORS `*` en GraphQL endpoints de Apollo es un patrón común en experimentation platforms
- Kali con IP residencial es clave para evitar bloqueos CDN
