from peewee import *
from models import *
from fastapi import FastAPI


app = FastAPI()


@app.post("/register")
def create_usr(usrname,passwd,email_i):
    User.create(username=usrname,password=passwd,email=email_i)
    return {"success":"success"}


@app.post("/login")
def access_usr(i_email,passwd):
    try:
        user = User.get(User.email == i_email,User.password == passwd)
    except User.DoesNotExist:
        return{"failure":"failed"}
    return {"success":"success","respones":user.__data__}



