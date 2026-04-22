#!/bin/bash

echo "🚀 Starting OpenVista Colab Bootstrap..."

# 1. Update and install system dependencies
echo "📦 Installing system dependencies (Redis, nodejs)..."
apt-get update -q -y
apt-get install -q -y redis-server curl
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -q -y nodejs

# 2. Start Redis in the background
echo "🔄 Starting Redis Server..."
redis-server --daemonize yes

# 3. Install Python dependencies
echo "🐍 Installing Python dependencies..."
# Ensure we use the correct pip for the current python
python3 -m pip install --upgrade pip
python3 -m pip install -q -r backend/requirements.txt
python3 -m pip install -q fastapi uvicorn celery redis python-dotenv diffusers transformers accelerate pyngrok nest-asyncio

# 4. Install Frontend dependencies
# Use --legacy-peer-deps to avoid common npm resolution issues in Colab
echo "⚛️ Installing Frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

# 5. Create local directories
echo "📁 Creating data and models directories..."
mkdir -p data models

echo "✅ Bootstrap complete! Ready to run OpenVista."
