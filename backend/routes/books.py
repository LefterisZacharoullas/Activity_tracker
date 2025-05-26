from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Books, Author, Status
from ..schemas import BooksOut, AuthorOut
from ..schemas import BookCreate, AuthorCreate
from ..dependencies import verify_author_id, verify_book_id
from backend.utils import limiter

router = APIRouter(
    tags=["books, Authors, Status"]
)

@router.get("/books", response_model=list[BooksOut])
@limiter.limit("60/minute")
async def get_all_books(request: Request, db: Session = Depends(get_db)):
    """📚 Get a list of all books in the database."""
    db_books = db.scalars(
        select(Books)
    ).all()
    return db_books

@router.get("/authors", response_model=list[AuthorOut])
@limiter.limit("60/minute")
async def get_all_authors(request: Request, db: Session = Depends(get_db)):
    """ Get a list of all authors in the database."""
    db_authors = db.scalars(
        select(Author)
    ).all()
    return db_authors

@router.get("/status")
@limiter.limit("60/minute")
async def get_all_status(request: Request, db: Session = Depends(get_db)):
    """ Get the IDs of status in the database."""
    db_status = db.scalars(
        select(Status)
    ).all()
    return db_status

@router.post("/books", response_model=BooksOut)
@limiter.limit("20/minute")
async def put_book(request: Request, book: BookCreate, db: Session = Depends(get_db)):
    """➕ Add a new book to the database."""
    db_book = db.scalar(
        select(Books).where(book.book_name == Books.book_name)
    )
    if db_book:
        raise HTTPException(400, "This book already exist")
    db_book = Books(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.post("/authors", response_model=AuthorOut)
@limiter.limit("20/minute")
async def put_book(request: Request, author: AuthorCreate, db: Session = Depends(get_db)):
    """✍️ Add a new author to the database."""
    author_db = db.scalar(
        select(Author).where(author.author_name == Author.author_name)
    )
    if author_db:
        raise HTTPException(400, "This book already exist")
    author_db = Author(**author.model_dump())
    db.add(author_db)
    db.commit()
    db.refresh(author_db)
    return author_db

@router.post("/books/{book_id}/authors/{author_id}", response_model=AuthorOut)
@limiter.limit("20/minute")
async def set_author_book(
    request: Request,
    book: Books = Depends(verify_book_id),
    author: Author = Depends(verify_author_id),
    db: Session = Depends(get_db)
):
    """
    🔗 Associate an existing author with an existing book.

    - Ensures both author and book exist.
    - Links the author to the book.
    """
    if author in book.authors:
        raise HTTPException(400, "This author is already related to the book")

    book.authors.append(author)
    db.commit()
    db.refresh(book)  # To get updated relationships 
    return author