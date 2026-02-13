import React, { useState } from 'react';
import styles from './LabContainer.module.scss';

interface Props {
    setLength: (l: number) => void;
    setTheta0: (t: number) => void;
}

const PendulumControls: React.FC<Props> = ({ setLength, setTheta0 }) => {
    const [currTheta, setCurrTheta] = useState<number>(30);
    const [newL, setNewL] = useState<string>('1');

    const handleThetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const deg = Math.min(90, Math.max(0, +e.target.value));
        setCurrTheta(deg);
        setTheta0((deg * Math.PI) / 180);
    };

    const handleChangeL = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value) || 0;
        const sanitized = Math.min(4, Math.max(0, val));
        setNewL(e.target.value);
        setLength(sanitized);
    };

    return (
        <section className={styles.inputCard}>
            <h2>Параметри маятника</h2>
            <div className={styles.formInline}>
                <div className={styles.field}>
                    <label>Кут (град):</label>
                    <input type="number" value={currTheta} onChange={handleThetaChange} />
                </div>
                <div className={styles.field}>
                    <label>L (довжина, м):</label>
                    <input type="number" step="0.1" value={newL} onChange={handleChangeL} />
                </div>
                <button className={styles.startButton}>▶ Start</button>
            </div>
        </section>
    );
};

export default PendulumControls;