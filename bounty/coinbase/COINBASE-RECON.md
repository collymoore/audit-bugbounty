# Coinbase Recon — Hallazgos Actualizados

## api.wallet.coinbase.com — Endpoints Confirmados

### ✅ Endpoint Público (sin auth)
| Endpoint | Status | Response |
|----------|--------|----------|
| `/` | 200 | `{"status":"ok"}` — health check |

### 🔑 Endpoints Autenticados (existen, 401 sin auth)
| Endpoint | Method | Response | Función probable |
|----------|--------|----------|-----------------|
| `/rewards` | GET | 401 "Unauthorized" | Coinbase Rewards API |
| `/rewards` | POST | 401 "Unauthorized" | Reclamar/consultar rewards |
| `/send` | GET | 401 "Unauthorized" | Envío de crypto |
| `/send` | POST | 401 "Unauthorized" | Ejecutar transferencia |

### 🛡️ Security Findings
| Aspecto | Resultado |
|---------|-----------|
| CORS (evil origin) | ✅ ACAO: NONE — bien configurado |
| Auth bypass (empty/default headers) | ✅ 401 en todos los casos |
| Rate limiting (20 req/sec) | ❌ **No detectado** — 0 respuestas 429 |
| OPTIONS preflight | ✅ Métodos: GET, POST, DELETE, PUT |
| HSTS | max-age=15552000; includeSubDomains |

### 📋 CORS Headers Expuestos (vía OPTIONS)
Todos los headers de autenticación que la API Wallet acepta:

| Categoría | Headers |
|-----------|---------|
| **Auth Principal** | `Authorization`, `Access-Token`, `Prime-Authorization`, `Client-Id` |
| **CB Wallet** | `X-CBW-SDK-Version`, `X-Wallet-User-Id`, `X-Wallet-Account-Type` |
| **Session/Device** | `X-CB-Session-Uuid`, `X-CB-Device-Id`, `X-CB-Pagekey`, `X-CB-UJS` |
| **Project** | `X-CB-Project-Name`, `X-Release-Stage`, `X-Platform-Name` |
| **Fingerprinting** | `Fingerprint-Tokens`, `X-CB-Version-Name` |
| **Datadog APM** | `x-datadog-trace-id`, `x-datadog-parent-id`, `x-datadog-sampling-priority` |
| **Crypto** | `Solana-Client`, `Daylight-Signature`, `X-Swap-Fee-Basis-Type` |
| **Pagos** | `Second-Factor-Proof-Token`, `two-factor-client-id` |
| **Prime** | `Prime-Portfolio-ID`, `Prime-PrimaryAddress-Wallet-ID`, `x-prime-user-id` |
| **Infra** | `Host-Origin`, `Cf-Ipcountry`, `rc`, `traceparent`, `identity-version`, `Tmp-Amp-Id`, `project-id` |

### 🔍 Vector de Ataque — Auth Rate Limiting
- 20 requests en ráfaga → 0 bloqueos
- POST `/rewards` sin 2FA → acepta la request (retorna 401, pero procesa)
- Potencial: enumeración de wallet IDs vía timing attack si se obtiene un token válido

## OpenResty 1.27.1.2 — Callbacks Bancarios
(Subagente corriendo)

## Infraestructura Revelada (CSP accounts.coinbase.com)

| Servicio | URL | Función |
|----------|-----|---------|
| **Onfido** | sdk.onfido.com | ID verification |
| **Onfido API** | api.onfido.com | Verification backend |
| **Onfido WebSocket** | wss://sync.onfido.com | Real-time verification |
| **Persona** | *.withpersona.com | Alternative identity verification |
| **Unqork** | coinbase.unqork.io | No-code platform (internal?) |
| **Datadog** | browser-intake-datadoghq.eu | APM/RUM monitoring |
| **Keyless** | wss://*.keyless.technology | Web3 wallet auth |
| **Cloudinary** | api.cloudinary.com | Image CDN |
| **WalletConnect** | relay.walletconnect.org | Web3 wallet connections |
| **CoinTracker** | embedded.cointracker.com | Portfolio tracking |
| **S3 Buckets** | coin-tracker-public.s3.*.amazonaws.com | Public S3 data? |
| **Arkose Labs** | ark.coinbase.com/v2/api.js | Bot detection captcha |
| **FingerprintJS** | fp.coinbase.com | Browser fingerprinting |
