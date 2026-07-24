# NSI Cost Base Table — Breach Cost Calculator
**Versión:** 1.0  
**Clasificación:** NSI Confidencial  
**Propósito:** Tabla base de costos para valuar hallazgos de seguridad vs. costo de breach equivalente  
**Metodología:** Basada en IBM Cost of Data Breach Report 2025, casos reales documentados, y estándares de la industria  

---

## 1. Índice de Costos por Industria (IBM 2025)

| Industria | Costo Promedio | Per Cápita | Ranking | Tendencia |
|-----------|:--------------:|:----------:|:-------:|:---------:|
| **Salud** | **$7.42M** | **$173** | **#1** (14 años) | ↑ +5.2% |
| Servicios Financieros | $5.56M | $162 | #2 | ↑ +3.8% |
| Industrial | $5.00M | $143 | #3 | ↑ +2.1% |
| Energía | $4.83M | $138 | #4 | ↑ +1.5% |
| Tecnología | $4.79M | $135 | #5 | ↑ +4.0% |
| Farmacéutico | $4.71M | $132 | #6 | ↑ +3.2% |
| Retail | $3.28M | $95 | #7 | ↓ -1.2% |
| Educación | $3.18M | $92 | #8 | ↑ +6.5% |
| Gobierno | $2.47M | $71 | #9 | ↑ +0.8% |
| Media | $2.42M | $69 | #10 | ↑ +0.3% |
| **Global promedio** | **$4.44M** | **$125** | — | ↑ +2.6% |

*Fuente: IBM Cost of Data Breach Report 2025 (14° edición)*

---

## 2. Ajustes Regionales

| Región | Multiplicador | Costo Promedio | Notas |
|--------|:-------------:|:--------------:|-------|
| Estados Unidos | 1.0x (base) | $10.22M | +9.2% interanual, récord histórico |
| Europa | 0.65x | $6.64M | GDPR eleva costos regulatorios |
| Latinoamérica | 0.35-0.40x | $3.58M-$4.09M | Sin regulación madura, menor litigiosidad |
| RD (Ley 172-13) | 0.40-0.50x | $4.09M-$5.11M | Ley nueva, sin jurisprudencia consolidada |
| Asia-Pacífico | 0.50x | $5.11M | Crecimiento rápido en ataques |
| Medio Oriente | 0.55x | $5.62M | Infraestructura crítica |

---

## 3. Calculadora de Costo de Breach

### 3.1 Fórmula Base

```
Costo Total = (Registros × PerCápitaIndustria × AjusteRegional × FactorSensibilidad)
              + CostosRegulatorios
              + CostosRemediación
              + DañoReputacional
```

### 3.2 Tabla de Factores

| Factor | Símbolo | Rango | Descripción |
|--------|:-------:|:-----:|-------------|
| Registros expuestos | R | — | Número de registros PII confirmados |
| Per cápita industria | PCI | $69-$173 | Según industria (ver sección 1) |
| Ajuste regional | AR | 0.35-1.0 | Según región (ver sección 2) |
| Factor sensibilidad | FS | 1.0-3.0 | Tipo de dato expuesto (ver 3.3) |
| Costos regulatorios | CR | $100K-$2M | Multas, notificaciones, legales |
| Costos remediación | CM | $200K-$1M | Forense, parches, monitoreo |
| Daño reputacional | DR | $200K-$2M | Churn, marca, contratos |

### 3.3 Factor de Sensibilidad por Tipo de Dato

| Tipo de Dato | FS | Ejemplos |
|-------------|:--:|----------|
| Datos públicos/de catálogo | 1.0 | Prestadores, direcciones, catálogos |
| Datos de contacto | 1.5 | Nombres, teléfonos, correos |
| Datos de identificación | 2.0 | Cédulas, RNCs, pasaportes, NSS |
| Datos financieros | 2.5 | Cuentas bancarias, ingresos, historial crediticio |
| Datos médicos/salud | **3.0** | Diagnósticos, recetas, reembolsos, condiciones |
| Credenciales de acceso | 2.5 | Tokens OAuth, API keys, contraseñas |
| Datos biométricos | 3.0 | Huellas, fotos de cédula, reconocimiento facial |

