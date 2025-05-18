from sqlalchemy.orm import Mapped, mapped_column, relationship 
from sqlalchemy import String, Table, Column, Integer, ForeignKey
from datetime import date
from .database import Base

Users_Books = Table(
   "UsersBooks",
   Base.metadata,
   Column("id", Integer, primary_key= True, index= True, autoincrement= True),
   Column("users_id", Integer, ForeignKey("Users.id")),
   Column("book_id", Integer, ForeignKey("Books.id")),
)

Books_Authors = Table(
   "BooksAuthors",
   Base.metadata,
   Column("id" , Integer, primary_key= True, index= True, autoincrement= True),
   Column("book_id", Integer, ForeignKey("Books.id")),
   Column("author_id", Integer, ForeignKey("Authors.id"))
)

class Users(Base):
   __tablename__ = "Users"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index= True, autoincrement=True)
   name: Mapped[str] = mapped_column(String(60), unique=True, nullable= False, index= True)
   surname: Mapped[str | None]
   email: Mapped[str | None] = mapped_column(unique= True, index= True)
   active: Mapped[bool]
   password: Mapped[str] = mapped_column(nullable= False)

   #Many to Many Books Users
   books: Mapped[list["Books"]] = relationship(
      secondary=Users_Books,
      back_populates= "users"
   )

   #One to Many User Activities
   activities: Mapped[list["Activities"]] = relationship(
      back_populates="user"
   )

   #One to Many Users ReadingLogs
   readinglogs: Mapped[list["ReadingLog"]] = relationship(
      back_populates="user"
   )


class Books(Base):
   __tablename__ = "Books"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index= True, autoincrement=True)
   book_name: Mapped[str] = mapped_column(nullable= False)
   last_page: Mapped[int] = mapped_column(nullable= False)

   #Many to Many Users Books
   users: Mapped[list["Users"]] = relationship(
      secondary=Users_Books,
      back_populates="books"
   )

   #Many to Many Authors Books
   authors: Mapped[list["Author"]] = relationship(
      secondary=Books_Authors,
      back_populates= "books"
   )


class Author(Base):
   __tablename__ = "Authors"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index= True, autoincrement=True)
   author_name: Mapped[str] = mapped_column(nullable= False)
   author_surname: Mapped[str | None]

   #Many to Many Books Authors
   books: Mapped[list["Books"]] = relationship(
      secondary= Books_Authors,
      back_populates= "authors"
   )


class Activities(Base):
   __tablename__ = "Activities"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index= True, autoincrement=True)
   exercise_name: Mapped[str | None] 
   exercise_weight: Mapped[int | None]
   exercise_reps: Mapped[int | None]
   date: Mapped[date | None] 
   user_id: Mapped[int] = mapped_column(ForeignKey('Users.id'), nullable= False)

   #Many to One - relationship
   user: Mapped["Users"] = relationship(
      back_populates="activities"
   )   

class ReadingLog(Base):
   __tablename__ = "Reading"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index= True, autoincrement=True)
   user_id: Mapped[int] = mapped_column(ForeignKey("Users.id"), nullable= False) 
   book_id: Mapped[int] = mapped_column(ForeignKey("Books.id"), nullable= False)
   pages_read: Mapped[int | None]
   status_id: Mapped[int] = mapped_column(ForeignKey("Status.id"), nullable= False)
   date: Mapped[date]

   #One - many relationship
   user: Mapped["Users"] = relationship(
      back_populates="readinglogs"
   )

class Todo(Base):
   __tablename__ = "Todo"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index= True, autoincrement=True) 
   user_id: Mapped[int] = mapped_column(ForeignKey("Users.id"), nullable= False)
   text: Mapped[str]
   status_id: Mapped[int] = mapped_column(ForeignKey("Status.id"), nullable= False)
   date_created: Mapped[date]

class Status(Base):
   __tablename__ = "Status"

   id: Mapped[int] = mapped_column(Integer, primary_key=True, index= True, autoincrement=True) 
   status: Mapped[str] = mapped_column(unique= True)