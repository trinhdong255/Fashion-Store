import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import TableProduct from "./TableProduct";
import {
  createProduct,
  fetchCategories,
  fetchColor,
  fetchProduct,
  fetchSize,
  handleUpload,
} from "./api";
import { validateProduct } from "./until";

const ProductsManagement = () => {
  const [category, setCategory] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false); // State để điều khiển việc mở modal
  const [productName, setProductName] = React.useState(""); // Ví dụ state cho tên sản phẩm
  const [productDes, setProductDes] = React.useState(""); // Ví dụ state cho mo tả sản phẩm
  const [productPrice, setProductPrice] = React.useState(""); // Ví dụ state cho mo tả sản phẩm
  const [productQuantity, setProductQuantity] = React.useState(""); // Ví dụ state cho so luong sản phẩm
  const [productImage, setProductImage] = React.useState([]); // Ví dụ state cho so luong sản phẩm

  const [categories, setCategories] = useState([]); // state để lưu danh sách danh mục
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); // state cho modal

  const [sizes, setSizes] = useState([]); // state để lưu danh sách size
  const [selectedSizeId, setSelectSizeId] = useState([]); // state cho modal

  const [colors, setColors] = useState([]); // state để lưu danh sách color
  const [selectedColorId, setSelectColorId] = useState([]); // state cho modal

  const [errors, setErrors] = useState({});
  // lấy dữ liệu
  React.useEffect(() => {
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

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploaded = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const result = await handleUpload(files[i]);
        uploaded.push(result); // Push object có id và imageUrl
      }

      setProductImage((prev) => [...prev, ...uploaded]); // Giữ lại ảnh cũ nếu có
      setErrors((prev) => ({ ...prev, productImage: undefined }));
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      setErrors((prev) => ({
        ...prev,
        productImage: "Không thể upload ảnh",
      }));
    }
  };

  // Mở modal khi nhấn nút "Thêm sản phẩm"
  const handleAddProduct = () => {
    setOpenModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategoryId("");
    setSelectSizeId([]);
    setSelectColorId([]);
    setProductName("");
    setProductDes("");
    setProductPrice("");
    setProductQuantity("");
    setProductImage([]);
    setErrors({});
  };

  const handleSaveProduct = async () => {
    const validationErrors = validateProduct({
      productName,
      productDes,
      productPrice,
      productQuantity,
      selectedCategoryId,
      selectedSizeId,
      selectedColorId,
      productImage,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: productName,
      description: productDes,
      price: Number(productPrice),
      quantity: Number(productQuantity),
      categoryId: Number(selectedCategoryId),
      colorIds: selectedColorId.map(Number),
      sizeIds: selectedSizeId.map(Number),
      imageIds: productImage.map((img) => img.id),
    };

    try {
      await createProduct(payload);
      setOpenModal(false);
      await fetchProduct();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm sản phẩm");
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Sản phẩm
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}>
        <FormControl fullWidth>
          <InputLabel>Danh mục</InputLabel>
          <Select
            label="Danh mục"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={status}
            onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "400px" }}
          onClick={handleAddProduct}>
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Truyền dữ liệu vào TableProduct */}
      <TableProduct rows={filteredProducts} />

      {/* Modal để thêm sản phẩm */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Thêm Sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên sản phẩm"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            error={!!errors.productName}
            helperText={errors.productName}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            value={productDes}
            onChange={(e) => setProductDes(e.target.value)}
            error={!!errors.productDes}
            helperText={errors.productDes}
          />
          <TextField
            margin="dense"
            label="Giá"
            type="number"
            fullWidth
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            error={!!errors.productPrice}
            helperText={errors.productPrice}
          />
          <TextField
            margin="dense"
            label="Số lượng"
            type="number"
            fullWidth
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            error={!!errors.productQuantity}
            helperText={errors.productQuantity}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục</InputLabel>
            <Select
              label="Danh mục"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedCategoryId && (
              <Typography variant="caption" color="error">
                {errors.selectedCategoryId}
              </Typography>
            )}
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Kích thước</InputLabel>
            <Select
              label="Kích thước"
              value={selectedSizeId}
              onChange={(e) => setSelectSizeId(e.target.value)}
              multiple>
              {sizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedSizeId && (
              <Typography variant="caption" color="error">
                {errors.selectedSizeId}
              </Typography>
            )}
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Màu sắc</InputLabel>
            <Select
              label="Màu sắc"
              value={selectedColorId}
              onChange={(e) => setSelectColorId(e.target.value)}
              multiple>
              {colors.map((color) => (
                <MenuItem key={color.id} value={color.id}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedColorId && (
              <Typography variant="caption" color="error">
                {errors.selectedColorId}
              </Typography>
            )}
          </FormControl>
          <Box mt={2}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />

            {errors.productImage && (
              <Typography variant="caption" color="error">
                {errors.productImage}
              </Typography>
            )}

            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {productImage.map((img) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt={`Uploaded ${img.id}`}
                  style={{
                    width: 100,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
