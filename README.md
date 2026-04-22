# OpenVista 🌌

OpenVista is an AI-powered image generation platform designed for scalability and performance. It features a Next.js frontend, a FastAPI backend, and a worker-based architecture for handling heavy inference tasks.

## Project Architecture

The repository is structured as a monorepo:

- **`/frontend`**: Next.js application providing the user interface.
- **`/backend`**: FastAPI service handling requests and task orchestration.
- **`/models`**: Local storage for AI weights.
- **`/data`**: Local storage for generated outputs and datasets.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, Lucide Icons.
- **Backend**: Python 3.10+, FastAPI, Redis (Queue management).
- **Inference**: PyTorch, HuggingFace Diffusers (FLUX/SDXL).
- **Deployment**: Docker & Docker Compose.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.10+ (for local development)
- Node.js 18+ (for local development)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/FayssalSabri/OpenVista.git
   cd OpenVista
   ```

2. **Configure Environment Variables**:
   Copy the example environment file and update it with your settings:
   ```bash
   cp .env.example .env
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

## License

[MIT License](LICENSE)
