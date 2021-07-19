const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A product must have a title"],
      unique: true,
      trim: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, "A product must have a description"],
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // THIS KEYWORD IN THE FUNC DOES NOT WORK ON UPDATE
          return val < this.price;
          // this points to the curr doc that's being created
        },
        message:
          "The Discounted price ({VALUE}) must be below the regular price",
      },
    },
    images: [String],
    subCategories: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

///////////////////////////////////////////////////////
////// DOCUMENT MIDDLEWARE

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
