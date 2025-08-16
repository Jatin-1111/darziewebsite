// src/components/admin-view/image-upload.jsx - ULTRA ENHANCED MULTI-IMAGE SYSTEM 🔥
import {
  UploadCloudIcon,
  XIcon,
  ImageIcon,
  PlusIcon,
  MoveIcon,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { API_ENDPOINTS } from "../../config/api";
import { Badge } from "../ui/badge";

function ProductImageUpload({
  imageFiles = [],
  setImageFiles,
  imageLoadingStates = [],
  uploadedImageUrls = [],
  setUploadedImageUrls,
  setImageLoadingStates,
  isEditMode = false,
  setFormData,
}) {
  const inputRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const MAX_IMAGES = 5;

  // Initialize loading states array
  useEffect(() => {
    if (
      setImageLoadingStates &&
      Array.isArray(imageLoadingStates) &&
      imageLoadingStates.length === 0
    ) {
      setImageLoadingStates(new Array(MAX_IMAGES).fill(false));
    }
  }, [setImageLoadingStates, imageLoadingStates]);

  // Enhanced file validation
  const validateFile = useCallback((file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Please upload JPEG, PNG, or WebP images.`
      );
    }

    if (file.size > maxSize) {
      throw new Error(
        `File too large. Please upload images smaller than 10MB.`
      );
    }

    return true;
  }, []);

  // Handle multiple file selection
  const handleImageFilesChange = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files || []);

      if (selectedFiles.length === 0) return;

      // Check total count
      const currentCount =
        uploadedImageUrls.filter((url) => url).length +
        imageFiles.filter((file) => file).length;
      const availableSlots = MAX_IMAGES - currentCount;

      if (selectedFiles.length > availableSlots) {
        alert(
          `You can only upload ${availableSlots} more image(s). Maximum ${MAX_IMAGES} images allowed.`
        );
        return;
      }

      // Validate each file
      try {
        selectedFiles.forEach((file) => validateFile(file));
      } catch (error) {
        alert(error.message);
        return;
      }

      // Find empty slots and add files
      const newImageFiles = [...imageFiles];
      const newLoadingStates = [...imageLoadingStates];
      let fileIndex = 0;

      for (let i = 0; i < MAX_IMAGES && fileIndex < selectedFiles.length; i++) {
        if (!newImageFiles[i] && !uploadedImageUrls[i]) {
          newImageFiles[i] = selectedFiles[fileIndex];
          newLoadingStates[i] = false;
          fileIndex++;
        }
      }

      setImageFiles(newImageFiles);
      setImageLoadingStates(newLoadingStates);

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [
      imageFiles,
      imageLoadingStates,
      uploadedImageUrls,
      setImageFiles,
      setImageLoadingStates,
      validateFile,
    ]
  );

  // Enhanced drag and drop
  const handleDragOver = useCallback((event, index) => {
    event.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (event, index) => {
      event.preventDefault();
      setDragOverIndex(null);

      const droppedFiles = Array.from(event.dataTransfer.files || []);
      if (droppedFiles.length === 0) return;

      // If dropping on an empty slot, add single image
      if (
        !imageFiles[index] &&
        !uploadedImageUrls[index] &&
        droppedFiles.length === 1
      ) {
        try {
          validateFile(droppedFiles[0]);

          const newImageFiles = [...imageFiles];
          const newLoadingStates = [...imageLoadingStates];

          newImageFiles[index] = droppedFiles[0];
          newLoadingStates[index] = false;

          setImageFiles(newImageFiles);
          setImageLoadingStates(newLoadingStates);
        } catch (error) {
          alert(error.message);
        }
      } else {
        // Multiple files - use the general handler
        const fakeEvent = { target: { files: droppedFiles } };
        handleImageFilesChange(fakeEvent);
      }
    },
    [
      imageFiles,
      imageLoadingStates,
      uploadedImageUrls,
      setImageFiles,
      setImageLoadingStates,
      validateFile,
      handleImageFilesChange,
    ]
  );

  // Remove image
  const handleRemoveImage = useCallback(
    (index) => {
      const newImageFiles = [...imageFiles];
      const newUploadedUrls = [...uploadedImageUrls];
      const newLoadingStates = [...imageLoadingStates];

      newImageFiles[index] = null;
      newUploadedUrls[index] = "";
      newLoadingStates[index] = false;

      setImageFiles(newImageFiles);
      setUploadedImageUrls(newUploadedUrls);
      setImageLoadingStates(newLoadingStates);

      // Update form data
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          image: newUploadedUrls.filter((url) => url),
        }));
      }
    },
    [
      imageFiles,
      uploadedImageUrls,
      imageLoadingStates,
      setImageFiles,
      setUploadedImageUrls,
      setImageLoadingStates,
      setFormData,
    ]
  );

  // Upload single image to Cloudinary
  const uploadImageToCloudinary = useCallback(
    async (file, index) => {
      if (!file) return;

      const newLoadingStates = [...imageLoadingStates];
      newLoadingStates[index] = true;
      setImageLoadingStates(newLoadingStates);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          API_ENDPOINTS.ADMIN_UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response?.data?.success && response.data?.imageUrl) {
          const newUploadedUrls = [...uploadedImageUrls];
          newUploadedUrls[index] = response.data.imageUrl;
          setUploadedImageUrls(newUploadedUrls);

          // Update form data
          if (setFormData) {
            setFormData((prev) => ({
              ...prev,
              image: newUploadedUrls.filter((url) => url),
            }));
          }
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert(`Failed to upload image ${index + 1}. Please try again.`);
      } finally {
        const finalLoadingStates = [...imageLoadingStates];
        finalLoadingStates[index] = false;
        setImageLoadingStates(finalLoadingStates);
      }
    },
    [
      imageLoadingStates,
      uploadedImageUrls,
      setImageLoadingStates,
      setUploadedImageUrls,
      setFormData,
    ]
  );

  // Auto-upload when files are added
  useEffect(() => {
    imageFiles.forEach((file, index) => {
      if (file && !uploadedImageUrls[index] && !imageLoadingStates[index]) {
        uploadImageToCloudinary(file, index);
      }
    });
  }, [imageFiles]); // Only depend on imageFiles to avoid infinite loops

  // Upload all remaining images
  const uploadAllImages = useCallback(async () => {
    setGlobalLoading(true);

    const uploadPromises = imageFiles.map((file, index) => {
      if (file && !uploadedImageUrls[index]) {
        return uploadImageToCloudinary(file, index);
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Batch upload error:", error);
    } finally {
      setGlobalLoading(false);
    }
  }, [imageFiles, uploadedImageUrls, uploadImageToCloudinary]);

  // Reorder images (drag to reorder)
  const handleReorder = useCallback(
    (fromIndex, toIndex) => {
      if (fromIndex === toIndex) return;

      const newImageFiles = [...imageFiles];
      const newUploadedUrls = [...uploadedImageUrls];
      const newLoadingStates = [...imageLoadingStates];

      // Swap files
      [newImageFiles[fromIndex], newImageFiles[toIndex]] = [
        newImageFiles[toIndex],
        newImageFiles[fromIndex],
      ];
      [newUploadedUrls[fromIndex], newUploadedUrls[toIndex]] = [
        newUploadedUrls[toIndex],
        newUploadedUrls[fromIndex],
      ];
      [newLoadingStates[fromIndex], newLoadingStates[toIndex]] = [
        newLoadingStates[toIndex],
        newLoadingStates[fromIndex],
      ];

      setImageFiles(newImageFiles);
      setUploadedImageUrls(newUploadedUrls);
      setImageLoadingStates(newLoadingStates);

      // Update form data
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          image: newUploadedUrls.filter((url) => url),
        }));
      }
    },
    [
      imageFiles,
      uploadedImageUrls,
      imageLoadingStates,
      setImageFiles,
      setUploadedImageUrls,
      setImageLoadingStates,
      setFormData,
    ]
  );

  const uploadedCount = uploadedImageUrls.filter((url) => url).length;
  const pendingCount = imageFiles.filter((file) => file).length;
  const totalCount = uploadedCount + pendingCount;

  return (
    <div className="w-full mt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-semibold">Product Images</Label>
          <p className="text-sm text-gray-600 mt-1">
            Upload up to {MAX_IMAGES} high-quality images. First image will be
            the main product image.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {totalCount}/{MAX_IMAGES}
        </Badge>
      </div>

      {/* File Input (Hidden) */}
      <Input
        id="image-upload"
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImageFilesChange}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        disabled={isEditMode || totalCount >= MAX_IMAGES}
      />

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: MAX_IMAGES }, (_, index) => {
          const hasImage = uploadedImageUrls[index] || imageFiles[index];
          const isLoading = imageLoadingStates[index];
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={index}
              className={`
                relative aspect-square border-2 border-dashed rounded-xl
                transition-all duration-200 ease-in-out
                ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                ${hasImage ? "border-solid border-gray-200" : ""}
                ${
                  !hasImage && !isEditMode
                    ? "hover:border-gray-400 hover:bg-gray-50"
                    : ""
                }
              `}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Uploading...</p>
                  </div>
                </div>
              ) : uploadedImageUrls[index] ? (
                /* Uploaded Image */
                <div className="relative w-full h-full group">
                  <img
                    src={uploadedImageUrls[index]}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />

                  {/* Image Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                    <div className="flex gap-2">
                      {/* Reorder Handle */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/90 text-gray-700 hover:bg-white"
                        title="Drag to reorder"
                      >
                        <MoveIcon className="w-4 h-4" />
                      </Button>

                      {/* Remove Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="bg-red-500/90 hover:bg-red-600"
                        title="Remove image"
                      >
                        <XIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Primary Badge */}
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                      Main
                    </Badge>
                  )}
                </div>
              ) : imageFiles[index] ? (
                /* File Preview (Not Uploaded Yet) */
                <div className="relative w-full h-full">
                  <img
                    src={URL.createObjectURL(imageFiles[index])}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Skeleton className="h-6 w-6 rounded-full mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Processing...</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Slot */
                <Label
                  htmlFor="image-upload"
                  className={`
                    flex flex-col items-center justify-center h-full cursor-pointer
                    ${
                      isEditMode || totalCount >= MAX_IMAGES
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }
                  `}
                >
                  {index === 0 && totalCount === 0 ? (
                    <>
                      <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 text-center">
                        Main Image
                      </span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        Click or drag
                      </span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 text-center">
                        Add Image
                      </span>
                    </>
                  )}
                </Label>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={isEditMode || totalCount >= MAX_IMAGES}
          className="flex-1"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {totalCount === 0 ? "Choose Images" : "Add More Images"}
        </Button>

        {pendingCount > 0 && (
          <Button
            type="button"
            onClick={uploadAllImages}
            disabled={globalLoading}
            className="flex-1"
          >
            {globalLoading ? (
              <>
                <Skeleton className="w-4 h-4 mr-2" />
                Uploading All...
              </>
            ) : (
              <>
                <UploadCloudIcon className="w-4 h-4 mr-2" />
                Upload All ({pendingCount})
              </>
            )}
          </Button>
        )}
      </div>

      {/* Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Image Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload 3-5 high-quality images for best results</li>
          <li>• First image will be the main product image</li>
          <li>• Supported formats: JPEG, PNG, WebP (max 10MB each)</li>
          <li>• Recommended resolution: 1200x1200px or higher</li>
          <li>• Show different angles and details of your product</li>
        </ul>
      </div>
    </div>
  );
}

export default ProductImageUpload;
