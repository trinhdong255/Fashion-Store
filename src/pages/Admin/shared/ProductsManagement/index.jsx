/* eslint-disable import/order */
import { useEffect, useState } from "react";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import TableProduct from "./TableProduct";
import DeleteIcon from "@mui/icons-material/Delete";
import {
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
    } catch (err) {
      console.error("Upload failed:", err);
      setErrors((prev) => ({
        ...prev,
        productImage: "Không thể upload ảnh",
      }));
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
      // setReloadTable((prev) => !prev);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi thêm sản phẩm");
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
      showDialog(err.message);
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

      // 2. Chuẩn bị payload
      const payload = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: Number(selectedProduct.price),
        quantity: Number(selectedProduct.quantity),
        categoryId: Number(selectedProduct.category?.id),
        colorIds: selectedProduct.colors?.map((c) => c?.id) || [],
        sizeIds: selectedProduct.sizes?.map((s) => s?.id) || [],
        imageIds: [
          ...selectedProduct.images.map((img) => img.id), // giữ ảnh cũ
          ...uploadedImages.map((img) => img.id), // thêm ảnh mới
        ],
      };

      console.log("selectedProduct:", selectedProduct);
      console.log("Category ID:", selectedProduct.category?.id);
      console.log(
        "Color IDs:",
        selectedProduct.colors?.map((c) => c?.id)
      );
      console.log(
        "Size IDs:",
        selectedProduct.sizes?.map((s) => s?.id)
      );
      console.log(
        "Old Image IDs:",
        selectedProduct.images?.map((img) => img?.id)
      );
      console.log("New Image IDs:", newImages); // file objects

      // 3. Gọi API cập nhật
      await updateProduct(selectedProduct.id, payload, token);

      // 4. Cập nhật UI
      showDialog("Cập nhật sản phẩm thành công!");
      setEditOpen(false);
      setNewImages([]);
      refetch();
    } catch (error) {
      console.error(error);
      showDialog("Cập nhật thất bại: " + error.message);
    }
  };

  const handleRestoreProduct = async (productId, productToRestoreName) => {
    const token = localStorage.getItem("accessToken");
    try {
      const success = await restoreProduct(productId, token);
      if (success) {
        showDialog(`Sản phẩm "${productToRestoreName}" đã được khôi phục.`);
        refetch(); // <- reload lại bảng
      }
    } catch (err) {
      showDialog("Khôi phục thất bại: " + err.message);
    } finally {
      setProductToRestore(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await deleteProduct(productId, token);
      showDialog("Sản phẩm đã được xóa");
      refetch(); // <- reload lại bảng
    } catch (error) {
      console.error(error);
      showDialog(error.message);
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}>
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
            onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="ACTIVE">Hoạt động</MenuItem>
            <MenuItem value="INACTIVE">Ngưng hoạt động</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "400px" }}
          onClick={() => setOpenModalAdd(true)}>
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
          <TextField
            label="Mô tả"
            fullWidth
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
              label="Danh mục">
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
              label="Kích thước">
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
              label="Màu sắc">
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
          <TextField
            label="Mô tả"
            fullWidth
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
              renderValue={(selected) => selected?.name || "Không có danh mục"}>
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
              }>
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
              }>
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
                    onClick={() => {
                      // Xóa ảnh khỏi selectedProduct
                      setSelectedProduct((prev) => ({
                        ...prev,
                        images: prev.images.filter((i) => i?.id !== img?.id),
                      }));
                    }}>
                    <DeleteIcon
                      sx={{
                        backgroundColor: "#fff",
                        color: "red",
                        MozBorderRadiusBottomleft: "4px",
                      }}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Thông báo</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayoutWrapper>
  );
};

export default ProductsManagement;
