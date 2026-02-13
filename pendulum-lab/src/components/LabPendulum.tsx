import React, { useMemo } from 'react';
import styles from './LabPendulum.module.scss';


interface LabPendulumProps {
    measurements: Measurement[];
    studentName?: string;
}

interface Measurement {
    L: number; // Довжина нитки (м)
    N: number; // Кількість коливань
    t: number; // Час (с)
}

interface CalculationResult extends Measurement {
    T: number; // Період
    g: number; // Прискорення
}

const LabPendulum: React.FC<LabPendulumProps> = ({ measurements, studentName }) => {

    const results = useMemo(() => {
        const data: CalculationResult[] = measurements.map((m) => {
            const T = m.t / m.N;
            const g = (4 * Math.PI ** 2 * m.L) / Math.pow(T, 2);
            return { ...m, T, g };
        });

        if (data.length === 0) return null;

        const gValues = data.map(d => d.g);
        const gAvg = gValues.reduce((a, b) => a + b, 0) / gValues.length;

        // Абсолютна похибка
        const deltaG = gValues.reduce((acc, g) => acc + Math.abs(gAvg - g), 0) / gValues.length;

        // Відносна похибка
        const epsilon = (deltaG / gAvg) * 100;

        return { data, gAvg, deltaG, epsilon };
    }, [measurements]);

    if (!results) return <div>Дані для розрахунків відсутні.</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Лабораторна робота №2</h1>
                <p className={styles.subtitle}>Визначення прискорення вільного падіння</p>
                {studentName && <p>Виконав: <strong>{studentName}</strong></p>}
            </header>

            <section className={styles.theorySection}>
                <h3>Розрахункові формули</h3>
                <div className={styles.formulaGrid}>
                    <div className={styles.formulaCard}>
                        <small>Період коливань</small>
                        <div>{`T = t / N`}</div>
                    </div>
                    <div className={styles.formulaCard}>
                        <small>Прискорення g</small>
                        <div>{`g = (4π² * L) / T²`}</div>
                    </div>
                </div>
            </section>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>L (м)</th>
                            <th>N</th>
                            <th>t (с)</th>
                            <th>T (с)</th>
                            <th>g (м/с²)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.data.map((row, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{row.L.toFixed(3)}</td>
                                <td>{row.N}</td>
                                <td>{row.t.toFixed(2)}</td>
                                <td>{row.T.toFixed(3)}</td>
                                <td style={{ color: '#2563eb', fontWeight: 'bold' }}>
                                    {row.g.toFixed(3)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <section className={styles.resultsSection}>
                <div>
                    <h4>Середні значення:</h4>
                    <p>{`g_cp = ${results.gAvg.toFixed(3)} м/с²`}</p>
                    <p>{`Delta g = ${results.deltaG.toFixed(3)} м/с²`}</p>
                    <div className={styles.resultBox}>
                        g = ({results.gAvg.toFixed(2)} ± {results.deltaG.toFixed(2)}) м/с²
                    </div>
                </div>
                <div>
                    <h4>Похибка:</h4>
                    <p className={styles.errorText}>
                        {`varepsilon = ${results.epsilon.toFixed(2)}\%`}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default LabPendulum;