from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import date

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    surname: str | None = Field(default=None, min_length=1, max_length=128)
    email: EmailStr | None = None
    active: bool = True

    @field_validator('name', 'surname', mode='after')
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        if v is not None and not v.isalpha():
            raise ValueError("Name must contain only letters")
        return v
    
class UserUpdate(BaseModel):
    surname: str | None = Field(default=None, min_length=1, max_length=128)
    email: EmailStr | None = None
    active: bool = True

    @field_validator('surname', mode='after')
    @classmethod
    def validate_name(cls, v: str | None) -> str | None:
        if v is not None and not v.isalpha():
            raise ValueError("Surname must contain only letters")
        return v

class UserOut(UserCreate):
    id: int
    class Config:
        from_attributes = True

class BookCreate(BaseModel):
    book_name: str
    last_page: int

class BooksOut(BookCreate):
    id: int
    class config:
        from_attributes = True

class AuthorCreate(BaseModel):
    author_name: str
    author_surname: str | None = None

class AuthorOut(AuthorCreate):
    id: int
    books: list[BooksOut] | None = None
    class Config:
        from_attributes = True

class ActivityCreate(BaseModel):
    exercise_name: str | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date

class ActivitiesOut(ActivityCreate):
    id: int
    user_id: int
    class Config:
        from_attributes = True

class User_secret(UserCreate):
    password: str
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class ReadingCreate(BaseModel):
    pages_read: int | None
    date: date

class ReadingOut(BaseModel):
    id: int
    user_id: int
    book_id: int
    pages_read: int | None
    status_id: int
    date: date

    class Config:
        from_attributes = True