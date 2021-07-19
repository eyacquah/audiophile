const util = require("util");
const gc = require("./storageConfig");
const bucket = gc.bucket("audiophile-bucket");

const { format } = util;

exports.uploadToGCP = (file) =>
  new Promise((resolve, reject) => {
    const { filename, buffer } = file;

    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({ resumable: false });

    blobStream
      .on("finish", () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", (err) => {
        // console.error("Unable to upload image. Something went wrong");
        // console.error(err);
        reject("Unable to upload image. Something went wrong");
      })
      .end(buffer);
  });
