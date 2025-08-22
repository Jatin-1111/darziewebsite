"use client";

// src/components/shopping-view/home/CollectionsSection.jsx
import { memo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const collections = [
  {
    name: "Festive Wear",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753080684/bhzrzsu4mbkeqb4fiq87.jpg", // Shibori Hand-Dyed Chinon Chiffon Kaftan
  },
  {
    name: "Wedding Collection",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753077457/dwuoa8niayk8stp7ulnl.jpg", // Green and Gold Tanchoi Silk Anarkali
  },
  {
    name: "Party Wear",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753078473/oyfcnpy3xeyza7xua1tj.jpg", // Grey floral pure crepe kurti set
  },
  {
    name: "Casual Ethnic",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753078648/iulr0bvk0t3markjjhg1.jpg", // Red dabka zardozi embroidered chiffon kaftan
  },
  {
    name: "Formal Wear",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753080637/jbrmd5ogy33i2iswm6hp.jpg", // Beige and Golden Tanchoi Silk Embroidered Suit
  },
  {
    name: "Bridal Collection",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753077157/h27x3oinf2aqp9malokd.jpg", // Women's Mustard Handcrafted Zardozi Anarkali
  },
];

const CollectionsSection = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  // Autoplay functionality
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % collections.length);
    }, 3000); // Changed back to 3000ms (3 seconds) as requested
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Pause on hover/focus
  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Get visible slides for sliding effect - now shows all visible slides at once
  const getVisibleSlides = useCallback(() => {
    const slides = [];
    const totalSlides = collections.length;

    // Show 5 slides: prev2, prev1, current, next1, next2
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalSlides) % totalSlides;
      slides.push({
        ...collections[index],
        position: i,
        index: index,
      });
    }

    return slides;
  }, [currentIndex]);

  // Animation variants for smooth sliding effect
  const slideVariants = {
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      zIndex: 5,
      rotateY: 0,
      transition: {
        duration: 1.2, // Smooth sliding duration
        ease: [0.32, 0.72, 0, 1], // iOS-style easing curve
        type: "tween",
      },
    },
    left1: {
      x: "-80%",
      scale: 0.85,
      opacity: 0.8,
      zIndex: 3,
      rotateY: 15,
      transition: {
        duration: 1.2,
        ease: [0.32, 0.72, 0, 1],
        type: "tween",
      },
    },
    right1: {
      x: "80%",
      scale: 0.85,
      opacity: 0.8,
      zIndex: 3,
      rotateY: -15,
      transition: {
        duration: 1.2,
        ease: [0.32, 0.72, 0, 1],
        type: "tween",
      },
    },
    left2: {
      x: "-160%",
      scale: 0.7,
      opacity: 0.3,
      zIndex: 1,
      rotateY: 25,
      transition: {
        duration: 1.2,
        ease: [0.32, 0.72, 0, 1],
        type: "tween",
      },
    },
    right2: {
      x: "160%",
      scale: 0.7,
      opacity: 0.3,
      zIndex: 1,
      rotateY: -25,
      transition: {
        duration: 1.2,
        ease: [0.32, 0.72, 0, 1],
        type: "tween",
      },
    },
  };

  // Get variant name based on position
  const getVariant = (position) => {
    switch (position) {
      case -2:
        return "left2";
      case -1:
        return "left1";
      case 0:
        return "center";
      case 1:
        return "right1";
      case 2:
        return "right2";
      default:
        return "center";
    }
  };

  // Text animation variants
  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.32, 0.72, 0, 1], // Updated to match slide easing
        type: "tween",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
        type: "tween",
      },
    },
  };

  const visibleSlides = getVisibleSlides();
  const currentCollection = collections[currentIndex];

  return (
    <section className="bg-white min-h-screen flex flex-col">
      {/* Top Section - Static Heading + Dynamic Collection Name */}
      <div className="flex-none pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Static 'Collections' heading */}
          <motion.h1
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
              font-faux font-light text-gray-900
              tracking-wide leading-none mb-4 sm:mb-6 md:mb-8
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.0,
              ease: [0.32, 0.72, 0, 1], // Updated to match overall easing
              type: "tween",
            }}
          >
            Collections
          </motion.h1>

          {/* Dynamic collection name */}
          <div className="h-12 sm:h-16 md:h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentIndex}
                className="
                  text-xl sm:text-2xl md:text-3xl lg:text-4xl
                  font-josefin font-medium text-gray-600
                  tracking-wide
                "
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {currentCollection.name}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Section - Coverflow Carousel */}
      <div
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Collections carousel"
        aria-live="polite"
      >
        <div className="relative w-full max-w-6xl h-64 sm:h-80 md:h-96 lg:h-[500px]">
          {/* Carousel Container */}
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            {visibleSlides.map((slide) => (
              <motion.div
                key={`${slide.index}-${slide.position}`}
                className="absolute w-52 sm:w-60 md:w-72 lg:w-96 h-full"
                variants={slideVariants}
                animate={getVariant(slide.position)}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
                whileHover={
                  slide.position === 0
                    ? {
                        scale: 1.03,
                        transition: {
                          duration: 0.4,
                          ease: [0.32, 0.72, 0, 1],
                        },
                      }
                    : {}
                }
              >
                {/* Image Container */}
                <div
                  className="
                  relative w-full h-full
                  bg-white rounded-2xl shadow-lg
                  overflow-hidden
                  border border-gray-100
                "
                >
                  <motion.img
                    src={slide.image}
                    alt={`${slide.name} collection`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    draggable={false}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.32, 0.72, 0, 1],
                      type: "tween",
                    }}
                  />

                  {/* Overlay for non-center images */}
                  {slide.position !== 0 && (
                    <motion.div
                      className="absolute inset-0 bg-black/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}

                  {/* Collection name overlay (visible only on center image) */}
                  {slide.position === 0 && (
                    <motion.div
                      className="
                        absolute bottom-0 left-0 right-0
                        bg-gradient-to-t from-black/60 to-transparent
                        p-4 sm:p-6
                      "
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.7,
                        ease: [0.32, 0.72, 0, 1],
                        type: "tween",
                      }}
                    >
                      <motion.h3
                        className="
                        text-white font-josefin font-medium
                        text-sm sm:text-base md:text-lg
                        text-center tracking-wide
                      "
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5,
                          duration: 0.6,
                          ease: [0.32, 0.72, 0, 1],
                          type: "tween",
                        }}
                      >
                        {slide.name}
                      </motion.h3>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 top-0 h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />
    </section>
  );
});

CollectionsSection.displayName = "CollectionsSection";

export default CollectionsSection;
