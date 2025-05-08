import { useEffect, useState, useCallback } from "react";
import { fetchProduct } from "../api";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false); // flag để trigger reload

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProduct();
      const mappedData = data.map((item) => ({
        id: item?.id,
        name: item?.name,
        description: item?.description,
        available: item?.isAvailable ? "Có" : "Không",
        averageRating: item?.averageRating,
        sold: item?.soldQuantity,
        totalReviews: item?.totalReviews,
        stock: item?.quantity,
        price: item?.price,
        createdAt: item?.createdAt,
        updatedAt: item?.updatedAt,
        category: item?.category?.name ?? "",
        color: item?.colors.map((c) => c.name).join(", "),
        size: item?.sizes.map((s) => s.name).join(", "),
        images: item?.images,
        status: item.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động",
      }));
      setProducts(mappedData);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts, reloadFlag]);

  const refetch = () => setReloadFlag((prev) => !prev); // toggle flag để refetch

  return { products, refetch };
};

export default useProducts;
