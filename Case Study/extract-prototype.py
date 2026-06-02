#!/usr/bin/env python3
"""
Run this once to extract the prototype HTML and images.
Usage: python3 extract-prototype.py
"""
import base64, re, os

script_dir = os.path.dirname(os.path.abspath(__file__))

# Look for the original standalone (with the embedded blob) in Downloads
source_candidates = [
    os.path.join(script_dir, 'ai-native-communication-standalone2.html'),
    os.path.expanduser('~/Downloads/ai-native-communication-standalone2.html'),
]

source = None
for path in source_candidates:
    if os.path.exists(path):
        data = open(path, 'r').read()
        if '_protoB64' in data:
            source = path
            break

if not source:
    print("Error: could not find the original standalone file with the embedded prototype.")
    print("Make sure ai-native-communication-standalone2.html (original, 7MB) is in this")
    print("folder or in your Downloads folder.")
    exit(1)

print(f"Reading from: {source}")
data = open(source, 'r').read()

match = re.search(r'const _protoB64 = "([^"]+)";', data)
if not match:
    print("Error: no embedded prototype blob found.")
    exit(1)

print("Decoding prototype...")
decoded = base64.b64decode(match.group(1)).decode('utf-8')

# Extract and save images
images_dir = os.path.join(script_dir, 'images')
os.makedirs(images_dir, exist_ok=True)

names = ['ai-comms-network', 'ai-comms-personal-agent', 'ai-comms-agent-to-agent']
class_to_file = {
    'slide-image-full-delegation': 'images/ai-comms-network.png',
    'slide-image-personal': 'images/ai-comms-personal-agent.png',
    'slide-image-agent-atoa': 'images/ai-comms-agent-to-agent.png',
}

img_matches = list(re.finditer(r'data:(image/\w+);base64,([A-Za-z0-9+/=\n]+?)(?=")', decoded))
print(f"Found {len(img_matches)} images")

for i, m in enumerate(img_matches):
    mime = m.group(1)
    b64 = m.group(2).replace('\n', '').strip()
    ext = 'jpg' if 'jpeg' in mime else mime.split('/')[1]
    name = names[i] if i < len(names) else f'image-{i+1}'
    path = os.path.join(images_dir, f'{name}.{ext}')
    img_data = base64.b64decode(b64)
    with open(path, 'wb') as f:
        f.write(img_data)
    print(f"  Saved: images/{name}.{ext} ({len(img_data):,} bytes)")

# Replace base64 img srcs with file references in prototype
def replace_img(m):
    tag = m.group(0)
    cm = re.search(r'class="([^"]+)"', tag)
    if not cm: return tag
    for cls, fp in class_to_file.items():
        if cls in cm.group(1).split():
            return re.sub(r'src="data:image/[^"]*"', f'src="{fp}"', tag)
    return tag

proto_clean = re.sub(r'<img[^>]+src="data:image[^"]*"[^>]*>', replace_img, decoded, flags=re.DOTALL)
proto_path = os.path.join(script_dir, 'ai-native-prototype.html')
with open(proto_path, 'w') as f:
    f.write(proto_clean)
size_kb = os.path.getsize(proto_path) // 1024
print(f"\nSaved: ai-native-prototype.html ({size_kb} KB)")
print("\nDone! Open ai-native-communication-standalone2.html")
print("and the 'View prototype' button on slide 7 will work.")
