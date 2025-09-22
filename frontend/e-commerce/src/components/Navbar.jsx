// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">E-Commerce</Link>
      </div>
      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Cadastrar</Link>
          </>
        ) : (
          <>
            <Link to="/products">Produtos</Link>
            <Link to="/cart">Carrinho</Link>
            {user.role === "cliente" && <Link to="/client">Minhas Compras</Link>}
            {user.role === "vendedor" && (
              <>
                <Link to="/products/new">Novo Produto</Link>
                <Link to="/seller">Minhas Vendas</Link>
              </>
            )}
            <button onClick={handleLogout} className="logout-btn">Sair</button>
          </>
        )}
      </div>
    </nav>
  );
}
