import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: "", // Initialize as an empty string to be safe
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // This is where the Cloudinary URL lands
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // New useEffect to update formData.image when uploadedImageUrl changes
  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prevFormData) => {
        const newFormData = {
          ...prevFormData,
          image: uploadedImageUrl,
        };
        return newFormData;
      });
    }
  }, [uploadedImageUrl]);

  function onSubmit(event) {
    event.preventDefault();
    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData, // formData should now correctly include the image URL
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setUploadedImageUrl(""); // Clear uploaded image URL on success
            setImageFile(null); // Clear image file
            toast({
              title: "Product edited successfully", // More specific toast message
            });
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            // image: uploadedImageUrl, // This is now handled by the useEffect
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setUploadedImageUrl(""); // Clear uploaded image URL on success
            toast({
              title: "Product added successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    // Also include image check in form validity
    return (
      Object.keys(formData)
        .filter((currentKey) => currentKey !== "averageReview")
        .map((key) => formData[key] !== "")
        .every((item) => item) && formData.image !== ""
    ); // Ensure image is also not empty
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // When opening for edit, populate the image URL in formData and uploadedImageUrl state
  useEffect(() => {
    if (currentEditedId !== null && openCreateProductsDialog) {
      const productToEdit = productList.find(
        (product) => product._id === currentEditedId
      );
      if (productToEdit) {
        setFormData({
          image: productToEdit.image || "", // Ensure image is populated
          title: productToEdit.title,
          description: productToEdit.description,
          category: productToEdit.category,
          price: productToEdit.price,
          salePrice: productToEdit.salePrice,
          totalStock: productToEdit.totalStock,
          averageReview: productToEdit.averageReview,
        });
        setUploadedImageUrl(productToEdit.image || ""); // Populate uploadedImageUrl for image preview
      } else if (!openCreateProductsDialog) {
        // When closing the dialog, reset
        setFormData(initialFormData);
        setUploadedImageUrl("");
        setImageFile(null);
        setCurrentEditedId(null);
      }
    }
  }, [currentEditedId, openCreateProductsDialog, productList]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                setUploadedImageUrl={setUploadedImageUrl} // Pass setter for edit mode
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          // Use isOpen argument from onOpenChange
          setOpenCreateProductsDialog(isOpen);
          if (!isOpen) {
            // Only reset when closing
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrl(""); // Clear URL when dialog closes
            setImageFile(null); // Clear file when dialog closes
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
            setFormData={setFormData} // Still passing this for consistency if ProductImageUpload uses it
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
