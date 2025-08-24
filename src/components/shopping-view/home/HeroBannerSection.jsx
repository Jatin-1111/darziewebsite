// src/components/shopping-view/home/HeroBannerSection.jsx - NO PARALLAX, RESPONSIVE 📱
import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroBannerSection = memo(() => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [criticalImageLoaded, setCriticalImageLoaded] = useState(false);

  // Preload critical image as soon as component mounts
  useEffect(() => {
    const criticalImage = new Image();
    // Updated mobile image dimensions for 390x844 viewport
    criticalImage.src =
      "https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_390,h_844,c_fill,fl_progressive/v1754392860/bannermobile_ml9vmo.svg";

    criticalImage.onload = () => {
      setCriticalImageLoaded(true);
    };

    const desktopImage = new Image();
    desktopImage.src =
      "https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill,fl_progressive/v1754393818/bannardestop_ri4m9p.svg";
  }, []);

  // Animation variants (no parallax)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.6,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
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

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 1.1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  return (
    <motion.div
      className="relative w-full h-screen overflow-hidden font-josefin"
      role="banner"
      aria-label="Darzie's Couture hero section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Static Background Gradient (no parallax) */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, #F4EFD6 0%, #E5D5A3 50%, #C4BA97 100%)`,
        }}
      />

      {/* Enhanced Responsive Banner Image - Mobile Optimized (no parallax) */}
      <motion.div className="relative w-full h-full" variants={imageVariants}>
        <picture>
          {/* Extra Small Mobile - 320px and below */}
          <source
            media="(max-width: 320px)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_320,h_568,c_fill,fl_progressive:steep,q_75/v1754392860/bannermobile_ml9vmo.svg"
          />

          {/* Small Mobile - 360px */}
          <source
            media="(max-width: 360px)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_360,h_640,c_fill,fl_progressive:steep,q_78/v1754392860/bannermobile_ml9vmo.svg"
          />

          {/* Standard Mobile - 390px */}
          <source
            media="(max-width: 390px)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_390,h_844,c_fill,fl_progressive:steep,q_80/v1754392860/bannermobile_ml9vmo.svg"
          />

          {/* Large Mobile - 428px (iPhone 12 Pro Max) */}
          <source
            media="(max-width: 428px)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_428,h_926,c_fill,fl_progressive:steep,q_80/v1754392860/bannermobile_ml9vmo.svg"
          />

          {/* Small mobile devices up to 480px */}
          <source
            media="(max-width: 480px)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_480,h_800,c_fill,fl_progressive:steep,q_80/v1754392860/bannermobile_ml9vmo.svg"
          />

          {/* Medium devices and small tablets - Portrait */}
          <source
            media="(max-width: 768px) and (orientation: portrait)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_768,h_1024,c_fill,fl_progressive:steep,q_82/v1754392860/bannermobile_ml9vmo.svg"
          />

          {/* Medium devices - Landscape */}
          <source
            media="(max-width: 768px) and (orientation: landscape)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_768,h_432,c_fill,fl_progressive:steep,q_82/v1754393818/bannardestop_ri4m9p.svg"
          />

          {/* Large tablets - Portrait */}
          <source
            media="(max-width: 1024px) and (orientation: portrait)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1024,h_1366,c_fill,fl_progressive:steep,q_85/v1754392860/bannermobile_ml9vmo.svg"
          />

          {/* Tablets and small laptops - Landscape */}
          <source
            media="(max-width: 1024px) and (orientation: landscape)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1024,h_768,c_fill,fl_progressive:steep,q_85/v1754393818/bannardestop_ri4m9p.svg"
          />

          {/* Small Desktop */}
          <source
            media="(max-width: 1366px)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1366,h_768,c_fill,fl_progressive:steep,q_88/v1754393818/bannardestop_ri4m9p.svg"
          />

          {/* Large Desktop and above */}
          <source
            media="(min-width: 1367px)"
            srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill,fl_progressive:steep,q_90/v1754393818/bannardestop_ri4m9p.svg"
          />

          {/* Default/Fallback */}
          <motion.img
            src="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill,fl_progressive:steep,q_90/v1754393818/bannardestop_ri4m9p.svg"
            alt="Elegant ethnic wear collection showcasing traditional and contemporary designs"
            className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            onLoad={() => setImageLoaded(true)}
            width="1920"
            height="1080"
            animate={imageLoaded ? "visible" : "hidden"}
            style={{
              // Ensure proper responsive sizing
              minHeight: "100vh",
              minWidth: "100vw",
              maxHeight: "100vh",
              maxWidth: "100vw",
            }}
          />
        </picture>

        {/* Shimmer Loading Effect */}
        {!imageLoaded && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        )}
      </motion.div>

      {/* Enhanced Animated Overlay (no parallax) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"
        aria-hidden="true"
        variants={overlayVariants}
      />

      {/* Animated Content - Mobile Optimized (no parallax) */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end items-center p-4 sm:p-6 md:p-8 pb-6 sm:pb-8"
        variants={containerVariants}
      >
        {/* Simple floating decoration (no parallax) */}
        <motion.div
          className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#C4BA97]/50 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Enhanced CTA Button - Mobile Optimized */}
        <div className="w-full max-w-xs sm:max-w-sm mb-4 sm:mb-6">
          <Link
            to="/shop/listing"
            className="block"
            aria-label="Explore our fashion collection"
            onMouseEnter={() => {
              const link = document.createElement("link");
              link.rel = "prefetch";
              link.href = "/shop/listing";
              document.head.appendChild(link);
            }}
          >
            <motion.button
              className="
                font-faux w-full bg-black/80 backdrop-blur-sm text-white 
                font-medium rounded-full border-2 border-white/20
                py-3 sm:py-4 px-6 sm:px-8
                text-sm sm:text-base md:text-lg
                transition-all duration-300 ease-in-out
                hover:bg-white hover:text-black
                focus:outline-none focus:ring-4 focus:ring-white/50
                will-change-transform relative overflow-hidden
                min-h-[48px] touch-manipulation
              "
              type="button"
              aria-describedby="cta-description"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {/* Button Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "100%",
                  transition: { duration: 0.6, ease: "easeInOut" },
                }}
              />

              {/* Button Text with Micro Animation */}
              <motion.span
                className="relative z-10"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                Explore Collection
              </motion.span>

              {/* Pulsing Ring Effect */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                initial={{ scale: 1, opacity: 0 }}
                whileHover={{
                  scale: 1.1,
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
              />
            </motion.button>
          </Link>
          <span id="cta-description" className="sr-only">
            Browse our latest ethnic wear and contemporary fashion collection
          </span>
        </div>
      </motion.div>

      {/* Animated Corner Decorations - Mobile Optimized (no parallax) */}
      <motion.div
        className="absolute top-2 left-2 sm:top-4 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-t-2 border-white/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-b-2 border-white/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
      />

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />
    </motion.div>
  );
});

HeroBannerSection.displayName = "HeroBannerSection";

export default HeroBannerSection;
