from pydantic import BaseModel, EmailStr

class LoginUser(BaseModel):
    email: EmailStr
    password: str

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }