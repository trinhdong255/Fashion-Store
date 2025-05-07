import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listRoles: builder.query({
      query: ({ pageNo = 1, pageSize = 10, sortBy = "" } = {}) => ({
        url: `/v1/roles`,
        method: "GET",
        params: { pageNo, pageSize, sortBy },
      }),
      providesTags: [TAG_KEYS.ROLE],
      transformResponse: (response) => ({
        page: response.result.page,
        size: response.result.size,
        totalPages: response.result.totalPages,
        totalItems: response.result.totalItems,
        items: response.result.items,
      }),
    }),

    getRoleById: builder.query({
      query: (id) => ({
        url: `/v1/roles/${id}`,
        method: "GET",
      }),
      providesTags: [TAG_KEYS.ROLE],
    }),
  }),
});

export const { useListRolesQuery, useGetRoleByIdQuery } = roleApi;