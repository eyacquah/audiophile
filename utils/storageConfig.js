const path = require("path");
const Cloud = require("@google-cloud/storage");
const serviceKey = path.join(__dirname, "../config/storageKeys.json");

const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: "audiophile-319113",
});

module.exports = storage;
