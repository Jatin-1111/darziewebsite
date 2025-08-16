// src/components/shopping-view/header.jsx - FIXED VERSION 🔧
import { LogOut, Menu, ShoppingCart, UserCog, X } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems({ onItemClick, isMobile = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    // ✅ FIX 1: Consistent category filtering logic
    if (getCurrentMenuItem.id === "home") {
      navigate("/shop/home");
      if (onItemClick) onItemClick();
      return;
    }

    if (getCurrentMenuItem.id === "search") {
      navigate("/shop/search");
      if (onItemClick) onItemClick();
      return;
    }

    // ✅ FIX 2: Handle products (show all) vs specific categories
    if (getCurrentMenuItem.id === "products") {
      // Show all products - clear filters
      sessionStorage.removeItem("filters");
      navigate("/shop/listing");
      if (onItemClick) onItemClick();
      return;
    }

    // ✅ FIXED: Category mapping and ADDITIVE filtering
    const categoryFilters = {
      bestseller: "best sellers",
      bridal: "bridal",
      formals: "formals",
      Partywear: "Partywear",
      casual: "casual",
      reception: "reception",
    };

    const filterCategoryId = categoryFilters[getCurrentMenuItem.id];

    if (filterCategoryId) {
      // ✅ FIXED: Get existing filters and ADD to category array instead of replacing
      try {
        const existingFilters = JSON.parse(
          sessionStorage.getItem("filters") || "{}"
        );
        const existingCategories = existingFilters.category || [];

        // ✅ FIXED: Add category if not already selected, or replace if clicking same category
        let newCategories;
        if (existingCategories.includes(filterCategoryId)) {
          // Category already selected - just navigate (don't duplicate)
          newCategories = existingCategories;
        } else {
          // Add new category to existing ones
          newCategories = [...existingCategories, filterCategoryId];
        }

        const newFilters = {
          ...existingFilters,
          category: newCategories,
        };

        sessionStorage.setItem("filters", JSON.stringify(newFilters));

        // ✅ FIXED: Create proper comma-separated URL
        const queryString = `category=${newCategories
          .map((cat) => encodeURIComponent(cat))
          .join(",")}`;
        navigate(`/shop/listing?${queryString}`);

      } catch (error) {
        console.error("❌ Error updating filters:", error);
        // Fallback to single category
        const newFilters = { category: [filterCategoryId] };
        sessionStorage.setItem("filters", JSON.stringify(newFilters));
        navigate(
          `/shop/listing?category=${encodeURIComponent(filterCategoryId)}`
        );
      }
    } else {
      navigate(getCurrentMenuItem.path);
    }

    if (onItemClick) onItemClick();
  }

  // ✅ FIX 8: Improved active state detection
  const isActive = (menuItem) => {
    if (menuItem.id === "home") {
      return location.pathname === "/shop/home" || location.pathname === "/";
    }

    if (menuItem.id === "search") {
      return location.pathname === "/shop/search";
    }

    if (menuItem.id === "products") {
      return (
        location.pathname === "/shop/listing" && !searchParams.get("category")
      );
    }

    // For category items, check if that category is selected in URL
    if (location.pathname === "/shop/listing") {
      const categoryParam = searchParams.get("category");

      // ✅ FIX 9: Handle the bestseller mapping correctly
      if (menuItem.id === "bestseller") {
        return categoryParam === "best sellers";
      }

      return categoryParam === menuItem.id;
    }

    return false;
  };

  return (
    <nav
      className={`
      flex flex-col gap-2
      ${isMobile ? "w-full" : "lg:flex-row lg:items-center lg:gap-6"}
    `}
      role="navigation"
      aria-label={isMobile ? "Mobile navigation menu" : "Main navigation menu"}
    >
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className={`
            text-base font-medium cursor-pointer
            transition-all duration-200 ease-in-out
            hover:text-[#6C3D1D] hover:scale-105
            ${
              isMobile ? "py-3 px-4 rounded-lg hover:bg-gray-100 text-left" : ""
            }
            ${
              isActive(menuItem)
                ? "text-[#6C3D1D] font-bold border-b-2 border-[#6C3D1D]"
                : "text-gray-700"
            }
          `}
          role="button"
          tabIndex={0}
          aria-label={`Navigate to ${menuItem.label}`}
          aria-current={isActive(menuItem) ? "page" : undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNavigate(menuItem);
            }
          }}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// Mobile header right content (cart and account buttons)
