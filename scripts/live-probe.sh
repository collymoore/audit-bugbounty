#!/bin/bash
# ============================================================
# Live Host Probe (httpx wrapper)
# Uso: ./scripts/live-probe.sh <subdomains.txt>
# ============================================================
set -euo pipefail

SUBS="${1:?Usage: $0 <subdomains.txt>}"
OUTPUT="${SUBS%.*}_live.txt"

echo "🌐 Probing $(wc -l < "$SUBS") subdomains..."
httpx -l "$SUBS" -silent -status-code -title -tech-detect -o "$OUTPUT" -json
echo "✅ Live hosts: $(wc -l < "$OUTPUT")"
echo "📁 Saved: $OUTPUT"
