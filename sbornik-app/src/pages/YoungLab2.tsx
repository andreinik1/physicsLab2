import { Link } from "react-router-dom";
import styles from "./PageStyles.module.scss";
import Yunga1 from '../yunga2-lab-elems/src/Yunga1'
import { RiLayoutGrid2Fill} from "react-icons/ri";

const YoungLab1: React.FC = () => {
  return (
    <div>
       <Link to="/" className={styles.linkStyles} style={{height: "24px"}}><RiLayoutGrid2Fill size={24}/></Link>
      <Yunga1 />
    </div>
  );
};

export default YoungLab1;
