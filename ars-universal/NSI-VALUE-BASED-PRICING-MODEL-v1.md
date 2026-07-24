# NSI Pricing Model — Value-Based Assessment
**Versión:** 1.0  
**Clasificación:** NSI Confidencial  
**Propósito:** Modelo de pricing híbrido: base + variable por findings  
**Estado:** Propuesta — pendiente validación con piloto (ARS Universal)

---

## 1. El Problema

Un assessment de seguridad en una empresa sin vulnerabilidades críticas NO debería costar lo mismo que uno en una empresa con 10 hallazgos 🔴 exponiendo 18,948 registros PII.

El pricing tradicional (horas/días/fijo) no refleja el VALOR del servicio. El valor del assessment está en los findings que descubre y el breach que previene.

## 2. El Modelo: Híbrido Base + Variable

```
PRECIO TOTAL = BASE + VARIABLE
              (cubre costo)  (captura valor)

Con TECHO = 2 × BASE (certeza para el cliente)
```

### 2.1 Base Fija por Tipo de Engagement

| Tipo Assessment | Base | Cubre |
|----------------|:----:|-------|
| Web App Pentest | $5,000 | Alcance definido, 1-2 semanas, reporte |
| API Security Assessment | $7,000 | Hasta 50 endpoints, autenticación, OWASP API Top 10 |
| Full Infrastructure | $12,000 | Red, cloud, aplicaciones, hasta 100 IPs/URLs |
| Red Team | $20,000 | 2 semanas, objetivo definido, sin restricciones |
| Cloud Review (Azure/AWS/GCP) | $8,000 | Por proveedor, hasta 20 servicios |
| OIDC/IAM Audit | $6,000 | Hasta 3 IDPs, flujos OAuth, configuración |
| Data Leak Assessment | $5,000 | Búsqueda exhaustiva, scraping, OSINT |
| Compliance Check (ISO/Ley 172-13) | $4,000 | Mapeo de controles, gap analysis |

### 2.2 Variable por Findings

| Severidad | Factor | Precio Unitario | Descripción |
|:---------:|:------:|:---------------:|-------------|
| 🔴 Crítico | 1.0x | $1,500 | Breach inminente, PII expuesta, RCE, acceso no auth |
| 🟡 Alto | 0.5x | $750 | Vulnerabilidad explotable con condiciones, PII limitada |
| 🟢 Medio | 0.17x | $250 | Debilidad de seguridad, requiere otro factor para explotar |
| 🔵 Bajo/Info | 0.03x | $50 | Falta de hardening, información, best practice |

### 2.3 Techo y Garantías

| Regla | Valor |
|-------|:-----:|
| **Techo máximo** | **2 × Base** (el cliente nunca paga más del doble de la base) |
| **Garantía sin críticos** | Si hay 0 hallazgos 🔴, la variable se descuenta 50% |
| **Garantía sin hallazgos** | Si hay 0 hallazgos de cualquier tipo, solo se cobra el 50% de la base |
| **Tope por hallazgo** | Máximo 10 hallazgos por severidad cuentan para la variable |

## 3. Ejemplos

### Ejemplo 1: ARS Universal (Real)

| Concepto | Cálculo | Monto |
|----------|:-------:|:-----:|
| Base — Full Infra | — | $12,000 |
| 10 🔴 × $1,500 | $15,000 | |
| 4 🟡 × $750 | $3,000 | |
| **Variable subtotal** | | $18,000 |
| Techo aplicado (2× $12,000) | | $24,000 ✓ |
| **Total** | | **$24,000** |

**Valor de referencia:** $3.97M (breach potencial según calculadora)
**ROI para el cliente:** 165x
**Vs valor mercado del assessment:** $75K-$163K (ahorro del 68-85%)

### Ejemplo 2: Cliente Pequeño (Sin Hallazgos Críticos)

