// src/components/common/form.jsx - ENHANCED WITH ACCESSIBILITY
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useId, useState, useCallback, useEffect } from "react";
import { CheckCircle, AlertCircle, Eye, EyeOff, Info } from "lucide-react";

// Validation rules
const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password must be at least 6 characters long",
  },
  userName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: "Name must contain only letters and spaces (2-50 characters)",
  },
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    message: "Please enter a valid 10-digit Indian phone number",
  },
  pincode: {
    required: true,
    pattern: /^[1-9][0-9]{5}$/,
    message: "Please enter a valid 6-digit pincode",
  },
  price: {
    required: true,
    min: 0,
    message: "Price must be a positive number",
  },
  totalStock: {
    required: true,
    min: 0,
    message: "Stock must be a non-negative number",
  },
};

// Enhanced input component with accessibility
function ValidatedInput({
  controlItem,
  value,
  onChange,
  onBlur,
  error,
  touched,
  inputId,
  showPassword,
  togglePassword,
}) {
  const hasError = touched && error;
  const isValid = touched && !error && value;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const helpId = controlItem.helpText ? `${inputId}-help` : undefined;

  return (
    <div className="relative">
      <Input
        id={inputId}
        name={controlItem.name}
        placeholder={controlItem.placeholder}
        type={
          controlItem.type === "password" && showPassword
            ? "text"
            : controlItem.type
        }
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-describedby={
          [errorId, helpId].filter(Boolean).join(" ") || undefined
        }
        aria-invalid={hasError ? "true" : "false"}
        aria-required={controlItem.required || false}
        autoComplete={controlItem.autoComplete}
        className={`
          pr-10 transition-all duration-200
          ${
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : isValid
              ? "border-green-500 focus:border-green-500 focus:ring-green-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }
        `}
      />

      {/* Password toggle */}
      {controlItem.type === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      )}

      {/* Validation icons */}
      {controlItem.type !== "password" && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {hasError && (
            <AlertCircle
              className="w-4 h-4 text-red-500"
              aria-hidden="true"
              role="presentation"
            />
          )}
          {isValid && (
            <CheckCircle
              className="w-4 h-4 text-green-500"
              aria-hidden="true"
              role="presentation"
            />
          )}
        </div>
      )}
    </div>
  );
}

