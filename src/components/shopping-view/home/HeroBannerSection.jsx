import { memo } from "react";
import { Link } from "react-router-dom";

const HeroBannerSection = memo(() => {
  return (
    <div className="relative w-full h-screen overflow-hidden font-josefin">
      {/* Responsive Banner Image */}
      <picture>
        <source
          media="(max-width: 640px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_640/v1754392860/bannermobile_ml9vmo.svg"
        />
        <source
          media="(min-width: 641px)"
          srcSet="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920/v1754393818/bannardestop_ri4m9p.svg"
        />
        <img
          src="https://res.cloudinary.com/dpxiwelxk/image/upload/f_auto,q_auto,w_1920/v1754393818/bannardestop_ri4m9p.svg"
          alt="Darzie's Couture Banner"
          width="1920"
          height="1080"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #F4EFD6 59%, #8E8B7D 100%)",
          opacity: 0.6,
        }}
      />

      {/* CTA Button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 text-center">
        <Link to="/shop/listing">
          <button className="bg-black text-white text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-opacity-80 transition duration-300">
            Go to Collection
          </button>
        </Link>
      </div>
    </div>
  );
});

HeroBannerSection.displayName = "HeroBannerSection";

export default HeroBannerSection;
