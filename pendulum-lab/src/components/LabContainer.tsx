import React, { useState } from "react";
import styles from "./LabContainer.module.scss";

interface Measure {
  L: string;
  N: string;
  t: string;
  T: string;
  g: string;
  g_avg: string;
  delta_g: string;
  delta_g_avg: string;
}

const LabContainer: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [measurementsCount, setMeasurementsCount] = useState<string | null>(
    "3",
  );
  const [measures, setMeasures] = useState<Measure[]>(
    Array.from({ length: Number(measurementsCount) || 3 }, () => ({
      L: "",
      N: "",
      t: "",
      T: "",
      g: "",
      g_avg: "",
      delta_g: "",
      delta_g_avg: "",
    })),
  );
  const [validRows, setValidRows] = useState<boolean[]>(
    Array(measures.length).fill(undefined),
  );

  const validateMeasures = (): string[] => {
    const errs: string[] = [];

    measures.forEach((m, i) => {
      const row = i + 1;

      const L = Number(m.L);
      const N = Number(m.N);
      const t = Number(m.t);
      const T = Number(m.T);
      const g = Number(m.g);
      const gAvg = Number(m.g_avg);
      const dG = Number(m.delta_g);
      const dGAvg = Number(m.delta_g_avg);

      if (L <= 0) errs.push(`Рядок ${row}: L має бути > 0`);
      if (!Number.isInteger(N) || N <= 0)
        errs.push(`Рядок ${row}: N має бути цілим числом > 0`);
      if (t <= 0) errs.push(`Рядок ${row}: t має бути > 0`);
      if (T <= 0) errs.push(`Рядок ${row}: T має бути > 0`);
      if (g <= 0 || g > 20)
        errs.push(`Рядок ${row}: g має бути в межах (0, 20)`);
      if (gAvg <= 0 || gAvg > 20)
        errs.push(`Рядок ${row}: g_avg має бути в межах (0, 20)`);
      if (dG < 0) errs.push(`Рядок ${row}: delta_g ≥ 0`);
      if (dGAvg < 0) errs.push(`Рядок ${row}: delta_g_avg ≥ 0`);
    });

    return errs;
  };

  const handleChange = (rowIndex: number, field: string, value: string) => {
    setMeasures((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row)),
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateMeasures();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log(measures);

    setErrors([]);

    const payload = { studentName, experiment: "pendulum", measures };
    const response = await fetch("http://127.0.0.1:8080/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setValidRows(data.result);
  };

  const downloadSample = () => {
    const fileUrl = "./lab2.doc";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "ЛБ 2 Приск. вільн. пад.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    const newCount = Math.min(10, Math.max(0, val));

    // 1. Обновляем само число
    setMeasurementsCount(`${newCount}`);

    // 2. Сразу же обновляем массив строк (вместо useEffect)
    setMeasures((prev) => {
      if (prev.length === newCount) return prev;

      if (prev.length < newCount) {
        const extra: Measure[] = Array.from(
          { length: newCount - prev.length },
          () => ({
            L: "",
            N: "",
            t: "",
            T: "",
            g: "",
            g_avg: "",
            delta_g: "",
            delta_g_avg: "",
          }),
        );
        return [...prev, ...extra];
      } else {
        return prev.slice(0, newCount);
      }
    });

    // 3. Обнуляем валидацию
    setValidRows(Array(newCount).fill(undefined));
  };

  return (
    <div className={styles.wrapper} style={{ marginBottom: "30px" }}>
      <section className={styles.inputCard}>
        <h2>Лабораторная работа: Маятник</h2>

        <div className={styles.formInline}>
          <input
            type="text"
            placeholder="Прізвище учня"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
          <div className={styles.countContainer}>
            <label>Кількість замірів (max 10):</label>
            <input
              type="number"
              min="1"
              max="10"
              placeholder="Введіть кількість замірів"
              value={`${measurementsCount}`}
              onChange={handleCountChange}
            />
          </div>
          <button onClick={downloadSample} className={styles.downloadBtn}>
            Скачати зразок виконання
          </button>
        </div>

        {errors.length > 0 && (
          <div className={styles.errorBox}>
            <ul>
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formInline}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th>№</th>
                <th>L (m)</th>
                <th>N</th>
                <th>t (c)</th>
                <th>T (c)</th>
                <th>g (m/s²)</th>
                <th>g_avg (m/s²)</th>
                <th>delta_g (m/s²)</th>
                <th>delta_g_avg (m/s²)</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((row, i) => (
                <tr
                  key={i}
                  className={
                    validRows === undefined
                      ? ""
                      : validRows[i]
                        ? "rowCorrect"
                        : "rowIncorrect"
                  }
                >
                  <td>&nbsp;</td>
                  <td>{i + 1}</td>
                  {Object.keys(row).map((key) => (
                    <td key={key}>
                      <input
                        type="number"
                        step={key === "N" ? 1 : 0.001}
                        value={row[key as keyof Measure]}
                        onChange={(e) => handleChange(i, key, e.target.value)}
                        required
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button type="submit" className={`${styles.startButton}`}>
            Додати та перевірити
          </button>
        </form>
      </section>
    </div>
  );
};

export default LabContainer;
