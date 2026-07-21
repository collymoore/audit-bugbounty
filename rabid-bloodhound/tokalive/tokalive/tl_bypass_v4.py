"""
Tokalive.com — App Check bypass v4: Clear storage, intercept exchange exactly
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE BYPASS V4 - FRESH STORAGE + EXACT INTERCEPT ===")
    
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
            # Clear ALL storage by not accepting any persistence
            storage_state=None,
        )
        
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['es-DO', 'es', 'en-US'] });
            window.chrome = { runtime: {} };
        """)
        
        page = context.new_page()
        
        appcheck_calls = []
        
        # Precisely intercept the Firebase App Check exchange endpoint
        async def handle_appcheck(route):
            url = route.request.url
            log(f"  📡 INTERCEPTED: {url[:150]}")
            appcheck_calls.append(url)
            
            # Return successful App Check response
            route.fulfill(
                status=200,
                content_type="application/json; charset=UTF-8",
                body=json.dumps({
                    "token": "bypassed",
                    "ttl": "86400s",
                    "refreshTime": "2026-07-15T11:44:00.000Z"
                })
            )
        
        # Catch ALL potential App Check / Firebase token endpoints
        page.route("**/firebaseappcheck*/**", handle_appcheck)
        page.route("**/app:exchange*", handle_appcheck)
        page.route("**/v1/projects/*/app*", handle_appcheck)
        
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        # Navigate to signup page directly
        log("Navigating to /signup...")
        try:
            page.goto("https://tokalive.com/signup", timeout=30000, wait_until="networkidle")
            log(f"URL: {page.url}")
        except PWTimeout as e:
            log(f"Timeout: {e}")
            log(f"URL: {page.url}")
        
        time.sleep(5)
        
        inputs_info = page.evaluate("""() => {
            const inputs = document.querySelectorAll('input');
            return Array.from(inputs).map(i => ({
                type: i.type,
                placeholder: i.placeholder,
                name: i.name,
                id: i.id,
                className: (i.className || '').substring(0, 40)
            }));
        }""")
        
        buttons_info = page.evaluate("""() => {
            return Array.from(document.querySelectorAll('button')).map(b => ({
                text: (b.innerText || '').trim().substring(0, 60),
                type: b.type || '',
                className: (b.className || '').substring(0, 40)
            }));
        }""")
        
        # Full body text
        body_text = page.inner_text("body")[:1500]
        log(f"\nBody:\n{body_text}")
        log(f"\nInputs: {json.dumps(inputs_info, indent=2)}")
        log(f"\nButtons: {json.dumps(buttons_info, indent=2)}")
        
        page.screenshot(path="/root/bounty/tokalive/tl_step8_signup.png")
        log("Screenshot saved")
        
        errors = [l for l in all_console if l.startswith("[error")]
        warnings = [l for l in all_console if l.startswith("[warning")]
        
        log(f"\nApp Check calls intercepted: {len(appcheck_calls)}")
        log(f"\nErrors: {len(errors)}")
        for e in errors[-10:]: log(f"  {e}")
        log(f"\nWarnings: {len(warnings)}")
        for w in warnings[-10:]: log(f"  {w}")
        
        # If we have inputs and a signup form, try to fill it
        if len(inputs_info) >= 2:
            log("\n✅ Signup form rendered!")
            
            test_email = f"tluser{int(time.time())}@protonmail.com"
            
            for inp in page.query_selector_all("input"):
                ph = (inp.get_attribute("placeholder") or "").lower()
                tp = inp.get_attribute("type") or ""
                
                if "email" in ph or "correo" in ph or tp == "email":
                    inp.fill(test_email)
                    log(f"Filled email: {test_email}")
                elif tp == "password" or "contrase" in ph or "contra" in ph:
                    inp.fill("TestPass2026!")
                    log("Filled password")
                elif "nombre" in ph or "name" in ph:
                    inp.fill("Test User")
                    log("Filled name")
            
            time.sleep(1)
            
            # Click signup button
            for btn in page.query_selector_all("button"):
                txt = btn.inner_text().lower()
                log(f"  Button: '{btn.inner_text()}'")
                if any(w in txt for w in ["crear", "registr", "empezar", "unirse", "crear cuenta"]):
                    log(f"Clicking: {btn.inner_text()}")
                    btn.click()
                    time.sleep(5)
                    break
            else:
                # Try last button as submit
                buttons = page.query_selector_all("button")
                if buttons:
                    log(f"Clicking last button: {buttons[-1].inner_text()}")
                    buttons[-1].click()
                    time.sleep(5)
            
            # Check result
            log(f"\nPost-submit URL: {page.url}")
            page.screenshot(path="/root/bounty/tokalive/tl_step9_submit.png")
            
            # Look for tokens
            tokens = page.evaluate("""() => {
                const r = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    try {
                        const v = localStorage.getItem(k);
                        if (k.includes('firebase') || k.includes('auth') || k.includes('user') || k.includes('token')) {
                            r[k] = typeof v === 'string' ? v.substring(0, 200) : v;
                        }
                    } catch(e) {}
                }
                return r;
            }""")
            if tokens:
                log(f"\nTokens: {json.dumps(tokens, indent=2, default=str)}")
            
            # Check if we got a user
            firebase_state = page.evaluate("""() => {
                try {
                    return {
                        local: Object.keys(localStorage).filter(k => k.includes('firebase')),
                        session: Object.keys(sessionStorage).filter(k => k.includes('firebase')),
                    };
                } catch(e) { return {error: e.message}; }
            }""")
            log(f"\nFirebase state: {json.dumps(firebase_state, indent=2, default=str)}")
        
        else:
            log("\n❌ No signup form rendered.")
            
            # Try clicking the login form's register link
            page.goto("https://tokalive.com/login", timeout=15000)
            time.sleep(3)
            
            # Find and click "Regístrate gratis"
            for lnk in page.query_selector_all("a"):
                txt = lnk.inner_text()
                if "registr" in txt.lower():
                    log(f"Clicking: {txt}")
                    lnk.click()
                    time.sleep(5)
                    log(f"New URL: {page.url}")
                    page.screenshot(path="/root/bounty/tokalive/tl_step10_post_click.png")
                    
                    # Check inputs again
                    inputs2 = page.evaluate("""() => {
                        const inputs = document.querySelectorAll('input');
                        return Array.from(inputs).map(i => ({
                            type: i.type,
                            placeholder: i.placeholder,
                            name: i.name,
                            id: i.id
                        }));
                    }""")
                    log(f"New inputs: {json.dumps(inputs2, indent=2)}")
                    break
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
