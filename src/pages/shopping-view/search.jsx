// src/pages/shopping-view/search.jsx - UPDATED WITHOUT MODAL
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// REMOVED fetchProductDetails import
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  // REMOVED openDetailsDialog state
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  // REMOVED productDetails from useSelector
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  // REMOVED handleGetProductDetails function

  // REMOVED useEffect for productDetails modal

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>

      {/* Search Results */}
      {!searchResults.length ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-extrabold text-gray-700 mb-2">
            {keyword.length > 0 ? "No results found!" : "Start searching..."}
          </h1>
          <p className="text-gray-600">
            {keyword.length > 0
              ? "Try different keywords or check your spelling"
              : "Enter a product name or category to find what you're looking for"}
          </p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results for "{keyword}"
            </h2>
            <p className="text-gray-600 text-sm">
              Found {searchResults.length}{" "}
              {searchResults.length === 1 ? "product" : "products"}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {searchResults.map((item) => (
              <ShoppingProductTile
                key={item._id || item.id}
                handleAddtoCart={handleAddtoCart}
                product={item}
                // REMOVED handleGetProductDetails prop
              />
            ))}
          </div>
        </>
      )}

      {/* REMOVED ProductDetailsDialog */}
    </div>
  );
}

export default SearchProducts;
