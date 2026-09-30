import os
import urllib.request
import zipfile
import shutil

url = "https://nodejs.org/dist/v22.12.0/node-v22.12.0-win-x64.zip"
zip_path = "node.zip"
extract_path = "node_temp"
target_path = ".node"

try:
    print("Downloading Node.js v22.12.0...")
    urllib.request.urlretrieve(url, zip_path)
    print("Extracting Node.js...")
    
    if os.path.exists(extract_path):
        shutil.rmtree(extract_path)
        
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)
        
    src_dir = os.path.join(extract_path, "node-v22.12.0-win-x64")
    if os.path.exists(target_path):
        shutil.rmtree(target_path)
        
    shutil.move(src_dir, target_path)
    
    # Cleanup
    shutil.rmtree(extract_path)
    os.remove(zip_path)
    print("Node.js portable setup completed successfully!")
except Exception as e:
    print(f"Error occurred during Node.js setup: {e}")
