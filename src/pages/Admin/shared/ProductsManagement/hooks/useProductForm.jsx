/* eslint-disable import/order */
import { useEffect, useState } from "react";
import { fetchCategories, fetchColor, fetchSize } from "../api";

const useProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [sizes, setSizes] = useState([]);
  const [selectedSizeId, setSelectedSizeId] = useState([]);

  const [colors, setColors] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, sizeData, colorData] = await Promise.all([
          fetchCategories(),
          fetchSize(),
          fetchColor(),
        ]);

        setCategories(categoryData);
        setSizes(sizeData);
        setColors(colorData);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  return {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,

    sizes,
    selectedSizeId,
    setSelectedSizeId,

    colors,
    selectedColorId,
    setSelectedColorId,
  };
};

export default useProductForm;
