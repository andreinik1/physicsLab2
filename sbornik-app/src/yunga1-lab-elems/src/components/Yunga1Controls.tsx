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
const MAX_FORCE = 25;
const UNLOAD_K = 0.95;

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
  const [table, setTable] = useState<MeasurePoint[]>([]);
  const [phase, setPhase] = useState<"load" | "unload">("load");

  const handleStep = () => {
    if (phase === "load" && force >= MAX_FORCE) {
      setPhase("unload");
      return;
    }

    if (phase === "unload" && force <= 0) return;

    const newForce = phase === "load" ? force + STEP : force - STEP;

    const raw = calculateDeflection(newForce, length, b, h, E);
    const f = phase === "load" ? raw : raw * UNLOAD_K;

    setTable((prev) => {
      if (phase === "load") {
        return [
          ...prev,
          { F: newForce, fLoad: f, fUnload: 0, fAvg: 0 },
        ];
      }

      return prev.map((row) =>
        row.F === newForce
          ? {
              ...row,
              fUnload: f,
              fAvg: (row.fLoad + f) / 2,
            }
          : row
      );
    });

    setForce(newForce);
  };

  const resetExperiment = () => {
    setForce(0);
    setTable([]);
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