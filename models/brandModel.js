const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A brand must have a title"],
      unique: true,
      trim: true,
    },
    slug: String,
    description: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index

brandSchema.virtual("products", {
  ref: "Product",
  foreignField: "brand",
  localField: "_id",
});

///////////////////////////////////////////////////////////// DOCUMENT MIDDLEWARE

brandSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
