from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Books, Author
from ..schemas import BooksOut, AuthorOut
from ..schemas import BookCreate, AuthorCreate

router = APIRouter(
    tags=["books, Authors"]
)

@router.get("/books", response_model=list[BooksOut])
async def get_all_books(db: Session = Depends(get_db)):
    """📚 Get a list of all books in the database."""
    db_books = db.scalars(
        select(Books)
    ).all()
    return db_books

@router.post("/books", response_model=BooksOut)
async def put_book(book: BookCreate, db: Session = Depends(get_db)):
    """➕ Add a new book to the database."""
    db_book = Books(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.post("/authors", response_model=AuthorOut)
async def put_book(author: AuthorCreate, db: Session = Depends(get_db)):
    """✍️ Add a new author to the database."""
    author_db = Author(**author.model_dump())
    db.add(author_db)
    db.commit()
    db.refresh(author_db)
    return author_db

@router.post("/books/add-author", response_model=AuthorOut)
async def set_author_book(author: AuthorCreate, book_name: str, db: Session = Depends(get_db)):
    """
    🔗 Associate an existing author with an existing book.

    - Ensures both author and book exist.
    - Links the author to the book.
    """
    author_db = db.scalar(
        select(Author).where(Author.author_name == author.author_name)
    )
    if not author_db:
        raise HTTPException(404, f"Author '{author.author_name}' doesn't exist")
    book = db.scalar(
        select(Books).where(Books.book_name == book_name)
    )
    if not book:
        raise HTTPException(404, f"Book '{book_name}' doesn't exist")
    book.authors.append(author_db)
    db.commit()
    db.refresh(book)  # To get updated relationships 
    return author_db