"use client";
import { memo, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const collections = [
  {
    name: "Festive Wear",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753080684/bhzrzsu4mbkeqb4fiq87.jpg",
  },
  {
    name: "Wedding Collection",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753077457/dwuoa8niayk8stp7ulnl.jpg",
  },
  {
    name: "Party Wear",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753078473/oyfcnpy3xeyza7xua1tj.jpg",
  },
  {
    name: "Casual Ethnic",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753078648/iulr0bvk0t3markjjhg1.jpg",
  },
  {
    name: "Formal Wear",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753080637/jbrmd5ogy33i2iswm6hp.jpg",
  },
  {
    name: "Bridal Collection",
    image:
      "https://res.cloudinary.com/dz9ndmaa8/image/upload/v1753077157/h27x3oinf2aqp9malokd.jpg",
  },
];

// Optimized Image component with intersection observer
const OptimizedImage = memo(
  ({ src, alt, className, priority = false, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
      if (priority && imgRef.current) {
        // Preload priority images
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setHasError(true);
      }
    }, [src, priority]);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
    }, []);

    const handleError = useCallback(() => {
      setHasError(true);
    }, []);

    return (
      <div className="relative w-full h-full">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
        )}
        {hasError ? (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-2xl">
            <span className="text-gray-500 text-sm">Failed to load</span>
          </div>
        ) : (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`${className} ${
              isLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            draggable={false}
            {...props}
          />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

const CollectionsSection = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Use CSS transforms instead of complex 3D for reduced motion
  const useSimpleAnimation =
    shouldReduceMotion ||
    (typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches);

  // Simplified position calculation
  const getSlidePosition = useCallback((slideIndex, currentIdx) => {
    const diff = slideIndex - currentIdx;
    const totalSlides = collections.length;

    let position = diff;
    if (diff > totalSlides / 2) {
      position = diff - totalSlides;
    } else if (diff < -totalSlides / 2) {
      position = diff + totalSlides;
    }

    return position;
  }, []);

  // Optimized animation variants with GPU acceleration
  const getSlideVariants = useCallback((position, simple = false) => {
    if (simple) {
      // Simplified animations for mobile/reduced motion
      const baseX = position * 90;
      return {
        x: `${baseX}%`,
        scale: position === 0 ? 1 : 0.85,
        opacity: Math.abs(position) <= 1 ? 1 : 0,
        zIndex: 5 - Math.abs(position),
        transition: {
          x: { type: "tween", duration: 0.4, ease: "easeInOut" },
          scale: { type: "tween", duration: 0.4, ease: "easeInOut" },
          opacity: { duration: 0.3 },
        },
      };
    }

    // Full animations with optimized GPU acceleration
    const configs = {
      0: {
        x: 0,
        scale: 1,
        opacity: 1,
        zIndex: 5,
        rotateY: 0,
        filter: "brightness(1)",
      },
      1: {
        x: 85,
        scale: 0.85,
        opacity: 0.85,
        zIndex: 3,
        rotateY: -15,
        filter: "brightness(0.9)",
      },
      "-1": {
        x: -85,
        scale: 0.85,
        opacity: 0.85,
        zIndex: 3,
        rotateY: 15,
        filter: "brightness(0.9)",
      },
      2: {
        x: 165,
        scale: 0.7,
        opacity: 0.4,
        zIndex: 1,
        rotateY: -25,
        filter: "brightness(0.8)",
      },
      "-2": {
        x: -165,
        scale: 0.7,
        opacity: 0.4,
        zIndex: 1,
        rotateY: 25,
        filter: "brightness(0.8)",
      },
    };

    const config = configs[position] || {
      x: position > 0 ? 250 : -250,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
      rotateY: position > 0 ? -30 : 30,
      filter: "brightness(0.7)",
    };

    return {
      x: `${config.x}%`,
      scale: config.scale,
      opacity: config.opacity,
      zIndex: config.zIndex,
      rotateY: config.rotateY,
      filter: config.filter,
      transition: {
        x: { type: "tween", duration: 0.5, ease: "easeInOut" },
        scale: { type: "tween", duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.4 },
        rotateY: { type: "tween", duration: 0.5, ease: "easeInOut" },
      },
    };
  }, []);

  // Text animation variants - simplified
  const textVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
      exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.3, ease: "easeIn" },
      },
    }),
    []
  );

  // Optimized navigation
  const navigate = useCallback((newIndex) => {
    setCurrentIndex(newIndex);
  }, []);

  const nextSlide = useCallback(() => {
    navigate((currentIndex + 1) % collections.length);
  }, [currentIndex, navigate]);

  // Autoplay with cleanup
  useEffect(() => {
    if (isAutoPlaying && !shouldReduceMotion) {
      intervalRef.current = setInterval(nextSlide, 3500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, nextSlide, shouldReduceMotion]);

  // Mouse handlers with proper cleanup
  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Touch handlers for mobile
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          navigate((currentIndex + 1) % collections.length);
        } else {
          navigate(
            (currentIndex - 1 + collections.length) % collections.length
          );
        }
      }

      setTimeout(() => setIsAutoPlaying(true), 1000);
    },
    [currentIndex, navigate]
  );

  const currentCollection = collections[currentIndex];

  return (
    <section className="bg-white min-h-screen flex flex-col">
      {/* Top Section - Optimized heading */}
      <div className="flex-none pt-12 sm:pt-12 md:pt-16 lg:pt-20 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-faux font-light text-gray-900 tracking-wide leading-none mb-6 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Collections
          </motion.h1>

          <div className="h-16 sm:h-16 md:h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentIndex}
                className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-josefin font-medium text-gray-600 tracking-wide"
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

      {/* Carousel Section - Optimized */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Collections carousel"
        aria-live="polite"
      >
        <div className="relative w-full max-w-6xl h-[400px] sm:h-80 md:h-96 lg:h-[500px]">
          <div className="relative w-full h-full flex items-center justify-center">
            {collections.map((slide, slideIndex) => {
              const position = getSlidePosition(slideIndex, currentIndex);
              const isVisible = Math.abs(position) <= 2;
              const isPriority = Math.abs(position) <= 1;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={slideIndex}
                  className="absolute w-64 sm:w-60 md:w-72 lg:w-96 h-full will-change-transform"
                  animate={getSlideVariants(position, useSimpleAnimation)}
                  style={{
                    transformStyle: useSimpleAnimation ? "flat" : "preserve-3d",
                  }}
                  onClick={() => position !== 0 && navigate(slideIndex)}
                  role={position === 0 ? "img" : "button"}
                  tabIndex={position === 0 ? -1 : 0}
                  aria-label={
                    position !== 0 ? `Go to ${slide.name}` : undefined
                  }
                >
                  <div className="relative w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <OptimizedImage
                      src={slide.image}
                      alt={`${slide.name} collection`}
                      className="w-full h-full object-cover"
                      priority={isPriority}
                    />

                    {position !== 0 && (
                      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    )}

                    {position === 0 && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        <h3 className="text-white font-josefin font-medium text-base sm:text-base md:text-lg lg:text-xl text-center tracking-wide">
                          {slide.name}
                        </h3>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />
    </section>
  );
});

CollectionsSection.displayName = "CollectionsSection";

export default CollectionsSection;
