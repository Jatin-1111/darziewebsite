// src/components/shopping-view/home/CollectionsSection.jsx - FIXED WITH PROPER DIMENSIONS 🎨
import { memo, useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const collectionCategories = [
  {
    title: "Festive Wear",
    items: [
      "Anarkali Suits",
      "Lehenga Sets",
      "Sarees",
      "Dupattas",
      "Kurta Sets",
      "Ethnic Jackets",
    ],
  },
  {
    title: "Wedding Collection",
    items: [
      "Bridal Lehengas",
      "Heavy Embroidered Sarees",
      "Groomswear",
      "Sherwanis",
      "Reception Gowns",
      "Designer Blouses",
    ],
  },
  {
    title: "Indo Western",
    items: [
      "Fusion Gowns",
      "Cape Sets",
      "Draped Skirts",
      "Asymmetrical Kurtas",
      "Tunics",
      "Jumpsuits",
    ],
  },
  {
    title: "Casual Ethnic",
    items: [
      "Cotton Kurtis",
      "Straight Pants",
      "Boho Tunics",
      "Casual Dupattas",
      "Printed Kurtas",
      "Everyday Sarees",
    ],
  },
  {
    title: "Heritage Craft",
    items: [
      "Banarasi Sarees",
      "Chikankari Sets",
      "Ajrakh Prints",
      "Phulkari Dupattas",
      "Handloom Kurtas",
      "Kalamkari Dresses",
    ],
  },
  {
    title: "Seasonal Trends",
    items: [
      "Summer Linen Sets",
      "Monsoon Kurtis",
      "Festive Jackets",
      "Layered Outfits",
      "Winter Shawls",
      "Pastel Sets",
    ],
  },
];

const CollectionsSection = memo(() => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Preload the collections background image
  useEffect(() => {
    const collectionsImage = new Image();
    collectionsImage.src =
      "https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_740,h_493,c_fill,fl_progressive/v1754384807/banner_zj4u8n.png";
    collectionsImage.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex(
        (prevIndex) => (prevIndex + 1) % collectionCategories.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentCategory = collectionCategories[currentCategoryIndex];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotateX: 45,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const categoryVariants = {
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      scale: 0.9,
    },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const brandVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={ref} className="relative">
      {/* ✅ FIXED: Proper background with correct dimensions and clear visual separation */}
      <motion.div
        className="relative w-full min-h-screen bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: imageLoaded
            ? `url(https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_740,h_493,c_fill,fl_progressive/v1754384807/banner_zj4u8n.png)`
            : "none",
          backgroundColor: imageLoaded ? "transparent" : "#F4EFD6", // Fallback color while loading
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* ✅ Enhanced Overlay for Better Visual Separation */}
        <div
          className="absolute inset-0 opacity-75"
          style={{
            background:
              "linear-gradient(135deg, #F4EFD6 0%, #E5D5A3 35%, #8E8B7D 100%)",
          }}
        />

        {/* Loading state for background */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4EFD6] to-[#8E8B7D] animate-pulse" />
        )}

        {/* ✅ Enhanced Visual Separation Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />

        {/* Floating decorative elements - Made Responsive */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-white/20 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#C4BA97]/40 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Enhanced Content */}
        <div className="relative z-10 flex flex-col min-h-screen w-full px-4 sm:px-6 md:px-8">
          {/* Animated Main Title - Mobile-First Responsive */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-faux text-[#6C3D1D] mt-8 sm:mt-12 md:mt-16 text-center relative"
            variants={titleVariants}
          >
            <span className="relative inline-block">
              collections
              {/* Animated text shadow effect */}
              <motion.span
                className="absolute inset-0 text-[#C4BA97]/30"
                animate={{
                  x: [0, 2, 0],
                  y: [0, 2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                collections
              </motion.span>
            </span>
          </motion.h1>

          {/* Enhanced Category Content - Fully Responsive */}
          <motion.div
            className="backdrop-blur-sm mt-12 sm:mt-16 md:mt-20 lg:mt-[8rem] 
                       ml-2 sm:ml-6 md:ml-10 lg:ml-10 
                       p-4 sm:p-6 
                       rounded-md w-full 
                       max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
                       bg-black/10 border border-white/20"
            variants={contentVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategoryIndex}
                variants={categoryVariants}
                initial="exit"
                animate="enter"
                exit="exit"
              >
                {/* Category Title - Mobile-First Text */}
                <motion.h2
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 
                           font-faux text-white mb-4 sm:mb-6 relative leading-tight drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {currentCategory.title}

                  {/* Glowing text effect */}
                  <motion.div
                    className="absolute inset-0 text-white/50 blur-sm"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {currentCategory.title}
                  </motion.div>
                </motion.h2>

                {/* Category Items - Bigger Mobile Text */}
                <motion.ul
                  className="font-josefin list-disc list-inside space-y-2 sm:space-y-2.5 
                           text-white text-base sm:text-lg md:text-xl drop-shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, staggerChildren: 0.1 }}
                >
                  {currentCategory.items.map((item, index) => (
                    <motion.li
                      key={item}
                      className="relative overflow-hidden py-1"
                      variants={itemVariants}
                      custom={index}
                      whileHover={{
                        x: 5,
                        color: "#C4BA97",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <motion.span
                        className="relative z-10"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {item}
                      </motion.span>

                      {/* Hover underline effect */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-[#C4BA97]"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Brand Footer - Bigger Mobile Text */}
          <motion.div
            className="absolute bottom-4 sm:bottom-6 md:bottom-8
                       left-2 sm:left-4 md:left-8 lg:ml-[5.75rem] 
                       font-faux text-white 
                       text-base sm:text-lg md:text-xl"
            variants={brandVariants}
          >
            <motion.span
              className="relative drop-shadow-lg"
              whileHover={{
                scale: 1.05,
                color: "#C4BA97",
                transition: { duration: 0.3 },
              }}
            >
              darzie's couture
              {/* Subtle glow effect */}
              <motion.div
                className="absolute inset-0 text-[#C4BA97]/50 blur-sm opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                darzie's couture
              </motion.div>
            </motion.span>
          </motion.div>
        </div>

        {/* Corner decorative elements - Fully Responsive */}
        <motion.div
          className="absolute top-4 sm:top-6 md:top-8 
                     left-4 sm:left-6 md:left-8 
                     w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 
                     border-l-2 border-t-2 border-white/40 rounded-tl-lg"
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 
                     right-4 sm:right-6 md:right-8 
                     w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 
                     border-r-2 border-b-2 border-white/40 rounded-br-lg"
          initial={{ opacity: 0, scale: 0, rotate: 45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
    </section>
  );
});

CollectionsSection.displayName = "CollectionsSection";

export default CollectionsSection;
