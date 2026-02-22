import { Link } from "react-router-dom";
import styles from "./PageStyles.module.scss";
import Yunga1 from '../yunga1-lab-elems/src/Yunga1'

const YoungLab1: React.FC = () => {
  return (
    <div>
      <Link to="/" className={styles.linkStyles} >Назад в меню</Link>
      <Yunga1 />
    </div>
  );
};

export default YoungLab1;