from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import date

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=128, pattern=r'^[a-zA-Z0-9]*$')
    surname: str | None = Field(
        default=None,
        min_length=1, 
        max_length=128, 
        pattern=r'^[a-zA-Z]*$'
    )
    email: EmailStr | None = None
    active: bool = True
    
class UserUpdate(BaseModel):
    surname: str | None = Field(
        default=None, 
        min_length=1, 
        max_length=128, 
        pattern=r'^[a-zA-Z0-9]*$'
    )
    email: EmailStr | None = None
    active: bool = True

class UserOut(UserCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BookCreate(BaseModel):
    book_name: str = Field(min_length=1, max_length=128,)
    last_page: int

class BooksOut(BookCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AuthorCreate(BaseModel):
    author_name: str = Field(min_length=1, max_length=128, pattern=r'^[a-zA-Z]*$')
    author_surname: str | None = Field(
        default= None, 
        min_length=1, 
        max_length=128, 
        pattern=r'^[a-zA-Z]*$'
    )

class AuthorOut(AuthorCreate):
    id: int
    books: list[BooksOut] | None = None
    model_config = ConfigDict(from_attributes=True)

class ActivityCreate(BaseModel):
    exercise_name: str | None = None
    exercise_weight: int | None = None
    exercise_reps: int | None = None
    date: date

class ActivitiesOut(ActivityCreate):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

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
    model_config = ConfigDict(from_attributes=True)