// cart/reducer.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectUserId } from "../user/reducer";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [], // Danh sách sản phẩm trong giỏ hàng với quantity
    cartTotalQuantity: 0, // Tổng số lượng tất cả sản phẩm
    cartTotalAmount: 0, // Tổng giá tiền
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productVariantBasic.id === newItem.productVariantBasic.id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1; // Cộng dồn số lượng
      } else {
        state.cartItems.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }

      state.cartTotalQuantity = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);

      state.cartTotalQuantity = state.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
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
        state.cartTotalQuantity = state.cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        );
        state.cartTotalAmount = state.cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      }
    },
    fetchCartItems: (state, action) => {
      const items = action.payload;
      state.cartItems = items.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      state.cartTotalQuantity = items.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );
      state.cartTotalAmount = items.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );
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
  if (!token || !userId) return;

  try {
    const response = await axios.get(
      "http://222.255.119.40:8080/adamstore/v1/cart-items",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(fetchCartItems(response.data.data));
    console.log("Giỏ hàng:", response.data.data);
    
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", error);
  }
};