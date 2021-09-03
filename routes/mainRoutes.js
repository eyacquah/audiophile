const express = require("express");

const mainController = require("../controllers/main");
// const authController = require("../controllers/authController");

const router = express.Router();

router.get("*", mainController.getAllBrands);
router.get("/", mainController.renderIndex);

router.get("/cart", mainController.renderCartPage);
router.get("/checkout", mainController.renderCheckoutPage);
router.get("/shipping", mainController.renderShippingPage);
router.get("/payment", mainController.renderPaymentPage);
router.get("/order-summary", mainController.renderOrderSummaryPage);
router.get("/order/complete", mainController.renderOrderCompletePage);

router.get(
  "/search",
  mainController.getSearchResults,
  mainController.renderProducts
);

router.get("/products/:product", mainController.renderProductDetail);
router.get(
  "/brands/:brand",
  mainController.getBrandProducts,
  mainController.renderProducts
);

router.get(
  "/collections/:collection",
  mainController.getCollectionProducts,
  mainController.renderProducts
);

// router.get("/orders/:orderID", mainController.getOrderCompletePage);

module.exports = router;
