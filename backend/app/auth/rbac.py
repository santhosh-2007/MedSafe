from typing import List
from fastapi import Depends, HTTPException, status
from backend.app.auth.security import get_current_user
from backend.app.models.domain import User

def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden for role '{current_user.role}'. Required role(s): {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker
