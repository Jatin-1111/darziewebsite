// src/components/shopping-view/home/BestSellersSection.jsx - MOBILE RESPONSIVE
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const sellerLinks = [
  "Anarkali Suit (Floor Length)",
  "Anarkali Suit (Knee Length)",
  "Straight Cut Suit",
  "Palazzo Suit",
  "Sharara Suit",
  "Patiala Suit",
  "Churidar Suit",
  "A-Line Suit",
  "Cotton Printed Suits",
  "Chikankari Suits",
  "Georgette Suits",
  "Silk Suits",
  "Velvet Suits",
  "Rayon Suits",
  "Organza Suits",
  "Zari Work Suits",
  "Sequence Work Suits",
  "Gota Patti Work",
  "Ethnic Co-ord Sets",
  "Jacket Style Suits",
  "Cape Style Suits",
  "Asymmetric Suits",
  "High-Low Kurta Suits",
  "Dhoti Style Suits",
  "Kaftan Style Suits",
  "Cigarette Pants Suits",
  "Unstitched Materials",
  "Readymade Suits",
];

const BestSellersSection = memo(({ bestSellers = [] }) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(`/shop/listing?category=best+sellers`);
  }, [navigate]);

  const handleProductClick = useCallback(
    (label) => {
      handleNavigate();
    },
    [handleNavigate]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50">
      {/* Mobile-Responsive Section Header */}
      <div className="text-center py-8 sm:py-12 md:py-16 px-4">
        <h2
          className="
          font-faux text-[#6C3D1D] font-bold
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          mb-4 sm:mb-6
        "
        >
          best sellers
        </h2>
        <p
          className="
          text-gray-600 font-medium max-w-2xl mx-auto
          text-sm sm:text-base md:text-lg
          leading-relaxed
        "
        >
          Discover our most loved pieces, crafted with precision and worn with
          pride
        </p>
      </div>

      {/* Mobile-First Product Grid */}
      {bestSellers && bestSellers.length > 0 && (
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 mb-12 sm:mb-16">
          <div
            className="
            grid gap-4 sm:gap-6 md:gap-8
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            max-w-7xl mx-auto
          "
          >
            {bestSellers.map((product, index) => (
              <div
                key={product._id || index}
                className="
                  group relative overflow-hidden rounded-xl shadow-md
                  transition-all duration-300 ease-in-out
                  hover:shadow-xl hover:-translate-y-2
                  bg-white
                "
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title || `Best seller ${index + 1}`}
                    loading="lazy"
                    className="
                      w-full h-full object-cover
                      transition-transform duration-500 ease-in-out
                      group-hover:scale-110
                    "
                  />
                </div>

                {/* Mobile-Optimized Product Overlay */}
                <div
                  className="
                  absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 ease-in-out
                  flex items-end p-4
                "
                >
                  <div className="text-white">
                    <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-200">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile-Responsive Seller Links Section */}
      <div className="bg-[#6C3D1D] text-white py-8 sm:py-12 md:py-16">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h3
              className="
              font-bold text-xl sm:text-2xl md:text-3xl mb-4
              text-[#C4BA97]
            "
            >
              Shop by Style
            </h3>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Browse our complete collection of traditional and contemporary
              designs
            </p>
          </div>

          {/* Mobile-First Grid Layout */}
          <div
            className="
            grid gap-3 sm:gap-4 md:gap-6
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
            max-w-6xl mx-auto
          "
          >
            {sellerLinks.map((label, index) => (
              <button
                key={index}
                onClick={() => handleProductClick(label)}
                className="
                  group flex items-center gap-3 p-3 sm:p-4
                  bg-white/10 backdrop-blur-sm rounded-lg border border-white/20
                  hover:bg-white/20 hover:border-white/40
                  transition-all duration-300 ease-in-out
                  hover:scale-105 hover:shadow-lg
                  active:scale-95
                  text-left w-full
                "
                aria-label={`Shop ${label} collection`}
              >
                <span
                  className="
                  text-[#C4BA97] text-lg sm:text-xl
                  group-hover:scale-110 transition-transform duration-200
                "
                >
                  ⬖
                </span>
                <span
                  className="
                  text-white font-medium
                  text-xs sm:text-sm md:text-base
                  line-clamp-2 leading-tight
                  group-hover:text-[#C4BA97] transition-colors duration-200
                "
                >
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile CTA Button */}
          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={handleNavigate}
              className="
                bg-[#C4BA97] text-[#6C3D1D] font-bold
                px-6 sm:px-8 py-3 sm:py-4 rounded-full
                text-sm sm:text-base md:text-lg
                hover:bg-white hover:scale-105
                transition-all duration-300 ease-in-out
                shadow-lg hover:shadow-xl
                active:scale-95
              "
            >
              View All Collections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

BestSellersSection.displayName = "BestSellersSection";

export default BestSellersSection;
