import { useState } from "react";
import { PendulumCanvas } from "./components/PendulumCanvas.tsx";
import styles from "./App.module.scss";
import LabContainer from "./components/LabContainer.tsx";
import PendulumControls from "./components/PendulumControls.tsx";
import PendulumMeta from "./components/PendulumMeta.tsx";

export default function PendulumApp() {
  const [length, setLength] = useState<number>(1);
  const [theta0, setTheta0] = useState<number>(0.52);
  const [mode, setMode] = useState<"infinite" | "fixed">("fixed");
  const [targetN, setTargetN] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [isMeasuringPeriod, setIsMeasuringPeriod] = useState(false);
  const [stats, setStats] = useState({ currentN: 0, time: 0 });

  const handleUpdate = (data: {
    currentN: number;
    currentTime: number;
    isFinished: boolean;
  }) => {
    setStats({ currentN: data.currentN, time: data.currentTime });

    if (isMeasuringPeriod && data.currentN === 1) {
      setIsMeasuringPeriod(false);
      setIsRunning(false);
    } else if (data.isFinished) {
      setIsRunning(false);
    }
  };

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Лабораторна робота</h1>
      <h2 className={styles.title} style={{ marginTop: "0", textAlign: "center", fontSize: "24px" }}>Визначення прискорення вільного падіння за допомогою
        математичного маятника
      </h2>
      <div className={styles.mainGrid}>
        <PendulumMeta />
        <div className={styles.controlsCol}>
          <PendulumControls
            setLength={setLength}
            setTheta0={setTheta0}
            setMode={setMode}
            setTargetN={setTargetN}
            setIsRunning={setIsRunning}
            stats={stats}
          />

          <LabContainer />
        </div>
        <div className={styles.canvasWrapper}>
          <PendulumCanvas
            length={length}
            theta0={theta0}
            mode={mode}
            targetN={targetN}
            isRunning={isRunning}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </main>
  );
}
