import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient, { tokenManager } from "../../utils/apiClient";
import { API_ENDPOINTS } from "../../config/api";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
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
      // Store token using token manager
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
      // Always clean up local storage using token manager
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

      if (!token) {
        return rejectWithValue({ success: false, message: "No token found" });
      }

      const response = await apiClient.get(API_ENDPOINTS.CHECK_AUTH, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });

      return response.data;
    } catch (error) {
      // If token is invalid, remove it using token manager
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
      tokenManager.removeToken();
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        tokenManager.setToken(action.payload);
      } else {
        tokenManager.removeToken();
      }
    },
    initializeAuth: (state) => {
      const token = tokenManager.getToken();
      if (token) {
        state.token = token;
        // checkAuth will be called to verify the token
      } else {
        state.isLoading = false;
        state.isAuthenticated = false;
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
      .addCase(checkAuth.rejected, (state, action) => {
        console.error("💥 Auth check failed:", action.payload || action.error.message);
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        tokenManager.removeToken();
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        // Token already removed in the thunk
      });
  },
});

export const { setUser, clearAuth, setToken, initializeAuth } = authSlice.actions;
export default authSlice.reducer;