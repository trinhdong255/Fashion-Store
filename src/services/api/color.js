// services/api/color.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const colorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listColors: builder.query({
      query: () => ({
        url: `/v1/colors`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.COLOR],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items) ? response.result.items : response.result || [],
      }),
    }),
    addColor: builder.mutation({
      query: (color) => ({
        url: `/v1/colors`,
        method: "POST",
        data: color,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),
    updateColor: builder.mutation({
      query: ({ id, ...color }) => ({
        url: `/v1/colors/${id}`,
        method: "PUT",
        data: color,
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),
    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/v1/colors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.COLOR],
    }),
    getColorById: builder.query({
      query: (id) => ({
        url: `/v1/colors/${id}`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.COLOR],
    }),
  }),
});

export const {
  useListColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useGetColorByIdQuery,
} = colorApi;