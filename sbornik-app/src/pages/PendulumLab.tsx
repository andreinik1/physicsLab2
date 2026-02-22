import { Link } from "react-router-dom";
import PendulumApp from '.././pendulum-lab-elems/src/PendulumApp'
import styles from "./PageStyles.module.scss";

const PendulumLab: React.FC = () => {
    return (
        <div >
            <Link to="/" className={styles.linkStyles} >Назад в меню</Link>
            <PendulumApp />
        </div>
    );
};

export default PendulumLab;