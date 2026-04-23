import os
import uuid
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from worker import generate_image_task
from celery.result import AsyncResult
from dotenv import load_dotenv

import logging
from fastapi.staticfiles import StaticFiles

load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="OpenVista API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure data directory exists
DATA_PATH = os.getenv("DATA_PATH", "./data")
os.makedirs(DATA_PATH, exist_ok=True)

# Mount static files for generated images
app.mount("/data", StaticFiles(directory=DATA_PATH), name="data")

# Mock database/state for MVP
jobs = {}

class GenerationRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = "distorted, blurry, low quality"
    width: int = 1024
    height: int = 1024
    num_inference_steps: int = 4  # Default for Flux Schnell
    guidance_scale: float = 0.0
    seed: Optional[int] = None

class JobResponse(BaseModel):
    job_id: str
    status: str

@app.get("/")
async def root():
    return {"message": "Welcome to OpenVista API - Cinematic Image Generation Engine"}

@app.post("/generate", response_model=JobResponse)
async def generate_image(request: GenerationRequest):
    job_id = str(uuid.uuid4())
    
    # Dispatch task to Celery
    task = generate_image_task.apply_async(
        args=[job_id, request.prompt, request.width, request.height, request.num_inference_steps, request.guidance_scale],
        task_id=job_id
    )
    
    return JobResponse(job_id=job_id, status="pending")

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    res = AsyncResult(job_id)
    if res.ready():
        return res.result
    return {"status": "pending"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
