import React, { useState } from "react";
import styles from "./LabContainer.module.scss";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";


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

// Интерфейс для детальных результатов проверки от сервера
interface DetailedResult {
  [key: string]: boolean | undefined;
}

const LabContainer: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [measurementsCount, setMeasurementsCount] = useState<string>("3");

  // Инициализация пустого массива измерений
  const [measures, setMeasures] = useState<Measure[]>(
    Array.from({ length: 3 }, () => ({
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

  // Стейт для хранения результатов проверки каждого поля
  const [validResults, setValidResults] = useState<DetailedResult[]>([]);

  // Валидация перед отправкой
  const validateMeasures = (): string[] => {
    const errs: string[] = [];
    measures.forEach((m, i) => {
      const row = i + 1;
      if (Number(m.L) <= 0) errs.push(`Рядок ${row}: L має бути > 0`);
      if (!Number.isInteger(Number(m.N)) || Number(m.N) <= 0)
        errs.push(`Рядок ${row}: N має бути цілим числом > 0`);
      if (Number(m.t) <= 0) errs.push(`Рядок ${row}: t має бути > 0`);
    });
    return errs;
  };

  const handleChange = (rowIndex: number, field: string, value: string) => {
    setMeasures((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row)),
    );
    // Сбрасываем подсветку ошибки для конкретного поля при его изменении
    if (validResults[rowIndex]) {
      setValidResults((prev) =>
        prev.map((res, i) =>
          i === rowIndex ? { ...res, [field]: undefined } : res,
        ),
      );
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    const newCount = Math.min(10, Math.max(0, val));

    setMeasurementsCount(`${newCount}`);

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

    // Сбрасываем валидацию при изменении размера таблицы
    setValidResults([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateMeasures();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    const count = Number(measurementsCount);
    const payload = { experiment: "pendulum", measures };

    try {
      const response = await fetch("http://127.0.0.1:8080/pendulum-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.detailed_results) {
        const rawResults: DetailedResult[] = data.detailed_results;

        // Магия объединения:
        // Мы берем только первые 'count' элементов и подмешиваем в них
        // данные из второй половины массива (i + count)
        const mergedResults = rawResults.slice(0, count).map((item, i) => {
          const summaryData = rawResults[i + count] || {};
          return {
            ...item,
            ...summaryData,
          };
        });

        setValidResults(mergedResults);
      }
    } catch {
      setErrors(["Не вдалося з'єднатися з сервером"]);
    }
  };
  const downloadSample = () => {
    const link = document.createElement("a");
    link.href = "./lab2.doc";
    link.download = "ЛБ 2 Приск. вільн. пад.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Хелпер для получения класса валидации ячейки
  const getFieldClassName = (rowIndex: number, fieldName: string) => {
    const rowResult = validResults[rowIndex];
    if (!rowResult || rowResult[fieldName] === undefined) return "";
    return rowResult[fieldName] ? styles.inputCorrect : styles.inputIncorrect;
  };

  return (
    <div className={styles.wrapper} style={{ marginBottom: "30px" }}>
      <section className={styles.inputCard}>
        <h2>Лабораторна робота: Математичний Маятник</h2>

        <div className={styles.formInline}>

          <div className={styles.countContainer}>
            <label>Кількість замірів (max 10):</label>
            <input
              type="number"
              min="1"
              max="10"
              value={measurementsCount}
              onChange={handleCountChange}
            />
          </div>
          <button
            type="button"
            onClick={downloadSample}
            className={styles.downloadBtn}
          >
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

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th><InlineMath math="№" /> </th>
                  <th><InlineMath math="L (m)" /> </th>
                  <th><InlineMath math="N" /> </th>
                  <th><InlineMath math="t (c)" /> </th>
                  <th><InlineMath math="T (c)" /> </th>
                  <th><InlineMath math="g \, [m/s^2]" /></th>
                  <th><InlineMath math="g_{\text{сер}} \, [m/s^2]" /></th>
                  <th><InlineMath math="\Delta g \, [m/s^2]" /></th>
                  <th><InlineMath math="\Delta g_{\text{сер}} \, [m/s^2]" /></th>
                </tr>
              </thead>
              <tbody>
                {measures.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    {(Object.keys(row) as Array<keyof Measure>).map((key) => (
                      <td key={key}>
                        <input
                          type="number"
                          step={key === "N" ? 1 : 0.001}
                          value={row[key]}
                          onChange={(e) => handleChange(i, key, e.target.value.replaceAll(",", "."))}
                          className={getFieldClassName(i, key)}
                          required
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className={styles.downloadBtn}
            style={{
              marginTop: "20px",
              color: "white",
              backgroundColor: "#3b82f6",
            }}
          >
            Додати та перевірити
          </button>
        </form>
      </section>
    </div>
  );
};

export default LabContainer;
