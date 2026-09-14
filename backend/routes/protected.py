from auth.dependencies import get_current_user
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/protected", tags=["Protected"])


@router.get("/")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {
        "message": "You have access to the protected route",
        "user": current_user,
    }