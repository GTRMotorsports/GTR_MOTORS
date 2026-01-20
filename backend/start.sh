#!/bin/bash

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check if .venv exists, if not create it
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
    
    echo "Installing dependencies..."
    ./.venv/bin/pip install -r requirements.txt
fi

# Run the server
echo "Starting backend server on port 4000..."
./.venv/bin/uvicorn app.main:app --reload --port 4000
