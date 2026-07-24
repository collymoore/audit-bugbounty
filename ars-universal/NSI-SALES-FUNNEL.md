# NSI Sales Funnel — Proceso Comercial
**Versión:** 1.0  
**Clasificación:** NSI Confidencial — Uso interno  
**Propósito:** Flujo de venta en 3 pasos: acercamiento → recon leve → assessment profundo con Value-Based Pricing

---

## El Flujo en 1 Minuto

```
PASO 1                    PASO 2                    PASO 3
ACERCAMIENTO              RECON LEVE                ASSESSMENT PROFUNDO
─────────────             ──────────                ───────────────────
$0 para el cliente        $0 para el cliente        $$$ para el cliente

NSI investiga             Cliente autoriza          Se presenta la TARIFA:
OSINT público             scan ligero                  Base + Variable
(shodan, dns, web)        (puertos, headers,           (Value-Based)
                           versiones, swagger)
                                                    Cliente firma contrato
NSI → Cliente:            NSI → Cliente:            + autorización legal
"Señales de riesgo        "Confirmado. Hay
detectadas en su          riesgo. Para saber         NSI entrega:
infraestructura."         exactamente qué,            • Findings completos
                          necesitamos                 • PII y evidencia
                          autorización legal          • PoCs
                          y formal."                  • Plan de remediación
```

---

## Paso 1: Acercamiento — $0

### Disparador

NSI detecta señales de riesgo en OSINT público:
- Shodan: servidores expuestos, puertos abiertos
- DNS: subdominios, registros MX/SPF mal configurados
- Web: swagger público, endpoints sin auth, versiones vulnerables
- GitHub: secretos, tokens, configuraciones filtradas

### Acción de NSI

NSI prepara un briefing interno con:
- Qué se encontró (alto nivel, sin detalles)
- Por qué es relevante para ese cliente
- Estimación de riesgo (teórico)

### Contacto al Cliente

```
"Estimado [Nombre],

Hemos realizado un análisis preliminar de superficie
digital de [Empresa] y detectamos indicadores que
sugieren exposición de datos en su infraestructura.

Sin acceso no podemos confirmar el alcance, pero
la señal es suficientemente relevante como para
recomendar una revisión.

¿Podemos agendar 15 minutos para conversarlo?"
```

### Reglas del Paso 1

| ✅ Hacer | ❌ NO hacer |
|----------|-------------|
| Hablar de "señales" y "sospechas" | Decir "tienen la API expuesta" |
| Usar términos vagos pero creíbles | Dar direcciones IP, URLs, puertos |
| Crear curiosidad + urgencia | Entregar evidencia concreta |
| Pedir una reunión de 15 min | Enviar un reporte de hallazgos |

---

## Paso 2: Reconocimiento Leve — $0

### Requisito: Autorización del Cliente

El cliente debe autorizar EXPLÍCITAMENTE el reconocimiento. Puede ser por email o verbal en reunión, pero debe quedar registro.

```
"Cliente: 'OK, revisa lo que necesites.'
 NSI:   'Perfecto, gracias. Te confirmaremos
         los resultados en 48 horas.'
```

### Qué hace NSI

Con autorización, NSI ejecuta un scan ligero:

| Técnica | Qué busca | Límite |
|---------|-----------|--------|
| Port scanning | Puertos abiertos (80, 443, 22, 8080, 8443) | Sin explotación |
| HTTP headers | Security headers, server version | Lectura sola |
| Swagger discovery | /swagger, /api-docs, /openapi.json | Sin auth bypass |
| DNS enumeration | Subdominios, registros MX, TXT | Consultas públicas |
| Banner grabbing | Versiones de software | Sin fingerprinting agresivo |
| WAF detection | Cloudflare, Akamai, mod_security | Sin bypass |

### Lo que NO se hace en Paso 2

| ❌ Prohibido | Razón |
|-------------|-------|
| Fuzzing de endpoints | Puede ser considerado ataque |
| SQLi, XSS, RCE | Activo, requiere contrato |
| Fuerza bruta | Puede bloquear cuentas |
| Extracción de datos | Requiere autorización legal |
| Escaneo de vulnerabilidades | Requiere acuerdo de responsabilidad |

### Reporte al Cliente

```
"Confirmado.

Hemos ejecutado el reconocimiento autorizado y
encontramos múltiples vectores que requieren
investigación más profunda.

Para proceder a identificar, documentar y
cuantificar cada hallazgo con precisión,
necesitamos su autorización expresa y legal
por escrito.

En ese punto te presentaremos nuestra tarifa
y el alcance detallado del engagement."
```

### Reglas del Paso 2

| ✅ Hacer | ❌ NO hacer |
|----------|-------------|
| Confirmar existencia de riesgo | Decir "encontramos 10🔴" |
| Usar lenguaje de "múltiples vectores" | Decir "swagger expuesto en x.com" |
| Pedir autorización legal formal | Seguir escaneando sin autorización |
| Presentar la tarifa DESPUÉS | Decir "cuesta $X" en este paso |

---

## Paso 3: Assessment Profundo — Paga

