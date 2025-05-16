from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Users, Activities, Books, Author
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

@router.post("/activities", response_model= ActivityCreate)
async def put_users_activities(
    activity: ActivityCreate, 
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    db_activity = Activities(**activity.model_dump(), user_id= current_user.id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/books", response_model= list[BooksOut])
async def get_users_activities(current_user: Users = Depends(get_current_user)):
    return current_user.books

@router.post("/book", response_model= BooksOut)
async def set_users_book(
    book_name:str , 
    author_name: str, 
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    book = db.scalar(
        select(Books).join(Books.authors).where(
            Books.book_name == book_name,
            Author.author_name == author_name
        )
    )

    if not book:
        raise HTTPException(404, "Book with this author doesnt exist")

    if book in current_user.books:
        raise HTTPException(400, "Book already in user's collection")
    
    current_user.books.append(book)
    db.commit()
    db.refresh(book)
    return book