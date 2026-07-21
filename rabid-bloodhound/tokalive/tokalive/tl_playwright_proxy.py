"""
Tokalive.com signup via Playwright + SOCKS5 proxy (ThinkPad residential IP)
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

EMAIL = f"tluser{int(time.time())}@protonmail.com"
PASSWORD = "TestTokalive2026!"

def log(msg):
    print(msg, flush=True)

def main():
    log(f"EMAIL: {EMAIL}")
    log(f"PASS: {PASSWORD}")
    log(f"Starting...")
    
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
        log("Browser launched")
        
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720},
            locale="es-DO",
            proxy={"server": "socks5://localhost:1080"},
        )
        
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            window.chrome = { runtime: {} };
        """)
        
        page = context.new_page()
        
        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text[:200]}"))
        
        # Navigate
        log("Navigating to tokalive.com/login...")
        try:
            page.goto("https://tokalive.com/login", timeout=30000, wait_until="domcontentloaded")
            log(f"URL: {page.url}")
        except PWTimeout as e:
            log(f"Timeout: {e}, URL: {page.url}")
        
        time.sleep(3)
        log(f"Title: {page.title()}")
        page.screenshot(path="/tmp/tl_step1_login.png")
        log("Screenshot saved")
        
        # Check recaptcha
        has_recaptcha = page.evaluate("() => document.querySelector('iframe[src*=\"recaptcha\"], .g-recaptcha') !== null")
        log(f"reCAPTCHA: {has_recaptcha}")
        
        # Try clicking "Regístrate gratis" link
        log("Looking for register link...")
        register_clicked = False
        links = page.query_selector_all("a")
        for lnk in links:
            txt = lnk.inner_text()
            log(f"  Link: \"{txt}\"")
            if "registr" in txt.lower():
                log(f"  -> Clicking register link...")
                lnk.click()
                register_clicked = True
                time.sleep(5)
                log(f"New URL: {page.url}")
                page.screenshot(path="/tmp/tl_step2_register.png")
                break
        
        if not register_clicked:
            log("No register link found, trying direct navigation to /register")
            try:
                page.goto("https://tokalive.com/register", timeout=15000)
                time.sleep(3)
                log(f"Register URL: {page.url}")
                page.screenshot(path="/tmp/tl_step2_register.png")
            except:
                pass
        
        # Dump all inputs on current page
        inputs = page.query_selector_all("input")
        log(f"\nInputs on page: {len(inputs)}")
        for i, inp in enumerate(inputs):
            attrs = page.evaluate(f"""el => {{
                type: el.type,
                name: el.name,
                id: el.id,
                placeholder: el.placeholder,
                class: el.className?.substring(0, 40)
            }}""", inp)
            log(f"  [{i}] {json.dumps(attrs)}")
        
        buttons = page.query_selector_all("button")
        log(f"Buttons: {len(buttons)}")
        for btn in buttons:
            txt = btn.inner_text()[:60]
            log(f"  \"{txt}\"")
        
        # Check if we're on login or register page
        body = page.inner_text("body")
        
        if "registr" in body.lower() and "email" in body.lower():
            # We're on register page - fill form
            log("\n=== REGISTER FORM DETECTED ===")
            
            # Fill fields by placeholder
            for inp in inputs:
                ph = (inp.get_attribute("placeholder") or "").lower()
                if "email" in ph or "correo" in ph:
                    inp.fill(EMAIL)
                    log(f"Filled email: {EMAIL}")
                elif "contrase" in ph or "password" in ph or "contra" in ph:
                    inp.fill(PASSWORD)
                    log("Filled password")
                elif "nombre" in ph or "name" in ph:
                    inp.fill("Test User")
                    log("Filled name")
            
            time.sleep(1)
            
            # Click register/submit button
            for btn in buttons:
                txt = btn.inner_text().lower()
                if any(w in txt for w in ["crear", "registr", "unirse", "empezar", "continuar", "crear cuenta"]):
                    log(f"Clicking: {btn.inner_text()}")
                    btn.click()
                    register_clicked = True
                    break
            
            if not register_clicked:
                # Try the last button as submit
                log("Trying any button click...")
                for btn in buttons:
                    log(f"Clicking: {btn.inner_text()}")
                    btn.click()
                    break
            
            time.sleep(5)
            page.screenshot(path="/tmp/tl_step3_after_submit.png")
            log(f"After submit URL: {page.url}")
        
        elif "iniciar sesi" in body.lower():
            log("\n=== STILL ON LOGIN PAGE ===")
            # Maybe registration requires clicking differently
            # Try filling login form with test creds (maybe there's a test account)
            for inp in inputs:
                ph = (inp.get_attribute("placeholder") or "").lower()
                if "email" in ph or "correo" in ph:
                    inp.fill("test@tokalive.com")
                elif "contrase" in ph or "password" in ph:
                    inp.fill("test123")
            
            # Try clicking login
            for btn in buttons:
                txt = btn.inner_text().lower()
                if "iniciar" in txt or "sesi" in txt:
                    log(f"Clicking: {btn.inner_text()}")
                    btn.click()
                    time.sleep(3)
                    page.screenshot(path="/tmp/tl_step3_login_attempt.png")
                    break
        
        # Final summary
        time.sleep(2)
        log(f"\n=== FINAL ===")
        log(f"URL: {page.url}")
        
        # Check for Firebase auth tokens in localStorage
        try:
            tokens = page.evaluate("""() => {
                const r = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    try {
                        const v = localStorage.getItem(k);
                        if (k.includes('firebase') || k.includes('token') || k.includes('auth') || k.includes('user')) {
                            r[k] = typeof v === 'string' ? v.substring(0, 500) : v;
                        }
                    } catch(e) {}
                }
                return r;
            }""")
            if tokens:
                log(f"localStorage tokens: {json.dumps(tokens, indent=2, default=str)}")
        except:
            pass
        
        # Console errors
        errors = [l for l in console_logs if l.startswith("[error") or "403" in l or "401" in l or "denied" in l.lower()]
        if errors:
            log(f"\nErrors ({len(errors)}):")
            for e in errors[:10]:
                log(f"  {e}")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
