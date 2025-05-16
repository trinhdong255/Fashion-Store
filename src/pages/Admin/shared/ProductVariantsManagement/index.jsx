import React, { useState, useEffect } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  DialogActions,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  Snackbar,
  Alert,
} from "@mui/material";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

import {
  deleteProductVariant,
  fetchProduct,
  fetchProductVariant,
  updateProductVariant,
} from "./api";

const ProductVariantsManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formValues, setFormValues] = useState({ price: "", quantity: "" });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingVariantId, setDeletingVariantId] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success", // 'success' | 'error'
  });

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProduct();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi load sản phẩm:", error);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const getVariants = async () => {
      if (!selectedProductId) return;
      setLoading(true);
      try {
        const data = await fetchProductVariant(selectedProductId);
        const dataWithActions = data.map((variant) => ({
          ...variant,
          onEdit: handleOpenEditDialog,
          onDelete: handleDeleteVariant,
        }));
        setVariants(dataWithActions);
      } catch (error) {
        console.error("Lỗi khi load biến thể:", error);
        setVariants([]);
      } finally {
        setLoading(false);
      }
    };
    getVariants();
  }, [selectedProductId]);

  const handleOpenEditDialog = (variant) => {
    setEditingVariant(variant);
    setFormValues({ price: variant.price, quantity: variant.quantity });
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setEditingVariant(null);
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const payload = {
        ...editingVariant,
        price: Number(formValues.price),
        quantity: Number(formValues.quantity),
        productId: editingVariant.product?.id,
        sizeId: editingVariant.size?.id,
        colorId: editingVariant.color?.id,
      };

      await updateProductVariant(editingVariant.id, payload, token);

      // Refresh
      const updated = await fetchProductVariant(selectedProductId);
      const dataWithActions = updated.map((variant) => ({
        ...variant,
        onEdit: handleOpenEditDialog,
        onDelete: handleDeleteVariant,
      }));
      setVariants(dataWithActions);
      setNotification({
        open: true,
        message: "Cập nhật thành công",
        type: "success",
      });
      handleCloseDialog();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setNotification({
        open: true,
        message: "Lỗi khi cập nhật biến thể",
        type: "error",
      });
    }
  };

  const handleDeleteVariant = (variantId) => {
    setDeletingVariantId(variantId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteVariant = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await deleteProductVariant(deletingVariantId, token);
      setVariants((prev) => prev.filter((v) => v.id !== deletingVariantId));
      setNotification({
        open: true,
        message: "Xóa thành công",
        type: "success",
      });
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setNotification({
        open: true,
        message: "Xóa thất bại",
        type: "error",
      });
    } finally {
      setOpenDeleteDialog(false);
      setDeletingVariantId(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "price", headerName: "Giá", width: 120 },
    { field: "quantity", headerName: "Số lượng", width: 120 },
    {
      field: "product",
      headerName: "Sản phẩm",
      width: 150,
      renderCell: (params) => params.row.product?.name || "N/A",
    },
    {
      field: "size",
      headerName: "Kích thước",
      width: 120,
      renderCell: (params) => params.row.size?.name || "N/A",
    },
    {
      field: "color",
      headerName: "Màu",
      width: 120,
      renderCell: (params) => params.row.color?.name || "N/A",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => params.row.onEdit(params.row)}
            color="primary">
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => params.row.onDelete(params.row.id)}
            color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Biến thể Sản phẩm
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="select-label">Chọn sản phẩm</InputLabel>
        <Select
          labelId="select-label"
          value={selectedProductId}
          label="Chọn sản phẩm"
          onChange={(e) => setSelectedProductId(e.target.value)}>
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={variants}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
        />
      </Paper>
      <Dialog open={openEditDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cập nhật biến thể</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Giá"
            fullWidth
            type="number"
            value={formValues.price}
            onChange={(e) =>
              setFormValues({ ...formValues, price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Số lượng"
            fullWidth
            type="number"
            value={formValues.quantity}
            onChange={(e) =>
              setFormValues({ ...formValues, quantity: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa biến thể này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={confirmDeleteVariant}
            variant="contained"
            color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default ProductVariantsManagement;
