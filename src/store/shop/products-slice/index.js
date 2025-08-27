// src/store/shop/products-slice/index.js - ENHANCED WITH PAGINATION 📄🔧
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";
import { API_ENDPOINTS } from "../../../config/api";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  // 🔥 NEW: Pagination state
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
    resultsPerPage: 24
  }
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page = 1, limit = 24 }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await apiClient.get(
      `${API_ENDPOINTS.SHOP_PRODUCTS_GET}?${query}`
    );
    return response.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.SHOP_PRODUCT_DETAILS(id));
    return response.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    // 🔥 NEW: Reset pagination
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
    // 🔥 NEW: Set current page
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];

        // 🔥 NEW: Handle pagination data from backend
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.pagination.currentPage || 1,
            totalPages: action.payload.pagination.totalPages || 1,
            totalProducts: action.payload.pagination.totalProducts || 0,
            hasNext: action.payload.pagination.hasNext || false,
            hasPrev: action.payload.pagination.hasPrev || false,
            resultsPerPage: action.payload.pagination.resultsPerPage || 24
          };
        } else {
          // Fallback if backend doesn't send pagination
          state.pagination = {
            currentPage: 1,
            totalPages: 1,
            totalProducts: state.productList.length,
            hasNext: false,
            hasPrev: false,
            resultsPerPage: state.productList.length
          };
        }
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
        state.pagination = initialState.pagination;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails, resetPagination, setCurrentPage } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;