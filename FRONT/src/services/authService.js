import axiosClient from "../api/axiosClient";

// Login
export const login = async (formData) => {
  try {
    const res = await axiosClient.post("/auth/login", formData);
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      (err.response?.data?.errors && err.response.data.errors.join(", ")) ||
      "Login failed!";
    throw new Error(msg);
  }
};

// Register
export const register = async (formData) => {
  try {
    const res = await axiosClient.post("/auth/register", formData);
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      (err.response?.data?.errors && err.response.data.errors.join(", ")) ||
      "Register failed!";
    throw new Error(msg);
  }
};



export const logout = async () => {
  try {
    const res = await axiosClient.post("/auth/logout");
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      "Logout failed!";
    throw new Error(msg);
  }
};


export const checkAuth = async () => {
  try {
    const res = await axiosClient.get("/auth/check");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Auth check failed");
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const res = await axiosClient.post("/auth/refresh");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Refresh failed");
  }
};