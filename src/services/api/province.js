// services/api/province.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const provinceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProvinces: builder.query({
      query: ({ pageNo = 1, pageSize = 10, sortBy = "name-asc" } = {}) => ({
        url: `/v1/provinces`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.PROVINCE],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items) ? response.result.items : [],
        page: response.result?.page || 1,
        size: response.result?.size || 10,
        totalPages: response.result?.totalPages || 1,
        totalItems: response.result?.totalItems || 0,
      }),
    }),
  }),
});

export const { useListProvincesQuery } = provinceApi;