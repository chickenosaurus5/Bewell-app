import sqlite3
from peewee import *
from models import User

database = SqliteDatabase("app.db")


query = User.update(username="Alice Smith").where(User.username == "Alice")
query.execute()