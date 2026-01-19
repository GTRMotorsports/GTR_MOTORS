# GTR Motors FastAPI Backend

This is the backend server for the GTR Motors e-commerce platform.

## Setup

1. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run server:
```bash
./start.sh
# Or manually: uvicorn app.main:app --reload --port 4000
```

Server runs on http://localhost:4000

## Features
- Product catalog with search/filter/sort
- Order management with quantity tracking
- Razorpay payment integration
- SQLite database with SQLAlchemy ORM
- CORS enabled for frontend
