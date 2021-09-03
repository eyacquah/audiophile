const factory = require("./handlerFactory");

const ShippingMethod = require("../models/shippingModel");

// FACTORY CRUD
exports.createShippingMethod = factory.createOne(ShippingMethod);
exports.getAllShippingMethods = factory.getAll(ShippingMethod);
exports.getShippingMethod = factory.getOne(ShippingMethod);
exports.updateShippingMethod = factory.updateOne(ShippingMethod);
exports.deleteShippingMethod = factory.deleteOne(ShippingMethod);
