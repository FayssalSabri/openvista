import torch
import os
from diffusers import FluxPipeline
from PIL import Image

class ImageGenerator:
    def __init__(self, model_id=None):
        self.model_id = model_id or os.getenv("FLUX_MODEL_ID", "black-forest-labs/FLUX.1-schnell")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pipe = None
        
        print(f"Initializing ImageGenerator on {self.device}")

    def load_model(self):
        if self.pipe is None:
            if not os.getenv("HF_TOKEN") and self.device == "cpu":
                print("WARNING: No HF_TOKEN found and running on CPU. Flux models are gated and heavy.")
            
            print(f"Loading model: {self.model_id}...")
            # Use float16 for GPU, float32 for CPU
            dtype = torch.bfloat16 if self.device == "cuda" else torch.float32
            
            try:
                self.pipe = FluxPipeline.from_pretrained(
                    self.model_id, 
                    torch_dtype=dtype
                ).to(self.device)
                print("Model loaded successfully.")
            except Exception as e:
                print(f"Error loading model: {e}")
                raise e

    def generate(self, prompt: str, width=1024, height=1024, num_steps=4, guidance_scale=0.0):
        if self.pipe is None:
            self.load_model()
        
        print(f"Generating image for prompt: '{prompt}'")
        image = self.pipe(
            prompt,
            width=width,
            height=height,
            num_inference_steps=num_steps,
            guidance_scale=guidance_scale,
        ).images[0]
        
        return image

# Singleton instance
generator = ImageGenerator()
