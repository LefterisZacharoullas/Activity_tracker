from pydantic import BaseModel, EmailStr, field_validator
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

class AuthorOut(BaseModel):
    id: int
    author_name: str
    author_surname: str | None = None

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    name: str
    surname: str | None = None
    email: EmailStr | None = None
    active: bool = True
    class Config:
        orm_mode = True

class AuthorCreate(BaseModel):
    author_name: str
    author_surname: str | None = None

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