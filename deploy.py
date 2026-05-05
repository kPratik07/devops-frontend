import boto3
import os
import mimetypes

# --- YOUR BUCKET NAME ---
BUCKET_NAME = 'frontend-web-project' 

s3 = boto3.client('s3')

def upload_site():
    print(f"🚀 Starting deployment to: {BUCKET_NAME}")
    
    for root, dirs, files in os.walk('.'):
        for file in files:
            # Skip system files and the script itself
            if file == 'deploy.py' or '.git' in root or '.github' in root:
                continue
                
            local_path = os.path.join(root, file)
            s3_path = os.path.relpath(local_path, '.')

            # Identify if it's HTML, CSS, or JS so the browser renders it correctly
            content_type, _ = mimetypes.guess_type(local_path)
            
            print(f"  Uploading {s3_path}...")
            s3.upload_file(
                local_path, 
                BUCKET_NAME, 
                s3_path,
                ExtraArgs={'ContentType': content_type or 'text/plain'}
            )

    print("\n✅ Success! Your website is now live.")

if __name__ == "__main__":
    upload_site()