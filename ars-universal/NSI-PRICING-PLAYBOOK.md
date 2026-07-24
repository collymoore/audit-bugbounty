# NSI Commercial Pricing Playbook — Value-Based con Margen para Descuento
**Versión:** 1.0  
**Clasificación:** NSI Confidencial — Solo uso interno  
**Propósito:** Estrategia de precios con margen incorporado para negociación comercial  
**Lema:** *"Pon el precio alto porque el cliente va a pedir descuento — y que se sienta ganador."*

---

## 1. La Regla de Oro

> **Todo precio de lista debe tener ~25% de margen para descuento.**
> El precio NETO es el objetivo. El precio LISTA es la herramienta de negociación.

El cliente siempre va a decir: *"Voy a hacerlo contigo, pero dame precio."*
Si el precio de lista ya tiene margen, el descuento no duele — y el cliente se siente ganador.

---

## 2. Tabla de Precios (Lista vs Neto)

### Base por tipo de engagement

| Tipo | Lista | -20% = Neto | Objetivo Real |
|------|:-----:|:-----------:|:-------------:|
| Web App Pentest | $6,500 | $5,200 | $5,000 |
| API Security | $9,100 | $7,280 | $7,000 |
| **Full Infrastructure** | **$15,000** | **$12,000** | **$12,000** |
| Red Team | $25,000 | $20,000 | $20,000 |
| Cloud Review (Azure/AWS/GCP) | $10,000 | $8,000 | $8,000 |
| OIDC/IAM Audit | $7,500 | $6,000 | $6,000 |
| Data Leak Assessment | $6,500 | $5,200 | $5,000 |
| Compliance Check (ISO/Ley 172-13) | $5,000 | $4,000 | $4,000 |

### Variable por findings (Value-Based)

| Severidad | Lista | -20% = Neto | Objetivo |
|:---------:|:-----:|:-----------:|:--------:|
| 🔴 Crítico | $1,900 | $1,520 | $1,500 |
| 🟡 Alto | $950 | $760 | $750 |
| 🟢 Medio | $320 | $256 | $250 |
| 🔵 Bajo | $65 | $52 | $50 |

### Techos y garantías

| Concepto | Valor |
|----------|:-----:|
| **Techo variable** | 2x la base |
| **Garantía sin críticos** | 50% descuento en variable |
| **Sin findings** | 50% descuento en base |
| **Tope por severidad** | 10 🔴 y 10 🟡 máx. |

---

## 3. Cómo Venderlo (Script de Venta)

### Paso 1: Presentar el modelo

> *"NSI tiene dos modelos de pricing. El primero es precio fijo tradicional — usted sabe exactamente cuánto paga. El segundo es **Value-Based**: usted paga una base por nuestro tiempo, más un variable según la criticidad de lo que encontremos. Ambos tienen techo, así que nunca se dispara."*

### Paso 2: Cuando el cliente pide descuento

> *"Claro — déjame ver qué puedo hacer. Normalmente doy hasta 20% en engagements completos."*

**El descuento ya está en el margen.** Se lo das, el cliente cree que ganó, y tú quedas en tu precio neto objetivo.

### Paso 3: Cerrar con ROI

> *"Para que te des una idea del valor: en un caso similar encontramos 10 hallazgos críticos. El breach potencial era de $3.97M. El assessment salió ~$24K. Eso es un ROI de 165x. Literalmente, por cada dólar que inviertes en seguridad, te ahorras 165."*

---

## 4. Ejemplos de Cotización

### Ejemplo 1: ARS Universal (Full Infrastructure, hallazgos reales)

```
┌─────────────────────────────────────────────────────────────┐
│ COTIZACIÓN — NSI Security Assessment                        │
│ Cliente: ARS Universal                                      │
│ Tipo: Full Infrastructure                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Base (Full Infrastructure):              $15,000           │
│  10 hallazgos 🔴 críticos × $1,900:      $19,000           │
│   4 hallazgos 🟡 altos × $950:            $ 3,800           │
│  ─────────────────────────────────────────────────          │
│  PRECIO DE LISTA:                         $37,800           │
│  Descuento comercial (20%):              -$ 7,560           │
│  ─────────────────────────────────────────────────          │
│  TOTAL:                                   $30,240           │
│                                                             │
│  Vs valor mercado del assessment:         $75K-$163K        │
│  Vs breach potencial:                     $3.97M            │
│  ROI estimado:                            131x              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo 2: Startup (Web App, sin críticos)

```
┌─────────────────────────────────────────────────────────────┐
│ COTIZACIÓN — NSI Security Assessment                        │
│ Cliente: Startup                                            │
│ Tipo: Web App Pentest                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Base (Web App):                            $6,500          │
│  0 hallazgos 🔴 × $1,900:                  $   0           │
│  2 hallazgos 🟡 × $950:                    $1,900           │
│  5 hallazgos 🟢 × $320:                    $1,600           │
│  ─────────────────────────────────────────────────          │
│  Variable subtotal:                        $3,500           │
│  Sin 🔴 → 50% desc. variable:            -$1,750           │
│  ─────────────────────────────────────────────────          │
│  PRECIO DE LISTA:                         $8,250            │
│  Descuento comercial (15%):              -$1,238            │
│  ─────────────────────────────────────────────────          │
│  TOTAL:                                   $7,013            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo 3: Empresa certificada (Compliance, 0 findings)

