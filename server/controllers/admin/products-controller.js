// controllers/admin/products-controller.js
const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

// ⬇️ Handle image upload (optional route, not used inside addProduct anymore)
const handleImageUpload = async (req, res) => {
  try {
    const b64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(dataURI);

    res.json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred" });
  }
};

// ✅ Add new product with image
const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      const b64 = req.file.buffer.toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      imageUrl = await imageUploadUtil(dataURI);
    }

    const newProduct = new Product({
      image: imageUrl,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (e) {
    console.error("Add Product Error:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding product",
    });
  }
};

// ✅ Other methods remain unchanged
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({ success: true, data: listOfProducts });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({ success: true, data: findProduct });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
