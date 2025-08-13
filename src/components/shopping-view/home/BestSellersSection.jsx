import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const sellerLinks = [
  "Anarkali Suit (Floor Length)",
  "Anarkali Suit (Knee Length)",
  "Straight Cut Suit with Straight Pants",
  "Palazzo Suit (Short Kurti)",
  "Palazzo Suit (Long Kurti)",
  "Sharara Suit (Short Kurti)",
  "Sharara Suit (Long Kurti)",
  "Patiala Suit",
  "Churidar Suit",
  "A-Line Suit",
  "Cotton Printed Suits",
  "Chikankari Suits",
  "Georgette Suits (Embroidered/Printed)",
  "Silk Suits (e.g., Banarasi, Chanderi)",
  "Velvet Suits",
  "Rayon Suits",
  "Organza Suits",
  "Zari Work Suits",
  "Sequence Work Suits",
  "Gota Patti Work Suits",
  "Ethnic Co-ord Sets (Kurta & Pant/Skirt)",
  "Jacket Style Suits",
  "Cape Style Suits",
  "Asymmetric Hemline Suits",
  "High-Low Kurta Suits",
  "Dhoti Style Suits",
  "Kaftan Style Suits",
  "Pant Style Suits (Cigarette Pants)",
  "Unstitched Dress Materials",
  "Readymade Suits (across various sizes)",
];

const BestSellersSection = memo(({ bestSellers = [] }) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(`/shop/listing?category=best+sellers`);
  }, [navigate]);

  const handleProductClick = useCallback(
    (label) => {
      // Could implement specific product navigation based on label
      handleNavigate();
    },
    [handleNavigate]
  );

  return (
    <div className="min-h-screen w-full">
      <h2 className="text-6xl font-faux text-center text-[#6C3D1D] py-10">
        best sellers
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-12">
        {bestSellers.map((product) => (
          <div key={product._id}>
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              width="450"
              height="450"
              className="w-full h-[450px] object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>

      {/* Seller Links Section */}
      <div className="bg-[#6C3D1D] text-white py-10 mt-12 px-4 md:px-12">
        <div className="grid auto-rows-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-sm font-josefin">
          {sellerLinks.map((label, index) => (
            <button
              key={index}
              onClick={() => handleProductClick(label)}
              className="flex items-center gap-2 whitespace-nowrap bg-white bg-opacity-10 rounded-full px-4 py-2 hover:bg-opacity-20 transition"
              aria-label={`View ${label} products`}
            >
              <span className="text-xl">⬖</span>
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

BestSellersSection.displayName = "BestSellersSection";

export default BestSellersSection;
