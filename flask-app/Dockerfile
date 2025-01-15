# Use the Python slim base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /flask_app

# Install system dependencies required for building Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port Flask runs on
EXPOSE 5000
# For production use gunicorn for performance.
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]

