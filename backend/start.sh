#!/bin/bash
cd /home/ravi/GTR_MOTORS/backend
/home/ravi/GTR_MOTORS/backend/.venv/bin/uvicorn app.main:app --reload --port 4000
