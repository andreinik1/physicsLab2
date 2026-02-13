import React, { useState } from 'react';
import LabPendulum from './LabPendulum';
import styles from './LabContainer.module.scss';
import { checkMeasurement } from '../api';

interface Measurement {
    L: number;
    N: number;
    t: number;
    T_student: number;
    g_student: number;
    status: 'idle' | 'correct' | 'incorrect';
}

const LabContainer: React.FC = () => {
    const [studentName, setStudentName] = useState('');
    const [measurements, setMeasurements] = useState<Measurement[]>([]);

    // Поля ввода для нового замера
    const [row, setRow] = useState({ L: 1, N: 20, t: 0, T: 0, g: 0 });

    const addAndVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        // Отправляем на сервер для проверки
        try {
            const response = await checkMeasurement({
                L: row.L, N: row.N, t: row.t,
                T_student: row.T, g_student: row.g
            });

            const newEntry: Measurement = {
                ...row,
                T_student: row.T,
                g_student: row.g,
                status: response.is_correct ? 'correct' : 'incorrect'
            };

            setMeasurements([...measurements, newEntry]);
        } catch (error) {
            alert("Ошибка связи с сервером");
        }
    };

    return (
        <div className={styles.wrapper}>
            <section className={styles.inputCard}>
                <input
                    placeholder="Прізвище учня"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                />

                <form onSubmit={addAndVerify} className={styles.formInline}>
                    <div className={styles.field}>
                        <label>L (м):</label>
                        <input step="0.01" placeholder="0.00" onChange={e => setRow({ ...row, L: +e.target.value })} required />
                    </div>

                    <div className={styles.field}>
                        <label>N (кількість):</label>
                        <input placeholder="0" onChange={e => setRow({ ...row, N: +e.target.value })} required />
                    </div>

                    <div className={styles.field}>
                        <label>t (час, с):</label>
                        <input step="0.01" placeholder="0.00" onChange={e => setRow({ ...row, t: +e.target.value })} required />
                    </div>

                    <div className={styles.field}>
                        <label>Ваш T (с):</label>
                        <input step="0.001" placeholder="0.000" onChange={e => setRow({ ...row, T: +e.target.value })} required />
                    </div>

                    <div className={styles.field}>
                        <label>Ваш g (м/с²):</label>
                        <input step="0.001" placeholder="0.000" onChange={e => setRow({ ...row, g: +e.target.value })} required />
                    </div>

                    <button type="submit" className={styles.submitButton}>Додати та перевірити</button>
                </form>
            </section>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>L</th><th>N</th><th>t</th><th>T (учня)</th><th>g (учня)</th><th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {measurements.map((m, i) => (
                        <tr key={i} style={{ backgroundColor: m.status === 'correct' ? '#dcfce7' : '#fee2e2' }}>
                            <td>{m.L}</td><td>{m.N}</td><td>{m.t}</td>
                            <td>{m.T_student}</td><td>{m.g_student}</td>
                            <td>{m.status === 'correct' ? '✅ Вірно' : '❌ Помилка'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {measurements.length > 0 && <LabPendulum measurements={measurements} studentName={studentName} />}
        </div>
    );
};

export default LabContainer; 