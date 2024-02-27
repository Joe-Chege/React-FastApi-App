from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Session as SessionLocal, engine
import models

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

models.Transactions.__table__.drop(engine)
models.Base.metadata.create_all(bind=engine)

@app.post('/transactions/', response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: Session = Depends(get_db)):
    db_transaction = models.Transactions(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get('/transactions/', response_model=List[TransactionModel])
async def get_transactions(db: Session = Depends(get_db)):
    transactions = db.query(models.Transactions).all()
    return transactions

@app.get('/transactions/{transaction_id}', response_model=TransactionModel)
async def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(models.Transactions).filter(models.Transactions.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction