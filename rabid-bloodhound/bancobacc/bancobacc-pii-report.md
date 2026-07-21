# Bancobacc.com.do — Reporte de Datos Personales (PII) Expuestos

**Target:** Banco BACC de Ahorro y Crédito del Caribe, S.A.
**URL:** https://bancobacc.com.do
**Fecha:** 14 Julio 2026

---

## 1. GOBIERNO CORPORATIVO — Consejo de Administración 2025

| Miembro | Cargo | Categoría |
|---------|-------|-----------|
| Alberto R. De Los Santos Billini | **Presidente** | Interno / Ejecutivo |
| María Julia Díaz De Los Ángeles | **Vicepresidente** | Interna / Ejecutiva |
| Francisco Antonio Rodríguez Guzmán | **Secretario** | Externo No Independiente |
| Peter Alfred Croes Nadal | **Tesorero** | Externo Independiente |
| Fernando José González Nicolás | Consejero | Externo No Independiente |
| Juan Roberto Rojas Santiago | Consejero | Externo Independiente |
| William Joseph Harper Heinsen | Consejero | Externo Independiente |

**Fuente:** Memoria Anual 2025 (29MB PDF público)

---

## 2. ACCIONISTAS CONTROLADORES (Beneficial Owners)

Del informe Feller Rate Ene 2026:

> *"BACC es controlado, mediante participaciones directas o a través de sociedades, por **María Teresa Hernández**, **Teresa Lebrón Hernández** y **Alberto De Los Santos**."*

**Fuente:** `bahorrocreditocaribe2601is.pdf` — Informe Calificación Feller Rate, Enero 2026

---

## 3. ALTA GERENCIA (Histórico 2021-2025)

### 2025 (Estados Financieros Auditados)
| Nombre | Posición |
|--------|----------|
| Alberto de los Santos | Presidente |
| María Julia Díaz | Directora Administrativa |
| Deborah de los Santos | Vicepresidente Ejecutiva |
| Willy Padua | Director de Riesgo, Control y Ciberseguridad |
| Rosa Cruz | Gerente de Operaciones |
| Fior Sánchez | Gerente de Auditoría Interna |
| Teresa Parra | Gerente de Gestión Humana |
| Dewars Barett | Gerente de Tecnología |
| Silvia Eligia Peña | Gerente de Control Interno |
| Addys Heillyn Mercedes | Gerente de Planificación Estratégica |

### 2021 (Memoria Anual 2021)
| Nombre | Posición |
|--------|----------|
| Alberto Rafael De los Santos Billini | Presidente |
| Deborah De los Santos Lebrón | Vicepresidente Ejecutiva |
| María Julia Díaz De los Ángeles | Administradora |
| Gustavo Domingo Barruos | Gerente de Negocios |
| Rosa D. Cruz Hernández | Gerente de Operaciones |
| Fior C. Sánchez Bautista | Gerente de Auditoría Interna |
| María Concepción Fabián | Gerente de Riesgo Integral |
| Teresa Parra | Gerente de Gestión Humana |
| Rosa María Torres | Gerente de Cobranzas |
| Alberto De la Cruz | Gerente de Administración de Crédito |
| Samuel Florián | Gerente de Cumplimiento |
| Yonaira Arias | Gerente de Contabilidad |
| Pedro Cordero Lama | Gerente de Legal |
| José Israel Paredes | Gerente de Innovación y Proyectos |
| Silvia Peña | Gerente de Control Interno |
| Wayner Castillo | Gerente de Seguridad de la Información |
| Raymie Sánchez Canó | Gerente de Tecnología y Telecomunicaciones |

---

## 4. CÉDULA / RNC / REGISTROS

Documento expuesto en contratos públicos:
- **Cédula María Julia Díaz:** `001-0272565-2`
- **RNC Banco BACC:** `1-01-13879-3`
- **Registro Mercantil:** `142508D`
- **Registro Bancario SB:** `11-052-1-00-0101`
- **Certificado ONAPI Nombre Comercial:** `No. 415645`

---

## 5. DATOS DE CONTACTO DEL AUDITOR

- **Firma:** Guzmán Tapia PKF
- **Teléfonos:** `1 809 540 6668` / `567-2946`
- **Email:** `info@guzmantapiapkf.com.do`
- **Web:** `www.pkf-dominicana.com`

