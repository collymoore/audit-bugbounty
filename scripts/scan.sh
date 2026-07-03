#!/bin/bash
# ============================================================
# Vulnerability Scanner (nuclei wrapper)
# Uso: ./scripts/scan.sh <live_hosts.txt> [output_file]
# ============================================================
set -euo pipefail

HOSTS="${1:?Usage: $0 <live_hosts.txt> [output_file]}"
OUTPUT="${2:-nuclei_results_$(date +%Y%m%d_%H%M%S).txt}"

echo "🔬 Running nuclei scan on $(wc -l < "$HOSTS") hosts..."
nuclei -l "$HOSTS" -c 50 -o "$OUTPUT"
echo "✅ Results: $OUTPUT"
echo ""
echo "📊 Finding types:"
grep -oP '\[.*?\]' "$OUTPUT" 2>/dev/null | sort | uniq -c | sort -rn || echo "  No findings"
