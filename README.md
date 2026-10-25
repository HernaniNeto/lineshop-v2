# Lineshop

Loja virtual completa feita com a pilha **MERN** (MongoDB, Express, React e Node.js).

O cliente pode navegar pelos produtos, buscar, avaliar, montar o carrinho, informar o endereço, pagar com PayPal e acompanhar os pedidos. O administrador cadastra e edita produtos (com upload de imagem), gerencia usuários e marca pedidos como entregues.

## Tecnologias

- **Frontend:** React 18, React Router 6, Redux Toolkit / RTK Query, React-Bootstrap, PayPal
- **Backend:** Node.js, Express, Mongoose, JWT em cookie httpOnly, bcrypt, Multer
- **Banco:** MongoDB Atlas
- **Hospedagem:** Vercel (site estático + API como função serverless)

## Rodando no computador

1. Crie um arquivo `.env` na raiz (use o `.env.example` como modelo):

   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=sua_string_de_conexao_do_mongodb
   JWT_SECRET=um_segredo_longo_e_aleatorio
   PAYPAL_CLIENT_ID=seu_client_id_do_paypal
   PAGINATION_LIMIT=8
   ```

2. Instale as dependências:

   ```
   npm install
   npm install --prefix frontend
   ```

3. (Opcional) Coloque os dados de exemplo no banco. **Atenção: isso apaga os dados existentes.**

   ```
   npm run data:import
   ```

4. Rode frontend e backend juntos:

   ```
   npm run dev
   ```

   Site em http://localhost:3000 · API em http://localhost:5000

Usuários de exemplo (criados pelo `data:import`): `admin@email.com`, `john@email.com`, `jane@email.com`, todos com a senha `123456`.

## Publicando na Vercel

O projeto já vem configurado (`vercel.json` e `api/index.js`):

1. Importe o repositório em https://vercel.com/new (deixe as configurações padrão).
2. Crie o banco em **Storage → MongoDB Atlas** (a Vercel cria a variável `MONGODB_URI`) ou informe a sua própria `MONGO_URI`. Se usar uma conta Atlas própria, libere o IP `0.0.0.0/0` em **Network Access**, pois a Vercel não tem IP fixo.
3. Em **Environment Variables**, cadastre `JWT_SECRET`, `PAYPAL_CLIENT_ID`, `PAGINATION_LIMIT`, `NODE_ENV=production`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
4. Clique em **Deploy**.

Com o banco vazio, o primeiro acesso cria automaticamente o administrador (com `ADMIN_EMAIL`/`ADMIN_PASSWORD`) e os produtos de exemplo.

As imagens enviadas pelo painel admin ficam guardadas no próprio MongoDB (a Vercel não tem disco permanente). Imagens antigas da pasta `uploads/` são copiadas para o site durante o build.

## Estrutura

```
api/          → entrada da API na Vercel
backend/      → servidor Express (rotas, controllers, models, middlewares)
frontend/     → site em React
uploads/      → imagens antigas enviadas pelo admin
scripts/      → utilitários de build
```
