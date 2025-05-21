import backend.models as models
from fastapi import Depends, HTTPException, Path
from sqlalchemy.orm import Session
from .database import get_db

def verify_book_id(book_id: int = Path(), db: Session = Depends(get_db)) -> models.Books:
    book = db.get(models.Books, book_id)
    if not book:
        raise HTTPException(404, "The provided book doesn't exist")
    return book

def verify_author_id(author_id: int = Path(), db: Session = Depends(get_db)) -> models.Author:
    author = db.get(models.Author, author_id)
    if not author:
        raise HTTPException(404, "The provided author doesn't exist")
    return author

def verify_status_id(status_id: int = Path(), db: Session = Depends(get_db)) -> models.Status:
    status = db.get(models.Status, status_id)
    if not status:
        raise HTTPException(404, "The provided status doesn't exist")
    return status

def verify_activity_id(activity_id: int = Path(), db: Session = Depends(get_db)) -> models.Activities:
    activity = db.get(models.Activities, activity_id)
    if not activity:
        raise HTTPException(404, "The provided activity doesn't exist")
    return activity

def verify_reading_id(reading_id: int = Path(), db: Session = Depends(get_db)) -> models.ReadingLog:
    reading = db.get(models.ReadingLog, reading_id)
    if not reading_id:
        raise HTTPException(404, "The provided reading doesn't exist")
    return reading