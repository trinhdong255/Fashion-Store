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
  clearOrderData,
  clearConfirmedOrder,
  updateOrderFromCallback,
} = orderSlice.actions;

export default orderSlice.reducer;