// src/pages/Checkout.jsx
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      await api.post("/orders");
      alert("Compra finalizada!");
      navigate("/client");
    } catch {
      alert("Erro ao finalizar compra.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <button onClick={handleCheckout}>Confirmar Pedido</button>
    </div>
  );
}
