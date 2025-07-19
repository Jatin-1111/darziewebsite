const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import all routes
const authRouter = require("../routes/auth/auth-routes");
const adminProductsRouter = require("../routes/admin/products-routes");
const adminOrderRouter = require("../routes/admin/order-routes");
const shopProductsRouter = require("../routes/shop/products-routes");
const shopCartRouter = require("../routes/shop/cart-routes");
const shopAddressRouter = require("../routes/shop/address-routes");
const shopOrderRouter = require("../routes/shop/order-routes");
const shopSearchRouter = require("../routes/shop/search-routes");
const shopReviewRouter = require("../routes/shop/review-routes");
const commonFeatureRouter = require("../routes/common/feature-routes");

// Database connection - only connect if not already connected
if (mongoose.connection.readyState === 0) {
    mongoose
        .connect("mongodb+srv://darziescouture9:0P5hfEi39PVqr2Ib@cluster0.o1hkfhs.mongodb.net/")
        .then(() => console.log("MongoDB connected"))
        .catch((error) => console.log(error));
}

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://your-vercel-domain.vercel.app", // Replace with your actual domain
        "https://*.vercel.app"
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "API is working!" });
});

// All routes
app.use("/auth", authRouter);
app.use("/admin/products", adminProductsRouter);
app.use("/admin/orders", adminOrderRouter);
app.use("/shop/products", shopProductsRouter);
app.use("/shop/cart", shopCartRouter);
app.use("/shop/address", shopAddressRouter);
app.use("/shop/order", shopOrderRouter);
app.use("/shop/search", shopSearchRouter);
app.use("/shop/review", shopReviewRouter);
app.use("/common/feature", commonFeatureRouter);

// Export the Express app for Vercel
module.exports = app;