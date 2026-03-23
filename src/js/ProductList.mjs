import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  console.log(product);
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <picture>
           <source srcset="${product.Images.PrimaryExtraLarge}" media="(min-width: 2000px)">
           <source srcset="${product.Images.PrimaryLarge}" media="(min-width: 1000px)">
           <source srcset="${product.Images.PrimaryMedium}" media="(min-width: 550px)">
           <img src="${product.Images.PrimarySmall}" alt="${product.Name}"width="400" height="200">
        </picture>
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    //const list = await this.dataSource.getData();
    this.renderList(list);
    document.querySelector(".title").textContent = this.category;
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate,this.listElement,list);
  }
}