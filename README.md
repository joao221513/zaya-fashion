# ZAIA — Site recriado

## Como testar localmente
Abra o arquivo `index.html` direto no navegador, ou rode um servidor simples:
    npx serve .
(ou "python3 -m http.server" se tiver Python)

## Como subir no GitHub
1. Crie um repositório novo no GitHub (ex: "zaia-fashion")
2. Dentro desta pasta, rode:
       git init
       git add .
       git commit -m "primeira versão do site ZAIA"
       git branch -M main
       git remote add origin https://github.com/SEU-USUARIO/zaia-fashion.git
       git push -u origin main

## Como publicar (com checkout do Stripe funcionando)
O checkout usa uma função de servidor (pasta `api/`), então **precisa ser a Vercel** —
o GitHub Pages não roda esse tipo de função, só o Netlify e a Vercel.

1. **Vercel** (vercel.com) → "Add New Project" → importe o repositório do GitHub
2. Antes de clicar em Deploy, abra "Environment Variables" e adicione:
       STRIPE_SECRET_KEY = sk_test_sua_chave_aqui   (ou sk_live_ quando for pra produção)
3. Clique em Deploy. Pronto — o site e a função `/api/create-checkout-session` sobem juntos.

Se preferir Netlify, o processo é parecido (a pasta `api/` precisa virar uma "Netlify Function" — me avise que ajusto o código para o formato do Netlify).

## Configurando o Stripe
1. Crie uma conta em https://dashboard.stripe.com
2. Em "Developers → API keys", copie a **Secret key** (começa com `sk_test_...` no modo teste)
3. Cole essa chave na variável de ambiente `STRIPE_SECRET_KEY` (na Vercel, ou no arquivo `.env.local` pra testar localmente com `vercel dev` — veja `.env.example`)
4. Para testar um pagamento, use o cartão de teste do Stripe: `4242 4242 4242 4242`, qualquer data futura e qualquer CVC
5. Quando quiser aceitar pagamentos reais, troque a chave de teste pela chave `sk_live_...` (modo ativado no dashboard do Stripe)

**Próximo passo recomendado (opcional):** hoje o pedido é considerado "confirmado" assim que o cliente é redirecionado de volta pro site. Pra ter 100% de certeza que o pagamento foi realmente aprovado antes de liberar o produto (ex: enviar e-mail, dar baixa em estoque), o ideal é configurar um **webhook do Stripe** (`checkout.session.completed`). Posso implementar isso também se quiser.

## O que já funciona
- Home com hero, categorias, novidades, destaques, seção social e rodapé
- Página de produto (clique em qualquer peça) com cor, tamanho, descrição em acordeão e relacionados
- Carrinho funcional (sacola lateral) com quantidade, remoção e subtotal — salvo no navegador (localStorage)
- Animações suaves de entrada ao rolar a página e efeito parallax no hero

- Checkout real via Stripe: o botão "Finalizar Compra" cria uma sessão de pagamento e leva o cliente pro checkout seguro do Stripe

## O que é só estrutura (não é funcional de verdade)
- Newsletter e alguns links do rodapé são apenas visuais
- Um produto ("Vestido Slip Satin Gold") não tem foto real ainda — só uma cor de fundo no lugar. Troque `image: null` por um caminho de imagem em `app.js` quando tiver a foto.

## Para adicionar mais produtos
Edite o array `PRODUCTS` no arquivo `app.js` — cada objeto é uma peça (nome, preço, categoria, imagem, cores, tamanhos, descrição).
