"""
Tokalive.com — App Check bypass via request interception
Block the App Check exchange endpoint and see if Firebase Auth falls back
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"

def log(msg):
    print(msg, flush=True)

INTERCEPTED_REQUESTS = []

def main():
    log("=== TOKALIVE APP CHECK BYPASS V2 - NETWORK INTERCEPTION ===")
    log(f"Proxy: {PROXY}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
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
            
            // Override fetch to detect App Check calls
            const origFetch = window.fetch;
            window.__appCheckCalls = [];
            window.fetch = function() {
                const url = arguments[0]?.url || arguments[0] || '';
                if (typeof url === 'string' && url.includes('firebaseappcheck')) {
                    window.__appCheckCalls.push(url);
                }
                return origFetch.apply(this, arguments);
            };
        """)
        
        page = context.new_page()
        
        # Intercept ALL requests to Firebase App Check
        def handle_route(route):
            url = route.request.url
            method = route.request.method
            
            INTERCEPTED_REQUESTS.append(f"[{method}] {url[:100]}")
            
            # Block or fake App Check calls
            if "firebaseappcheck" in url or "exchangeRecaptcha" in url:
                log(f"  🔴 BLOCKED App Check: {url[:80]}")
                # Return a fake successful response
                route.fulfill(
                    status=200,
                    content_type="application/json",
                    body=json.dumps({"token": "bypassed", "ttl": "86400s"})
                )
                return
            
            # Block reCAPTCHA script loading (might help)
            elif "recaptcha" in url and ("api.js" in url or "render" in url):
                log(f"  🟡 BLOCKED reCAPTCHA: {url[:80]}")
                route.fulfill(
                    status=200,
                    content_type="application/javascript",
                    body=""
                )
                return
            
            route.continue_()
        
        # Apply interception for all URLs
        page.route("**/*", handle_route)
        
        # Listen for console
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        # Load page - try both login and register
        log("Loading tokalive.com/login...")
        try:
            page.goto("https://tokalive.com/login", timeout=30000, wait_until="domcontentloaded")
            log(f"URL after goto: {page.url}")
        except PWTimeout as e:
            log(f"Timeout: {e}")
        
        time.sleep(5)
        
        log(f"Title: {page.title()}")
        
        # Check page state
        has_google_btn = page.evaluate("""() => {
            const buttons = document.querySelectorAll('button, a, div[role="button"]');
            const results = [];
            for (const btn of buttons) {
                const text = (btn.innerText || btn.textContent || '').trim();
                if (text && text.length < 100) {
                    results.push(text);
                }
            }
            return results.slice(0, 20);
        }""")
        
        inputs_info = page.evaluate("""() => {
            const inputs = document.querySelectorAll('input');
            return Array.from(inputs).map(i => ({
                type: i.type,
                placeholder: i.placeholder,
                name: i.name,
                id: i.id
            }));
        }""")
        
        log(f"\nVisible buttons/texts: {json.dumps(has_google_btn, indent=2)}")
        log(f"Inputs: {json.dumps(inputs_info, indent=2)}")
        
        page.screenshot(path="/root/bounty/tokalive/tl_step6_bypass3.png")
        log("Screenshot saved")
        
        # Check for errors and intercepted requests
        errors = [l for l in all_console if l.startswith("[error")]
        warnings = [l for l in all_console if l.startswith("[warning")]
        
        log(f"\nIntercepted routes ({len(INTERCEPTED_REQUESTS)}):")
        for r in INTERCEPTED_REQUESTS[:15]:
            log(f"  {r}")
        
        log(f"\nConsole errors ({len(errors)}):")
        for e in errors[-10:]:
            log(f"  {e}")
        
        if warnings:
            log(f"\nWarnings ({len(warnings)}):")
            for w in warnings[-5:]:
                log(f"  {w}")
        
        # Check if we have inputs now (successful render)
        if len(inputs_info) >= 2:
            log("\n✅ SUCCESS! Firebase Auth rendered without App Check!")
        else:
            log("\n❌ Still blocked. Need different approach.")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
