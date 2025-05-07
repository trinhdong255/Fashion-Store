import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const districtApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDistricts: builder.query({
      query: ({ pageNo = 1, pageSize = 10, sortBy = "" }) => ({
        url: `/v1/districts`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
      transformResponse: (response) => {
        console.log("District API Response:", response);
        return {
          items: Array.isArray(response.result?.items) ? response.result.items : [],
          page: response.result?.page || 1,
          size: response.result?.size || 10,
          totalPages: response.result?.totalPages || 1,
          totalItems: response.result?.totalItems || 0,
        };
      },
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),
    listDistrictsByProvince: builder.query({
      query: ({ provinceId, pageNo = 1, pageSize = 10, sortBy = "" }) => ({
        url: `/v1/provinces/${provinceId}/districts`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.DISTRICT],
      transformResponse: (response) => {
        console.log("Districts by Province API Response:", response);
        return {
          items: Array.isArray(response.result?.items) ? response.result.items : [],
          page: response.result?.page || 1,
          size: response.result?.size || 10,
          totalPages: response.result?.totalPages || 1,
          totalItems: response.result?.totalItems || 0,
        };
      },
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),
    listWardsByDistrict: builder.query({
      query: ({ districtId, pageNo = 1, pageSize = 30, sortBy = "" }) => ({
        url: `/v1/districts/${districtId}/wards`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.WARD],
      transformResponse: (response) => {
        console.log("Wards by District API Response:", response);
        return {
          items: Array.isArray(response.result?.items) ? response.result.items : [],
          page: response.result?.page || 1,
          size: response.result?.size || 30,
          totalPages: response.result?.totalPages || 1,
          totalItems: response.result?.totalItems || 0,
        };
      },
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),
  }),
});

export const { useListDistrictsQuery, useListDistrictsByProvinceQuery, useListWardsByDistrictQuery } = districtApi;