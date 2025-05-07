// store/redux/color/reducer.js
import { createSlice } from "@reduxjs/toolkit";

const colorSlice = createSlice({
  name: "color",
  initialState: {
    colors: [],
    loading: false,
    error: null,
  },
  reducers: {
    setColors: (state, action) => {
      console.log("Dispatching setColors with payload:", action.payload);
      state.colors = action.payload;
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

export const { setColors, setLoading, setError } = colorSlice.actions;

export const selectColors = (state) => state.color.colors;
export const selectLoading = (state) => state.color.loading;
export const selectError = (state) => state.color.error;

export default colorSlice.reducer;