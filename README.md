# Capacita-Fullstack-Projeto_IntegradorECommerce

## Visão Geral

Este projeto é um E-Commerce completo, desenvolvido como Projeto Integrador do programa Capacita Fullstack, com o objetivo de proporcionar uma aplicação web robusta para simulação de um ambiente real de comércio eletrônico. O sistema foi pensado para integrar as competências de front-end e back-end adquiridas durante a formação.

## Funcionalidades

- Catálogo dinâmico de produtos (CRUD)
- Carrinho de compras e checkout com validação de cartão fictício (Luhn)
- Cadastro, login e autenticação JWT
- Perfis de usuário: CLIENT, VENDOR e ADMIN, com permissões específicas
- Painel administrativo para gestão de produtos e pedidos
- Upload e exibição de imagens de produtos diretamente no banco de dados
- Histórico de pedidos e gerenciamento de status
- Interface responsiva e experiência aprimorada para o usuário

## Tecnologias Utilizadas

### Front-end

- **Vite + React**: base moderna para criação de interfaces reativas.
- **JavaScript (ES6+)**
- **HTML5 e CSS3**: estilização, responsividade e usabilidade.
- **React Router**: navegação SPA.
- **Context API**: gerenciamento de estado global.

### Back-end

- **Node.js**: ambiente de execução JavaScript no servidor.
- **Express**: framework web para criação das APIs REST.
- **Prisma ORM**: acesso e modelagem de dados no banco relacional.
- **PostgreSQL**: banco de dados relacional para persistência segura.
- **JWT (JSON Web Token)**: autenticação e autorização de usuários.
- **Multer**: upload de arquivos (imagens) diretamente para o banco, utilizando campos do tipo `bytea`.
- **Dotenv**: gerenciamento de variáveis de ambiente.
- **Arquitetura MVC (Model-View-Controller) simplificada**: separação de responsabilidades em controllers, services, routes e middlewares.

#### Estrutura do back-end

```
src/
  controllers/   # lógica HTTP
  services/      # regras de negócio e Prisma
  routes/        # definição de rotas
  middlewares/   # auth, upload, error
  prisma/        # client
prisma/
  schema.prisma  # modelos de dados
  seed.js        # popular DB
```

### Outros

- **PNPM/NPM**: gerenciamento de pacotes.
- **Migrations e Seeders**: versionamento de banco e dados iniciais.

## Como Executar

### Backend

1. Acesse a pasta `api/`
2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite DATABASE_URL e JWT_SECRET conforme seu ambiente
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Gere e aplique as migrations, e popular o banco:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```
5. Inicie a API:
   ```bash
   npm run dev
   ```

### Frontend

1. Acesse a pasta `frontend/`
2. Configure a URL da API:
   ```bash
   cp .env.example .env
   # Edite VITE_API_URL com o endereço da sua API (ex: http://localhost:3000)
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie a aplicação:
   ```bash
   npm run dev
   ```

## Estrutura de Perfis e Permissões

- **CLIENT**: pode criar e visualizar seus próprios pedidos.
- **VENDOR**: pode criar, editar e remover produtos que são seus.
- **ADMIN**: acesso total ao sistema, incluindo gestão completa de produtos e pedidos.

## Licença

MIT

## Colaboradores - Equipe - Papelaria

<table>
  <tr>
    <td align="center">
       <a href="https://github.com/paulomoura24">
        <img src="https://avatars.githubusercontent.com/u/187982740?v=4" width="100px;" alt="Rubens Lima"/><br>
        <sub>
          <b>Paulo Moura</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/wesleycosta061203">
        <img src="https://avatars.githubusercontent.com/u/62311070?s=64&v=4" width="100px;" alt="Dimas Gabirel"/><br>
        <sub>
          <b>Wesley Costa</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/LucasCLima-dev">
        <img src="https://avatars.githubusercontent.com/u/177546715?s=64&v=4" width="100px;" alt="Rubens Lima"/><br>
        <sub>
          <b>LucasCLima</b>
        </sub>
      </a>
    </td>
    <td  align="center">
      <a href="https://github.com/DimasGabriel1">
        <img src="https://avatars.githubusercontent.com/u/208731600?s=64&v=4" width="100px;" alt="Rubens Lima"/><br>
        <sub>
          <b>DimasGabriel</b>
        </sub>
      </a>
    </td>
    </td>
      </tr>




