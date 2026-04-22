import os
import httpx

class PromptEnhancer:
    def __init__(self):
        self.api_url = os.getenv("LLM_API_URL") # e.g. Ollama or Groq
        self.api_key = os.getenv("LLM_API_KEY")

    def enhance(self, raw_prompt: str) -> str:
        # For MVP, we use a template if no LLM is configured
        if not self.api_url:
            cinematic_suffixes = [
                "cinematic lighting", "high fidelity", "detailed textures", 
                "8k resolution", "masterpiece", "highly detailed", 
                "volumetric rays", "photorealistic"
            ]
            return f"{raw_prompt}, " + ", ".join(cinematic_suffixes)
        
        # Real LLM call would happen here
        # payload = {"model": "llama3", "prompt": f"Rewrite this prompt for image generation: {raw_prompt}"}
        # ...
        return raw_prompt

enhancer = PromptEnhancer()
