// services/api/categories.js
import { baseApi } from "./index";
import { TAG_KEYS } from "@/constants/tagKeys";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query({
      query: () => ({
        url: "/v1/categories",
        method: "GET",
      }),
      transformResponse: (response) => response.result?.items || [],
      providesTags: [TAG_KEYS.CATEGORIES],
      // Thêm retry và timeout
      keepUnusedDataFor: 60, // Giữ dữ liệu trong cache 60 giây
      refetchOnMountOrArgChange: true, // Refetch khi component mount
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: "/v1/categories",
        method: "POST",
        data: category,
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/v1/categories/${id}`,
        method: "PUT",
        data: category,
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/v1/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.CATEGORIES],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
