const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/productModel");

dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log("DB Connection successful");
};

async function deleteData() {
  try {
    console.log("Deleting data..");
    await Product.deleteMany();

    console.log("Data successfuly deleted");
  } catch (err) {
    console.log(err);
  }
  // process.exit();
}

const updateProductQtys = async () => {
  try {
    console.log("Updating Products");

    await Product.updateMany({}, { stockQuantity: 10 });
    console.log("Products Updated Successfully");
  } catch (err) {
    console.error(err);
  }
};

// connectDB();
// updateProductQtys();
// deleteData();
// products.forEach(async (product) => await uploadProducts(product));
