"""
Main FastAPI Application Entry Point
Initializes the FastAPI app, connects to MongoDB, and registers all route routers.
"""

from fastapi import FastAPI

try:
    from backend.routes import user, auth, document, chat
except ModuleNotFoundError:
    from routes import user, auth, document, chat

app = FastAPI(title="Enterprise Knowledge Automation API", version="1.0.0")


@app.get("/")
def home():
    """
    Health check endpoint.
    Returns basic API status.
    """
    return {"message": "Backend Running"}


# Register all route routers
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(document.router)
app.include_router(chat.router)