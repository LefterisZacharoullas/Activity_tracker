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

class ReadingOut(ReadingCreate):
    id: int
    user_id: int
    book_id: int
    status_id: int
    model_config = ConfigDict(from_attributes=True)

class TodoCreate(BaseModel):
    text: str
    date_created: date

class TodoOut(TodoCreate):
    id: int
    user_id: int
    status_id: int
    model_config = ConfigDict(from_attributes=True)

class CleanDict():
    def to_clean_dict(self) -> dict:
        data = self.model_dump()
        for key in data:
            if isinstance(data[key], dict):
                data[key] = {k: v for k, v in data[key].items() if v != 0}
        return data

class Stats_activities(BaseModel, CleanDict):
    total_activities: int = 0
    activities_per_range: dict[int, int] = 0
    avg_reps_per_range: dict[int, float] = 0
    avg_weight_per_range: dict[int, float] = 0
    
class Stats_readings(BaseModel, CleanDict):
    total_readings: int = 0
    pages_read_by_range: dict[int, int] = 0
    
class Stats(BaseModel):
    activities: Stats_activities
    readings: Stats_readings

    def to_clean_dict(self) -> dict:
        return {
            "activities": self.activities.to_clean_dict(),
            "readings": self.readings.to_clean_dict(),
        }