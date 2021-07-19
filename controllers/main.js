// const Store = require("../models/storeModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

exports.renderIndex = (req, res, next) => {
  res.status(200).render("main/index", { title: "Home" });
};

exports.renderDashboard = catchAsync(async (req, res) => {
  res.status(200).render("dashboard/index", { title: `Dashboard` });
});

exports.renderProductForm = (req, res) => {
  res.status(200).render("dashboard/add-product", {
    title: `Add Product`,
  });
};

// exports.renderProductsDashboard = catchAsync(async (req, res) => {
//   const products = await Product.find();

//   res.status(200).render("dashboard/products", {
//     products,
//     title: `Products`,
//   });
// });

exports.renderStoreDetail = catchAsync(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.storeSlug });
  const products = await Product.find({ store: store._id });

  res
    .status(200)
    .render("store-detail", { store, products, title: store.storeName });
});

exports.renderProductDetail = catchAsync(async (req, res) => {
  const product = await Product.find({ slug: req.params.slug });

  res.status(200).render("main/product-detail", {
    product,
    title: product.title,
  });
});

exports.renderCartPage = (req, res) => {
  res.status(200).render("main/cart", { title: "cart" });
};

exports.renderCheckoutPage = (req, res) => {
  res.status(200).render("main/checkout", { title: "Checkout" });
};

exports.renderShippingPage = (req, res) => {
  res.status(200).render("main/shipping", { title: "Shipping" });
};

exports.renderPaymentPage = (req, res) => {
  res.status(200).render("main/payment", { title: "Payment" });
};
exports.renderOrderSummaryPage = (req, res) => {
  res.status(200).render("main/order-summary", { title: "Order Summary" });
};

exports.renderOrderCompletePage = (req, res) => {
  res.status(200).render("main/order-complete", { title: "Order" });
};

exports.renderCategoriesDashboard = (req, res) => {
  res.status(200).render("dashboard/category-list");
};
