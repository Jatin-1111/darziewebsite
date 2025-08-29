// src/store/shop/products-slice/index.js - FIXED WITH 20 ITEMS PER PAGE 📄🔧
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";
import { API_ENDPOINTS } from "../../../config/api";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  // 🔥 UPDATED: Fixed pagination state with 20 items per page
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
    resultsPerPage: 20 // Fixed to 20 items per page
  }
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams, page = 1, limit = 20 }) => { // Default to 20
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page: page.toString(),
      limit: limit.toString() // Always 20
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
    // 🔥 UPDATED: Reset pagination with fixed values
    resetPagination: (state) => {
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNext: false,
        hasPrev: false,
        resultsPerPage: 20 // Always 20
      };
    },
    // 🔥 Set current page
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

        // 🔥 UPDATED: Handle pagination data from backend with fixed results per page
        if (action.payload.pagination) {
          state.pagination = {
            currentPage: action.payload.pagination.currentPage || 1,
            totalPages: action.payload.pagination.totalPages || 1,
            totalProducts: action.payload.pagination.totalProducts || 0,
            hasNext: action.payload.pagination.hasNext || false,
            hasPrev: action.payload.pagination.hasPrev || false,
            resultsPerPage: 20 // Always fixed to 20
          };
        } else {
          // Fallback if backend doesn't send pagination - calculate with 20 items per page
          const totalProducts = state.productList.length;
          const totalPages = Math.ceil(totalProducts / 20);

          state.pagination = {
            currentPage: 1,
            totalPages: Math.max(1, totalPages),
            totalProducts: totalProducts,
            hasNext: totalPages > 1,
            hasPrev: false,
            resultsPerPage: 20 // Always fixed to 20
          };
        }
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
        state.pagination = {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNext: false,
          hasPrev: false,
          resultsPerPage: 20 // Always fixed to 20
        };
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