// src/pages/SellerPanel.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function SellerPanel() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    api.get("/sales/me")
      .then((res) => setSales(res.data))
      .catch(() => alert("Erro ao carregar vendas"));
  }, []);

  const cancelSale = async (id) => {
    try {
      await api.delete(`/sales/${id}`);
      setSales(sales.filter((s) => s.id !== id));
    } catch {
      alert("Erro ao cancelar venda.");
    }
  };

  return (
    <div className="panel-container">
      <h2>Minhas Vendas</h2>
      {sales.length === 0 ? <p>Você não realizou vendas.</p> : (
        <ul>
          {sales.map((s) => (
            <li key={s.id}>
              Venda #{s.id} - Produto: {s.produto.nome} - Quantidade: {s.quantidade} - Total: R$ {s.total.toFixed(2)}
              {s.status === "pendente" && <button onClick={() => cancelSale(s.id)}>Cancelar</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
