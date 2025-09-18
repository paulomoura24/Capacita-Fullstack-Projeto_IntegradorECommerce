# E-commerce API (Node.js + Express + Prisma, JS)

API profissional com autenticação JWT, perfis (CLIENT, VENDOR, ADMIN), upload de imagem direto no PostgreSQL (bytea), pedidos com cartão **fictício** validado via Luhn, migrations e seeders.

## Requisitos
- Node 18+
- PostgreSQL 13+
- PNPM ou NPM

## Instalação
```bash
cp .env.example .env
# edite DATABASE_URL e JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### DATABASE_URL exemplo
```
postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public
```

## Autenticação
JWT Bearer. Envie `Authorization: Bearer <token>`.

### Registro
`POST /auth/register`
```json
{
  "name":"Cliente",
  "email":"cliente@example.com",
  "password":"123456",
  "role":"CLIENT"
}
```
Resposta:
```json
{ "user": { "id": 1, "name": "Cliente", "email":"cliente@example.com", "role":"CLIENT" }, "token":"..." }
```

### Login
`POST /auth/login`
```json
{ "email":"cliente@example.com", "password":"123456" }
```

## Usuário
### Meu perfil
`GET /users/me` (autenticado)
Retorna dados do usuário logado.

## Produtos
### Listar
`GET /products`

### Ver um produto
`GET /products/:id`

### Ver imagem do produto
`GET /products/:id/image`  
Retorna a imagem com `Content-Type` do mime armazenado.

### Criar produto (VENDOR|ADMIN)
`POST /products` (multipart/form-data)
Campos:
- `title` (string, min 3)
- `description` (string, min 10)
- `price` (number > 0)
- `stock` (int >= 0)
- `image` (file **obrigatório**: jpg/png/webp; limite padrão 5MB)

Exemplo **Postman**:
- Body → form-data
  - Key: `title` → `Relógio W59 Mini`
  - Key: `description` → `Smartwatch compacto e elegante...`
  - Key: `price` → `199.90`
  - Key: `stock` → `50`
  - Key: `image` → *Selecione um arquivo .png/.jpg/.webp*

### Atualizar produto (VENDOR|ADMIN)
`PUT /products/:id` (multipart/form-data)  
Mesmos campos do create; `image` é opcional no update.

### Remover (inativar) produto
`DELETE /products/:id` (VENDOR|ADMIN)

## Pedidos
### Criar pedido (CLIENT|ADMIN)
`POST /orders`
```json
{
  "items":[ { "productId": 1, "quantity": 2 } ],
  "shippingAddress": "Rua Exemplo, 123 - Barreira/CE",
  "payment": {
    "holderName":"Fulano",
    "cardNumber":"4111111111111111",
    "expMonth":12,
    "expYear":2030,
    "cvv":"123"
  }
}
```
Regra de aprovação **fictícia**:
- Número do cartão deve passar no Luhn **e**
- Valor total ≤ 5000 **ou** número exatamente `4111111111111111`.

Resposta de sucesso:
```json
{
  "order": { "id": 1, "status": "PAID", "total": "499.90", ... },
  "payment": { "status": "APPROVED", "cardLast4": "1111", ... }
}
```

### Meus pedidos
`GET /orders`

### Um pedido específico
`GET /orders/:id`

## Upload de imagem no PostgreSQL (bytea)
- Usamos `Prisma Bytes` no campo `Product.image` (armazenado como `bytea`).
- A API recebe via multipart e salva `buffer` (memória) diretamente no banco.
- Para **renderizar**, use `GET /products/:id/image` (retorna a imagem com headers corretos).

### Caso deseje salvar em disco (alternativa)
- Ajuste o middleware para salvar em disco e armazene apenas o caminho no DB. **Este projeto já está pronto para armazenar no DB**.

## Perfis e Autorização
- `CLIENT`: pode criar pedidos, ver os próprios pedidos.
- `VENDOR`: pode **criar/editar/remover** produtos que são seus.
- `ADMIN`: pode tudo.

## Migrations e Seed
- `npm run migrate:dev` → cria tabelas.
- `npm run seed` → cria usuários:  
  - admin@example.com / 123456 (ADMIN)  
  - vendedor@example.com / 123456 (VENDOR)  
  - cliente@example.com / 123456 (CLIENT)  
  Também cria 1 produto com imagem PNG 1x1.

## Dicas Postman
- Crie uma variável de ambiente `token` e use `{{token}}` no header `Authorization: Bearer {{token}}`.
- Faça login e salve o token automaticamente via *Tests*:
```js
pm.environment.set('token', pm.response.json().token);
```

## Estrutura do projeto (MVC simplificado)
```
src/
  controllers/   # lógica HTTP
  services/      # regras de negócio e Prisma
  routes/        # definição de rotas
  middlewares/   # auth, upload, error
  prisma/        # client
prisma/
  schema.prisma  # modelos
  seed.js        # popular DB
```

## Licença
MIT
