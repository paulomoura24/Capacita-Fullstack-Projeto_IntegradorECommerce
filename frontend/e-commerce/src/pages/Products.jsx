// src/pages/Products.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (productId) => {
    try {
      await api.post("/cart", { productId, quantity: 1 });
      alert("Produto adicionado ao carrinho!");
    } catch {
      alert("Erro ao adicionar ao carrinho.");
    }
  };

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <div className="products-container">
      <h2>Produtos</h2>
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.nome}</h3>
            <p>{p.descricao}</p>
            <p><b>R$ {p.preco.toFixed(2)}</b></p>
            <button onClick={() => addToCart(p.id)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    </div>
  );
}
