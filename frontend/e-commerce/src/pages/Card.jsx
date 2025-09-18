import { useCart } from "/src/context/CardContext";
import "/src/css/Cart.css";

function Cart() {
  const { cart, removeFromCart, total, clearCart } = useCart();

  return (
    <div className="cart-container">
      <h1 className="cart-title">Carrinho de Compras</h1>

      {cart.length === 0 ? (
        <p className="cart-empty">Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <p>Quantidade: {item.quantity}</p>
                </div>
                <div className="cart-item-price">
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h2>
              Total: <span>R$ {total.toFixed(2)}</span>
            </h2>
            <button onClick={clearCart} className="checkout-btn">
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
