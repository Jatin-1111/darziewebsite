// src/pages/auth/register.jsx - ENHANCED WITH VALIDATION
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Shield, User, Mail } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading: authLoading } = useSelector((state) => state.auth);

  // Calculate password strength
  const calculatePasswordStrength = useCallback((password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 4);
  }, []);

  // Enhanced form controls with validation
  const enhancedRegisterControls = [
    {
      ...registerFormControls[0], // userName
      required: true,
      autoComplete: "name",
      helpText: "Enter your full name (letters and spaces only)",
    },
    {
      ...registerFormControls[1], // email
      required: true,
      autoComplete: "email",
      helpText: "We'll use this email for updates",
    },
    {
      ...registerFormControls[2], // password
      required: true,
      autoComplete: "new-password",
      helpText: "Choose a strong password with at least 6 characters",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      componentType: "input",
      type: "password",
      required: true,
      autoComplete: "new-password",
      helpText: "Re-enter your password to confirm",
    },
  ];

  // Custom validation for registration
  const validateRegistrationData = useCallback(() => {
    const errors = [];

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (passwordStrength < 2) {
      errors.push(
        "Password is too weak. Use a mix of letters, numbers, and symbols"
      );
    }

    if (!formData.acceptTerms) {
      errors.push("You must accept the terms and conditions");
    }

    return errors;
  }, [formData, passwordStrength]);

  const handleFormDataChange = useCallback(
    (newFormData) => {
      setFormData(newFormData);

      // Update password strength when password changes
      if (newFormData.password !== formData.password) {
        const strength = calculatePasswordStrength(newFormData.password);
        setPasswordStrength(strength);
      }
    },
    [formData.password, calculatePasswordStrength]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setRegistrationError("");
      setIsLoading(true);

      // Custom validation
      const validationErrors = validateRegistrationData();
      if (validationErrors.length > 0) {
        setRegistrationError(validationErrors.join(". "));
        setIsLoading(false);
        return;
      }

      try {
        const registrationData = {
          userName: formData.userName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        };

        const result = await dispatch(registerUser(registrationData)).unwrap();

        if (result.success) {
          setShowSuccessMessage(true);

          toast({
            title: "Registration Successful! 🎉",
            description:
              "Your account has been created. Please sign in to continue.",
            duration: 5000,
          });

          // Navigate to login after showing success message
          setTimeout(() => {
            navigate("/auth/login", {
              state: {
                email: formData.email,
                message: "Account created successfully! Please sign in.",
              },
            });
          }, 2000);
        } else {
          throw new Error(result.message || "Registration failed");
        }
      } catch (error) {
        const errorMessage =
          error.message || "Registration failed. Please try again.";
        setRegistrationError(errorMessage);

        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, dispatch, navigate, toast, validateRegistrationData]
  );

  // Password strength indicator
  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
        return "bg-gray-200";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Enter a password";
      case 1:
        return "Very weak";
      case 2:
        return "Weak";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="font-josefin mx-auto w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="text-gray-600">Join Darzie&apos;s Couture family today</p>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            className="font-medium text-primary hover:underline transition-colors"
            to="/auth/login"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Registration Error Alert */}
      {registrationError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Registration Failed</p>
              <p className="text-red-700 text-sm mt-1">{registrationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <User className="w-4 h-4 mr-2" />
          Why Join Us?
        </h3>
        <ul className="space-y-2 text-xs text-gray-700">
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
            Exclusive access to new collections
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
            Personalized style recommendations
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
            Order tracking and history
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
            Special member discounts
          </li>
        </ul>
      </div>

      {/* Registration Form */}
      <div className="space-y-4">
        <CommonForm
          formControls={enhancedRegisterControls}
          buttonText="Create Account"
          formData={formData}
          setFormData={handleFormDataChange}
          onSubmit={handleSubmit}
          isBtnDisabled={authLoading || isLoading}
          showSuccessMessage={showSuccessMessage}
          successMessage="Account created successfully! Redirecting to login..."
          onSuccessClose={() => setShowSuccessMessage(false)}
        />

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Password Strength:</span>
              <span
                className={`text-xs font-medium ${
                  passwordStrength >= 3
                    ? "text-green-600"
                    : passwordStrength >= 2
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
                    level <= passwordStrength
                      ? getPasswordStrengthColor(passwordStrength)
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Password should contain:</p>
              <ul className="space-y-1 ml-4">
                <li
                  className={
                    formData.password.length >= 6
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  ✓ At least 6 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password)
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  ✓ One uppercase letter
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password)
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  ✓ One number
                </li>
                <li
                  className={
                    /[^A-Za-z0-9]/.test(formData.password)
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  ✓ One special character
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Confirm Password Match Indicator */}
        {formData.confirmPassword && (
          <div className="flex items-center space-x-2 text-sm">
            {formData.password === formData.confirmPassword ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Passwords do not match</span>
              </>
            )}
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  acceptTerms: e.target.checked,
                }))
              }
              className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              required
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              I agree to Darzie&apos;s Couture{" "}
              <Link
                to="/privacy-policy"
                target="_blank"
                className="text-primary hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                target="_blank"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>
      </div>

      {/* Additional Help */}
      <div className="text-center space-y-2">
        <div className="text-xs text-gray-500">
          <p>Need help with registration?</p>
          <p>Contact us at ragnigupta@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;
