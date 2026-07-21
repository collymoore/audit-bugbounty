#!/bin/bash
# CardNET subdomain probe script
# Output: pipe-delimited fields for easy parsing

SUBDOMAINS=(
  "ach.cardnet.com.do"
  "analytics.cardnet.com.do"
  "ath.cardnet.com.do"
  "auraportal.cardnet.com.do"
  "auraportalext.cardnet.com.do"
  "autoconfig.cardnet.com.do"
  "autodiscover.cardnet.com.do"
  "autoservicio.cardnet.com.do"
  "certauth.fs.cardnet.com.do"
  "chk.cardnet.com.do"
  "comercios.cardnet.com.do"
  "correoseguro.cardnet.com.do"
  "csrp.cardnet.com.do"
  "desarrolladores.cardnet.com.do"
  "developers.cardnet.com.do"
  "dialin.cardnet.com.do"
  "ecommerce.cardnet.com.do"
  "empleos.cardnet.com.do"
  "epay.cardnet.com.do"
  "expe.cardnet.com.do"
  "fs.cardnet.com.do"
  "lab.cardnet.com.do"
  "lab02.cardnet.com.do"
  "labservicios.cardnet.com.do"
  "lyndiscover.cardnet.com.do"
  "mail.acc.cardnet.com.do"
  "mail.cardnet.com.do"
  "meet.cardnet.com.do"
  "mercury.cardnet.com.do"
  "mesadeservicio.cardnet.com.do"
  "monitor.cardnet.com.do"
  "mta-sts.acc.cardnet.com.do"
  "mta-sts.comunicaciones.cardnet.com.do"
  "ns1.cardnet.com.do"
  "ns2.cardnet.com.do"
  "ns3.cardnet.com.do"
  "origin.cardnet.com.do"
  "pagosrecurrentes.cardnet.com.do"
  "security.cardnet.com.do"
  "sentry.cardnet.com.do"
  "ser.cardnet.com.do"
  "servicios.cardnet.com.do"
  "shop.cardnet.com.do"
  "stream.cardnet.com.do"
  "uranus.cardnet.com.do"
  "vacantes.cardnet.com.do"
  "vacnet.cardnet.com.do"
  "vcnet.cardnet.com.do"
  "video.cardnet.com.do"
  "vlcnet.cardnet.com.do"
  "wac.cardnet.com.do"
  "www.auraportal.cardnet.com.do"
  "www.auraportalext.cardnet.com.do"
  "www.cardnet.com.do"
)

# Also probe non-standard ports
EXTRA=(
  "ecommerce.cardnet.com.do:6443"
  "ecommerce.cardnet.com.do:8443"
  "ecommerce.cardnet.com.do:8080"
  "ecommerce.cardnet.com.do:443"
  "www.cardnet.com.do:8443"
  "www.cardnet.com.do:8080"
  "www.cardnet.com.do:6443"
  "correoseguro.cardnet.com.do:8443"
  "correoseguro.cardnet.com.do:587"
  "correoseguro.cardnet.com.do:993"
  "epay.cardnet.com.do:8443"
  "epay.cardnet.com.do:6443"
)

echo "=== STANDARD PORTS (443) ==="
echo "subdomain|http_code|content_length|server|title|waf_incapsula|cookies"

for sub in "${SUBDOMAINS[@]}"; do
  url="https://${sub}"
  
  # Get response headers and status
  resp=$(curl -sk --max-time 10 -o /tmp/probe_body.txt -w "http_code:%{http_code}|content_length:%{size_download}|content_type:%{content_type}" "$url" 2>/dev/null)
  http_code=$(echo "$resp" | grep -oP 'http_code:\K[^|]+')
  content_length=$(echo "$resp" | grep -oP 'content_length:\K[^|]+')
  
  # Get headers separately  
  headers=$(curl -sk --max-time 10 -I "$url" 2>/dev/null)
  server=$(echo "$headers" | grep -i '^server:' | sed 's/[Ss][Ee][Rr][Vv][Ee][Rr]:\s*//' | head -1 | tr -d '\r')
  cookies=$(echo "$headers" | grep -i '^set-cookie:' | sed 's/[Ss][Ee][Tt]-[Cc][Oo][Oo][Kk][Ii][Ee]:\s*//' | head -3 | paste -sd '; ' | tr -d '\r')
  
  # Get title from body
  title=$(grep -oP '<title>[^<]*</title>' /tmp/probe_body.txt 2>/dev/null | sed 's/<[^>]*>//g' | head -1 | tr -d '\r')
  [ -z "$title" ] && title="N/A"
  
  # WAF detection - Incapsula
  waf="No"
  if echo "$cookies" | grep -qi "incap_ses\|visid_incap\|Incapsula\|reese84"; then
    waf="Yes-Incapsula"
  fi
  if echo "$headers" | grep -qi "X-Iinfo\|X-CDN\|Imperva"; then
    waf="Yes-Imperva/Incapsula"
  fi
  
  # Sanitize output
  [ -z "$http_code" ] && http_code="000"
  [ -z "$server" ] && server="N/A"
  [ -z "$content_length" ] && content_length="0"
  [ -z "$cookies" ] && cookies="N/A"
  
  echo "${sub}|${http_code}|${content_length}|${server}|${title}|${waf}|${cookies}"
done

echo ""
echo "=== NON-STANDARD PORTS ==="
echo "target|http_code|content_length|server|title|notes"

for target in "${EXTRA[@]}"; do
  host=$(echo "$target" | cut -d: -f1)
  port=$(echo "$target" | cut -d: -f2)
  url="https://${host}:${port}"
  
  resp=$(curl -sk --max-time 10 -o /tmp/probe_extra.txt -w "http_code:%{http_code}|content_length:%{size_download}" "$url" 2>/dev/null)
  http_code=$(echo "$resp" | grep -oP 'http_code:\K[^|]+')
  content_length=$(echo "$resp" | grep -oP 'content_length:\K[^|]+')
  
  if [ -z "$http_code" ] || [ "$http_code" = "000" ]; then
    # Try HTTP
    url="http://${host}:${port}"
    resp=$(curl -sk --max-time 10 -o /tmp/probe_extra.txt -w "http_code:%{http_code}|content_length:%{size_download}" "$url" 2>/dev/null)
    http_code=$(echo "$resp" | grep -oP 'http_code:\K[^|]+')
    content_length=$(echo "$resp" | grep -oP 'content_length:\K[^|]+')
    notes="Fell back to HTTP"
  else
    notes="HTTPS"
  fi
  
  headers=$(curl -sk --max-time 10 -I "$url" 2>/dev/null)
  server=$(echo "$headers" | grep -i '^server:' | sed 's/[Ss][Ee][Rr][Vv][Ee][Rr]:\s*//' | head -1 | tr -d '\r')
  title=$(grep -oP '<title>[^<]*</title>' /tmp/probe_extra.txt 2>/dev/null | sed 's/<[^>]*>//g' | head -1 | tr -d '\r')
  
  [ -z "$http_code" ] && http_code="000"
  [ -z "$server" ] && server="N/A"
  [ -z "$content_length" ] && content_length="0"
  [ -z "$title" ] && title="N/A"
  
  echo "${target}|${http_code}|${content_length}|${server}|${title}|${notes}"
done

# Cleanup
rm -f /tmp/probe_body.txt /tmp/probe_extra.txt
