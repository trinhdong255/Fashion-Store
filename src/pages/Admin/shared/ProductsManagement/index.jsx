/* eslint-disable import/order */
import { useEffect, useState } from "react";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import TableProduct from "./TableProduct";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { useFilteredProducts, useProductForm, useProducts } from "./hooks";
import {
  createProduct,
  deleteProduct,
  fetchProductID,
  handleUpload,
  restoreProduct,
  updateProduct,
} from "./api";
import { validateProduct } from "./until";
import axios from "axios";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  images: [],
};

const ProductsManagement = () => {
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [status, setStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [productToRestore, setProductToRestore] = useState(null);
  const [productToRestoreName, setProductToRestoreName] = useState("");

  const { products, refetch } = useProducts();
  const filteredProducts = useFilteredProducts(
    products,
    selectedCategory,
    status
  );

  const [productForm, setProductForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [removedImages, setRemovedImages] = useState([]);
  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    sizes,
    selectedSizeId,
    setSelectedSizeId,
    colors,
    selectedColorId,
    setSelectedColorId,
  } = useProductForm();

  const [newImages, setNewImages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: null,
    sizes: [],
    colors: [],
    images: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
    setProductForm(initialFormState);
    setSelectedCategoryId("");
    setSelectedSizeId([]);
    setSelectedColorId([]);
    setErrors({});
  };

  const showDialog = (message) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      const uploaded = await Promise.all(
        [...files].map((file) => handleUpload(file))
      );
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
      setErrors((prev) => ({ ...prev, productImage: undefined }));
      showSnackbar("Tải ảnh thành công", "success");
    } catch (err) {
      console.error("Tải hình:", err.message);
      setErrors((prev) => ({
        ...prev,
        productImage: "Không thể upload ảnh",
      }));
      showSnackbar("Tải ảnh thất bại", "error");
    }
  };

  const handleSaveProduct = async () => {
    const validationErrors = validateProduct({
      productName: productForm.name,
      productDes: productForm.description,
      productPrice: productForm.price,
      quantity: productForm.quantity,
      selectedCategoryId,
      selectedSizeId,
      selectedColorId,
      productImage: productForm.images,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      quantity: Number(productForm.quantity),
      categoryId: Number(selectedCategoryId),
      colorIds: selectedColorId.map(Number),
      sizeIds: selectedSizeId.map(Number),
      imageIds: productForm.images.map((img) => img.id),
    };

    try {
      await createProduct(payload);
      handleCloseModalAdd();
      showSnackbar("Thêm sản phẩm thành công", "success");
      refetch();
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
  };

  const handleEditProduct = async (product) => {
    const token = localStorage.getItem("accessToken");
    try {
      const productDetail = await fetchProductID(product.id, token);

      setSelectedProduct({
        ...productDetail,
        sizes: productDetail.sizes || [],
        colors: productDetail.colors || [], // Đảm bảo sizes là mảng
      });
      setEditOpen(true);
    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  // Khi người dùng xóa ảnh trong giao diện:
  const handleRemoveImage = async (imageId) => {
    const token = localStorage.getItem("accessToken");

    try {
      // Gọi API xóa ảnh
      const response = await axios.delete(
        `http://localhost:8080/adamstore/v1/file/delete/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSnackbar("Xóa ảnh thành công", "success");
      // Cập nhật lại danh sách ảnh trong selectedProduct
      const updatedImages = selectedProduct.images.filter(
        (img) => img.id !== imageId
      );
      setSelectedProduct({
        ...selectedProduct,
        images: updatedImages,
      });

      // Cập nhật lại danh sách ảnh đã xóa
      setRemovedImages((prev) => [...prev, imageId]);
    } catch (error) {
      showSnackbar("xóa ảnh thất bại", "error");
    }
  };

  const handleUpdateProduct = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      // 1. Upload ảnh mới nếu có
      let uploadedImages = [];
      if (newImages.length > 0) {
        uploadedImages = await Promise.all(
          newImages.map((file) => handleUpload(file))
        );
      }

      // 2. Chuẩn bị payload (không còn phần gọi API xóa ảnh)
      const payload = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: Number(selectedProduct.price),
        quantity: Number(selectedProduct.quantity),
        categoryId: Number(selectedProduct.category?.id),
        colorIds: selectedProduct.colors?.map((c) => c?.id) || [],
        sizeIds: selectedProduct.sizes?.map((s) => s?.id) || [],
        imageIds: [
          ...selectedProduct.images
            .filter((img) => !removedImages.includes(img.id)) // giữ ảnh chưa bị xóa
            .map((img) => img.id),
          ...uploadedImages.map((img) => img.id),
        ],
      };

      // 3. Gọi API cập nhật
      await updateProduct(selectedProduct.id, payload, token);
      showSnackbar("Cập nhật sản phẩm thành công", "success");
      setEditOpen(false);
      setNewImages([]); // Reset ảnh mới
      setRemovedImages([]); // Reset ảnh đã xóa
      refetch(); // Refetch dữ liệu sau khi cập nhật
    } catch (error) {
      showSnackbar("Cập nhật thất bại:", "error");
    }
  };

  const handleRestoreProduct = async (productId, productToRestoreName) => {
    const token = localStorage.getItem("accessToken");
    try {
      const success = await restoreProduct(productId, token);
      if (success) {
        showSnackbar(
          `Sản phẩm "${productToRestoreName}" đã được khôi phục.`,
          "Success"
        );
        refetch();
      }
    } catch (err) {
      showSnackbar("Khôi phục thất bại: ", "error");
    } finally {
      setProductToRestore(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await deleteProduct(productId, token);
      showSnackbar("Sản phẩm đã được xóa", "success");
      refetch(); // <- reload lại bảng
    } catch (error) {
      console.error(error);
      showSnackbar(error.message, "error");
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
          marginBottom: 4,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Danh mục</InputLabel>
          <Select
            label="Danh mục"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
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
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="ACTIVE">Hoạt động</MenuItem>
            <MenuItem value="INACTIVE">Ngưng hoạt động</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "400px" }}
          onClick={() => setOpenModalAdd(true)}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      <TableProduct
        data={filteredProducts.map((product) => ({
          ...product,
          onEdit: handleEditProduct,
          onRestoreClick: handleRestoreProduct,
          onDelete: handleDeleteProduct,
        }))}
      />

      <Dialog open={openModalAdd} onClose={handleCloseModalAdd}>
        <DialogTitle>Thêm Sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            margin="dense"
            value={productForm.name}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, name: e.target.value }))
            }
            error={!!errors.productName}
            helperText={errors.productName}
          />
          <TextareaAutosize
            aria-label="minimum height"
            maxRows={4}
            placeholder="Mô tả"
            style={{ width: "100%", marginTop: "10px" }}
            margin="dense"
            value={productForm.description}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            error={!!errors.productDes}
            helperText={errors.productDes}
          />
          <TextField
            label="Giá"
            fullWidth
            type="number"
            margin="dense"
            value={productForm.price}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, price: e.target.value }))
            }
            error={!!errors.productPrice}
            helperText={errors.productPrice}
          />
          <TextField
            label="Số lượng"
            fullWidth
            type="number"
            margin="dense"
            value={productForm.quantity}
            onChange={(e) =>
              setProductForm((prev) => ({ ...prev, quantity: e.target.value }))
            }
            error={!!errors.quantity}
            helperText={errors.quantity}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              label="Danh mục"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedCategoryId && (
              <Typography color="error" variant="caption">
                {errors.selectedCategoryId}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Kích thước</InputLabel>
            <Select
              multiple
              value={selectedSizeId}
              onChange={(e) => setSelectedSizeId(e.target.value)}
              label="Kích thước"
            >
              {sizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedSizeId && (
              <Typography color="error" variant="caption">
                {errors.selectedSizeId}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Màu sắc</InputLabel>
            <Select
              multiple
              value={selectedColorId}
              onChange={(e) => setSelectedColorId(e.target.value)}
              label="Màu sắc"
            >
              {colors.map((color) => (
                <MenuItem key={color.id} value={color.id}>
                  {color.name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedColorId && (
              <Typography color="error" variant="caption">
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
              {productForm.images.map((img) => (
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
          <Button onClick={handleCloseModalAdd}>Hủy</Button>
          <Button onClick={handleSaveProduct}>Thêm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen}>
        <DialogTitle>Cập nhật sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            margin="dense"
            value={selectedProduct?.name}
            onChange={(e) =>
              setSelectedProduct((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextareaAutosize
            aria-label="minimum height"
            maxRows={4}
            placeholder="Mô tả"
            style={{ width: "100%", marginTop: "10px" }}
            margin="dense"
            value={selectedProduct?.description}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
          <TextField
            label="Giá"
            fullWidth
            type="number"
            margin="dense"
            value={selectedProduct.price}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
          />
          <TextField
            label="Số lượng"
            fullWidth
            type="number"
            margin="dense"
            value={selectedProduct.quantity}
            onChange={(e) =>
              setSelectedProduct((prev) => ({
                ...prev,
                quantity: e.target.value,
              }))
            }
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedProduct.category}
              label="Danh mục"
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              renderValue={(selected) => selected?.name || "Không có danh mục"}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Kích thước</InputLabel>
            <Select
              multiple
              value={selectedProduct.sizes.map((size) => size?.id)}
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  sizes: e.target.value.map((id) => {
                    return sizes.find((size) => size?.id === id);
                  }),
                }))
              }
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const size = sizes.find((s) => s?.id === id);

                    return size ? size?.name : "";
                  })
                  .join(", ")
              }
            >
              {sizes.map((size) => (
                <MenuItem key={size.id} value={size.id}>
                  {size.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Màu sắc</InputLabel>
            <Select
              multiple
              value={selectedProduct.colors.map((c) => c?.id)}
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  colors: e.target.value.map((id) =>
                    colors.find((color) => color.id === id)
                  ),
                }))
              }
              renderValue={(selected) =>
                selected
                  .map((id) => colors.find((c) => c.id === id)?.name)
                  .join(", ")
              }
            >
              {colors.map((color) => (
                <MenuItem key={color?.id} value={color?.id}>
                  {color?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                console.log("Files selected:", files); // ✅ Kiểm tra xem có log không
                setNewImages(files);
              }}
            />

            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              {selectedProduct.images.map((img, index) => (
                <Box key={img.id} position="relative">
                  <img
                    src={img.imageUrl}
                    alt={`preview-${index}`}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                  <Button
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -20,
                    }}
                  >
                    <DeleteIcon
                      sx={{
                        backgroundColor: "#fff",
                        color: "red",
                        MozBorderRadiusBottomleft: "4px",
                      }}
                      onClick={() => handleRemoveImage(img?.id)}
                    />
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseEdit}>Hủy</Button>
          <Button onClick={handleUpdateProduct}>Cập nhật</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
