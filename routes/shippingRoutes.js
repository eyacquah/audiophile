const express = require("express");

const shippingMethodController = require("../controllers/shippingMethod");

const router = express.Router();

router
  .route("/")
  .get(shippingMethodController.getAllShippingMethods)
  .post(shippingMethodController.createShippingMethod);

router
  .route("/:id")
  .get(shippingMethodController.getShippingMethod)
  .patch(shippingMethodController.updateShippingMethod)
  .delete(shippingMethodController.deleteShippingMethod);

module.exports = router;
