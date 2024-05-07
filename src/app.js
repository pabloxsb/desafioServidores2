import express from "express";
import ProductManager from "./products/ProductManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./products.json");

//<--- rutas --->

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.readProducts();
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.status(200).json(limitedProducts);
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/products/:idProd", async (req, res) => {
  try {
    const { idProd } = req.params;
    const prod = await productManager.getProductById(parseInt(idProd));
    if (prod) {
      res.json(prod);
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server ok on port 8080");
});