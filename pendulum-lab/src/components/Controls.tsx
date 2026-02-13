import { useState } from "react";
import styles from "./Controls.module.scss";

interface Props {
  setTheta0: (v: number) => void;
}

export function Controls({ setTheta0 }: Props) {
  const [currTheta, setCurrTheta] = useState<number | null>(30);

  return (
    <section className={styles.controls}>
      <h2>Pendulum params</h2>

      <div className={styles.field}>
        <label>Start corner (deg)</label>
        <input
          placeholder="Input degrees"
          type="number"
          step="1"
          min={0}
          max={360}
          value={currTheta ? currTheta : ""}

          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = +e.target.value;

            const deg = val > 90 ? 90 : val < 0 ? 0 : val;

            setCurrTheta(deg);
            setTheta0((deg * Math.PI) / 180);
          }}
        />
      </div>
    </section>
  );
}
