import React from "react";
import styles from "./LabContainer.module.scss";

const DensityMeta: React.FC = () => {
  return (
    <div className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2 style={{ marginBottom: "6px" }}>Мета лабораторної роботи:</h2>
      <p style={{ margin: "0 0 16px 28px" }}>
        Ознайомитись із теорією густини та питомої ваги і експериментально
        визначити ці величини для тіла за допомогою ареометра.
      </p>
      <h2 style={{ marginBottom: "6px" }}>Прилади та обладнання:</h2>
      <p style={{ margin: "0 0 0 28px" }}>
        1. Ареометр з постійним об'ємом<br />
        2. Посудина з водою.<br />
        3. Експериментальні тіла.<br />
        4. Терези.
      </p>
    </div>
  );
};

export default DensityMeta;