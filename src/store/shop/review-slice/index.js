// src/store/shop/review-slice/index.js - UPDATED
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";
import { API_ENDPOINTS } from "../../../config/api";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata) => {
    const response = await apiClient.post(API_ENDPOINTS.SHOP_REVIEW_ADD, formdata);
    return response.data;
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.SHOP_REVIEW_GET(id));
    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;