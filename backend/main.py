from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.review_routes import router
import logging

logging.basicConfig(
    level=logging.INFO
)

app=FastAPI(
    title="PR Guardian API",
    description=(
        "AI powered Git diff code review"
        "using Gemini function calling."
    ),
    version="1.0.0"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET","POST"],
    allow_headers=["Content-Type"],
)

app.include_router(
    router,
    prefix="/api",
    tags=["Code Review"]
    )

@app.get("/health")
def health():
    return {"status":"healthy","application":"PR Guardian"}
