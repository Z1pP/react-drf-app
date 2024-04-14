import header_logp from "../../assets/car-logo.svg";
import Navbar from "./Navbar.jsx";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link className="header__logo" to={"/"}>
          <img className="header__logo-img" src={header_logp} alt="logo" />
          <h1 className="header__logo-text">Ведра.by</h1>
        </Link>
        <Navbar />
      </div>
    </header>
  );
}
