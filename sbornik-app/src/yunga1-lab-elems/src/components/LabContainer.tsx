import React, { useState } from "react";
import styles from "./LabContainer.module.scss";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface Measure {
  F: string;          // F, H
  f_nav: string;      // f_нав, м
  f_rozv: string;     // f_розв, м
  f_avg: string;      // f_сер, м
  E: string;          // E, H/м^2
  E_avg: string;      // E_сер, H/м^2
  delta_E: string;    // ΔE, H/м^2
  delta_E_avg: string;// ΔE_сер, H/м^2
  L: string;          // L, м
  b: string;          // b, м
  h: string;          // h, м
}

interface DetailedResult {
  [key: string]: boolean | undefined;
}

const LabContainer: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [measurementsCount, setMeasurementsCount] = useState<string>("3"); // В новой таблице 5 строк

  const createEmptyRow = (): Measure => ({
    F: "", f_nav: "", f_rozv: "", f_avg: "",
    E: "", E_avg: "", delta_E: "", delta_E_avg: "",
    L: "", b: "", h: ""
  });

  const [measures, setMeasures] = useState<Measure[]>(
    Array.from({ length: 3 }, createEmptyRow)
  );

  const [validResults, setValidResults] = useState<DetailedResult[]>([]);

  const validateMeasures = (): string[] => {
    const errs: string[] = [];
    measures.forEach((m, i) => {
      const row = i + 1;
      // Пример валидации для модуля Юнга
      if (Number(m.F) < 0) errs.push(`Рядок ${row}: F не може бути від'ємним`);
      if (Number(m.L) <= 0) errs.push(`Рядок ${row}: L має бути > 0`);
    });
    return errs;
  };

  const handleChange = (rowIndex: number, field: string, value: string) => {
    setMeasures((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [field]: value } : row))
    );
    if (validResults[rowIndex]) {
      setValidResults((prev) =>
        prev.map((res, i) =>
          i === rowIndex ? { ...res, [field]: undefined } : res
        )
      );
    }
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10) || 0;
    const newCount = Math.min(15, Math.max(0, val));
    setMeasurementsCount(`${newCount}`);
    setMeasures((prev) => {
      if (prev.length === newCount) return prev;
      if (prev.length < newCount) {
        return [...prev, ...Array.from({ length: newCount - prev.length }, createEmptyRow)];
      }
      return prev.slice(0, newCount);
    });
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
    const payload = { experiment: "young_modulus", measures }; // Изменили название эксперимента

    try {
      const response = await fetch("http://127.0.0.1:8080/yunga1-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.detailed_results) {
        const rawResults: DetailedResult[] = data.detailed_results;
        const mergedResults = rawResults.slice(0, count).map((item, i) => ({
          ...item,
          ...(rawResults[i + count] || {}),
        }));
        setValidResults(mergedResults);
      }
    } catch {
      setErrors(["Не вдалося з'єднатися з сервером"]);
    }
  };

  const getFieldClassName = (rowIndex: number, fieldName: string) => {
    const rowResult = validResults[rowIndex];
    if (!rowResult || rowResult[fieldName] === undefined) return "";
    return rowResult[fieldName] ? styles.inputCorrect : styles.inputIncorrect;
  };

  return (
    <div className={styles.wrapper} style={{ marginBottom: "30px" }}>
      <section className={styles.inputCard}>
        <h2>Лабораторна робота: Визначення модуля Юнга</h2>

        <div className={styles.formInline}>
          <div className={styles.countContainer}>
            <label>Кількість замірів:</label>
            <input
              type="number"
              min="1"
              max="15"
              value={measurementsCount}
              onChange={handleCountChange}
            />
          </div>
        </div>

        {errors.length > 0 && (
          <div className={styles.errorBox}>
            <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№ п.п.</th>
                  <th><InlineMath math="F, \, \text{H}" /></th>
                  <th><InlineMath math="f_{\text{нав}}, \, \text{м}" /></th>
                  <th><InlineMath math="f_{\text{розв}}, \, \text{м}" /></th>
                  <th><InlineMath math="f_{\text{сер}}, \, \text{м}" /></th>
                  <th><InlineMath math="E, \, \text{Н/м}^2" /></th>
                  <th><InlineMath math="E_{\text{сер}}, \, \text{Н/м}^2" /></th>
                  <th><InlineMath math="\Delta E, \, \text{Н/м}^2" /></th>
                  <th><InlineMath math="\Delta E_{\text{сер}}, \, \text{Н/м}^2" /></th>
                  <th><InlineMath math="L, \, \text{м}" /></th>
                  <th><InlineMath math="b, \, \text{м}" /></th>
                  <th><InlineMath math="h, \, \text{м}" /></th>
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
                          step="0.000001"
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

          <button type="submit" className={styles.downloadBtn} style={{ marginTop: "20px", color: "white", backgroundColor: "#3b82f6" }}>
            Перевірити дані
          </button>
        </form>
      </section>
    </div>
  );
};

export default LabContainer;