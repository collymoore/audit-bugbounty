# Reporte de Metadata — PDFs 2026 BACC
**Fecha:** 30 Junio 2026
**Target:** bancobacc.com.do
**Fuente:** Directory listing en /content/uploads/ (vulnerabilidad activa)

---

## Resumen

5 archivos PDF extraídos del directorio /content/uploads/2026/ (marzo-abril 2026).
4 de 5 sin cifrado. 1 (Estados-Auditados) cifrado con RC4 owner-level — decryptado exitosamente sin password.

---

## 1. BANCO-BACC.pdf — LOGO DEL BANCO

| Campo | Valor |
|-------|-------|
| Archivo | BANCO-BACC.pdf |
| Tamaño | 9.5 MB |
| Título | BANCO BACC - SELLO |
| Creador | Adobe Illustrator CS4 |
| Fecha creación | 27 Mar 2026 09:46 EDT |
| Páginas | 4 |
| Cifrado | No |

### 🔴 Hallazgo crítico: Windows Path Leak
```
C:\Users\168855\Downloads\27_03_2026 HOY_VIERNES_270326_ El Pa...
```
- Usuario interno: **168855** (posible ID de empleado)
- Fecha: 27 marzo 2026 (viernes)
- El archivo fue creado desde un equipo Windows, subido al servidor

---

## 2. Estados-Auditados-BACC-2025.pdf — ESTADOS FINANCIEROS AUDITADOS

| Campo | Valor |
|-------|-------|
| Archivo | Estados-Auditados-BACC-2025.pdf |
| Tamaño | 698 KB |
| Creador | PDF-XChange Editor 5.5.311 |
| Fecha creación | 23 Mar 2026 16:23 EDT |
| Fecha modificación | 23 Mar 2026 16:51 EDT |
| Páginas | 74 |
| Cifrado | ~~RC4 (copy:no)~~ → ✅ **Decryptado** vía qpdf |

### Detalles del cifrado
- Método: RC4
- Restricciones: print allowed, copy denied, change denied
- Sin password de apertura (owner-level only)
- Decryptado con: `qpdf --decrypt`

### Contenido
- Dictamen de auditores independientes
- Estado de situación financiera (balance general)
- Estado de resultados
- Estado de flujos de efectivo
- Estado de cambios en patrimonio neto
- 26 notas a los estados financieros

### Fechas clave en el texto
- 14 de marzo de 2025 — dictamen año 2024 (auditores anteriores)
- 23 de marzo de 2026 — fecha del dictamen actual
- 31 de diciembre de 2025 — cierre del ejercicio fiscal

### Montos identificados
- RD$ 134,039,175 — provisiones cartera de créditos
- RD$ 19,471,204
- RD$ 126,146,058
- RD$ 56,903,932
- RD$ 63,598,881

### Nota
La firma de auditoría está en una imagen/sello (no extraíble por pdftotext).

---

## 3. MEMORIA-ANUAL-BACC-2025.pdf — MEMORIA ANUAL

| Campo | Valor |
|-------|-------|
| Archivo | MEMORIA-ANUAL-BACC-2025.pdf |
| Tamaño | 29 MB |
| Creador | macOS Version 15.7.3 (Build 24G419) Quartz PDFContext |
| Fecha creación | 15 Abr 2026 17:24 EDT |
| Páginas | 133, Letter |
| Cifrado | No |

### Contenido
- Informe del Presidente Ejecutivo (Alberto De Los Santos)
- Gobierno Corporativo (Consejo de Directores, Comités)
- Principales Ejecutivos
- Portafolio de Productos
- Entorno Económico
- Cartera de Clientes
- Indicadores de Desempeño Financiero
- Informe de Gestión del Talento
- Responsabilidad Social
- Calificación de Riesgos Feller Rate (Rating A, Estables)
- Estados Financieros Auditados 2025
- Informe del Comisario de Cuentas (Nicolás de Dios Almonte)

### Datos financieros clave extraídos
- Activos totales: RD$ 5,219,613,132
- Cartera de créditos: RD$ 4,367,246,145
- Patrimonio: RD$ 2,301,126,049 (↑10.8%)
- Utilidades netas: RD$ 216.5 millones
- Índice de solvencia: 25.71%
- Provisiones cartera: RD$ 134,039,175

