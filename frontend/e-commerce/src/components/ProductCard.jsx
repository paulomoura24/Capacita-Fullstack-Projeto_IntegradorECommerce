// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import "/src/css/ProdutoCard.css"

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
      <h2 className="product-title">{product.name}</h2>
      <p className="product-price">R$ {product.price}</p>
      <Link to={`/produto/${product.id}`} className="product-link">Ver detalhes</Link>
    </div>
  );
}

export default ProductCard;
