import { Link } from "react-router-dom";

const Menu: React.FC = () => {
  return (
    <div>
      <h2>Каталог лабораторных</h2>

      <ul>
        <li>
          <Link to="/pendulum">Маятник</Link>
        </li>
        <li>
          <Link to="/young1">Лабораторная Юнга 1</Link>
        </li>
        <li>
          <Link to="/young2">Лабораторная Юнга 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;