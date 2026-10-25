
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    print("DEBUG: get_current_user is running")

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("DEBUG: JWT decoded successfully")
        print("DEBUG: JWT payload keys:", list(payload.keys()))
        print("DEBUG: JWT subject exists:", bool(payload.get("sub")))

        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing subject"
            )

        return {
            "id": user_id,
            "email": email
        }

    except JWTError as e:
        print("DEBUG: JWT validation error:", str(e))

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
