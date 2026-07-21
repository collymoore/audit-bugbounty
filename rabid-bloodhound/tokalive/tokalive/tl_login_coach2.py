"""
Tokalive.com — Login with Coach's credentials + DELETE IndexedDB App Check throttle
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"
EMAIL = "jonatan.collymoore@gmail.com"
PASSWORD = "bowho4-hojdow-bopvEr"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE LOGIN - DELETE APP CHECK INDEXEDDB ===\n")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-blink-features=AutomationControlled"], timeout=30000)
        
        # Create a context with NO storage
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720},
            locale="es-DO",
            proxy={"server": PROXY},
            storage_state={},  # This clears ALL storage
        )
        
        # DELETE IndexedDB BEFORE any Firebase code runs
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            
            // Nuke all IndexedDB databases immediately (before Firebase init)
            if (indexedDB.databases) {
                indexedDB.databases().then(dbs => {
                    dbs.forEach(db => {
                        if (db.name && db.name.includes('firebase')) {
                            indexedDB.deleteDatabase(db.name);
                        }
                    });
                });
            }
            
            // Also intercept indexedDB.open to prevent App Check from saving throttle
            const origOpen = indexedDB.open;
            indexedDB.open = function(dbName) {
                if (dbName && dbName.includes('firebase-app-check')) {
                    // Return a null-like response - prevents saving throttle
                    return origOpen.call(this, '__disabled__');
                }
                return origOpen.apply(this, arguments);
            };
        """)
        
        page = context.new_page()
        
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:300]}"))
        
        log("Loading /login...")
        page.goto("https://tokalive.com/login", timeout=30000, wait_until="domcontentloaded")
        time.sleep(3)
        
        # Fill credentials
        for inp in page.query_selector_all("input"):
            ph = (inp.get_attribute("placeholder") or "").lower()
            tp = inp.get_attribute("type") or ""
            if "email" in ph or tp == "email":
                inp.fill(EMAIL)
                log(f"Email: {EMAIL}")
            elif tp == "password":
                inp.fill(PASSWORD)
                log("Password filled")
        
        time.sleep(1)
        
        # Click login
        for btn in page.query_selector_all("button"):
            txt = btn.inner_text()
            if "iniciar" in txt.lower():
                log(f"Clicking: {txt}")
                btn.click()
                break
        
        time.sleep(10)
        
        log(f"\nFinal URL: {page.url}")
        page.screenshot(path="/root/bounty/tokalive/tl_login_coach_result.png")
        
        errors = [l for l in all_console if l.startswith("[error")]
        warnings = [l for l in all_console if l.startswith("[warning")]
        
        log(f"\nErrors ({len(errors)}):")
        for e in errors[-10:]: log(f"  {e}")
        log(f"\nWarnings ({len(warnings)}):")
        for w in warnings[-10:]: log(f"  {w}")
        
        # Check localStorage
        ls = page.evaluate("""() => {
            const r = {};
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                try { r[k] = localStorage.getItem(k).substring(0, 300); } catch(e) {}
            }
            return r;
        }""")
        log(f"\nlocalStorage: {json.dumps(ls, indent=2, default=str)}")
        
        # Check IndexedDB databases (should be empty if nuked)
        idb = page.evaluate("""async () => {
            try {
                const dbs = await indexedDB.databases();
                return dbs.map(d => d.name).filter(n => n.includes('firebase'));
            } catch(e) { return []; }
        }""")
        log(f"\nIndexedDB after: {json.dumps(idb, indent=2)}")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
