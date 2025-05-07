import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { baseApi } from "@/services/api";
import cartReducer from "@/store/redux/cart/reducer";
import orderReducer from "@/store/redux/order/reducer";
import userReducer from "@/store/redux/user/reducer";
import categoriesReducer from "@/store/redux/categories/reducer";
import productReducer from "@/store/redux/product/reducer";
import productVariantReducer from "@/store/redux/productVariant/reducer";
import productImageReducer from "@/store/redux/productImage/reducer";
import colorReducer from "@/store/redux/color/reducer";

export const RESET_STATE = "RESET_STATE";

const persistConfig = {
  key: "root",
  storage,
};

const appReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  order: orderReducer,
  user: userReducer,
  cart: cartReducer,
  categories: categoriesReducer,
  product: productReducer,
  productVariant: productVariantReducer,
  productImage: productImageReducer,
  color: colorReducer,
});

const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const resetStore = () => ({
  type: RESET_STATE,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);