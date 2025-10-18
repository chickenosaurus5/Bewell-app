from peewee import *

def create_tables(db,*args):
    with db:
            db.create_tables(args)
        

def drop_tables(db,*args):
    with db:
            db.drop_tables(args)