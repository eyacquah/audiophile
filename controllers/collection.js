const factory = require("./handlerFactory");

const Collection = require("../models/collectionModel");

// FACTORY CRUD
exports.createCollection = factory.createOne(Collection);
exports.getAllCollections = factory.getAll(Collection);
// exports.getCollection = factory.getOne(Collection, { path: "products" });
exports.getCollection = factory.getOne(Collection);
exports.updateCollection = factory.updateOne(Collection);
exports.deleteCollection = factory.deleteOne(Collection);
