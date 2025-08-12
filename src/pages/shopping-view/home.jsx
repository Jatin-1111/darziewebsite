import "../../../src/App.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

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

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bestSellers =
    productList && productList.length > 0 ? productList.slice(0, 4) : [];

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex(
        (prevIndex) => (prevIndex + 1) % collectionCategories.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const handleNavigateToListingPage = (item, section) => {
  //   sessionStorage.removeItem("filters");
  //   const currentFilter = { [section]: [item.id] };
  //   sessionStorage.setItem("filters", JSON.stringify(currentFilter));
  //   navigate(`/shop/listing`);
  // };

  // const handleGetProductDetails = (id) => {
  //   dispatch(fetchProductDetails(id));
  // };

  // const handleAddtoCart = (id) => {
  //   dispatch(addToCart({ userId: user?.id, productId: id, quantity: 1 })).then(
  //     (data) => {
  //       if (data?.payload?.success) {
  //         dispatch(fetchCartItems(user?.id));
  //         toast({ title: "Product is added to cart" });
  //       }
  //     }
  //   );
  // };

  const handleNavigate = () => {
    navigate(`/shop/listing?category=best+sellers`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="relative w-full h-screen overflow-hidden font-josefin">
        {/* Responsive Banner Image */}
        <picture>
          {/* Add width and height attributes */}
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

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 text-center">
          <Link to="/shop/listing">
            <button className="bg-black text-white text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full hover:bg-opacity-80 transition duration-300">
              Go to Collection
            </button>
          </Link>
        </div>
      </div>

      <section>
        <div
          className="relative w-full h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/dpxiwelxk/image/upload/v1754384807/banner_zj4u8n.png)`,
            loading: "lazy",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #F4EFD6 59%, #8E8B7D 100%)",
              opacity: 0.6,
            }}
          ></div>
          <div className="relative z-10 flex flex-col h-full w-full px-4 md:px-6 ">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-faux text-[#6C3D1D] mt-5 text-center">
              collections
            </h1>
            <div className="backdrop-blur-sm mt-[8rem] ml-14 p-6 rounded-md w-full">
              <h2 className="text-6xl font-faux text-white">
                {collectionCategories[currentCategoryIndex].title}
              </h2>
              <ul className="font-josefin list-disc list-inside space-y-2 text-black">
                {collectionCategories[currentCategoryIndex].items.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="absolute bottom-4 ml-[5.75rem] font-faux text-white text-lg">
            darzie&apos;s couture
          </div>
        </div>
      </section>

      <div className="min-h-screen w-full">
        <h2 className="text-6xl font-faux text-center text-[#6C3D1D] py-10">
          best sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-12">
          {/* Render best sellers from the dynamically created 'bestSellers' array */}
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
        <div className="bg-[#6C3D1D] text-white py-10 mt-12 px-4 md:px-12">
          <div className="grid auto-rows-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-sm font-josefin">
            {sellerLinks.map((label, index) => (
              <button
                key={index}
                onClick={() => handleNavigate("product-1")} // This still navigates to a generic product-1. You might want to update this to navigate based on the 'label'
                className="flex items-center gap-2 whitespace-nowrap bg-white bg-opacity-10 rounded-full px-4 py-2 hover:bg-opacity-20 transition"
              >
                <span className="text-xl">⬖</span>
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-b from-[#f9f6ef] to-[#ded6c1]">
        <h2 className="text-5xl font-faux text-center text-[#6C3D1D] mb-12">
          testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-lg border border-[#eee] relative"
            >
              <p className="text-[#6C3D1D] text-sm leading-relaxed font-medium text-center">
                Darzie Couture offers a perfect blend of elegance, style, and
                craftsmanship. Each piece is thoughtfully designed and
                impeccably tailored, making you feel confident and unique. Their
                attention to detail and quality truly sets them apart in the
                world of fashion.
              </p>
            </div>
          ))}
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
