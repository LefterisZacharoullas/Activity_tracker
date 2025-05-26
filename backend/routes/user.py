from backend import dependencies
from backend import schemas 
from backend import utils
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import Users, Activities, Books, ReadingLog, Status, Todo
from ..security import get_current_user, get_password_hash
from typing import Literal
from backend.utils import limiter

router = APIRouter(
    prefix="/user",
    tags=["users_info"]
)

# ─────────────────────────────────────────────────────────────
# 📌 USER INFO ENDPOINTS
# ─────────────────────────────────────────────────────────────

@router.get("/user_info", response_model=schemas.UserOut)
@limiter.limit("20/minute")
async def get_users_info(request: Request, current_user: Users = Depends(get_current_user)):
    """🔍 Get current user's public information."""
    return current_user

@router.patch("/user_info", response_model=schemas.UserOut, response_model_exclude_none=True)
@limiter.limit("10/minute")
async def upgrade_user_info(
    request: Request,
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
@limiter.limit("10/minute")
async def update_user_name(
    request: Request,
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
@limiter.limit("10/minute")
async def update_password(
    request: Request,
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
@limiter.limit("25/minute")
async def get_users_activities(request: Request, current_user: Users = Depends(get_current_user)):
    """📋 Get all activities associated with the current user."""
    return current_user.activities

@router.post("/activities", response_model=schemas.ActivitiesOut)
@limiter.limit("10/minute")
async def put_users_activities(
    request: Request,
    activity: schemas.ActivityCreate, 
    current_user: Users = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """➕ Add a new activity to the current user's activities."""
    test_activity = Activities(**activity.model_dump(), user_id= current_user.id)

    data = {
        key: value for key, value in test_activity.__dict__.items()
        if not key.startswith("_")
    }

    existing_activity = db.scalar(select(Activities).filter_by(**data))
    
    if existing_activity:
        raise HTTPException(400, "This Task already in user's collection")

    db_activity = Activities(**activity.model_dump(), user_id=current_user.id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.delete("/activities/{activity_id}")
@limiter.limit("10/minute")
async def put_users_activities(
    request: Request,
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
@limiter.limit("25/minute")
async def get_users_activities(request: Request, current_user: Users = Depends(get_current_user)):
    """📚 Get all books saved by the current user."""
    return current_user.books

@router.post("/book/{book_id}", response_model=schemas.BooksOut)
@limiter.limit("10/minute")
async def set_users_book(
    request: Request,
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
@limiter.limit("10/minute")
async def delete_user_book(
    request: Request,
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
@limiter.limit("25/minute")
async def users_reading(
    request: Request,
    current_user: Users = Depends(get_current_user),
):
    """📖 Return the user's reading history (logs)."""
    return current_user.readinglogs

@router.post("/reading/{book_id}/status/{status_id}", response_model= schemas.ReadingOut)
@limiter.limit("10/minute")
async def set_reading_book(
    request: Request,
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
@limiter.limit("10/minute")
async def users_reading(
    request: Request,
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

# ─────────────────────────────────────────────────────────────
# 📝 Todo ENDPOINTS
# ─────────────────────────────────────────────────────────────

@router.get("/todo", response_model= list[schemas.TodoOut])
@limiter.limit("25/minute")
async def get_user_todo(request: Request, current_user: Users = Depends(get_current_user)):
    """Return all users todo tasks"""
    return current_user.todo_tasks

@router.get("/todo/{status_id}", response_model= list[schemas.TodoOut])
@limiter.limit("25/minute")
async def get_todo_by_status(
    request: Request,
    status: Status = Depends(dependencies.verify_status_id),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Return users todo tasks by status_id"""
    tasks_by_status = db.scalars(
        select(Todo).where(
            current_user.id == Todo.user_id,
            status.id == Todo.status_id,
        )
    ).all()
    return tasks_by_status

@router.post("/todo/{status_id}", response_model=schemas.TodoOut)
@limiter.limit("10/minute")
async def create_user_todo(
    request: Request,
    todo: schemas.TodoCreate,
    status: Status = Depends(dependencies.verify_status_id),
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create todo task with status id"""
    test_task = Todo(
        **todo.model_dump(), 
        user_id= current_user.id,
        status_id= status.id
    )

    test_task = {
        key: val for key, val in test_task.__dict__.items()
        if not key.startswith("_")
    }

    existing_task = db.scalar(
        select(Todo).filter_by(**test_task)
    )

    if existing_task:
        raise HTTPException(400, "This Task already in user's collection")
    
    todo_db = Todo(
        **todo.model_dump(),
        user_id = current_user.id,
        status_id = status.id
    )

    db.add(todo_db)
    db.commit()
    db.refresh(todo_db)
    return todo_db

@router.delete("/todo/{todo_id}")
@limiter.limit("10/minute")
async def delete_user_todo(
    request: Request,
    todo: Todo = Depends(dependencies.verify_todo_id),  
    current_user: Users = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deleting the todo task from the user"""

    if not todo in current_user.todo_tasks:
        raise HTTPException(404, "This todo not Found")
    
    db.delete(todo)
    db.commit()
    return {"status" : "Successfully deleted"}

# ─────────────────────────────────────────────────────────────
# 📝 Stats ENDPOINTS
# ─────────────────────────────────────────────────────────────

@router.get("/user/stats", response_model= schemas.Stats)
@limiter.limit("25/minute")
async def get_users_stats(
    request: Request,
    range_conf: Literal["week" , "month"] = "week",
    current_user: Users = Depends(get_current_user),
):
    activities = current_user.activities
    readinglogs = current_user.readinglogs

    activities_dates = utils.configure_dates_for_processing(activities, range_conf)
    activities_stats = utils.month_stats_activities(activities_dates, activities, range_conf)

    read_dates = utils.configure_dates_for_processing(readinglogs, range_conf)
    read_stats = utils.month_stats_readings(read_dates, readinglogs, range_conf)

    return schemas.Stats(activities=activities_stats , readings=read_stats)