import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils/apiClient";
import { tokenManager } from "../../utils/tokenManager";
import { API_ENDPOINTS } from "../../config/api";

const initialState = {
  isAuthenticated: false,
  isLoading: false, // ✅ Start with false, only true during actual operations
  user: null,
  token: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, formData);
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, formData);

    if (response.data.success && response.data.token) {
      tokenManager.setToken(response.data.token);
    }

    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { dispatch }) => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed, but continuing with local cleanup');
    } finally {
      tokenManager.removeToken();
      dispatch(clearAuth());
    }

    return { success: true };
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const token = tokenManager.getToken();

      if (!token || !tokenManager.isTokenValid(token)) {
        tokenManager.removeToken();
        return rejectWithValue({ success: false, message: "No valid token found" });
      }

      const response = await apiClient.get(API_ENDPOINTS.CHECK_AUTH, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });

      return response.data;
    } catch (error) {
      tokenManager.removeToken();
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
      state.token = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        tokenManager.setToken(action.payload);
      } else {
        tokenManager.removeToken();
      }
    },
    // ✅ SIMPLIFIED: Just check if token exists and set loading to false
    initializeAuth: (state) => {
      const token = tokenManager.getToken();
      state.token = token;
      state.isLoading = false; // ✅ Always set to false after initialization

      if (!token || !tokenManager.isTokenValid(token)) {
        state.isAuthenticated = false;
        state.user = null;
        if (token) tokenManager.removeToken(); // Clean invalid token
      }
    }
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
        if (action.payload.success) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.token = null;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        tokenManager.removeToken();
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.token = null;
          tokenManager.removeToken();
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        console.error("💥 Auth check failed - clearing auth state");
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { setUser, clearAuth, setToken, initializeAuth } = authSlice.actions;
export default authSlice.reducer;