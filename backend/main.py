from fastapi import FastAPI
from .routes import user, auth, books
from fastapi import FastAPI
from starlette.config import Config
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from .utils import limiter

config = Config(".env")

ENVIRONMENT = config("ENVIRONMENT")
SHOW_DOCS_ENVIRONMENT = ("local", "staging")

app_configs = {"title": "My Cool API"}
if ENVIRONMENT not in SHOW_DOCS_ENVIRONMENT:
   app_configs["openapi_url"] = None

app = FastAPI(**app_configs)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(books.router)

@app.get("/")
def hello():
    return {"status" : "This is my server!!!"}