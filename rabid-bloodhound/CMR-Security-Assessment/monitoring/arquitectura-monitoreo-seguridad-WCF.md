# Arquitectura de Monitoreo y Detección de Intrusiones — Ecosistema WCF/IIS

> **Contexto:** Ecosistema WCF (.NET Framework / .NET Core) sobre IIS. Actualmente sin logging de seguridad. `debugMode` expone información sensible en producción.
> **Objetivo:** Diseñar un sistema integral de monitoreo, detección de intrusiones, alertamiento, forensia y respuesta a incidentes.

---

## Tabla de Contenidos

1. [SIEM Centralizado con Logs WCF/IIS](#1-siem-centralizado-con-logs-wcfiis)
2. [Alertas de Seguridad en Endpoints WCF](#2-alertas-de-seguridad-en-endpoints-wcf)
3. [Detección de Anomalías en Accesos](#3-detección-de-anomalías-en-accesos)
4. [Forensia Digital](#4-forensia-digital)
5. [Playbooks de Respuesta a Incidentes](#5-playbooks-de-respuesta-a-incidentes)
6. [Implementación Priorizada](#6-implementación-priorizada)
7. [Costo y Recursos Estimados](#7-costo-y-recursos-estimados)

---

## 1. SIEM Centralizado con Logs WCF/IIS

### 1.1 Stack Tecnológico Recomendado

| Componente | Tecnología | Propósito |
|---|---|---|
| **Recolector de logs** | Filebeat + Winlogbeat (Windows) | Enviar logs IIS, EventLog y WCF hacia el SIEM |
| **Cola / Buffer** | RabbitMQ o Redis | Resiliencia ante picos de tráfico |
| **SIEM Core** | **Wazuh** (Open Source) o **ELK Stack** (Elastic Security) | Correlación, almacenamiento, dashboards |
| **Almacenamiento** | Elasticsearch (hot/warm/cold tiers) | Indexación y retención |
| **Dashboards** | Kibana / Wazuh Dashboard | Visualización |

**Recomendación:** Wazuh para equipos pequeños/medianos; Elastic Security + Fleet para equipos con presupuesto y equipo dedicado.

### 1.2 Fuentes de Logging

#### A. HTTP Logging IIS (W3C Extended)
```xml
<!-- IIS web.config — HTTP logging mejorado -->
<system.webServer>
  <httpLogging>
    <customFields>
      <add name="X-Forwarded-For" />
      <add name="X-Real-IP" />
      <add name="User-Agent" />
    </customFields>
  </httpLogging>
</system.webServer>
```

#### B. WCF Service Model Tracing
```xml
<!-- web.config — WCF tracing -->
<system.diagnostics>
  <sources>
    <source name="System.ServiceModel" 
            switchValue="Warning, ActivityTracing"
            propagateActivity="true">
      <listeners>
        <add name="wcfTraceListener" 
             type="System.Diagnostics.XmlWriterTraceListener" 
             initializeData="C:\Logs\WCF\wcf_trace.svclog" />
      </listeners>
    </source>
    <source name="System.ServiceModel.MessageLogging"
            switchValue="Warning">
      <listeners>
        <add name="wcfMessageListener"
             type="System.Diagnostics.XmlWriterTraceListener"
             initializeData="C:\Logs\WCF\wcf_messages.svclog" />
      </listeners>
    </source>
  </sources>
  <trace autoflush="true" />
  <sharedListeners>
    <add name="wcfTraceListener" 
         type="System.Diagnostics.XmlWriterTraceListener"
         initializeData="C:\Logs\WCF\wcf_trace.svclog" />
  </sharedListeners>
</system.diagnostics>
```

#### C. Custom WCF Behavior — Auditoría de Seguridad
Se implementa un `IEndpointBehavior` y `IDispatchMessageInspector` para logging granular:

```csharp
public class SecurityAuditInspector : IDispatchMessageInspector
{
    private readonly SecurityAuditLogger _logger;
    private readonly ConcurrentDictionary<string, int> _anomalyCounter;

    public SecurityAuditInspector(SecurityAuditLogger logger, 
                                   ConcurrentDictionary<string, int> anomalyCounter)
    {
        _logger = logger;
        _anomalyCounter = anomalyCounter;
    }

    public object AfterReceiveRequest(ref Message request, 
                                     IClientChannel channel, 
                                     InstanceContext instanceContext)
    {
        var ctx = OperationContext.Current;
        var endpointPath = HttpContext.Current?.Request?.Url?.AbsolutePath ?? "unknown";
        var clientIp = GetClientIp(ctx);
        var userAgent = HttpContext.Current?.Request?.UserAgent;
        var authType = HttpContext.Current?.User?.Identity?.IsAuthenticated == true
            ? HttpContext.Current.User.Identity.AuthenticationType
            : "Anonymous";
        var identity = HttpContext.Current?.User?.Identity?.Name ?? "anonymous";
        var soapAction = ctx.IncomingMessageHeaders?.Action;
        var timestamp = DateTime.UtcNow;

        // Check debugMode flag
        var config = WebConfigurationManager.OpenWebConfiguration("~");
        var appSettings = config.AppSettings.Settings;
        bool debugMode = bool.TryParse(appSettings["debugMode"]?.Value, out var d) && d;
        string messageBodyPreview = null;

        if (debugMode && request?.ToString()?.Length < 2000)
        {
            messageBodyPreview = request?.ToString(); // Only log body if < 2KB and debug
        }

        var entry = new SecurityLogEntry
        {
            Timestamp = timestamp,
            ClientIp = clientIp,
            Endpoint = endpointPath,
            SoapAction = soapAction,
            Identity = identity,
            AuthenticationType = authType,
            UserAgent = userAgent,
            HttpMethod = HttpContext.Current?.Request?.HttpMethod,
            MessageBodyPreview = messageBodyPreview, // null unless debugMode
            SessionId = ctx.SessionId,
            RequestId = Guid.NewGuid().ToString()
        };

        _logger.Log(entry);

        // Anomaly tracking
        var key = $"{clientIp}:{endpointPath}";
        _anomalyCounter.AddOrUpdate(key, 1, (_, count) => count + 1);

        return entry.RequestId;
    }

    public void BeforeSendReply(ref Message reply, object correlationState)
    {
        var requestId = (string)correlationState;
        var faultCode = reply?.IsFault == true ? GetFaultCode(reply) : null;
        _logger.LogResponse(requestId, reply?.State?.ToString(), faultCode);
    }

    private string GetClientIp(OperationContext ctx)
    {
        var prop = ctx.IncomingMessageProperties;
        if (prop.TryGetValue(RemoteEndpointMessageProperty.Name, 
            out RemoteEndpointMessageProperty endpoint))
        {
            return endpoint.Address;
        }

        // Check X-Forwarded-For
        var request = HttpContext.Current?.Request;
        if (request?.Headers?["X-Forwarded-For"] != null)
            return request.Headers["X-Forwarded-For"].Split(',')[0].Trim();
        if (request?.Headers?["X-Real-IP"] != null)
            return request.Headers["X-Real-IP"];

        return request?.UserHostAddress ?? "unknown";
    }
}
```

#### D. WCF Custom Error Handler (reemplazo de debugMode)
```csharp
public class SafeErrorHandler : IErrorHandler
{
    public void ProvideFault(Exception error, MessageVersion version, ref Message fault)
    {
        var faultDetail = new FaultDetail
        {
            // NUNCA exponer stack traces ni innerException en prod
            Message = "Ocurrió un error interno. Referencia: " + Guid.NewGuid(),
            ErrorCode = HttpStatusCode.InternalServerError
        };

        // Log COMPLETO al SIEM, pero NO al cliente
        LogToSiem(error);
        
        fault = Message.CreateMessage(version,
            FaultCode.CreateSenderFaultCode("InternalError"),
            faultDetail, "http://schemas.nsilib.com/errors");
    }

    public bool HandleError(Exception error)
    {
        return true; // Marcamos como manejado
    }

    private void LogToSiem(Exception ex)
    {
        var entry = new
        {
            type = "wcf_error",
            timestamp = DateTime.UtcNow,
            message = ex.Message,
            stack_trace = ex.ToString(),
            inner_exception = ex.InnerException?.ToString(),
            source = ex.Source,
            target_site = ex.TargetSite?.Name,
            request_url = HttpContext.Current?.Request?.Url?.AbsoluteUri,
            client_ip = HttpContext.Current?.Request?.UserHostAddress
        };
        // Escribe a canal seguro (ver sección 1.3)
        WritetoSecureChannel(JsonSerializer.Serialize(entry));
    }
}
```

### 1.3 Secure Log Pipeline

```
┌────────────────────┐     ┌──────────────┐     ┌────────────────┐     ┌───────────────┐
│ WCF Service Host   │────>│ Filebeat      │────>│ RabbitMQ       │────>│ Logstash /    │
│ IIS (Windows)      │     │ (Winlogbeat)  │     │ (buffer/queue) │     │ Wazuh Agent   │
│ Custom Behavior    │     │ C:\Logs\WCF\  │     │                │     │ (parse/filter)│
│ EventLog Security  │     │ C:\inetpub\   │     │                │     │                │
└────────────────────┘     └──────────────┘     └────────────────┘     └───────┬───────┘
                                                                                │
                                                                        ┌───────▼───────┐
                                                                        │ Elasticsearch │
                                                                        │ (hot/warm/cold)│
                                                                        └───────┬───────┘
                                                                                │
                                                                        ┌───────▼───────┐
                                                                        │ Kibana /      │
                                                                        │ Wazuh Indexer │
                                                                        │ Dashboards    │
                                                                        └───────────────┘
```

**Requerimientos de red:**
- Canal TLS 1.2+ entre Filebeat → RabbitMQ → Logstash → Elasticsearch
- Autenticación mutua (mTLS) entre agentes y servidor SIEM
- Segmentación de red: VLAN de monitoreo separada de VLAN de aplicación

### 1.4 Sistema de Logging — Niveles y Retención

| Tipo de Log | Nivel por Defecto | Retención | Volumen Estimado |
|---|---|---|---|
| IIS Access Logs (W3C) | Info | 90 días hot, 1 año warm, 3 años cold | ~500 MB/día por servidor |
| WCF ServiceModel | Warning | 30 días | ~200 MB/día |
| WCF MessageLogging | Off (activar bajo sospecha) | 7 días | ~2 GB/día (solo cuando se activa) |
| WCF Custom SecurityAudit | Info | 1 año | ~100 MB/día |
| Windows Security EventLog (4688, 4625, etc.) | Audit Success/Failure | 90 días | ~50 MB/día |
| Windows Application EventLog | Error/Warning | 30 días | ~30 MB/día |

### 1.5 Dashboard de Seguridad (Kibana / Wazuh)

Paneles clave a crear:
1. **Resumen de Amenazas** — Alertas activas por severidad (últimas 24h)
2. **Top Clientes por Endpoint** — IPs más activas + geolocalización
3. **Fallos de Autenticación** — Timeline de 4625 (Windows) + SOAP faults
4. **Errores WCF** — Faults por endpoint, stack traces indexados
5. **Tráfico Anómalo** — Desviación de baseline por hora/día

---

## 2. Alertas de Seguridad en Endpoints WCF

### 2.1 Taxonomía de Alertas

| Código | Nombre | Severidad | Fuente |
|---|---|---|---|
| WCF-001 | Fuzzing de SOAP Action | ALTA | SecurityAuditInspector |
| WCF-002 | Ataque de XML Bomb / XXE | ALTA | WCF MessageLogging + Filtro |
| WCF-003 | Inyección SQL en parámetros | ALTA | Custom Input Validator |
| WCF-004 | Brute Force de credenciales | MEDIA | SecurityAuditInspector |
| WCF-005 | Path transversal en endpoint | ALTA | IIS Logging + WAF |
| WCF-006 | debugMode activo en producción | CRÍTICA | Config Check + Custom Health |
| WCF-007 | Deserialización insegura | CRÍTICA | WCF Custom Behavior |
| WCF-008 | SOAP Faults repetidos (500) | MEDIA | SafeErrorHandler |
| WCF-009 | Acceso desde IP sospechosa | MEDIA | SIEM + Threat Intel |
| WCF-010 | Rate limit excedido por IP | MEDIA | AnomalyCounter |

### 2.2 Reglas Wazuh / Elastic Security

**Regla 1: debugMode Activo en Producción (CRÍTICA)**
```yaml
# wazuh/rules/wcf_debug_mode.xml
<rule id="100001" level="14">
  <if_group>wcf_config</if_group>
  <field name="debugMode">true</field>
  <description>CRÍTICO: debugMode habilitado en producción WCF</description>
  <mitre>
    <id>T1082</id>  <!-- System Information Discovery -->
  </mitre>
  <options>no_full_log</options>
</rule>
```

**Regla 2: Brute Force en Endpoints WCF**
```yaml
# wazuh/rules/wcf_bruteforce.xml
<rule id="100002" level="10" frequency="30" timeframe="300">
  <if_group>wcf_auth_failure</if_group>
  <same_source_ip />
  <description>Brute Force: 30+ fallos de autenticación en 5 min desde {src_ip}</description>
  <mitre>
    <id>T1110</id>  <!-- Brute Force -->
  </mitre>
</rule>
```

**Regla 3: Posible XXE / XML Bomb**
```elasicsearch
# elastic-security/rules/wcf_xxe.toml
[rule]
id = "WCF-002"
type = "query"
name = "Detected potential XML External Entity attack on WCF endpoint"
severity = "critical"
index = ["wcf-messages-*"]
query = '''
message.request.body : (
  "<!ENTITY" OR
  "<!DOCTYPE" OR
  "file:///" OR
  "expect://" OR
  "php://" OR
  "jar://"
)
'''
timeline = "5m"
```

**Regla 4: Deserialización Insegura**
```python
# Custom Wazuh decoder logic
def detect_insecure_deserialization(log_entry):
    dangerous_types = [
        "ObjectDataProvider",
        "SelectedItemsCollection",
        "ProcessStartInfo",
        "DataTable",
        "DataSet",
        "TypeConfuseDelegate"
    ]
    for t in dangerous_types:
        if t in log_entry.get("soap_body", ""):
            alert(
                rule_id="WCF-007",
                severity=14,
                description=f"Insecure deserialization detected: {t}",
                source=log_entry["client_ip"],
                data=log_entry
            )
            break
```

### 2.3 Implementación de Rate Limiting por Endpoint (Defensa en Profundidad)

```csharp
public class RateLimitBehavior : IEndpointBehavior
{
    private readonly RateLimiter _limiter;

    public RateLimitBehavior(int maxRequestsPerMinute = 60)
    {
        _limiter = new RateLimiter(maxRequestsPerMinute, TimeSpan.FromMinutes(1));
    }

    public void ApplyDispatchBehavior(ServiceEndpoint endpoint, 
                                       EndpointDispatcher endpointDispatcher)
    {
        var inspector = new RateLimitInspector(_limiter);
        endpointDispatcher.DispatchRuntime.MessageInspectors.Add(inspector);
    }
}

public class RateLimitInspector : IDispatchMessageInspector
{
    private readonly RateLimiter _limiter;

    public RateLimitInspector(RateLimiter limiter) => _limiter = limiter;

    public object AfterReceiveRequest(ref Message request, IClientChannel channel, 
                                       InstanceContext instanceContext)
    {
        var ctx = OperationContext.Current;
        var clientIp = GetClientIp(ctx);

        if (!_limiter.TryConsume(clientIp))
        {
            throw new WebFaultException<string>(
                "Rate limit exceeded. Try again later.",
                HttpStatusCode.TooManyRequests);
        }
        return null;
    }
}
```

### 2.4 Canales de Notificación

| Severidad | Tiempo de Respuesta | Canal |
|---|---|---|
| CRÍTICA (14-15) | < 1 min | SMS + Email + Slack/Teams + PagerDuty |
| ALTA (10-13) | < 5 min | Email + Slack/Teams + PagerDuty |
| MEDIA (6-9) | < 30 min | Email + Slack/Teams |
| BAJA (1-5) | Diario | Dashboard + Reporte |

---

## 3. Detección de Anomalías en Accesos

### 3.1 Baseline de Comportamiento

**Fase 1 — Baseline Estático (primeros 30 días)**
```sql
-- Elasticsearch query para establecer baseline
POST wcf-audit-*/_search
{
  "size": 0,
  "aggs": {
    "per_hour": {
      "date_histogram": { "field": "@timestamp", "interval": "hour" },
      "aggs": {
        "per_client": {
          "terms": { "field": "client_ip.keyword", "size": 100 },
          "aggs": {
            "endpoints": {
              "terms": { "field": "endpoint.keyword", "size": 20 }
            },
            "error_rate": {
              "avg": { "field": "is_error" }
            }
          }
        }
      }
    }
  }
}
```

**Parámetros de Baseline por Endpoint:**
- **Volume (RPM):** Media móvil de 7 días ± 3 desviaciones estándar
- **Hora del día:** Perfil de 24h (esperado vs real)
- **Geografía:** Orígenes esperados por endpoint
- **Ratio de error:** Tasa de faults SOAP esperada
- **Payload size:** Tamaño promedio de mensajes SOAP

### 3.2 Detección en Tiempo Real (Streaming Anomalies)

```python
# elastic-security/transform/wcf_anomaly_detection.py
from elasticsearch import Elasticsearch
import numpy as np
from datetime import datetime, timedelta

class WCFAnomalyDetector:
    def __init__(self, es_host: str):
        self.es = Elasticsearch(es_host)
        self.baselines = {}
        self.zscore_threshold = 3.0  # 3σ

    def detect_volume_anomaly(self, client_ip: str, endpoint: str, 
                               current_count: int) -> bool:
        """Detecta picos de tráfico por IP+endpoint usando Z-Score"""
        key = f"{client_ip}:{endpoint}"
        
        # 1-hour rolling window
        now = datetime.utcnow()
        result = self.es.search(index="wcf-audit-*", body={
            "query": {
                "bool": {
                    "filter": [
                        {"term": {"client_ip.keyword": client_ip}},
                        {"term": {"endpoint.keyword": endpoint}},
                        {"range": {"@timestamp": {
                            "gte": (now - timedelta(hours=1)).isoformat(),
                            "lte": now.isoformat()
                        }}}
                    ]
                }
            },
            "size": 0,
            "aggs": {
                "per_minute": {
                    "date_histogram": {"field": "@timestamp", "interval": "minute"}
                }
            }
        })
        
        buckets = result["aggregations"]["per_minute"]["buckets"]
        counts = [b["doc_count"] for b in buckets]
        
        if len(counts) < 10:
            return False  # Insufficient data
        
        mean = np.mean(counts)
        std = np.std(counts)
        
        if std == 0:
            return False
        
        zscore = (current_count - mean) / std
        return abs(zscore) > self.zscore_threshold

    def detect_time_pattern_anomaly(self, client_ip: str) -> bool:
        """Detecta actividad en horas no laborales / inusuales"""
        now = datetime.utcnow().hour
        # Baseline: obtener perfil horario de los últimos 7 días
        result = self.es.search(index="wcf-audit-*", body={
            "query": {
                "bool": {
                    "filter": [
                        {"term": {"client_ip.keyword": client_ip}},
                        {"range": {"@timestamp": {
                            "gte": (datetime.utcnow() - timedelta(days=7)).isoformat()
                        }}}
                    ]
                }
            },
            "size": 0,
            "aggs": {
                "hourly": {
                    "terms": {"field": "hour_of_day", "size": 24}
                }
            }
        })
        
        buckets = {b["key"]: b["doc_count"] for b in 
                   result["aggregations"]["hourly"]["buckets"]}
        
        active_hours = [h for h, c in buckets.items() if c > 0]
        if not active_hours:
            return False
        
        # Si la hora actual está fuera del rango histórico + 1h buffer
        min_hour = min(active_hours) - 1
        max_hour = max(active_hours) + 1
        return not (min_hour <= now <= max_hour)
```

### 3.3 Behavioral Analytics — Perfiles de Usuario

**Machine Learning Component (capa opcional):**

```python
# anomaly_models/user_profiling.py
from sklearn.ensemble import IsolationForest
import joblib

class WCFUserProfiler:
    """
    Aísla usuarios anómalos basado en:
    - Endpoints accesados (distribución)
    - Horas de actividad
    - Tasa de errores
    - Tamaño de payloads
    - IPs de origen (features geográficos y de reputación)
    """
    
    def __init__(self):
        self.model = IsolationForest(
            contamination=0.01,  # esperamos ~1% de anomalías
            random_state=42,
            n_estimators=100
        )
    
    def extract_features(self, log_entries: list) -> np.ndarray:
        features = []
        for entry in log_entries:
            features.append([
                entry.get("hour_of_day", 0),
                entry.get("error_rate", 0),
                entry.get("payload_size_bytes", 0),
                entry.get("unique_endpoints_today", 0),
                entry.get("requests_per_minute", 0),
                entry.get("is_known_ip", 0),
                entry.get("is_vpn", 0),     # proxy/VPN detection
                entry.get("geo_distance_km", 0),  # from usual location
            ])
        return np.array(features)
    
    def train(self, labeled_data: np.ndarray):
        self.model.fit(labeled_data)
        joblib.dump(self.model, "/opt/wazuh/models/user_profile.pkl")
    
    def predict(self, features: np.ndarray) -> list:
        return self.model.predict(features)  # -1 = anomalous
```

### 3.4 Reglas de Correlación SIEM

**Regla de Alta Severidad — Posible Compromiso de Cuenta:**
```plaintext
SI  (multiple endpoints accedidos desde IP nueva)
Y   (user agent inusual)
Y   (fuera del horario normal del usuario)
Y   (ubicación geográfica diferente al baseline)
ENTONCES → ALERTA WCF-009 (severidad ALTA)
         → Iniciar recolección forense inmediata
```

**Regla de Severidad Media — Escaneo de Endpoints:**
```plaintext
SI  (más de 20 endpoints únicos en 1 minuto)
Y   (más del 50% retorna Fault 400/500)
Y   (sin autenticación o autenticación fallida)
ENTONCES → ALERTA WCF-001 (Fuzzing)
         → Bloquear IP temporalmente (5 min)
         → Incrementar nivel de logging del source IP
```

### 3.5 Threat Intelligence Integration

- **Fuentes gratuitas:** AbuseIPDB, AlienVault OTX, Shodan
- **Feed comercial:** Recorded Future, VirusTotal, (opcional según presupuesto)
- **Propio:** Lista de IPs internas conocidas, rangos de VPN corporativos

```python
# threat_intel/ip_reputation.py
class IPReputationChecker:
    def __init__(self):
        self.blocklist = set()
        self.abuseipdb_key = os.getenv("ABUSEIPDB_API_KEY")
    
    def check_ip(self, ip: str) -> dict:
        # 1. Check local blocklist
        if ip in self.blocklist:
            return {"malicious": True, "source": "local_blocklist"}
        
        # 2. AbuseIPDB
        if self.abuseipdb_key:
            resp = requests.get(
                f"https://api.abuseipdb.com/api/v2/check?ipAddress={ip}",
                headers={"Key": self.abuseipdb_key, "Accept": "application/json"}
            )
            data = resp.json().get("data", {})
            if data.get("abuseConfidenceScore", 0) > 50:
                return {"malicious": True, "source": "abuseipdb", 
                        "score": data["abuseConfidenceScore"]}
        
        return {"malicious": False}
```

---

## 4. Forensia Digital

### 4.1 Cadena de Custodia Digital

**Principios:**
- Todo artifact forense debe preservar hash SHA-256 al momento de captura
- Metadata inmutable: timestamp, source, collector, chain-of-custody log
- Almacenamiento en volumen cifrado separado (LUKS / BitLocker)
- Acceso read-only a los investigadores (log de acceso para auditoría)

### 4.2 Colección Forense Automática (Triggered por Alertas)

```powershell
# scripts/collect_forensic_artifacts.ps1
# Ejecutado automáticamente cuando una alerta CRÍTICA/ALTA se dispara

param(
    [string]$IncidentId,
    [string]$TargetServer,
    [string]$ClientIp,
    [DateTime]$StartTime,
    [DateTime]$EndTime
)

$EvidencePath = "\\evidence-server\cases\$IncidentId"
New-Item -ItemType Directory -Path $EvidencePath -Force

# 1. IIS Logs relevantes
Copy-Item "C:\inetpub\logs\LogFiles\*\*.log" -Destination "$EvidencePath\iis_logs\" -Recurse

# 2. WCF Trace Logs
Copy-Item "C:\Logs\WCF\*" -Destination "$EvidencePath\wcf_traces\" -Recurse

# 3. Windows EventLog (Security + Application + System)
wevtutil epl Security "$EvidencePath\events_security.evtx"
wevtutil epl Application "$EvidencePath\events_application.evtx"
wevtutil epl System "$EvidencePath\events_system.evtx"

# 4. Memory dump del proceso W3WP (IIS worker process)
# Requiere ProcDump de Sysinternals
& "C:\Tools\procdump.exe" -ma w3wp "$EvidencePath\memory_dumps\w3wp.dmp"

# 5. Netstat connections
netstat -ano > "$EvidencePath\netstat_connections.txt"

# 6. Active network connections
Get-NetTCPConnection | Where-Object State -eq "Established" | 
    Export-Csv "$EvidencePath\tcp_connections.csv" -NoTypeInformation

# 7. Registry snapshot (WCF-related)
reg export "HKLM\SOFTWARE\Microsoft\InetStp" "$EvidencePath\registry_iis.reg"
reg export "HKLM\SYSTEM\CurrentControlSet\Services\W3SVC" "$EvidencePath\registry_w3svc.reg"

# 8. Running processes snapshot
Get-Process | Export-Csv "$EvidencePath\running_processes.csv" -NoTypeInformation

# 9. Scheduled tasks
schtasks /query /fo CSV /v | Out-File "$EvidencePath\scheduled_tasks.csv"

# 10. Generate SHA-256 manifest
Get-ChildItem -Recurse $EvidencePath | Where-Object {!$_.PSIsContainer} |
    Get-FileHash -Algorithm SHA256 | 
    Export-Csv "$EvidencePath\hash_manifest.csv" -NoTypeInformation

# 11. Chain of custody log
$custodyLog = @"
IncidentID: $IncidentId
Server: $TargetServer
Suspected Source IP: $ClientIp
Collection Window: $StartTime to $EndTime
Collection Timestamp: $(Get-Date -Format 'o')
Collector: $env:COMPUTERNAME\$env:USERNAME
Hash: $(Get-FileHash "$EvidencePath\hash_manifest.csv" -Algorithm SHA256).Hash
"@
$custodyLog | Out-File "$EvidencePath\chain_of_custody.txt"

# 12. Send notification
Send-MailMessage -To "forensics@nsilib.com"`
    -Subject "[FORENSIC] Evidence collected for incident $IncidentId"`
    -Body "Evidence path: $EvidencePath"`
    -SmtpServer "mail.nsilib.com"
```

### 4.3 Evidencia por Tipo de Incidente

| Tipo de Incidente | Artifacts a Colectar | Prioridad |
|---|---|---|
| Intrusión WCF (deserialización) | Memory dump w3wp, WCF traces, IIS logs, EventLog Security | Inmediata |
| Brute Force | IIS logs, EventLog 4625, WCF SecurityAudit logs, netstat | 1 hora |
| XXE / XML Injection | WCF MessageLog, IIS logs, payload samples, memory dump | Inmediata |
| debugMode expuesto | Web.config, IIS logs, WCF traces, EventLog Application | 1 hora |
| Acceso no autorizado | IIS logs, EventLog Security (4624/4625), WCF SecurityAudit, netstat | Inmediata |

### 4.4 Timeline Forense (Elasticsearch → Kibana Timeline)

```python
# forensics/timeline_reconstruction.py
class ForensicTimeline:
    """Reconstruye linea de tiempo exacta de un incidente"""
    
    def build_timeline(self, incident_id: str, client_ip: str, 
                        start: datetime, end: datetime) -> list:
        timeline = []
        
        # 1. WCF audit entries
        timeline += self._query_index("wcf-audit-*", client_ip, start, end)
        
        # 2. IIS access logs
        timeline += self._query_index("iis-logs-*", client_ip, start, end)
        
        # 3. Windows EventLog
        timeline += self._query_index("winlogbeat-*", client_ip, start, end)
        
        # 4. WAF/IDS logs (si existen)
        timeline += self._query_index("waf-logs-*", client_ip, start, end)
        
        # Sort by timestamp
        timeline.sort(key=lambda x: x["@timestamp"])
        
        return timeline
    
    def export_to_csv(self, timeline: list, path: str):
        import csv
        with open(path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=[
                "@timestamp", "source", "log_type", "event_id", 
                "message", "client_ip", "endpoint", "severity"
            ])
            writer.writeheader()
            writer.writerows(timeline)
```

### 4.5 YARA Rules para Malware en IIS/WCF

```yara
# rules/wcf_malware.yara
rule WCF_WebShell_Detection
{
    meta:
        description = "Detecta webshells inyectadas en WCF/IIS"
        author = "NSI Forensics"
        severity = "critical"
    
    strings:
        $asp_exec = "System.Diagnostics.Process" nocase
        $shell_cmd = "cmd.exe" nocase
        $powershell = "powershell" nocase
        $eval = "eval(" nocase
        $request_param = "Request[" nocase
        $server_map = "Server.MapPath" nocase
        
    condition:
        any of ($asp_exec, $shell_cmd, $powershell) and
        any of ($eval, $request_param)
}

rule WCF_Backdoor_Service
{
    meta:
        description = "Detecta servicios WCF backdoor no autorizados"
        author = "NSI Forensics"
    
    strings:
        $service_contract = "ServiceContract" nocase
        $operation_contract = "OperationContract" nocase
        $reflection = "System.Reflection" nocase
        $code_dom = "System.CodeDom" nocase
        $assembly_load = "Assembly.Load" nocase
        
    condition:
        all of ($service_contract, $operation_contract) and
        any of ($reflection, $code_dom, $assembly_load)
}
```

---

## 5. Playbooks de Respuesta a Incidentes

### 5.1 Playbook — debugMode Expuesto en Producción (CRÍTICO)

```yaml
incident_type: debugMode_exposed
severity: CRITICAL (14)

# === DETECCIÓN ===
detection:
  - source: Config Health Check (cron cada 5 min)
  - source: Wazuh rule 100001
  - source: Security scan (escaneo de headers y cookies)

# === TRIAGE ===
triage:
  - step: Confirmar que debugMode está activo en producción
    action: Verificar web.config y appSettings
    tool: "curl -v https://service.nsilib.com/api/endpoint | grep -i debug"
    assignee: Security Engineer

  - step: Determinar alcance de exposición
    action: Revisar IIS logs 24h previas
    tool: Elasticsearch query "message: *stack_trace* OR *innerException*"
    assignee: Security Engineer

# === CONTENCIÓN ===
containment:
  - step: Deshabilitar debugMode inmediatamente
    action: |
      1. Web.config → <add key="debugMode" value="false" />
      2. IISRESET /NOFORCE
    auto: true  # Se puede automatizar

  - step: Revocar sesiones activas sospechosas
    action: |
      # Si se detectaron sesiones activas con debug expuesto
      foreach($session in Get-WCFSessions -Before $incidentTime) {
        Revoke-WCFSession -SessionId $session.Id
      }

  - step: Rotación de credenciales expuestas
    action: |
      - API keys expuestas en stack traces → regenerar
      - Connection strings expuestas → regenerar
      - Service account passwords → rotar

# === ERRADICACIÓN ===
eradication:
  - step: Validar que no hay cambios persistentes
    action: |
      git diff web.config
      certutil -hashfile web.config SHA256
      # Comparar con hash conocido
    assignee: DevOps Engineer

  - step: Implementar SafeErrorHandler (ver sección 1.2.D)
    action: |
      1. Agregar IErrorHandler a la configuración WCF
      2. Desplegar a staging → validar → deploy a producción
    reference: "Sección 1.2.D - SafeErrorHandler"

# === RECUPERACIÓN ===
recovery:
  - step: Monitoreo intensificado (24h)
    action: |
      - Incrementar logging level a Information
      - Set rate limits más estrictos
      - Revisar dashboards cada 4h

# === LECCIONES APRENDIDAS ===
post_mortem:
  - step: Root cause analysis
    questions:
      - "¿Por qué debugMode estaba activo en producción?"
      - "¿Por qué no lo detectó el CI/CD pipeline?"
      - "¿Cuánto tiempo estuvo expuesto?"
      - "¿Hay evidencia de explotación?"
  
  - step: Remediation
    actions:
      - Agregar gate en CI/CD que rechace si debugMode=true en web.config de producción
      - Agregar alerta de health check (Wazuh regla 100001)
      - Training: "Security review checklist para deploys"
```

### 5.2 Playbook — Deserialización Insegura WCF (CRÍTICO)

```yaml
incident_type: insecure_deserialization_wcf
severity: CRITICAL (14)

# === DETECCIÓN ===
detection:
  - source: Wazuh rule WCF-007
  - source: Custom decoder en WCF pipeline
  - source: WAF (Web Application Firewall) — bloqueo de tipos peligrosos
  - source: Network IDS — detección de payload malformed

indicators:
  - soap_action: "http://tempuri.org/IMyService/SomeMethod"
  - body_contains:
      - "ObjectDataProvider"
      - "SelectedItemsCollection"
      - "TypeConfuseDelegate"
  - source_ip: generalmente externa (no whitelisted)

# === TRIAGE (15 min) ===
triage:
  - step: Aislar el endpoint comprometido
    action: |
      1. Identificar qué endpoint WCF recibió el payload malicioso
      2. Revisar IIS log para request completo
      3. Verificar si hubo ejecución remota (RCE)
    tools:
      - Elasticsearch: "index:wcf-audit-* AND rule_id:WCF-007"
      - EventLog 4688 (process creation) cerca del timestamp
      - netstat del servidor para conexiones salientes inusuales

  - step: Evaluar impacto
    action: |
      1. Revisar EventLog 4688 para nuevos procesos creados por w3wp.exe
      2. Revisar conexiones salientes desde el servidor IIS
      3. Buscar archivos nuevos en C:\inetpub\wwwroot y C:\Windows\Temp
    assigned: Security Engineer

# === CONTENCIÓN (30 min) ===
containment:
  - step: Deshabilitar el endpoint específico
    action: |
      1. En web.config, comentar el <endpoint> comprometido
      2. opcional: AppPool recycle
    command: |
      appcmd set config /section:system.serviceModel/services
      /-[path='SuspiciousService.svc']

  - step: Bloquear IP origen en WAF/IIS
    action: |
      <!-- IIS IP Security -->
      <security>
        <ipSecurity allowUnlisted="true">
          <add ipAddress="<source_ip>" denied="true" />
        </ipSecurity>
      </security>
    auto: true

  - step: Tomar memory dump forense
    action: |
      procdump -ma w3wp C:\Forensics\$IncidentId\w3wp_pre_cleanup.dmp
    auto: true  # script forense (sección 4.2)

# === ERRADICACIÓN (2h) ===
eradication:
  - step: Implementar WCF Serialization Binder seguro
    action: |
      Crear o actualizar SerializationBinder personalizado que
      solo permita tipos conocidos y aprobados (whitelist approach).
    code: |
      public class SafeSerializationBinder : SerializationBinder
      {
          private static readonly HashSet<string> AllowedTypes = new()
          {
              "MyApp.Contracts.DataContract1",
              "MyApp.Contracts.DataContract2",
          };

          public override Type BindToType(string assemblyName, string typeName)
          {
              if (!AllowedTypes.Contains(typeName))
                  throw new SecurityException(
                      $"Tipo no permitido: {typeName}");
              return Type.GetType($"{typeName}, {assemblyName}");
          }
      }

  - step: Validar integridad de binarios WCF
    action: |
      Get-FileHash -Path "C:\inetpub\wwwroot\*\bin\*.dll" -Algorithm SHA256
      | Compare-Object -ReferenceObject (Import-Csv "baseline_hashes.csv")

  - step: Escanear en busca de webshells
    action: |
      yara -r rules/wcf_malware.yara C:\inetpub\wwwroot\
      yara -r rules/wcf_malware.yara C:\Windows\Temp\

# === RECUPERACIÓN (4h) ===
recovery:
  - step: Restaurar endpoint con protección
    action: |
      1. Deployar nueva versión con SafeSerializationBinder
      2. Habilitar MessageLogging (Warning) en el endpoint
      3. Monitorear por 24h antes de remover IP block temporal
    assigned: DevOps Engineer

  - step: Notificar stakeholders
    to:
      - CISO
      - Engineering Lead
      - Compliance Officer
    template: |
      Subject: [INCIDENT] Deserialización insegura WCF — $IncidentId
      Severity: CRITICAL
      Status: Contained | Eradicated | Recovered
      Timeline: $start → $end
      Impact: $impact_summary
      Evidence: $evidence_path

# === POST-MORTEM (72h) ===
post_mortem:
  - RCA_questions:
      - "¿Por qué el SerializationBinder no estaba configurado?"
      - "¿Por qué debugMode permitió verbose errors?"
      - "¿Faltó WAF rule para ObjectDataProvider?"
  - action_items:
      - [P0] Agregar SafeSerializationBinder a todos los endpoints WCF
      - [P0] CI/CD debe rechazar deploys sin SerializationBinder
      - [P1] Agregar WAF rule: "block ObjectDataProvider in SOAP body"
      - [P1] Implementar SecurityAuditBehavior en todos los servicios
      - [P2] Training: OWASP Deserialization para el equipo .NET
```

### 5.3 Playbook — Brute Force / Credential Stuffing (MEDIA)

```yaml
incident_type: bruteforce_wcf
severity: MEDIA (10)

# === DETECCIÓN ===
detection:
  - source: Wazuh rule 100002 (30 fallos en 5 min)
  - source: SecurityAuditInspector (AnomalyCounter)
  - source: Windows EventLog 4625 (multiple source IPs)

indicators:
  - ratio_auth_failures: >80% en últimos 5 min
  - source_ips: múltiples, frecuentemente ranges de proxy/VPN
  - endpoints_target: específicos (login.svc, auth.svc)
  - timing: automatizado (intervalos regulares entre requests)

# === TRIAGE ===
triage:
  - step: Confirmar que es un ataque (no error de integración)
    action: |
      1. Verificar User-Agents: ¿son consistentes o variados?
      2. Verificar IPs: ¿son proxies conocidos?
      3. Verificar usernames: ¿secuenciales o diccionario?
    tools: Elasticsearch dashboard de autenticación

# === CONTENCIÓN ===
containment:
  - step: Rate limiting automático
    action: Aplicar bloqueo de 5 min por IP
    auto: true

  - step: Bloquear IPs en firewall perimetral
    action: |
      # Fail2ban-style block via CSF/iptables
      iptables -A INPUT -s <source_ip> -j DROP
    auto: true  # integración SIEM → firewall

  - step: Multi-Factor Authentication (reforzar)
    action: |
      - Si el endpoint soporta MFA, habilitar temporalmente
      - Si no, priorizar implementación en el roadmap

# === ERRADICACIÓN ===
eradication:
  - step: Account lockout (si aplica)
    action: Bloquear cuentas objetivo del ataque
    auto: partial
    tool: |
      foreach($user in $targetedUsers) {
          Disable-ADAccount -Identity $user
      }

# === RECUPERACIÓN ===
recovery:
  - step: Desbloquear cuentas legítimas
    action: |
      1. Verificar que el ataque cesó
      2. Desbloquear cuentas una por una
      3. Forzar cambio de password

# === LECCIONES ===
post_mortem:
  - Si el ataque tuvo éxito: playbook de credenciales comprometidas
  - action_items:
      - [P0] Implementar rate limiting por IP (sección 2.3)
      - [P1] Agregar bloqueo automático de IPs por 24h en WAF
      - [P2] Considerar CAPTCHA en endpoints públicos
```

### 5.4 Playbook — XXE / XML Injection (CRÍTICO)

```yaml
incident_type: xxe_attack_wcf
severity: CRITICAL (14)

# === DETECCIÓN ===
detection:
  - source: Elastic rule WCF-002
  - source: WAF bloquing XXE payloads
  - source: Custom XML Reader en WCF

# === TRIAGE ===
triage:
  - step: Identificar servidores afectados
  - step: Revisar /etc/hosts, archivos de sistema (SSRF vía XXE)
  - step: Buscar data exfiltration (conexiones salientes, DNS queries)

# === CONTENCIÓN ===
containment:
  - step: Aplicar XML Reader seguro
    action: |
      Configurar XmlDictionaryReader con DtdProcessing=Prohibit
    code: |
      public class SafeXmlReaderBehavior : IEndpointBehavior
      {
          public void ApplyDispatchBehavior(...)
          {
              foreach (var op in endpoint.Contract.Operations)
              {
                  op.Behaviors.Add(new SafeXmlReaderBehavior());
              }
          }
      }

      // En cada endpoint: configurar XmlReaderSettings
      var settings = new XmlReaderSettings
      {
          DtdProcessing = DtdProcessing.Prohibit,
          XmlResolver = null,
          MaxCharactersFromEntities = 1024,
          MaxCharactersInDocument = 10 * 1024 * 1024  // 10MB max
      };

  - step: Bloquear data exfiltration
    action: |
      - Validar que el servidor no tenga conectividad saliente innecesaria
      - Revisar DNS query logs hacia IPs externas

# === ERRADICACIÓN ===
eradication:
  - step: Validate all XML processing is secured
  - step: Scan for files created via XXE (entity expansion attack)

# === RECUPERACIÓN ===
recovery:
  - step: Validar integridad de sistema de archivos (no files creados)

# === LECCIONES ===
post_mortem:
  - action_items:
      - [P0] DtdProcessing=Prohibit en todas las configuraciones WCF
      - [P0] Eliminar XmlResolver por defecto
      - [P1] Agregar WAF rule para bloqueo de DTD externos
```

---

## 6. Implementación Priorizada

### Fase 0 — Quick Wins (Día 1-2)
| Item | Esfuerzo | Impacto |
|---|---|---|
| Deshabilitar `debugMode` en producción | 5 min | Alto |
| Implementar `SafeErrorHandler` (no exponer stack traces) | 2h | Alto |
| Configurar IIS HTTP Logging (W3C extended) | 1h | Alto |
| Implementar `SafeSerializationBinder` | 3h | Crítico |

### Fase 1 — SIEM Básico (Semana 1-2)
| Item | Esfuerzo |
|---|---|
| Instalar Wazuh Agent en servidores IIS | 1 día |
| Configurar Filebeat para IIS logs y EventLog | 1 día |
| Desplegar Custom SecurityAuditBehavior | 2 días |
| Crear dashboards básicos en Kibana/Wazuh | 1 día |

### Fase 2 — Alertas Automáticas (Semana 3-4)
| Item | Esfuerzo |
|---|---|
| Reglas de SIEM (debugMode, brute force, XXE) | 2 días |
| Rate limiting por endpoint | 2 días |
| Integración con Slack/Teams/Email | 1 día |

### Fase 3 — Detección de Anomalías (Mes 2)
| Item | Esfuerzo |
|---|---|
| Baseline de comportamiento (30 días de datos) | Pasivo |
| Detector de Z-Score para volumen de tráfico | 3 días |
| Perfil de usuario (Isolation Forest) | 5 días |
| Threat Intelligence (AbuseIPDB) | 1 día |

### Fase 4 — Forensia y Playbooks (Mes 2-3)
| Item | Esfuerzo |
|---|---|
| Scripts de colección forense automática | 3 días |
| YARA rules para WCF webshells | 2 días |
| Playbook automation (SIEM → Firewall block) | 5 días |
| Post-mortem templates | 1 día |

---

## 7. Costo y Recursos Estimados

### Software (Open Source / Zero Cost)
| Componente | Costo |
|---|---|
| Wazuh SIEM | 0 (Open Source) |
| ELK Stack (Elasticsearch + Kibana) | 0 (Open Source, licencia básica) |
| Filebeat / Winlogbeat / Metricbeat | 0 (Open Source) |
| YARA | 0 |
| Sysinternals (ProcDump) | 0 |
| **Total Software** | **$0** |

### Infraestructura (Estimado)
| Componente | Especificación | Costo Mensual |
|---|---|---|
| SIEM Server (all-in-one) | 8 vCPU, 32GB RAM, 500GB SSD | ~$150 (VPS) |
| Elasticsearch storage | 2TB adicionales (capa cold) | ~$50 |
| RabbitMQ (si separado) | 4 vCPU, 8GB RAM | ~$80 |
| **Total Infraestructura** | | **~$280/mes** |

### Esfuerzo de Implementación
| Rol | Horas Estimadas |
|---|---|
| DevOps Engineer | 60h |
| .NET Developer (Custom Behaviors) | 40h |
| Security Engineer | 40h |
| **Total** | **~140h** |

---

## Apéndice A: Referencias

- [OWASP WCF Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [Microsoft WCF Security Guidance](https://learn.microsoft.com/en-us/dotnet/framework/wcf/feature-details/security-overview)
- [Wazuh Documentation](https://documentation.wazuh.com/current/)
- [Elastic Security Labs](https://www.elastic.co/security-labs)
- [MITRE ATT&CK — WCF/.NET Techniques](https://attack.mitre.org/techniques/T1559/002/)

## Apéndice B: Mitre ATT&CK Mapping

| Técnica | ID | Cobertura en esta arquitectura |
|---|---|---|
| Brute Force | T1110 | Regla WCF-004, Rate Limiting |
| Exploit Public-Facing Application | T1190 | WAF + Custom Validators |
| External Remote Services | T1133 | IP whitelisting, Auth audit |
| Valid Accounts | T1078 | Anomaly detection, Behavioral profiling |
| Indicator Removal | T1070 | EventLog forwarding (centralizado) |
| Obfuscated Files or Information | T1027 | YARA rules + XML validation |
| Ingress Tool Transfer | T1105 | File integrity monitoring + anomaly detection |
| Command and Scripting Interpreter | T1059 | Process monitoring (4688) |
| Defense Evasion | T1562 | EventLog immutability + SIEM centralizado |
| Data from Information Repositories | T1213 | debugMode protection |

---

> **Documento creado:** 2026-07-14
> **Versión:** 1.0
> **Clasificación:** INTERNO — CONFIDENCIAL
