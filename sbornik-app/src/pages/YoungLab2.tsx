import { Link } from "react-router-dom";
import styles from "./PageStyles.module.scss";

const YoungLab2: React.FC = () => {
  return (
    <div>
      <h1>Лабораторная Юнга №2</h1>

      <p>Тут будет вторая версия опыта Юнга.</p>

      <Link to="/" className={styles.linkStyles} >Назад в меню</Link>
    </div>
  );
};

export default YoungLab2;