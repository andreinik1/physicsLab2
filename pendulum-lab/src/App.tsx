import { useState } from "react";
import { PendulumCanvas } from "./components/PendulumCanvas";
import { Controls } from "./components/Controls";
import styles from "./App.module.scss";
import { checkValues } from "./api.ts"
import LabContainer from "./components/LabContainer.tsx";

export default function App() {
  const [length, setLength] = useState<number | null>(1);
  const [theta0, setTheta0] = useState<number>(0);

  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState('');


  const handleCheck = async () => {
    try {
      const data = await checkValues(val1, val2);
      setResult(data.result);
    } catch (error) {
      setResult("Ошибка: Бэкенд не отвечает");
    }
  };


  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Mathematical pendulum</h1>

      <div>
        <input value={val1} onChange={(e) => setVal1(e.target.value)} />
        <input value={val2} onChange={(e) => setVal2(e.target.value)} />
        <button onClick={handleCheck}>Проверить</button>
        <p>{result}</p>
        <p id="debug_text">Debug</p>

      </div>

      <LabContainer setLength={setLength} />
      <div className={styles.content}>
        <div className={styles.panel}>
          <Controls
            setTheta0={setTheta0}
          />
        </div>

        <div className={styles.canvasWrapper}>
          <PendulumCanvas
            length={length && length > 0 ? length : 1}
            theta0={theta0}
          />
        </div>


      </div>
    </main>
  );
}
