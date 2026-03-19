import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const MAX_QTY_PER_ITEM = 200;

async function initCartPage() {
  await loadHeaderFooter();
  await renderCartContents();
}

async function getCartContents() {
  let cart = getLocalStorage("so-cart");
  if (!Array.isArray(cart)) cart = [];
  let cartItems = await Promise.all(cart.map(item => {
    return dataSource.findProductById(item.productId);
  }));
  return cartItems.filter(cart => !!cart);
}

async function renderCartContents() {
  let cart = getLocalStorage("so-cart");
  const cartItems = await getCartContents();

  const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, cart[index]));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  setupRemoveListeners();
  setupQuantityChangeListeners();

  await updatePrices();
}

async function updatePrices() {
  let cart = getLocalStorage("so-cart");
  const cartItems = await getCartContents();
  const cartFooter = document.querySelector(".cart-footer");
  
  cartItems.forEach(async (cartItem, index) => {
    const costElement = document.querySelector(`#_${cartItem.Id} .cart-card__price`);
    const item = await dataSource.findProductById(cartItem.Id);
    costElement.textContent = (item.FinalPrice * cart[index].count).toFixed(2);
  });

  if (cartItems.length > 0) {
    cartFooter.classList.remove("hide");

    const price = cartItems.map((item, index) => item.FinalPrice * cart[index].count);
    const totalPrice = price.reduce((sum, item) => sum + item, 0);
    const totalElement = document.querySelector(".cart-total");

    if (totalElement) {
      totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }

  } else {
    cartFooter.classList.add("hide");
  }
}

function cartItemTemplate(item, inBag) {
  return `
    <li class="cart-card divider" id="_${item.Id}">
      <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: <input type="number" name="quantity" value="${inBag.count}" data-id="${item.Id}" min="1" max="${MAX_QTY_PER_ITEM}"></p>
      <p class="cart-card__price">$${(item.FinalPrice * inBag.count).toFixed(2)}</p>

      <button type="button" class="cart-card__remove" data-id="${item.Id}">
        X
      </button>
    </li>
  `;
}

function removeCartItemFromStorage(id) {
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) cartItems = [];

  const updatedCart = cartItems.filter(item => item.productId !== id);

  setLocalStorage('so-cart', updatedCart);
  renderCartContents();
}

function setupRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;
      removeCartItemFromStorage(itemId);
    });
  });
}

function updateCartItemQuantity(id, count) {
  let cartItems = getLocalStorage("so-cart");
  if (!Array.isArray(cartItems)) cartItems = [];
  
  cartItems.forEach(item => {
    if (item.productId !== id) return;
    item.count = count;
  })

  setLocalStorage('so-cart', cartItems);
}

function setupQuantityChangeListeners() {
  const quantityInput = document.querySelectorAll(".cart-card__quantity input");

  quantityInput.forEach((button) => {
    button.addEventListener("change", async () => {
      const itemId = button.dataset.id;
      if (button.value > MAX_QTY_PER_ITEM) {
        button.value = MAX_QTY_PER_ITEM;
      }
      if (button.value.includes(".")) {
        button.value -= button.value % 1;
      }
      if (isNaN(button.value)) {
        button.value = 1;
      }
      updateCartItemQuantity(itemId, parseInt(button.value));
      await updatePrices();
    });
  });
}

initCartPage();