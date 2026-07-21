# Plan de Controles de Cumplimiento Regulatorio
## HIPAA · GDPR · Ley 172-13 (República Dominicana)

**ID del documento:** NSI-COMPLIANCE-2026-001  
**Cliente:** Clínica Abreu CDD / Ecosistema eMeSalud-CMR Medical  
**Fecha:** 14 de julio de 2026  
**Clasificación:** Confidencial — Solo para uso interno NSI  
**Marco regulatorio:** HIPAA (EE.UU.), GDPR (UE), Ley 172-13 (RD)

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Mapeo de Hallazgos a Controles Específicos](#2-mapeo-de-hallazgos-a-controles-específicos)
3. [HIPAA — Controles Detallados](#3-hipaa--controles-detallados)
4. [GDPR — Controles Detallados](#4-gdpr--controles-detallados)
5. [Ley 172-13 — Controles Detallados](#5-ley-172-13--controles-detallados)
6. [Implementaciones Técnicas Requeridas](#6-implementaciones-técnicas-requeridas)
7. [Documentación Necesaria](#7-documentación-necesaria)
8. [Evidencias de Cumplimiento](#8-evidencias-de-cumplimiento)
9. [Cronograma de Remediación](#9-cronograma-de-remediación)
10. [Anexos](#10-anexos)

---

## 1. Resumen Ejecutivo

### Estado de Cumplimiento Actual

| Regulación | Estado General | Brechas Críticas | Prioridad |
|---|---|---|---|
| **HIPAA Privacy Rule** | ❌ No Compliant | Exposición masiva de PHI (5,011 empleados + pacientes) | 🔴 Inmediata |
| **HIPAA Security Rule** | ❌ No Compliant | 0 controles técnicos implementados (sin autenticación, cifrado, auditoría) | 🔴 Inmediata |
| **HIPAA Breach Notification** | ⚠️ No Implementado | Sin proceso formal; potencial breach notificable (>500 registros) | 🔴 Inmediata |
| **GDPR Art. 5, 32, 33, 35** | ❌ No Compliant | Sin base legal para procesamiento; sin DPO; sin DPIA | 🔴 Inmediata |
| **Ley 172-13** | ❌ No Compliant | Sin registro de bases de datos; sin consentimiento; sin medidas de seguridad | 🔴 Inmediata |

### Hallazgos que Activan Obligaciones Regulatorias

| ID | Hallazgo | Tipo de Dato | Regulaciones Afectadas | Severidad |
|---|---|---|---|---|
| H-001 | Exposición masiva vía WCF API (5,011 empleados) | PHI + PII (cédula, nombre, rol) | HIPAA, GDPR, Ley 172-13 | 🔴 CRÍTICO |
| H-002 | Contraseña compartida hardcodeada (`cmrservice05`) | Credenciales del sistema | HIPAA §164.312(d), GDPR Art. 32 | 🔴 CRÍTICO |
| H-003 | WSDL expuesto (82 endpoints, estructuras completas) | Metadata del sistema | HIPAA §164.312(a), GDPR Art. 32 | 🟡 ALTO |
| H-004 | API Keys LLM expuestas (Anthropic, OpenAI, Firebase) | Credenciales cloud | HIPAA §164.312(d), GDPR Art. 32, Ley 172-13 Art. 40 | 🔴 CRÍTICO |
| H-005 | Instancias Ollama sin autenticación | Infraestructura de IA | HIPAA §164.312(a), GDPR Art. 32 | 🟡 ALTO |
| H-006 | Firebase API keys sin restricción de servicios | Credenciales cloud | HIPAA §164.312(a), GDPR Art. 25 | 🟡 ALTO |

---

## 2. Mapeo de Hallazgos a Controles Específicos

### 2.1 Matriz Cruzada: Hallazgo → Regulación → Control → Prioridad

| # | Hallazgo | Regulación | Control ID | Descripción del Control | Prioridad |
|---|---|---|---|---|---|
| H-001 | API WCF sin autenticación expone 5,011 empleados | HIPAA | §164.312(a)(1) | Control de acceso único y autenticación para todo acceso a PHI | 🔴 24h |
| H-001 | API WCF sin autenticación expone 5,011 empleados | HIPAA | §164.312(a)(2)(i) | Asignación de identificadores/usuarios únicos | 🔴 24h |
| H-001 | API WCF sin autenticación expone 5,011 empleados | HIPAA | §164.308(a)(1)(ii)(D) | Evaluación de riesgos de seguridad | 🔴 24h |
| H-001 | Exposición masiva de datos personales | GDPR | Art. 32(1)(a)-(d) | Medidas técnicas y organizativas apropiadas | 🔴 72h |
| H-001 | Exposición de cédulas y datos personales | Ley 172-13 | Art. 39-40 | Medidas de seguridad para archivos de datos | 🔴 24h |
| H-002 | Contraseña compartida hardcodeada | HIPAA | §164.312(d) | Integridad de PHI — mecanismos de autenticación | 🔴 48h |
| H-002 | Contraseña compartida inter-institucional | HIPAA | §164.314(a)(1) | Acuerdos de asociados de negocio (BAAs) | 🔴 48h |
| H-002 | Contraseña compartida sin gestión | GDPR | Art. 32(1)(c) | Confidencialidad — control de acceso a datos personales | 🔴 48h |
| H-002 | Contraseña compartida en ecosistema CMR | Ley 172-13 | Art. 43-44 | Registro SIC y medidas de confidencialidad | 🔴 48h |
| H-003 | WSDL expuesto con 82 endpoints | HIPAA | §164.312(a)(2)(iii) | Procedimientos de emergencia para acceso | 🟡 1sem |
| H-003 | Exposición metadata API | GDPR | Art. 25 | Data protection by design and default | 🟡 1sem |
| H-004 | API keys LLM expuestas | HIPAA | §164.312(d) | Control de integridad de transmisión | 🔴 24h |
| H-004 | Credenciales cloud en texto claro | Ley 172-13 | Art. 40 | Confidencialidad de datos personales | 🔴 24h |
| H-005 | Ollama sin autenticar | HIPAA | §164.312(a)(1) | Controles de acceso técnicos | 🟡 1sem |
| H-006 | Firebase sin restricción | HIPAA | §164.312(c)(1) | Integridad de PHI | 🟡 1sem |

### 2.2 Mapa de Calor por Dominio de Control

```
Dominio                    HIPAA          GDPR           Ley 172-13     Score
────────────────────────── ─────────────  ─────────────  ─────────────  ─────
Control de Acceso           ██████████    ████████░░    ████████░░     28/30
Cifrado                     ████████░░    ████████░░    ██████░░░░     22/30
Gestión de Credenciales     ██████████    ████████░░    ████████░░     26/30
Auditoría y Logging         ██████░░░░    ████████░░    ██████░░░░     20/30
Evaluación de Riesgos       ████████░░    ██████████    ██████░░░░     24/30
Notificación de Brechas     ██████████    ██████████    ████████░░     28/30
DPO/Privacidad              ██████░░░░    ██████████    ██████░░░░     22/30
BAA/Contratos               ██████████    ██████░░░░    ██████░░░░     22/30
```

> **Leyenda:** ██ = Control implementado, ░░ = Brecha pendiente

---

## 3. HIPAA — Controles Detallados

### 3.1 HIPAA Privacy Rule (45 CFR §164.500-534)

| Control ID | Requisito | Hallazgo Relacionado | Acción Requerida |
|---|---|---|---|
| §164.502(a) | Usos y divulgaciones permitidas de PHI | H-001 | Establecer políticas de uso mínimo necesario. Toda divulgación requiere autorización del paciente. |
| §164.506 | Operaciones de tratamiento, pago y atención médica | H-002 | Formalizar BAAs con CMR Medical y todas las instituciones que comparten credenciales. |
| §164.508 | Autorización escrita para usos no rutinarios | H-001 | Obtener consentimiento explícito para cualquier divulgación de datos. |
| §164.510 | Oportunidad de objetar | H-001 | Implementar mecanismo de exclusión voluntaria (opt-out) para directorio de pacientes. |
| §164.514 | Desidentificación de PHI | H-001 | Implementar desidentificación Safe Harbor ($164.514(b)) o Expert Determination ($164.514(c)). |
| §164.520 | Aviso de prácticas de privacidad (NPP) | H-001 | Publicar NPP en sitio web y puntos de atención. |
| §164.522 | Derecho a solicitar restricciones | H-001 | Implementar proceso para aceptar/rechazar solicitudes de restricción. |
| §164.524 | Derecho de acceso a PHI | H-001 | Habilitar portal de pacientes para descarga de expedientes. |
| §164.526 | Derecho de enmienda | H-001 | Establecer proceso formal de solicitud de enmienda. |
| §164.528 | Derecho a contabilidad de divulgaciones | H-001 | Implementar logging de todas las divulgaciones de PHI. |

### 3.2 HIPAA Security Rule — Salvaguardas Administrativas (45 CFR §164.308)

| Control ID | Estándar | Implementación Específica | Métrica de Cumplimiento |
|---|---|---|---|
| §164.308(a)(1)(i) | **Plan de Seguridad** | Documento formal de políticas y procedimientos de seguridad | Política aprobada y revisada anualmente |
| §164.308(a)(1)(ii)(A) | **Oficial de Seguridad** | Designar CISO/POC con responsabilidad formal sobre seguridad de PHI | Nombramiento formal en acta |
| §164.308(a)(1)(ii)(B) | **Evaluación de Riesgos** | Análisis completo de riesgos para toda la infraestructura que procesa PHI | Informe firmado, actualizado anualmente |
| §164.308(a)(1)(ii)(C) | **Gestión de Riesgos** | Plan de remediación basado en las evaluaciones de riesgo | Plan con dueños, fechas, recursos |
| §164.308(a)(1)(ii)(D) | **Política de Sanciones** | Consecuencias disciplinarias por incumplimiento | Política comunicada a todo el personal |
| §164.308(a)(2) | **Asignación de Responsabilidades** | Roles y responsabilidades de seguridad claramente definidos | Matriz RACI documentada |
| §164.308(a)(3)(i) | **Gestión de la Fuerza Laboral** | Autorización, supervisión y terminación de acceso a PHI | Proceso documentado de onboarding/offboarding |
| §164.308(a)(3)(ii)(A) | **Autorización/Aprobación** | Aprobación formal para acceso a sistemas con PHI | Workflow documentado en ITSM |
| §164.308(a)(3)(ii)(B) | **Establecimiento de Acceso** | Asignación de privilegios basada en "mínimo necesario" | Revisión trimestral de accesos |
| §164.308(a)(4)(i) | **Política de Acceso a PHI** | Política que rige acceso, modificación y divulgación de PHI | Política documentada |
| §164.308(a)(4)(ii)(A) | **Autorización de Acceso** | Proceso de aprobación/revisión de acceso a PHI | Registro de autorizaciones |
| §164.308(a)(4)(ii)(B) | **Revisión de Acceso** | Revisión periódica de registros de acceso | Informes trimestrales |
| §164.308(a)(5)(i) | **Capacitación de Seguridad** | Entrenamiento en seguridad para toda la fuerza laboral | Registro de capacitación anual |
| §164.308(a)(5)(ii)(A) | **Concientización sobre Seguridad** | Programa continuo de concientización | Campañas trimestrales |
| §164.308(a)(5)(ii)(B) | **Protección contra Malware** | Entrenamiento en detección de phishing/malware | Simulaciones mensuales |
| §164.308(a)(5)(ii)(C) | **Monitoreo de Inicio de Sesión** | Capacitación sobre contraseñas seguras y MFA | Política de contraseñas aplicada |
| §164.308(a)(5)(ii)(D) | **Gestión de Contraseñas** | Procedimientos de creación, cambio y protección de contraseñas | Auditoría trimestral |
| §164.308(a)(6)(i) | **Plan de Respuesta a Incidentes** | Proceso documentado de detección, reporte y respuesta | Plan probado semestralmente |
| §164.308(a)(6)(ii) | **Respuesta y Reporte** | Procedimientos para reportar incidentes a HHS/OCIOS | Contactos actualizados |
| §164.308(a)(7)(i) | **Plan de Contingencia** | Copias de seguridad, recuperación ante desastres, operaciones de emergencia | Plan probado anualmente |
| §164.308(a)(7)(ii)(A) | **Evaluación de Aplicaciones Críticas** | Priorización de sistemas según criticidad | Registro de criticidad |
| §164.308(a)(7)(ii)(B) | **Copia de Seguridad** | Backup encriptado diario de PHI | Prueba de restauración trimestral |
| §164.308(a)(7)(ii)(C) | **Recuperación ante Desastres** | Procedimiento para restaurar PHI en caso de desastre | DRP probado anualmente |
| §164.308(a)(7)(ii)(D) | **Modo de Emergencia** | Procedimientos para operación durante emergencia | EMOP documentado |
| §164.308(a)(7)(ii)(E) | **Pruebas y Procedimientos** | Pruebas periódicas del plan de contingencia | Cronograma de pruebas |
| §164.308(a)(8) | **Evaluación Periódica** | Cumplimiento evaluado en respuesta a cambios del entorno | Programa de auditoría |

### 3.3 HIPAA Security Rule — Salvaguardas Físicas (45 CFR §164.310)

| Control ID | Estándar | Implementación | Evidencia |
|---|---|---|---|
| §164.310(a)(1) | **Control de Acceso Físico** | Acceso restringido a servidores y equipos con PHI | Bitácora de acceso físico |
| §164.310(a)(2)(i) | **Política de Estación de Trabajo** | Política para el uso apropiado de estaciones de trabajo | Política firmada |
| §164.310(a)(2)(ii) | **Uso de Estación de Trabajo** | Definir funciones permitidas y restricciones | Guía de usuario |
| §164.310(b) | **Dispositivos y Medios** | Política de disposal y reutilización de medios | Certificados de destrucción |
| §164.310(d)(1) | **Control de Inventario** | Inventario de hardware y medios que contienen PHI | Registro de activos |
| §164.310(d)(2) | **Reutilización de Medios** | Borrado criptográfico seguro antes de reutilizar | Política de sanitización |
| §164.310(d)(3) | **Disposición de Medios** | Destrucción certificada de medios obsoletos | Certificados de destrucción |

### 3.4 HIPAA Security Rule — Salvaguardas Técnicas (45 CFR §164.312)

| Control ID | Estándar | Implementación Específica | Relación con Hallazgos |
|---|---|---|---|
| §164.312(a)(1) | **Control de Acceso Técnico** | Autenticación multifactor (MFA) para todo acceso a PHI | H-001, H-004, H-005 |
| §164.312(a)(2)(i) | **ID de Usuario Único** | Cuentas individuales — prohibido el uso compartido | H-002 (contraseña compartida) |
| §164.312(a)(2)(ii) | **Procedimiento de Emergencia** | Acceso de emergencia documentado y auditable | H-003 (WSDL expuesto) |
| §164.312(a)(2)(iii) | **Cierre Automático de Sesión** | Timeout de inactividad ≤ 15 minutos | Configuración WAF/sesión |
| §164.312(a)(2)(iv) | **Encriptación y Descifrado** | Cifrado AES-256 para PHI en reposo; TLS 1.3 en tránsito | H-004 (API keys texto claro) |
| §164.312(b) | **Controles de Auditoría** | Registro detallado de todo acceso a PHI (quién, qué, cuándo) | H-001 (sin logging) |
| §164.312(c)(1) | **Integridad de PHI** | Mecanismos para asegurar que PHI no se altere/destruya | H-003 (WSDL revela estructura BD) |
| §164.312(c)(2) | **Mecanismo de Autenticación** | Autenticación de entidad para accesos electrónicos | H-002 (sin autenticación) |
| §164.312(d) | **Seguridad de Transmisión** | Cifrado de extremo a extremo en todas las transmisiones de PHI | H-004, H-005 (tráfico sin proteger) |
| §164.312(e)(1) | **Controles de Integridad** | Mecanismos para corroborar PHI no ha sido alterada | H-001 (datos extraíbles sin modificación) |
| §164.312(e)(2)(i) | **Autenticación de Integridad** | Mecanismos de firma digital/hash para PHI | Implementar HMAC/firmas |
| §164.312(e)(2)(ii) | **Cifrado de PHI** | Cifrado obligatorio en transmisión | TLS 1.3+ obligatorio |

### 3.5 HIPAA Breach Notification Rule (45 CFR §164.400-414)

| Requisito | Plazo | Aplicabilidad a Hallazgos |
|---|---|---|
| **Notificación a individuos** | ≤ 60 días del descubrimiento | H-001: 5,011 empleados expuestos — notificación obligatoria |
| **Notificación a HHS** | ≤ 60 días (<500) / Inmediata (>500) | H-001 > 500 registros — notificación inmediata requerida |
| **Notificación a medios** | ≤ 60 días (>500 residentes del mismo estado) | Evaluar si aplica por jurisdicción RD |
| **Registro de brechas** | <500 registros: log anual | Mantener registro consolidado |
| **Evaluación de riesgo de brecha** | Inmediato | Determinar probabilidad de uso indebido |

---

## 4. GDPR — Controles Detallados

### 4.1 Principios de Protección de Datos (Art. 5)

| Principio | Hallazgo Relacionado | Control Requerido |
|---|---|---|
| **Licitud, lealtad y transparencia** | H-001: Datos extraídos sin consentimiento | Implementar consentimiento granular + aviso de privacidad |
| **Limitación de la finalidad** | H-001: Datos de empleados expuestos sin propósito definido | Definir finalidades específicas del tratamiento |
| **Minimización de datos** | H-001: 5,011 registros completos expuestos | Limitar campos expuestos por endpoint |
| **Exactitud** | H-001: Datos pueden estar desactualizados | Implementar mecanismos de actualización |
| **Limitación del plazo de conservación** | No evaluado | Política de retención de datos |
| **Integridad y confidencialidad** | H-002, H-004: Credenciales compartidas y expuestas | Cifrado + control de acceso |
| **Responsabilidad proactiva** | General | Designar DPO + mantener registros de actividades |

### 4.2 Base Legal para el Tratamiento (Art. 6)

| Base Legal | Aplicabilidad | Acción Requerida |
|---|---|---|
| Consentimiento (Art. 6(1)(a)) | Necesario para datos de empleados/pacientes | Implementar consentimiento explícito digital |
| Interés legítimo (Art. 6(1)(f)) | Operaciones administrativas internas | Documentar LIA (Legitimate Interest Assessment) |
| Obligación legal (Art. 6(1)(c)) | Reportes a autoridades RD | Documentar base legal específica |
| Ejecución de contrato (Art. 6(1)(b)) | Relación laboral/paciente | Contratos actualizados |

### 4.3 Derechos del Interesado (Arts. 12-23)

| Derecho | Artículo | Implementación Técnica |
|---|---|---|
| Derecho de acceso | Art. 15 | Portal de pacientes/empleados para descarga de datos |
| Derecho de rectificación | Art. 16 | Formulario de solicitud de corrección |
| Derecho de supresión (olvido) | Art. 17 | Proceso de anonimización/eliminación de registros |
| Derecho a la limitación | Art. 18 | Mecanismo de marcado de registros |
| Derecho a la portabilidad | Art. 20 | Exportación en formato JSON/CSV estructurado |
| Derecho de oposición | Art. 21 | Mecanismo de opt-out para marketing |

### 4.4 Seguridad del Tratamiento (Art. 32)

| Medida | Hallazgo Relacionado | Implementación |
|---|---|---|
| **Seudonimización** | H-001 | Reemplazar cédulas con identificadores únicos internos en APIs públicas |
| **Cifrado de datos en reposo** | H-004 | AES-256-GCM para bases de datos y backups |
| **Cifrado de datos en tránsito** | H-004, H-005 | TLS 1.3 + HSTS en todos los endpoints |
| **Confidencialidad** | H-002 | MFA + gestión de credenciales centralizada |
| **Disponibilidad** | General | Plan de contingencia con RTO/RPO definidos |
| **Resiliencia** | General | Arquitectura redundante con failover automático |
| **Pruebas periódicas** | General | Penetration testing trimestral |

### 4.5 Notificación de Brechas (Arts. 33-34)

| Obligación | Plazo | Procedimiento |
|---|---|---|
| Notificación a DPA | ≤ 72 horas del descubrimiento | Contactar autoridad competente (INPOSDOM en RD es referente) |
| Notificación a interesados | Sin demora indebida | Comunicación directa a afectados |
| Documentación de brecha | Permanente | Formulario de incidente con causa, efecto, remediación |
| Evaluación de riesgo | Inmediato | Determinar probabilidad de daño a derechos y libertades |

### 4.6 Data Protection Officer (Arts. 37-39)

| Requisito | Acción | Estado |
|---|---|---|
| Designar DPO | Nombramiento formal con autonomía | ❌ No Designado |
| Publicar datos de contacto | Información en sitio web y ante DPA | ❌ No Publicado |
| Registro de actividades | ROPA (Record of Processing Activities) | ❌ No Existe |
| DPIA (Art. 35) | Evaluación de impacto previa al tratamiento | ❌ No Realizada |

---

## 5. Ley 172-13 — Controles Detallados

### 5.1 Disposiciones Generales (Arts. 1-4)

| Artículo | Requisito | Implementación |
|---|---|---|
| Art. 1 | Objeto: protección integral de datos personales | Política general de protección de datos |
| Art. 2 | Ámbito: archivos públicos y privados | Inventario completo de bases de datos |
| Art. 3 | Definiciones: datos personales, archivo, responsable | Glosario legal aprobado |
| Art. 4 | Excepciones: seguridad nacional, estadísticas | Documentar exclusiones aplicables |

### 5.2 Principios Rectores (Arts. 5-12)

| Artículo | Principio | Implementación Requerida |
|---|---|---|
| Art. 5 | **Consentimiento previo y expreso** | Consentimiento explícito para recolección y tratamiento |
| Art. 6 | **Lealtad y licitud** | Procesos de tratamiento documentados y autorizados |
| Art. 7 | **Calidad de datos** | Mecanismos de verificación y actualización |
| Art. 8 | **Finalidad determinada** | Especificar propósito de cada base de datos |
| Art. 9 | **Proporcionalidad** | Recolectar solo datos estrictamente necesarios |
| Art. 10 | **Acceso, rectificación y cancelación** | Procedimientos ARCO documentados |
| Art. 11 | **Confidencialidad** | Deber de secreto profesional para operadores |
| Art. 12 | **Seguridad** | Medidas técnicas/organizativas para proteger datos |

### 5.3 Registro de Archivos (Arts. 42-44)

| Artículo | Requisito | Hallazgo Relacionado | Acción |
|---|---|---|---|
| Art. 42 | **Registro de archivos de datos** | H-001, H-003 | Registrar todas las bases de datos ante INPOSDOM |
| Art. 42 | **Políticas de información adecuadas** | H-001 | Documentar políticas de seguridad y control |
| Art. 43 | **Registro SIC (Sociedades Información Crediticia)** | H-002 (ecosistema CMR) | Verificar registro ante Superintendencia de Bancos |
| Art. 44 | **Secreto profesional post-relación** | H-002 | Incluir cláusulas de confidencialidad en contratos |

### 5.4 Derechos ARCO (Arts. 13-28)

| Derecho | Artículo | Procedimiento |
|---|---|---|
| **Acceso** | Art. 13-15 | Portal de consulta de datos personales registrados |
| **Rectificación** | Art. 16-18 | Formulario de corrección con plazo máximo 30 días |
| **Cancelación (Supresión)** | Art. 19-21 | Proceso de eliminación con registro de auditoría |
| **Oposición** | Art. 22-24 | Derecho a no ser incluido en bases de datos |
| **Habeas Data** | Art. 25-28 | Procedimiento judicial sumario para protección |

### 5.5 Infracciones y Sanciones (Arts. 76-82)

| Tipo | Infracción | Sanción | Aplicabilidad |
|---|---|---|---|
| **Leve** | No atender solicitud ARCO en plazo | Multa de 1-10 salarios mínimos | Aplica si no se implementan controles |
| **Grave** | Recolectar datos sin consentimiento | Multa de 10-50 salarios mínimos | H-001: exposición sin consentimiento |
| **Muy Grave** | Crear archivos sin registro | Multa de 50-200 salarios mínimos | Registro de bases de datos no existe |
| **Muy Grave** | Vulnerar deber de secreto | Multa + responsabilidad penal | H-002: contraseña compartida |
| **Muy Grave** | Transferencia internacional no autorizada | Multa de 50-200 salarios mínimos | Verificar flujo de datos fuera de RD |

> **Nota:** Salario mínimo sector privado RD 2026 ≈ RD$ 21,000/mes. Sanción máxima: ~RD$ 4,200,000 (~USD$ 72,000).

### 5.6 Transferencia Internacional de Datos (Arts. 57-62)

| Requisito | Implementación | Estado |
|---|---|---|
| Prohibición salvo países con nivel adecuado | Verificar destino de servidores y proveedores cloud | ⚠️ No Evaluado |
| Consentimiento expreso del titular | Cláusula específica en aviso de privacidad | ❌ No Implementado |
| Excepciones contractuales | Modelo de cláusulas contractuales | ❌ No Redactado |

---

## 6. Implementaciones Técnicas Requeridas

### 6.1 Corto Plazo (0-7 días) — Contención de Daño Inmediato

| # | Acción | Responsable | Dependencia | Técnica |
|---|---|---|---|---|
| TC-01 | **Deshabilitar endpoint `/PersonalRecuperar`** | DevOps | WAF/Proxy | Bloquear a nivel de WAF o IIS URL Rewrite |
| TC-02 | **Deshabilitar endpoint `/GetContrasenaTabletas`** | DevOps | WAF/Proxy | Bloquear a nivel de WAF o IIS URL Rewrite |
| TC-03 | **Rotar contraseña compartida `cmrservice05`** | SysAdmin | Coordinación inter-institucional | Generar passphrase de 128+ bits |
| TC-04 | **Revocar API keys LLM expuestas** | CloudSec | Proveedores (Anthropic, OpenAI, Firebase) | Regenerar keys en panel de control |
| TC-05 | **Rotar secretos de entorno expuestos** | DevOps | Servidores listados en hallazgos | Regenerar en gestor de secretos (Vault) |
| TC-06 | **Bloquear acceso público a WSDL** | DevOps | IIS/Reverse Proxy | Restringir `?wsdl` por IP o token |
| TC-07 | **Implementar WAF rules** | SecOps | Cloudflare/AWS WAF/Azure WAF | Rate limiting + IP block + geo-filtering |
| TC-08 | **Activar autenticación en instancias Ollama** | DevOps | Ollama servers | Configurar `OLLAMA_ORIGINS` y proxy auth |

### 6.2 Mediano Plazo (1-4 semanas) — Arquitectura de Seguridad

| # | Acción | Estándar | Detalle Técnico |
|---|---|---|---|
| TM-01 | **Implementar API Gateway** | OWASP API Security Top 10 | Kong/AWS API Gateway/Azure APIM con autenticación JWT/OAuth2 |
| TM-02 | **Autenticación multifactor (MFA)** | HIPAA §164.312(a)(2)(i) | TOTP + WebAuthn/FIDO2 para acceso administrativo |
| TM-03 | **Cifrado de PHI en reposo** | AES-256-GCM | Cifrado a nivel de columna en SQL Server (`Always Encrypted`) |
| TM-04 | **Cifrado en tránsito** | TLS 1.3 | Configurar TLS 1.3 en todos los endpoints web; deshabilitar TLS <1.2 |
| TM-05 | **Control de acceso basado en roles (RBAC)** | NIST SP 800-53 AC-2 | Roles mínimo necesario: paciente, médico, administrador, auditor |
| TM-06 | **Logging centralizado y SIEM** | HIPAA §164.312(b) | Wazuh/Sentinel/Splunk con retención de 6+ años |
| TM-07 | **Gestión de secretos** | NIST SP 800-57 | HashiCorp Vault/AWS Secrets Manager para todas las credenciales |
| TM-08 | **Segmentación de red** | NIST SP 800-125 | VLAN separada para sistemas con PHI; microsegmentación Zero Trust |
| TM-09 | **Hardening de servidores** | CIS Benchmarks | Deshabilitar servicios no esenciales; parches de seguridad |
| TM-10 | **Endpoint Detection & Response (EDR)** | MITRE ATT&CK | CrowdStrike/SentinelOne/Defender for Endpoint |

### 6.3 Largo Plazo (1-6 meses) — Madurez de Cumplimiento

| # | Acción | Marco de Referencia | Detalle |
|---|---|---|---|
| TL-01 | **Programa de Bug Bounty** | ISO 29147 | Programa privado en HackerOne/Immunefi |
| TL-02 | **Penetration Testing trimestral** | OWASP WSTG / PTES | Auditoría externa de todo el perímetro |
| TL-03 | **Red Team ejercicios** | MITRE ATT&CK | Simulación de ataque completa anual |
| TL-04 | **Zero Trust Architecture** | NIST SP 800-207 | Migrar a arquitectura Zero Trust completa |
| TL-05 | **Data Loss Prevention (DLP)** | NIST SP 800-53 SC-7 | Monitoreo de salida de PHI/PII |
| TL-06 | **Privacidad por Diseño** | GDPR Art. 25 | Incorporar controles de privacidad en SDLC |
| TL-07 | **Certificación ISO 27001** | ISO/IEC 27001 | Sistema de Gestión de Seguridad de la Información |
| TL-08 | **BCP/DRP anual** | ISO 22301 | Plan de continuidad de negocio probado |

### 6.4 Stack Tecnológico Recomendado

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE SEGURIDAD PERIMETRAL                  │
│  WAF (Cloudflare/AWS WAF) → API Gateway (Kong) → Rate Limiting   │
├─────────────────────────────────────────────────────────────────┤
│                    CAPA DE AUTENTICACIÓN                         │
│  OAuth 2.0 / OIDC (Keycloak/Auth0) + MFA (TOTP + FIDO2)        │
├─────────────────────────────────────────────────────────────────┤
│                    CAPA DE CIFRADO                               │
│  TLS 1.3 (tránsito) → AES-256-GCM (reposo) → HSM (claves)      │
├─────────────────────────────────────────────────────────────────┤
│                    CAPA DE DETECCIÓN                             │
│  SIEM (Wazuh/Sentinel) → EDR (CrowdStrike) → DLP (Forcepoint)  │
├─────────────────────────────────────────────────────────────────┤
│                    CAPA DE GESTIÓN                               │
│  Vault (secretos) → IAM (RBAC) → CMDB (activos) → ITSM         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Documentación Necesaria

### 7.1 Políticas y Procedimientos (Prioridad Alta)

| # | Documento | Regulación | Estado | Formato Sugerido |
|---|---|---|---|---|
| D-01 | **Política de Seguridad de la Información** | HIPAA §164.308(a)(1)(i), Ley 172-13 Art. 42 | ❌ No Existe | PDF firmado por CEO |
| D-02 | **Plan de Evaluación de Riesgos** | HIPAA §164.308(a)(1)(ii)(A), GDPR Art. 32 | ❌ No Existe | Informe estructurado |
| D-03 | **Plan de Gestión de Riesgos** | HIPAA §164.308(a)(1)(ii)(B) | ❌ No Existe | Matriz de riesgos |
| D-04 | **Política de Acceso y Control** | HIPAA §164.312(a)(1), Ley 172-13 Art. 12 | ❌ No Existe | Política documentada |
| D-05 | **Plan de Respuesta a Incidentes** | HIPAA §164.308(a)(6)(i), GDPR Art. 33-34 | ❌ No Existe | Runbook + contactos |
| D-06 | **Plan de Contingencia/DRP** | HIPAA §164.308(a)(7)(i) | ❌ No Existe | Plan con RTO/RPO |
| D-07 | **Aviso de Privacidad (NPP)** | HIPAA §164.520, GDPR Art. 13-14 | ❌ No Existe | Página web + impreso |
| D-08 | **Política de Retención de Datos** | GDPR Art. 5(1)(e), Ley 172-13 | ❌ No Existe | Tabla de retención |
| D-09 | **Política de Contraseñas** | HIPAA §164.308(a)(5)(ii)(D) | ❌ No Existe | Política técnica |
| D-10 | **Procedimiento de Onboarding/Offboarding** | HIPAA §164.308(a)(3)(i) | ❌ No Existe | Checklist operativo |

### 7.2 Registros y Contratos (Prioridad Media)

| # | Documento | Regulación | Estado |
|---|---|---|---|
| D-11 | **BAA (Business Associate Agreement)** | HIPAA §164.308(b)(1), §164.314(a)(1) | ❌ No Existe con CMR Medical |
| D-12 | **DPA (Data Processing Agreement)** | GDPR Art. 28 | ❌ No Existe |
| D-13 | **ROPA (Record of Processing Activities)** | GDPR Art. 30 | ❌ No Existe |
| D-14 | **Registro de Bases de Datos** | Ley 172-13 Art. 42 | ❌ No Existe |
| D-15 | **DPIA (Data Protection Impact Assessment)** | GDPR Art. 35 | ❌ No Realizada |
| D-16 | **LIA (Legitimate Interest Assessment)** | GDPR Art. 6(1)(f) | ❌ No Realizada |
| D-17 | **Contratos de Confidencialidad** | HIPAA, Ley 172-13 Art. 44 | ❌ No Revisados |
| D-18 | **Política de Sanciones** | HIPAA §164.308(a)(1)(ii)(C) | ❌ No Existe |

### 7.3 Registros Operativos (Prioridad Continua)

| # | Registro | Propósito | Frecuencia |
|---|---|---|---|
| D-19 | **Registro de capacitaciones** | HIPAA §164.308(a)(5)(i) | Anual + onboarding |
| D-20 | **Registro de revisiones de acceso** | HIPAA §164.308(a)(4)(ii)(B) | Trimestral |
| D-21 | **Registro de incidentes de seguridad** | HIPAA §164.308(a)(6)(ii), GDPR Art. 33 | Por evento |
| D-22 | **Registro de pruebas de DRP/BCP** | HIPAA §164.308(a)(7)(ii)(E) | Anual |
| D-23 | **Registro de evaluaciones de seguridad** | HIPAA §164.308(a)(8) | Anual + cambios |

---

## 8. Evidencias de Cumplimiento

### 8.1 Matriz de Evidencias por Control

| Control ID | Tipo de Evidencia | Fuente de Datos | Método de Colección | Frecuencia |
|---|---|---|---|---|
| §164.312(a)(1) — MFA | Log de autenticación | IdP (Keycloak/Auth0) | API export → SIEM | Tiempo real |
| §164.312(a)(2)(i) — IDs únicos | Directorio de usuarios | LDAP/Azure AD | Informe mensual | Mensual |
| §164.312(a)(2)(iv) — Cifrado reposo | Configuración BD + logs AES | SQL Server Always Encrypted | Script de verificación | Semanal |
| §164.312(a)(2)(iv) — Cifrado tránsito | TLS config + scan SSL | Qualys/SSLLabs | Escaneo automatizado | Mensual |
| §164.312(b) — Auditoría | Logs de acceso PHI | SIEM (Wazuh) | Dashboard SIEM | Tiempo real |
| §164.312(d) — Integridad | Checksums/HMAC de transmisiones | WAF/API Gateway | Log de integridad | Por transacción |
| §164.308(a)(1)(ii)(A) — Riesgos | Informe firmado | Evaluación anual | Documento PDF | Anual |
| §164.308(a)(5)(i) — Capacitación | Certificados + registros | LMS (KnowBe4) | Export trimestral | Trimestral |
| §164.308(a)(6)(i) — IR | Reporte de incidente | ITSM (Jira Service Mgmt) | Ticket/Postmortem | Por evento |
| GDPR Art. 32 — Seguridad | Penetration test report | Empresa externa | Informe PDF | Trimestral |
| GDPR Art. 33 — Breach | Notificación DPA + registro | Registro interno | Copia sellada | Por evento |
| Ley 172-13 Art. 42 — Registro | Certificado INPOSDOM | INPOSDOM | Registro oficial | Único + renovaciones |
| Ley 172-13 Art. 44 — Secreto | Contratos firmados | RRHH | Expediente digital | Único + actualizaciones |

### 8.2 Evidencias Automatizadas (Continuous Compliance)

```yaml
# Configuración de monitoreo continuo — sugerencia para SIEM
evidence_collection:
  - control: HIPAA_§164.312_a_1
    source: auth0_keycloak_logs
    query: 'type IN ("sso_login", "mfa_challenge") AND result = "success"'
    schedule: every_15_minutes
    retention: 6_years
    
  - control: HIPAA_§164.312_a_2_iv
    source: tls_scanner
    query: 'grade = "A+" AND protocol IN ("TLSv1.3")'
    schedule: daily
    notification: slack_#security
    
  - control: HIPAA_§164.312_b
    source: wazuh_siem
    query: 'rule_group = "hipaa_audit" AND source = "wcf_api"'
    schedule: real_time
    dashboard: grafana_hipaa_audit
    
  - control: GDPR_Art_32
    source: vulnerability_scanner
    query: 'critical_count = 0 AND high_count = 0'
    schedule: weekly
    report: pdf_automated
    
  - control: Ley172_Art_40
    source: vault_audit
    query: 'action = "secret_rotation" AND status = "completed"'
    schedule: monthly
```

### 8.3 Breach Notification Timeline (para Hallazgo H-001)

| Hito | Plazo | Acción | Evidencia |
|---|---|---|---|
| **Descubrimiento del breach** | Día 0 (12-jul-2026) | Reporte técnico NSI detecta exposición | Reporte de hallazgos |
| **Evaluación de riesgo de brecha** | Día 0-3 | Determinar probabilidad de uso indebido de PHI | Evaluación firmada |
| **Notificación a HHS (HIPAA)** | Día 0-60 | Notificar breach >500 registros vía portal HHS | Copia de notificación |
| **Notificación a afectados (HIPAA)** | Día 0-60 | Carta a empleados con PHI comprometida | Carta + acuse |
| **Notificación a medios (HIPAA)** | Día 0-60 | Si aplica por geografía | Comunicado de prensa |
| **Notificación a DPA (GDPR)** | Día 0-3 (72h) | Si hay datos de ciudadanos UE | Notificación formal |
| **Notificación a INPOSDOM** | Día 0-5 | Reportar breach según Ley 172-13 | Comunicación oficial |
| **Registro de brecha consolidado** | Día 0-7 | Documentar causa, impacto, remediación | Log permanente |

---

## 9. Cronograma de Remediación

### Fase 1: Contención Inmediata (Días 0-7)

```
┌────────────────────────────────────────────────────────────────────┐
│ Actividad                    │ D0 │ D1 │ D2 │ D3 │ D4 │ D5 │ D6 │ D7 │
├────────────────────────────────────────────────────────────────────┤
│ Bloquear endpoints expuestos  │ ██ │ ██ │    │    │    │    │    │    │
│ Rotar credenciales            │ ██ │ ██ │ ██ │    │    │    │    │    │
│ Revocar API keys              │ ██ │ ██ │    │    │    │    │    │    │
│ Notificación de breach        │ ██ │ ██ │ ██ │ ██ │ ██ │    │    │    │
│ WAF Deployment                │    │ ██ │ ██ │ ██ │ ██ │    │    │    │
│ Evaluación de riesgo formal   │ ██ │ ██ │ ██ │ ██ │ ██ │ ██ │ ██ │ ██ │
└────────────────────────────────────────────────────────────────────┘
```

### Fase 2: Arquitectura de Seguridad (Semanas 2-4)

```
┌────────────────────────────────────────────────────────────────────┐
│ Actividad                    │ S2  │ S3  │ S4  │ S5  │ S6  │      │
├────────────────────────────────────────────────────────────────────┤
│ API Gateway + OAuth2          │ ██  │ ██  │ ██  │ ██  │     │      │
│ MFA para todo acceso PHI     │ ██  │ ██  │ ██  │     │     │      │
│ Cifrado en reposo (AES-256)  │     │ ██  │ ██  │ ██  │ ██  │      │
│ SIEM + logging centralizado  │ ██  │ ██  │ ██  │ ██  │     │      │
│ Gestor de secretos (Vault)   │     │ ██  │ ██  │ ██  │     │      │
│ Segmentación de red           │     │     │ ██  │ ██  │ ██  │      │
│ RBAC + mínimo necesario       │ ██  │ ██  │ ██  │ ██  │     │      │
└────────────────────────────────────────────────────────────────────┘
```

### Fase 3: Documentación y Procesos (Semanas 2-8)

```
┌────────────────────────────────────────────────────────────────────┐
│ Actividad                    │ S2  │ S3  │ S4  │ S5  │ S6  │ S7  │ S8  │
├────────────────────────────────────────────────────────────────────┤
│ Políticas de seguridad (D01-D10)│ ██ │ ██  │ ██  │ ██  │ ██  │ ██  │ ██  │
│ Contratos y BAAs (D11-D18)   │     │     │ ██  │ ██  │ ██  │ ██  │ ██  │
│ ROPA → DPIA → LIA            │     │ ██  │ ██  │ ██  │ ██  │ ██  │ ██  │
│ Registro INPOSDOM            │     │     │     │ ██  │ ██  │ ██  │ ██  │
│ Programa de capacitación     │ ██  │ ██  │ ██  │     │     │     │     │
│ Penetration test             │     │     │     │ ██  │ ██  │ ██  │     │
└────────────────────────────────────────────────────────────────────┘
```

### Fase 4: Madurez Continua (Meses 2-6)

| Actividad | Mes 3 | Mes 4 | Mes 5 | Mes 6 |
|---|---|---|---|---|
| Certificación ISO 27001 | Preparación | Auditoría interna | Auditoría externa | Certificación |
| Programa de Bug Bounty | Diseño | Lanzamiento privado | Expansión | Público |
| Zero Trust Architecture | Diseño | PoC | Implementación | Validación |
| Red Team anual | Planificación | Ejecución | Reporte | Remediación |

---

## 10. Anexos

### Anexo A: Tabla de Referencia Cruzada — HIPAA ↔ GDPR ↔ Ley 172-13

| Dominio de Control | HIPAA | GDPR | Ley 172-13 |
|---|---|---|---|
| Evaluación de Riesgos | §164.308(a)(1)(ii)(A) | Art. 32(1)(b), Art. 35 | Art. 12 |
| Oficial de Protección | §164.308(a)(2) | Art. 37-39 | No especifica (recomendado) |
| Consentimiento | §164.508 | Art. 6-7 | Art. 5 |
| Cifrado | §164.312(a)(2)(iv) | Art. 32(1)(a) | Art. 40 |
| Control de Acceso | §164.312(a)(1) | Art. 32(1)(b) | Art. 40 |
| Auditoría | §164.312(b) | Art. 5(2) (accountability) | Art. 42 |
| Notificación de Brechas | §164.400-414 | Art. 33-34 | Art. 76-82 |
| Retención | No especifica | Art. 5(1)(e) | Art. 9 |
| Transferencia Internacional | No restringe | Art. 44-49 | Art. 57-62 |
| BAA/DPA | §164.308(b)(1) | Art. 28 | Art. 44 |

### Anexo B: Checklist de Verificación Rápida (Quick Audit)

```markdown
# Quick Compliance Audit Checklist

## HIPAA — Seguridad
- [ ] ¿Existe evaluación de riesgos firmada y fechada?
- [ ] ¿Hay MFA en todo acceso a sistemas con PHI?
- [ ] ¿PHI está cifrada en reposo (AES-256)?
- [ ] ¿Todo tráfico usa TLS 1.3?
- [ ] ¿Hay logs de acceso a PHI con retención ≥ 6 años?
- [ ] ¿Existe BAA firmado con CMR Medical?
- [ ] ¿Se ha notificado el breach a HHS?
- [ ] ¿Hay plan de respuesta a incidentes probado?

## GDPR
- [ ] ¿Está designado un DPO?
- [ ] ¿Existe ROPA actualizado?
- [ ] ¿Hay base legal documentada para cada tratamiento?
- [ ] ¿Se realizó DPIA antes del tratamiento?
- [ ] ¿Está implementado el derecho de acceso/rectificación/supresión?
- [ ] ¿Hay procedimiento de notificación de brechas ≤ 72h?

## Ley 172-13
- [ ] ¿Están registradas todas las bases de datos ante INPOSDOM?
- [ ] ¿Existe consentimiento previo y expreso de los titulares?
- [ ] ¿Hay políticas de seguridad documentadas?
- [ ] ¿Los contratos incluyen cláusulas de confidencialidad?
- [ ] ¿Hay procedimiento ARCO implementado?
- [ ] ¿Se respeta el deber de secreto profesional post-relación?
- [ ] ¿Las transferencias internacionales de datos están autorizadas?
```

### Anexo C: Contactos y Autoridades Regulatorias

| Autoridad | Jurisdicción | Contacto | Rol |
|---|---|---|---|
| **HHS OCR** (Office for Civil Rights) | EE.UU. (HIPAA) | (800) 368-1019 / OCRMail@hhs.gov | Recepción de notificaciones de breach |
| **EDPB** (European Data Protection Board) | UE (GDPR) | edpb@edpb.europa.eu | Guía y coordinación |
| **INPOSDOM** (Instituto Nacional de Protección de Datos Personales) | RD (Ley 172-13) | info@inposdom.gob.do | Registro de archivos, sanciones |
| **Superintendencia de Bancos** | RD (SIC) | info@sb.gob.do | Registro SIC |

---

## Document Control

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 2026-07-14 | NSI Compliance Team | Documento inicial — mapeo completo HIPAA/GDPR/Ley 172-13 |

**Este documento ha sido preparado por Null Session Intelligence LLC.**  
**Clasificación:** CONFIDENCIAL — No distribuir sin autorización del destinatario.
