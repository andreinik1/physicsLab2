import { Link } from "react-router-dom";
import styles from "./PageStyles.module.scss";
import PitomaVaga from '../pitomaVaga-lab-elems/src/DensityLab'
import { RiLayoutGrid2Fill } from "react-icons/ri";

const PitomaVagaPage: React.FC = () => {
  return (
    <div>
      <Link to="/" className={styles.linkStyles} style={{ height: "24px" }}><RiLayoutGrid2Fill size={24} /></Link>
      <PitomaVaga />
    </div>
  );
};

export default PitomaVagaPage;
