const express = require("express");

const productController = require("../controllers/product");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;
