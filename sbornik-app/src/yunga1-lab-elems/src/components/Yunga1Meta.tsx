import styles from "./LabContainer.module.scss";

const Yunga1Meta: React.FC = () => {


  return (
    <div className={styles.inputCard} style={{ marginBottom: "30px" }}>
      <h2 style={{ marginBottom: "6px" }}>Мета лабораторної роботи: </h2>
      <p style={{ margin: "0 0 16px 28px" }}>Визначити модуль пружності (модуль Юнга) для сталі при згині стержня.
      </p>
      <h2 style={{ marginBottom: "6px" }}>Прилади та обладнання: </h2>
      <p style={{ margin: "0 0 0 28px" }}>1.	Прилад для визначення модуля пружності<br />
        2.	Індикатор. <br />
        3.  Мікрометр. <br />
        4.  Масштабна лінійка.
      </p>
    </div>
  );
};

export default Yunga1Meta;
