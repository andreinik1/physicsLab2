import { Link } from "react-router-dom";
import styles from "./PageStyles.module.scss";
import { RiLayoutGrid2Fill} from "react-icons/ri";

const YoungLab2: React.FC = () => {
  return (
    <div>
      <h1>Лабораторная Юнга №2</h1>

      <p>Тут будет вторая версия опыта Юнга.</p>

       <Link to="/" className={styles.linkStyles} style={{height: "24px"}}><RiLayoutGrid2Fill size={24}/></Link>
    </div>
  );
};

export default YoungLab2;
