export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
    { id: "bridal", label: "Bridal" },
    { id: "formals", label: "Formals" },
    { id: "Partywear", label: "Partywear" },
    { id: "casual", label: "Casual" },
    { id: "reception", label: "Reception" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "bridal",
    label: "Bridal",
    path: "/shop/listing",
  },
  {
    id: "formals",
    label: "Formals",
    path: "/shop/listing",
  },
  {
    id: "Partywear",
    label: "Party wear",
    path: "/shop/listing",
  },
  {
    id: "casual",
    label: "Casual",
    path: "/shop/listing",
  },
  {
    id: "reception",
    label: "Reception",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
  {
    id: "bestseller",
    label: "Best Seller",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  bestseller:"Best Seller",
  bridal: "Bridal",
  formals: "Formals",
  partywear: "Partywear",
  casual: "Casual",
  reception: "Reception",
};

export const filterOptions = {
  category: [
    { id: "best sellers", label: "Best Sellers"},
    { id: "bridal", label: "Bridal" },
    { id: "formals", label: "Formals" },
    { id: "Partywear", label: "Partywear" },
    { id: "casual", label: "Casual" },
    { id: "reception", label: "Reception" },
  ],
  Price: [
    { id: 'under_1000', label: 'Under ₹1000' },
    { id: '1000_to_2000', label: '₹1,000 - ₹2,000' },
    { id: '2000_to_5000', label: '₹2,000 - ₹5,000' },
    { id: '5000_to_10000', label: '₹5,000 - ₹10,000' },
    { id: 'over_10000', label: 'Over ₹10,000' },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
