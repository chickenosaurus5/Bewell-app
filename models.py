import sqlite3
from peewee import *
from databases import db_driver

database = SqliteDatabase("../Bewell-app/app.db")
database.connect()

class BaseModel(Model):
    class Meta:
        database = database

class User(BaseModel):
    userId = AutoField()
    firstName = CharField()
    lastName = CharField()
    password = CharField()
    email = CharField(unique=True)

    

db_driver.create_tables(database,User)


# db_driver.drop_tables(database,User)

