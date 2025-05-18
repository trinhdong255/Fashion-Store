// user/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectUserId = (state) => state.user.user?.id || null;

// Action để tải thông tin người dùng từ API
export const fetchUserInfo = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch(clearUser());
      return;
    }

    const response = await axios.get(
      "http://localhost:8080/adamstore/v1/auth/myInfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // Sửa từ response.data.data thành response.data.result
    dispatch(setUser(response.data.result));
    console.log("User info set to Redux:", response.data.result); // Debug
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    dispatch(clearUser());
  }
};

export default userSlice.reducer;