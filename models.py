from database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy import text
from database import engine


class Transactions(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String)
    description = Column(String)
    is_income = Column(Boolean)
    date = Column(String)

# # Create the is_income column
# with engine.connect() as connection:
#     connection.execute(text("ALTER TABLE transactions ADD COLUMN is_income BOOLEAN"))
