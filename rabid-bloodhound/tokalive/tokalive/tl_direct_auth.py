"""
Tokalive.com — Try forgot-password flow from browser, then try direct signInWithEmailAndPassword
"""
import json, sys, time
from playwright.sync_api import sync_playwright

PROXY = "socks5://localhost:1080"
EMAIL = "jonatan.collymoore@gmail.com"
PASSWORD = "bowho4-hojdow-bopvEr"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE - FORGOT PASSWORD + DIRECT AUTH ===")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"], timeout=30000)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720},
            locale="es-DO",
            proxy={"server": PROXY},
        )
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        """)
        
        page = context.new_page()
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        # Go to forgot-password page
        log("Loading /forgot-password...")
        page.goto("https://tokalive.com/forgot-password", timeout=30000, wait_until="domcontentloaded")
        time.sleep(3)
        log(f"URL: {page.url}")
        
        # Check what's on the page
        inputs = page.query_selector_all("input")
        for inp in inputs:
            ph = inp.get_attribute("placeholder") or ""
            tp = inp.get_attribute("type") or ""
            log(f"  Input: type={tp} placeholder='{ph}'")
        
        buttons = page.query_selector_all("button")
        for btn in buttons:
            log(f"  Button: '{btn.inner_text()[:50]}'")
        
        # Fill email and submit
        email_filled = False
        for inp in inputs:
            ph = (inp.get_attribute("placeholder") or "").lower()
            if "email" in ph:
                inp.fill(EMAIL)
                email_filled = True
                log(f"Filled email: {EMAIL}")
                break
        
        time.sleep(1)
        
        # Click submit
        for btn in buttons:
            txt = btn.inner_text().lower()
            if "enviar" in txt or "reset" in txt or "recuper" in txt:
                log(f"Clicking: {btn.inner_text()}")
                btn.click()
                time.sleep(5)
                break
        
        # Check result
        log(f"\nAfter reset: {page.url}")
        page.screenshot(path="/root/bounty/tokalive/tl_forgot_password.png")
        
        errors = [l for l in all_console if l.startswith("[error")]
        warnings = [l for l in all_console if l.startswith("[warning")]
        log(f"Errors: {len(errors)}")
        for e in errors[-5:]: log(f"  {e}")
        log(f"Warnings: {len(warnings)}")
        for w in warnings[-5:]: log(f"  {w}")
        
        # NOW try direct Firebase Auth sign-in from the console
        log("\n=== ATTEMPTING DIRECT SIGNIN VIA CONSOLE ===")
        
        # Try to import firebase/auth dynamically and sign in
        # This bypasses the SPA's form but still goes through Firebase SDK
        result = page.evaluate(f"""async () => {{
            try {{
                // Try to access Firebase Auth from the app's initialized instance
                // Firebase v9+ modular SDK - look for the auth instance
                const appCheck = window.__firebaseAppCheck || null;
                
                // Try getting Firebase app from the page
                const fbApps = window.firebase?.apps || [];
                
                // Alternative: use the Firebase Auth REST API directly via fetch
                // This bypasses the SDK's App Check enforcement
                const apiKey = 'AIzaSyDR3Xf1u1zqijSzX-wEoaTT459V5tAobJA';
                const signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey;
                
                const resp = await fetch(signInUrl, {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify({{
                        email: '{EMAIL}',
                        password: '{PASSWORD}',
                        returnSecureToken: true
                    }})
                }});
                
                const data = await resp.json();
                return {{ status: resp.status, data: JSON.stringify(data).substring(0, 500) }};
            }} catch(e) {{
                return {{ error: e.message }};
            }}
        }}""")
        
        log(f"\nDirect signIn result: {json.dumps(result, indent=2, default=str)}")
        
        # ALSO try fetch from the server side (VPS, not browser)
        log("\n=== TRYING SIGNIN FROM VPS DIRECTLY ===")
        import urllib.request
        import urllib.error
        
        api_key = "AIzaSyDR3Xf1u1zqijSzX-wEoaTT459V5tAobJA"
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
        
        req_body = json.dumps({
            "email": EMAIL,
            "password": PASSWORD,
            "returnSecureToken": True
        }).encode()
        
        req = urllib.request.Request(url, data=req_body, headers={"Content-Type": "application/json"})
        try:
            resp = urllib.request.urlopen(req, timeout=15)
            data = json.loads(resp.read())
            log(f"  ✅ SUCCESS! Token obtained!")
            log(f"  Token: {data.get('idToken', 'N/A')[:80]}...")
            log(f"  UID: {data.get('localId', 'N/A')}")
            log(f"  Email: {data.get('email', 'N/A')}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            log(f"  ❌ HTTP {e.code}: {body[:300]}")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
