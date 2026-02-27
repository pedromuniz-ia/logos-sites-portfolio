
import requests
import base64
import os
import hashlib

id_key = "0058bc6408802380000000001"
app_key = "K005khqL9oFHatlJ/yX9Qwf5jHQaHxk"
bucket_id = "186b6ca674e098f890c20318"

def authorize():
    auth_string = f"{id_key}:{app_key}"
    base64_auth = base64.b64encode(auth_string.encode()).decode()
    headers = {"Authorization": f"Basic {base64_auth}"}
    r = requests.get("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", headers=headers)
    return r.json()

def get_upload_url(auth_data):
    api_url = auth_data['apiUrl']
    token = auth_data['authorizationToken']
    headers = {"Authorization": token}
    r = requests.post(f"{api_url}/b2api/v2/b2_get_upload_url", headers=headers, json={"bucketId": bucket_id})
    return r.json()

def upload_file(upload_data, local_path, remote_path):
    upload_url = upload_data['uploadUrl']
    upload_token = upload_data['authorizationToken']
    
    with open(local_path, 'rb') as f:
        file_data = f.read()
    
    sha1 = hashlib.sha1(file_data).hexdigest()
    
    headers = {
        "Authorization": upload_token,
        "X-Bz-File-Name": remote_path,
        "Content-Type": "image/webp",
        "X-Bz-Content-Sha1": sha1
    }
    
    r = requests.post(upload_url, headers=headers, data=file_data)
    return r.json()

auth = authorize()
upload_info = get_upload_url(auth)

local_logo = "images/LOGO-LOGOS.webp"
remote_logo = "images/LOGO-LOGOS.webp"

print(f"Uploading {local_logo}...")
res = upload_file(upload_info, local_logo, remote_logo)
print(res)
