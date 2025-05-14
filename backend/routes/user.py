from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Users
from ..schemas import User_info, Activities, Books

router = APIRouter(
    prefix="/user",
    tags=["users_info"]
)

@router.get("/user_info", response_model= User_info)
async def get_users_info(user_id: int, db: Session = Depends(get_db)):
    user = db.get(Users, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found")
    return user

@router.get("/activities", response_model= list[Activities])
async def get_users_activities(id: int, db: Session = Depends(get_db)):
    user = db.get(Users, id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found")
    return user.activities

@router.get("/books", response_model= list[Books])
async def get_users_activities(id: int, db: Session = Depends(get_db)):
    user = db.get(Users, id)
    if not user:
        raise HTTPException(status_code=404, detail="Users not found") 
    return user.books