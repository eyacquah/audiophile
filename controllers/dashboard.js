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
  // console.log(order.products);

  res.status(200).render("dashboard/editOrder", {
    title: "Order Detail",
    order,
  });
});

// exports.getAllCustomers = catchAsync(async (req, res, next) => {
//   const customers = await Customer.find();

//   res.status(200).render("dashboard/customer-list", {
//     title: "All Customers",
//     customers,
//   });
// });

// exports.getAllOrders = catchAsync(async (req, res, next) => {
//   const results = await Order.find();

//   // const orders = results.map((order) => {
//   //   order.payStatus = order.paid ? "Paid" : "Pending";
//   //   order.delStatus = order.delivered ? "Delivered" : "Pending";
//   //   return order;
//   // });

//   orders.reverse();

//   res.status(200).render("dashboard/order-list", {
//     title: "All Orders",
//     orders,
//   });
// });

// ///// DELETE

// exports.confirmDeleteProduct = catchAsync(async (req, res, next) => {
//   const productArr = await Product.find({ slug: req.params.slug });
//   const product = productArr[0];

//   res.status(200).render("dashboard/delete-product", {
//     product,
//   });
// });

// exports.confirmDeleteBrand = catchAsync(async (req, res, next) => {
//   const catArr = await Brand.find({ slug: req.params.slug });
//   const brand = catArr[0];

//   res.status(200).render("dashboard/delete-brand", {
//     brand,
//   });
// });

// exports.confirmDeleteOrder = catchAsync(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   res.status(200).render("dashboard/delete-order", {
//     order,
//   });
// });

// exports.getSearchResults = catchAsync(async (req, res, next) => {
//   const { product } = req.query;

//   const results = await Product.find({
//     title: { $regex: new RegExp(`^${product}`, "i") },
//   });

//   const features = new APIFeatures(
//     Product.find({
//       title: { $regex: new RegExp(`^${product}`, "i") },
//     }),
//     req.query
//   ).paginate();

//   const allProducts = await features.query;

//   const products = allProducts.map((item) => {
//     item.amountOff = item.priceDiscount
//       ? 100 - Math.floor((item.priceDiscount / item.price) * 100)
//       : 0;

//     return item;
//   });

//   const numResults = results.length;
//   const RES_PER_PAGE = 10;
//   const numOfPages = Math.ceil(numResults / RES_PER_PAGE);
//   const currPage = +req.query.page || 1;

//   res.locals.currPage = currPage;
//   res.locals.numOfPages = numOfPages;
//   res.locals.pageLimit = RES_PER_PAGE;
//   res.locals.query = product;

//   res.status(200).render("dashboard/product-list", {
//     title: "Admin",
//     products,
//   });
// });

// exports.getSliderUpdateForm = catchAsync(async (req, res, next) => {
//   const slider = await Slider.findById("603e1a9e45a8e80a8ca21fa9");
//   res.status(200).render("dashboard/slider-form", {
//     slider,
//   });
// });
