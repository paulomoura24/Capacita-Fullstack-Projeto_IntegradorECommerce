# Livraria Pó de Giz — Frontend (Vite + React) com Painel Admin (v3)

## Setup
```bash
cd frontend_livraria_pode_giz_admin_v3
cp .env.example .env
# edite VITE_API_URL=http://localhost:3000
npm i
npm run dev
```

## Endpoints esperados
- **Auth**
  - POST `/auth/register`
  - POST `/auth/login` → resposta com `{ token }`
  - GET `/users/me` (com Bearer) → `{ id, name, email, role }` (usado pra detectar ADMIN)
- **Products**
  - GET `/products` → `{ "products": [...] }` (com `id`, `title`, `price`, `stock`)
  - GET `/products/:id` → objeto do produto
  - GET `/products/:id/image` → imagem
  - POST `/products` (ADMIN) → JSON `{ title, price, stock, imageBase64?, imageMime?, imageName? }`
  - PUT `/products/:id` (ADMIN) → mesmo JSON (imagem opcional)
  - DELETE `/products/:id` (ADMIN)
- **Orders**
  - POST `/orders` (cria pedido) → body `{ items:[{productId, quantity}], shippingAddress, payment:{ holderName, cardNumber, expMonth, expYear, cvv } }`
  - GET `/orders` (lista **meus** pedidos; se ADMIN, backend pode devolver todos)

## Como acessar o Painel Admin
1) Faça login (POST `/auth/login`). O app salva `token`.
2) O app chama `GET /users/me` e salva `role` no `localStorage`.
3) Se `role === 'ADMIN'`, aparece o link **Admin** no topo.
4) Acesse `/admin/produtos` e `/admin/pedidos`.

> Durante testes, você pode setar manualmente:  
> `localStorage.setItem('role','ADMIN'); localStorage.setItem('token','<SEU_JWT>')`

## Validações no front
- **Cadastro**: e-mail válido, senha mínima 6.
- **Checkout**: endereço, nome, cartão (regex), mês 1–12, ano ≥ atual, CVV 3–4.
- **Admin/Produtos**:
  - Título obrigatório (≥2).
  - Preço ≥ 0 (numérico).
  - Estoque ≥ 0 (numérico).
  - **Imagem obrigatória na criação** (base64 + mime + name).

## Observações
- Se a imagem do produto não existir, o front mostra **placeholder**.
- Qualquer mudança no `.env` requer reiniciar `npm run dev`.
