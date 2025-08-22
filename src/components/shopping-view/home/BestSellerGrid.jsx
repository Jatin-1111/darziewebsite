// BestSellersSection.jsx - Best Sellers Component with Navigation 🔥
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Featured collections data with actual product images
const featuredCollections = [
  {
    id: 1,
    title: "ANARKALI SUITS",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753077457/dwuoa8niayk8stp7ulnl.jpg", // Green and Gold Tanchoi Silk Anarkali
  },
  {
    id: 2,
    title: "BRIDAL COLLECTION",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753077157/h27x3oinf2aqp9malokd.jpg", // Women's Mustard Handcrafted Zardozi Anarkali
  },
  {
    id: 3,
    title: "PARTY WEAR SUITS",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753078473/oyfcnpy3xeyza7xua1tj.jpg", // Grey floral pure crepe kurti set
  },
  {
    id: 4,
    title: "SILK SAREES",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753077588/by87brmvbblyhir4lrdt.jpg", // Green Tanchoi Silk straight suit
  },
];

// Product Card Component
const ProductCard = memo(({ collection, index, onCardClick }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.08,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const overlayVariants = {
    hover: {
      background:
        "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3), transparent)",
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="group cursor-pointer h-full"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover="hover"
      onClick={() => onCardClick(collection)}
    >
      <div className="relative h-full min-h-[28rem] sm:min-h-[32rem] md:min-h-[36rem] lg:min-h-[40rem] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
        {/* Product Image */}
        <motion.img
          src={collection.image}
          alt={collection.title}
          className="w-full h-full object-cover"
          variants={imageVariants}
          loading="lazy"
        />

        {/* Elegant gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          variants={overlayVariants}
        />

        {/* Collection Name Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10"
          initial={{ opacity: 0.95 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-center tracking-wide leading-tight">
            {collection.title}
          </h3>
        </motion.div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

// Main Best Sellers Component
const BestSellersSection = memo(() => {
  const navigate = useNavigate();

  // Navigate to best sellers listing page
  const handleNavigateToBestSellers = useCallback(() => {
    navigate("/shop/listing?category=best+sellers");
  }, [navigate]);

  // Handle individual card clicks
  const handleCardClick = useCallback(
    (collection) => {
      // Navigate to best sellers page with specific collection filter
      navigate("/shop/listing?category=best+sellers");
    },
    [navigate]
  );
  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const gridVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-[#f8f5f0] via-[#f3ede3] to-[#ede4d3] min-h-screen py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20 md:mb-24"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Subtitle */}
          <motion.p
            className="text-xs sm:text-sm md:text-base font-faux font-light tracking-[0.4em] text-gray-500 uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Featured Product
          </motion.p>

          {/* Main Title */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-faux font-light tracking-[0.15em] text-gray-800 uppercase relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Featured Collections
            {/* Elegant underline */}
            <motion.div
              className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              transition={{ duration: 1, delay: 1 }}
            />
          </motion.h1>
        </motion.div>

        {/* Full-Width Product Grid - Small gaps between cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuredCollections.map((collection, index) => (
            <ProductCard
              key={collection.id}
              collection={collection}
              index={index}
              onCardClick={handleCardClick}
            />
          ))}
        </motion.div>

        {/* Elegant Call to Action */}
        <motion.div
          className="text-center mt-16 sm:mt-20 md:mt-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        >
          <motion.button
            className="group inline-flex items-center px-12 py-4 bg-transparent border-2 border-gray-300 text-gray-700 font-light font-faux text-sm tracking-[0.2em] uppercase hover:border-gray-800 hover:text-gray-900 transition-all duration-500 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNavigateToBestSellers}
          >
            {/* Button background animation */}
            <motion.div
              className="absolute inset-0 bg-gray-50"
              initial={{ x: "-100%" }}
              whileHover={{
                x: "0%",
                transition: { duration: 0.5, ease: "easeInOut" },
              }}
            />
            <span className="relative z-10">Explore All Collections</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
});

BestSellersSection.displayName = "BestSellersSection";

export default BestSellersSection;
