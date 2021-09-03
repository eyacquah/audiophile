const express = require("express");

const collectionController = require("../controllers/collection");

const router = express.Router();

router
  .route("/")
  .get(collectionController.getAllCollections)
  .post(collectionController.createCollection);

router
  .route("/:id")
  .get(collectionController.getCollection)
  .patch(collectionController.updateCollection)
  .delete(collectionController.deleteCollection);

module.exports = router;
