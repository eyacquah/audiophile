const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const Brand = require("../models/brandModel");
const Collection = require("../models/collectionModel");
const ShippingMethod = require("../models/shippingModel");
const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");
const User = require("../models/userModel");
// const Slider = require("../models/sliderModel");
const APIFeatures = require("../utils/apiFeatures");

exports.renderLoginForm = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    await User.findById(decodedToken.id);
    return next();
  } catch (err) {
    // console.log(err);
    res.status(200).render("dashboard/login", {
      title: "Login",
    });
  }
};

exports.getDashboard = catchAsync(async (req, res) => {
  const orders = await Order.find();

  res.status(200).render("dashboard/index", { orders });
});

exports.getAllBrands = catchAsync(async (req, res, next) => {
  const brands = await Brand.find();

  res.status(200).render("dashboard/brand-list", {
    brands,
  });
});

exports.getAllCollections = catchAsync(async (req, res, next) => {
  const collections = await Collection.find();

  res.status(200).render("dashboard/collection-list", { collections });
});

exports.renderProductForm = catchAsync(async (req, res) => {
  const brands = await Brand.find();
  const collections = await Collection.find();
  res.status(200).render("dashboard/add-product", { brands, collections });
});

exports.getUpdateProductForm = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  const brands = await Brand.find();
  const collections = await Collection.find();

  res.status(200).render("dashboard/editProduct", {
    product,
    brands,
    collections,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).render("dashboard/product-list", {
    title: "All Products",
    products,
  });
});

exports.getShippingMethods = catchAsync(async (req, res, next) => {
  const shippingMethods = await ShippingMethod.find();

  res.status(200).render("dashboard/shipping-list", {
    title: "Shiping Methods",
    shippingMethods,
  });
});

exports.getOrderDetail = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  res.status(200).render("dashboard/editOrder", {
    title: "Order Detail",
    order,
  });
});
