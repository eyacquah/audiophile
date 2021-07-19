const express = require("express");

// const authController = require("../controllers/authController");
const dashboardController = require("../controllers/dashboard");

const router = express.Router();

// Routes

// router.use(authController.protect);

router.get("/", dashboardController.getDashboard);

// router.get("/search", dashboardController.getSearchResults);

router.get("/products/add", dashboardController.renderProductForm);
router.get("/products/:slug/edit", dashboardController.getUpdateProductForm);
// router.get("/products/:slug/delete", dashboardController.confirmDeleteProduct);
router.get("/products/all", dashboardController.getAllProducts);

router.get("/categories", dashboardController.getAllCategories);
// router.get("/categories/add", dashboardController.getCategoryForm);
// router.get("/categories/:slug/delete", dashboardController.confirmDeleteCategory);

// router.get("/customers/all", dashboardController.getAllCustomers);

// router.get("/orders/all", dashboardController.getAllOrders);
// router.get("/orders/:id/delete", dashboardController.confirmDeleteOrder);
// router.get("/orders/:orderId", dashboardController.getOrderDetail);
// router.get("/sliders/update", dashboardController.getSliderUpdateForm);

module.exports = router;