---

## 4. Casos Reales Documentados

### 4.1 Sector Salud (Referencia Directa)

| Año | Empresa | Costo Total | Registros | Per Cápita | Tipo Dato | Factor Clave |
|:---:|---------|:-----------:|:---------:|:----------:|-----------|:------------:|
| 2024 | **Change Healthcare** | $870M+ | 100M+ | $8.70 | Médico + financiero | Ransomware, operaciones detenidas |
| 2024 | **Humana** | $1B+ | 1.1M | $909 | PHI + SSN | Litigio colectivo |
| 2024 | **Kaiser Permanente** | $74M | 13.4M | $5.52 | PHI | Third-party tracking |
| 2024 | **HealthEquity** | $48M | 4.3M | $11.16 | HSA/Financiero | API misconfiguration |
| 2024 | **McLaren Health** | $20M+ | 2.5M | $8.00 | PHI | Ransomware |
| 2023 | **HCA Healthcare** | $15M+ | 11M | $1.36 | PHI | Exfiltración third-party |
| 2023 | **Welltok** | $10M+ | 8.5M | $1.18 | PHI | MOVEit vulnerability |
| 2023 | **Managed Care of NA** | $12M+ | 4.3M | $2.79 | PHI + SSN | Hacking |
| 2024 | **MediSecure** | $10M+ | 12.9M | $0.78 | PHI + Rx | Ransomware |
| 2024 | **Pole Star Management** | $8M+ | 1.5M | $5.33 | PHI | Hacking |

*Fuentes: HHS Wall of Shame, HIPAA Journal, IBM Report*

### 4.2 Sector Financiero

| Año | Empresa | Costo | Registros | Tipo |
|:---:|---------|:-----:|:---------:|------|
| 2024 | **National Public Data** | $100M+ | 2.9B | SSN, nombres, direcciones |
| 2023 | **MGM Resorts** | $100M | 30M+ | PHI+PII |
| 2023 | **Clorox** | $49M | N/A | Operacional |
| 2024 | **Ticketmaster** | $20M+ | 560M | Pago+PII |
| 2024 | **Santander** | $15M+ | 30M+ | PII+cuentas |
| 2024 | **FBCS** | $12M+ | 4.2M | PII+financiero |

### 4.3 Casos LATAM / RD (Referencia Regional)

| Año | Empresa | Costo Estimado | Registros | País |
|:---:|---------|:--------------:|:---------:|:----:|
| 2024 | **Brasil — Susep** | $5M+ | 1.8M | Seguros |
| 2023 | **México — Banco Azteca** | $3M+ | 500K+ | Financiero |
| 2024 | **Colombia — Keralty** | $2M+ | 300K+ | Salud |
| 2024 | **Chile — FONASA** | $1.5M+ | 200K+ | Salud estatal |
| 2025 | **RD — Breach esperado** | $1M-$5M | 18.9K | Salud (ARS) |

---

## 5. Costos de Assessment vs Breach — Tabla Comparativa

### 5.1 Por Tipo de Servicio

| Servicio | Assessment | Breach Equivalente | Ratio |
|----------|:----------:|:------------------:|:-----:|
| Web App & API Pentest | $15K-$35K | $1M-$5M | **30x-300x** |
| Cloud Infrastructure Review | $10K-$25K | $2M-$10M | **80x-400x** |
| OIDC/IAM Audit | $8K-$18K | $500K-$3M | **30x-170x** |
| Data Leak Assessment | $10K-$20K | $1M-$5M | **50x-500x** |
| Code Review | $7K-$15K | $500K-$2M | **30x-130x** |
| Red Team (full scope) | $50K-$150K | $3M-$15M | **20x-300x** |
| **Engagement completo** | **$75K-$163K** | **$1.5M-$5M** | **20x-40x** |

### 5.2 Por Número de Registros

