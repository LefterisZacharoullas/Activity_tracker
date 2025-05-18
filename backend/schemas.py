from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from enum import Enum

class BooksOut(BaseModel):
    id: int
    book_name: str
    last_page: int

    class config:
        from_attributes = True

class ActivitiesOut(BaseModel):
    id: int
    exercise_name: str | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date
    user_id: int

    class Config:
        from_attributes = True

class AuthorOut(BaseModel):
    id: int
    author_name: str
    author_surname: str | None = None
    books: list[BooksOut] | None = None

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    name: str
    surname: str | None = None
    email: EmailStr | None = None
    active: bool = True
    class Config:
        from_attributes = True

class AuthorCreate(BaseModel):
    author_name: str
    author_surname: str | None = None

class BookCreate(BaseModel):
    book_name: str
    last_page: int

class ActivityCreate(BaseModel):
    exercise_name: str | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date

class UserCreate(BaseModel):
    name: str
    surname: str | None = None
    email: EmailStr | None = None
    active: bool = True

    @field_validator('name', 'surname', mode='after')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.isalpha():
            raise ValueError("Name must contain only letters")
        return v
    
class UserUpdate(BaseModel):
    surname: str | None = None
    email: EmailStr | None = None
    active: bool = True

    @field_validator('surname', mode='after')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.isalpha():
            raise ValueError("Name must contain only letters")
        return v

class User_secret(UserCreate):
    password: str
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class Status(str, Enum):
    not_started = "Not Started"
    in_progress = "In Progress"
    completed = "Completed"

class ReadingCreate(BaseModel):
    book_name: str 
    pages_read: int | None
    status: Status
    date: date

class ReadingOut(BaseModel):
    user_id: int
    book_id: int
    pages_read: int | None
    status_id: int
    date: date

    class Config:
        from_attributes = True