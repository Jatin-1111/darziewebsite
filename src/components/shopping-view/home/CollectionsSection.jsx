"use client";
import { memo, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Cloudinary CDN optimized images with responsive sizing
const getOptimizedImage = (url, width = 800) => {
  // Extract the base URL and image ID
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // Add Cloudinary transformations for optimization - increased height ratio to 1.5
  const transformations = `w_${width},h_${Math.round(
    width * 1.5
  )},c_fill,q_auto:good,f_auto,dpr_auto`;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

const baseImages = [
  {
    name: "Festive Wear",
    imageId: "v1753080684/bhzrzsu4mbkeqb4fiq87.jpg",
  },
  {
    name: "Wedding Collection",
    imageId: "v1753077457/dwuoa8niayk8stp7ulnl.jpg",
  },
  {
    name: "Party Wear",
    imageId: "v1753078473/oyfcnpy3xeyza7xua1tj.jpg",
  },
  {
    name: "Casual Ethnic",
    imageId: "v1753078648/iulr0bvk0t3markjjhg1.jpg",
  },
  {
    name: "Formal Wear",
    imageId: "v1753080637/jbrmd5ogy33i2iswm6hp.jpg",
  },
  {
    name: "Bridal Collection",
    imageId: "v1753077157/h27x3oinf2aqp9malokd.jpg",
  },
];

// Generate optimized collections based on device
const collections = baseImages.map((item) => ({
  name: item.name,
  image: `https://res.cloudinary.com/dz9ndmaa8/image/upload/${item.imageId}`,
  mobileImage: getOptimizedImage(
    `https://res.cloudinary.com/dz9ndmaa8/image/upload/${item.imageId}`,
    400
  ),
  desktopImage: getOptimizedImage(
    `https://res.cloudinary.com/dz9ndmaa8/image/upload/${item.imageId}`,
    800
  ),
}));

// Image Preloader Hook
const useImagePreloader = (images) => {
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ src, status: "loaded" });
        img.onerror = () => reject({ src, status: "error" });
        img.src = src;
      });
    };

    const preloadAll = async () => {
      const results = await Promise.allSettled(
        images.map((src) => preloadImage(src))
      );

      const loaded = {};
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          loaded[images[index]] = true;
        }
      });
      setLoadedImages(loaded);
    };

    preloadAll();
  }, [images]);

  return loadedImages;
};

