// services/api/productVariant.js
import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productVariantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProductVariants: builder.query({
      query: ({ productId, pageNo = 1, pageSize = 10, colorId, sizeId } = {}) => {
        if (!productId) throw new Error("Product ID is required");
        return {
          url: `/v1/products/${productId}/product-variants`,
          method: "GET",
          params: { pageNo, pageSize, colorId, sizeId },
        };
      },
      providesTags: [TAG_KEYS.PRODUCT_VARIANT],
      transformResponse: (response) => ({
        items: Array.isArray(response.result?.items) ? response.result.items : [],
        totalPages: response.result?.totalPages || 1,
        totalItems: response.result?.totalItems || 0,
      }),
      keepUnusedDataFor: 60,
      refetchOnMountOrArgChange: true,
    }),
    updateProductVariant: builder.mutation({
      query: ({ id, price, quantity }) => ({
        url: `/v1/product-variants/${id}`,
        method: "PUT",
        data: {
          price,
          quantity,
        },
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_VARIANT],
    }),
  }),
});

export const {
  useListProductVariantsQuery,
  useUpdateProductVariantMutation,
} = productVariantApi;