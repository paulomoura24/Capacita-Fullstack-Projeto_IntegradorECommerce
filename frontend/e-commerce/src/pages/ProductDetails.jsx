import { useParams } from "react-router-dom";
import products from "/src/data/products";
import { useCart } from "/src/context/CardContext";
import "/src/css/ProductDetails.css"

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();

  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <div className="product-details-container">
      <img src={product.image} className="product-details-image" />
      <h2 className="product-details-title">{product.name}</h2>
      <p className="product-details-description">{product.description}</p>
      <p className="product-details-price">Preço: R$ {product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="product-details-price"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
}

export default ProductDetails;
