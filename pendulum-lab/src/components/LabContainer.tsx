import React, { useState } from 'react';
import LabPendulum from './LabPendulum';
import styles from './LabContainer.module.scss';

interface LabContainerProps {
    // Функція, яка приймає число і нічого не повертає
    setLength: (length: number) => void;
}

interface Measurement {
    L: number; // Довжина нитки (м)
    N: number; // Кількість коливань
    t: number; // Час (с)
}

const LabContainer: React.FC<LabContainerProps> = ({ setLength }) => {
    const [studentName, setStudentName] = useState<string>('');
    const [measurements, setMeasurements] = useState<Measurement[]>([]);

    // Тимчасові стани для полів вводу
    const [newL, setNewL] = useState<string>('1');
    const [newN, setNewN] = useState<string>('20');
    const [newT, setNewT] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const stringVal = e.target.value;

        if (stringVal === "") {
            setNewL("");
            setLength(0);
            return;
        }

        const val = parseFloat(stringVal);

        const sanitizedVal = val > 4 ? 4 : val < 0 ? 0 : val;

        setLength(sanitizedVal);
        setNewL(`${sanitizedVal}`);
    };

    const addMeasurement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newL || !newN || !newT) return;

        const entry: Measurement = {
            L: parseFloat(newL),
            N: parseInt(newN),
            t: parseFloat(newT),
        };

        setMeasurements([...measurements, entry]);
        setNewT('');
    };

    const clearData = () => {
        if (window.confirm('Видалити всі вимірювання?')) setMeasurements([]);
    };

    return (
        <div className={styles.wrapper}>
            <section className={styles.inputCard}>
                <h2>Введення даних лаби</h2>

                <div className={styles.field}>
                    <label>Прізвище та Ім'я:</label>
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Введіть ваше ПІБ"
                    />
                </div>

                <form onSubmit={addMeasurement} className={styles.formInline}>
                    <div className={styles.field}>
                        <label>L (довжина, м):</label>
                        <input
                            type="number"
                            step="0.1"
                            value={newL ? newL : ""}
                            onChange={(e) => {
                                handleChange(e)
                            }}
                            placeholder='Input start length'
                        />
                    </div>
                    <div className={styles.field}>
                        <label>N (кількість):</label>
                        <input
                            type="number"
                            value={newN}
                            onChange={(e) => setNewN(e.target.value)}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>t (час, с):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={newT}
                            onChange={(e) => setNewT(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.addButton}>Додати вимірювання</button>
                </form>

                <button onClick={clearData} className={styles.clearButton}>Очистити таблицю</button>
            </section>

            <hr className={styles.divider} />

            {measurements.length > 0 ? (
                <LabPendulum measurements={measurements} studentName={studentName} />
            ) : (
                <p className={styles.emptyHint}>Додайте хоча б одне вимірювання, щоб побачити розрахунки.</p>
            )}
        </div>
    );
};

export default LabContainer;