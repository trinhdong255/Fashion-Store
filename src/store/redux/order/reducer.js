import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderData: null,
    address: "",
    paymentMethods: [],
    orderStatus: "idle",
    error: null,
    confirmedOrder: null,
    appliedPromotion: null,
    discountAmount: 0,
  },
  reducers: {
    setOrderData: (state, action) => {
      state.orderData = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    setOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setConfirmedOrder: (state, action) => {
      state.confirmedOrder = action.payload;
    },
    setAppliedPromotion: (state, action) => {
      state.appliedPromotion = action.payload;
    },
    setDiscountAmount: (state, action) => {
      state.discountAmount = action.payload;
    },
    clearOrderData: (state) => {
      state.orderData = null;
      state.error = null;
    },
    clearConfirmedOrder: (state) => {
      state.confirmedOrder = null;
    },
    updateOrderFromCallback: (state, action) => {
      state.confirmedOrder = action.payload;
      state.orderStatus = "succeeded";
      state.appliedPromotion = action.payload.promotion || null;
      state.discountAmount = action.payload.discountAmount || 0;
    },
  },
});

export const {
  setOrderData,
  setAddress,
  setPaymentMethods,
  setOrderStatus,
  setError,
  setConfirmedOrder,
  setAppliedPromotion,
  setDiscountAmount,
  clearOrderData,
  clearConfirmedOrder,
  updateOrderFromCallback,
} = orderSlice.actions;

export default orderSlice.reducer;