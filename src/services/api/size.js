// services/api/size.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const sizeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSizes: builder.query({
      query: ({ pageNo = 1, pageSize = 10, sortBy = "name-asc" } = {}) => ({
        url: `/v1/sizes`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.SIZE],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items) ? response.result.items : response.result || [],
      }),
    }),
  }),
});

export const { useListSizesQuery } = sizeApi;