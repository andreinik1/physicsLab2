import { useState } from "react";
import styles from "./Controls.module.scss";

interface Props {
  length: number | null;
  setLength: (v: number) => void;
  setTheta0: (v: number) => void;
}

export function Controls({ length, setLength, setTheta0 }: Props) {
  const [currTheta, setCurrTheta] = useState<number | null>(30);

  return (
    <section className={styles.controls}>
      <h2>Pendulum params</h2>

      <div className={styles.field}>
        <label>Length of roap (m)</label>
        <input
          placeholder="Input length"
          type="number"
          step="0.1"
          min={0}
          value={length ? length : ""}
          onChange={(e) => setLength(+e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Start corner (deg)</label>
        <input
          placeholder="Input degrees"
          type="number"
          step="1"
          min={0}
          max={360}
          value={currTheta ? currTheta : ""}
          onChange={(e) => {
            const deg = +e.target.value;
            setCurrTheta(deg);
            setTheta0((deg * Math.PI) / 180);
          }}
        />
      </div>
    </section>
  );
}
