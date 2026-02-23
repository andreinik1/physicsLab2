import React, { useState, useEffect } from "react";
import styles from "./LabContainer.module.scss";
import { calculateDeflection } from "../physics/yunga1";

interface MeasurePoint {
  F: number;
  fLoad: number;
  fUnload: number;
  fAvg: number;
}

interface Props {
  force: number;
  setForce: React.Dispatch<React.SetStateAction<number>>;

  length: number;
  setLength: React.Dispatch<React.SetStateAction<number>>;

  b: number;
  setB: React.Dispatch<React.SetStateAction<number>>;

  h: number;
  setH: React.Dispatch<React.SetStateAction<number>>;

  E: number;
  setE: React.Dispatch<React.SetStateAction<number>>;
}

const STEP = 5;
const MAX_FORCE = 25;
const UNLOAD_K = 1.09;

function formatValue(v: number, digits = 6) {
  return v.toFixed(digits);
}

const Yunga1Controls: React.FC<Props> = ({
  force,
  setForce,
  length,
  setLength,
  b,
  setB,
  h,
  setH,
  E,
}) => {
  const [table, setTable] = useState<MeasurePoint[]>([{F: 0, fLoad: 0, fUnload: 0, fAvg: 0}]);
  const [phase, setPhase] = useState<"load" | "unload">("load");

  
 const handleStep = () => {
  // 1. Сначала определяем, в какую сторону идем
  const isLoading = phase === "load";
  
  // 2. Рассчитываем НОВОЕ значение силы заранее
  const nextForce = isLoading ? force + STEP : force - STEP;

  // 3. Проверки на выход за границы
  if (isLoading && force >= MAX_FORCE) {
    // Если уже 25, переключаем на разгрузку и выходим
    setPhase("unload");
    return;
  }
  if (!isLoading && force <= 0) {
    // Если уже 0 в режиме разгрузки, ничего не делаем
    return;
  }

  // 4. Считаем физику для НОВОГО значения силы (nextForce)
  const raw = calculateDeflection(nextForce, length, b, h, E);
  const fValue = isLoading ? raw : raw * UNLOAD_K;

  // 5. Обновляем силу
  setForce(nextForce);

  // 6. Обновляем таблицу, используя nextForce (а не force!)
  setTable((prev) => {
    if (isLoading) {
      // Добавляем новую строку для каждого шага нагрузки (5, 10... 25)
      return [...prev, { F: nextForce, fLoad: fValue, fUnload: 0, fAvg: 0 }];
    } else {
      // Ищем строку с силой nextForce и обновляем данные разгрузки
      return prev.map((row) =>
        row.F === nextForce
          ? { ...row, fUnload: fValue, fAvg: (row.fLoad + fValue) / 2 }
          : row
      );
    }
  });

  // 7. Если мы только что достигли максимума (25), 
  // следующий клик должен сменить фазу
  if (isLoading && nextForce === MAX_FORCE) {
    setPhase("unload");
  }
}; 

  const resetExperiment = () => {
    setForce(0);
    setTable([{F: 0, fLoad: 0, fUnload: 0, fAvg: 0}]);
    setPhase("load");
  };

  return (
    <section className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2>Параметри стержня</h2>

      <div className={styles.formInline}>
        <div className={styles.field}>
          <label>L (м)</label>
          <input type="number" step="0.01" value={length}
            onChange={(e) => setLength(+e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>b (м)</label>
          <input type="number" step="0.001" value={b}
            onChange={(e) => setB(+e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>h (м)</label>
          <input type="number" step="0.001" value={h}
            onChange={(e) => setH(+e.target.value)} />
        </div>
      </div>

      <div className={styles.formInline} style={{ marginTop: "10px" }}>
        <button onClick={handleStep} className={styles.startButton}>
          {phase === "load" ? "➕ Додати тягарець (5 Н)" : "➖ Зняти тягарець"}
        </button>

        <button
          onClick={resetExperiment}
          className={styles.startButton}
          style={{ backgroundColor: "red" }}
        >
          Скинути дослід
        </button>
      </div>

      <div className={styles.monitor} style={{ marginTop: "15px" }}>
        <div>⚖️ Навантаження: <b>{force} Н</b></div>
        <div>🔄 Режим: <b>{phase === "load" ? "Навантаження" : "Розвантаження"}</b></div>
      </div>

      <h3 style={{ marginTop: "20px" }}>Таблиця вимірювань</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>F, Н</th>
            <th>f (нав.), м</th>
            <th>f (розв.), м</th>
            <th>f̄, м</th>
          </tr>
        </thead>
        <tbody>
          {table.map((r) => (
            <tr key={r.F}>
              <td>{r.F}</td>
              <td>{formatValue(r.fLoad)}</td>
              <td>{r.fUnload ? formatValue(r.fUnload) : "—"}</td>
              <td>{r.fAvg ? formatValue(r.fAvg) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Yunga1Controls;