// Optimized Image component with caching
const OptimizedImage = memo(
  ({ src, alt, className, priority = false, isPreloaded = false }) => {
    const [isLoaded, setIsLoaded] = useState(isPreloaded);
    const imgRef = useRef(null);

    useEffect(() => {
      if (isPreloaded) {
        setIsLoaded(true);
      }
    }, [isPreloaded]);

    return (
      <div className="relative w-full h-full">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} ${
            isLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
          onLoad={() => setIsLoaded(true)}
          loading={priority ? "eager" : "lazy"}
          draggable={false}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

// Mobile carousel - All images kept in DOM for caching
const MobileCarousel = memo(({ currentIndex, preloadedImages }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4">
      <div className="relative w-full max-w-md h-[550px] sm:h-[600px]">
        {/* Render all images but only show current one */}
        {collections.map((collection, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="relative w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <OptimizedImage
                src={collection.mobileImage}
                alt={`${collection.name} collection`}
                className="w-full h-full object-cover"
                priority={true}
                isPreloaded={preloadedImages[collection.mobileImage]}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6">
                <h3 className="text-white font-josefin font-medium text-xl text-center">
                  {collection.name}
                </h3>
              </div>
            </div>
          </div>
        ))}

        {/* Simple dots indicator */}
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
          {collections.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-gray-800" : "w-1.5 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

MobileCarousel.displayName = "MobileCarousel";

// Desktop carousel with 3D effects
const DesktopCarousel = memo(
  ({
    currentIndex,
    isAutoPlaying,
    onMouseEnter,
    onMouseLeave,
    preloadedImages,
  }) => {
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

    const getSlideVariants = useCallback((position) => {
      const configs = {
        0: {
          x: "0%",
          scale: 1,
          opacity: 1,
          zIndex: 5,
          rotateY: 0,
          filter: "brightness(1)",
        },
        1: {
          x: "85%",
          scale: 0.85,
          opacity: 0.85,
          zIndex: 3,
          rotateY: -15,
          filter: "brightness(0.9)",
        },
        "-1": {
          x: "-85%",
          scale: 0.85,
          opacity: 0.85,
          zIndex: 3,
          rotateY: 15,
          filter: "brightness(0.9)",
        },
        2: {
          x: "165%",
          scale: 0.7,
          opacity: 0.4,
          zIndex: 1,
          rotateY: -25,
          filter: "brightness(0.8)",
        },
        "-2": {
          x: "-165%",
          scale: 0.7,
          opacity: 0.4,
          zIndex: 1,
          rotateY: 25,
          filter: "brightness(0.8)",
        },
      };

      const config = configs[position] || {
        x: position > 0 ? "250%" : "-250%",
        scale: 0.6,
        opacity: 0,
        zIndex: 0,
        rotateY: position > 0 ? -30 : 30,
        filter: "brightness(0.7)",
      };

      return {
        ...config,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          scale: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
          opacity: { duration: 0.4, ease: "easeInOut" },
          rotateY: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
        },
      };
    }, []);

    return (
      <div
        className="relative w-full h-full flex items-center justify-center px-8"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="relative w-full max-w-6xl h-[650px]">
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            {collections.map((slide, slideIndex) => {
              const position = getSlidePosition(slideIndex, currentIndex);
              const isVisible = Math.abs(position) <= 2;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={slideIndex}
                  className="absolute w-96 h-full"
                  animate={getSlideVariants(position)}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                  whileHover={
                    position === 0
                      ? {
                          scale: 1.03,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }
                      : {}
                  }
                >
                  <div className="relative w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <OptimizedImage
                      src={slide.desktopImage}
                      alt={`${slide.name} collection`}
                      className="w-full h-full object-cover"
                      priority={Math.abs(position) <= 1}
                      isPreloaded={preloadedImages[slide.desktopImage]}
                    />

                    {position !== 0 && (
                      <motion.div
                        className="absolute inset-0 bg-black/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {position === 0 && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2,
                          duration: 0.6,
                          ease: [0.32, 0.72, 0, 1],
                        }}
                      >
                        <h3 className="text-white font-josefin font-medium text-xl text-center tracking-wide">
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
    );
  }
);

DesktopCarousel.displayName = "DesktopCarousel";

const CollectionsSection = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Preload all images based on device type
  const imagesToPreload = useMemo(() => {
    return collections.map((c) => (isMobile ? c.mobileImage : c.desktopImage));
  }, [isMobile]);

  const preloadedImages = useImagePreloader(imagesToPreload);

  // Also preload the next and previous images for smoother transitions
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % collections.length;
    const prevIndex =
      (currentIndex - 1 + collections.length) % collections.length;

    const preloadAdjacent = () => {
      [nextIndex, prevIndex].forEach((idx) => {
        const img = new Image();
        img.src = isMobile
          ? collections[idx].mobileImage
          : collections[idx].desktopImage;
      });
    };

    preloadAdjacent();
  }, [currentIndex, isMobile]);

  // Navigation
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % collections.length);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, isMobile ? 4000 : 3500);
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
  }, [isAutoPlaying, nextSlide, isMobile]);

  // Desktop mouse handlers
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setIsAutoPlaying(false);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setIsAutoPlaying(true);
  }, [isMobile]);

  // Mobile touch handlers
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % collections.length);
      } else {
        setCurrentIndex(
          (prev) => (prev - 1 + collections.length) % collections.length
        );
      }
    }

    setTimeout(() => setIsAutoPlaying(true), 1000);
  }, []);

  const currentCollection = collections[currentIndex];

  return (
    <section className="bg-white min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="flex-none pt-12 md:pt-20 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-faux font-light text-gray-900 tracking-wide leading-none mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Collections
          </motion.h1>

          <div className="h-12 md:h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentIndex}
                className="text-2xl md:text-3xl lg:text-4xl font-josefin font-medium text-gray-600 tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {currentCollection.name}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div
        className="flex-1 flex items-center justify-center pb-16 md:pb-20"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        role="region"
        aria-label="Collections carousel"
      >
        {isMobile ? (
          <MobileCarousel
            currentIndex={currentIndex}
            preloadedImages={preloadedImages}
          />
        ) : (
          <DesktopCarousel
            currentIndex={currentIndex}
            isAutoPlaying={isAutoPlaying}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            preloadedImages={preloadedImages}
          />
        )}
      </div>
    </section>
  );
});

CollectionsSection.displayName = "CollectionsSection";

export default CollectionsSection;
