import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  let cartItems = getLocalStorage('so-cart');
  if (!Array.isArray(cartItems)) cartItems = [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  const cartFooter = document.querySelector('.cart-footer');
  if (cartItems.length > 0) {
    cartFooter.classList.remove('hide');

    let totalPrice = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    const totalElement = document.querySelector('.cart-total');
    if (totalElement) {
      totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
  } else {
    cartFooter.classList.add('hide');
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
