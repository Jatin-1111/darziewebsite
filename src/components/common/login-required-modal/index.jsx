import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeLoginModal } from "../../../store/auth-slice/modal-slice.js"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui Button or similar
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Assuming shadcn/ui Dialog

const LoginRequiredModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoginModalOpen } = useSelector((state) => state.modal);

  const handleClose = () => {
    dispatch(closeLoginModal());
  };

  const handleLoginRedirect = () => {
    dispatch(closeLoginModal());
    navigate("/auth/login");
  };

  const handleRegisterRedirect = () => {
    dispatch(closeLoginModal());
    navigate("/auth/register");
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-josefin text-2xl font-bold text-center text-gray-800">
            🛒 Login to Add to Cart
          </DialogTitle>
          <DialogDescription className="font-josefin text-center text-gray-600 mt-2">
            Create an account or sign in to add items to your cart and start
            shopping!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="font-josefin text-center text-lg text-gray-700">
            Join thousands of happy customers and unlock:
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✅ Save items to your cart</li>
            <li>✅ Track your orders</li>
            <li>✅ Faster checkout</li>
            <li>✅ Exclusive member discounts</li>
          </ul>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-6">
          <Button
            className="font-josefin w-full sm:w-auto px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 bg-[#6C3D1D] text-white hover:bg-[#5A321A]"
            onClick={handleLoginRedirect}
          >
            Log In
          </Button>
          <Button
            variant="outline"
            className="font-josefin w-full sm:w-auto px-6 py-3 rounded-md border-2 border-[#6C3D1D] text-[#6C3D1D] hover:bg-[#6C3D1D] hover:text-white transition-all duration-300"
            onClick={handleRegisterRedirect}
          >
            Create Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredModal;
