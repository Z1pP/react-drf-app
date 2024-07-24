import { Link } from "react-router-dom";
// images
import lada_svg from "../../assets/lada.webp";


export default function SideBar() {
    return (
      <div className="layout__sidebar">
        <Link className="sidebar__lada" to={"/sale"}>
          <img src={lada_svg} alt="lada" />
          <p className="text-1">Подать обьявление</p>
          <p className="text-2">о продаже авто</p>
        </Link>
      </div>
    );
  }