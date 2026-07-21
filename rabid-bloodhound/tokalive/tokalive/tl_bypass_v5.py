"""
Tokalive.com — App Check bypass v5: Intercept the EXACT exchange URL
URL: content-firebaseappcheck.googleapis.com/...exchangeRecaptchaV3Token
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE BYPASS V5 - EXACT EXCHANGE URL INTERCEPT ===")
    log(f"Target: content-firebaseappcheck.googleapis.com/...exchangeRecaptchaV3Token")
    
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
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
        """)
        
        page = context.new_page()
        
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:200]}"))
        
        intercepted = [False]
        
        # Intercept with the EXACT URL pattern
        def handle_firebase(route):
            url = route.request.url
            
            # App Check exchange endpoint
            if "content-firebaseappcheck.googleapis.com" in url and "exchangeRecaptchaV3Token" in url:
                log(f"  🔴 INTERCEPTED App Check exchange!")
                log(f"     URL: {url[:120]}")
                intercepted[0] = True
                
                # Return fake success response
                body = json.dumps({
                    "token": "fake-app-check-token-for-testing",
                    "ttl": "86400s"
                })
                route.fulfill(status=200, content_type="application/json; charset=UTF-8", body=body)
                return
            
            # Also intercept the old firebaseappcheck subdomain
            if "firebaseappcheck.googleapis.com" in url:
                log(f"  🟡 INTERCEPTED alt App Check: {url[:100]}")
                route.fulfill(status=200, content_type="application/json", 
                    body=json.dumps({"token":"bypassed","ttl":"86400s"}))
                return
            
            route.continue_()
        
        page.route("**/content-firebaseappcheck.googleapis.com/**", handle_firebase)
        page.route("**/firebaseappcheck.googleapis.com/**", handle_firebase)
        
        # Navigate to signup
        log("Loading /signup...")
        page.goto("https://tokalive.com/signup", timeout=30000, wait_until="domcontentloaded")
        time.sleep(3)
        
        # Fill form
        inputs = page.query_selector_all("input")
        test_email = f"tl{int(time.time())}@protonmail.com"
        
        for inp in inputs:
            ph = (inp.get_attribute("placeholder") or "").lower()
            tp = inp.get_attribute("type") or ""
            
            if "email" in ph or tp == "email":
                inp.fill(test_email)
                log(f"Email: {test_email}")
            elif tp == "password":
                inp.fill("TestPass2026!")
                log("Password filled")
            elif "ej" in ph or "nombre" in ph:
                inp.fill("Test Orchestra")
                log("Name filled")
        
        time.sleep(1)
        
        # Click register
        for btn in page.query_selector_all("button"):
            txt = btn.inner_text()
            if "registr" in txt.lower():
                log(f"Clicking: {txt}")
                btn.click()
                break
        
        time.sleep(8)
        
        # Check result
        log(f"\nFinal URL: {page.url}")
        page.screenshot(path="/root/bounty/tokalive/tl_step11_final.png")
        
        errors = [l for l in all_console if l.startswith("[error") or "403" in l or "401" in l]
        warnings = [l for l in all_console if l.startswith("[warning")]
        
        log(f"\nIntercepted: {intercepted[0]}")
        log(f"Errors: {len(errors)}")
        for e in errors[-5:]: log(f"  {e}")
        log(f"Warnings: {len(warnings)}")
        for w in warnings[-5:]: log(f"  {w}")
        
        # Check for auth tokens
        tokens = page.evaluate("""() => {
            const r = {};
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                try {
                    const v = localStorage.getItem(k);
                    if (k.includes('firebase') || k.includes('auth') || k.includes('user')) {
                        r[k] = v.substring(0, 300);
                    }
                } catch(e) {}
            }
            return r;
        }""")
        log(f"\nTokens: {json.dumps(tokens, indent=2, default=str)}")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
