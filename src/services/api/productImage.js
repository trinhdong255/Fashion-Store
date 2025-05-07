import { baseApi } from "./index";
import { TAG_KEYS } from "/src/constants/tagKeys.js";

export const productImageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("Content-Type", file.type);
        formData.append("fileImage", file);

        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: `/v1/file/upload/image`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [TAG_KEYS.PRODUCT_IMAGE],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Upload image success:", data);
        } catch (error) {
          console.error("Upload image error:", {
            status: error.error?.status,
            data: error.error?.data,
            message: error.error?.data?.message || error.error?.data?.error,
            originalError: error,
          });
        }
      },
    }),

    listImages: builder.query({
      query: ({ pageNo = 1, pageSize = 100 } = {}) => ({
        url: `/v1/file/all`,
        method: "GET",
        params: { pageNo, pageSize },
      }),
      providesTags: [TAG_KEYS.PRODUCT_IMAGE],
      transformResponse: (response) => {
        console.log("Full response from image API:", response);
        const items = Array.isArray(response.result?.items)
          ? response.result.items
          : Array.isArray(response)
          ? response
          : [];
        if (items.length === 0) {
          console.warn("No images found in response");
        }
        return items.map((item) => ({
          id: item.id,
          fileName: item.fileName || item.name || "Unknown",
          imageUrl: item.imageUrl || item.url || "",
        }));
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Transformed images data:", data);
        } catch (error) {
          console.error("Error fetching images:", {
            status: error.error?.status,
            data: error.error?.data,
            params: arg,
          });
        }
      },
      retry: (error) => error.status === 400,
      retryMax: 2,
    }),

    deleteImage: builder.mutation({
      query: (id) => ({
        url: `/v1/file/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [TAG_KEYS.PRODUCT_IMAGE],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useListImagesQuery,
  useDeleteImageMutation,
} = productImageApi;
