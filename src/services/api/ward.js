import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const wardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWards: builder.query({
      query: ({ pageNo = 1, pageSize = 10, sortBy = "" }) => ({
        url: `/v1/wards`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.WARD],
      transformResponse: (response) => {
        console.log("Ward API Response:", response);
        return {
          items: Array.isArray(response.result?.items) ? response.result.items : [],
          page: response.result?.page || 1,
          size: response.result?.size || 10,
          totalPages: response.result?.totalPages || 1,
          totalItems: response.result?.totalItems || 0,
        };
      },
    }),
  }),
});

export const { useListWardsQuery } = wardApi;