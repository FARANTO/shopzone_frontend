(() => {
  const session = JSON.parse(localStorage.getItem('shopzoneUser') || 'null');
  const gate = document.getElementById('buyerGate');
  const dashboard = document.getElementById('buyerDashboard');
  if (!session || session.role !== 'buyer') {
    gate.hidden = false;
    return;
  }

  dashboard.hidden = false;
  document.getElementById('buyerGreeting').textContent = session.name ? `Hi, ${session.name}` : 'Welcome back';

  const products = [
    { id: 1, name: 'Smartphone', category: 'electronics', price: 299.99, detail: 'Bright display · everyday performance', likelihood: 5 },
    { id: 2, name: 'Wireless Earbuds', category: 'electronics', price: 49.99, detail: 'Compact fit · clear everyday sound', likelihood: 4 },
    { id: 3, name: 'Beauty & Skincare Set', category: 'beauty', price: 35, detail: 'A simple daily self-care routine', likelihood: 3 },
    { id: 4, name: 'Kids Building Set', category: 'toys', price: 29.99, detail: 'Creative hands-on play', likelihood: 2 },
    { id: 5, name: 'Running Shoes', category: 'fashion', price: 59.99, detail: 'Lightweight everyday training', likelihood: 4 }
  ];
  const categoryImages = {
    electronics: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
    beauty: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=500&q=80',
    fashion: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
    toys: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=500&q=80'
  };
  const money = value => `$${Number(value).toFixed(2)}`;

  function renderProducts(query = '', category = 'all') {
    const sellerListings = JSON.parse(localStorage.getItem('shopzoneSellerListings') || '[]');
    const allProducts = [
      ...products.map(product => ({ ...product, source: 'store', stock: 12 })),
      ...sellerListings.filter(item => Number(item.stock) > 0).map(item => ({ ...item, source: 'seller', likelihood: 1, detail: `${item.fulfillment} · marketplace seller` }))
    ];
    const normalizedQuery = query.trim().toLowerCase();
    const results = allProducts
      .filter(item => category === 'all' || item.category === category)
      .filter(item => !normalizedQuery || `${item.name} ${item.category} ${item.detail}`.toLowerCase().includes(normalizedQuery))
      .map(item => {
        const text = `${item.name} ${item.category} ${item.detail}`.toLowerCase();
        const relevance = normalizedQuery ? (text.includes(normalizedQuery) ? 10 : 0) : 1;
        return { ...item, score: relevance + item.likelihood };
      })
      .sort((a, b) => b.score - a.score);
    const container = document.getElementById('buyerProducts');
    container.innerHTML = '';
    document.getElementById('searchFeedback').textContent = `${results.length} ${results.length === 1 ? 'result' : 'results'} · ranked in this browser demo`;

    results.forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'buyer-product-card';
      const heading = document.createElement('div');
      heading.className = 'buyer-product-topline';
      const title = document.createElement('h3');
      title.textContent = item.name;
      const tag = document.createElement('span');
      tag.className = item.source === 'seller' ? 'product-tag seller-tag' : index < 2 ? 'product-tag sponsored-tag' : 'product-tag';
      tag.textContent = item.source === 'seller' ? 'Marketplace seller' : index < 2 ? 'Sponsored · demo' : 'Recommended';
      heading.append(title, tag);
      const description = document.createElement('p');
      description.className = 'muted';
      description.textContent = `${item.category} · ${item.detail}`;
      const price = document.createElement('strong');
      price.className = 'buyer-price';
      price.textContent = money(item.price);
      const stock = document.createElement('p');
      stock.className = 'prototype-note';
      stock.textContent = `${item.stock} demo units shown · cart add does not reserve real inventory`;
      const action = document.createElement('button');
      action.className = 'primary-action';
      action.type = 'button';
      action.textContent = 'Add to cart';
      action.addEventListener('click', () => addToCart(item));
      card.append(heading, description, price, stock, action);
      container.appendChild(card);
    });
  }

  function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('shopzoneCart') || '[]');
    const key = `${item.name}-Standard-Default`;
    const existing = cart.find(entry => entry.key === key);
    if (existing) existing.quantity += 1;
    else cart.push({ key, name: item.name, price: Number(item.price), image: item.image || categoryImages[item.category] || '', size: 'Standard', color: 'Default', quantity: 1 });
    localStorage.setItem('shopzoneCart', JSON.stringify(cart));

    const reservations = JSON.parse(sessionStorage.getItem('shopzoneReservationPreview') || '{}');
    reservations[key] = (reservations[key] || 0) + 1;
    sessionStorage.setItem('shopzoneReservationPreview', JSON.stringify(reservations));
    renderCartSummary();
    window.showToast('Added to cart. Temporary reservation is a browser-only demo.');
  }

  function renderCartSummary() {
    const cart = JSON.parse(localStorage.getItem('shopzoneCart') || '[]');
    const quantity = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    document.getElementById('buyerCartSummary').textContent = quantity ? `${quantity} ${quantity === 1 ? 'item' : 'items'} in your cart.` : 'Your cart is empty.';
    const count = document.getElementById('cartCount');
    if (count) count.textContent = String(quantity);
  }

  function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('shopzoneOrders') || '[]');
    const container = document.getElementById('buyerOrders');
    container.replaceChildren();
    if (!orders.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-cart';
      empty.textContent = 'No demo orders yet. Complete checkout to see order milestones here.';
      container.appendChild(empty);
      return;
    }

    orders.forEach(order => {
      const card = document.createElement('article');
      card.className = 'order-card';
      const heading = document.createElement('div');
      heading.className = 'order-card-heading';
      const title = document.createElement('h3');
      title.textContent = `Order ${order.id}`;
      const date = document.createElement('span');
      date.className = 'muted';
      date.textContent = new Date(order.createdAt).toLocaleDateString();
      heading.append(title, date);
      const summary = document.createElement('p');
      summary.textContent = `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'} · ${money(order.total)} · Demo payment: ${order.payment}`;
      const timeline = document.createElement('ol');
      timeline.className = 'order-timeline';
      ['Order placed', 'Payment choice recorded (demo)', 'Preparing shipment', 'Carrier tracking pending'].forEach((label, index) => {
        const step = document.createElement('li');
        step.className = index < 3 ? 'complete' : '';
        step.textContent = label;
        timeline.appendChild(step);
      });
      card.append(heading, summary, timeline);
      container.appendChild(card);
    });
  }

  function renderNotifications() {
    const container = document.getElementById('buyerNotifications');
    const orders = JSON.parse(localStorage.getItem('shopzoneOrders') || '[]');
    container.replaceChildren();
    if (!orders.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.textContent = 'Order updates will appear after a demo checkout.';
      container.appendChild(empty);
      return;
    }
    orders.slice(0, 3).forEach(order => {
      const item = document.createElement('p');
      item.textContent = `${order.id}: demo order saved. Email/SMS notifications are not connected.`;
      container.appendChild(item);
    });
  }

  document.getElementById('buyerSearchForm').addEventListener('submit', event => {
    event.preventDefault();
    renderProducts(document.getElementById('buyerSearch').value, document.getElementById('buyerCategory').value);
  });
  renderProducts();
  renderCartSummary();
  renderOrders();
  renderNotifications();
})();
