import React, { useState } from "react";
import styles from "./LabContainer.module.scss";

interface Props {
  setLength: (l: number) => void;
  setTheta0: (t: number) => void;
  setMode: (m: "infinite" | "fixed") => void;
  setTargetN: (n: number) => void;
  setIsRunning: (r: boolean) => void;
  stats: { currentN: number; time: number };
}

type locMode = "infinite" | "fixed";

const PendulumControls: React.FC<Props> = ({
  setLength,
  setTheta0,
  setMode,
  setTargetN,
  setIsRunning,
  stats,
}) => {
  const [currTheta, setCurrTheta] = useState<string>("30");
  const [newL, setNewL] = useState<string>("1");
  const [localMode, setLocalMode] = useState<locMode>("fixed");
  const [localN, setLocalN] = useState<number>(10);

  const handleStart = () => {
    setLength(parseFloat(newL));
    setTheta0((+currTheta * Math.PI) / 180);
    setMode(localMode);
    setTargetN(localN);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false); // Останавливаем таймер и анимацию
    setLength(parseFloat(newL)); // Возвращаем длину к установленной в инпуте
    setTheta0((+currTheta * Math.PI) / 180); // Возвращаем угол
  };

  const handleThetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deg = Math.min(90, Math.max(0, +e.target.value));
    setCurrTheta(`${deg}`);
    setTheta0((deg * Math.PI) / 180);
  };

  const handleChangeL = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    const sanitized = Math.min(4, Math.max(0, val));
    setNewL(e.target.value);
    setLength(sanitized);
  };

  return (
    <section className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2>Параметри математичного маятника</h2>
      <div className={styles.formInline}>
        <div className={styles.field}>
          <label>Кут (град): </label>
          <input type="number" value={currTheta} onChange={handleThetaChange} />
        </div>

        <div className={styles.field}>
          <label>L (довжина, м): </label>
          <input
            type="number"
            step="0.1"
            value={newL}
            onChange={handleChangeL}
          />
        </div>

        <div className={styles.field}>
          <label>Тип режиму: </label>
          <select
            value={localMode}
            onChange={(e) => setLocalMode(e.target.value as locMode)}
          >
            <option value="fixed">Кількість</option>
            <option value="infinite">Постійно</option>
          </select>
        </div>

        {localMode === "fixed" && (
          <div className={styles.field}>
            <label>Коливань: </label>
            <input
              type="number"
              value={localN}
              onChange={(e) => setLocalN(+e.target.value)}
            />
          </div>
        )}

        <button
          className={styles.startButton}
          onClick={handleStart}
          style={{ margin: "0" }}
        >
          ▶ Start
        </button>
        <button
          className={styles.startButton}
          onClick={handleReset}
          style={{ margin: "0", backgroundColor: "red" }}
        >
          ▶ Reset
        </button>
      </div>

      <div className={styles.monitor} style={{ marginTop: "30px" }}>
        <div style={{ width: "200px !important", marginRight: "20px" }}>
          <span>⏱</span> Час: <b>{stats.time.toFixed(3)} с</b>
        </div>
        <div>
          <span>🔄</span> Коливань:{" "}
          <b>
            {localMode === "fixed"
              ? Math.max(0, localN - stats.currentN)
              : stats.currentN}
          </b>
        </div>
      </div>
    </section>
  );
};

export default PendulumControls;
