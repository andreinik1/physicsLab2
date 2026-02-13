import { useState } from "react";
import { PendulumCanvas } from "./components/PendulumCanvas";
import { Controls } from "./components/Controls";
import LabPendulum from "./components/LabPendulum"
import styles from "./App.module.scss";
import { checkValues } from "./api.ts"

interface Measurement {
  L: number; // Довжина нитки (м)
  N: number; // Кількість коливань
  t: number; // Час (с)
}



export default function App() {
  const [length, setLength] = useState<number | null>(3);
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

  const sampleMeasurements: Measurement[] = [
    {
      L: 0.500, // Довжина маятника в метрах (наприклад, 50 см)
      N: 20,    // Кількість повних коливань
      t: 28.42  // Час, виміряний секундоміром для цих 20 коливань
    },
    {
      L: 0.500,
      N: 20,
      t: 28.55
    },
    {
      L: 0.500,
      N: 20,
      t: 28.38
    },
    {
      L: 0.800, // Можна змінити довжину для інших дослідів
      N: 15,
      t: 26.95
    },
    {
      L: 0.800,
      N: 15,
      t: 27.10
    }
  ];

  const studentName = "Іван Іванов";

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

      <LabPendulum measurements={sampleMeasurements} studentName={studentName} />
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


      </div>
    </main>
  );
}