### Requisito: Autorización Legal + Contrato Firmado

El cliente debe firmar:
1. **Autorización legal** — alcance del assessment, límites, reglas
2. **Contrato de servicios** — tarifa, entregables, plazos
3. **NDA** (si aplica) — confidencialidad de hallazgos

### Presentación de la Tarifa

```
Con base en el reconocimiento inicial, recomendamos
un Full Infrastructure Assessment.

NUESTRO MODELO DE PRECIO:

                BASE (cubre nuestro tiempo)
  ┌──────────────────────────────────────────┐
  │ Full Infrastructure         $12,000      │
  │ (o el tipo que aplique)                  │
  └──────────────────────────────────────────┘

              VARIABLE (refleja el valor)
  ┌──────────────────────────────────────────┐
  │ 🔴 Crítico              $1,500 c/u        │
  │ 🟡 Alto                 $750 c/u          │
  │ 🟢 Medio                $250 c/u          │
  │ 🔵 Bajo/Info            $50 c/u           │
  └──────────────────────────────────────────┘

  TECHO: 2x la base (nunca pagas más del doble)
  GARANTÍA: Sin 🔴 → 50% descuento en variable

  EJEMPLO (basado en cliente similar):
  ──────────────────────────────────────
  Base:                     $12,000
  10🔴 + 4🟡                $18,000
  Techo aplicado:           $24,000
  Breach potencial:         $3.97M
  ROI:                      165x
```

### Opciones para el Cliente

| Opción | Cuándo | Precio |
|--------|--------|:------:|
| **Value-Based** (base + variable) | Cliente quiere pagar según valor | $5K-$30K |
| **Fixed Price** (solo base) | Cliente necesita presupuesto cerrado | $5K-$25K |
| **Bronze** (compliance check) | Cliente solo quiere certificación | $2.5K-$5K |

### Entregables de la Fase 3

| Entregable | Descripción |
|------------|-------------|
| Reporte técnico NSI-SA | Hallazgos detallados con CVSS, CWE, PoCs |
| Carta de valor NSI-LTR | Valor comercial del breach evitado |
| Datasets PII | Evidencia completa de datos expuestos |
| Plan de remediación | Pasos priorizados P0-P2 para corregir |
| Certificación (opcional) | Compliance check si aplica |

---

## Tabla Resumen

| | Paso 1 | Paso 2 | Paso 3 |
|---|:------:|:------:|:------:|
| **Costo para cliente** | $0 | $0 | $5K-$30K |
| **Lo que hace NSI** | OSINT público | Scan ligero autorizado | Assessment completo |
| **Lo que recibe cliente** | Sospecha de riesgo | Confirmación de riesgo | Findings + remediación |
| **Autorización requerida** | Ninguna | Verbal/email | Contrato firmado |
| **Se menciona tarifa** | ❌ No | ❌ No | ✅ Sí |
| **Se dan detalles** | ❌ No | ❌ No (solo que hay) | ✅ Sí (qué, dónde, cómo) |

---

## Reglas de Oro del Funnel

### 1. La tarifa se presenta SOLO en el Paso 3
Si el cliente pregunta precio en Paso 1 o 2: "Primero confirmamos que hay riesgo, luego te doy un número exacto basado en lo que encontremos."

### 2. No regales el producto
Paso 2 muestra EXISTENCIA de riesgo. Paso 3 muestra UBICACIÓN + REMEDIACIÓN. Si muestras la ubicación en Paso 2, el cliente contrata a un técnico por $500, no a NSI por $24K.

### 3. Autorización legal ANTES del assessment profundo
Sin contrato firmado, no hay Fase 3. Punto.

### 4. El cliente no sabe que hay 3 pasos
Para el cliente, es una conversación natural: "déjame revisar" → "sí hay algo" → "OK, hazlo completo". El funnel es interno de NSI.

### 5. Siempre tener un caso comparable
"Tuvimos un caso similar en [industria]. Encontramos $X en hallazgos y el breach potencial era $Y." — esto le da contexto al precio.

---

## Script Rápido para Cada Paso

### Paso 1 (acercamiento)

> *"Hemos visto señales en fuentes públicas que sugieren que [Empresa] podría tener exposición de datos. Nada confirmado aún, pero vale la pena echarle un ojo. ¿Te parece si hacemos un barrido ligero y te contamos qué vemos?"*

### Paso 2 (entrega de resultados)

> *"Confirmation. Hay riesgo real — múltiples vectores detectados. Para darte el detalle exacto con cada hallazgo documentado y su plan de remediación, necesitamos un engagement formal. ¿Te parece si te presento cómo trabajamos y la tarifa?"*

### Paso 3 (presentación de tarifa)

> *"Nuestro modelo es simple: una base que cubre nuestro tiempo, más un variable por cada hallazgo crítico que encontremos. Tiene techo, así que sabes el máximo desde el día uno. Y si no hay hallazgos críticos, te hacemos descuento. ¿Te parece justo?"*

---

*NSI Sales Funnel v1.0 | Null Session Intelligence LLC*
*Contact: operations@nullsessionintelligence.com*
