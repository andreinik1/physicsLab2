import { Link } from "react-router-dom";
import PendulumApp from '.././pendulum-lab-elems/src/PendulumApp'
import styles from "./PageStyles.module.scss";
import { RiLayoutGrid2Fill } from "react-icons/ri";

const PendulumLab: React.FC = () => {
    return (
        <div >
            <Link to="/" className={styles.linkStyles} style={{height: "24px"}}><RiLayoutGrid2Fill size={24}/></Link>
            <PendulumApp />
        </div>
    );
};

export default PendulumLab;
