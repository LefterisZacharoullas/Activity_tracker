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

class User_secret(UserOut):
    password: str

# For creating a new book
class BookCreate(BaseModel):
    book_name: str
    last_page: int

# For creating a new activity
class ActivityCreate(BaseModel):
    pages_read: int | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date

# For user registration (input only)
class UserCreate(BaseModel):
    name: str
    surname: str | None = None
    email: str | None = None
    active: bool = True
    password: str