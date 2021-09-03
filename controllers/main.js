const Brand = require("../models/brandModel");
const Collection = require("../models/collectionModel");
const Product = require("../models/productModel");
const ShippingMethod = require("../models/shippingModel");

const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllBrands = catchAsync(async (req, res, next) => {
  res.locals.brands = await Brand.find();
  next();
});

exports.renderIndex = catchAsync(async (req, res, next) => {
  const trending = await Product.find({
    collections: { $in: [`61114c101b26bb3fec0e12de`] },
  });

  const bestSellers = await Product.find({
    collections: { $in: [`61114bf21b26bb3fec0e12d9`] },
  });

  const groupArr = [];
  let group = [];

  bestSellers.forEach((item, idx) => {
    group.push(item);

    if (group.length === 6 || idx === bestSellers.length - 1) {
      groupArr.push(group);
      group = [];
    }
  });

  res.status(200).render("main/index", { title: "Home", trending, groupArr });
});

exports.getBrandProducts = catchAsync(async (req, res, next) => {
  const brand = await Brand.findOne({
    slug: req.params.brand,
  }).populate("products");

  req.numResults = brand.products.length;
  req.queryObj = { brand: brand._id };
  req.pageTitle = brand.title;
  next();
});

exports.getCollectionProducts = catchAsync(async (req, res, next) => {
  const collection = await Collection.findOne({ slug: req.params.collection });

  const collectionProducts = await Product.find({
    collections: { $in: [`${collection.id}`] },
  });

  req.numResults = collectionProducts.length;
  req.queryObj = { collections: { $in: [`${collection.id}`] } };
  req.pageTitle = collection.title;

  next();
});

exports.getSearchResults = catchAsync(async (req, res, next) => {
  const { product } = req.query;
  delete req.query.product;

  const results = await Product.find({
    $text: { $search: product },
  });

  req.numResults = results.length;
  req.queryObj = { $text: { $search: product } };
  req.pageTitle = "Products";

  next();
});

exports.renderProducts = catchAsync(async (req, res, next) => {
  const { numResults } = req;
  const RES_PER_PAGE = 8;
  const numOfPages = Math.ceil(numResults / RES_PER_PAGE);

  const currPage = +req.query.page || 1;

  res.locals.currPage = currPage;
  res.locals.numOfPages = numOfPages;
  res.locals.pageLimit = RES_PER_PAGE;

  // Execute Query
  const features = new APIFeatures(Product.find(req.queryObj), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).render("main/products", {
    title: req.pageTitle,
    products,
  });
});

exports.renderProductDetail = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.product });

  const relatedProducts = await Product.find({
    collections: { $in: [...product.collections] },
  });

  const shippingMethods = await ShippingMethod.find();

  res.status(200).render("main/product-detail", {
    product,
    title: product.title,
    relatedProducts,
    shippingMethods,
  });
});

exports.renderCartPage = (req, res) => {
  res.status(200).render("main/cart", { title: "Cart" });
};

exports.renderCheckoutPage = (req, res) => {
  res.status(200).render("main/checkout", { title: "Checkout" });
};

exports.renderShippingPage = catchAsync(async (req, res, next) => {
  const shippingMethods = await ShippingMethod.find();

  res
    .status(200)
    .render("main/shipping", { title: "Shipping", shippingMethods });
});

exports.renderPaymentPage = (req, res) => {
  res.status(200).render("main/payment", { title: "Payment" });
};
exports.renderOrderSummaryPage = (req, res) => {
  res.status(200).render("main/order-summary", { title: "Order Summary" });
};

exports.renderOrderCompletePage = (req, res) => {
  res.status(200).render("main/order-complete", { title: "Order" });
};
