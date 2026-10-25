from fastapi import APIRouter, HTTPException

from app.models.user import User
from app.database import users_collection

from app.security import (
    hash_password,
    verify_password,
    create_access_token
)

from app.schemas.user_schema import (
    user_helper,
    LoginUser
)


router = APIRouter(
   
    tags=["Authentication"]
)


# Register User
@router.post("/register")
async def register(user: User):

    # Check if email already exists
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    # Hash password
    hashed_password = hash_password(
        user.password
    )


    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }


    result = users_collection.insert_one(
        new_user
    )


    created_user = users_collection.find_one(
        {
            "_id": result.inserted_id
        }
    )


    return {
        "message": "User Registered Successfully",
        "user": user_helper(created_user)
    }



@router.post("/login")
async def login(user: LoginUser):

    existing_user = users_collection.find_one(
        {
            "email": user.email
        }
    )


    if not existing_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )


    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid email or password"
        )


    token = create_access_token(
        {
            "sub": str(existing_user["_id"]),
            "email": existing_user["email"]
        }
    )


    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer",
        "user": user_helper(existing_user)
    }