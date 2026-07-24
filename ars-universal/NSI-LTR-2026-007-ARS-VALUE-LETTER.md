# NSI-LTR-2026-007-ARS
**Título:** Propuesta de Valor y Análisis Comparativo de Costos
**Cliente Potencial:** ARS Universal
**Preparado por:** Jonatan Collymoore — Null Session Intelligence LLC
**Contacto:** operations@nullsessionintelligence.com

---

## 1. Resumen Ejecutivo

El assessment de seguridad realizado sobre la infraestructura digital de ARS Universal (QA) identificó **18,948 registros PII expuestos** a través de **10 vulnerabilidades críticas** y **4 moderadas**. Este documento establece el valor del assessment frente al costo potencial de un breach, basado en estándares de la industria, datos del IBM Cost of Data Breach Report 2025, y regulaciones aplicables.

---

## 2. Valuación del Assessment Realizado

### 2.1 Scope del Trabajo

| Componente | Descripción | Horas Estimadas |
|------------|-------------|:---------------:|
| **Descubrimiento de infraestructura** | Identificación de 20+ activos (Azure App Services, IDPs, APIs, Blob Storage, gateways) | 12h |
| **Análisis de código frontend** | Revisión de JS bundles (325 KB) de 2 SPAs (enlínea, cotizador) | 8h |
| **Prueba de 36+ endpoints API** | Mapeo completo del swagger SISAC (184 KB, 100+ endpoints) | 16h |
| **Evaluación de 3 IDPs OIDC** | Grants, scopes, clientes, misconfiguraciones | 8h |
| **Extracción exhaustiva de PII** | 826 queries de búsqueda, 36 endpoints, 350+ términos | 20h |
| **Análisis de seguridad cloud** | Azure Blob Storage, Azure App Services | 6h |
| **Reporte profesional** | Documentación NSI-SA + NSI-LTR + hallazgos | 8h |
| **Total** | **Assessment completo** | **~78h** |

### 2.2 Valuación por Componente

Basado en tarifas de mercado 2026 (BlazeInfoSec, Invicti, Bright Defense):

| Componente | Precio de Mercado | Referencia |
|------------|:-----------------:|------------|
| Web Application Pentest (complejo) | $20,000 — $40,000 | Bright Defense 2026 |
| API Security Assessment | $15,000 — $35,000 | DeepStrike 2025 |
| Infraestructura Cloud (Azure) | $10,000 — $25,000 | Autonoma 2026 |
| OIDC / IAM Assessment | $8,000 — $18,000 | Estimado especializado |
| Code Review (JS/SPA) | $7,000 — $15,000 | Invicti 2026 |
| Data Leak Assessment | $10,000 — $20,000 | Estimado especializado |
| Reporte + Remediation Plan | $5,000 — $10,000 | Estándar industria |

**Valor total de mercado del assessment:** **$75,000 — $163,000 USD**

---

## 3. Costo de un Breach Equivalente

### 3.1 Benchmarks IBM Cost of Data Breach Report 2025

