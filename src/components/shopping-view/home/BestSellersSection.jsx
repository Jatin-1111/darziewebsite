// src/components/shopping-view/home/BestSellersSection.jsx - ENHANCED WITH FRAMER MOTION 🎨
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

  // Parallax effects (removed opacity fade-out)
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

  // Animation variants
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
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const productVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

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
    <motion.div
      ref={ref}
      className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50"
    >
      {/* Enhanced Section Header */}
      <motion.div
        className="text-center py-8 sm:py-12 md:py-16 px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2
          className="
            font-faux text-[#6C3D1D] font-bold
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            mb-4 sm:mb-6 relative
          "
          variants={titleVariants}
        >
          <span className="relative">
            best sellers
            {/* Decorative underline animation */}
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-[#6C3D1D] to-[#C4BA97] rounded-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: "60%" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </span>
        </motion.h2>

        <motion.p
          className="
            text-gray-600 font-medium max-w-2xl mx-auto
            text-sm sm:text-base md:text-lg
            leading-relaxed
          "
          variants={titleVariants}
        >
          Discover our most loved pieces, crafted with precision and worn with
          pride
        </motion.p>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-8 left-8 w-3 h-3 bg-[#C4BA97]/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-16 right-12 w-2 h-2 bg-[#6C3D1D]/20 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      {/* Enhanced Product Grid */}
      {bestSellers && bestSellers.length > 0 && (
        <motion.div
          className="px-4 sm:px-6 md:px-8 lg:px-12 mb-12 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="
              grid gap-4 sm:gap-6 md:gap-8
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
              max-w-7xl mx-auto
            "
            variants={gridVariants}
          >
            {bestSellers.map((product, index) => (
              <motion.div
                key={product._id || index}
                className="
                  group relative overflow-hidden rounded-xl shadow-md
                  transition-all duration-300 ease-in-out
                  bg-white cursor-pointer
                "
                variants={productVariants}
                custom={index}
                whileHover="hover"
                onClick={() => handleProductClick(product)}
              >
                {/* Enhanced Image Container */}
                <motion.div
                  className="aspect-[3/4] overflow-hidden relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.img
                    src={product.image}
                    alt={product.title || `Best seller ${index + 1}`}
                    loading="lazy"
                    className="
                      w-full h-full object-cover
                      transition-transform duration-700 ease-out
                    "
                    whileHover={{ scale: 1.1 }}
                  />

                  {/* Shimmer overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{
                      x: "100%",
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                  />

                  {/* Enhanced Product Overlay */}
                  <motion.div
                    className="
                      absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                      flex items-end p-4
                    "
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="text-white"
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200">
                        ₹{product.price?.toLocaleString("en-IN")}
                      </p>
                      <motion.p
                        className="text-xs text-gray-300 mt-1"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Click to view details
                      </motion.p>
                    </motion.div>
                  </motion.div>

                  {/* Pulsing border effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent rounded-xl"
                    whileHover={{
                      borderColor: "#C4BA97",
                      transition: { duration: 0.3 },
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

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
            variants={containerVariants}
          >
            <motion.h3
              className="
                font-bold text-xl sm:text-2xl md:text-3xl mb-4
                text-[#C4BA97] relative
              "
              variants={titleVariants}
            >
              Shop by Style
              {/* Animated accent */}
              <motion.div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#C4BA97]"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h3>

            <motion.p
              className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto"
              variants={titleVariants}
            >
              Browse our complete collection of traditional and contemporary
              designs
            </motion.p>
          </motion.div>

          {/* Enhanced Grid Layout */}
          <motion.div
            className="
              grid gap-3 sm:gap-4 md:gap-6
              grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
              max-w-6xl mx-auto
            "
            variants={gridVariants}
          >
            {sellerLinks.map((label, index) => (
              <motion.button
                key={index}
                onClick={() => handleCategoryClick(label)}
                className="
                  group flex items-center gap-3 p-3 sm:p-4
                  bg-white/10 backdrop-blur-sm rounded-lg border border-white/20
                  text-left w-full relative overflow-hidden
                "
                variants={linkVariants}
                custom={index}
                whileHover="hover"
                whileTap="tap"
                aria-label={`Shop ${label} collection`}
              >
                {/* Background glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-[#C4BA97]/10 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated icon */}
                <motion.span
                  className="text-[#C4BA97] text-lg sm:text-xl z-10"
                  whileHover={{
                    scale: 1.2,
                    rotate: 180,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  ⬖
                </motion.span>

                {/* Animated text */}
                <motion.span
                  className="
                    text-white font-medium
                    text-xs sm:text-sm md:text-base
                    line-clamp-2 leading-tight z-10
                  "
                  whileHover={{ color: "#C4BA97" }}
                  transition={{ duration: 0.2 }}
                >
                  {label}
                </motion.span>

                {/* Sliding accent border */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#C4BA97]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced CTA Button */}
          <motion.div
            className="text-center mt-8 sm:mt-12"
            variants={titleVariants}
          >
            <motion.button
              onClick={handleNavigate}
              className="
                bg-[#C4BA97] text-[#6C3D1D] font-bold
                px-6 sm:px-8 py-3 sm:py-4 rounded-full
                text-sm sm:text-base md:text-lg
                shadow-lg relative overflow-hidden
                group
              "
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(196, 186, 151, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {/* Button shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "100%",
                  transition: { duration: 0.6, ease: "easeInOut" },
                }}
              />

              <span className="relative z-10">View All Collections</span>

              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                initial={{ scale: 1, opacity: 0 }}
                whileHover={{
                  scale: 1.2,
                  opacity: 1,
                  transition: { duration: 0.4 },
                }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

BestSellersSection.displayName = "BestSellersSection";

export default BestSellersSection;
