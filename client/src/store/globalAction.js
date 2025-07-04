import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Utility for setting auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return `Bearer ${token}`;
};

// User Api

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { name, email, password } = userData;

      console.log("hello");

      const response = await axiosInstance.post(
        "/users/create",
        {
          name,
          email,
          password,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.log("err =>", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create User";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginUser = createAsyncThunk(
  "User/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const { email, password } = loginData;
      console.log(email, password);

      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      // Store token in localStorage if provided
      if (response.data.data.token) {
        localStorage.setItem("authToken", response.data.data.token);
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllUser = createAsyncThunk(
  "user/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/allusers", {
        headers: {
          Authorization: getAuthHeaders(),
        },
      });
      console.log("getAuthHeaders =>", getAuthHeaders());
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "getallUser failed";
      return rejectWithValue(errorMessage);
    }
  }
);
