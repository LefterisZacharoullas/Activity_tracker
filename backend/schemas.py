from pydantic import BaseModel
from datetime import date

class BooksOut(BaseModel):
    id: int
    book_name: str
    last_page: int

    class config:
        orm_mode = True

class ActivitiesOut(BaseModel):
    id: int
    page_read: int | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date
    user_id: int

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    name: str
    surname: str | None = None
    email: str | None = None
    active: bool = True
    class Config:
        orm_mode = True

class BookCreate(BaseModel):
    book_name: str
    last_page: int

class ActivityCreate(BaseModel):
    pages_read: int | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date

class UserCreate(BaseModel):
    name: str
    surname: str | None = None
    email: str | None = None
    active: bool = True
    password: str
    
class User_secret(UserCreate):
    password: str
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None