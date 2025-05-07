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
  Grid,
} from "@mui/material";
import axios from "axios";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

const PaymentHistoriesManagement = () => {
  const [paymentHistories, setPaymentHistories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newPaymentHistory, setNewPaymentHistory] = useState({
    order: "",
    paymentMethod: "",
    totalAmount: "",
    paymentStatus: "PAID",
    paymentTime: "",
    note: "",
  });
  const [editPaymentHistory, setEditPaymentHistory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [paymentHistoryToDelete, setPaymentHistoryToDelete] = useState(null);

  // Lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentHistoriesRes = await axios.get(
          "http://localhost:3000/payment-histories"
        );
        setPaymentHistories(paymentHistoriesRes.data);

        const ordersRes = await axios.get("http://localhost:3000/orders");
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "order",
      headerName: "Đơn hàng",
      width: 150,
      valueGetter: (params) => params.row.order?.id || "",
    },
    { field: "paymentMethod", headerName: "Phương thức thanh toán", width: 200 },
    { field: "totalAmount", headerName: "Tổng tiền", width: 120 },
    { field: "paymentStatus", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditPaymentHistory(params.row)}>
            Sửa
          </Button>
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

  const handleAddPaymentHistory = async () => {
    try {
      const paymentHistoryData = {
        orderId: newPaymentHistory.order,
        paymentMethod: newPaymentHistory.paymentMethod,
        totalAmount: parseFloat(newPaymentHistory.totalAmount),
        paymentStatus: newPaymentHistory.paymentStatus,
        paymentTime: newPaymentHistory.paymentTime,
        note: newPaymentHistory.note,
      };
      await axios.post(
        "http://localhost:3000/payment-histories",
        paymentHistoryData
      );
      const response = await axios.get("http://localhost:3000/payment-histories");
      setPaymentHistories(response.data);
      setNewPaymentHistory({
        order: "",
        paymentMethod: "",
        totalAmount: "",
        paymentStatus: "PAID",
        paymentTime: "",
        note: "",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding payment history:", error);
    }
  };

  const handleEditPaymentHistory = (paymentHistory) => {
    setEditPaymentHistory(paymentHistory);
    setNewPaymentHistory({
      order: paymentHistory.order?.id || "",
      paymentMethod: paymentHistory.paymentMethod,
      totalAmount: paymentHistory.totalAmount,
      paymentStatus: paymentHistory.paymentStatus,
      paymentTime: paymentHistory.paymentTime,
      note: paymentHistory.note || "",
    });
    setOpenDialog(true);
  };

  const handleUpdatePaymentHistory = async () => {
    try {
      const paymentHistoryData = {
        orderId: newPaymentHistory.order,
        paymentMethod: newPaymentHistory.paymentMethod,
        totalAmount: parseFloat(newPaymentHistory.totalAmount),
        paymentStatus: newPaymentHistory.paymentStatus,
        paymentTime: newPaymentHistory.paymentTime,
        note: newPaymentHistory.note,
      };
      await axios.put(
        `http://localhost:3000/payment-histories/${editPaymentHistory.id}`,
        paymentHistoryData
      );
      const response = await axios.get("http://localhost:3000/payment-histories");
      setPaymentHistories(response.data);
      setEditPaymentHistory(null);
      setNewPaymentHistory({
        order: "",
        paymentMethod: "",
        totalAmount: "",
        paymentStatus: "PAID",
        paymentTime: "",
        note: "",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating payment history:", error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setPaymentHistoryToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeletePaymentHistory = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/payment-histories/${paymentHistoryToDelete}`
      );
      const response = await axios.get("http://localhost:3000/payment-histories");
      setPaymentHistories(response.data);
      setOpenDeleteDialog(false);
      setPaymentHistoryToDelete(null);
    } catch (error) {
      console.error("Error deleting payment history:", error);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Lịch sử Thanh toán
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}></Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm lịch sử thanh toán
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={paymentHistories}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      {/* Dialog thêm/sửa lịch sử thanh toán */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editPaymentHistory ? "Sửa lịch sử thanh toán" : "Thêm lịch sử thanh toán"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Đơn hàng</InputLabel>
            <Select
              value={newPaymentHistory.order}
              onChange={(e) =>
                setNewPaymentHistory({ ...newPaymentHistory, order: e.target.value })
              }
              label="Đơn hàng"
            >
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  {order.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Phương thức thanh toán"
            value={newPaymentHistory.paymentMethod}
            onChange={(e) =>
              setNewPaymentHistory({
                ...newPaymentHistory,
                paymentMethod: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Tổng tiền"
            type="number"
            value={newPaymentHistory.totalAmount}
            onChange={(e) =>
              setNewPaymentHistory({
                ...newPaymentHistory,
                totalAmount: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newPaymentHistory.paymentStatus}
              onChange={(e) =>
                setNewPaymentHistory({
                  ...newPaymentHistory,
                  paymentStatus: e.target.value,
                })
              }
              label="Trạng thái"
            >
              <MenuItem value="PAID">PAID</MenuItem>
              <MenuItem value="REFUNDED">REFUNDED</MenuItem>
              <MenuItem value="CANCELED">CANCELED</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Thời gian thanh toán"
            type="datetime-local"
            value={newPaymentHistory.paymentTime}
            onChange={(e) =>
              setNewPaymentHistory({
                ...newPaymentHistory,
                paymentTime: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ghi chú"
            value={newPaymentHistory.note}
            onChange={(e) =>
              setNewPaymentHistory({ ...newPaymentHistory, note: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={
              editPaymentHistory
                ? handleUpdatePaymentHistory
                : handleAddPaymentHistory
            }
            variant="contained"
          >
            {editPaymentHistory ? "Cập nhật" : "Thêm"}
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
            Bạn có chắc chắn muốn xóa lịch sử thanh toán này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeletePaymentHistory}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayoutWrapper>
  );
};

export default PaymentHistoriesManagement;