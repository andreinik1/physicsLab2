import React from "react";
import styles from "./LabContainer.module.scss";

interface Props {
  p1: number; setP1: (v: number) => void;
  p2: number; setP2: (v: number) => void;
  p3: number; setP3: (v: number) => void;
}

const DensityControls: React.FC<Props> = ({ p1, setP1, p2, setP2, p3, setP3 }) => {
  return (
    <section className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2>Керування установкою</h2>
      <div className={styles.formInline}>
        <div>
          <label>P₁ (Важки порожнього), Н: </label>
          <input type="number" step="0.1" value={p1} onChange={(e) => setP1(+e.target.value)} />
        </div>
        <div>
          <label>P₂ (Важки з тілом зверху), Н: </label>
          <input type="number" step="0.1" value={p2} onChange={(e) => setP2(+e.target.value)} />
        </div>
        <div>
          <label>P₃ (Важки з тілом знизу), Н: </label>
          <input type="number" step="0.1" value={p3} onChange={(e) => setP3(+e.target.value)} />
        </div>
      </div>
    </section>
  );
};

export default DensityControls;