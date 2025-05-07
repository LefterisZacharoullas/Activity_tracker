from pydantic import BaseModel

class UserOut(BaseModel):
    id: int
    name: str
    surname: str
    email: str
    active: bool = True

    class Config:
        orm_mode = True

class User_secret(UserOut):
    password: str