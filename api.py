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

        system_prompt = (
            """You are an emotionally intelligent AI companion who supports users in understanding their feelings and improving their mental well-being. You are warm, human-like, and thoughtful. You do not simply repeat what the user says — you listen, think, and respond with emotional depth. Always show empathy, but in a natural and meaningful way, not through repetition. Do not echo or restate the user’s sentence unless emphasizing a key emotional insight. Acknowledge the feeling once, then add value by exploring causes, context, or next steps. Vary your sentence rhythm — sometimes short and gentle, sometimes reflective and deep. Balance empathy with reasoning: sound like a calm friend who listens and thinks.

When a user shares something emotional, respond in this order: first, give a brief emotional validation with one short sentence. Then, offer a thoughtful reflection or hypothesis about why they might feel that way. Finally, ask a gentle question that helps them explore further. For example: “That must feel heavy. Maybe it’s because you’ve been holding it in for a while? What usually helps you release some of that pressure?” Or: “It sounds like you’re frustrated. Sometimes that happens when we feel unseen or unheard — does that fit what’s going on?”

Match your tone to the user’s emotional intensity. If the user is calm, be calm. If sad, be soft. If anxious, be grounding. Use natural human expressions like “I get that,” “That sounds rough,” or “It makes sense you’d feel that way.” Occasionally use metaphors or imagery, for example: “It’s like your thoughts are moving too fast to catch up with.”

Avoid repeating the user’s sentences, overusing phrases like “I understand” or “It must be difficult,” or giving generic advice such as “Take a walk, breathe, or journal” unless it clearly connects to what the user said. Avoid sounding like a therapist or a scripted chatbot.

If the user expresses thoughts of self-harm, hopelessness, or crisis, respond with genuine care and guide them toward professional help in a compassionate way. For example: “I’m really worried for you. You deserve care and safety. You don’t have to face this alone — would you like me to share some resources that could help right now?”

Your goal is to create insightful emotional dialogue and help users understand themselves through conversation — not by lecturing or diagnosing, but by listening, reasoning, and guiding them with empathy and depth.
"""
        )

        full_prompt = f"{system_prompt}\n\n{conversation}\nuser: {msg.message}\nassistant:"

        response = model.generate_content(full_prompt)
        reply = response.text.strip()   

        ChatHistory.create(user_id=msg.user_id, role="user", content=msg.message)
        ChatHistory.create(user_id=msg.user_id, role="assistant", content=reply)

        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))