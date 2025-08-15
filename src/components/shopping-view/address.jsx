// src/components/shopping-view/address.jsx - ENHANCED WITH VALIDATION
import { useEffect, useState, useCallback } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { AlertCircle, CheckCircle, MapPin, Plus } from "lucide-react";
import { Button } from "../ui/button";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  // Enhanced address form controls with validation
  const enhancedAddressControls = [
    {
      ...addressFormControls[0], // address
      required: true,
      helpText:
        "Enter your complete street address including house/flat number",
    },
    {
      ...addressFormControls[1], // city
      required: true,
      helpText: "Enter your city name",
    },
    {
      ...addressFormControls[2], // pincode
      required: true,
      helpText: "Enter valid 6-digit postal code",
    },
    {
      ...addressFormControls[3], // phone
      required: true,
      helpText: "Enter 10-digit mobile number for delivery updates",
    },
    {
      ...addressFormControls[4], // notes
      required: false,
      helpText: "Optional: Add landmark or delivery instructions",
      maxLength: 200,
    },
  ];

  // Check for duplicate addresses
  const checkDuplicateAddress = useCallback(
    (newAddress) => {
      if (!addressList || addressList.length === 0) return false;

      return addressList.some((existingAddress) => {
        if (currentEditedId && existingAddress._id === currentEditedId) {
          return false; // Skip current address being edited
        }

        return (
          existingAddress.address.toLowerCase().trim() ===
            newAddress.address.toLowerCase().trim() &&
          existingAddress.city.toLowerCase().trim() ===
            newAddress.city.toLowerCase().trim() &&
          existingAddress.pincode === newAddress.pincode
        );
      });
    },
    [addressList, currentEditedId]
  );

  // Validate Indian pincode format
  const validatePincode = useCallback((pincode) => {
    const indianPincodeRegex = /^[1-9][0-9]{5}$/;
    return indianPincodeRegex.test(pincode);
  }, []);

  // Validate Indian phone number
  const validatePhoneNumber = useCallback((phone) => {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    return indianPhoneRegex.test(phone);
  }, []);

  const handleManageAddress = useCallback(
    async (event) => {
      event.preventDefault();
      setValidationError("");
      setIsSubmitting(true);

      try {
        // Additional validation
        if (!validatePincode(formData.pincode)) {
          throw new Error("Please enter a valid 6-digit Indian pincode");
        }

        if (!validatePhoneNumber(formData.phone)) {
          throw new Error(
            "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
          );
        }

        // Check address limit for new addresses
        if (addressList.length >= 3 && currentEditedId === null) {
          throw new Error(
            "You can add maximum 3 addresses. Please delete an existing address to add a new one."
          );
        }

        // Check for duplicate addresses
        if (checkDuplicateAddress(formData)) {
          throw new Error(
            "This address already exists. Please enter a different address."
          );
        }

        const addressData = {
          ...formData,
          address: formData.address.trim(),
          city: formData.city.trim(),
          notes: formData.notes.trim(),
        };

        let result;
        if (currentEditedId !== null) {
          // Edit existing address
          result = await dispatch(
            editaAddress({
              userId: user?.id,
              addressId: currentEditedId,
              formData: addressData,
            })
          ).unwrap();
        } else {
          // Add new address
          result = await dispatch(
            addNewAddress({
              ...addressData,
              userId: user?.id,
            })
          ).unwrap();
        }

        if (result.success) {
          await dispatch(fetchAllAddresses(user?.id));
          resetForm();
          setShowSuccessMessage(true);

          toast({
            title: currentEditedId
              ? "Address Updated! ✅"
              : "Address Added! ✅",
            description: currentEditedId
              ? "Your address has been updated successfully"
              : "New address has been added to your account",
            duration: 3000,
          });

          // Hide success message after delay
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } else {
          throw new Error(result.message || "Failed to save address");
        }
      } catch (error) {
        const errorMessage =
          error.message || "Failed to save address. Please try again.";
        setValidationError(errorMessage);

        toast({
          title: "Address Error",
          description: errorMessage,
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      currentEditedId,
      user?.id,
      addressList.length,
      dispatch,
      toast,
      validatePincode,
      validatePhoneNumber,
      checkDuplicateAddress,
    ]
  );

  const handleDeleteAddress = useCallback(
    async (getCurrentAddress) => {
      try {
        const result = await dispatch(
          deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
        ).unwrap();

        if (result.success) {
          await dispatch(fetchAllAddresses(user?.id));
          toast({
            title: "Address Deleted ✅",
            description: "Address has been removed from your account",
            duration: 3000,
          });
        }
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete address. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
    [dispatch, user?.id, toast]
  );

  const handleEditAddress = useCallback((getCurrentAddress) => {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      phone: getCurrentAddress?.phone || "",
      pincode: getCurrentAddress?.pincode || "",
      notes: getCurrentAddress?.notes || "",
    });
    setShowForm(true);
    setValidationError("");
  }, []);

  const resetForm = useCallback(() => {
    setCurrentEditedId(null);
    setFormData(initialAddressFormData);
    setShowForm(false);
    setValidationError("");
    setShowSuccessMessage(false);
  }, []);

  const isFormValid = useCallback(() => {
    return (
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.pincode.trim() !== "" &&
      validatePincode(formData.pincode) &&
      validatePhoneNumber(formData.phone)
    );
  }, [formData, validatePincode, validatePhoneNumber]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="space-y-6">
      {/* Address List */}
      {addressList && addressList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Saved Addresses ({addressList.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addressList.map((singleAddressItem) => (
                <AddressCard
                  key={singleAddressItem._id}
                  selectedId={selectedId}
                  handleDeleteAddress={handleDeleteAddress}
                  addressInfo={singleAddressItem}
                  handleEditAddress={handleEditAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Address Button */}
      {!showForm && addressList.length < 3 && (
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={() => setShowForm(true)}
              className="w-full h-16 border-2 border-dashed border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Address
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Address Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {currentEditedId !== null ? "Edit Address" : "Add New Address"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Address Limit Warning */}
            {addressList.length >= 3 && currentEditedId === null && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 font-medium">
                      Address Limit Reached
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      You can only have 3 addresses. Delete an existing address
                      to add a new one.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Error */}
            {validationError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">Validation Error</p>
                    <p className="text-red-700 text-sm mt-1">
                      {validationError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Guidelines */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Address Guidelines
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>
                  • Provide complete street address with house/flat number
                </li>
                <li>• Enter valid 6-digit pincode for your area</li>
                <li>• Use 10-digit mobile number for delivery updates</li>
                <li>• Add landmarks in notes to help delivery personnel</li>
              </ul>
            </div>

            {/* Address Form */}
            <CommonForm
              formControls={enhancedAddressControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={
                currentEditedId !== null ? "Update Address" : "Save Address"
              }
              onSubmit={handleManageAddress}
              isBtnDisabled={!isFormValid() || isSubmitting}
              showSuccessMessage={showSuccessMessage}
              successMessage={
                currentEditedId
                  ? "Address updated successfully!"
                  : "New address added successfully!"
              }
              onSuccessClose={() => setShowSuccessMessage(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {addressList.length === 0 && !showForm && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Addresses Added
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first delivery address to continue shopping
            </p>
            <Button onClick={() => setShowForm(true)} className="px-8">
              <Plus className="w-4 h-4 mr-2" />
              Add First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Address;
