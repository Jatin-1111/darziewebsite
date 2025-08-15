// src/pages/auth/login.jsx - ENHANCED WITH VALIDATION
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading } = useSelector((state) => state.auth);

  // Enhanced form controls with validation
  const enhancedLoginControls = [
    {
      ...loginFormControls[0], // email
      required: true,
      autoComplete: "email",
      helpText: "Enter the email address associated with your account",
    },
    {
      ...loginFormControls[1], // password
      required: true,
      autoComplete: "current-password",
      helpText: "Enter your account password",
    },
  ];

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoginError("");
      setIsLoading(true);

      try {
        const result = await dispatch(loginUser(formData)).unwrap();

        if (result.success) {
          // Show success message briefly
          setShowSuccessMessage(true);

          toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${result.user?.userName || "User"}!`,
            duration: 3000,
          });

          // Navigate after brief delay to show success message
          setTimeout(() => {
            const loggedInUser = result.user;
            if (loggedInUser?.role === "admin") {
              navigate("/admin/dashboard", { replace: true });
            } else {
              navigate("/shop/home", { replace: true });
            }
          }, 1500);
        } else {
          throw new Error(result.message || "Login failed");
        }
      } catch (error) {
        const errorMessage = error.message || "Login failed. Please try again.";
        setLoginError(errorMessage);

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, dispatch, navigate, toast]
  );

  return (
    <div className="font-josefin mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-gray-600">Sign in to your account to continue</p>
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            className="font-medium text-primary hover:underline transition-colors"
            to="/auth/register"
          >
            Create one here
          </Link>
        </p>
      </div>

      {/* Login Error Alert */}
      {loginError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Login Failed</p>
              <p className="text-red-700 text-sm mt-1">{loginError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Login Form */}
      <CommonForm
        formControls={enhancedLoginControls}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isBtnDisabled={authLoading || isLoading}
        showSuccessMessage={showSuccessMessage}
        successMessage="Login successful! Redirecting..."
        onSuccessClose={() => setShowSuccessMessage(false)}
      />

      {/* Additional Help */}
      <div className="text-center space-y-2">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-primary hover:underline transition-colors"
        >
          Forgot your password?
        </Link>
        <div className="text-xs text-gray-500">
          <p>Having trouble signing in?</p>
          <p>Contact support at support@darziescouture.com</p>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;
