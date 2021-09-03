const mongoose = require("mongoose");
const slugify = require("slugify");

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A collection must have a title"],
    unique: true,
    trim: true,
  },
  slug: String,
  description: String,
});

// Index

///////////////////////////////////////////////////////////// DOCUMENT MIDDLEWARE

collectionSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
