import "/src/css/Sobre.css";
import pinturaBanner from "/src/imagem/Pintura-baner.png";

export default function Sobre() {
  return (
    <main className="sobre-container">
      <img src={pinturaBanner} alt="Sobre a papelaria" className="sobre-image" />
      <h1>Sobre a Papelaria Pó de Giz</h1>
      <p>
        A <strong>Papelaria Pó de Giz</strong> nasceu da paixão por arte, criatividade e organização. Desde 2020, oferecemos produtos de qualidade para artistas, estudantes, professores e amantes da papelaria em geral.
      </p>
      <p>
        Trabalhamos com marcas reconhecidas, priorizando a sustentabilidade e a experiência única de cada cliente. Seja para escrever, pintar ou planejar, aqui você encontra tudo que precisa!
      </p>
      <p>
        Nosso objetivo é inspirar você a transformar ideias em realidade, com produtos que unem qualidade, beleza e funcionalidade.
      </p>
    </main>
  );
}
