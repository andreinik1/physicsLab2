import { useState } from "react";
import { Yunga1Canvas } from "./components/Yunga1Canvas";
import Yunga1Controls from "./components/Yunga1Controls";
import Yunga1Meta from "./components/Yunga1Meta.tsx";
import LabContainer from "./components/LabContainer.tsx";
import styles from "./App.module.scss";

export default function YoungApp() {
  const [force, setForce] = useState(0);
  const [length, setLength] = useState("0.6");
  const [d, setD] = useState("0.0004");
  const [E, setE] = useState(2e11);

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Лабораторна робота</h1>
      <h2 className={styles.subtitle}>
        Визначення модуля Юнга при розтягу дроту
      </h2>

      <div className={styles.mainGrid}>
        <div className={styles.controlsCol}>
        <Yunga1Meta/>  
	<Yunga1Controls
            force={force}
            setForce={setForce}
            length={length}
            setLength={setLength}
            d={d}
            setD={setD}
            E={E}
            setE={setE}
          />
        </div>
        <LabContainer />

        <div className={styles.canvasWrapper}>
          <Yunga1Canvas
            force={force}
            length={+length}
            d={+d}
            E={E}
          />
        </div>
      </div>
    </main>
  );
}
