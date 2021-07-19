const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  // console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection successful. Awaiting Requests."));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

// HEROKU ONLY
// process.on("SIGTERM", () => {
//   console.log("👋🏽 SIGTERM RECIEVED. Shutting down gracefully");

//   server.close(() => {
//     console.log("💥Process Terminated");
//   });
// });
