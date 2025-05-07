import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newOrder, setNewOrder] = useState({
    user: "",
    totalPrice: "",
    orderStatus: "PENDING",
  });
  const [editOrder, setEditOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get("http://localhost:3000/orders");
        setOrders(ordersRes.data);

        const usersRes = await axios.get("http://localhost:3000/users");
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      headerName: "Người dùng",
      width: 150,
      valueGetter: (params) => params.row.user?.name || "",
    },
    { field: "totalPrice", headerName: "Tổng tiền", width: 120 },
    { field: "orderStatus", headerName: "Trạng thái", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditOrder(params.row)}>Sửa</Button>
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

  const handleAddOrder = async () => {
    try {
      const orderData = {
        userId: newOrder.user,
        totalPrice: parseFloat(newOrder.totalPrice),
        orderStatus: newOrder.orderStatus,
      };
      await axios.post("http://localhost:3000/orders", orderData);
      const response = await axios.get("http://localhost:3000/orders");
      setOrders(response.data);
      setNewOrder({ user: "", totalPrice: "", orderStatus: "PENDING" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setNewOrder({
      user: order.user?.id || "",
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
    });
    setOpenDialog(true);
  };

  const handleUpdateOrder = async () => {
    try {
      const orderData = {
        userId: newOrder.user,
        totalPrice: parseFloat(newOrder.totalPrice),
        orderStatus: newOrder.orderStatus,
      };
      await axios.put(`http://localhost:3000/orders/${editOrder.id}`, orderData);
      const response = await axios.get("http://localhost:3000/orders");
      setOrders(response.data);
      setEditOrder(null);
      setNewOrder({ user: "", totalPrice: "", orderStatus: "PENDING" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setOrderToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`http://localhost:3000/orders/${orderToDelete}`);
      const response = await axios.get("http://localhost:3000/orders");
      setOrders(response.data);
      setOpenDeleteDialog(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Đơn hàng
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}></Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm đơn hàng
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      {/* Dialog thêm/sửa đơn hàng */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editOrder ? "Sửa đơn hàng" : "Thêm đơn hàng"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Người dùng</InputLabel>
            <Select
              value={newOrder.user}
              onChange={(e) =>
                setNewOrder({ ...newOrder, user: e.target.value })
              }
              label="Người dùng"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Tổng tiền"
            type="number"
            value={newOrder.totalPrice}
            onChange={(e) =>
              setNewOrder({ ...newOrder, totalPrice: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newOrder.orderStatus}
              onChange={(e) =>
                setNewOrder({ ...newOrder, orderStatus: e.target.value })
              }
              label="Trạng thái"
            >
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="PROCESSING">PROCESSING</MenuItem>
              <MenuItem value="SHIPPED">SHIPPED</MenuItem>
              <MenuItem value="DELIVERED">DELIVERED</MenuItem>
              <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={editOrder ? handleUpdateOrder : handleAddOrder}
            variant="contained"
          >
            {editOrder ? "Cập nhật" : "Thêm"}
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
          <Typography>Bạn có chắc chắn muốn xóa đơn hàng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteOrder}
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

export default OrdersManagement;