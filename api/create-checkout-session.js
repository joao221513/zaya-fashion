// Função serverless (Vercel) que cria uma sessão de Checkout do Stripe
// a partir do carrinho enviado pelo site. Roda no servidor — a chave
// secreta do Stripe (STRIPE_SECRET_KEY) nunca fica exposta no navegador.

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Catálogo replicado aqui de propósito: nunca confie no preço que vem
// do navegador do cliente (alguém poderia alterar o valor antes de enviar).
// Mantenha este objeto sincronizado com o array PRODUCTS em app.js.
const PRODUCTS = {
  'vestido-noir-elegance': { name: 'Vestido Noir Élégance', price: 489 },
  'conjunto-calca-wideleg': { name: 'Conjunto Calça Wide Leg', price: 623 },
  'blazer-over-black-power': { name: 'Blazer Over Black Power', price: 598 },
  'blazer-creme-estruturado': { name: 'Blazer Creme Estruturado', price: 567 },
  'vestido-slip-satin-gold': { name: 'Vestido Slip Satin Gold', price: 378 },
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { cart, origin } = req.body || {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    const line_items = cart.map((item) => {
      const product = PRODUCTS[item.productId];
      if (!product) throw new Error('Produto inválido: ' + item.productId);
      const qty = Math.max(1, parseInt(item.qty, 10) || 1);
      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: product.name + (item.size ? ` — Tam. ${item.size}` : ''),
          },
          unit_amount: Math.round(product.price * 100), // Stripe usa centavos
        },
        quantity: qty,
      };
    });

    const baseUrl = origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      payment_method_types: ['card'],
      shipping_address_collection: { allowed_countries: ['BR'] },
      success_url: `${baseUrl}/index.html#/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/index.html#/carrinho`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Erro ao criar sessão Stripe:', err.message);
    return res.status(500).json({ error: 'Não foi possível iniciar o pagamento. Tente novamente.' });
  }
};
