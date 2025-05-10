import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectUserId } from "../user/reducer";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    cartTotalQuantity: 0, // Sẽ đếm số lượng mục khác biệt (cartItems.length)
    cartTotalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productVariantId === newItem.productVariantId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }

      state.cartTotalQuantity = state.cartItems.length;
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);

      state.cartTotalQuantity = state.cartItems.length;
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        state.cartTotalAmount = state.cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
    fetchCartItems: (state, action) => {
      const items = action.payload;
      if (Array.isArray(items)) {
        state.cartItems = items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        state.cartTotalQuantity = state.cartItems.length;
        state.cartTotalAmount = state.cartItems.reduce(
          (total, item) => total + item.price * (item.quantity || 1),
          0
        );
      } else {
        // Nếu không có dữ liệu từ API, reset state
        state.cartItems = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity, fetchCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;

// Action để tải giỏ hàng từ API
export const fetchCartItemsFromApi = () => async (dispatch, getState) => {
  const token = localStorage.getItem("accessToken");
  const userId = selectUserId(getState());

  if (!token || !userId) {
    console.warn("Không có token hoặc userId:", { token, userId });
    dispatch(clearCart()); // Reset state nếu không có token/userId
    return;
  }

  try {
    const response = await axios.get(
      "http://222.255.119.40:8080/adamstore/v1/cart-items",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNo: 1, pageSize: 10 },
      }
    );
    const cartItems = response.data.result.items || [];
    dispatch(fetchCartItems(cartItems));
    console.log("Cart items from API:", cartItems);
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    dispatch(clearCart()); // Reset state nếu có lỗi
  }
};

// Action để xóa toàn bộ giỏ hàng
export const clearCartItemsFromApi = () => async (dispatch, getState) => {
  const token = localStorage.getItem("accessToken");
  const userId = selectUserId(getState());

  if (!token || !userId) {
    console.warn("Không có token hoặc userId:", { token, userId });
    dispatch(clearCart());
    return;
  }

  try {
    // Giả sử API có endpoint để xóa toàn bộ giỏ hàng
    await axios.delete("http://222.255.119.40:8080/adamstore/v1/cart-items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(clearCart());
    console.log("Đã xóa toàn bộ giỏ hàng");
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    dispatch(clearCart());
  }
};