| Métrica | Valor | Fuente |
|---------|:-----:|--------|
| Costo global promedio (todas industrias) | $4.44M | IBM 2025 |
| Costo industria salud (global) | **$7.42M** | IBM 2025 (14° año consecutivo #1) |
| Costo industria salud (US) | $10.93M | IBM 2025 |
| Costo per cápita (salud, global) | $173 | IBM 2025 |
| Costo per cápita (salud, US) | $201 | IBM 2024 |
| Crecimiento anual costo breaches US | +9.2% | IBM 2025 |
| Tiempo promedio identificación | 194 días | IBM 2025 |
| Tiempo promedio contención | 67 días | IBM 2025 |

### 3.2 Cálculo Aplicado a ARS Universal

| Factor | Valor | Base |
|--------|:-----:|------|
| PII confirmada expuesta | **18,948 registros** | Extracción directa |
| Tipo de datos | Salud + financieros + identidad | Ley 172-13 categoría alta |
| Costo per cápita (mercado LATAM ajustado, -40%) | $104 | Ajuste regional IBM |
| **Costo directo (per cápita × registros)** | **$1.97M** | Mínimo |
| Multas regulatorias (Ley 172-13 RD, hasta 2% ingresos) | $500K — $2M | Estimado sobre ingresos ARS |
| Costos de remediación | $200K — $500K | Forense, legal, notificaciones |
| Daño reputacional y fuga clientes | $500K — $2M | Churn estimado 5-15% |
| **Costo total estimado del breach** | **$1.5M — $5M+** | |

### 3.3 Costos Adicionales

| Concepto | Costo | Descripción |
|----------|:-----:|-------------|
| Notificación a afectados (18,948 personas) | $95K — $190K | Cartas, call center, monitoreo |
| Honorarios legales y defensa | $150K — $400K | Litigios potenciales |
| Mejoras de seguridad post-breach | $200K — $500K | Implementación correctiva forzada |
| Primas de seguro cibernético | +50-100% | Aumento post-breach |
| Pérdida de contratos B2B | $200K+ | Clientes corporativos |

---

## 4. Comparativa Assessment vs Breach

### 4.1 Costo Directo

```
                     Assessment NSI          Breach ARS Universal
                     ─────────────          ───────────────────
Costo estimado        $75K — $163K           $1.5M — $5M+
                     
Ratio: Assessment es 20x — 40x más barato
```

### 4.2 Retorno de Inversión (ROI)

| Escenario | Inversión | Costo Evitado | ROI |
|-----------|:---------:|:-------------:|:---:|
| Optimista | $75,000 | $1,500,000 | **20x** |
| Realista | $100,000 | $3,000,000 | **30x** |
| Pesimista | $163,000 | $5,000,000 | **31x** |

### 4.3 Tiempo

| Actividad | Assessment | Breach |
|-----------|:----------:|:------:|
| Detección | N/A (proactivo) | 194 días promedio |
| Contención | N/A | 67 días promedio |
| Resolución | 3 días | 6-18 meses |
| Costo en horas | 78h equipo | 2,000h+ equipo interno + externos |

---

## 5. Casos Reales de Referencia

| Caso | Año | Costo | Registros | Sector |
|------|:---:|:-----:|:---------:|:------:|
| **Humana** | 2024 | +$1B | 1.1M | Salud US |
| **Change Healthcare** | 2024 | +$870M | 100M+ | Salud US |
| **Kaiser Permanente** | 2024 | $74M | 13.4M | Salud US |
| **McLaren Health** | 2024 | $20M+ | 2.5M | Salud US |
| **HealthEquity** | 2024 | $48M | 4.3M | Salud US |

*Fuente: HIPAA Journal, HHS Wall of Shame*

---

## 6. Marco Regulatorio Aplicable (RD)

### Ley 172-13 de Protección de Datos Personales

| Aspecto | Detalle |
|---------|---------|
| **Cobertura** | Datos sensibles incluye salud, datos financieros, identidad |
| **Obligación** | Notificación a titulares y autoridad en 72h |
| **Sanciones** | Multas hasta 2% de ingresos anuales brutos |
| **Daños** | Responsabilidad civil por daños y perjuicios |
| **Agravantes** | Falta de medidas de seguridad → sanciones mayores |

### Estándares Internacionales Aplicables

| Estándar | Relevancia |
|----------|------------|
| **ISO 27001** | Controles de seguridad de información (A.12.6.1 — pruebas de seguridad) |
| **PCI DSS** | Si procesan pagos de afiliados |
| **OWASP API Top 10** | Aplicable directamente a los 100+ endpoints sin auth |
| **NIST SP 800-115** | Guía de pruebas de seguridad |
| **LGPD (Brasil)** | Referencia regional para LATAM |

---

## 7. Costo de la No-Acción

| Periodo | Riesgo | Impacto Estimado |
|---------|--------|:----------------:|
| **Corto plazo (0-6 meses)** | Explotación activa por terceros | $1.5M — $3M |
| **Medio plazo (6-18 meses)** | Multas regulatorias + litigios | $500K — $2M |
| **Largo plazo (18-36 meses)** | Pérdida de participación de mercado | $2M — $5M+ |
| **Total riesgo remanente** | **De no remediar** | **$4M — $10M** |

---

## 8. Conclusión

**$75K — $163K invertidos hoy en un assessment de seguridad representan un retorno de 20x-40x vs los $1.5M — $5M+ que costaría un breach equivalente.**

El assessment no solo identificó las 10 vulnerabilidades críticas y 18,948 registros PII expuestos, sino que proporcionó una hoja de ruta de remediación priorizada (P0-P2) que permite a ARS Universal corregir los hallazgos antes de que sean explotados.

**El costo de la no-acción es 20-40 veces mayor que el costo del assessment.**

---

*NSI-LTR-2026-007-ARS | Null Session Intelligence LLC*
*Contact: operations@nullsessionintelligence.com*
