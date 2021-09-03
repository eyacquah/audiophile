const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      type: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "An order must have at least one product"],
      },
      orderQuantity: Number,
      price: Number,
      colour: String,
    },
  ],
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: [true, "An order must belong to a customer"],
  },
  total: {
    type: Number,
    required: [true, "An order must have a total amount"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: false,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  shippingAddress: {
    name: String,
    phoneNumber: String,
    email: String,
    country: String,
    region: String,
    city: String,
    streetAddress: String,
  },
  shippingMethod: {
    title: String,
    description: String,
    fee: String,
  },
  subtotal: Number,
  orderNum: String,
  date: String,
  paymentMethod: String,
  notes: [
    {
      text: String,
      by: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

orderSchema.pre(/^find/, function (next) {
  this.populate("customer").populate({
    path: "products.type",
    select: "title",
  });
  next();
});

orderSchema.pre("save", function (next) {
  // Create Order Number
  let id = this._id;
  id = `${id}`;

  this.orderNum = `GH-${id.slice(-5).toUpperCase()}`;

  // Create Human Readable Date
  const date = new Date(Date.parse(this.createdAt));
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  this.date = date.toLocaleString("en-GB", options);

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