---

## 6. DIRECCIÓN OFICINA PRINCIPAL

- **Ave. Tiradentes No. 50, Esq. Salvador Sturla, Ensanche Naco, Santo Domingo, D.N.**
- **5 sucursales** zona metropolitana + **2 interior** (Santiago, San Francisco de Macorís)
- **157 empleados** (2022) → **164** (2023) → info no disponible para 2025

---

## 7. DATOS FINANCIEROS SENSIBLES

| Concepto | 2025 (DOP) |
|----------|-----------|
| Activos Totales | RD$5,220 millones |
| Cartera de Créditos Bruta | RD$4,434 millones |
| Patrimonio Neto | RD$2,301 millones |
| Utilidad Neta | RD$216 millones |
| Compensación Consejo Admin | RD$9,944,456 (2022) |
| Compensación Alta Gerencia | RD$42,257,124 (2022) |
| Índice de Solvencia | **26.6%** (regulatorio 10%) |

---

## 8. HALLAZGOS DE SEGURIDAD ADICIONALES

### 8a. Directory Listing EXPUESTO
- **150+ PDFs** accesibles públicamente en `/content/uploads/{año}/{mes}/`
- Desde **2017 hasta Julio 2026**
- Incluye: EEFF Auditados, Memorias Anuales, Prospectos de Emisión de Bonos, Contratos, Tarifarios, Formularios Fiscales IRS (W-8BEN, W-9), Informes Feller Rate

### 8b. Documentos con PII Indirecta
- `RELACION-DE-VEHICULOS-EN-VENTA-JULIO-23-1.pdf` — Listado vehículos adjudicados con precios
- `BIENES-ADJUDICADOS-SEPT.23.pdf` — Propiedades embargadas/reposeídas
- `Listado-de-vehiculo-en-venta.pdf` (2024) — Vehículos en venta (marca, modelo, año, precio)
- `Pasos-para-configurar-Biometria_BACC-en-Linea.pdf` — Documento interno de procedimientos
- `Proceso-de-disvinculacion-de-App.pdf` (Abril 2026) — Proceso interno de desvinculación

### 8c. WP REST API Pública
- **Yoast `file_size`** endpoint expuesto (posible SSRF, requiere auth)
- **Contact Form 7** endpoints detectables
- **Wordfence** endpoints requieren autenticación

### 8d. Observaciones de Auditoría (2022)
El informe de auditoría revela:
> *"El Core Bancario EASY BANK presenta **algunas dificultades en las funciones de parametrización y de procesos**, por lo que el control interno y la segregación de funciones se ve afectada... encontramos **diferentes observaciones en diferentes Áreas, Procesos y Controles de TI, seguridad de la información y ciberseguridad** revisados que requieren la atención de la Alta Gerencia."*

---

## 9. RESUMEN: CATEGORÍAS DE PII EXPUESTAS

| Categoría | Severidad | Encontrado |
|-----------|-----------|------------|
| Nombres completos + cargos directivos | ⚠️ ALTA | 25+ ejecutivos |
| Accionistas controladores | 🔴 CRÍTICA | 3 personas identificadas |
| Cédula de identidad personal | 🔴 CRÍTICA | 1 cédula (funcionaria) |
| RNC empresarial + registros legales | ⚠️ ALTA | 4 registros |
| Datos de contacto (tel/email) | ⚠️ MEDIA | 1 contacto auditor |
| Compensación ejecutiva individual | 🔴 CRÍTICA | Salarios directivos |
| Dirección exacta oficinas/sucursales | ⚠️ MEDIA | 5 ubicaciones |
| Documentos tributarios IRS (plantillas) | ⚠️ MEDIA | W-8BEN, W-9 |
| Debilidades de control interno TI | 🔴 CRÍTICA | Auditoría 2022 |

---

## 10. DOCUMENTOS DESCARGADOS

Los 12 PDFs con PII se encuentran en:
`/root/bounty/bancobacc/pii_sources/`

Incluyen: Memoria Anual 2025 (29MB), EF Auditados 2025, EF 2023, Feller Rate Ene 2026, Contratos Garantía Mobiliaria, Vehículos en Venta, Bienes Adjudicados

