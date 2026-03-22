import { useState } from "react";
import { DensityCanvas } from "./components/DensityCanvas";
import DensityControls from "./components/DensityControls";
import DensityMeta from "./components/DensityMeta";
import LabTable from "./components/LabTable";
import styles from "./App.module.scss";

export default function DensityLab() {
  const [p1, setP1] = useState(1.5); // Вага грузів для порожнього
  const [p2, setP2] = useState(0.8); // Вага грузів + тіло зверху
  const [p3, setP3] = useState(1.1); // Вага грузів + тіло знизу

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Лабораторна робота №6</h1>
      <h2 className={styles.subtitle}>Визначення питомої ваги та густини тіла</h2>

      <div className={styles.mainGrid}>
        <div>
          <DensityMeta />
          <DensityControls 
            p1={p1} setP1={setP1}
            p2={p2} setP2={setP2}
            p3={p3} setP3={setP3}
          />
        </div>
        <LabTable />
        <div className={styles.canvasContainer}>
           {/* Передаем текущий этап для анимации */}
           <DensityCanvas p1={p1} p2={p2} p3={p3} />
        </div>
      </div>
    </main>
  );
}