---

## 4. Proceso-de-disvinculacion-de-App.pdf — PROCEDIMIENTO INTERNO

| Campo | Valor |
|-------|-------|
| Archivo | Proceso-de-disvinculacion-de-App.pdf |
| Tamaño | 493 KB |
| Autor | **Dewars Barett Baez** |
| Creador | Microsoft® Word for Microsoft 365 |
| Fecha creación | 14 Abr 2026 16:31 EDT |
| Páginas | 5 |
| Cifrado | No |

### Contenido
- Procedimiento interno para eliminación de cuentas digitales
- Aplica a app móvil y banca en línea
- Versión 1.0, abril 2026
- Marco normativo: Google Play, App Store, regulación financiera
- Proceso: solicitud del cliente → verificación → eliminación → tratamiento de datos
- Confirmación del autor como WP User ID 5 (coincide con metadata previa)

---

## 5. bahorrocreditocaribe2601is.pdf — INFORME FELLER RATE

| Campo | Valor |
|-------|-------|
| Archivo | bahorrocreditocaribe2601is.pdf |
| Tamaño | 319 KB |
| Autor | **Maria Luisa Diaz** |
| Creador | Microsoft® Word para Microsoft 365 |
| Fecha creación | 2 Feb 2026 12:28 EST |
| Páginas | 3 |
| Cifrado | No |

### Contenido: Informe de Calificación Semestral
- **Calificadora:** Feller Rate Sociedad Calificadora de Riesgo, SRL
- **Analista principal:** Alejandra Islas — Director Senior
- **Rating:** A / Estables
- Evolución: A- (2020-2023) → A (2023-2026)

### Datos financieros históricos

| Indicador | Dic 2023 | Dic 2024 | Dic 2025 |
|-----------|----------|----------|----------|
| Activos totales | RD$4,638M | RD$5,098M | RD$5,220M |
| Cartera créditos bruta | RD$3,986M | RD$4,386M | RD$4,434M |
| Cartera vencida | RD$49M (1.2%) | RD$88M (2.0%) | RD$71M (1.6%) |
| Provisiones | RD$163M | RD$159M | RD$134M |
| Patrimonio | RD$1,859M | RD$2,085M | RD$2,301M |
| Utilidad neta | RD$191M | RD$228M | RD$216M |
| ROE | 10.8% | 11.6% | 9.9% |
| Solvencia | 24.0% | 24.2% | 26.6% |

### 🔑 Controladores del Banco (revelado)
- **María Teresa Hernández**
- **Teresa Lebrón Hernández**
- **Alberto De Los Santos**

### Perfil de negocio
- Enfoque: financiamiento de vehículos usados (18.6% cuota de mercado en ese segmento)
- Presencia: 6 sucursales en RD
- Participación mercado total: ~6.9%
- Riesgo principal: concentración en créditos automotrices

---

## Resumen de Vulnerabilidades Relacionadas

| ID | Hallazgo | Archivo | Severidad |
|----|----------|---------|-----------|
| BACC-MD-01 | Windows path leak (usuario 168855) | BANCO-BACC.pdf | 🔴 Alto |
| BACC-MD-02 | Documento interno de procesos expuesto | Proceso-disvinculacion-App.pdf | 🟡 Medio |
| BACC-MD-03 | Controladores del banco identificados | bahorrocreditocaribe2601is.pdf | 🟡 Medio |
| BACC-MD-04 | Metadata de empleados (Dewars, Maria Luisa) | Múltiples | 🟡 Medio |
| BACC-MD-05 | PDF cifrado débil (RC4, sin password) | Estados-Auditados-2025.pdf | 🟡 Medio |

---

## Archivos Generados

| Archivo | Descripción |
|---------|-------------|
| `/tmp/bacc_new_pdfs/` | 5 PDFs originales descargados |
| `/tmp/bacc_estados_text.txt` | Texto extraído de Estados Auditados (7,795 líneas) |
| `/tmp/bacc_memoria_2025.txt` | Texto extraído de Memoria Anual (9,843 líneas) |
| `/tmp/bacc_estados_decrypted.pdf` | Versión decryptada de Estados Auditados |
