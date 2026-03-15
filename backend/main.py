from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import math

#SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # В продакшене лучше заменить на конкретный адрес
    allow_methods=["*"],
    allow_headers=["*"],
)

class Measures1(BaseModel):
    L: str
    N: str
    t: str
    T: str
    g: str
    g_avg: str
    delta_g: str
    delta_g_avg: str

class ExperimentData1(BaseModel):
    experiment: str
    measures: List[Measures1]

@app.post("/pendulum-check")
def check_data(data: ExperimentData1):
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
        if not math.isclose(T_user, T_calc, rel_tol=0.001):
            TGK_check["T"] = False
            
        # 2. Проверка g = (4 * pi^2 * L) / T^2
        # Считаем g на основе введённого пользователем T
        g_calc = (4 * (math.pi**2) * L) / (T_user**2)
        if not math.isclose(g_user, g_calc, rel_tol=0.001):
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

        if not math.isclose(g_avg_user, g_avg, rel_tol=0.001):
            davgd_check["g_avg"] = False

        if not math.isclose(delta_g_user, msv_delta_g[k], rel_tol=0.1):
            davgd_check["delta_g"] = False

        if not math.isclose(delta_g_avg_user, delta_g_avg, rel_tol=0.01):
            davgd_check["delta_g_avg"] = False
        k += 1

        detailed_results.append(davgd_check)
    return {
        "status": "OK",
        "detailed_results": detailed_results
    }

class Measures2(BaseModel):
    b: str
    delta_E: str
    delta_E_avg: str
    E: str
    E_avg: str
    F: str
    f_avg: str
    f_nav: str
    f_rozv: str
    h: str
    L: str

class ExperimentData2(BaseModel):
    experiment: str
    measures: List[Measures2]

@app.post("/yunga1-check")
def check_data(data: ExperimentData2):
    detailed_results = []
    E_avg = 0
    E_msv = []
    delta_E_msv = []
    for m in data.measures:
        TGK_check = {
            "f_avg": True, "E": True
                }
        f_nav = float(m.f_nav)
        f_rozv = float(m.f_rozv)
        F = float(m.F)
        L = float(m.L)
        b = float(m.b)
        h = float(m.h)
        f_avg_user = float(m.f_avg)
        E_user = float(m.E)

        f_avg_calc = (f_nav+f_rozv)/2
        if not math.isclose(f_avg_user, f_avg_calc, rel_tol=0.001):
            TGK_check["f_avg"] = False

        E_calc = (F*L**3)/(4*f_avg_calc*b*h**3)
        if not math.isclose(E_user, E_calc, rel_tol=100000):
            TGK_check["E"] = False
        E_avg += E_calc
        E_msv.append(E_calc)
        detailed_results.append(TGK_check)
        
    E_avg /= len(E_msv)
    for i in E_msv:
        delta_E_msv.append(abs(E_avg-i))
    
    delta_E_avg = sum(delta_E_msv)/len(delta_E_msv)

    k = 0
    for m in data.measures:
        davgd_check = {
            "E_avg": True, "delta_E": True, "delta_E_avg": True
        }
        
        E_avg_user = float(m.E_avg)
        delta_E_user = float(m.delta_E)
        delta_E_avg_user = float(m.delta_E_avg)

        if not math.isclose(E_avg_user, E_avg, rel_tol=0.001):
            davgd_check["E_avg"] = False

        if not math.isclose(delta_E_user, delta_E_msv[k], rel_tol=0.1):
            davgd_check["delta_E"] = False

        if not math.isclose(delta_E_avg_user, delta_E_avg, rel_tol=0.01):
            davgd_check["delta_E_avg"] = False
        k += 1

        detailed_results.append(davgd_check)
    return {
        "status": "OK",
        "detailed_results": detailed_results
    }
    

if __name__ == "__main__":
    import uvicorn
    # Запускаем на порту 8080, т.к. 8000 занят твоим фронтом
    uvicorn.run(app, host="127.0.0.1", port=8080)
