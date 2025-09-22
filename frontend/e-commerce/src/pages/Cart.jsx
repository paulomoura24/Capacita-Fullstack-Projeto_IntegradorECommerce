// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchCart = () => {
    api.get("/cart")
      .then((res) => setCart(res.data))
      .catch(() => alert("Erro ao carregar carrinho"));
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch {
      alert("Erro ao remover item.");
    }
  };

  const total = cart.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

  return (
    <div className="cart-container">
      <h2>Meu Carrinho</h2>
      {cart.length === 0 ? <p>Carrinho vazio</p> : (
        <>
          <ul>
            {cart.map((c) => (
              <li key={c.id}>
                {c.produto.nome} - {c.quantidade}x R$ {c.produto.preco.toFixed(2)}
                <button onClick={() => removeItem(c.id)}>Remover</button>
              </li>
            ))}
          </ul>
          <h3>Total: R$ {total.toFixed(2)}</h3>
          <button onClick={() => navigate("/checkout")}>Finalizar Compra</button>
        </>
      )}
    </div>
  );
}
