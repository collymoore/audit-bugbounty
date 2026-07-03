#!/bin/bash
# ============================================================
# Full Recon Pipeline
# Uso: ./scripts/recon.sh target.com [output_dir]
# ============================================================
set -euo pipefail

TARGET="${1:?Usage: $0 <target.com> [output_dir]}"
OUTDIR="${2:-targets/$TARGET}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting recon on $TARGET"
echo "📁 Output: $OUTDIR"
mkdir -p "$OUTDIR"

# --- Phase 1: Subdomain Discovery ---
echo ""
echo "🔍 [1/5] Subdomain discovery (subfinder)..."
subfinder -d "$TARGET" -all -silent -o "$OUTDIR/subs_raw.txt" 2>/dev/null
echo "   → $(wc -l < "$OUTDIR/subs_raw.txt") subdomains found"

# --- Phase 2: HTTP Probing ---
echo ""
echo "🌐 [2/5] HTTP probing (httpx)..."
httpx -l "$OUTDIR/subs_raw.txt" -silent -status-code -title -tech-detect \
    -o "$OUTDIR/live.txt" -json 2>/dev/null
echo "   → $(wc -l < "$OUTDIR/live.txt") live hosts"

# --- Phase 3: URL Crawling ---
echo ""
echo "🕷️  [3/5] URL crawling (katana)..."
katana -list "$OUTDIR/live.txt" -d 3 -jc -kf all -c 30 -silent \
    -o "$OUTDIR/katana_raw.txt" 2>/dev/null
echo "   → $(wc -l < "$OUTDIR/katana_raw.txt") URLs crawled"

# --- Phase 4: Historical URLs ---
echo ""
echo "📜 [4/5] Historical URLs (gau + waybackurls)..."
cat "$OUTDIR/subs_raw.txt" | gau --subs --silent > "$OUTDIR/gau_raw.txt" 2>/dev/null || true
cat "$OUTDIR/subs_raw.txt" | waybackurls > "$OUTDIR/wayback_raw.txt" 2>/dev/null || true
echo "   → $(wc -l < "$OUTDIR/gau_raw.txt") gau URLs"
echo "   → $(wc -l < "$OUTDIR/wayback_raw.txt") wayback URLs"

# --- Phase 5: Vulnerability Scan ---
echo ""
echo "⚠️  [5/5] Vulnerability scan (nuclei)..."
nuclei -l "$OUTDIR/live.txt" -c 50 -silent -o "$OUTDIR/nuclei_results.txt" 2>/dev/null || true
NUCOUNT=$(wc -l < "$OUTDIR/nuclei_results.txt" 2>/dev/null || echo 0)
echo "   → $NUCOUNT findings detected"

# --- Summary ---
echo ""
echo "==========================================="
echo "✅ Recon complete for $TARGET"
echo "📁 Report saved to: $OUTDIR"
echo "==========================================="
echo ""
echo "Findings summary:"
grep -oP '\[.*?\]' "$OUTDIR/nuclei_results.txt" 2>/dev/null | sort | uniq -c | sort -rn || echo "  No findings"
echo ""
echo "Next: cat $OUTDIR/live.txt | while read h; do ... done"
