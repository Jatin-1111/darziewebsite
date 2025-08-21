// src/components/shopping-view/home/BestSellersSection.jsx - UPDATED WITH SEPARATE COMPONENTS 🔥
import { memo } from "react";
import BestSellersGrid from "./BestSellerGrid";
import CollectionsGrid from "./CollectionsGrid";

const BestSellersSection = memo(({ bestSellers = [] }) => {
  return (
    <div className="w-full">
      {/* Best Sellers Product Grid */}
      <BestSellersGrid bestSellers={bestSellers} />

      {/* Separator */}
      <div className="h-2 bg-gradient-to-r from-[#6C3D1D] via-[#C4BA97] to-[#6C3D1D]" />

      {/* Collections/Categories Grid */}
      <CollectionsGrid />
    </div>
  );
});

BestSellersSection.displayName = "BestSellersSection";

export default BestSellersSection;
