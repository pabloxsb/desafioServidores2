import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async readProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const products = await fs.promises.readFile(this.path, "utf-8");
        if (products) {
          const productsJs = JSON.parse(products);
          this.products = productsJs;
        } else {
          this.products = [];
        }
        return this.products;
      } else {
        this.products = [];
        return this.products;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    if (this.products.length === 0) {
      return "List empty";
    }
    return this.products;
  }

  async writeProducts(newProduct) {
    try {
      this.products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    this.getProducts();
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return "Error: All fields are required";
    }

    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      return "Error: The product has already been added";
    }

    const newProduct = {
      id: this.getId() + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    await this.writeProducts(newProduct);
  }

  getId() {
    let maxId = 0;
    this.products.map((prod) => {
      if (prod.id > maxId) {
        maxId = prod.id;
      }
      return maxId;
    });
    return maxId;
  }

  async getProductById(id) {
    this.readProducts();
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      return "Not found";
    }
    return product;
  }

  async updateProduct(id, field, value) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      return "Product not found";
    }
    product[field] = value;
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return product;
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return "Product not found";
    }
    const deletedProduct = this.products.splice(index, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return deletedProduct[0];
  }
}