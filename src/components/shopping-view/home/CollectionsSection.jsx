"use client";
import {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// Memoized Image component to prevent re-rendering
const OptimizedImage = memo(({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

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
          src={src}
          alt={alt}
          className={`${className} ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          draggable={false}
          {...props}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// Carousel state reducer to minimize re-renders
const carouselReducer = (state, action) => {
  switch (action.type) {
    case "SET_INDEX":
      if (action.payload === "NEXT") {
        return {
          ...state,
          currentIndex: (state.currentIndex + 1) % collections.length,
          direction: action.direction || state.direction,
        };
      }
      return {
        ...state,
        currentIndex: action.payload,
        direction: action.direction || state.direction,
      };
    case "SET_AUTO_PLAY":
      return {
        ...state,
        isAutoPlaying: action.payload,
      };
    case "SET_DIRECTION":
      return {
        ...state,
        direction: action.payload,
      };
    default:
      return state;
  }
};

const CollectionsSection = memo(() => {
  // Combined state using useReducer to reduce re-renders
  const [state, dispatch] = useReducer(carouselReducer, {
    currentIndex: 0,
    isAutoPlaying: true,
    direction: 1, // 1 for forward, -1 for backward
  });

  const intervalRef = useRef(null);
  const mouseTimeoutRef = useRef(null);

  // Memoized position calculation function
  const getSlidePosition = useCallback((slideIndex, currentIdx) => {
    const diff = slideIndex - currentIdx;
    const totalSlides = collections.length;

    // Handle wrap-around cases
    let position = diff;
    if (diff > totalSlides / 2) {
      position = diff - totalSlides;
    } else if (diff < -totalSlides / 2) {
      position = diff + totalSlides;
    }

    return position;
  }, []);

  // Memoized animation variants - cached per position
  const slideVariantsCache = useMemo(() => {
    const baseTransition = {
      x: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
      opacity: {
        duration: 0.4,
        ease: "easeInOut",
      },
      scale: {
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
      },
      rotateY: {
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1],
      },
    };

    const variants = {};

    // Pre-calculate variants for all possible positions
    for (let pos = -3; pos <= 3; pos++) {
      if (pos === 0) {
        variants[pos] = {
          x: "0%",
          scale: 1,
          opacity: 1,
          zIndex: 5,
          rotateY: 0,
          filter: "brightness(1)",
          transition: baseTransition,
        };
      } else if (pos === -1) {
        variants[pos] = {
          x: "-85%",
          scale: 0.85,
          opacity: 0.85,
          zIndex: 3,
          rotateY: 15,
          filter: "brightness(0.9)",
          transition: baseTransition,
        };
      } else if (pos === 1) {
        variants[pos] = {
          x: "85%",
          scale: 0.85,
          opacity: 0.85,
          zIndex: 3,
          rotateY: -15,
          filter: "brightness(0.9)",
          transition: baseTransition,
        };
      } else if (pos === -2) {
        variants[pos] = {
          x: "-165%",
          scale: 0.7,
          opacity: 0.4,
          zIndex: 1,
          rotateY: 25,
          filter: "brightness(0.8)",
          transition: baseTransition,
        };
      } else if (pos === 2) {
        variants[pos] = {
          x: "165%",
          scale: 0.7,
          opacity: 0.4,
          zIndex: 1,
          rotateY: -25,
          filter: "brightness(0.8)",
          transition: baseTransition,
        };
      } else if (pos < -2) {
        variants[pos] = {
          x: "250%",
          scale: 0.6,
          opacity: 0,
          zIndex: 0,
          rotateY: -30,
          filter: "brightness(0.7)",
          transition: baseTransition,
        };
      } else {
        variants[pos] = {
          x: "-250%",
          scale: 0.6,
          opacity: 0,
          zIndex: 0,
          rotateY: 30,
          filter: "brightness(0.7)",
          transition: baseTransition,
        };
      }
    }

    return variants;
  }, []);

  // Memoized function to get slide variants
  const getSlideVariants = useCallback(
    (position) => {
      return slideVariantsCache[position] || slideVariantsCache[3];
    },
    [slideVariantsCache]
  );

  // Memoized text animation variants
  const textVariants = useMemo(
    () => ({
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
          ease: [0.32, 0.72, 0, 1],
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
    }),
    []
  );

  // Autoplay functionality using ref to avoid state dependencies
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      dispatch({
        type: "SET_INDEX",
        payload: "NEXT",
        direction: 1,
      });
    }, 3000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize autoplay with ref-based state management
  useEffect(() => {
    if (state.isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [state.isAutoPlaying, startAutoPlay, stopAutoPlay]);

  // Debounced mouse handlers to reduce state updates
  const handleMouseEnter = useCallback(() => {
    if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    dispatch({ type: "SET_AUTO_PLAY", payload: false });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    mouseTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "SET_AUTO_PLAY", payload: true });
    }, 100); // Small debounce to prevent rapid toggling
  }, []);

  // Memoized current collection to prevent recalculation
  const currentCollection = useMemo(() => {
    return collections[state.currentIndex];
  }, [state.currentIndex]);

  // Memoized slide positions to prevent recalculation on every render
  const slidePositions = useMemo(() => {
    return collections.map((_, index) =>
      getSlidePosition(index, state.currentIndex)
    );
  }, [state.currentIndex, getSlidePosition]);

  return (
    <section className="bg-white min-h-screen flex flex-col">
      {/* Top Section - Static Heading + Dynamic Collection Name */}
      <div className="flex-none pt-12 sm:pt-12 md:pt-16 lg:pt-20 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Static 'Collections' heading */}
          <motion.h1
            className="
              text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
              font-faux font-light text-gray-900
              tracking-wide leading-none mb-6 sm:mb-6 md:mb-8
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.0,
              ease: [0.32, 0.72, 0, 1],
              type: "tween",
            }}
          >
            Collections
          </motion.h1>

          {/* Dynamic collection name */}
          <div className="h-16 sm:h-16 md:h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={state.currentIndex}
                className="
                  text-2xl sm:text-2xl md:text-3xl lg:text-4xl
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
        <div className="relative w-full max-w-6xl h-[400px] sm:h-80 md:h-96 lg:h-[500px]">
          {/* Carousel Container */}
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            <AnimatePresence initial={false}>
              {collections.map((slide, slideIndex) => {
                const position = slidePositions[slideIndex];
                const isVisible = Math.abs(position) <= 2;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={slideIndex}
                    className="absolute w-64 sm:w-60 md:w-72 lg:w-96 h-full"
                    animate={getSlideVariants(position)}
                    initial={
                      state.direction === 1
                        ? getSlideVariants(3)
                        : getSlideVariants(-3)
                    }
                    exit={
                      state.direction === 1
                        ? getSlideVariants(-3)
                        : getSlideVariants(3)
                    }
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                    }}
                    whileHover={
                      position === 0
                        ? {
                            scale: 1.03,
                            transition: {
                              duration: 0.3,
                              ease: "easeOut",
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
                      <OptimizedImage
                        src={slide.image}
                        alt={`${slide.name} collection`}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay for non-center images */}
                      {position !== 0 && (
                        <motion.div
                          className="absolute inset-0 bg-black/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      {/* Collection name overlay (visible only on center image) */}
                      {position === 0 && (
                        <motion.div
                          className="
                            absolute bottom-0 left-0 right-0
                            bg-gradient-to-t from-black/60 to-transparent
                            p-4 sm:p-6
                          "
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.2,
                            duration: 0.6,
                            ease: [0.32, 0.72, 0, 1],
                            type: "tween",
                          }}
                        >
                          <motion.h3
                            className="
                            text-white font-josefin font-medium
                            text-base sm:text-base md:text-lg lg:text-xl
                            text-center tracking-wide
                          "
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4,
                              duration: 0.5,
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
                );
              })}
            </AnimatePresence>
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
