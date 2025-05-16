from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Users, Activities, Books
from ..schemas import UserOut, ActivitiesOut, BooksOut
from ..schemas import ActivityCreate
from ..security import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["users_info"]
)

@router.get("/user_info", response_model= UserOut)
async def get_users_info(current_user: Users = Depends(get_current_user)):
    return current_user

@router.get("/activities", response_model= list[ActivitiesOut])
async def get_users_activities(current_user: Users = Depends(get_current_user)):
    return current_user.activities

@router.put("/activities", response_model= ActivityCreate)
async def put_users_activities(activity: ActivityCreate, current_user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    db_activity = Activities(**activity.model_dump(), user_id= current_user.id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/books", response_model= list[BooksOut])
async def get_users_activities(current_user: Users = Depends(get_current_user)):
    return current_user.books

@router.put("/book", response_model= BooksOut)
async def set_users_book(
    book_name:str , 
    author_name: str, 
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass