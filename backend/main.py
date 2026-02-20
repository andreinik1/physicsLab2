from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import math

# --- Настройка БД (SQLite) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
'''
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
'''

# --- Приложение FastAPI ---
app = FastAPI()

# !!! ВАЖНО: Настройка CORS, чтобы фронтенд мог достучаться до бэка !!!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # В продакшене лучше заменить на конкретный адрес
    allow_methods=["*"],
    allow_headers=["*"],
)

class Measures(BaseModel):
    L: str
    N: str
    t: str
    T: str
    g: str
    g_avg: str
    delta_g: str
    delta_g_avg: str

class ExperimentData(BaseModel):
    experiment: str
    measures: List[Measures]
    studentName: Optional[str]

@app.post("/check")
def check_data(data: ExperimentData):
    detailed_results = []
    g_avg = 0
    msv_g = []
    msv_delta_g = []
    
    for m in data.measures:
        # По умолчанию считаем всё верным, пока не доказано обратное
        TGK_check = {
            "T": True, "g": True
        }
        
        L = float(m.L)
        N = float(m.N)
        t = float(m.t)
        T_user = float(m.T)
        g_user = float(m.g)
        
        # 1. Проверка Периода T = t / N
        T_calc = t / N
        if not math.isclose(T_user, T_calc, rel_tol=0.01):
            TGK_check["T"] = False
            
        # 2. Проверка g = (4 * pi^2 * L) / T^2
        # Считаем g на основе введённого пользователем T
        g_calc = (4 * (math.pi**2) * L) / (T_user**2)
        if not math.isclose(g_user, g_calc, rel_tol=0.05):
            TGK_check["g"] = False
        g_avg += g_calc
        msv_g.append(g_calc)

        detailed_results.append(TGK_check)
    g_avg /= len(msv_g)
    for i in msv_g:
        msv_delta_g.append(abs(g_avg-i))
    
    delta_g_avg = sum(msv_delta_g)/len(msv_delta_g)

    k = 0
    for m in data.measures:
        davgd_check = {
            "g_avg": True, "delta_g": True, "delta_g_avg": True
        }
        
        g_avg_user = float(m.g_avg)
        delta_g_user = float(m.delta_g)
        delta_g_avg_user = float(m.delta_g_avg)

        if not math.isclose(g_avg_user, g_avg, rel_tol=0.01):
            davgd_check["g_avg"] = False

        if not math.isclose(delta_g_user, msv_delta_g[k], rel_tol=0.2):
            davgd_check["delta_g"] = False
        if not math.isclose(delta_g_avg_user, delta_g_avg, rel_tol=0.01):
            davgd_check["delta_g_avg"] = False
        k += 1

        detailed_results.append(davgd_check)
    return {
        "status": "OK",
        "user": data.studentName,
        "detailed_results": detailed_results
    }


if __name__ == "__main__":
    import uvicorn
    # Запускаем на порту 8080, т.к. 8000 занят твоим фронтом
    uvicorn.run(app, host="127.0.0.1", port=8080)
