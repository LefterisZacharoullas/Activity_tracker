from pydantic import BaseModel
from datetime import date

class Books(BaseModel):
    id: int
    book_name: str
    last_page: int

    class config:
        orm_mode = True

class Activities(BaseModel):
    id: int
    page_read: int | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date
    user_id: int

    class Config:
        orm_mode = True

class User_info(BaseModel):
    id: int
    name: str
    surname: str | None = None
    email: str | None = None
    active: bool = True
    books: list[Books] = []
    activities: list[Activities] = []

    class Config:
        orm_mode = True

class User_secret(User_info):
    password: str