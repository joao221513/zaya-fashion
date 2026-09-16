// ---------- Dados do catálogo ----------
const PRODUCTS = [
  {
    id: 'vestido-noir-elegance',
    name: 'Vestido Noir Élégance',
    category: 'Vestidos',
    price: 489,
    oldPrice: null,
    badge: 'NOVO',
    image: 'assets/vestido-noir.jpg',
    images: ['assets/vestido-noir.jpg', 'assets/vestido-noir-2.jpg'],
    colors: ['#141210'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Vestido justo com gola alta e fechamento frontal, alfaiataria precisa que desenha a silhueta do colo à cintura.'
  },
  {
    id: 'conjunto-calca-wideleg',
    name: 'Conjunto Calça Wide Leg',
    category: 'Conjuntos',
    price: 623,
    oldPrice: null,
    badge: 'NOVO',
    image: 'assets/conjunto-wideleg.jpg',
    images: ['assets/conjunto-wideleg.jpg'],
    colors: ['#6b4226'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Conjunto em tecido fluido com recorte nas costas e caimento wide leg — elegância descontraída para o dia a dia.'
  },
  {
    id: 'blazer-over-black-power',
    name: 'Blazer Over Black Power',
    category: 'Blazers',
    price: 598,
    oldPrice: null,
    badge: 'NOVO',
    image: 'assets/hero-campaign.jpg',
    images: ['assets/hero-campaign.jpg'],
    colors: ['#141210'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Blazer longo oversized em lã fria. O item essencial do guarda-roupa elegante.'
  },
  {
    id: 'blazer-creme-estruturado',
    name: 'Blazer Creme Estruturado',
    category: 'Blazers',
    price: 567,
    oldPrice: 689,
    badge: 'SALE',
    image: 'assets/blazer-creme.jpg',
    images: ['assets/blazer-creme.jpg'],
    colors: ['#e9dfa8'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Blazer estruturado em tecido premium, gola geométrica e recorte assimétrico com acabamento de alfaiataria.'
  },
  {
    id: 'vestido-slip-satin-gold',
    name: 'Vestido Slip Satin Gold',
    category: 'Vestidos',
    price: 378,
    oldPrice: null,
    badge: null,
    image: null,
    images: [],
    colors: ['#4a2c2a'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Vestido slip em cetim de caimento fluido, um ombro só, pensado para ocasiões especiais.'
  }
];

const CATEGORIES = [
  { name: 'Vestidos', count: 24, image: 'assets/vestido-noir.jpg' },
  { name: 'Blazers', count: 18, image: 'assets/blazer-creme.jpg' },
  { name: 'Conjuntos', count: 15, image: 'assets/conjunto-wideleg.jpg' },
  { name: 'Calças', count: 20, image: null }
];

// ---------- Utilidades ----------
const fmt = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
const installments = (n) => 'ou 3x de ' + fmt(n / 3) + ' s/ juros';

function getCart() {
  try { return JSON.parse(localStorage.getItem('zaia_cart') || '[]'); }
  catch (e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('zaia_cart', JSON.stringify(cart));
  renderCartCount();
}
function addToCart(productId, size) {
  const cart = getCart();
  const existing = cart.find(l => l.productId === productId && l.size === size);
  if (existing) existing.qty += 1;
  else cart.push({ productId, size, qty: 1 });
  saveCart(cart);
  renderDrawer();
  showToast('Adicionado à sacola');
  openDrawer();
}
function updateQty(index, delta) {
  const cart = getCart();
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  saveCart(cart);
  renderDrawer();
}
function removeLine(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderDrawer();
}
function cartTotal() {
  const cart = getCart();
  return cart.reduce((sum, l) => {
    const p = PRODUCTS.find(p => p.id === l.productId);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);
}
function cartCount() {
  return getCart().reduce((n, l) => n + l.qty, 0);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._tm);
  showToast._tm = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Ícones ----------
const ICONS = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-9.5-8.8C.7 8 2 4.5 5.5 4c2-.3 3.7.7 6.5 3.2C14.8 4.7 16.5 3.7 18.5 4c3.5.5 4.8 4 3 7.2C19 15.6 12 20 12 20Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.4"/><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="19" r="2.4"/><path d="M8.2 10.8l7.5-4.2M8.2 13.2l7.5 4.2"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="M10.5 9.3v5.4l4.8-2.7-4.8-2.7Z" fill="currentColor" stroke="none"/></svg>'
};

// ---------- Renderização ----------
function productMedia(p) {
  if (p.image) return `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
  return `<div class="placeholder-fill" style="background:${p.colors[0]}"></div>`;
}

function renderProductCard(p) {
  return `
  <div class="prod-card reveal" onclick="navigateTo('produto/${p.id}')">
    <div class="prod-media">
      ${p.badge ? `<span class="badge ${p.badge === 'NOVO' ? 'novo' : 'sale'}">${p.badge}</span>` : ''}
      <button class="fav-btn" onclick="event.stopPropagation(); showToast('Adicionado aos favoritos')">${ICONS.heart}</button>
      ${productMedia(p)}
      <button class="quick-add" onclick="event.stopPropagation(); addToCart('${p.id}', '${p.sizes[1]}')">${ICONS.bag} Adicionar à sacola</button>
    </div>
    <div class="prod-name">${p.name}</div>
    <div class="prod-price">${p.oldPrice ? `<span class="old">${fmt(p.oldPrice)}</span>` : ''}${fmt(p.price)}</div>
    <div class="prod-installments">${installments(p.price)}</div>
  </div>`;
}

function renderHome() {
  return `
  <section class="hero" id="hero">
    <img class="hero-img" src="assets/hero-campaign.jpg" alt="Coleção ZAYA — Setembro 2026">
    <div class="hero-content">
      <div class="hero-eyebrow">Nova coleção · Set. 2026</div>
      <h1 class="hero-title">Elegância é&nbsp;uma escolha.</h1>
      <p class="hero-sub">Peças atemporais para a mulher que sabe quem é.</p>
      <div class="hero-actions">
        <a class="btn btn-solid" href="#/colecao">Ver coleção</a>
        <a class="btn btn-outline" href="#novidades">Novidades</a>
      </div>
    </div>
  </section>

  <section id="categorias">
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">Explorar</div>
        <h2 class="title">Categorias</h2>
      </div>
      <div class="cat-grid">
        ${CATEGORIES.map(c => `
          <a class="cat-card reveal" href="#/colecao">
            ${c.image ? `<img src="${c.image}" alt="${c.name}">` : `<div class="placeholder-fill" style="background:linear-gradient(150deg,#c9a877,#8a6a4f)"></div>`}
            <div class="cat-label"><div class="name">${c.name}</div><div class="count">${c.count} peças</div></div>
          </a>`).join('')}
      </div>
    </div>
  </section>

  <section id="novidades" style="background:var(--cream-deep)">
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">Recém chegadas</div>
        <h2 class="title">Novidades</h2>
      </div>
      <div class="prod-grid">
        ${PRODUCTS.filter(p => p.badge === 'NOVO').map(renderProductCard).join('')}
      </div>
    </div>
  </section>

  <section id="destaques">
    <div class="wrap">
      <div class="section-head reveal">
        <h2 class="title">Destaques</h2>
      </div>
      <div class="prod-grid">
        ${PRODUCTS.map(renderProductCard).join('')}
      </div>
      <div class="view-all reveal"><a class="btn btn-line" style="width:auto; display:inline-flex" href="#/colecao">Ver coleção completa</a></div>
    </div>
  </section>

  <section class="social-band">
    <div class="wrap">
      <div class="section-head reveal">
        <div class="eyebrow">Nos siga</div>
        <h2 class="title">@zaia.fashion</h2>
      </div>
      <div class="social-grid reveal">
        ${[...PRODUCTS].filter(p => p.image).concat(PRODUCTS.filter(p=>p.image)).slice(0,6).map(p => `<img src="${p.image}" alt="${p.name}">`).join('')}
      </div>
    </div>
  </section>

  <section id="trust">
    <div class="wrap trust-grid">
      <div class="trust-item reveal"><div class="mark"><span>✦</span></div><h4>Frete Grátis</h4><p>Compras acima de R$350</p></div>
      <div class="trust-item reveal"><div class="mark"><span>◇</span></div><h4>Troca Fácil</h4><p>30 dias para trocar</p></div>
      <div class="trust-item reveal"><div class="mark"><span>◆</span></div><h4>Qualidade Premium</h4><p>Tecidos selecionados</p></div>
      <div class="trust-item reveal"><div class="mark"><span>●</span></div><h4>Pagamento Seguro</h4><p>Ambiente 100% seguro</p></div>
    </div>
  </section>
  `;
}

let currentProduct = null;
let selectedSize = null;

function renderProductPage(id) {
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return `<div class="wrap" style="padding:80px 0">Produto não encontrado. <a href="#/">Voltar à loja</a></div>`;
  currentProduct = p;
  selectedSize = p.sizes[1];
  const related = PRODUCTS.filter(r => r.id !== p.id).slice(0, 3);

  return `
  <div class="wrap">
    <div class="breadcrumb">
      <a href="#/">Início</a> / <a href="#/colecao">Coleção</a> / <a href="#/colecao">${p.category}</a> / ${p.name}
    </div>
    <a class="back-link" href="#/colecao">← Voltar</a>

    <div class="pdp-grid">
      <div class="pdp-media reveal in-view">
        ${p.badge ? `<span class="badge ${p.badge === 'NOVO' ? 'novo' : 'sale'}">${p.badge}</span>` : ''}
        <button class="pdp-fav" onclick="showToast('Adicionado aos favoritos')">${ICONS.heart}</button>
        ${productMedia(p)}
      </div>
      <div class="pdp-info">
        <div class="pdp-cat">${p.category}</div>
        <h1 class="pdp-name">${p.name}</h1>
        <div class="pdp-price">${p.oldPrice ? `<span class="old">${fmt(p.oldPrice)}</span>` : ''}${fmt(p.price)}</div>
        <div class="pdp-installments">${installments(p.price)}</div>

        <div class="pdp-label">Cores</div>
        <div class="swatch-row">
          ${p.colors.map((c, i) => `<button class="swatch ${i === 0 ? 'active' : ''}" style="background:${c}"></button>`).join('')}
        </div>

        <div class="size-row-head">
          <div class="pdp-label" style="margin:0">Tamanho</div>
          <a class="size-guide-link" href="#">Guia de Tamanhos</a>
        </div>
        <div class="size-grid" id="size-grid">
          ${p.sizes.map(s => `<button class="size-box ${s === selectedSize ? 'active' : ''}" onclick="selectSize(this,'${s}')">${s}</button>`).join('')}
        </div>

        <div class="pdp-actions">
          <button class="btn btn-dark" onclick="addToCart('${p.id}', selectedSize)">${ICONS.bag} Adicionar à sacola</button>
          <button class="btn btn-line" onclick="addToCart('${p.id}', selectedSize); location.hash='#/carrinho'">Comprar agora</button>
        </div>

        <div class="share-row">${ICONS.share} Compartilhar</div>

        <div class="accordion">
          <div class="accordion-item open">
            <button class="accordion-head" onclick="toggleAcc(this)">Descrição <span class="chev">▾</span></button>
            <div class="accordion-body"><p>${p.description}</p></div>
          </div>
          <div class="accordion-item">
            <button class="accordion-head" onclick="toggleAcc(this)">Cuidados com a peça <span class="chev">▾</span></button>
            <div class="accordion-body"><p>Lavar a seco. Não usar alvejante. Passar a ferro em temperatura baixa, protegendo o tecido.</p></div>
          </div>
          <div class="accordion-item">
            <button class="accordion-head" onclick="toggleAcc(this)">Frete & Trocas <span class="chev">▾</span></button>
            <div class="accordion-body"><p>Frete grátis para compras acima de R$350. Até 30 dias para trocar, com a etiqueta original.</p></div>
          </div>
        </div>
      </div>
    </div>

    <div class="related-band">
      <div class="section-head reveal">
        <div class="eyebrow">Você também pode gostar</div>
        <h2 class="title">Relacionados</h2>
      </div>
      <div class="prod-grid">${related.map(renderProductCard).join('')}</div>
    </div>
  </div>
  `;
}

function selectSize(el, size) {
  selectedSize = size;
  document.querySelectorAll('#size-grid .size-box').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}
function toggleAcc(headEl) {
  headEl.parentElement.classList.toggle('open');
}

function renderCollectionPage() {
  return `
  <div class="wrap" style="padding:40px 0 80px">
    <div class="section-head reveal">
      <div class="eyebrow">Coleção Set. 2026</div>
      <h2 class="title">Todas as peças</h2>
    </div>
    <div class="prod-grid">${PRODUCTS.map(renderProductCard).join('')}</div>
  </div>`;
}

function renderCartPage() {
  return `<div class="wrap" style="padding:60px 0"><h2 class="title">Sua Sacola</h2><div id="cart-page-slot" style="margin-top:30px">${renderCartLines(true)}</div></div>`;
}

function renderCartLines(inline) {
  const cart = getCart();
  if (cart.length === 0) return `<div class="drawer-empty">Sua sacola está vazia.<br><a href="#/colecao" style="text-decoration:underline">Continuar comprando</a></div>`;
  return cart.map((l, i) => {
    const p = PRODUCTS.find(p => p.id === l.productId);
    if (!p) return '';
    return `
    <div class="cart-line">
      ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div style="width:84px;height:108px;background:${p.colors[0]}"></div>`}
      <div class="cart-line-info">
        <div class="name">${p.name}</div>
        <div class="meta">Tamanho: ${l.size}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="qty-row">
          <button onclick="updateQty(${i},-1); refreshCartViews()">−</button>
          <span>${l.qty}</span>
          <button onclick="updateQty(${i},1); refreshCartViews()">+</button>
          <a class="remove-link" onclick="removeLine(${i}); refreshCartViews()">Remover</a>
        </div>
      </div>
    </div>`;
  }).join('');
}

function refreshCartViews() {
  renderDrawer();
  const slot = document.getElementById('cart-page-slot');
  if (slot) slot.innerHTML = renderCartLines(true) + cartFooterHtml();
}

function cartFooterHtml() {
  const total = cartTotal();
  if (getCart().length === 0) return '';
  return `
  <div class="drawer-foot" style="border-top:1px solid var(--line); margin-top:20px; padding-left:0; padding-right:0">
    <div class="subtotal-row"><span>Subtotal</span><strong>${fmt(total)}</strong></div>
    <div class="shipnote">Frete calculado no checkout</div>
    <button class="btn btn-dark" onclick="showToast('Checkout em breve')">Finalizar Compra</button>
    <a class="continue-link" href="#/colecao">Continuar comprando</a>
  </div>`;
}

// ---------- Drawer do carrinho ----------
function renderDrawer() {
  document.getElementById('drawer-items').innerHTML = renderCartLines(false);
  document.getElementById('drawer-foot').innerHTML = cartFooterHtml();
  document.getElementById('drawer-count').textContent = cartCount();
}
function renderCartCount() {
  const el = document.getElementById('nav-cart-count');
  if (el) el.textContent = cartCount();
}
function openDrawer() {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
}
function closeDrawer() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}

// ---------- Roteador ----------
function navigateTo(path) { location.hash = '#/' + path; }

function router() {
  const hash = location.hash.replace('#/', '') || '';
  const app = document.getElementById('app');
  let html;
  if (hash.startsWith('produto/')) html = renderProductPage(hash.replace('produto/', ''));
  else if (hash.startsWith('colecao')) html = renderCollectionPage();
  else if (hash.startsWith('carrinho')) html = renderCartPage();
  else html = renderHome();

  app.innerHTML = `<div class="page-fade">${html}</div>`;
  if (hash.startsWith('carrinho')) {
    document.getElementById('cart-page-slot').innerHTML = renderCartLines(true) + cartFooterHtml();
  }
  window.scrollTo(0, 0);
  initReveal();
  initHeroParallax();
}

// ---------- Scroll reveal ----------
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.in-view)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}
function initHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  requestAnimationFrame(() => hero.classList.add('in-view'));
  window.addEventListener('scroll', () => {
    const img = hero.querySelector('.hero-img');
    if (!img) return;
    const y = Math.min(window.scrollY * 0.25, 140);
    img.style.transform = `translateY(${y}px) scale(${1 + Math.min(window.scrollY / 4000, 0.06)})`;
  }, { passive: true });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderCartCount();
  renderDrawer();
  window.addEventListener('hashchange', router);
  router();

  document.getElementById('cart-open').addEventListener('click', openDrawer);
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('overlay').addEventListener('click', closeDrawer);
});
