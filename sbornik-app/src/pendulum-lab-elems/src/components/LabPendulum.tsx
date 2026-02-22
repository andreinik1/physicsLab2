import React, { useMemo } from 'react';
import styles from './LabPendulum.module.scss';

interface Measurement {
    L: number;
    N: number;
    t: number;
    T_student: number;
    g_student: number;
}

interface LabPendulumProps {
    measurements: Measurement[];
    studentName?: string;
}

const LabPendulum: React.FC<LabPendulumProps> = ({ measurements, studentName }) => {
    const results = useMemo(() => {
        if (measurements.length === 0) return null;
        const gValues = measurements.map(d => d.g_student);
        const gAvg = gValues.reduce((a, b) => a + b, 0) / gValues.length;
        const deltaG = gValues.reduce((acc, g) => acc + Math.abs(gAvg - g), 0) / gValues.length;
        const epsilon = (deltaG / gAvg) * 100;

        return { gAvg, deltaG, epsilon };
    }, [measurements]);

    if (!results) return null;

    return (
        <div className={styles.container}>
            <section className={styles.resultsSection}>
                <h3>Результати розрахунків учня:</h3>
                <p>Середнє g: {results.gAvg.toFixed(3)} м/с²</p>
                <p>Похибка: {results.epsilon.toFixed(2)}%</p>
                {studentName && <p>Звіт сформовано для: {studentName}</p>}
            </section>
        </div>
    );
};

export default LabPendulum;