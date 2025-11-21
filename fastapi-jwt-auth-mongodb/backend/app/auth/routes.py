from fastapi import APIRouter, HTTPException
from app.models.model import UserRegister, UserLogin   # ✅ Import depuis app/models/model.py
from app.models.database import users_collection              # ✅ Import correct
from app.auth.utils import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/")
def read_root():
    return {"message": "API Auth FastAPI + MongoDB + JWT 👋"}

@router.post("/register")
async def register(user: UserRegister):
    # Vérifier si l'email existe déjà
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    # Hasher le mot de passe avant insertion
    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    await users_collection.insert_one(user_dict)
    
    return {"msg": "Utilisateur créé avec succès"}

@router.post("/login")
async def login(user: UserLogin):
    # Vérifier si l'utilisateur existe
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    # Vérifier le mot de passe
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    # Créer le token JWT
    token = create_access_token(
        data={"sub": db_user["email"]},
        expires_delta=timedelta(minutes=30)
    )

    return {"access_token": token, "token_type": "bearer"}
