# Capacita-Fullstack-Projeto_Integrador


# 📅 Cronograma – 15 dias (3 sprints)

## Sprint 1 (Dias 1 a 5) – Setup + Login + Perfis
**Objetivo:** Deixar a base do projeto pronta e permitir acesso com login.

### Tarefas
- **Infraestrutura**
  - Configurar repositório (Git/GitHub/GitLab) 
  - Configurar banco (PostgreSQL/MySQL)
  - Criar projeto backend (Node.js + Express/NestJS)
  - Criar projeto frontend (React/Next.js)
  - Definir autenticação JWT

- **Funcionalidades**
  - Cadastro de usuário (cliente e vendedor)
  - Login/logout com sessão/token
  - Middleware de autenticação e autorização
  - Diferenciação de perfis (cliente e vendedor)
  - Criar layout inicial do site (header, footer, páginas de login e cadastro)

### Responsáveis
- **Líder Back:** Estrutura da API + middleware de autenticação
- **Dev Back:** Endpoints de usuário/login
- **Líder Front:** Estrutura base do front (rotas, componentes, autenticação)
- **2 Dev Front:** Telas de login/cadastro + integração API
- **Fullstack:** Integração login/back, testes básicos

✅ **Entrega Sprint 1:** Sistema funcional com cadastro/login e perfis distintos.

---

## Sprint 2 (Dias 6 a 10) – Produtos + Estoque + Upload
**Objetivo:** Criar gerenciamento de produtos e estoque.

### Tarefas
- **Backend**
  - Endpoint para cadastro de produtos (nome, descrição, preço, imagens, estoque)
  - Endpoint para listar produtos
  - Endpoint para atualizar estoque
  - Validação de estoque no banco
  - Configurar upload de imagens (Cloudinary/AWS/local)

- **Frontend**
  - Tela para vendedor cadastrar produtos
  - Tela de listagem de produtos para clientes
  - Tela de adicionar mais estoque (somente vendedor)
  - Formulário com upload de imagens
  - Design responsivo básico para páginas principais

### Responsáveis
- **Líder Back:** Regras de estoque + upload
- **Dev Back:** Endpoints de produto/estoque
- **Líder Front:** Definir UI dos formulários + integração upload
- **2 Dev Front:** Criar telas de cadastro/listagem
- **Fullstack:** Garantir integração front/back, testes de upload e estoque

✅ **Entrega Sprint 2:** Cadastro de produto com estoque e listagem pronta.

---

## Sprint 3 (Dias 11 a 15) – Carrinho + Pedidos + Painéis
**Objetivo:** Criar fluxo de compra e painéis para cliente e vendedor.

### Tarefas
- **Backend**
  - Endpoint carrinho (adicionar/remover produtos, validar estoque)
  - Endpoint finalizar compra (gravação no banco)
  - Endpoint listar pedidos do cliente
  - Endpoint listar vendas do vendedor
  - Endpoint cancelar venda (cliente/vendedor com restrições)

- **Frontend**
  - Tela de carrinho (adicionar/remover produtos, totalizador)
  - Tela de finalização de compra
  - Painel cliente → listar compras, cancelar pedido
  - Painel vendedor → listar vendas, cancelar suas vendas, atualizar estoque
  - Ajustes de responsividade (mobile/tablet/desktop)

### Responsáveis
- **Líder Back:** Lógica de carrinho/pedidos/cancelamentos
- **Dev Back:** Endpoints de compra/venda
- **Líder Front:** Painéis cliente/vendedor
- **2 Dev Front:** Carrinho, finalização, responsividade
- **Fullstack:** Testes ponta a ponta, integração final

✅ **Entrega Sprint 3:** Fluxo completo de compra e painéis funcionais.

---

# 📌 Divisão clara das funções

- **Líder Back:**
  - Definição da arquitetura da API
  - Implementação das regras críticas (login, estoque, carrinho)
  - Revisão do código do dev back

- **Dev Back:**
  - Implementação de endpoints
  - Modelagem do banco
  - Query de pedidos e estoque

- **Líder Front:**
  - Estrutura do projeto frontend
  - Padrões de UI/UX e responsividade
  - Revisão do código dos devs front

- **Dev Front (2):**
  - Telas (login, cadastro, produtos, carrinho, painéis)
  - Integração com API
  - Responsividade e ajustes visuais

- **Fullstack:**
  - Integração back ↔ front
  - Testes ponta a ponta
  - Deploy e documentação final

---

👉**MVP funcional de e-commerce**:
- ✅ Login/cadastro com perfis
- ✅ Cadastro de produtos com estoque e upload
- ✅ Carrinho e fluxo de compras
- ✅ Painéis cliente e vendedor
- ✅ Site responsivo
