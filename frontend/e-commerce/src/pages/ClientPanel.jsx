// src/pages/ClientPanel.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ClientPanel() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/me")
      .then((res) => setOrders(res.data))
      .catch(() => alert("Erro ao carregar pedidos"));
  }, []);

  const cancelOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      setOrders(orders.filter((o) => o.id !== id));
    } catch {
      alert("Erro ao cancelar pedido.");
    }
  };

  return (
    <div className="panel-container">
      <h2>Minhas Compras</h2>
      {orders.length === 0 ? <p>Você não tem pedidos.</p> : (
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              Pedido #{o.id} - Total: R$ {o.total.toFixed(2)} - Status: {o.status}
              {o.status === "pendente" && <button onClick={() => cancelOrder(o.id)}>Cancelar</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
