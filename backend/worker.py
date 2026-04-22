import os
import time
import io
from celery import Celery
from pipeline import generator
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
DATA_PATH = os.getenv("DATA_PATH", "./data")

celery = Celery("openvista", broker=REDIS_URL, backend=REDIS_URL)

@celery.task(name="generate_image_task")
def generate_image_task(job_id, prompt, width, height, num_steps, guidance_scale):
    print(f"Starting job {job_id} for prompt: {prompt}")
    
    try:
        # Check if we are in mock mode (e.g. no GPU/CPU too slow)
        if os.getenv("MOCK_WORKER", "false").lower() == "true":
            time.sleep(5)
            # Create a placeholder image
            img = Image.new('RGB', (width, height), color = (73, 109, 137))
        else:
            img = generator.generate(
                prompt=prompt,
                width=width,
                height=height,
                num_steps=num_steps,
                guidance_scale=guidance_scale
            )
        
        # Save image
        os.makedirs(DATA_PATH, exist_ok=True)
        img_path = os.path.join(DATA_PATH, f"{job_id}.png")
        img.save(img_path)
        
        return {"status": "completed", "url": f"/data/{job_id}.png"}
        
    except Exception as e:
        print(f"Job {job_id} failed: {e}")
        return {"status": "failed", "error": str(e)}
