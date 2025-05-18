from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Users, Activities, Books, Author, ReadingLog, Status
from ..schemas import UserOut, ActivitiesOut, BooksOut, ReadingOut
from ..schemas import ActivityCreate, UserUpdate, ReadingCreate
from ..security import get_current_user, get_password_hash

router = APIRouter(
    prefix="/user",
    tags=["users_info"]
)

@router.get("/user_info", response_model=UserOut)
async def get_users_info(current_user: Users = Depends(get_current_user)):
    """🔍 Get current user's public information."""
    return current_user

@router.put("/user_info", response_model=UserOut, response_model_exclude_none=True)
async def upgrade_user_info(
    user_update: UserUpdate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """✏️ Update current user's info (only fields provided in request)."""
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/user_name")
async def update_user_name(
    name: str,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ✏️ Update the current user's name.

    - ❌ Rejects if the name already exists in the database.
    - ❌ Rejects if the name contains non-letter characters.
    - ✅ Updates the name if valid and unique.
    """
    name_db = db.scalar(
        select(Users).where(Users.name == name)
    )
    if name_db:
        raise HTTPException(400, "User with this name already exist")

    if not name.isalpha():
        raise HTTPException(422, "Name must contain only letters")
    
    current_user.name = name
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/update_password")
async def update_password(
    password: str,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    🔒 Update the current user's password.
    """
    current_user.password = get_password_hash(password)
    db.commit()
    db.refresh(current_user)
    return {"status" : "your new password was set"}
    
@router.get("/activities", response_model=list[ActivitiesOut])
async def get_users_activities(current_user: Users = Depends(get_current_user)):
    """📋 Get all activities associated with the current user."""
    return current_user.activities

@router.post("/activities", response_model=ActivitiesOut)
async def put_users_activities(
    activity: ActivityCreate, 
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """➕ Add a new activity to the current user's activities."""
    db_activity = Activities(**activity.model_dump(), user_id=current_user.id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.get("/books", response_model=list[BooksOut])
async def get_users_activities(current_user: Users = Depends(get_current_user)):
    """📚 Get all books saved by the current user."""
    return current_user.books

@router.post("/book", response_model=BooksOut)
async def set_users_book(
    book_name: str,
    author_name: str,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """📥 Add an existing book by author to the user's collection.

    - Validates that the book exists and is written by the given author.
    - Prevents duplicates.
    """
    book = db.scalar(
        select(Books).join(Books.authors).where(
            Books.book_name == book_name,
            Author.author_name == author_name
        )
    )
    if not book:
        raise HTTPException(404, "Book with this author doesn't exist")
    if book in current_user.books:
        raise HTTPException(400, "Book already in user's collection")
    current_user.books.append(book)
    db.commit()
    db.refresh(book)
    return book

#Logic of the Reading books begin
@router.post("/reading", response_model= ReadingOut)
async def set_reading_book(
    reading: ReadingCreate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    book = db.scalars(
        select(Books).join(Books.users).where(
            Books.book_name == reading.book_name,
            Users.id == current_user.id,
        )
    ).one_or_none()

    if not book:
        raise HTTPException(404, "Book that user provide doesn't exist in user's collection")
    
    status = db.scalar(
        select(Status).where(Status.status == reading.status) 
    )
    
    reading_db = ReadingLog(
        user_id= current_user.id,
        book_id = book.id,
        pages_read= reading.pages_read,
        status_id= status.id,
        date= reading.date
    )
    db.add(reading_db)
    db.commit()
    db.refresh(reading_db)
    return reading_db    

@router.get("/reading", response_model= list[ReadingOut])
async def users_reading(
    current_user: Users = Depends(get_current_user),
):
    return current_user.readinglogs