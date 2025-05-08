import * as React from "react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { columns, customLocaleText } from "./until";

// import { fetchProducts, updateProduct, deleteProduct } from "./api";

const paginationModel = { page: 0, pageSize: 5 };

export default function TableProduct() {
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          "http://222.255.119.40:8080/adamstore/v1/products/admin?pageNo=1&pageSize=10"
        );
        const data = await res.json();
        const products = data.result.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          available: item.isAvailable ? "Còn hàng" : "Hết hàng",
          averageRating: item.averageRating,
          sold: item.soldQuantity,
          totalReviews: item.totalReviews,
          stock: item.quantity,
          price: item.price.toLocaleString("vi-VN") + " ₫",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          category: item.category?.name || "Không có danh mục",
          color: item.colors.map((c) => c.name).join(", ") || "Không có màu ",
          size:
            item.sizes.map((s) => s.name).join(", ") || "Không có kích thước",
          images: item.images,
          status: item.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động",
          actions: "", // hoặc nút chỉnh sửa nếu muốn
        }));
        setRows(products);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      }
    };

    getData();
  }, []);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  // const handleDelete = async (productId) => {
  //   const isDeleted = await deleteProduct(productId);
  //   if (isDeleted) {
  //     setRows(rows.filter((row) => row.id !== productId));
  //   }
  // };

  // const handleSave = async () => {
  //   if (currentProduct) {
  //     const updatedProduct = await updateProduct(currentProduct);
  //     setRows(
  //       rows.map((row) => (row.id === updatedProduct.id ? updatedProduct : row))
  //     );
  //     setOpen(false);
  //     setCurrentProduct(null);
  //   }
  // };

  // const handleClose = () => {
  //   setOpen(false);
  //   setCurrentProduct(null);
  // };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        localeText={customLocaleText}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
