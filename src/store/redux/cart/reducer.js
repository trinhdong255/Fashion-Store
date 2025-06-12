import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { selectUserId } from "../user/reducer";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    cartTotalQuantity: 0, // Đây sẽ là số lượng mặt hàng (số phần tử trong cartItems)
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

      // Cập nhật cartTotalQuantity dựa trên số lượng mặt hàng (length của cartItems)
      state.cartTotalQuantity = state.cartItems.length;
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );
    },
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);

      // Cập nhật cartTotalQuantity dựa trên số lượng mặt hàng
      state.cartTotalQuantity = state.cartItems.length;
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
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
        // Không cập nhật cartTotalQuantity ở đây vì chỉ thay đổi số lượng, không thay đổi số mặt hàng
        state.cartTotalAmount = state.cartItems.reduce(
          (total, item) => total + item.price * (item.quantity || 1),
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
        // Cập nhật cartTotalQuantity dựa trên số lượng mặt hàng
        state.cartTotalQuantity = state.cartItems.length;
        state.cartTotalAmount = state.cartItems.reduce(
          (total, item) => total + item.price * (item.quantity || 1),
          0
        );
      } else {
        state.cartItems = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
      }
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      // Cập nhật cartTotalQuantity dựa trên số lượng mặt hàng
      state.cartTotalQuantity = state.cartItems.length;
      state.cartTotalAmount = state.cartItems.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity, fetchCartItems, setCartItems } =
  cartSlice.actions;
export default cartSlice.reducer;

// Action để tải giỏ hàng từ API
export const fetchCartItemsFromApi = () => async (dispatch, getState) => {
  const token = localStorage.getItem("accessToken");
  const userId = selectUserId(getState());

  if (!token || !userId) {
    console.warn("Không có token hoặc userId:", { token, userId });
    dispatch(clearCart());
    return;
  }

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/v1/cart-items`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNo: 1, pageSize: 10 },
      }
    );
    const cartItems = response.data.result.items || [];
    dispatch(fetchCartItems(cartItems));
    // console.log("Cart items from API:", cartItems);
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    dispatch(clearCart());
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
    // Lấy danh sách giỏ hàng
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/v1/cart-items`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNo: 1, pageSize: 10 },
      }
    );
    const cartItems = response.data.result.items || [];

    // Xóa từng mục
    for (const item of cartItems) {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/v1/cart-items/${item.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // Cập nhật state sau khi xóa
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

// Action để cập nhật số lượng sản phẩm qua API
export const updateCartItemQuantity = (id, newQuantity) => async (dispatch, getState) => {
  const token = localStorage.getItem("accessToken");
  const userId = selectUserId(getState());

  if (!token || !userId) {
    console.warn("Không có token hoặc userId:", { token, userId });
    return;
  }

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/v1/cart-items/${id}`,
      { quantity: newQuantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(updateQuantity({ id, quantity: newQuantity }));
    console.log(`Đã cập nhật số lượng sản phẩm ID: ${id} thành ${newQuantity}`);
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
};