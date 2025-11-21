from fastapi import FastAPI
from app.auth.routes import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FastAPI JWT Auth MongoDB")
origins = [
    "http://localhost:5173",  # ton app React
    "http://127.0.0.1:5173",
    "http://frontend:5173",  # Docker network
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Autoriser POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "API Auth FastAPI + MongoDB + JWT 👋"}
