import React, { useState } from "react";
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
  const [table, setTable] = useState<MeasurePoint[]>([{ F: 0, fLoad: 0, fUnload: 0, fAvg: 0 }]);
  const [phase, setPhase] = useState<"load" | "unload">("load");
  const [maxForce, setMaxForce] = useState<number>(10);


  const handleStep = () => {
    const isLoading = phase === "load";
    const nextForce = isLoading ? force + STEP : force - STEP;

    // 1. Проверки границ
    if (isLoading && force >= maxForce) {
      setPhase("unload");
      return;
    }
    // Если мы уже в нуле и пытаемся идти дальше вниз — выходим
    if (!isLoading && force <= 0) return;

    // 2. Расчет физики
    const raw = calculateDeflection(nextForce, length, b, h, E);
    const fValue = isLoading ? raw : raw * UNLOAD_K;

    // 3. Обновление состояния силы
    setForce(nextForce);

    // 4. Обновление таблицы
    setTable((prev) => {
      if (isLoading) {
        // 1. Стандартное добавление строки при нагрузке
        return [...prev, { F: nextForce, fLoad: fValue, fUnload: 0, fAvg: 0 }];
      } else {
        // 2. Логика разгрузки
        return prev.map((row) => {
          if (row.F === nextForce) {
            let finalUnloadValue = fValue;

            // СПЕЦИАЛЬНОЕ УСЛОВИЕ: если мы пришли в точку 0 при разгрузке
            if (nextForce === 0) {
              // Ищем в таблице значение fLoad для силы STEP (например, 5)
              const rowAtFive = prev.find(r => r.F === STEP);
              const fLoadAtFive = rowAtFive ? rowAtFive.fLoad : 0;

              // Устанавливаем 5% от fLoad при F=5
              finalUnloadValue = fLoadAtFive * 0.05;
            }

            return {
              ...row,
              fUnload: finalUnloadValue,
              fAvg: (row.fLoad + finalUnloadValue) / 2
            };
          }
          return row;
        });
      }
    });

    // 5. Переключение фазы при достижении пика
    if (isLoading && nextForce === maxForce) {
      setPhase("unload");
    }
  };

  const resetExperiment = () => {
    setForce(0);
    setTable([{ F: 0, fLoad: 0, fUnload: 0, fAvg: 0 }]);
    setPhase("load");
  };

  return (
    <section className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2>Параметри стержня</h2>

      <div className={styles.formInline}>
        <div className={styles.field}>
          <label>L (м): </label>
          <input type="number" step="0.01" value={length}
            onChange={(e) => setLength(+e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>b (м): </label>
          <input type="number" step="0.001" value={b}
            onChange={(e) => setB(+e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>h (м): </label>
          <input type="number" step="0.001" value={h}
            onChange={(e) => setH(+e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>Максимальна F (H): </label>
          <input type="number" step="5" value={maxForce}
            onChange={(e) => setMaxForce(+e.target.value)} />
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
