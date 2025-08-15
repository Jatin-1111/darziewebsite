// src/components/shopping-view/home/HeroBannerSection.jsx - LCP OPTIMIZED
import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HeroBannerSection = memo(() => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [criticalImageLoaded, setCriticalImageLoaded] = useState(false);

  // Preload critical image as soon as component mounts
  useEffect(() => {
    const criticalImage = new Image();
    // Load mobile-first image immediately
    criticalImage.src =
      "https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_640,h_800,c_fill,fl_progressive/v1754392860/bannermobile_ml9vmo.svg";

    criticalImage.onload = () => {
      setCriticalImageLoaded(true);
    };

    // Also preload desktop version for faster switching
    const desktopImage = new Image();
    desktopImage.src =
      "https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill,fl_progressive/v1754393818/bannardestop_ri4m9p.svg";
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden font-josefin"
      role="banner"
      aria-label="Darzie's Couture hero section"
    >
      {/* Critical CSS Background for instant render */}
      <div
        className="absolute inset-0 opacity-30 bg-gradient-to-b from-[#F4EFD6] to-[#C4BA97]"
        style={{
          background: `linear-gradient(135deg, #F4EFD6 0%, #E5D5A3 50%, #C4BA97 100%)`,
        }}
      />

      {/* Optimized Responsive Banner Image with better Cloudinary params */}
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_640,h_800,c_fill,fl_progressive:steep,q_80/v1754392860/bannermobile_ml9vmo.svg"
        />
        <source
          media="(max-width: 1024px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1024,h_768,c_fill,fl_progressive:steep,q_85/v1754393818/bannardestop_ri4m9p.svg"
        />
        <source
          media="(min-width: 1025px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill,fl_progressive:steep,q_90/v1754393818/bannardestop_ri4m9p.svg"
        />
        <img
          src="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill,fl_progressive:steep,q_90/v1754393818/bannardestop_ri4m9p.svg"
          alt="Elegant ethnic wear collection showcasing traditional and contemporary designs"
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          onLoad={() => setImageLoaded(true)}
          // Add explicit dimensions to prevent layout shift
          width="1920"
          height="1080"
        />
      </picture>

      {/* Optimized Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"
        aria-hidden="true"
      />

      {/* Content with better performance */}
      <div className="absolute inset-0 flex flex-col justify-end items-center p-4 sm:p-6 md:p-8">
        {/* Optimized CTA Button */}
        <div className="w-full max-w-xs sm:max-w-sm">
          <Link
            to="/shop/listing"
            className="block"
            aria-label="Explore our fashion collection"
            // Preload the next page for faster navigation
            onMouseEnter={() => {
              const link = document.createElement("link");
              link.rel = "prefetch";
              link.href = "/shop/listing";
              document.head.appendChild(link);
            }}
          >
            <button
              className="
              font-faux w-full bg-black/80 backdrop-blur-sm text-white 
              font-medium rounded-full border-2 border-white/20
              py-3 sm:py-4 px-6 sm:px-8
              text-sm sm:text-base md:text-lg
              transition-all duration-300 ease-in-out
              hover:bg-white hover:text-black
              hover:scale-105 hover:shadow-xl
              active:scale-95
              focus:outline-none focus:ring-4 focus:ring-white/50
              will-change-transform
            "
              type="button"
              aria-describedby="cta-description"
            >
              Explore Collection
            </button>
          </Link>
          <span id="cta-description" className="sr-only">
            Browse our latest ethnic wear and contemporary fashion collection
          </span>
        </div>
      </div>
    </div>
  );
});

HeroBannerSection.displayName = "HeroBannerSection";

export default HeroBannerSection;
