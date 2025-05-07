// services/api/cart.js
import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCarts: builder.query({
      query: () => ({
        url: "/carts",
        method: "GET",
      }),
      providesTags: [TAG_KEYS.CART],
    }),

    getCartByUser: builder.query({
      query: (userId) => ({
        url: `/carts/user/${userId}`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.CART],
      transformResponse: (response) => {
        if (!response || !response.carts) {
          return { carts: [] };
        }
        return response;
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      },
    }),

    addToCart: builder.mutation({
      query: (cartData) => ({
        url: "/carts/add",
        method: "POST",
        data: cartData,
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to add to cart:", error);
        }
      },
    }),

    updateCart: builder.mutation({
      query: ({ id, cartData }) => ({
        url: `/carts/${id}`,
        method: "PUT",
        data: cartData,
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to update cart:", error);
        }
      },
    }),

    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/carts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.CART],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Failed to delete cart:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllCartsQuery,
  useGetCartByUserQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
} = cartApi;