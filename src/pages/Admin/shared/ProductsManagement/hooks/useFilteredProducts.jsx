import { useMemo } from "react";

const useFilteredProducts = (products, selectedCategory, status) => {
  return useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "" || product.category === selectedCategory;

      const matchStatus =
        status === "" ||
        product.status ===
          (status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động");

      return matchCategory && matchStatus;
    });
  }, [products, selectedCategory, status]);
};

export default useFilteredProducts;
