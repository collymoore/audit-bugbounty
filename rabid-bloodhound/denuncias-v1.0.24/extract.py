import re

with open('assets/www/main.4555bc91ef888d096efd.js','r',errors='ignore') as f:
    content = f.read()

# Find environment/config objects
for m in re.finditer(r'environment\w*\s*=\s*\{[^}]+apiKey[^}]+\}', content, re.IGNORECASE):
    print('=== ENVIRONMENT CONFIG ===')
    print(m.group()[:600])
    print()

# Denuncias-related objects
for m in re.finditer(r'denuncias[^}\"]{20,200}\}', content):
    print('=== DENUNCIAS OBJECT ===')
    print(m.group()[:500])
    print()

# UUIDs (OneSignal, etc)
for m in re.finditer(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', content):
    print(f'UUID: {m.group()}')

# Firebase project IDs
for m in re.finditer(r'projectId["\':=]+\s*["\']([a-zA-Z0-9_-]+)["\']', content):
    print(f'Project ID: {m.group(1)}')

# Firebase sender IDs
for m in re.finditer(r'messagingSenderId["\':=]+\s*["\'](\d+)["\']', content):
    print(f'Sender ID: {m.group(1)}')

# Storage buckets
for m in re.finditer(r'storageBucket["\':=]+\s*["\']([^"\']+)["\']', content):
    print(f'Bucket: {m.group(1)}')

# App IDs
for m in re.finditer(r'appId["\':=]+\s*["\']([^"\']+)["\']', content):
    print(f'App ID: {m.group(1)}')

# OneSignal app IDs
for m in re.finditer(r'oneSignalAppId["\':=]+\s*["\']([^"\']+)["\']', content):
    print(f'OneSignal ID: {m.group(1)}')

# Additional API keys patterns
for m in re.finditer(r'["\']apiKey["\']\s*[:=]\s*["\']([^"\']+)["\']', content):
    print(f'apiKey value: {m.group(1)}')

for m in re.finditer(r'["\']authDomain["\']\s*[:=]\s*["\']([^"\']+)["\']', content):
    print(f'authDomain: {m.group(1)}')

for m in re.finditer(r'["\']databaseURL["\']\s*[:=]\s*["\']([^"\']+)["\']', content):
    print(f'databaseURL: {m.group(1)}')

print()
print('=== ALL API ENDPOINTS ===')
for m in re.finditer(r'https?://[a-zA-Z0-9./_:%-]{10,80}', content):
    url = m.group()
    if any(s in url for s in ['policia', 'denuncias', 'gob.do', 'api']):
        print(url)

print()
print('=== ALL URL PATHS (API-like) ===')
paths = set()
for m in re.finditer(r'["\'](/[a-zA-Z][a-zA-Z0-9/_-]{3,60})["\']', content):
    path = m.group(1)
    paths.add(path)
for p in sorted(paths):
    print(p)