function MobileHeaderActions() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const cartItemCount = cartItems?.items?.length || 0;

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Mobile user actions"
    >
      {/* Mobile Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:scale-105 transition-transform"
          aria-label={`Shopping cart with ${cartItemCount} items`}
          aria-describedby={cartItemCount > 0 ? "cart-badge" : undefined}
        >
          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
          {cartItemCount > 0 && (
            <span
              id="cart-badge"
              className="absolute -top-1 -right-1 bg-[#6C3D1D] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
              aria-label={`${cartItemCount} items in cart`}
              role="status"
            >
              {cartItemCount}
            </span>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {/* Mobile Account Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover:scale-105 transition-transform"
            aria-label={`Account menu for ${user?.userName || "User"}`}
          >
            <Avatar className="w-5 h-5">
              <AvatarFallback
                className="bg-[#6C3D1D] text-white text-xs"
                aria-label={`User avatar for ${user?.userName || "User"}`}
              >
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Account menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48" role="menu">
          <DropdownMenuLabel className="text-center text-xs">
            {user?.userName || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer text-sm"
            role="menuitem"
            aria-label="Go to account page"
          >
            <UserCog className="mr-2 h-4 w-4" aria-hidden="true" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 text-sm"
            role="menuitem"
            aria-label="Sign out of account"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Desktop header right content
function DesktopHeaderActions() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const cartItemCount = cartItems?.items?.length || 0;

  return (
    <div
      className="flex items-center gap-4"
      role="group"
      aria-label="Desktop user actions"
    >
      {/* Desktop Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:scale-105 hover:shadow-md transition-all duration-200"
          aria-label={`Shopping cart with ${cartItemCount} items`}
          aria-describedby={
            cartItemCount > 0 ? "desktop-cart-badge" : undefined
          }
        >
          <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          {cartItemCount > 0 && (
            <span
              id="desktop-cart-badge"
              className="absolute -top-2 -right-2 bg-[#6C3D1D] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              aria-label={`${cartItemCount} items in cart`}
              role="status"
            >
              {cartItemCount}
            </span>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items || []}
        />
      </Sheet>

      {/* Desktop Account Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="hover:scale-105 transition-all duration-200 p-2"
            aria-label={`Account menu for ${user?.userName || "User"}`}
          >
            <Avatar className="bg-black w-8 h-8">
              <AvatarFallback
                className="bg-black text-white font-extrabold text-sm"
                aria-label={`User avatar for ${user?.userName || "User"}`}
              >
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          className="w-56"
          align="end"
          role="menu"
        >
          <DropdownMenuLabel className="text-center">
            Logged in as {user?.userName || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer"
            role="menuitem"
            aria-label="Go to account page"
          >
            <UserCog className="mr-2 h-4 w-4" aria-hidden="true" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600"
            role="menuitem"
            aria-label="Sign out of account"
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <header
      className="sticky top-0 z-40 w-full border-b bg-[#C4BA97] shadow-sm"
      role="banner"
    >
      <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/shop/home"
          className="flex items-center gap-2 flex-shrink-0"
          aria-label="Darzie's Couture - Go to homepage"
        >
          <img
            src="https://res.cloudinary.com/dpxiwelxk/image/upload/v1754385089/Logo_lzbe32.svg"
            alt="Darzie's Couture Logo"
            className="h-32 w-32 md:h-40 md:w-40 lg:h-44 lg:w-44 object-contain"
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:block">
          {isAuthenticated ? <DesktopHeaderActions /> : null}
        </div>

        {/* Mobile Actions - Cart & Account */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && <MobileHeaderActions />}

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:scale-105 transition-transform"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <Menu className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-sm p-0"
              id="mobile-navigation"
              aria-label="Mobile navigation menu"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <Link
                  to="/shop/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                  aria-label="Darzie's Couture - Go to homepage"
                >
                  <img
                    src="https://res.cloudinary.com/dpxiwelxk/image/upload/v1754385089/Logo_lzbe32.svg"
                    alt="Darzie's Couture"
                    className="h-8 w-8"
                  />
                  <span className="font-bold text-[#6C3D1D]">
                    Darzie&apos;s Couture
                  </span>
                </Link>
              </div>

              {/* Mobile Menu Navigation */}
              <div className="flex-1 px-4 py-6">
                <MenuItems
                  onItemClick={() => setIsMobileMenuOpen(false)}
                  isMobile={true}
                />
              </div>

              {/* Mobile Menu Footer with User Info */}
              {isAuthenticated && (
                <div
                  className="p-4 border-t bg-gray-50"
                  role="region"
                  aria-label="User account information"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Avatar className="w-8 h-8 bg-[#6C3D1D]">
                        <AvatarFallback
                          className="bg-[#6C3D1D] text-white text-sm"
                          aria-label={`User avatar for ${
                            user?.userName || "User"
                          }`}
                        >
                          {user?.userName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">
                        {user?.userName || "User"}
                      </span>
                    </div>
                    <div
                      className="flex gap-2 justify-center"
                      role="group"
                      aria-label="Account actions"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setTimeout(() => navigate("/shop/account"), 100);
                        }}
                        className="flex-1"
                        aria-label="Go to account page"
                      >
                        <UserCog className="w-4 h-4 mr-1" aria-hidden="true" />
                        Account
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          dispatch(logoutUser());
                        }}
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        aria-label="Sign out of account"
                      >
                        <LogOut className="w-4 h-4 mr-1" aria-hidden="true" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
