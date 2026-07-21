"""
Tokalive.com — Find exact App Check URL via network logging
"""
import json, sys, time
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

PROXY = "socks5://localhost:1080"

def log(msg):
    print(msg, flush=True)

def main():
    log("=== TOKALIVE - NETWORK LOGGING FOR APP CHECK URL ===")
    
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
        
        # Log ALL network requests
        def log_request(req):
            url = req.url
            method = req.method
            # Only show firebase/google related or API calls
            if any(d in url for d in ["googleapis", "firebase", "recaptcha", "gstatic"]):
                log(f"  📡 [{method}] {url[:150]}")
        
        page.on("request", log_request)
        
        all_console = []
        page.on("console", lambda msg: all_console.append(f"[{msg.type}] {msg.text[:200]}"))
        
        log("Loading /signup...")
        page.goto("https://tokalive.com/signup", timeout=30000, wait_until="networkidle")
        time.sleep(5)
        
        log(f"\n=== ERRORS/WARNINGS ===")
        for l in all_console:
            if l.startswith("[error]") or l.startswith("[warning]"):
                log(f"  {l}")
        
        log(f"\n=== PAGE STATE ===")
        inputs = page.query_selector_all("input")
        log(f"Inputs: {len(inputs)}")
        
        # Try to click submit to trigger App Check
        log("\nClicking submit to trigger App Check...")
        for btn in page.query_selector_all("button"):
            txt = btn.inner_text()
            if "registr" in txt.lower():
                btn.click()
                break
        
        time.sleep(5)
        
        log("\n=== NETWORK AFTER SUBMIT ===")
        # Check console after submit
        for l in all_console[-20:]:
            log(f"  {l}")
        
        browser.close()
        log("\n=== DONE ===")

if __name__ == "__main__":
    main()
