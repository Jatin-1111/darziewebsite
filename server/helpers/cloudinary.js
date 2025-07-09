// utils/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dz9ndmaa8",
  api_key: "416612418247112",
  api_secret: "PsA-XYkkiPxUEGiFuiRI7kbm-NI",
});

const storage = multer.memoryStorage(); // image in memory
const upload = multer({ storage });

async function imageUploadUtil(fileBuffer) {
  const result = await cloudinary.uploader.upload(dataURI, {
    resource_type: "image",
    folder: "products", // optional folder in cloudinary
  });
  return result.secure_url; // return only URL
}

module.exports = { upload, imageUploadUtil };