| Concepto | Cálculo | Monto |
|----------|:-------:|:-----:|
| Base — Web App | — | $5,000 |
| 0 🔴 × $1,500 | $0 | |
| 2 🟡 × $750 | $1,500 | |
| 5 🟢 × $250 | $1,250 | |
| **Variable subtotal** | | $2,750 |
| Sin 🔴 → 50% desc. variable | | $1,375 |
| **Total** | | **$6,375** |

### Ejemplo 3: Cliente Certificado (0 Findings)

| Concepto | Cálculo | Monto |
|----------|:-------:|:-----:|
| Base — Compliance Check | — | $4,000 |
| 0 hallazgos → 50% desc. base | | $2,000 |
| **Total** | | **$2,000** |

## 4. Comparativa con Modelos Tradicionales

| Aspecto | Pricing Fijo | Pricing por Hora | **Value-Based NSI** |
|---------|:------------:|:----------------:|:-------------------:|
| Predictibilidad | ✅ Alta | ❌ Baja | ✅ Alta (techo 2x) |
| Refleja valor | ❌ No | ❌ No | ✅ Sí |
| Justo con cliente sano | ❌ Paga igual | ❌ Paga igual | ✅ Paga menos |
| Justo con NSI | ❌ Infravalorado | ✅ Sí | ✅ Sí |
| Diferenciación | ❌ Commoditie | ❌ Commoditie | ✅ Único en RD |
| Fácil de comunicar | ✅ Sí | ✅ Sí | 🟡 Requiere 2 min más |
| Escalable | ✅ Sí | ❌ No | ✅ Sí |

## 5. Recomendaciones de Implementación

### 5.1 Piloto

1. **Cliente piloto:** ARS Universal (datos ya disponibles)
2. **Propuesta:** Presentar el modelo como "Value-Based Pricing NSI" — opción A vs precio fijo tradicional (opción B)
3. **Métrica de éxito:** El cliente elige el modelo value-based sobre el fijo

### 5.2 Material de Venta

- Tabla de precios base (1 página)
- Calculadora rápida (3 clics → precio)
- Testimonios/Casos (ARS Universal como referencia de ROI)

### 5.3 Automatización (OmniRoute)

Inputs del sistema:
- Tipo de engagement (dropdown)
- Número de hallazgos por severidad (4 campos)
- Cálculo automático: base + variable (con techo)
- Generación de cotización en PDF con desglose

### 5.4 Iteración

| Versión | Mejora |
|:-------:|--------|
| v1.0 | Precios fijos por severidad, techo 2x, garantía sin críticos |
| v1.1 | Ajuste de factores según industria (salud +20%, retail -20%) |
| v1.2 | Integración con calculadora de breach para variable dinámica |
| v2.0 | Precio = % del breach estimado (modelo puro value-based) |

## 6. Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Cliente percibe conflicto de interés (inflar findings) | Variable se calcula DESPUÉS del assessment. El cliente sabe los findings antes de saber el precio ajustado. Techos transparentes. |
| Competidores copian el modelo | NSI tiene la calculadora de breach (NSI-COST-BASE-TABLE). Copiar el modelo sin los datos es copiar la cáscara. |
| Cliente institucional necesita presupuesto fijo | Ofrecer ambas opciones: Value-Based (recomendado) o Fixed Price (tradicional). El cliente elige. |
| Volatilidad de ingresos para NSI | La base cubre costos fijos. La variable es bonus. El techo evita que un solo cliente distortione. |

---

## 7. Conclusión

El modelo híbrido (base + variable con techo) es la respuesta más sensata y aterrizada a la pregunta original. Es:

- **Justo** — cliente sin findings paga menos
- **Rentable** — NSI captura valor cuando crea valor
- **Simple** — cabe en una tabla de 3 columnas
- **Diferenciador** — ningún competidor local lo hace
- **Escalable** — funciona para startups y empresas grandes
- **Automatizable** — OmniRoute puede generar cotizaciones dinámicas

**Próximo paso:** Piloto con ARS Universal. Presentar ambas opciones y validar.

---

*NSI Pricing Model v1.0 | Null Session Intelligence LLC*
*Contact: operations@nullsessionintelligence.com*
