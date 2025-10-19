from peewee import *
from models import *
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import HTTPException
import google.generativeai as genai

app = FastAPI()

genai.configure(api_key="AIzaSyCI0io8ss6yixRmnN5X004luaJhG5z4eB0")
model = genai.GenerativeModel("gemini-2.5-flash")


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserSchema(BaseModel):
    firstName: str
    lastName: str
    password: str
    email: str

class LoginSchema(BaseModel):
    email: str
    password: str


class Message(BaseModel):
    user_id: int
    message: str


@app.post("/register")
def create_usr(payload: UserSchema):
    try:
        user = User.create(
            firstName=payload.firstName,
            lastName=payload.lastName,
            email=payload.email,
            password=payload.password,
        )
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Email already registered")
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Internal server error")
    
    return {"success": True, "user": {"id": user.userId, "firstName": user.firstName, "lastName": user.lastName, "email": user.email}}


@app.post("/login")
def access_usr(payload: LoginSchema):
    try:
        # user = User.get(User.email == payload.email,User.password == payload.password)
        user = User.get(User.email == payload.email)
    except User.DoesNotExist:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.password != payload.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"success": True, "user": {"id": user.userId, "firstName": user.firstName, "lastName": user.lastName, "email": user.email}}


@app.get("/profile/{user_id}")
def get_profile(user_id: int):
    try:
        user = User.get(User.userId == user_id)
    except User.DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": {"id": user.userId, "firstName": user.firstName, "lastName": user.lastName, "email": user.email}}


@app.post("/chat")
def chat(msg: Message):
    try:
        history = (
            ChatHistory
            .select()
            .where(ChatHistory.user_id == msg.user_id)
            .order_by(ChatHistory.id.desc())
            .limit(10)
        )
        conversation = "\n".join(
            [f"{h.role}: {h.content}" for h in reversed(history)]
        )
        full_prompt = f"{conversation}\nuser: {msg.message}\nassistant:"

        response = model.generate_content(full_prompt)
        reply = response.text.strip()   

        ChatHistory.create(user_id=msg.user_id, role="user", content=msg.message)
        ChatHistory.create(user_id=msg.user_id, role="assistant", content=reply)

        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))