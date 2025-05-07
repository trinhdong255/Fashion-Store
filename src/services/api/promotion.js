// services/api/promotion.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPromotions: builder.query({
      query: () => ({
        url: `/v1/promotions`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.PROMOTION],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items)
          ? response.result.items
          : response.result || [],
      }),
    }),
    addPromotion: builder.mutation({
      query: (promotion) => ({
        url: `/v1/promotions`,
        method: "POST",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
    updatePromotion: builder.mutation({
      query: ({ id, ...promotion }) => ({
        url: `/v1/promotions/${id}`,
        method: "PUT",
        data: promotion,
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `/v1/promotions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PROMOTION],
    }),
  }),
});

export const {
  useListPromotionsQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} = promotionApi;
