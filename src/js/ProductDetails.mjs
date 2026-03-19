import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart");
    if (!Array.isArray(cart)) cart = [];
    // Prevent duplicate items in the cart!! Don't redo this
    const item = cart.filter(item => item.productId === this.product.Id);
    if (item.length === 0) {
      cart.push({
        productId: this.product.Id,
        count: 1
      });
    } else {
      item[0].count++;
    }
    setLocalStorage("so-cart", cart);
  }

  renderProductDetails() {
    document.getElementById("productBrand").textContent =
      this.product.Brand.Name;
    document.getElementById("productName").textContent =
      this.product.NameWithoutBrand;
    document.getElementById("productImage").src = this.product.Image;
    document.getElementById("productImage").alt =
      this.product.NameWithoutBrand;
    document.getElementById("productPrice").textContent =
      `$${this.product.FinalPrice}`;
    document.getElementById("productColor").textContent =
      this.product.Colors[0].ColorName;
    document.getElementById("productDescription").innerHTML =
      this.product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = this.product.Id;
    document.title = `Sleep Outside | ${this.product.Name}`;
  }
}