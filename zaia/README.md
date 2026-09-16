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

## Como publicar de graça
- **Vercel** (vercel.com): conecte o repositório do GitHub, não precisa configurar nada (é HTML puro) — clique em Deploy.
- **Netlify** (netlify.com): "Add new site" → "Import from GitHub", ou simplesmente arraste esta pasta pro netlify.com/drop.
- **GitHub Pages**: nas configurações do repositório, ative Pages apontando pra branch "main" / pasta raiz.

## O que já funciona
- Home com hero, categorias, novidades, destaques, seção social e rodapé
- Página de produto (clique em qualquer peça) com cor, tamanho, descrição em acordeão e relacionados
- Carrinho funcional (sacola lateral) com quantidade, remoção e subtotal — salvo no navegador (localStorage)
- Animações suaves de entrada ao rolar a página e efeito parallax no hero

## O que é só estrutura (não é funcional de verdade)
- Botão "Finalizar Compra" mostra um aviso — ainda não está ligado a nenhum meio de pagamento real (Stripe, Pix etc.)
- Newsletter e alguns links do rodapé são apenas visuais
- Um produto ("Vestido Slip Satin Gold") não tem foto real ainda — só uma cor de fundo no lugar. Troque `image: null` por um caminho de imagem em `app.js` quando tiver a foto.

## Para adicionar mais produtos
Edite o array `PRODUCTS` no arquivo `app.js` — cada objeto é uma peça (nome, preço, categoria, imagem, cores, tamanhos, descrição).
