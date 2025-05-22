from backend import dependencies
from backend import schemas 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Users, Activities, Books, ReadingLog, Status
from ..security import get_current_user, get_password_hash

router = APIRouter(
    prefix="/user",
    tags=["users_info"]
)

# ─────────────────────────────────────────────────────────────
# 📌 USER INFO ENDPOINTS
# ─────────────────────────────────────────────────────────────

@router.get("/user_info", response_model=schemas.UserOut)
async def get_users_info(current_user: Users = Depends(get_current_user)):
    """🔍 Get current user's public information."""
    return current_user

@router.patch("/user_info", response_model=schemas.UserOut, response_model_exclude_none=True)
async def upgrade_user_info(
    user_update: schemas.UserUpdate,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ✏️ Update only the provided fields of the current user's profile.
    Unchanged fields will be left as-is.
    """
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.patch("/user_name")
async def update_user_name(
    name: str,
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ✏️ Change the current user's name.
    - Rejects names already taken.
    - Accepts only alphabetic characters.
    """
    name_db = db.scalar(
        select(Users).where(Users.name == name)
    )
    if name_db:
        raise HTTPException(400, "User with this name already exist")

    if not name.isalnum():
        raise HTTPException(status_code=422, detail="Name must contain only letters and digits")

    current_user.name = name
    db.commit()
    db.refresh(current_user)
    return current_user

@router.patch("/update_password")
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

# ─────────────────────────────────────────────────────────────
# 🗂️ ACTIVITY MANAGEMENT ENDPOINTS
# ─────────────────────────────────────────────────────────────
    
@router.get("/activities", response_model=list[schemas.ActivitiesOut])
async def get_users_activities(current_user: Users = Depends(get_current_user)):
    """📋 Get all activities associated with the current user."""
    return current_user.activities

@router.post("/activities", response_model=schemas.ActivitiesOut)
async def put_users_activities(
    activity: schemas.ActivityCreate, 
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """➕ Add a new activity to the current user's activities."""
    db_activity = Activities(**activity.model_dump(), user_id=current_user.id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.delete("/activities/{activity_id}")
async def put_users_activities(
    db_activity: Activities = Depends(dependencies.verify_activity_id), 
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """❌ Delete an activity from the user's list by its ID."""
    if not db_activity in current_user.activities:
        raise HTTPException(404 , "The activitie that provided doesnt'exist in users collection")
    db.delete(db_activity)
    db.commit()
    return {"status" : "Successfully deleted"}

# ─────────────────────────────────────────────────────────────
# 📚 BOOK COLLECTION ENDPOINTS
# ─────────────────────────────────────────────────────────────

@router.get("/books", response_model=list[schemas.BooksOut])
async def get_users_activities(current_user: Users = Depends(get_current_user)):
    """📚 Get all books saved by the current user."""
    return current_user.books

@router.post("/book/{book_id}", response_model=schemas.BooksOut)
async def set_users_book(
    book: Books = Depends(dependencies.verify_book_id),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    📥 Add an existing book to the user's collection.
    - Book must exist.
    - Book must not already be in user's list.
    """
    if book in current_user.books:
        raise HTTPException(400, "Book already in user's collection")
    current_user.books.append(book)
    db.commit()
    db.refresh(book)
    return book

@router.delete("/book/{book_id}")
async def delete_user_book(
    book: Books = Depends(dependencies.verify_book_id),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ❌ Remove a book from the user's collection.
    - Book must exist in the user's collection.
    """
    if not book in current_user.books:
        raise HTTPException(404, "This Book doesn't exist in user's collection")
    current_user.books.remove(book)
    db.commit()
    db.refresh(current_user)
    return {"status" : "Book successfully removed"} 

# ─────────────────────────────────────────────────────────────
# 📖 READING LOG ENDPOINTS
# ─────────────────────────────────────────────────────────────

@router.get("/reading", response_model= list[schemas.ReadingOut])
async def users_reading(
    current_user: Users = Depends(get_current_user),
):
    """📖 Return the user's reading history (logs)."""
    return current_user.readinglogs

@router.post("/reading/{book_id}/status/{status_id}", response_model= schemas.ReadingOut)
async def set_reading_book(
    reading: schemas.ReadingCreate,
    book: Books = Depends(dependencies.verify_book_id),
    status: Status = Depends(dependencies.verify_status_id),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    📝 Add a book to the user's reading log with a status (e.g., reading, finished).
    - Book must exist in the user's collection.
    """
    if not book in current_user.books:
        raise HTTPException(404, "Book that user provide doesn't exist in user's collection")

    reading_db = ReadingLog(
        **reading.model_dump(),
        user_id= current_user.id,
        book_id = book.id,
        status_id= status.id,
    )
    db.add(reading_db)
    db.commit()
    db.refresh(reading_db)
    return reading_db

@router.delete("/reading/{reading_id}")
async def users_reading(
    reading: ReadingLog = Depends(dependencies.verify_reading_id),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ❌ Remove a reading log entry.
    - Must exist in the user's reading logs.
    """
    if not reading in current_user.readinglogs:
        raise HTTPException(404, "Reading that user provide doesn't exist in user's collection")
    
    db.delete(reading)
    db.commit()
    return {"status" : "Successfully deleted"}