// src/pages/admin-view/dashboard.jsx - ULTRA MODERN ADMIN DASHBOARD 🔥
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Activity,
} from "lucide-react";
import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersOfAllUsers } from "@/store/admin/order-slice";
import ProductImageUpload from "@/components/admin-view/image-upload";

// Mock data for enhanced dashboard (replace with real API calls)
const generateMockSalesData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    name: month,
    sales: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 200) + 50,
    customers: Math.floor(Math.random() * 150) + 30,
  }));
};

const generateMockCategoryData = () => [
  { name: "Bridal", value: 35, count: 45, color: "#8884d8" },
  { name: "Partywear", value: 25, count: 32, color: "#82ca9d" },
  { name: "Casual", value: 20, count: 26, color: "#ffc658" },
  { name: "Formals", value: 15, count: 19, color: "#ff7300" },
  { name: "Reception", value: 5, count: 8, color: "#0088fe" },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

function AdminDashboard() {
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);

  // Image upload states for new multi-image system
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingStates, setImageLoadingStates] = useState([]);

  // Dashboard data
  const [salesData] = useState(generateMockSalesData());
  const [categoryData] = useState(generateMockCategoryData());
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 156, // Mock data
    conversionRate: 3.2, // Mock data
    avgOrderValue: 0,
  });

  // Calculate real stats from data
  useEffect(() => {
    if (productList.length > 0 || orderList.length > 0) {
      const totalRevenue = orderList.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const avgOrderValue =
        orderList.length > 0 ? totalRevenue / orderList.length : 0;

      setDashboardStats((prev) => ({
        ...prev,
        totalProducts: productList.length,
        totalOrders: orderList.length,
        totalRevenue: totalRevenue,
        avgOrderValue: avgOrderValue,
      }));
    }
  }, [productList, orderList]);

  // Load data on mount
  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersOfAllUsers());
  }, [dispatch]);

  // Handle feature image upload
  const handleUploadFeatureImage = async () => {
    const validUrls = uploadedImageUrls.filter((url) => url);

    if (validUrls.length === 0) {
      alert("Please upload at least one image before submitting.");
      return;
    }

    try {
      // Upload each image as a separate feature
      for (const imageUrl of validUrls) {
        await dispatch(addFeatureImage(imageUrl)).unwrap();
      }

      // Refresh the feature images list
      await dispatch(getFeatureImages());

      // Reset upload states
      setImageFiles([]);
      setUploadedImageUrls([]);
      setImageLoadingStates([]);

      alert(`Successfully uploaded ${validUrls.length} feature image(s)!`);
    } catch (error) {
      console.error("Feature image upload error:", error);
      alert("Failed to upload feature images. Please try again.");
    }
  };

  // Get recent orders for activity feed
  const recentOrders = orderList.slice(0, 5);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-blue-100">
              Here's what's happening with Darzie's Couture today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Products
            </CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardStats.totalProducts}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +12% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {dashboardStats.totalOrders}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +8% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₹{dashboardStats.totalRevenue.toLocaleString("en-IN")}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +15% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Avg Order Value */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Order Value
            </CardTitle>
            <Activity className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₹
              {Math.round(dashboardStats.avgOrderValue).toLocaleString("en-IN")}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +5% from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Sales Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Sales",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Product Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Order #{order._id?.slice(-6) || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.cartItems?.length || 0} items •{" "}
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString()
                            : "Date N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </p>
                      <Badge
                        className={`text-xs ${
                          order.orderStatus === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.orderStatus || "Unknown"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Conversion Rate */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Conversion Rate</span>
              </div>
              <span className="font-bold text-green-600">
                {dashboardStats.conversionRate}%
              </span>
            </div>

            {/* Active Users */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <span className="font-bold text-blue-600">
                {dashboardStats.activeUsers}
              </span>
            </div>

            {/* Low Stock Alert */}
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">Low Stock Items</span>
              </div>
              <span className="font-bold text-red-600">
                {
                  productList.filter((product) => product.totalStock < 10)
                    .length
                }
              </span>
            </div>

            {/* Avg Rating */}
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Avg Rating</span>
              </div>
              <span className="font-bold text-yellow-600">4.8</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Images Management */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Feature Images Management
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Upload promotional banners and featured content for your homepage.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Multi-Image Upload */}
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            imageLoadingStates={imageLoadingStates}
            setImageLoadingStates={setImageLoadingStates}
            isEditMode={false}
          />

          {/* Upload Button */}
          <Button
            onClick={handleUploadFeatureImage}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={uploadedImageUrls.filter((url) => url).length === 0}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Publish Feature Images (
            {uploadedImageUrls.filter((url) => url).length})
          </Button>

          {/* Current Feature Images */}
          {featureImageList && featureImageList.length > 0 && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Current Feature Images ({featureImageList.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featureImageList.map((featureImg, index) => (
                  <div key={featureImg._id || index} className="relative group">
                    <img
                      src={featureImg.image}
                      alt={`Feature ${index + 1}`}
                      className="w-full aspect-video object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <Badge className="bg-white/90 text-gray-800">
                        Live on Homepage
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <TrendingUp className="h-5 w-5" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900 mb-2">
                {(
                  (dashboardStats.totalOrders /
                    (dashboardStats.totalProducts || 1)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-sm text-indigo-700">Product-to-Order Ratio</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900 mb-2">
                {productList.filter((p) => p.totalStock > 0).length}
              </div>
              <p className="text-sm text-indigo-700">Products In Stock</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900 mb-2">
                ₹{(dashboardStats.totalRevenue / 30).toFixed(0)}
              </div>
              <p className="text-sm text-indigo-700">Avg Daily Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
