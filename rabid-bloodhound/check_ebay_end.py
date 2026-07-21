#!/usr/bin/env python3
# Check where the eBay session left off - last few messages
import json

with open('/tmp/hermes-results/call_00_uM99z4wvGPaCl0nlNUwg9273.txt') as f:
    data = json.load(f)

msgs = data.get('messages', [])
# Show the last 5 messages regardless of role
print("=== LAST 5 MESSAGES OF EBAY SESSION ===")
for msg in msgs[-5:]:
    role = msg.get('role','?')
    content = msg.get('content','')
    # Truncate very long tool content
    if role == 'tool' and len(content) > 300:
        content = content[:300] + '...'
    elif len(content) > 500:
        content = content[:500] + '...'
    print(f"\n[{role}] MSG#{msg.get('id')}: {content}")
