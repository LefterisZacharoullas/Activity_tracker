from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from ..database import get_db
from ..models import Users
from ..schemas import User_secret, UserCreate, Token
from ..security import get_password_hash, authenticate_user, create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.name})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model= UserCreate)
async def create_user(user: User_secret, db: Session = Depends(get_db)):
    stmt = select(Users).where(Users.name == user.name)
    username = db.scalars(stmt).one_or_none()
    if username:
        raise HTTPException(
            status_code=400,
            detail="User already registered"
        )
    
    user.password = get_password_hash(user.password)
    db_user = Users(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user