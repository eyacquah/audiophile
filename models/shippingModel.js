const mongoose = require("mongoose");
const slugify = require("slugify");

const shippingMethodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A shipping method must have a title"],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["local", "international"],
  },
  duration: String,
  fee: Number,
  slug: String,
  description: String,
});

// Index

///////////////////////////////////////////////////////////// DOCUMENT MIDDLEWARE

shippingMethodSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const ShippingMethod = mongoose.model("ShippingMethod", shippingMethodSchema);

module.exports = ShippingMethod;
