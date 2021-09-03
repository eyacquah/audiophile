const express = require("express");

// const authController = require("../controllers/authController");
const dashboardController = require("../controllers/dashboard");

const router = express.Router();

// Routes

// router.use(authController.protect);
router.use(dashboardController.renderLoginForm);

router.get("/", dashboardController.getDashboard);

// router.get("/search", dashboardController.getSearchResults);

router.get("/products/add", dashboardController.renderProductForm);
router.get("/products/:slug/edit", dashboardController.getUpdateProductForm);
// router.get("/products/:slug/delete", dashboardController.confirmDeleteProduct);
router.get("/products/all", dashboardController.getAllProducts);

router.get("/brands", dashboardController.getAllBrands);
router.get("/collections", dashboardController.getAllCollections);
router.get("/shipping", dashboardController.getShippingMethods);

// router.get("/brands/add", dashboardController.getBrandForm);
// router.get("/brands/:slug/delete", dashboardController.confirmDeleteBrand);

// router.get("/customers/all", dashboardController.getAllCustomers);

// router.get("/orders/all", dashboardController.getAllOrders);
// router.get("/orders/:id/delete", dashboardController.confirmDeleteOrder);
router.get("/orders/:orderId", dashboardController.getOrderDetail);
// router.get("/sliders/update", dashboardController.getSliderUpdateForm);

module.exports = router;
