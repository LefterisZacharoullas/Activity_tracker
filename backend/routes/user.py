from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Users, Activities, Books
from ..schemas import UserOut, ActivitiesOut, BooksOut, User_secret
from ..schemas import UserCreate, ActivityCreate, BookCreate

router = APIRouter(
    prefix="/user",
    tags=["users_info"]
)

@router.put("/registration", response_model= UserCreate)
async def create_user(user: User_secret, db: Session = Depends(get_db)):
    stmt = select(Users).where(Users.email == user.email)
    email = db.scalars(stmt).one()
    if email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    db_user = Users(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/user_info", response_model= UserOut)
async def get_users_info(user_id: int, db: Session = Depends(get_db)):
    user = db.get(Users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found")
    return user

@router.get("/activities", response_model= list[ActivitiesOut])
async def get_users_activities(id: int, db: Session = Depends(get_db)):
    user = db.get(Users, id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found")
    return user.activities

@router.put("/activities", response_model= ActivityCreate)
async def put_users_activities(user_id: int, activity: ActivityCreate, db: Session = Depends(get_db)):
    user = db.get(Users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found")

    db_activity = Activities(**activity.model_dump(), user_id= user_id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/books", response_model= list[BooksOut])
async def get_users_activities(id: int, db: Session = Depends(get_db)):
    user = db.get(Users, id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found") 
    return user.books

@router.put("/books", response_model=BookCreate)
async def put_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = Books(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book