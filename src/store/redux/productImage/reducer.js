// store/redux/productImage/reducer.js
import { createSlice } from "@reduxjs/toolkit";

const productImageSlice = createSlice({
  name: "productImage",
  initialState: {
    images: [],
    loading: false,
    error: null,
  },
  reducers: {
    setImages: (state, action) => {
      console.log("Dispatching setImages with payload:", action.payload);
      state.images = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      console.log("Dispatching setLoading:", action.payload);
      state.loading = action.payload;
    },
    setError: (state, action) => {
      console.log("Dispatching setError:", action.payload);
      state.error = action.payload;
    },
  },
});

export const { setImages, setLoading, setError } = productImageSlice.actions;

export const selectImages = (state) => state.productImage.images;
export const selectLoading = (state) => state.productImage.loading;
export const selectError = (state) => state.productImage.error;

export default productImageSlice.reducer;