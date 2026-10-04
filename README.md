# ShopZone — Amazon-like E-Commerce Frontend Prototype

This version expands the original frontend prototype into a small multi-page e-commerce experience.

## Pages

```text
index.html       -> Landing/storefront
product.html     -> Dynamic product detail page (`?id=1`, `?id=2`, etc.)
signin.html      -> Sign-in page
cart.html        -> 3-step shopping cart / checkout
admin.html       -> Admin dashboard panel
```

## Main features

- Amazon-like landing page/header/footer.
- Every product opens a dedicated product detail page.
- Product detail supports image, description, price, size, color, quantity, Add to Cart and Buy this Item.
- Cart icon opens the three-level checkout process:
  1. Shopping Cart
  2. Shipping Address
  3. Payment Method
- Cart products can be removed.
- Cart data is persisted in `localStorage`.
- Shipping address is stored locally for this frontend prototype.
- Demo order placement clears the cart and shows an order confirmation.
- Admin Dashboard link is present in the navbar.
- Admin dashboard contains overview cards, sales chart, latest orders, products and customer sections.
- Light/dark mode can be switched from the navbar and is persisted in `localStorage`.
- Sign-in is currently a frontend demo and does not authenticate against a backend.
- Product/order/payment/admin actions are frontend prototypes and can later connect to the microservices project.

## Run locally

### Simple method

Open `index.html` in a browser.

### Recommended: VS Code + Live Server

1. Extract the ZIP.
2. Open the project folder in VS Code.
3. Install the Live Server extension.
4. Right-click `index.html`.
5. Choose **Open with Live Server**.

## Project structure

```text
shopzone_amazon_like_frontend/
├── index.html
├── product.html
├── signin.html
├── cart.html
├── admin.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   ├── product.js
│   ├── cart.js
│   └── admin.js
└── assets/
```

## Connecting to the real microservices later

The frontend is intentionally written so the demo/localStorage logic can later be replaced by API calls to the project's services:

- Authentication service -> sign-in and authorization.
- Product service -> product list and product detail.
- Order service -> cart/order creation and order history.
- Payment service -> Stripe/payment processing.
- Email service -> order confirmation/notifications.

No real payment credentials or production authentication are included in this prototype.
"# shopzone_frontend" 
