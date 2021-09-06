const multer = require("multer");
const sharp = require("sharp");

const factory = require("./handlerFactory");
const Product = require("../models/productModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { uploadToGCP } = require("../utils/uploadImage");

exports.createProduct = factory.createOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

// //////////////////////////////////////////
//// IMAGE UPLOADS AND PROCESSING

const multerStorage = multer.memoryStorage();

// Filter for Valid File Types
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload an image", 400), false);
  }
};

// Handle Upload
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.array("images", 7);

// Resizing Uploaded Images
exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (req.files.length === 0) return next();

  // Store the images in the body
  req.body.images = new Array(req.files.length).fill("");

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `product-${Math.random() * 1000}-${Date.now()}-${
        i + 1
      }.jpeg`;
      // const filename = file.originalname;

      const resizedImage = await sharp(file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();

      const imageUrl = await uploadToGCP({ filename, buffer: resizedImage });

      const originalName = +file.originalname.split(".")[0];
      req.body.images[originalName - 1] = imageUrl;
    })
  );

  next();
});

// UPDATE PRODUCT
exports.updateProduct = catchAsync(async (req, res, next) => {
  const doc = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!doc) return next(new AppError("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.editColours = (req, res, next) => {
  console.log(req.body);
  const { colours } = req.body;

  if (!colours.length || colours[0] === "") return next();

  req.body.colours = colours[0].split(",");
  console.log(req.body.colours);
  return next();
};
