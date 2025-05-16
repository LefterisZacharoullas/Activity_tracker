from fastapi import FastAPI
from .routes import user, auth, books

app = FastAPI()

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(books.router)

@app.get("/")
def hello():
    return {"status" : "This is my server!!!"}