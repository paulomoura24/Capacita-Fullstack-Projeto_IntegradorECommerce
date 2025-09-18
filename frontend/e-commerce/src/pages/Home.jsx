import { useState, useEffect } from "react";
import ProductCard from "/src/components/ProductCard";
import products from "/src/data/products";
import "/src/css/Carrossel.css";

function Home() {
  const banners = [
    { id: 1, src: "/src/imagem/banner01.png", alt: "Promoção 1" },
    { id: 2, src: "/src/imagem/banner02.png", alt: "Promoção 2" },
    { id: 3, src: "/src/imagem/banner03.png", alt: "Promoção 3" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <div className="home-page">
      {/* Carrossel */}
      <div className="carousel">
        <img
          src={banners[currentIndex].src}
          alt={banners[currentIndex].alt}
          className="carousel-image"
        />
        <div className="carousel-indicators">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Seção de Produtos */}
      <section className="products-section">
        <h2 className="products-title">Nossos Produtos</h2>

        <div className="product-grid">
          {products.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {visibleCount < products.length && (
          <button onClick={handleLoadMore} className="load-more-button">
            Ver mais produtos
          </button>
        )}
      </section>
    </div>
  );
}

export default Home;
