// src/store/auth-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await axios.post(
      API_ENDPOINTS.REGISTER,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await axios.post(
      API_ENDPOINTS.LOGIN,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async () => {
    const response = await axios.post(
      API_ENDPOINTS.LOGOUT,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.CHECK_AUTH,
        {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      // 💀 THE BUG WAS HERE - Your backend returns success: false for unauthenticated users
      // but that's not an error, it's a valid response
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { success: false, message: "Network error" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        console.log("🔄 Auth check starting...");
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log("✅ Auth check completed:", action.payload);
        state.isLoading = false;
        if (action.payload.success) {
          console.log("🎉 User authenticated:", action.payload.user.userName);
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          console.log("❌ User not authenticated");
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        console.error("💥 Auth check failed:", action.payload || action.error.message);
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;