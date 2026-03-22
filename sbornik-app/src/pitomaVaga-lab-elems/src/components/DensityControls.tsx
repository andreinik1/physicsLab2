import React from "react";
import styles from "./LabContainer.module.scss";

interface Props {
  p1: number; setP1: (v: number) => void;
  p2: number; setP2: (v: number) => void;
  p3: number; setP3: (v: number) => void;
}

const DensityControls: React.FC<Props> = ({ p1, setP1, p2, setP2, p3, setP3 }) => {
  const handleReset = () => {
    setP1(1.5);
    setP2(0.8);
    setP3(1.1);
  };

  return (
    <section className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2>Керування вагами</h2>
      <p style={{ fontSize: "0.9em", color: "#666" }}>Налаштуйте вагу різноваг на чашках:</p>

      <div className={styles.formInline}>
        <div>
          <label>P₁ (Порожній), Н: </label>
          <input type="number" step="0.1" value={p1} onChange={(e) => setP1(+e.target.value)} />
        </div>

        <div>
          <label>P₂ (Тіло зверху), Н: </label>
          <input type="number" step="0.1" value={p2} onChange={(e) => setP2(+e.target.value)} />
        </div>

        <div>
          <label>P₃ (Тіло знизу), Н: </label>
          <input type="number" step="0.1" value={p3} onChange={(e) => setP3(+e.target.value)} />
        </div>
      </div>

      <button type="button" onClick={handleReset} className={styles.downloadBtn}
        style={{ marginTop: "15px", backgroundColor: "#ef4444", color: "white" }}>
        Скинути дослід
      </button>
    </section>
  );
};

export default DensityControls;