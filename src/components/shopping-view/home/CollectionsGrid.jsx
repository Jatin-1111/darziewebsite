// src/components/shopping-view/home/CollectionsGrid.jsx - CATEGORY LINKS SECTION 🔥
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

const CollectionsGrid = memo(() => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const handleNavigate = useCallback(() => {
    navigate(`/shop/listing?category=best+sellers`);
  }, [navigate]);

  const handleCategoryClick = useCallback(
    (label) => {
      handleNavigate();
    },
    [handleNavigate]
  );

  // Animation variants for category section
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

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 50,
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

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
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

  return (
    <div ref={ref} className="w-full">
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
    </div>
  );
});

CollectionsGrid.displayName = "CollectionsGrid";

export default CollectionsGrid;
