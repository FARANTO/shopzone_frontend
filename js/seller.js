(() => {
  const storageKey = 'shopzoneSellerListings';
  const form = document.getElementById('sellerListingForm');
  const body = document.getElementById('sellerListings');
  function getListings() {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  }

  function renderListings() {
    const listings = getListings();
    body.replaceChildren();
    document.getElementById('sellerEmpty').hidden = listings.length > 0;
    listings.forEach(listing => {
      const row = document.createElement('tr');
      [listing.name, listing.category, `$${Number(listing.price).toFixed(2)}`, String(listing.stock), listing.fulfillment].forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.appendChild(cell);
      });
      const actions = document.createElement('td');
      const stockButton = document.createElement('button');
      stockButton.className = 'table-action';
      stockButton.type = 'button';
      stockButton.textContent = 'Edit stock';
      stockButton.addEventListener('click', () => updateStock(listing.id));
      const priceButton = document.createElement('button');
      priceButton.className = 'table-action';
      priceButton.type = 'button';
      priceButton.textContent = 'Edit price';
      priceButton.addEventListener('click', () => updatePrice(listing.id));
      const removeButton = document.createElement('button');
      removeButton.className = 'table-action danger-action';
      removeButton.type = 'button';
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => removeListing(listing.id));
      actions.append(stockButton, priceButton, removeButton);
      row.appendChild(actions);
      body.appendChild(row);
    });
    document.getElementById('sellerListingCount').textContent = String(listings.length);
    document.getElementById('sellerStockCount').textContent = String(listings.reduce((sum, item) => sum + Number(item.stock), 0));
  }

  function updateStock(id) {
    const listings = getListings();
    const listing = listings.find(item => item.id === id);
    if (!listing) return;
    const value = window.prompt(`Available units for ${listing.name}:`, String(listing.stock));
    if (value === null) return;
    const stock = Number(value);
    if (!Number.isInteger(stock) || stock < 0) {
      window.showToast('Enter a whole number of zero or more.');
      return;
    }
    listing.stock = stock;
    localStorage.setItem(storageKey, JSON.stringify(listings));
    renderListings();
  }

  function updatePrice(id) {
    const listings = getListings();
    const listing = listings.find(item => item.id === id);
    if (!listing) return;
    const value = window.prompt(`Price in USD for ${listing.name}:`, Number(listing.price).toFixed(2));
    if (value === null) return;
    const price = Number(value);
    if (!Number.isFinite(price) || price <= 0) {
      window.showToast('Enter a price greater than zero.');
      return;
    }
    listing.price = price;
    localStorage.setItem(storageKey, JSON.stringify(listings));
    renderListings();
  }

  function removeListing(id) {
    localStorage.setItem(storageKey, JSON.stringify(getListings().filter(item => item.id !== id)));
    renderListings();
    window.showToast('Demo listing removed.');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const listing = {
      id: `seller-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(data.get('name')).trim(),
      category: String(data.get('category')),
      price: Number(data.get('price')),
      stock: Number(data.get('stock')),
      fulfillment: String(data.get('fulfillment'))
    };
    if (!listing.name || !Number.isFinite(listing.price) || listing.price <= 0 || !Number.isInteger(listing.stock) || listing.stock < 0) {
      window.showToast('Enter a valid product name, price, and whole-number stock quantity.');
      return;
    }
    const listings = getListings();
    listings.unshift(listing);
    localStorage.setItem(storageKey, JSON.stringify(listings));
    form.reset();
    renderListings();
    window.showToast('Listing saved to this browser demo.');
  });

  renderListings();
})();
