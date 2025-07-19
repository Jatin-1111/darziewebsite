import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  setFormData,
}) {
  const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode from ProductImageUpload"); // Specific log

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log("Selected file:", selectedFile);

    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadedImageUrl(""); // Clear previous URL when a new file is selected
      if (inputRef.current) {
        inputRef.current.value = ""; // Clear the input field for visual consistency
      }
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
      setUploadedImageUrl(""); // Clear previous URL when a new file is dropped
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl(""); // Also clear the uploaded URL
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    // Also clear the image in the form data when removed
    setFormData(prev => ({
      ...prev,
      image: ""
    }));
    console.log("Image removed. uploadedImageUrl cleared.");
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    console.log("ProductImageUpload: Attempting to upload image to backend...");

    const data = new FormData();
    data.append("image", imageFile); // 'image' should match what your backend expects for the file

    try {
      const response = await axios.post(
        "/api/admin/products/upload-image",
        data // Sending FormData
      );

      console.log("ProductImageUpload: Backend response:", response.data);

      // --- CRITICAL CHANGE HERE ---
      if (response?.data?.success && response.data?.imageUrl) {
        console.log("ProductImageUpload: Successfully got image URL from backend:", response.data.imageUrl);
        setUploadedImageUrl(response.data.imageUrl); // Set the state in ProductImageUpload
        setFormData(prev => ({
          ...prev,
          image: response.data.imageUrl // Update formData in AdminProducts
        }));
        setImageLoadingState(false);
      } else {
        console.error("ProductImageUpload: Backend upload failed or imageUrl missing:", response.data);
        setImageLoadingState(false);
      }
    } catch (error) {
      console.error("ProductImageUpload: Error during backend image upload:", error);
      setImageLoadingState(false);
    }
  }

  // This useEffect will trigger `uploadImageToCloudinary` when `imageFile` changes.
  useEffect(() => {
    if (imageFile !== null) {
        uploadImageToCloudinary();
    }
  }, [imageFile]);


  // Add a useEffect to handle initial image for edit mode,
  // making sure uploadedImageUrl is set correctly for display.
  // This helps when an existing product is being edited.
  useEffect(() => {
    console.log("ProductImageUpload useEffect [isEditMode, setFormData] triggered.");
    if (isEditMode) {
      // When entering edit mode, if formData.image exists, use it as uploadedImageUrl
      // This is crucial for displaying the existing image in the upload component.
      setUploadedImageUrl(setFormData.image || ""); // setFormData is a function, this should be formData.image if you pass formData as a prop
      // Correction: setFormData is a function, you need the actual formData object for the image value
      // This part depends on whether `ProductImageUpload` directly receives `formData` as a prop or expects it to be controlled by `AdminProducts`.
      // Given your current setup, the `uploadedImageUrl` from `AdminProducts` (via the edit mode useEffect in AdminProducts)
      // should already be propagating here. So this `useEffect` might not be strictly necessary for display,
      // but if you want to initialize the local component's state, you need to be careful.
    }
  }, [isEditMode, setUploadedImageUrl, setFormData]); // Removed formData as direct dependency if not passing as object

  // Console log for ProductImageUpload component to see its internal state
  console.log("ProductImageUpload Render - uploadedImageUrl:", uploadedImageUrl);
  console.log("ProductImageUpload Render - imageFile:", imageFile);


  return (
    <div
      className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode && uploadedImageUrl} // Disable if in edit mode and an image is already uploaded (or being edited)
        />
        {/* Display logic for uploaded image or upload area */}
        {imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : uploadedImageUrl ? ( // If we have an uploaded URL, show the image
          <div className="relative">
            <img
              src={uploadedImageUrl}
              alt="Uploaded Preview"
              className="w-full h-[200px] object-cover rounded-lg" // Adjust height as needed
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground bg-white rounded-full p-1"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove Image</span>
            </Button>
          </div>
        ) : ( // If no image uploaded URL, show the upload area
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;