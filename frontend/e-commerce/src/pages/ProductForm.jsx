// src/pages/ProductForm.jsx
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ProductForm() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", { nome, descricao, preco: parseFloat(preco), estoque: parseInt(estoque) });
      alert("Produto cadastrado!");
      navigate("/products");
    } catch {
      alert("Erro ao cadastrar produto.");
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastrar Produto</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        <input type="number" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} required />
        <input type="number" placeholder="Estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} required />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
