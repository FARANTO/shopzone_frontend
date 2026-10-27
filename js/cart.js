let cart = JSON.parse(localStorage.getItem('shopzoneCart') || '[]');
let currentStep = 1;
const money = amount => `$${amount.toFixed(2)}`;

function totals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal >= 100 ? 10 : 0;
  const shipping = subtotal > 0 ? 10 : 0;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

function renderCart() {
  const wrap = document.getElementById('cartItems');
  wrap.replaceChildren();
  const empty = document.getElementById('emptyCart');
  empty.hidden = cart.length > 0;
  document.querySelector('#checkoutStep1 .summary-card').style.opacity = cart.length ? '1' : '.7';

  cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'cart-item';

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;
    const info = document.createElement('div');
    info.className = 'cart-item-info';
    const name = document.createElement('h3');
    name.textContent = item.name;
    const quantity = document.createElement('p');
    quantity.textContent = `Quantity: ${item.quantity}`;
    const size = document.createElement('p');
    size.textContent = `Size: ${item.size}`;
    const color = document.createElement('p');
    color.textContent = `Color: ${item.color}`;
    const price = document.createElement('strong');
    price.textContent = `${money(item.price)}${item.quantity > 1 ? ` × ${item.quantity}` : ''}`;
    info.append(name, quantity, size, color, price);

    const remove = document.createElement('button');
    remove.className = 'remove-item';
    remove.type = 'button';
    remove.dataset.index = String(index);
    remove.title = 'Remove';
    remove.textContent = '🗑';
    row.append(image, info, remove);
    wrap.appendChild(row);
  });

  document.querySelectorAll('.remove-item').forEach(button => {
    button.onclick = () => {
      cart.splice(Number(button.dataset.index), 1);
      save();
      renderCart();
    };
  });
  updateSummary();
  document.getElementById('cartCount').textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
}

function updateSummary() {
  const amount = totals();
  document.getElementById('subtotal').textContent = money(amount.subtotal);
  document.getElementById('discount').textContent = `-${money(amount.discount)}`;
  document.getElementById('shipping').textContent = money(amount.shipping);
  document.getElementById('total').textContent = money(amount.total);
  document.querySelectorAll('.subtotal-copy').forEach(element => element.textContent = money(amount.subtotal));
  document.querySelectorAll('.discount-copy').forEach(element => element.textContent = `-${money(amount.discount)}`);
  document.querySelectorAll('.shipping-copy').forEach(element => element.textContent = money(amount.shipping));
  document.querySelectorAll('.total-copy').forEach(element => element.textContent = money(amount.total));
}

function save() {
  localStorage.setItem('shopzoneCart', JSON.stringify(cart));
}

function showStep(step) {
  currentStep = step;
  [1, 2, 3].forEach(number => {
    document.querySelector(`[data-step="${number}"]`).classList.toggle('active', number === step);
    document.getElementById(`checkoutStep${number}`).hidden = number !== step;
  });
  document.getElementById('orderSuccess').hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('toAddress').onclick = () => {
  if (!cart.length) {
    showToast('Your cart is empty. Add a product first.');
    return;
  }
  showStep(2);
};
document.getElementById('backToCart').onclick = () => showStep(1);
document.getElementById('addressForm').onsubmit = event => {
  event.preventDefault();
  const address = Object.fromEntries(new FormData(event.currentTarget).entries());
  localStorage.setItem('shopzoneAddress', JSON.stringify(address));
  showStep(3);
};
document.getElementById('backToAddress').onclick = () => showStep(2);
document.getElementById('placeOrder').onclick = () => {
  if (currentStep !== 3 || !cart.length) {
    showToast('Complete the cart and shipping steps before placing an order.');
    return;
  }
  const method = document.querySelector('input[name="payment"]:checked').value;
  const order = {
    id: `SZ-${Date.now()}`,
    createdAt: new Date().toISOString(),
    items: cart.map(item => ({ ...item })),
    total: totals().total,
    payment: method
  };
  const orders = JSON.parse(localStorage.getItem('shopzoneOrders') || '[]');
  orders.unshift(order);
  localStorage.setItem('shopzoneOrders', JSON.stringify(orders));
  localStorage.setItem('shopzoneLastPayment', method);
  localStorage.removeItem('shopzoneCart');
  cart = [];
  document.querySelectorAll('.checkout-layout').forEach(layout => layout.hidden = true);
  document.querySelectorAll('.checkout-steps .step').forEach(step => step.classList.remove('active'));
  document.getElementById('orderSuccess').hidden = false;
  document.getElementById('cartCount').textContent = '0';
};

renderCart();
