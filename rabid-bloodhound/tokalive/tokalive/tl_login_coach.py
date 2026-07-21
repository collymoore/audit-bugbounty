"""
Tokalive.com — Login with Coach's credentials, extract Firebase Auth token
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"
EMAIL = "jonatan.collymoore@gmail.com"
PASSWORD = "bowho4-hojdow-bopvEr"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE LOGIN WITH COACH CREDENTIALS ===")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-blink-features=AutomationControlled"], timeout=30000)
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
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        # Navigate to login
        log("Loading /login...")
        page.goto("https://tokalive.com/login", timeout=30000, wait_until="domcontentloaded")
        time.sleep(3)
        
        # Fill email and password
        for inp in page.query_selector_all("input"):
            ph = (inp.get_attribute("placeholder") or "").lower()
            tp = inp.get_attribute("type") or ""
            if "email" in ph or tp == "email":
                inp.fill(EMAIL)
                log(f"Email filled: {EMAIL}")
            elif tp == "password":
                inp.fill(PASSWORD)
                log("Password filled")
        
        time.sleep(1)
        
        # Click login button
        for btn in page.query_selector_all("button"):
            txt = btn.inner_text()
            log(f"  Button: '{txt[:50]}'")
            if "iniciar" in txt.lower() or "sesi" in txt.lower():
                log(f"Clicking: {txt}")
                btn.click()
                break
        
        time.sleep(8)
        
        log(f"Post-login URL: {page.url}")
        page.screenshot(path="/root/bounty/tokalive/tl_login_result.png")
        
        errors = [l for l in all_console if l.startswith("[error")]
        warnings = [l for l in all_console if l.startswith("[warning")]
        log(f"\nErrors: {len(errors)}")
        for e in errors[-5:]: log(f"  {e}")
        log(f"Warnings: {len(warnings)}")
        for w in warnings[-5:]: log(f"  {w}")
        
        # CRITICAL: Extract Firebase Auth tokens from localStorage
        tokens = page.evaluate("""() => {
            const r = {};
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                try {
                    const v = localStorage.getItem(k);
                    r[k] = typeof v === 'string' ? v.substring(0, 500) : v;
                } catch(e) {}
            }
            return r;
        }""")
        
        log(f"\n=== ALL LOCALSTORAGE ===")
        log(json.dumps(tokens, indent=2, default=str))
        
        # Also check sessionStorage
        session_data = page.evaluate("""() => {
            const r = {};
            for (let i = 0; i < sessionStorage.length; i++) {
                const k = sessionStorage.key(i);
                try {
                    const v = sessionStorage.getItem(k);
                    r[k] = typeof v === 'string' ? v.substring(0, 300) : v;
                } catch(e) {}
            }
            return r;
        }""")
        log(f"\n=== SESSIONSTORAGE ===")
        log(json.dumps(session_data, indent=2, default=str))
        
        # Try to access Firebase Auth currentUser
        fb_state = page.evaluate("""async () => {
            try {
                // Firebase v9 modular SDK - need to check from the app's module scope
                // Try accessing the internal Firebase instance
                const result = {};
                
                // Check if there's an IndexedDB with Firebase data
                result.indexedDB = await new Promise((resolve, reject) => {
                    const req = indexedDB.databases ? indexedDB.databases() : Promise.resolve([]);
                    if (req.then) {
                        req.then(dbs => {
                            resolve(dbs.map(d => d.name).filter(n => n.includes('firebase')));
                        }).catch(e => resolve(['error: ' + e.message]));
                    }
                });
                
                return result;
            } catch(e) {
                return {error: e.message};
            }
        }""")
        log(f"\n=== INDEXEDDB ===")
        log(json.dumps(fb_state, indent=2, default=str))
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
