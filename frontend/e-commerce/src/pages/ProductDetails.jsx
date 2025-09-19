import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import products from "/src/data/products";
import { useCart } from "/src/context/CardContext";
import "/src/css/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();

  // Estado para feedback do botão
  const [added, setAdded] = useState(false);

  if (!product) return <p>Produto não encontrado.</p>;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500); // volta ao estado original após 1,5s
  };

  return (
    <div className="product-details-container">
      <img src={product.image} className="product-details-image" />
      <h2 className="product-details-title">{product.name}</h2>
      <p className="product-details-description">{product.description}</p>
      <p className="product-details-price">Preço: R$ {product.price}</p>
      <button onClick={handleAddToCart} className="product-details-button">
        {added ? "Adicionado!" : <><FaShoppingCart /> Adicionar ao Carrinho</>}
      </button>
    </div>
  );
}

export default ProductDetails;


