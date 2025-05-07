import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListProductsQuery } from "@/services/api/product";
import {
  useListProductVariantsQuery,
  useUpdateProductVariantMutation,
} from "@/services/api/productVariant";
import { useGetMyInfoQuery } from "@/services/api/auth";
import {
  setVariants,
  setLoading as setVariantLoading,
  setError as setVariantError,
  selectVariants,
  selectLoading as selectVariantLoading,
  selectError as selectVariantError,
} from "@/store/redux/productVariant/reducer";

const ProductVariantsManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const variants = useSelector(selectVariants);
  const variantLoading = useSelector(selectVariantLoading);
  const variantError = useSelector(selectVariantError);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [editVariant, setEditVariant] = useState(null);
  const [newVariant, setNewVariant] = useState({
    price: "",
    quantity: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: userInfo, error: userError, isLoading: userLoading } = useGetMyInfoQuery();
  const {
    data: productsData,
    isLoading: isFetchingProducts,
    error: fetchProductsError,
  } = useListProductsQuery({ pageNo: 1, pageSize: 50 });
  const {
    data: variantsData,
    isLoading: isFetchingVariants,
    error: fetchVariantsError,
    refetch: refetchVariants,
  } = useListProductVariantsQuery(
    selectedProductId
      ? { productId: selectedProductId, pageNo: page + 1, pageSize }
      : { skip: true }
  );

  const [updateProductVariant] = useUpdateProductVariantMutation();

  useEffect(() => {
    dispatch(setVariantLoading(isFetchingVariants));
    if (fetchVariantsError) {
      const errorMessage = fetchVariantsError?.data?.message || "Lỗi khi tải biến thể sản phẩm";
      dispatch(setVariantError(errorMessage));
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } else if (variantsData?.items) {
      dispatch(setVariants(variantsData.items));
      dispatch(setVariantError(null));
    }
  }, [variantsData, isFetchingVariants, fetchVariantsError, dispatch]);

  useEffect(() => {
    if (fetchProductsError) {
      setSnackbar({
        open: true,
        message: "Lỗi khi tải danh sách sản phẩm: " + (fetchProductsError?.data?.message || "Không xác định"),
        severity: "error",
      });
    }
  }, [fetchProductsError]);

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
      width: 150,
      renderCell: (params) => (
        <Button variant="text" color="primary" onClick={() => handleEditVariant(params.row)}>
          Sửa
        </Button>
      ),
    },
  ];

  const handleEditVariant = (variant) => {
    setEditVariant(variant);
    setNewVariant({
      price: variant.price?.toString() || "",
      quantity: variant.quantity?.toString() || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditVariant(null);
    setNewVariant({
      price: "",
      quantity: "",
    });
  };

  const validateVariantData = (variant) => {
    const errors = [];
    if (!variant.price || isNaN(parseFloat(variant.price))) errors.push("Giá không hợp lệ");
    if (!variant.quantity || isNaN(parseInt(variant.quantity))) errors.push("Số lượng không hợp lệ");
    return errors;
  };

  const handleUpdateVariant = async () => {
    const errors = validateVariantData(newVariant);
    if (errors.length > 0) {
      setSnackbar({
        open: true,
        message: errors.join(". "),
        severity: "error",
      });
      return;
    }

    try {
      await updateProductVariant({
        id: editVariant.id,
        price: parseFloat(newVariant.price),
        quantity: parseInt(newVariant.quantity),
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Cập nhật biến thể thành công!",
        severity: "success",
      });
      handleCloseDialog();
      refetchVariants();
    } catch (error) {
      const errorMessage = error.status === 404
        ? "Backend không có endpoint PUT /adamstore/v1/product-variants/:id. Vui lòng liên hệ team backend!"
        : error.status === 405
        ? "Backend không hỗ trợ phương thức PUT. Vui lòng liên hệ team backend!"
        : Array.isArray(error.data?.errors)
        ? error.data.errors.join(". ")
        : error.data?.message || "Lỗi khi cập nhật biến thể";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (userLoading || isFetchingProducts) {
    return <CircularProgress />;
  }

  const totalRows = variantsData?.totalItems || 0;

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Biến thể Sản phẩm
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Chọn sản phẩm</InputLabel>
        <Select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          label="Chọn sản phẩm"
        >
          <MenuItem value="">-- Chọn sản phẩm --</MenuItem>
          {productsData?.items?.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!selectedProductId ? (
        <Alert severity="info">Vui lòng chọn một sản phẩm để xem biến thể.</Alert>
      ) : fetchVariantsError ? (
        <Alert severity="error">{fetchVariantsError?.data?.message || "Lỗi khi tải biến thể"}</Alert>
      ) : variants.length === 0 ? (
        <Alert severity="info">Sản phẩm này không có biến thể nào.</Alert>
      ) : (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={variants}
            columns={columns}
            rowCount={totalRows}
            paginationMode="server"
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.id}
            disableSelectionOnClick
            aria-label="Bảng biến thể sản phẩm"
            localeText={{
              noRowsLabel: "Không có dữ liệu",
            }}
          />
        </div>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Sửa biến thể</DialogTitle>
        <DialogContent>
          <TextField
            label="Giá"
            type="number"
            value={newVariant.price}
            onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
          <TextField
            label="Số lượng"
            type="number"
            value={newVariant.quantity}
            onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleUpdateVariant} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default ProductVariantsManagement;