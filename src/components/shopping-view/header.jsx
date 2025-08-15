// src/components/shopping-view/header.jsx - FIXED MOBILE HEADER
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
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);

    // Close mobile menu after navigation
    if (onItemClick) onItemClick();
  }

  const isActive = (menuItem) => {
    if (menuItem.id === "home" && location.pathname === "/shop/home")
      return true;
    if (menuItem.id === "products" && location.pathname === "/shop/listing")
      return true;
    if (location.pathname === "/shop/listing") {
      const category = searchParams.get("category");
      return category === menuItem.id;
    }
    return false;
  };

  return (
    <nav
      className={`
      flex flex-col gap-2
      ${isMobile ? "w-full" : "lg:flex-row lg:items-center lg:gap-6"}
    `}
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

  return (
    <div className="flex items-center gap-2">
      {/* Mobile Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:scale-105 transition-transform"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#6C3D1D] text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {cartItems.items.length}
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
          >
            <Avatar className="w-5 h-5">
              <AvatarFallback className="bg-[#6C3D1D] text-white text-xs">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Account menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-center text-xs">
            {user?.userName || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer text-sm"
          >
            <UserCog className="mr-2 h-4 w-4" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 text-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
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

  return (
    <div className="flex items-center gap-4">
      {/* Desktop Cart Button */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative hover:scale-105 hover:shadow-md transition-all duration-200"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#6C3D1D] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartItems.items.length}
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
          >
            <Avatar className="bg-black w-8 h-8">
              <AvatarFallback className="bg-black text-white font-extrabold text-sm">
                {user?.userName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56" align="end">
          <DropdownMenuLabel className="text-center">
            Logged in as {user?.userName || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-[#C4BA97] shadow-sm">
      <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://res.cloudinary.com/dpxiwelxk/image/upload/v1754385089/Logo_lzbe32.svg"
            alt="Darzie's Couture Logo"
            className="h-10 w-10 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain"
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
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <Link
                  to="/shop/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2"
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
