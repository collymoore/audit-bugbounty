"""
Tokalive.com — App Check bypass v3: Let reCAPTCHA load, intercept exchange endpoint
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE APP CHECK BYPASS V3 - EXCHANGE INTERCEPT ===")
    log(f"Proxy: {PROXY}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
            ],
            timeout=30000
        )
        
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720},
            locale="es-DO",
            proxy={"server": PROXY},
        )
        
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['es-DO', 'es', 'en-US'] });
            window.chrome = { runtime: {} };
            
            // Intercept XMLHttpRequest to catch App Check calls
            const origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url && typeof url === 'string' && url.includes('firebaseappcheck')) {
                    console.log('[INTERCEPT] App Check XHR:', method, url.substring(0, 100));
                }
                return origOpen.apply(this, arguments);
            };
        """)
        
        page = context.new_page()
        
        intercepted = []
        
        # Intercept ONLY App Check exchange endpoint
        def handle_route(route):
            url = route.request.url
            if "firebaseappcheck.googleapis.com" in url or "appcheck" in url.lower():
                log(f"  🔴 INTERCEPTED App Check: {url[:120]}")
                intercepted.append(url)
                # Return fake success with a token-like value
                route.fulfill(
                    status=200,
                    content_type="application/json",
                    body=json.dumps({
                        "token": "fake-app-check-token-for-bypass-testing",
                        "ttl": "86400s"
                    })
                )
                return
            route.continue_()
        
        page.route("**/*.googleapis.com/*", handle_route)
        page.route("**/*appcheck*", handle_route)
        
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        # Load login page
        log("Loading tokalive.com/login...")
        try:
            page.goto("https://tokalive.com/login", timeout=30000, wait_until="networkidle")
            log(f"URL: {page.url}")
        except PWTimeout as e:
            log(f"Timeout: {e}")
            log(f"Current URL: {page.url}")
        
        time.sleep(5)
        
        # Check page state
        inputs_info = page.evaluate("""() => {
            const inputs = document.querySelectorAll('input');
            return Array.from(inputs).map(i => ({
                type: i.type,
                placeholder: i.placeholder,
                name: i.name,
                id: i.id
            }));
        }""")
        
        buttons_info = page.evaluate("""() => {
            const buttons = document.querySelectorAll('button, a, [role="button"]');
            return Array.from(buttons).map(b => ({
                text: (b.innerText || b.textContent || '').trim().substring(0, 60),
                tag: b.tagName,
                href: b.getAttribute('href') || ''
            })).filter(b => b.text.length > 0).slice(0, 15);
        }""")
        
        body_text = page.inner_text("body")[:1000]
        
        log(f"\nBody text:\n{body_text}")
        log(f"\nInputs: {json.dumps(inputs_info, indent=2)}")
        log(f"\nButtons: {json.dumps(buttons_info, indent=2)}")
        
        page.screenshot(path="/root/bounty/tokalive/tl_step7_bypass4.png")
        log("Screenshot saved")
        
        # Console
        errors = [l for l in all_console if l.startswith("[error")]
        warnings = [l for l in all_console if l.startswith("[warning")]
        
        if intercepted:
            log(f"\nApp Check calls intercepted: {len(intercepted)}")
            for i in intercepted:
                log(f"  → {i}")
        
        log(f"\nErrors: {len(errors)}")
        for e in errors[-5:]:
            log(f"  {e}")
        log(f"Warnings: {len(warnings)}")
        for w in warnings[-5:]:
            log(f"  {w}")
        
        if len(inputs_info) >= 2:
            log("\n✅ RENDER SUCCESS! Auth form visible!")
        else:
            log("\n❌ Still no auth form.")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
