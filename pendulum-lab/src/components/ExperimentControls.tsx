import styles from "./Controls.module.scss";

interface Props {
  oscillations: number;
  setOscillations: (v: number) => void;
  onStart: () => void;
}

export function ExperimentControls({
  oscillations,
  setOscillations,
  onStart,
}: Props) {
  return (
    <section className={styles.controls}>
      <h2>Эксперимент</h2>

      <div className={styles.field}>
        <label>Количество колебаний</label>
        <input
          type="number"
          min={1}
          step={1}
          value={oscillations}
          onChange={(e) => setOscillations(+e.target.value)}
        />
        <span className={styles.hint}>Полных колебаний маятника</span>
      </div>

      <button className={styles.startButton} onClick={onStart}>
        ▶ Start experiment
      </button>
    </section>
  );
}
