import "/src/css/Footer.css";

export default function Footer() {
  const companyInfo = {
    name: "Papelaria Pó de Giz",
    address: "Rua Guilherme, 123 - Centro, Fortaleza - CE",
    phone: "(85) 3220-1010",
    email: "contato@papelariapodegiz.com.br",
    cnpj: "01.234.567/0001-89"
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} {companyInfo.name} — Todos os direitos reservados
        </p>

        <div className="footer-info">
          <p>{companyInfo.address}</p>
          <p>
            Telefone: <a href={`tel:${companyInfo.phone}`}>{companyInfo.phone}</a>
          </p>
          <p>
            Email: <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
          </p>
          <p>CNPJ: {companyInfo.cnpj}</p>
        </div>
      </div>
    </footer>
  );
}