```
┌─────────────────────────────────────────────────────────────┐
│ COTIZACIÓN — NSI Security Assessment                        │
│ Cliente: Empresa Certificada                                │
│ Tipo: Compliance Check                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Base (Compliance):                        $5,000           │
│  Sin 🔴 → 50% desc. variable:             $   0             │
│  0 hallazgos → 50% desc. base:           -$2,500           │
│  ─────────────────────────────────────────────────          │
│  PRECIO DE LISTA:                        $2,500             │
│  (Sin descuento adicional — ya tiene      │                 │
│   la garantía de certificación)            │                 │
│  ─────────────────────────────────────────────────          │
│  TOTAL:                                   $2,500            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Sales Funnel — El Gancho

### El modelo de 2 fases

```
                    ╔══════════════════════════════════╗
                    ║  FASE 1: GRATIS (el gancho)      ║
                    ║  ───────────────────────────────  ║
                    ║  • Scan ligero automatizado       ║
                    ║  • Entregas SOLO el 3-5%          ║
                    ║  • "Definitivamente tienes esto   ║
                    ║    expuesto" — teórico            ║
                    ║  • NO entregas PII real           ║
                    ║  • NO entregas evidencia concreta ║
                    ║  • El cliente sabe que SÍ hay     ║
                    ║    problema, pero no sabe cuál    ║
                    ╚══════════════════════════════════╝
                                │
                                ▼ COMPRA
                    ╔══════════════════════════════════╗
                    ║  FASE 2: PAGA (el producto)      ║
                    ║  ───────────────────────────────  ║
                    ║  • Full assessment + Value-Based  ║
                    ║  • Aquí SÍ: findings, PII, PoCs  ║
                    ║  • Plan de remediación completo   ║
                    ║  • Reporte formal + carta valor   ║
                    ║  • El cliente paga por la verdad  ║
                    ║    completa                       ║
                    ╚══════════════════════════════════╝
```

### Por qué el 3-5% es la clave

| Si entregas... | El cliente... | Resultado |
|----------------|---------------|:---------:|
| **0%** (solo teoría) | No cree que haya riesgo | ❌ No compra |
| **100%** (todo gratis) | Ya tiene lo que necesita | ❌ No paga |
| **3-5%** (suficiente para saber que hay) | Sabe que hay riesgo pero no sabe cuál | ✅ **COMPRA** |

### Cómo presentar la Fase 1

> *"Hicimos un barrido preliminar de tu infraestructura digital. Los resultados indican **múltiples vectores críticos** con datos expuestos. Hay suficiente evidencia para recomendar un assessment completo — no puedo entrar en detalles sin un engagement formal, pero el riesgo es real y medible."*

**Regla ABSOLUTA: No menciones dónde. Menciona solo el QUÉ.**

| ❌ Mal | ✅ Bien |
|--------|---------|
| "Su API SISAC en QA está expuesta" | "Identificamos exposiciones críticas en su infraestructura cloud" |
| "Encontramos 100+ endpoints sin auth" | "Múltiples vectores de ataque detectados" |
| "Oracle INSERT sin auth" | "Capacidad de escritura no autorizada confirmada" |
| "Swagger público en app-ars-sisac..." | "Documentación interna de APIs filtrada" |

Si el cliente sabe DÓNDE está el hoyo, contrata a un técnico por $500 para tapar ESE hoyo.
Si el cliente sabe QUE hay hoyos pero no DÓNDE, contrata a NSI por $24K para encontrarlos TODOS.

**El cliente tiene dos opciones:**
1. Ignorarlo (riesgo: breach de $1.5M-$5M+)
2. Pagar el assessment (inversión: $5K-$30K, ROI: 165x)

### Ejemplo ARS Universal (aplicado)

```
FASE 1 (Gratis):
  "Señor ARS, identificamos exposiciones críticas en
   su infraestructura cloud. Múltiples vectores con
   datos de afiliados accesibles. Recomendamos un
   assessment completo para determinar el alcance real."

  → NO le decimos qué endpoint, qué host, qué datos
  → Solo le decimos: hay riesgo, es medible, sabemos encontrarlo

