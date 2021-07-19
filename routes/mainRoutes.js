const express = require("express");

const mainController = require("../controllers/main");
// const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", mainController.renderIndex);

// router.get(
//   "/create-store",
//   authController.limitToUsers,
//   mainController.renderCreateStoreForm
// );

router.get("/cart", mainController.renderCartPage);
router.get("/checkout", mainController.renderCheckoutPage);
router.get("/shipping", mainController.renderShippingPage);
router.get("/payment", mainController.renderPaymentPage);
router.get("/order-summary", mainController.renderOrderSummaryPage);
router.get("/order/complete", mainController.renderOrderCompletePage);

// router.use(authController.limitToStoreOwners);

router.get("/products/:productSlug", mainController.renderProductDetail);
// router.get("/:storeSlug", mainController.renderStoreDetail);

module.exports = router;
