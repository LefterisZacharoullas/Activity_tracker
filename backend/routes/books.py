from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Books
from ..schemas import BooksOut
from ..schemas import BookCreate

router = APIRouter(
    prefix="/books",
    tags=["books"]
)

@router.get("/", response_model=list[BooksOut])
async def get_all_books(db: Session = Depends(get_db)):
    db_books = db.scalars(
        select(Books)
    ).all()
    return db_books

@router.put("/", response_model=BookCreate)
async def put_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = Books(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book