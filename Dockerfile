FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend ./backend
COPY scripts ./scripts
COPY data ./data
COPY evaluation ./evaluation

# Generate synthetic dataset and seed DB on container startup
RUN python scripts/generate_data.py && \
    python scripts/clean_data.py && \
    python scripts/seed_database.py && \
    python scripts/run_evaluation.py

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
