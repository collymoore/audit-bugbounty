# CMR Medical Systems / IDigitales — Security Assessment

## 📁 Estructura del Proyecto

```
CMR-Security-Assessment/
├── reports/                          # Reportes principales
│   ├── CMR-IDigitales-NSI-REPORT.html      (60 KB) — Security Assessment (8 páginas)
│   ├── CMR-Phase3-Implementation-Plan.html (52 KB) — Implementation Plan (8 páginas)
│   ├── CMR-IDigitales-MASTER-REPORT.md     (20 KB) — Master report markdown
│   └── cmr-ecosystem-report.md              (4 KB) — Ecosystem overview
│
├── appendix/                         # Reportes individuales por app (12 apps)
│   ├── corominas-report.md
│   ├── abreu-report.md
│   ├── cardio_imagenes-report.md
│   ├── cedisa-report.md
│   ├── cmm-report.md
│   ├── cadi-report.md
│   ├── policlinica-report.md
│   ├── higea-report.md
│   ├── hmc-report.md
│   ├── infosalud-report.md
│   ├── emesalud-report.md
│   └── tequis-report.md
│
├── architecture/                     # Arquitectura Zero Trust
│   └── zero-trust-wcf-architecture.md   (48 KB) — Diseño completo Zero Trust
│
├── compliance/                       # Cumplimiento regulatorio
│   └── plan-controles-cumplimiento-regulatorio.md (44 KB) — HIPAA/GDPR/Ley172-13
│
├── monitoring/                       # Monitoreo y detección
│   └── arquitectura-monitoreo-seguridad-WCF.md (44 KB) — SIEM + Forensia + Playbooks
│
├── graphics/                         # Diagramas y gráficos
│   ├── cmr-link-analysis-nsi.png          (312 KB) — Link Analysis Graph
│   ├── cmr-link-analysis-nsi.svg          (36 KB)  — Vector editable
│   ├── cmr-link-analysis-nsi.dot          (12 KB)  — Código Graphviz
│   ├── zero-trust-architecture.png        (224 KB) — Diagrama Zero Trust
│   ├── zero-trust-architecture.svg        (24 KB)  — Vector editable
│   └── zero-trust-architecture.dot        (8 KB)   — Código Graphviz
│
└── data/                             # Datos extraídos
    └── pii/
        ├── abreu_empleados.csv          (200 KB) — 5,011 registros
        ├── corominas_empleados.csv      (36 KB)  — 506 registros
        ├── cmm_empleados.csv            (16 KB)  — 259 registros
        ├── emesalud_empleados.csv       (8 KB)   — 131 registros
        ├── policlinica_empleados.csv    (8 KB)   — 98 registros
        └── cadi_empleados.csv           (8 KB)   — 73 registros
```

## 📊 Totales

| Métrica | Valor |
|:--------|:------|
| Archivos totales | **36** |
| HTML reports | 2 (60 KB + 52 KB) |
| Markdown reports | 14 (~200 KB total) |
| Gráficos/diagramas | 6 |
| Datos PII | 6 archivos, **6,078 empleados** (~280 KB) |
| Documentos técnicos | 3 (Zero Trust 48K + Compliance 44K + Monitoreo 44K) |
| **Total** | **~1.5 MB** |
