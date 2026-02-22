import { useState } from "react";
import { Yunga1Canvas } from "./components/Yunga1Canvas";
import Yunga1Controls from "./components/Yunga1Controls";
import LabContainer from "./components/LabContainer.tsx";
import styles from "./App.module.scss";

export default function YoungApp() {
  const [force, setForce] = useState(5);
  const [length, setLength] = useState(0.6);
  const [b, setB] = useState(0.02);
  const [h, setH] = useState(0.004);
  const [E, setE] = useState(2e11);

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Лабораторна робота</h1>
      <h2 className={styles.subtitle}>
        Визначення модуля Юнга при згині стержня
      </h2>

      <div className={styles.mainGrid}>
        <div className={styles.controlsCol}>
          <Yunga1Controls
            force={force}
            setForce={setForce}
            length={length}
            setLength={setLength}
            b={b}
            setB={setB}
            h={h}
            setH={setH}
            E={E}
            setE={setE}
          />
        </div>
        <LabContainer />

        <div className={styles.canvasWrapper}>
          <Yunga1Canvas
            force={force}
            length={length}
            b={b}
            h={h}
            E={E}
          />
        </div>
      </div>
    </main>
  );
}