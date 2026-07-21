#!/usr/bin/env python3
"""Ad-hoc verification: HackerOne #3823749 state file matches live API."""
import json, os, sys, urllib.request, base64

STATE_PATH = os.path.expanduser("/root/.hermes/cron/hackerone-report-3823749-state.json")

# 1. Read state file
assert os.path.exists(STATE_PATH), f"State file not found: {STATE_PATH}"
with open(STATE_PATH) as f:
    state = json.load(f)

print(f"[STATE FILE] last_checked={state.get('last_checked')}")
print(f"[STATE FILE] state={state.get('state')}")
print(f"[STATE FILE] severity={state.get('severity_rating')} ({state.get('severity_score')})")
print(f"[STATE FILE] bounty={state.get('bounty')}")
print(f"[STATE FILE] triaged_at={state.get('triaged_at')}")
print(f"[STATE FILE] resolved_at={state.get('resolved_at')}")
print(f"[STATE FILE] cve_ids={state.get('cve_ids')}")

# 2. Verify state is JSON-valid
assert isinstance(state, dict), "State must be a dict"
assert "state" in state, "State missing 'state' key"
assert "severity_rating" in state, "State missing 'severity_rating' key"
assert "severity_score" in state, "State missing 'severity_score' key"

# 3. Verify the fields we care about
assert state["state"] == "new", f"Expected state=new, got {state['state']}"
assert state["severity_rating"] == "high"
assert state["severity_score"] == 7.5
assert state["bounty"] is None
assert state["triaged_at"] is None
assert state["resolved_at"] is None
assert isinstance(state["cve_ids"], list)
assert "CVE-2021-45901" in state["cve_ids"]

# 4. Verify API consistency (auth via vaultwarden)
sys.path.insert(0, os.path.expanduser("/root/.hermes/vaultwarden"))
import vaultwarden_client as vc
token = vc.vault_get("hackerone-api-token")
username = vc.vault_get("hackerone-username")

creds = f"{username}:{token}".encode()
b64_creds = base64.b64encode(creds).decode()

req = urllib.request.Request("https://api.hackerone.com/v1/hackers/reports/3823749")
req.add_header("Authorization", f"Basic {b64_creds}")
with urllib.request.urlopen(req, timeout=15) as resp:
    api_data = json.loads(resp.read())["data"]

attrs = api_data["attributes"]
sev = api_data.get("relationships", {}).get("severity", {}).get("data", {}).get("attributes", {})

api_sev_rating = sev.get("rating")
api_sev_score = sev.get("score")
api_state = attrs.get("state")

print()
print(f"[API LIVE]    state={api_state}")
print(f"[API LIVE]    severity={api_sev_rating} ({api_sev_score})")
print(f"[API LIVE]    triaged_at={attrs.get('triaged_at')}")
print(f"[API LIVE]    bounty_awarded_at={attrs.get('bounty_awarded_at')}")

assert api_state == state["state"], f"State mismatch: API={api_state}, state={state['state']}"
assert api_sev_rating == state["severity_rating"], f"Severity rating mismatch"
assert api_sev_score == state["severity_score"], f"Severity score mismatch"

print()
print("✅ ALL CHECKS PASSED — state file matches live API")
print("   Severity now correctly extracted from relationships.severity.data.attributes")
