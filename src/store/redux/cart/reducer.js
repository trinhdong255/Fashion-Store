import { createSlice } from "@reduxjs/toolkit";
import { cartApi } from "@/services/api/cart";

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
        (item) =>
          item.productVariantBasic.id === newItem.productVariantBasic.id
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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.getCartByUser.matchFulfilled,
      (state, action) => {
        const cartData = action.payload.result;
        if (cartData && cartData.items && cartData.items.length > 0) {
          state.cartItems = cartData.items.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            productVariantBasic: {
              id: item.productVariantBasic.id,
              color: {
                id: item.productVariantBasic.color.id,
                name: item.productVariantBasic.color.name,
              },
              size: {
                id: item.productVariantBasic.size.id,
                name: item.productVariantBasic.size.name,
              },
              product: {
                id: item.productVariantBasic.product.id,
                name: item.productVariantBasic.product.name,
              },
            },
          }));

          state.cartTotalQuantity = state.cartItems.reduce(
            (total, item) => total + item.quantity,
            0
          );
          state.cartTotalAmount = state.cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        } else {
          state.cartItems = [];
          state.cartTotalQuantity = 0;
          state.cartTotalAmount = 0;
        }
      }
    );

    builder.addMatcher(
      cartApi.endpoints.addToCart.matchFulfilled,
      (state, action) => {
        // Không làm gì, vì addToCart đã được xử lý qua action
      }
    );

    builder.addMatcher(
      cartApi.endpoints.updateCart.matchFulfilled,
      (state, action) => {
        // Không làm gì, vì updateQuantity đã được xử lý qua action
      }
    );

    builder.addMatcher(
      cartApi.endpoints.deleteCart.matchFulfilled,
      (state) => {
        state.cartItems = [];
        state.cartTotalQuantity = 0;
        state.cartTotalAmount = 0;
      }
    );
  },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;