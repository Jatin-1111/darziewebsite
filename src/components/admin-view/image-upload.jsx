// src/components/admin-view/image-upload.jsx - FIXED VERSION WITH ERROR HANDLING 🔧

import {
  UploadCloudIcon,
  XIcon,
  ImageIcon,
  PlusIcon,
  MoveIcon,
  AlertCircle,
  Wifi,
  RefreshCw,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";

// ✅ FIXED: Import the correct API function
import { API_ENDPOINTS } from "../../config/api";
import apiClient from "../../utils/apiClient";

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
  const [uploadErrors, setUploadErrors] = useState({});
  const [retryCount, setRetryCount] = useState({});
  const { toast } = useToast();
  const MAX_IMAGES = 5;
  const MAX_RETRIES = 3;

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

    if (!file) {
      throw new Error("No file provided");
    }

    if (!validTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type "${file.type}". Please upload JPEG, PNG, or WebP images.`
      );
    }

    if (file.size > maxSize) {
      throw new Error(
        `File "${file.name}" is too large (${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB). Please upload images smaller than 10MB.`
      );
    }

    return true;
  }, []);

  // Handle multiple file selection with better error handling
  const handleImageFilesChange = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files || []);

      if (selectedFiles.length === 0) return;

      // Clear previous errors
      setUploadErrors({});

      // Check total count
      const currentCount =
        uploadedImageUrls.filter((url) => url).length +
        imageFiles.filter((file) => file).length;
      const availableSlots = MAX_IMAGES - currentCount;

      if (selectedFiles.length > availableSlots) {
        toast({
          title: "Too many files",
          description: `You can only upload ${availableSlots} more image(s). Maximum ${MAX_IMAGES} images allowed.`,
          variant: "destructive",
        });
        return;
      }

      // Validate each file
      const validFiles = [];
      const invalidFiles = [];

      selectedFiles.forEach((file) => {
        try {
          validateFile(file);
          validFiles.push(file);
        } catch (error) {
          invalidFiles.push({ file: file.name, error: error.message });
        }
      });

      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid files detected",
          description: `${invalidFiles.length} file(s) were skipped due to validation errors.`,
          variant: "destructive",
        });
        console.error("Invalid files:", invalidFiles);
      }

      if (validFiles.length === 0) {
        return;
      }

      // Find empty slots and add files
      const newImageFiles = [...imageFiles];
      const newLoadingStates = [...imageLoadingStates];
      let fileIndex = 0;

      for (let i = 0; i < MAX_IMAGES && fileIndex < validFiles.length; i++) {
        if (!newImageFiles[i] && !uploadedImageUrls[i]) {
          newImageFiles[i] = validFiles[fileIndex];
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

      toast({
        title: "Files selected",
        description: `${validFiles.length} file(s) ready for upload.`,
      });
    },
    [
      imageFiles,
      imageLoadingStates,
      uploadedImageUrls,
      setImageFiles,
      setImageLoadingStates,
      validateFile,
      toast,
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
          toast({
            title: "Invalid file",
            description: error.message,
            variant: "destructive",
          });
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
      toast,
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

      // Clear any errors for this index
      setUploadErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });

      // Update form data
      if (setFormData) {
        setFormData((prev) => ({
          ...prev,
          image: newUploadedUrls.filter((url) => url),
        }));
      }

      toast({
        title: "Image removed",
        description: "Image has been removed from upload queue.",
      });
    },
    [
      imageFiles,
      uploadedImageUrls,
      imageLoadingStates,
      setImageFiles,
      setUploadedImageUrls,
      setImageLoadingStates,
      setFormData,
      toast,
    ]
  );

  // ✅ FIXED: Enhanced upload function with better error handling and retry logic
  const uploadImageToCloudinary = useCallback(
    async (file, index, isRetry = false) => {
      if (!file) return;

      const currentRetry = retryCount[index] || 0;

      // Clear any previous errors for this index
      setUploadErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });

      const newLoadingStates = [...imageLoadingStates];
      newLoadingStates[index] = true;
      setImageLoadingStates(newLoadingStates);

      // ✅ FIXED: Use FormData correctly
      const formData = new FormData();
      formData.append("image", file); // ✅ Changed from "images" to "image"

      try {

        // ✅ FIXED: Use apiClient with correct endpoint
        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN_UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000, // 30 second timeout
          }
        );

        if (response?.data?.success && response.data?.imageUrl) {
          const newUploadedUrls = [...uploadedImageUrls];
          newUploadedUrls[index] = response.data.imageUrl;
          setUploadedImageUrls(newUploadedUrls);

          // Clear the file from imageFiles since it's now uploaded
          const newImageFiles = [...imageFiles];
          newImageFiles[index] = null;
          setImageFiles(newImageFiles);

          // Reset retry count for this index
          setRetryCount((prev) => {
            const newCount = { ...prev };
            delete newCount[index];
            return newCount;
          });

          // Update form data
          if (setFormData) {
            setFormData((prev) => ({
              ...prev,
              image: newUploadedUrls.filter((url) => url),
            }));
          }

          toast({
            title: "Upload successful! ✅",
            description: `Image ${index + 1} uploaded successfully.`,
          });
        } else {
          throw new Error(
            response?.data?.message || "Upload failed - no image URL returned"
          );
        }
      } catch (error) {
        console.error(`❌ Upload error for image ${index + 1}:`, error);

        let errorMessage = "Upload failed";
        let canRetry = false;

        // ✅ BETTER ERROR HANDLING
        if (error.response) {
          // Server responded with error
          const status = error.response.status;
          const data = error.response.data;

          if (status === 413) {
            errorMessage = "File too large. Please choose a smaller image.";
          } else if (status === 400) {
            errorMessage = data?.message || "Invalid file format";
          } else if (status === 401) {
            errorMessage = "Authentication required. Please login again.";
          } else if (status >= 500) {
            errorMessage = "Server error. Please try again.";
            canRetry = true;
          } else {
            errorMessage = data?.message || `Server error (${status})`;
            canRetry = status !== 400; // Don't retry client errors
          }
        } else if (error.request) {
          // Network error
          errorMessage = "Network error. Please check your connection.";
          canRetry = true;
        } else {
          // Other error
          errorMessage = error.message || "Unknown error occurred";
          canRetry = true;
        }

        // Store error for this index
        setUploadErrors((prev) => ({
          ...prev,
          [index]: { message: errorMessage, canRetry },
        }));

        // Show retry option for network/server errors
        if (canRetry && currentRetry < MAX_RETRIES) {
          toast({
            title: `Upload failed (Attempt ${currentRetry + 1}/${
              MAX_RETRIES + 1
            })`,
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Upload failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        const finalLoadingStates = [...imageLoadingStates];
        finalLoadingStates[index] = false;
        setImageLoadingStates(finalLoadingStates);
      }
    },
    [
      imageLoadingStates,
      uploadedImageUrls,
      imageFiles,
      retryCount,
      setImageLoadingStates,
      setUploadedImageUrls,
      setImageFiles,
      setFormData,
      toast,
    ]
  );

  // Retry upload function
  const retryUpload = useCallback(
    (index) => {
      const file = imageFiles[index];
      if (!file) return;

      const currentRetry = retryCount[index] || 0;
      if (currentRetry >= MAX_RETRIES) {
        toast({
          title: "Max retries reached",
          description: `Cannot retry upload for image ${
            index + 1
          }. Please try a different file.`,
          variant: "destructive",
        });
        return;
      }

      setRetryCount((prev) => ({
        ...prev,
        [index]: currentRetry + 1,
      }));

      uploadImageToCloudinary(file, index, true);
    },
    [imageFiles, retryCount, uploadImageToCloudinary, toast]
  );

  // Auto-upload when files are added
  useEffect(() => {
    imageFiles.forEach((file, index) => {
      if (
        file &&
        !uploadedImageUrls[index] &&
        !imageLoadingStates[index] &&
        !uploadErrors[index]
      ) {
        uploadImageToCloudinary(file, index);
      }
    });
  }, [imageFiles]); // Only depend on imageFiles to avoid infinite loops

  // Upload all remaining images
  const uploadAllImages = useCallback(async () => {
    setGlobalLoading(true);

    const uploadPromises = imageFiles.map((file, index) => {
      if (file && !uploadedImageUrls[index] && !imageLoadingStates[index]) {
        return uploadImageToCloudinary(file, index);
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(uploadPromises);
      toast({
        title: "Batch upload completed",
        description: "All images have been processed.",
      });
    } catch (error) {
      console.error("Batch upload error:", error);
      toast({
        title: "Batch upload failed",
        description: "Some images may not have uploaded correctly.",
        variant: "destructive",
      });
    } finally {
      setGlobalLoading(false);
    }
  }, [
    imageFiles,
    uploadedImageUrls,
    imageLoadingStates,
    uploadImageToCloudinary,
    toast,
  ]);

  const uploadedCount = uploadedImageUrls.filter((url) => url).length;
  const pendingCount = imageFiles.filter((file) => file).length;
  const errorCount = Object.keys(uploadErrors).length;
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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {totalCount}/{MAX_IMAGES}
          </Badge>
          {errorCount > 0 && (
            <Badge variant="destructive" className="text-sm">
              {errorCount} errors
            </Badge>
          )}
        </div>
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
          const error = uploadErrors[index];

          return (
            <div
              key={index}
              className={`
                relative aspect-square border-2 border-dashed rounded-xl
                transition-all duration-200 ease-in-out
                ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                ${hasImage ? "border-solid border-gray-200" : ""}
                ${error ? "border-red-300 bg-red-50" : ""}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-600">Uploading...</p>
                  </div>
                </div>
              ) : error ? (
                /* Error State */
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl p-2">
                  <div className="text-center">
                    <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-xs text-red-600 mb-2">{error.message}</p>
                    {error.canRetry && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryUpload(index)}
                        className="text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    )}
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
                      <div className="animate-pulse bg-blue-500 h-6 w-6 rounded-full mx-auto mb-1"></div>
                      <p className="text-xs text-gray-600">
                        Ready to upload...
                      </p>
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

        {errorCount > 0 && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              Object.keys(uploadErrors).forEach((index) => {
                if (uploadErrors[index].canRetry) {
                  retryUpload(parseInt(index));
                }
              });
            }}
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Errors ({errorCount})
          </Button>
        )}
      </div>

      {/* Enhanced Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Upload Guidelines & Troubleshooting
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload 3-5 high-quality images for best results</li>
          <li>• First image will be the main product image</li>
          <li>• Supported formats: JPEG, PNG, WebP (max 10MB each)</li>
          <li>• Recommended resolution: 1200x1200px or higher</li>
          <li>
            • <strong>Network Issues?</strong> Check your internet connection
            and try again
          </li>
          <li>
            • <strong>Upload Failing?</strong> Try refreshing the page or
            contact support
          </li>
        </ul>

        {errorCount > 0 && (
          <div className="mt-3 p-2 bg-red-100 rounded border border-red-200">
            <p className="text-red-800 text-sm font-medium">
              <Wifi className="w-4 h-4 inline mr-1" />
              Having upload issues? This is usually due to:
            </p>
            <ul className="text-red-700 text-sm mt-1 ml-5">
              <li>• Slow or unstable internet connection</li>
              <li>• Server maintenance (try again in a few minutes)</li>
              <li>• File size too large (reduce to under 10MB)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
