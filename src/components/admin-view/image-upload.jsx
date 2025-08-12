import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { API_ENDPOINTS } from "../../config/api";

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

  console.log(isEditMode, "isEditMode from ProductImageUpload");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log("Selected file:", selectedFile);

    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadedImageUrl("");
      if (inputRef.current) {
        inputRef.current.value = "";
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
      setUploadedImageUrl("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    console.log("Image removed. uploadedImageUrl cleared.");
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    console.log("ProductImageUpload: Attempting to upload image to backend...");

    const data = new FormData();
    data.append("image", imageFile);

    try {
      const response = await axios.post(
        API_ENDPOINTS.ADMIN_UPLOAD_IMAGE, // Using environment config
        data
      );

      console.log("ProductImageUpload: Backend response:", response.data);

      if (response?.data?.success && response.data?.imageUrl) {
        console.log(
          "ProductImageUpload: Successfully got image URL from backend:",
          response.data.imageUrl
        );
        setUploadedImageUrl(response.data.imageUrl);
        setFormData((prev) => ({
          ...prev,
          image: response.data.imageUrl,
        }));
        setImageLoadingState(false);
      } else {
        console.error(
          "ProductImageUpload: Backend upload failed or imageUrl missing:",
          response.data
        );
        setImageLoadingState(false);
      }
    } catch (error) {
      console.error(
        "ProductImageUpload: Error during backend image upload:",
        error
      );
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  useEffect(() => {
    console.log(
      "ProductImageUpload useEffect [isEditMode, setFormData] triggered."
    );
    if (isEditMode) {
      setUploadedImageUrl(setFormData.image || "");
    }
  }, [isEditMode, setUploadedImageUrl, setFormData]);

  console.log(
    "ProductImageUpload Render - uploadedImageUrl:",
    uploadedImageUrl
  );
  console.log("ProductImageUpload Render - imageFile:", imageFile);

  return (
    <div
      className={`font-josefin w-full mt-4 ${
        isCustomStyling ? "" : "max-w-md mx-auto"
      }`}
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
          disabled={isEditMode && uploadedImageUrl}
        />
        {imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : uploadedImageUrl ? (
          <div className="relative">
            <img
              src={uploadedImageUrl}
              alt="Uploaded Preview"
              className="w-full h-[200px] object-cover rounded-lg"
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
        ) : (
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