// Enhanced select component with accessibility
function ValidatedSelect({
  controlItem,
  value,
  onChange,
  error,
  touched,
  inputId,
}) {
  const hasError = touched && error;
  const isValid = touched && !error && value;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const helpId = controlItem.helpText ? `${inputId}-help` : undefined;

  return (
    <div className="relative">
      <Select
        value={value}
        onValueChange={onChange}
        aria-describedby={
          [errorId, helpId].filter(Boolean).join(" ") || undefined
        }
        aria-invalid={hasError ? "true" : "false"}
        aria-required={controlItem.required || false}
      >
        <SelectTrigger
          id={inputId}
          className={`
            transition-all duration-200
            ${
              hasError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : isValid
                ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
          `}
          aria-label={controlItem.label}
        >
          <SelectValue
            placeholder={
              controlItem.placeholder || `Select ${controlItem.label}`
            }
          />
        </SelectTrigger>
        <SelectContent role="listbox">
          {controlItem.options && controlItem.options.length > 0
            ? controlItem.options.map((optionItem) => (
                <SelectItem
                  key={optionItem.id}
                  value={optionItem.id}
                  role="option"
                  aria-selected={value === optionItem.id}
                >
                  {optionItem.label}
                </SelectItem>
              ))
            : null}
        </SelectContent>
      </Select>

      {/* Validation icons */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {hasError && (
          <AlertCircle
            className="w-4 h-4 text-red-500"
            aria-hidden="true"
            role="presentation"
          />
        )}
        {isValid && (
          <CheckCircle
            className="w-4 h-4 text-green-500"
            aria-hidden="true"
            role="presentation"
          />
        )}
      </div>
    </div>
  );
}

// Enhanced textarea component with accessibility
function ValidatedTextarea({
  controlItem,
  value,
  onChange,
  onBlur,
  error,
  touched,
  inputId,
}) {
  const hasError = touched && error;
  const isValid = touched && !error && value;
  const errorId = hasError ? `${inputId}-error` : undefined;
  const helpId = controlItem.helpText ? `${inputId}-help` : undefined;

  return (
    <div className="relative">
      <Textarea
        id={inputId}
        name={controlItem.name}
        placeholder={controlItem.placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-describedby={
          [errorId, helpId].filter(Boolean).join(" ") || undefined
        }
        aria-invalid={hasError ? "true" : "false"}
        aria-required={controlItem.required || false}
        rows={controlItem.rows || 4}
        maxLength={controlItem.maxLength}
        className={`
          transition-all duration-200 resize-none
          ${
            hasError
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : isValid
              ? "border-green-500 focus:border-green-500 focus:ring-green-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          }
        `}
      />

      {/* Character count for textarea */}
      {controlItem.maxLength && (
        <div
          className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1"
          aria-label={`${value.length} of ${controlItem.maxLength} characters used`}
          role="status"
          aria-live="polite"
        >
          {value.length}/{controlItem.maxLength}
        </div>
      )}
    </div>
  );
}

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  formTitle,
  formDescription,
  showSuccessMessage,
  successMessage,
  onSuccessClose,
}) {
  const formId = useId();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState("");

  // Validation function
  const validateField = useCallback((name, value, rules) => {
    if (!rules) return "";

    if (rules.required && (!value || value.toString().trim() === "")) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      return rules.message || `Minimum ${rules.minLength} characters required`;
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`;
    }

    if (value && rules.min !== undefined && Number(value) < rules.min) {
      return rules.message || `Minimum value is ${rules.min}`;
    }

    if (value && rules.max !== undefined && Number(value) > rules.max) {
      return `Maximum value is ${rules.max}`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return rules.message || "Invalid format";
    }

    return "";
  }, []);

  // Real-time validation with announcements
  const handleFieldChange = useCallback(
    (fieldName, fieldValue) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: fieldValue,
      }));

      // Validate field if it has been touched
      if (touched[fieldName]) {
        const rules = validationRules[fieldName];
        const error = validateField(fieldName, fieldValue, rules);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error,
        }));
      }
    },
    [formData, touched, validateField, setFormData]
  );

  // Handle field blur for validation
  const handleFieldBlur = useCallback(
    (fieldName) => {
      setTouched((prev) => ({
        ...prev,
        [fieldName]: true,
      }));

      const rules = validationRules[fieldName];
      const error = validateField(fieldName, formData[fieldName], rules);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));

      // Announce validation result to screen readers
      if (error) {
        setAnnounceMessage(`Error in ${fieldName}: ${error}`);
      } else if (formData[fieldName]) {
        setAnnounceMessage(`${fieldName} is valid`);
      }
    },
    [formData, validateField]
  );

  // Toggle password visibility
  const togglePasswordVisibility = useCallback((fieldName) => {
    setShowPasswords((prev) => {
      const newState = {
        ...prev,
        [fieldName]: !prev[fieldName],
      };

      // Announce password visibility change
      setAnnounceMessage(
        `Password is now ${newState[fieldName] ? "visible" : "hidden"}`
      );

      return newState;
    });
  }, []);

  // Validate all fields
  const validateAllFields = useCallback(() => {
    const newErrors = {};
    const newTouched = {};

    formControls.forEach((control) => {
      newTouched[control.name] = true;
      const rules = validationRules[control.name];
      if (rules) {
        newErrors[control.name] = validateField(
          control.name,
          formData[control.name],
          rules
        );
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    const errorCount = Object.values(newErrors).filter((error) => error).length;
    if (errorCount > 0) {
      setAnnounceMessage(
        `Form has ${errorCount} validation errors. Please review and correct them.`
      );
    }

    return Object.values(newErrors).every((error) => !error);
  }, [formControls, formData, validateField]);

  // Enhanced form submission
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (isSubmitting) return;

      const isValid = validateAllFields();
      if (!isValid) {
        // Focus first error field
        const firstErrorField = formControls.find(
          (control) => errors[control.name] && touched[control.name]
        );
        if (firstErrorField) {
          const errorElement = document.getElementById(
            `${formId}-${firstErrorField.name}`
          );
          errorElement?.focus();
        }
        return;
      }

      setIsSubmitting(true);
      setAnnounceMessage("Submitting form...");

      try {
        await onSubmit(event);
        setAnnounceMessage("Form submitted successfully");
      } catch (error) {
        console.error("Form submission error:", error);
        setAnnounceMessage("Form submission failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateAllFields,
      onSubmit,
      isSubmitting,
      formControls,
      errors,
      touched,
      formId,
    ]
  );

  // Check if form is valid
  const isFormValid = useCallback(() => {
    return formControls.every((control) => {
      const rules = validationRules[control.name];
      if (!rules) return true;
      return !validateField(control.name, formData[control.name], rules);
    });
  }, [formControls, formData, validateField]);

  function renderInputsByComponentType(getControlItem) {
    const inputId = `${formId}-${getControlItem.name}`;
    const value = formData[getControlItem.name] || "";
    const error = errors[getControlItem.name];
    const fieldTouched = touched[getControlItem.name];

    const commonProps = {
      controlItem: getControlItem,
      value,
      error,
      touched: fieldTouched,
      inputId,
    };

    switch (getControlItem.componentType) {
      case "input":
        return (
          <ValidatedInput
            {...commonProps}
            onChange={(event) =>
              handleFieldChange(getControlItem.name, event.target.value)
            }
            onBlur={() => handleFieldBlur(getControlItem.name)}
            showPassword={showPasswords[getControlItem.name]}
            togglePassword={() => togglePasswordVisibility(getControlItem.name)}
          />
        );

      case "select":
        return (
          <ValidatedSelect
            {...commonProps}
            onChange={(selectedValue) =>
              handleFieldChange(getControlItem.name, selectedValue)
            }
          />
        );

      case "textarea":
        return (
          <ValidatedTextarea
            {...commonProps}
            onChange={(event) =>
              handleFieldChange(getControlItem.name, event.target.value)
            }
            onBlur={() => handleFieldBlur(getControlItem.name)}
          />
        );

      default:
        return (
          <ValidatedInput
            {...commonProps}
            onChange={(event) =>
              handleFieldChange(getControlItem.name, event.target.value)
            }
            onBlur={() => handleFieldBlur(getControlItem.name)}
          />
        );
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announceMessage}
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <CheckCircle
              className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className="text-green-800 font-medium">Success!</p>
              <p className="text-green-700 text-sm mt-1">
                {successMessage || "Operation completed successfully"}
              </p>
            </div>
            {onSuccessClose && (
              <button
                onClick={onSuccessClose}
                className="text-green-500 hover:text-green-700 ml-2"
                aria-label="Close success message"
                type="button"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        role="form"
        aria-labelledby={formTitle ? `${formId}-title` : undefined}
        aria-describedby={formDescription ? `${formId}-description` : undefined}
        className="space-y-6"
        noValidate
      >
        {formTitle && (
          <div className="text-center">
            <h2
              id={`${formId}-title`}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              {formTitle}
            </h2>
            {formDescription && (
              <p id={`${formId}-description`} className="text-gray-600 text-sm">
                {formDescription}
              </p>
            )}
          </div>
        )}

        <fieldset className="space-y-5">
          <legend className="sr-only">{formTitle || "Form fields"}</legend>

          {formControls.map((controlItem) => {
            const inputId = `${formId}-${controlItem.name}`;
            const error = errors[controlItem.name];
            const fieldTouched = touched[controlItem.name];
            const hasError = fieldTouched && error;

            return (
              <div key={controlItem.name} className="space-y-2">
                <Label
                  htmlFor={inputId}
                  className="block text-sm font-medium text-gray-700"
                >
                  {controlItem.label}
                  {controlItem.required && (
                    <span
                      className="text-red-500 ml-1"
                      aria-label="required field"
                      role="presentation"
                    >
                      *
                    </span>
                  )}
                </Label>

                {renderInputsByComponentType(controlItem)}

                {/* Error Message */}
                {hasError && (
                  <div
                    id={`${inputId}-error`}
                    className="flex items-start space-x-2 text-sm text-red-600"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{error}</span>
                  </div>
                )}

                {/* Help Text */}
                {controlItem.helpText && !hasError && (
                  <div
                    id={`${inputId}-help`}
                    className="flex items-start space-x-2 text-xs text-gray-500"
                    role="note"
                  >
                    <Info
                      className="w-3 h-3 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span>{controlItem.helpText}</span>
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>

        <Button
          disabled={isBtnDisabled || isSubmitting || !isFormValid()}
          type="submit"
          className="w-full h-12 text-base font-medium transition-all duration-200 disabled:opacity-50"
          aria-describedby={`${formId}-submit-status`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                aria-hidden="true"
              />
              <span>Processing...</span>
            </div>
          ) : (
            buttonText || "Submit"
          )}
        </Button>

        <div
          id={`${formId}-submit-status`}
          className="sr-only"
          aria-live="polite"
        >
          {isSubmitting ? "Form is being submitted" : ""}
        </div>
      </form>
    </div>
  );
}

export default CommonForm;
