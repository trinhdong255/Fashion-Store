import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/services/api/auth";

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
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Đồng bộ khi đăng nhập thành công
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log("Login fulfilled, user data:", action.payload);
        state.user = action.payload;
      }
    );

    // Đồng bộ khi lấy thông tin người dùng hiện tại
    builder.addMatcher(
      authApi.endpoints.getMyInfo.matchFulfilled,
      (state, action) => {
        console.log("getMyInfo fulfilled, user data:", action.payload);
        state.user = action.payload.result; // Đảm bảo lấy đúng result từ response
      }
    );

    // Đồng bộ khi cập nhật thông tin người dùng
    builder.addMatcher(
      authApi.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        console.log("updateUser fulfilled, user data:", action.payload);
        state.user = action.payload;
      }
    );
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectUserId = (state) => state.user.user?.id || null; // Thêm fallback null

export default userSlice.reducer;