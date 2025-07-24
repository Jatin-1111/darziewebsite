import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeLoginModal } from '../../../store/auth-slice/modal-slice.js'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui Button or similar
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Assuming shadcn/ui Dialog

const LoginRequiredModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoginModalOpen } = useSelector((state) => state.modal);

  // This handler is for when the dialog is closed by the user (e.g., clicking outside)
  // or programmatically. It ensures the Redux state is in sync.
  const handleClose = () => {
    dispatch(closeLoginModal());
  };

  const handleLoginRedirect = () => {
    dispatch(closeLoginModal()); // Close the modal before navigating
    navigate('/auth/login'); // Redirect to your login page
  };

  const handleRegisterRedirect = () => {
    dispatch(closeLoginModal()); // Close the modal before navigating
    navigate('/auth/register'); 
  };
  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-josefin text-2xl font-bold text-center text-gray-800">
            Login to Explore Further!
          </DialogTitle>
          <DialogDescription className="font-josefin text-center text-gray-600 mt-2">
            Unlock exclusive features, manage your account, and continue shopping.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="font-josefin text-center text-lg text-gray-700">
            Please log in or register to access this section of the website.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-4 mt-6">
          <Button
            className="font-josefin w-full sm:w-auto px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 border-black text-white hover:bg-black hover:text-white"
            onClick={handleLoginRedirect}
          >
            Log In
          </Button>
          <Button
            variant="outline" // Assuming you have an outline variant for buttons
            className="font-josefin w-full sm:w-auto px-6 py-3 rounded-md border-2 border-black text-black hover:bg-white hover:text-white transition-all duration-300"
            onClick={handleRegisterRedirect}
          >
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredModal;
