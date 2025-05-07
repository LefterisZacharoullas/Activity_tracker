from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Users
from ..schemas import UserOut

router = APIRouter(
    prefix="/user",
    tags=["users_info"]
)

@router.get("/{user_id}", response_model= UserOut)
async def get_users_info(user_id: int, db: Session = Depends(get_db)):
    user = db.get(Users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found")
    return user