FASE 2 ($24K):
  "Aquí están los 10 hallazgos críticos, los 19,031
   registros PII que encontramos, y el plan para
   cerrar todo. Breach potencial: $3.97M."
```

### Regla de oro del gancho

> **Nunca entregues el producto en la fase gratis.**
> La fase 1 prueba que SABEMOS. La fase 2 demuestra QUÉ.

---

## 6. Estrategia de Negociación

### Regla del 20%

| El cliente dice... | Tú respondes... | Impacto en margen |
|-------------------|-----------------|:-----------------:|
| "Está caro" | "Te entiendo. ¿Qué tal si ajustamos el alcance?" | 0% (cambias scope, no precio) |
| "Dame precio" | "OK — puedo hacerte 15-20% en este engagement" | 0% (margen incorporado) |
| "Otro me cobra menos" | "El otro no te da una calculadora de breach, techo, ni ROI garantizado" | 0% (defiendes valor) |
| "Solo tengo presupuesto de $X" | "Podemos empezar con un Web App y escalar" | 0% (cambias scope) |
| "Con descuento te firmo hoy" | "Trato hecho — 20% si facturas antes del viernes" | 0% (pronto pago) |

### Lo que NO se negocia

- ❌ El techo (2x base) — es la protección del cliente
- ❌ La garantía sin críticos — es la confianza en NSI
- ❌ La variable por severidad — es el value-based
- ✅ Lo que se negocia: el descuento comercial (15-20%)

### Señales de cierre

| Señal | Respuesta |
|-------|-----------|
| "Voy a hacerlo contigo, pero dame precio" | Aplicar 20% de descuento directo |
| "Mándame la cotización" | Enviar con precio de lista (sin descuento). Cuando pida ajuste, aplicar 15-20% |
| "Está dentro de mi presupuesto" | No ofrecer descuento — YA aceptó |
| "Firmo hoy si..." | Aceptar descuento + pronto pago |

---

## 6. Estrategia de Negociación

### Regla del 20%

| Momento | Acción |
|---------|--------|
| Assessment completado | Entregar reporte con findings |
| Si hay 🔴 hallazgos | "Basado en lo que encontramos, ¿quieres que implementemos las correcciones?" — upselling natural |
| Si hay 🟢 hallazgos | "Tu infraestructura está sólida. ¿Quieres un certificado de compliance?" — certificación |
| 3 meses después | "¿Quieres un re-assessment para ver si mejoramos?" — recurrencia |
| 12 meses después | "¿Cómo ha evolucionado tu superficie de ataque? Hagamos el anual." — retención |

### El costo de adquirir un cliente nuevo vs retener uno existente

Adquirir: 5x más caro que retener. Si el assessment inicial fue bueno, el cliente vuelve. El Value-Based Pricing hace que el segundo assessment sea más barato (menos findings) — y el cliente ve progreso medible.

---

## 7. Resumen de Precios (Cheat Sheet)

| Tipo | Lista | -15% | -20% | Objetivo |
|------|:-----:|:----:|:----:|:--------:|
| Web App | $6,500 | $5,525 | $5,200 | $5,000 |
| API | $9,100 | $7,735 | $7,280 | $7,000 |
| Full Infra | $15,000 | $12,750 | $12,000 | $12,000 |
| Red Team | $25,000 | $21,250 | $20,000 | $20,000 |
| Cloud | $10,000 | $8,500 | $8,000 | $8,000 |
| OIDC/IAM | $7,500 | $6,375 | $6,000 | $6,000 |
| Data Leak | $6,500 | $5,525 | $5,200 | $5,000 |
| Compliance | $5,000 | $4,250 | $4,000 | $4,000 |
| 🔴 $1,900 | $1,615 | $1,520 | $1,500 |
| 🟡 $950 | $808 | $760 | $750 |

---

*NSI Commercial Pricing Playbook v1.0 | Null Session Intelligence LLC*
*Contact: operations@nullsessionintelligence.com*
