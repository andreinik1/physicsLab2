import { Link } from "react-router-dom";
import "./Menu.scss"

const Menu: React.FC = () => {
  return (
    <div>
      <h2>Каталог лабораторих робіт</h2>

      <table style={{margin: "0 auto"}}>
      <tbody>
         <tr>
            <td>  
              <Link to="/pendulum" className="linkStyles">Лабараторна Математичний маятник</Link>
	    </td>
	    <td>
              <Link to="/young1" className="linkStyles">Лабораторнa Юнга 1</Link>
	    </td>
	    <td>
              <Link to="/young2" className="linkStyles">Лабораторня Юнга 2</Link>
	    </td>
	  </tr>
	  </tbody>
      </table>
    </div>
  );
};

export default Menu;
