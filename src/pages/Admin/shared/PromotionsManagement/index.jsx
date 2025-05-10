/* eslint-disable import/no-duplicates */
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
// eslint-disable-next-line import/order
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  createPromotion,
  deletePromotion,
  fetchPromotion,
  restorePromotion,
  updatePromotion,
} from "./api";

const PromotionsManagement = () => {
  const [newPromotion, setNewPromotion] = useState({
    code: "",
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
  });
  const [promotions, setPromotions] = useState([]);
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

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const data = await fetchPromotion();
        setPromotions(
          data.map((item, index) => ({
            ...item,
            id: item.id,
            onEdit: handleEdit,
            onDelete: handleDelete,
            onRestoreClick: handleRestore,
          }))
        );
      } catch (err) {
        setSnackbar({ open: true, severity: "error", message: err.message });
      }
    };

    loadPromotions();
  }, []);

  const handleSavePromotion = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (editPromotion) {
        await updatePromotion(editPromotion.id, newPromotion, token);
        setSnackbar({
          open: true,
          severity: "success",
          message: "Cập nhật thành công",
        });
      } else {
        await createPromotion(newPromotion);
        setSnackbar({
          open: true,
          severity: "success",
          message: "Thêm mới thành công",
        });
      }

      setOpenDialog(false);
      setNewPromotion({
        code: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
      });
      setEditPromotion(null);

      const data = await fetchPromotion();
      setPromotions(
        data.map((item) => ({
          ...item,
          id: item.id,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onRestoreClick: handleRestore,
        }))
      );
    } catch (err) {
      setSnackbar({ open: true, severity: "error", message: err.message });
    }
  };

  const handleEdit = (promotion) => {
    setEditPromotion(promotion);
    setNewPromotion(promotion);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await deletePromotion(id, token);
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "inactive" } : p))
      );
      setSnackbar({
        open: true,
        severity: "success",
        message: "Đã ngừng hoạt động khuyến mãi",
      });
    } catch (err) {
      setSnackbar({ open: true, severity: "error", message: err.message });
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await restorePromotion(id, token);
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "active" } : p))
      );
      setSnackbar({
        open: true,
        severity: "success",
        message: "Đã khôi phục khuyến mãi",
      });
    } catch (err) {
      setSnackbar({ open: true, severity: "error", message: err.message });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "code",
      headerName: "Mã khuyến mãi",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "discountPercent",
      headerName: "Giảm giá (%)",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      valueGetter: (params) =>
        params.row?.status === "active" ? "Hoạt động" : "Ngừng hoạt động",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => {
        const { row } = params;
        const isDisabled = row.status !== "active";
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => params.row.onEdit(params.row)}
              title="Chỉnh sửa">
              <EditIcon />
            </IconButton>
            {isDisabled ? (
              <IconButton
                color="success"
                onClick={() => row.onRestoreClick(row.id, row.name)} // Gọi function khôi phục
                title="Khôi phục">
                <RestartAltIcon />
              </IconButton>
            ) : (
              <IconButton
                color="error"
                onClick={() => row.onDelete(row.id)}
                title="Xóa">
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  return (
    <DashboardLayoutWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant="h5" gutterBottom>
          Quản lý khuyến mãi
        </Typography>
        <Box container spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth>
            Thêm khuyến mãi
          </Button>
        </Box>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={promotions}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          localeText={{ noRowsLabel: "Không có dữ liệu" }}
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
          <Button variant="contained" onClick={handleSavePromotion}>
            {editPromotion ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa khuyến mãi này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default PromotionsManagement;
