from fastapi import FastAPI
from .routes import user

app = FastAPI()

app.include_router(user.router)

@app.get("/")
def hello():
    return {"status" : "this is my server)"}