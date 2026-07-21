# Borrador de Correo Inicial — Notificación de Vulnerabilidad

## Versión 1: Contacto Directo (CTO/IT — prioritaria)

**Para:** info@clinicacorominas.com.do
**CC:** contacto@cmr3.com.mx
**Asunto:** [URGENTE] Notificación de Seguridad — Vulnerabilidad Crítica en Sistema HIS

---

Señores Clínica Corominas / CMR Medical Systems,

Por medio de la presente, **Null Session Intelligence LLC (NSI)** — firma especializada en seguridad ofensiva y bug bounty — les notifica el hallazgo de **múltiples vulnerabilidades críticas** en su infraestructura digital, específicamente en el sistema HIS (Hospital Information System) que opera bajo la plataforma eMeSalud/CMR Medical Systems.

### Resumen del Hallazgo

Se identificó que el servicio WCF REST API en `portal.clinicacorominas.com.do` expone **57+ operaciones** sin requerir autenticación, permitiendo el acceso no autorizado a:

- 🔴 **Datos de personal:** 504 empleados (nombres, roles, IDs)
- 🔴 **Estudios de imagenología:** 80+ estudios DICOM con identificadores únicos
- 🔴 **Documentos de pacientes:** Miles de registros con datos médicos
- 🔴 **Contraseña de dispositivos médicos:** `cmrservice05`
- 🔴 **Escritura de datos:** Endpoints de actualización de pacientes y creación de citas

### Alcance del Impacto

La vulnerabilidad **no se limita a Clínica Corominas**. Se confirmó que **CEDISA** (`portalresultados.cedisa.do`) utiliza la **misma plataforma** con las **mismas credenciales** (`cmrservice05`) y expone **+18,000 empleados** adicionales, indicando que se trata de una vulnerabilidad de plataforma, no de un caso aislado.

### Acción Requerida

Solicitamos una comunicación para coordinar la divulgación responsable de estos hallazgos. NSI mantendrá la confidencialidad de los detalles técnicos hasta que se implementen las correcciones necesarias o se acuerde un timeline de divulgación.

Nuestra recomendación inmediata incluye:
1. Restringir el acceso público al API WCF
2. Rotar la contraseña `cmrservice05` en todos los sistemas
3. Deshabilitar el modo debug en la aplicación móvil
4. Notificar a CEDISA sobre la exposición de sus datos

Quedamos atentos a su respuesta para coordinar los próximos pasos.

Atentamente,

**Null Session Intelligence LLC**
Equipo de Seguridad Ofensiva
New Jersey, Estados Unidos
nullsessionintelligence.com

---

## Versión 2: Corto (si prefiere ir directo)

**Asunto:** [NSI-SEC-2026-003] Hallazgo Crítico de Seguridad — Plataforma HIS

---

Hemos identificado una vulnerabilidad crítica en su sistema HIS que expone datos sensibles de pacientes, empleados y configuración del sistema sin autenticación. La misma vulnerabilidad afecta también a CEDISA.

Disponemos de un reporte técnico detallado con 57 endpoints identificados, evidencia de extracción de datos y recomendaciones de remediación.

Solicitamos punto de contacto técnico para coordinar la divulgación responsable.

Atentamente,
**NSI LLC**
nullsessionintelligence.com
