from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# --- Настройка БД (SQLite) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Модель таблицы в БД
class SecretData(Base):
    __tablename__ = "secrets"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True) # Например: "input1", "input2"
    value = Column(String)

Base.metadata.create_all(bind=engine)

# --- Инициализация данных (выполнить один раз) ---
db = SessionLocal()
if not db.query(SecretData).first():
    db.add(SecretData(key="input1", value="111"))
    db.add(SecretData(key="input2", value="222"))
    db.commit()
db.close()

# --- Приложение FastAPI ---
app = FastAPI()

# !!! ВАЖНО: Настройка CORS, чтобы фронтенд мог достучаться до бэка !!!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # В продакшене лучше заменить на конкретный адрес
    allow_methods=["*"],
    allow_headers=["*"],
)

class CheckRequest(BaseModel):
    val1: str
    val2: str

@app.post("/check")
def check_values(data: CheckRequest):
    print("zalupa")
    db = SessionLocal()
    
    # Ищем правильные значения в БД
    db_val1 = db.query(SecretData).filter(SecretData.key == "input1").first()
    db_val2 = db.query(SecretData).filter(SecretData.key == "input2").first()
    
    ans1 = (data.val1 == db_val1.value) if db_val1 else False
    ans2 = (data.val2 == db_val2.value) if db_val2 else False
    
    db.close()
    
    return {
        "result": f"Answer 1: {ans1}\nAnswer 2: {ans2}"
    }

if __name__ == "__main__":
    import uvicorn
    # Запускаем на порту 8080, т.к. 8000 занят твоим фронтом
    uvicorn.run(app, host="127.0.0.1", port=8080)
