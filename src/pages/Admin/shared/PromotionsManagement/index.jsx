import React, { useState } from "react";
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
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  useListPromotionsQuery,
  useAddPromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} from "@/services/api/promotion";

const PromotionsManagement = () => {
  const { data, isLoading, error } = useListPromotionsQuery();
  const [addPromotion] = useAddPromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [deletePromotion] = useDeletePromotionMutation();

  const [newPromotion, setNewPromotion] = useState({
    code: "",
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
  });
  const [editPromotion, setEditPromotion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "code", headerName: "Mã khuyến mãi", width: 150 },
    { field: "description", headerName: "Mô tả", width: 200 },
    { field: "discountPercent", headerName: "Giảm giá (%)", width: 120 },
    { field: "startDate", headerName: "Ngày bắt đầu", width: 150 },
    { field: "endDate", headerName: "Ngày kết thúc", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditPromotion(params.row)}>Sửa</Button>
          <Button
            onClick={() => handleOpenDeleteDialog(params.row.id)}
            color="error"
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  const handleAddPromotion = async () => {
    try {
      const promotionData = {
        ...newPromotion,
        discountPercent: parseFloat(newPromotion.discountPercent),
      };
      await addPromotion(promotionData).unwrap();
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Thêm khuyến mãi thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Lỗi khi thêm khuyến mãi: " + (error.data?.message || error.message),
      });
    }
  };

  const handleEditPromotion = (promotion) => {
    setEditPromotion(promotion);
    setNewPromotion({
      code: promotion.code,
      description: promotion.description || "",
      discountPercent: promotion.discountPercent,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
    });
    setOpenDialog(true);
  };

  const handleUpdatePromotion = async () => {
    try {
      const promotionData = {
        ...newPromotion,
        discountPercent: parseFloat(newPromotion.discountPercent),
      };
      await updatePromotion({
        id: editPromotion.id,
        ...promotionData,
      }).unwrap();
      setEditPromotion(null);
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Cập nhật khuyến mãi thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Lỗi khi cập nhật khuyến mãi: " +
          (error.data?.message || error.message),
      });
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setPromotionToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeletePromotion = async () => {
    try {
      await deletePromotion(promotionToDelete).unwrap();
      setOpenDeleteDialog(false);
      setPromotionToDelete(null);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xóa khuyến mãi thành công!",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          "Lỗi khi xóa khuyến mãi: " + (error.data?.message || error.message),
      });
    }
  };

  const rows = data?.items || [];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý khuyến mãi
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}></Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm khuyến mãi
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" gutterBottom>
          Lỗi khi tải dữ liệu:{" "}
          {error.data?.message || "Không thể kết nối đến server"}
        </Typography>
      )}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={isLoading}
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
        />
      </div>

      {/* Dialog thêm/sửa khuyến mãi */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editPromotion ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Mã khuyến mãi"
            value={newPromotion.code}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, code: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Mô tả"
            value={newPromotion.description}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, description: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Giảm giá (%)"
            type="number"
            value={newPromotion.discountPercent}
            onChange={(e) =>
              setNewPromotion({
                ...newPromotion,
                discountPercent: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={newPromotion.startDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, startDate: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={newPromotion.endDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, endDate: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={editPromotion ? handleUpdatePromotion : handleAddPromotion}
            variant="contained"
          >
            {editPromotion ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khuyến mãi này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeletePromotion}
            color="error"
            variant="contained"
          >
            Xóa
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

export default PromotionsManagement;
