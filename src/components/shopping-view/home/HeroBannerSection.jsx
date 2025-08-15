// src/components/shopping-view/home/HeroBannerSection.jsx - MOBILE RESPONSIVE
import { memo } from "react";
import { Link } from "react-router-dom";

const HeroBannerSection = memo(() => {
  return (
    <div className="relative w-full h-screen overflow-hidden font-josefin">
      {/* Mobile-First Responsive Banner Image */}
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_640,h_800,c_fill/v1754392860/bannermobile_ml9vmo.svg"
        />
        <source
          media="(max-width: 1024px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1024,h_768,c_fill/v1754393818/bannardestop_ri4m9p.svg"
        />
        <source
          media="(min-width: 1025px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920,h_1080,c_fill/v1754393818/bannardestop_ri4m9p.svg"
        />
        <img
          src="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920/v1754393818/bannardestop_ri4m9p.svg"
          alt="Darzie's Couture Banner - Elegant ethnic wear collection"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Mobile-Responsive Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
        style={{
          background: `linear-gradient(
            to bottom, 
            rgba(244, 239, 214, 0.4) 0%, 
            rgba(244, 239, 214, 0.6) 50%, 
            rgba(142, 139, 125, 0.8) 100%
          )`,
        }}
      />

      {/* Mobile-First Content Positioning */}
      <div className="absolute inset-0 flex flex-col justify-end items-center p-4 sm:p-6 md:p-8">
        {/* Mobile-Optimized CTA Button */}
        <div className="w-full max-w-xs sm:max-w-sm">
          <Link to="/shop/listing" className="block">
            <button
              className="
              w-full bg-black/80 backdrop-blur-sm text-white 
              font-medium rounded-full border-2 border-white/20
              py-3 sm:py-4 px-6 sm:px-8
              text-sm sm:text-base md:text-lg
              transition-all duration-300 ease-in-out
              hover:bg-white hover:text-black
              hover:scale-105 hover:shadow-xl
              active:scale-95
              focus:outline-none focus:ring-4 focus:ring-white/50
            "
            >
              Explore Collection
            </button>
          </Link>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:hidden">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroBannerSection.displayName = "HeroBannerSection";

export default HeroBannerSection;
