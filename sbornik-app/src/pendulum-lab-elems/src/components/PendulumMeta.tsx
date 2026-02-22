import React, { useState } from "react";
import styles from "./LabContainer.module.scss";



const PendulumMeta: React.FC = ({ }) => {


  return (
    <div className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2 style={{marginBottom: "6px"}}>Мета лабораторної роботи: </h2>
      <p style={{ margin: "0 0 16px 28px" }}>1.	Виміряти прискорення вільного падіння по періоду коливання
        математичного маятника;<br />
        2.	Визначити закони гармонічного коливального руху.
      </p>
      <h2 style={{marginBottom: "6px"}}>Прилади та обладнання: </h2>
      <p style={{ margin: "0 0 0 28px" }}>1.	Важка   кулька,   яка   підвішена   на   легкій   нитці,   що   не розтягується;<br />
        2.	Секундомір.
      </p>
    </div>
  );
};

export default PendulumMeta;
