import { useState } from "react";
import { PendulumCanvas } from "./components/PendulumCanvas";
import styles from "./App.module.scss";
import LabContainer from "./components/LabContainer.tsx";
import PendulumControls from "./components/PendulumControls.tsx";

export default function App() {
  const [length, setLength] = useState<number>(1);
  const [theta0, setTheta0] = useState<number>(0);

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Mathematical Pendulum Lab</h1>

      <div className={styles.mainGrid}>
        <div className={styles.controlsCol}>
          <PendulumControls setLength={setLength} setTheta0={setTheta0} />
          <LabContainer />
        </div>

        <div className={styles.canvasWrapper}>
          <PendulumCanvas
            length={length > 0 ? length : 1}
            theta0={theta0}
          />
        </div>
      </div>
    </main>
  );
}