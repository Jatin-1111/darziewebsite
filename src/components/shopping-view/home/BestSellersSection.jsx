// src/components/shopping-view/home/BestSellersSection.jsx - CLEAN MINIMAL DESIGN 🔥
import { memo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const sellerLinks = [
  "Anarkali Suit (Floor Length)",
  "Anarkali Suit (Knee Length)",
  "Straight Cut Suit",
  "Palazzo Suit",
  "Sharara Suit",
  "Patiala Suit",
  "Churidar Suit",
  "A-Line Suit",
  "Cotton Printed Suits",
  "Chikankari Suits",
  "Georgette Suits",
  "Silk Suits",
  "Velvet Suits",
  "Rayon Suits",
  "Organza Suits",
  "Zari Work Suits",
  "Sequence Work Suits",
  "Gota Patti Work",
  "Ethnic Co-ord Sets",
  "Jacket Style Suits",
  "Cape Style Suits",
  "Asymmetric Suits",
  "High-Low Kurta Suits",
  "Dhoti Style Suits",
  "Kaftan Style Suits",
  "Cigarette Pants Suits",
  "Unstitched Materials",
  "Readymade Suits",
];

const BestSellersSection = memo(({ bestSellers = [] }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effects for the Explore Collections section (unchanged)
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const handleNavigate = useCallback(() => {
    navigate(`/shop/listing?category=best+sellers`);
  }, [navigate]);

  const handleProductClick = useCallback(
    (product) => {
      if (product && product._id) {
        navigate(`/shop/product/${product._id}`);
      }
    },
    [navigate]
  );

  const handleCategoryClick = useCallback(
    (label) => {
      handleNavigate();
    },
    [handleNavigate]
  );

  // Clean, minimal animation variants for Best Sellers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const productVariants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
  };

  // Keep existing animations for Explore Collections section (unchanged)
  const linkVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      scale: 0.9,
    },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      x: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: {
      opacity: 0,
      backgroundColor: "rgba(108, 61, 29, 0)",
    },
    visible: {
      opacity: 1,
      backgroundColor: "rgba(108, 61, 29, 1)",
      transition: {
        duration: 1,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  return (
    <motion.div ref={ref} className="w-full">
      {/* REFACTORED: Clean, Minimal Best Sellers Section */}
      <motion.section
        className="bg-white min-h-screen flex flex-col justify-center py-16 sm:py-20 md:py-24 lg:py-32"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Clean Section Header */}
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            variants={titleVariants}
          >
            <motion.h2
              className="
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                font-josefin font-light
                text-gray-900
                tracking-[0.2em]
                uppercase
                mb-4
              "
              variants={titleVariants}
            >
              Best Sellers
            </motion.h2>
            <motion.div
              className="w-16 sm:w-20 md:w-24 h-0.5 bg-gray-900 mx-auto"
              initial={{ width: 0 }}
              animate={isInView ? { width: "6rem" } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            />
          </motion.div>

          {/* Clean Product Grid */}
          {bestSellers && bestSellers.length > 0 && (
            <motion.div
              className="
                grid gap-8 sm:gap-10 md:gap-12
                grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                max-w-[1600px] mx-auto
              "
              variants={gridVariants}
            >
              {bestSellers.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  className="group cursor-pointer"
                  variants={productVariants}
                  custom={index}
                  onClick={() => handleProductClick(product)}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Minimal Product Card */}
                  <div className="bg-white overflow-hidden">
                    {/* Edge-to-edge Product Image */}
                    <div className="aspect-[3/4] h-80 sm:h-96 md:h-[420px] lg:h-[480px] overflow-hidden bg-gray-50">
                      <motion.img
                        src={product.image}
                        alt={product.title || `Best seller ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Minimal Product Info */}
                    <div className="p-6 sm:p-7 md:p-8">
                      <h3
                        className="
                        font-josefin font-medium
                        text-sm sm:text-base md:text-lg
                        text-gray-900
                        tracking-wide
                        mb-2
                        line-clamp-2
                      "
                      >
                        {product.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span
                          className="
                          font-josefin font-light
                          text-sm sm:text-base
                          text-gray-600
                          tracking-wide
                        "
                        >
                          ₹{product.price?.toLocaleString("en-IN")}
                        </span>

                        {product.salePrice &&
                          product.salePrice < product.price && (
                            <span
                              className="
                            font-josefin font-light
                            text-xs sm:text-sm
                            text-gray-400
                            line-through
                          "
                            >
                              ₹{product.salePrice?.toLocaleString("en-IN")}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Clean View All Button */}
          <motion.div
            className="text-center mt-12 sm:mt-16 md:mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          >
            <motion.button
              className="
                inline-flex items-center px-8 sm:px-10 py-3 sm:py-4
                border border-gray-900
                text-gray-900 font-josefin font-medium
                text-sm sm:text-base
                tracking-wide uppercase
                transition-all duration-300
                hover:bg-gray-900 hover:text-white
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNavigate}
            >
              View All Best Sellers
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* UNCHANGED: Original Explore Collections Section */}
      <div className="h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />

      {/* Enhanced Seller Links Section */}
      <motion.div
        className="bg-[#6C3D1D] text-white py-8 sm:py-12 md:py-16 relative overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Animated background pattern */}
        <motion.div className="absolute inset-0 opacity-5" style={{ y }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] animate-pulse" />
        </motion.div>

        <div className="px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          {/* Enhanced Section Header */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            variants={titleVariants}
          >
            <motion.h3
              className="
                font-faux text-white font-bold
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                mb-4 relative
              "
              variants={titleVariants}
            >
              <span className="relative">
                explore collections
                {/* Decorative underline animation */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-[#C4BA97] to-white rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "50%" } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                />
              </span>
            </motion.h3>

            <motion.p
              className="
                text-gray-300 font-medium max-w-2xl mx-auto
                text-sm sm:text-base md:text-lg
                leading-relaxed
              "
              variants={titleVariants}
            >
              Browse through our curated categories and find your perfect ethnic
              wear
            </motion.p>
          </motion.div>

          {/* Enhanced Categories Grid */}
          <motion.div
            className="
              grid gap-3 sm:gap-4
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
              max-w-7xl mx-auto
            "
            variants={gridVariants}
          >
            {sellerLinks.map((label, index) => (
              <motion.button
                key={index}
                className="
                  text-left p-3 sm:p-4 rounded-lg
                  bg-white/5 hover:bg-white/10
                  border border-white/10 hover:border-[#C4BA97]/30
                  transition-all duration-300 ease-in-out
                  backdrop-blur-sm
                  group relative overflow-hidden
                "
                variants={linkVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCategoryClick(label)}
              >
                {/* Background shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4BA97]/10 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{
                    x: "100%",
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }}
                />

                <motion.span
                  className="
                    relative z-10 block text-white font-medium
                    text-xs sm:text-sm
                    leading-tight
                    group-hover:text-[#C4BA97]
                    transition-colors duration-300
                  "
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.span>

                {/* Hover border glow */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent rounded-lg"
                  whileHover={{
                    borderColor: "#C4BA97",
                    boxShadow: "0 0 20px rgba(196, 186, 151, 0.3)",
                    transition: { duration: 0.3 },
                  }}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Call to Action */}
          <motion.div
            className="text-center mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
          >
            <motion.button
              className="
                inline-flex items-center px-6 sm:px-8 py-3 sm:py-4
                bg-[#C4BA97] hover:bg-white
                text-[#6C3D1D] font-bold
                text-sm sm:text-base
                rounded-full transition-all duration-300
                shadow-lg hover:shadow-xl
                group relative overflow-hidden
              "
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigate}
            >
              {/* Button shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "100%",
                  transition: { duration: 0.6, ease: "easeInOut" },
                }}
              />

              <span className="relative z-10 mr-2">View All Categories</span>

              <motion.span
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>

          {/* Floating decorative elements */}
          <motion.div
            className="absolute top-10 left-10 w-4 h-4 bg-[#C4BA97]/20 rounded-full"
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-16 right-16 w-3 h-3 bg-white/15 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});

BestSellersSection.displayName = "BestSellersSection";

export default BestSellersSection;