| Registros Expuestos | Costo Mínimo | Costo Máximo | Assessment Recomendado |
|:-------------------:|:------------:|:------------:|:----------------------:|
| < 1,000 | $100K | $500K | $15K-$25K |
| 1,000 — 10,000 | $500K | $2M | $25K-$50K |
| 10,000 — 50,000 | $2M | $5M | $50K-$100K |
| 50,000 — 500,000 | $5M | $20M | $100K-$200K |
| 500,000 — 5M | $20M | $100M | $200K-$500K |
| > 5M | $100M+ | $1B+ | $500K+ |

---

## 6. Plantilla de Cálculo Rápido

### Para usar en cada caso:

```
INDUSTRIA:           [Salud / Financiero / Tecnología / ...]
REGIÓN:              [US / Europa / LATAM / RD]
REGISTROS PII:       [número]
TIPO DE DATO:        [Contacto / ID / Financiero / Médico]
FACTOR SENSIBILIDAD: [1.0 / 1.5 / 2.0 / 2.5 / 3.0]

CÁLCULO:
  PerCápitaBase:     $173 (salud) | $162 (financiero) | $135 (tech)
  × AjusteRegional:  0.40 (LATAM/RD)
  × FactorSensibilidad: [FS]
  = PerCápitaAjustado: $[calc]

  CostoDirecto:       Registros × PerCápitaAjustado = $[calc]
  + Regulatorio:      $[100K-500K] según jurisdicción
  + Remediación:      $[200K-500K] según complejidad
  + Reputacional:     $[200K-1M] según visibilidad
  = COSTO TOTAL:      $[calc]

VALOR DEL ASSESSMENT: $[calc] × (2.5% - 5%) = $[calc]
    (El assessment vale 2.5-5% del costo del breach que previene)
```

### Ejemplo: ARS Universal

```
INDUSTRIA:           Salud
REGIÓN:              RD (Ley 172-13, multas hasta 2% ingresos)
REGISTROS PII:       18,948
TIPO DE DATO:        Cédulas, RNCs, Pasaportes, NSS, datos contacto
FACTOR SENSIBILIDAD: 2.0 (identificación)

CÁLCULO:
  PerCápitaBase:     $173
  × AjusteRegional:  0.40
  × FS:              2.0
  = PerCápitaAjustado: $138.40

  CostoDirecto:      18,948 × $138.40 = $2.62M
  + Regulatorio:     $500K (Ley 172-13, hasta 2% ingresos estimados)
  + Remediación:     $350K (forense, notificaciones, parches)
  + Reputacional:    $500K (ARS, marca reconocida)
  = COSTO TOTAL:     $3.97M

VALOR DEL ASSESSMENT: $3.97M × 3% = $119K
    (Rango: $75K-$163K)
```

---

## 7. Referencias y Fuentes

| Fuente | URL |
|--------|-----|
| IBM Cost of Data Breach Report 2025 | ibm.com/think/insights/cost-of-a-data-breach-healthcare-industry |
| IBM Global Average $4.44M | databreachcost.com/by-industry |
| HIPAA Journal — Healthcare Breach Costs | hipaajournal.com/average-cost-of-a-healthcare-data-breach-2025/ |
| HHS Breach Portal (Wall of Shame) | hhs.gov/hipaa/for-professionals/breach-notification/ |
| Pentest Pricing 2026 — BlazeInfoSec | blazeinfosec.com/post/how-much-does-penetration-testing-cost/ |
| Pentest Pricing 2026 — Invicti | invicti.com/blog/web-security/penetration-testing-pricing-guide |
| Ley 172-13 RD Protección de Datos | congreso.gov.do |
| Verizon DBIR 2025 | verizon.com/business/resources/reports/dbir/ |

---

## 8. Historial de Revisiones

| Versión | Fecha | Cambios |
|:-------:|:-----:|---------|
| 1.0 | 2026-07-24 | Versión inicial. IBM 2025 benchmarks, casos reales, calculadora, plantilla |

---

*NSI Cost Base Table v1.0 | Null Session Intelligence LLC*
*Contact: operations@nullsessionintelligence.com*
