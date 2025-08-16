import { memo, useState, useEffect } from "react";

const collectionCategories = [
  {
    title: "Festive Wear",
    items: [
      "Anarkali Suits",
      "Lehenga Sets",
      "Sarees",
      "Dupattas",
      "Kurta Sets",
      "Ethnic Jackets",
    ],
  },
  {
    title: "Wedding Collection",
    items: [
      "Bridal Lehengas",
      "Heavy Embroidered Sarees",
      "Groomswear",
      "Sherwanis",
      "Reception Gowns",
      "Designer Blouses",
    ],
  },
  {
    title: "Indo Western",
    items: [
      "Fusion Gowns",
      "Cape Sets",
      "Draped Skirts",
      "Asymmetrical Kurtas",
      "Tunics",
      "Jumpsuits",
    ],
  },
  {
    title: "Casual Ethnic",
    items: [
      "Cotton Kurtis",
      "Straight Pants",
      "Boho Tunics",
      "Casual Dupattas",
      "Printed Kurtas",
      "Everyday Sarees",
    ],
  },
  {
    title: "Heritage Craft",
    items: [
      "Banarasi Sarees",
      "Chikankari Sets",
      "Ajrakh Prints",
      "Phulkari Dupattas",
      "Handloom Kurtas",
      "Kalamkari Dresses",
    ],
  },
  {
    title: "Seasonal Trends",
    items: [
      "Summer Linen Sets",
      "Monsoon Kurtis",
      "Festive Jackets",
      "Layered Outfits",
      "Winter Shawls",
      "Pastel Sets",
    ],
  },
];

const CollectionsSection = memo(() => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex(
        (prevIndex) => (prevIndex + 1) % collectionCategories.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentCategory = collectionCategories[currentCategoryIndex];

  return (
    <section>
      <div
        className="relative w-full h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/dpxiwelxk/image/upload/v1754384807/banner_zj4u8n.png)`,
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, #F4EFD6 59%, #8E8B7D 100%)",
            opacity: 0.6,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full w-full px-4 md:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-faux text-[#6C3D1D] mt-5 text-center">
            collections
          </h1>

          <div className="backdrop-blur-sm mt-[8rem] ml-14 p-6 rounded-md w-full">
            <h2 className="text-6xl font-faux text-white">
              {currentCategory.title}
            </h2>
            <ul className="font-josefin list-disc list-inside space-y-2 text-black">
              {currentCategory.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 ml-[5.75rem] font-faux text-white text-lg">
          darzie&apos;s couture
        </div>
      </div>
    </section>
  );
});

CollectionsSection.displayName = "CollectionsSection";

export default CollectionsSection;
