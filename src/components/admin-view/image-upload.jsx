// src/components/admin-view/image-upload.jsx - FIXED BATCH UPLOAD 🔥💥

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { API_ENDPOINTS } from "../../config/api";
import apiClient from "../../utils/apiClient";
import {
  UploadCloudIcon,
  XIcon,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Upload,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

function ProductImageUpload({
  imageFiles = [],
  setImageFiles,
  imageLoadingStates = [],
  uploadedImageUrls = [],
  setUploadedImageUrls,
  setImageLoadingStates,
  isEditMode = false,
  setFormData,
  existingImages = [],
}) {
  const inputRef = useRef(null);
  const [uploadErrors, setUploadErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const { toast } = useToast();
  const MAX_IMAGES = 5;

  // Initialize with existing images in edit mode
  useEffect(() => {
    if (
      isEditMode &&
      existingImages &&
      existingImages.length > 0 &&
      uploadedImageUrls.length === 0
    ) {
      const validExistingImages = existingImages.filter(
        (img) =>
          img &&
          typeof img === "string" &&
          img.trim() !== "" &&
          (img.startsWith("http") || img.startsWith("data:"))
      );

      if (validExistingImages.length > 0) {
        const initialUrls = [...validExistingImages];
        while (initialUrls.length < MAX_IMAGES) {
          initialUrls.push("");
        }

        setUploadedImageUrls(initialUrls);

        if (setImageLoadingStates) {
          setImageLoadingStates(new Array(MAX_IMAGES).fill(false));
        }
      }
    }
  }, [
    isEditMode,
    existingImages,
    setUploadedImageUrls,
    setImageLoadingStates,
    uploadedImageUrls.length,
  ]);

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

  // Handle file selection (NO auto-upload)
  const handleImageFilesChange = useCallback(
    (event) => {
      const selectedFiles = Array.from(event.target.files || []);

      if (selectedFiles.length === 0) return;

      // Clear previous errors
      setUploadErrors({});

      // Count current slots used
      const currentValidImages = uploadedImageUrls.filter(
        (url) => url && url.trim() !== ""
      ).length;
      const currentFiles = imageFiles.filter((file) => file !== null).length;
      const availableSlots = MAX_IMAGES - currentValidImages - currentFiles;

      if (selectedFiles.length > availableSlots) {
        toast({
          title: "Too many files",
          description: `You can only add ${availableSlots} more image(s). Maximum ${MAX_IMAGES} images allowed.`,
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

      // Add files to empty slots (no upload yet)
      const newImageFiles = [...imageFiles];
      const newLoadingStates = [...imageLoadingStates];
      let fileIndex = 0;

      for (let i = 0; i < MAX_IMAGES && fileIndex < validFiles.length; i++) {
        if (
          !newImageFiles[i] &&
          (!uploadedImageUrls[i] || uploadedImageUrls[i].trim() === "")
        ) {
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
        description: `${validFiles.length} file(s) ready for upload. Click "Upload Images" to proceed.`,
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

  // Remove image function
  const handleRemoveImage = useCallback(
    (index) => {
      const newImageFiles = [...imageFiles];
      const newUploadedUrls = [...uploadedImageUrls];
      const newLoadingStates = [...imageLoadingStates];

      // Clear the slot
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

      // Clear progress for this index
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });

      // Update form data with valid URLs only
      if (setFormData) {
        const validUrls = newUploadedUrls.filter(
          (url) => url && url.trim() !== ""
        );
        setFormData((prev) => ({
          ...prev,
          image: validUrls,
        }));
      }

      toast({
        title: "Image removed",
        description: "Image has been removed from the product.",
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

  // 🔥 FIXED: Batch upload ALL selected images at once
  const handleUploadAllImages = useCallback(async () => {
    const filesToUpload = imageFiles.filter((file) => file !== null);

    if (filesToUpload.length === 0) {
      toast({
        title: "No files to upload",
        description: "Please select images first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadErrors({});

    // Set loading states for files being uploaded
    const newLoadingStates = [...imageLoadingStates];
    imageFiles.forEach((file, index) => {
      if (file) {
        newLoadingStates[index] = true;
      }
    });
    setImageLoadingStates(newLoadingStates);

    // 🔥 MAGIC: Upload ALL files simultaneously using Promise.allSettled
    const uploadPromises = imageFiles.map(async (file, index) => {
      if (!file || uploadedImageUrls[index]) {
        return { index, success: true, url: uploadedImageUrls[index] }; // Skip already uploaded
      }

      try {
        setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

        const formData = new FormData();
        formData.append("image", file);

        const response = await apiClient.post(
          API_ENDPOINTS.ADMIN_UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prev) => ({
                ...prev,
                [index]: percentCompleted,
              }));
            },
          }
        );

        if (response?.data?.success && response.data?.imageUrl) {
          setUploadProgress((prev) => ({ ...prev, [index]: 100 }));
          return { index, success: true, url: response.data.imageUrl };
        } else {
          throw new Error(response?.data?.message || "Upload failed");
        }
      } catch (error) {
        console.error(`Upload error for image ${index + 1}:`, error);

        let errorMessage = "Upload failed";
        if (error.response?.status === 413) {
          errorMessage = "File too large";
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid file format";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Upload timeout";
        } else {
          errorMessage = error.message || "Upload failed";
        }

        return { index, success: false, error: errorMessage };
      }
    });

    try {
      // 💥 EXECUTE ALL UPLOADS AT ONCE
      const results = await Promise.allSettled(uploadPromises);

      let successCount = 0;
      let errorCount = 0;
      const newUploadedUrls = [...uploadedImageUrls];
      const newImageFiles = [...imageFiles];
      const newErrors = {};

      // Process all results
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          const { success, url, error } = result.value;

          if (success && url) {
            newUploadedUrls[index] = url;
            newImageFiles[index] = null; // Clear the file since it's uploaded
            successCount++;
          } else if (error) {
            newErrors[index] = { message: error };
            errorCount++;
          }
        } else {
          newErrors[index] = { message: "Upload failed" };
          errorCount++;
        }
      });

      // Update states
      setUploadedImageUrls(newUploadedUrls);
      setImageFiles(newImageFiles);
      setUploadErrors(newErrors);

      // Clear all loading states
      setImageLoadingStates(new Array(MAX_IMAGES).fill(false));

      // Update form data with all valid URLs
      if (setFormData) {
        const validUrls = newUploadedUrls.filter(
          (url) => url && url.trim() !== ""
        );
        setFormData((prev) => ({
          ...prev,
          image: validUrls,
        }));
      }

      // Show final result
      if (successCount > 0) {
        toast({
          title: `🚀 Batch Upload Complete!`,
          description: `${successCount} image(s) uploaded successfully${
            errorCount > 0 ? `, ${errorCount} failed` : ""
          }.`,
        });
      } else if (errorCount > 0) {
        toast({
          title: "Upload Failed",
          description: `All ${errorCount} upload(s) failed. Please try again.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Batch upload error:", error);
      toast({
        title: "Upload Error",
        description: "Something went wrong during batch upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  }, [
    imageFiles,
    uploadedImageUrls,
    imageLoadingStates,
    setImageFiles,
    setUploadedImageUrls,
    setImageLoadingStates,
    setFormData,
    toast,
  ]);

  // Calculate counts properly
  const uploadedCount = uploadedImageUrls.filter(
    (url) => url && url.trim() !== ""
  ).length;
  const stagedCount = imageFiles.filter((file) => file !== null).length; // Files ready to upload
  const errorCount = Object.keys(uploadErrors).length;
  const totalUsedSlots = uploadedCount + stagedCount;

  return (
    <div className="w-full mt-4 space-y-6">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Images</h3>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode
              ? "Update product images (existing images will be preserved)"
              : `Upload up to ${MAX_IMAGES} high-quality images`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            {uploadedCount} uploaded
            {stagedCount > 0 && `, ${stagedCount} ready`}
            {errorCount > 0 && `, ${errorCount} errors`}
            <span className="text-gray-400">
              {" "}
              • {uploadedCount + stagedCount}/{MAX_IMAGES} slots used
            </span>
          </div>
        </div>
      </div>

      {/* File Input */}
      <input
        id="image-upload"
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImageFilesChange}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        disabled={totalUsedSlots >= MAX_IMAGES}
      />

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: MAX_IMAGES }, (_, index) => {
          const hasImage =
            uploadedImageUrls[index] && uploadedImageUrls[index].trim() !== "";
          const hasFile = imageFiles[index];
          const isLoading = imageLoadingStates[index];
          const error = uploadErrors[index];
          const progress = uploadProgress[index];

          return (
            <div
              key={index}
              className={`
                relative aspect-square border-2 border-dashed rounded-xl
                transition-all duration-200 ease-in-out
                ${
                  hasImage || hasFile
                    ? "border-solid border-gray-200"
                    : "border-gray-300"
                }
                ${error ? "border-red-300 bg-red-50" : ""}
                ${
                  !hasImage && !hasFile
                    ? "hover:border-gray-400 hover:bg-gray-50"
                    : ""
                }
              `}
            >
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">
                      {progress ? `${progress}%` : "Uploading..."}
                    </p>
                    {progress && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-xl p-2">
                  <div className="text-center">
                    <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-xs text-red-600 mb-2">{error.message}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveImage(index)}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : hasImage ? (
                <div className="relative w-full h-full group">
                  <img
                    src={uploadedImageUrls[index]}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
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

                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}

                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                </div>
              ) : hasFile ? (
                <div className="relative w-full h-full">
                  <img
                    src={URL.createObjectURL(imageFiles[index])}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-blue-600 font-medium">
                        Ready to upload
                      </p>
                    </div>
                  </div>

                  {/* Remove file button */}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Remove file"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50 rounded-xl"
                >
                  {index === 0 && uploadedCount === 0 && stagedCount === 0 ? (
                    <>
                      <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 text-center">
                        Main Image
                      </span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        Click to add
                      </span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 text-center">
                        Add Image
                      </span>
                    </>
                  )}
                </label>
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
          disabled={totalUsedSlots >= MAX_IMAGES || isUploading}
          className="flex-1"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {totalUsedSlots === 0
            ? "Choose Images"
            : `Add More Images (${MAX_IMAGES - totalUsedSlots} slots left)`}
        </Button>

        {/* 🔥 FIXED: Single button that uploads ALL images at once */}
        {stagedCount > 0 && (
          <Button
            type="button"
            onClick={handleUploadAllImages}
            disabled={isUploading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading {stagedCount} images...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                🚀 Upload All {stagedCount} Image{stagedCount > 1 ? "s" : ""} at
                Once!
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {isEditMode && uploadedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-blue-800 font-medium">Edit Mode Active</p>
              <p className="text-blue-700 text-sm mt-1">
                {uploadedCount} image(s) loaded. You can add more images or
                remove existing ones.
              </p>
            </div>
          </div>
        </div>
      )}

      {stagedCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Upload className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-yellow-800 font-medium">
                🚀 Batch Upload Ready!
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                {stagedCount} image(s) selected. Click &quot;Upload All&quot; to
                upload them simultaneously!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
