"""
Tokalive.com — Attempt 6: Let ALL network pass through, don't intercept anything
Test if residential IP + better fingerprint gives good enough reCAPTCHA v3 score
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE BYPASS V6 - LET RECAPTCHA FLOW NATURALLY ===")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True, 
            args=[
                "--no-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-features=ChromeWhatsNewUI",
            ],
            timeout=30000
        )
        
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720},
            locale="es-DO",
            proxy={"server": PROXY},
            # Don't clear storage - let reCAPTCHA state persist
        )
        
        # More comprehensive anti-detection
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5, 6, 7] });
            Object.defineProperty(navigator, 'languages', { get: () => ['es-DO', 'es', 'en-US', 'en'] });
            window.chrome = { runtime: {}, loadTimes: function(){}, csi: function(){}, app: {} };
            
            // Override permissions
            const origQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (params) => {
                if (params.name === 'notifications') {
                    return Promise.resolve({ state: 'denied' });
                }
                return origQuery(params);
            };
            
            // Screen properties
            Object.defineProperty(screen, 'colorDepth', { get: () => 24 });
            Object.defineProperty(screen, 'pixelDepth', { get: () => 24 });
            
            // WebGL vendor/renderer spoofing
            const getParameter = WebGLRenderingContext.prototype.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(p) {
                if (p === 37445) return 'Intel Inc.';
                if (p === 37446) return 'Intel Iris OpenGL Engine';
                return getParameter.apply(this, arguments);
            };
        """)
        
        page = context.new_page()
        
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        # DON'T intercept any Firebase/App Check calls - let them flow naturally
        # Just log them
        def log_request(req):
            url = req.url
            if "firebaseappcheck" in url or "identitytoolkit" in url or "recaptcha/api2/reload" in url:
                log(f"  📡 [{req.method}] {url[:120]}")
        
        page.on("request", log_request)
        
        responses = {}
        def log_response(resp):
            url = resp.url
            if "firebaseappcheck" in url or "identitytoolkit" in url:
                status = resp.status
                if status != 200:
                    try:
                        body = resp.text()[:200]
                    except:
                        body = ""
                    log(f"  📥 [{status}] {url[:100]}")
                    responses[url[:80]] = {"status": status, "body": ""}
                else:
                    log(f"  📥 [200] {url[:100]}")
        
        page.on("response", log_response)
        
        log("Loading /signup...")
        page.goto("https://tokalive.com/signup", timeout=30000, wait_until="domcontentloaded")
        time.sleep(3)
        
        # Fill form
        test_email = f"tl{int(time.time())}@protonmail.com"
        for inp in page.query_selector_all("input"):
            ph = (inp.get_attribute("placeholder") or "").lower()
            tp = inp.get_attribute("type") or ""
            if "email" in ph or tp == "email":
                inp.fill(test_email)
                log(f"Email: {test_email}")
            elif tp == "password":
                inp.fill("TestPass2026!")
            elif "ej" in ph:
                inp.fill("Test Orq")
        
        time.sleep(1)
        
        log("Clicking register...")
        for btn in page.query_selector_all("button"):
            txt = btn.inner_text()
            if "registr" in txt.lower():
                log(f"Button: {txt}")
                btn.click()
                break
        
        time.sleep(8)
        
        # Check result
        log(f"\nFinal URL: {page.url}")
        page.screenshot(path="/root/bounty/tokalive/tl_step12_natural.png")
        
        errors = [l for l in all_console if l.startswith("[error")]
        warnings = [l for l in all_console if l.startswith("[warning")]
        
        log(f"\nErrors: {len(errors)}")
        for e in errors[-10:]: log(f"  {e}")
        log(f"Warnings: {len(warnings)}")
        for w in warnings[-10:]: log(f"  {w}")
        
        tokens = page.evaluate("""() => {
            const r = {};
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                try {
                    const v = localStorage.getItem(k);
                    if (k.includes('firebase') || k.includes('auth') || k.includes('user') || k.includes('token')) {
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
