import { useState } from "react";
import { PendulumCanvas } from "./components/PendulumCanvas";
import { Controls } from "./components/Controls";
import styles from "./App.module.scss";

export default function App() {
  const [length, setLength] = useState<number | null>(3);
  const [theta0, setTheta0] = useState<number>(0);

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Mathematical pendulum</h1>

      <div className={styles.content}>
        <div className={styles.panel}>
          <Controls
            length={length}
            setLength={setLength}
            setTheta0={setTheta0}
          />
        </div>

        <div className={styles.canvasWrapper}>
          <PendulumCanvas
            length={length && length > 0 ? length : 1}
            theta0={theta0}
          />
        </div>

        <div className={styles.panel}>
          <Controls
            length={length}
            setLength={setLength}
            setTheta0={setTheta0}
          />
        </div>
      </div>
    </main>
  );
}
