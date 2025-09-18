import { Link } from "react-router-dom";
import "/src/css/Header.css";

export default function Header() {
  return (
    <header>
      <div className="logo-title">
        <img src="/src/imagem/favicon-planeta.png" alt="Logo" width={48} />
        <h1>Papelaria Pó de Giz</h1>
      </div>

      <nav>
        <div className="nav-item">
          <img src="/src/imagem/home.png" alt="Início" />
          <Link to="/">Início</Link>

          <div className="nav-item"></div>
          <img src="/src/imagem/sobre.png" alt="Sobre" />
          <Link to="/Sobre">Sobre</Link>
        </div>
        <div className="nav-item">
          <img src="/src/imagem/cart.png" alt="Carrinho" />
          <Link to="/carrinho">Carrinho</Link>
        </div>
      </nav>
    </header>
  );
}
