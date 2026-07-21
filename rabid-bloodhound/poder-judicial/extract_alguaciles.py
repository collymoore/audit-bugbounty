#!/usr/bin/env python3
"""Extract all alguaciles from Poder Judicial RD public API."""
import json
import csv
import os
import subprocess
import re
import time

OUTPUT_DIR = "/root/bounty/poder-judicial"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def call_api(criterio):
    cmd = [
        "curl", "-s", "--max-time", "15",
        "-X", "POST",
        "-H", "Content-Type: application/json",
        "-d", json.dumps({"criterio": criterio}),
        "https://adapi.poderjudicial.gob.do/ConsultaGestionCasos/api/Alguaciles/GetAlguaciles"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
    try:
        data = json.loads(result.stdout)
        return data.get('data', [])
    except json.JSONDecodeError:
        return []

def parse_display_text(dt):
    """Parse 'Francisco Javier Feliz Ferreras - 01800121343' into name and cedula."""
    if ' - ' in dt:
        name, cedula = dt.split(' - ', 1)
        return name.strip(), cedula.strip()
    return dt.strip(), ''

def main():
    all_records = {}  # keyed by numeric Value
    
    letters = list('abcdefghijklmnopqrstuvwxyzñ')
    
    print("Extracting all alguaciles...")
    for letter in letters:
        records = call_api(letter)
        count_before = len(all_records)
        for rec in records:
            vid = rec.get('Value')
            if vid and vid not in all_records:
                name, cedula = parse_display_text(rec.get('DisplayText', ''))
                all_records[vid] = {
                    'Id': vid,
                    'NombreCompleto': name,
                    'Cedula': cedula,
                    'DisplayText': rec.get('DisplayText', '')
                }
        added = len(all_records) - count_before
        print(f"  '{letter}': {len(records)} results → {added} new (total: {len(all_records)})")
        time.sleep(0.2)
    
    print(f"\n=== TOTAL: {len(all_records)} unique alguaciles ===")
    
    if len(all_records) == 0:
        print("ERROR: No records extracted!")
        return
    
    records_list = sorted(all_records.values(), key=lambda x: x['Id'])
    
    # JSON
    json_path = os.path.join(OUTPUT_DIR, "alguaciles_dataset.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(records_list, f, ensure_ascii=False, indent=2)
    print(f"JSON: {json_path} ({os.path.getsize(json_path):,} bytes)")
    
    # CSV
    csv_path = os.path.join(OUTPUT_DIR, "alguaciles_dataset.csv")
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Id', 'NombreCompleto', 'Cedula'])
        for r in records_list:
            writer.writerow([r['Id'], r['NombreCompleto'], r['Cedula']])
    print(f"CSV: {csv_path} ({os.path.getsize(csv_path):,} bytes)")
    
    # Stats
    with_cedula = [r for r in records_list if r['Cedula']]
    cedula_numbers = [r['Cedula'] for r in with_cedula]
    
    print(f"\n=== STATS ===")
    print(f"  Total alguaciles: {len(records_list)}")
    print(f"  Con cédula: {len(with_cedula)} ({len(with_cedula)/len(records_list)*100:.1f}%)")
    print(f"  Sin cédula: {len(records_list) - len(with_cedula)}")
    print(f"  Cédulas únicas: {len(set(cedula_numbers))}")
    
    print(f"\n=== SAMPLE (10) ===")
    for r in records_list[:10]:
        print(f"  [{r['Id']:>6}] {r['NombreCompleto'][:40]:40s}  {r['Cedula']}")
    
    print(f"\n=== LAST 3 ===")
    for r in records_list[-3:]:
        print(f"  [{r['Id']:>6}] {r['NombreCompleto'][:40]:40s}  {r['Cedula']}")
    
    # Count by cédula prefix (018=RD, 402=RD, 001=old, 224=foreign, etc.)
    print(f"\n=== CÉDULA PREFIX DISTRIBUTION ===")
    prefixes = {}
    for c in cedula_numbers:
        prefix = c[:3] if len(c) >= 3 else c
        prefixes[prefix] = prefixes.get(prefix, 0) + 1
    for p in sorted(prefixes.keys()):
        print(f"  {p}: {prefixes[p]}")

if __name__ == "__main__":
    main()
