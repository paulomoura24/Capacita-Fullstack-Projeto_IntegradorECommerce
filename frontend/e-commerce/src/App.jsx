import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "/src/pages/Home";
import ProductDetails from "/src/pages/ProductDetails";
import Cart from "/src/pages/Card.jsx";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import Sobre from "/src/pages/Sobre"
import { CartProvider } from "/src/context/CardContext";


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produto/:id" element={<ProductDetails />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/sobre"  element={<Sobre />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
