// Cart State
let cart = [];

// DOM Elements
const cartLink = document.querySelector('.cart-link');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const cartClose = document.getElementById('cart-close');
const cartBody = document.getElementById('cart-body');
const cartFooter = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.querySelector('.cart-count');
const productCards = document.querySelectorAll('.product-card');

// Open/Close Cart
cartLink.addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});

cartOverlay.addEventListener('click', closeCart);
cartClose.addEventListener('click', closeCart);

function openCart() {
  cartOverlay.classList.add('open');
  cartDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

// Add to Cart on click
productCards.forEach(card => {
  if (card.classList.contains('sold-out')) return;

  card.addEventListener('click', (e) => {
    e.preventDefault();
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    addToCart(name, price);
  });
});

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function updateQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

function renderCart() {
  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartBody.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';

  let html = '';
  cart.forEach((item, i) => {
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${i}, -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${i}, 1)">+</button>
        </div>
      </div>
    `;
  });

  cartBody.innerHTML = html;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Smooth scroll for "See All Products"
document.querySelector('.see-all-btn').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
});
