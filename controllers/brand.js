const factory = require("./handlerFactory");

const Brand = require("../models/brandModel");

// FACTORY CRUD
exports.createBrand = factory.createOne(Brand);
exports.getAllBrands = factory.getAll(Brand);
// exports.getBrand = factory.getOne(Brand, { path: "products" });
exports.getBrand = factory.getOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
