/* eslint-disable import/order */
/* eslint-disable import/no-duplicates */
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  createUser,
  deleteUser,
  fetchUser,
  restoreUser,
  updateUser,
} from "./api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconButton } from "@mui/material";

const paginationModel = { page: 0, pageSize: 5 };
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [openModalAdd, setOpenModalAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 200 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "dob",
      headerName: "Ngày sinh",
      width: 150,
      disableColumnMenu: true,
      sortable: false,

      renderCell: (params) => {
        const dob = params.value;
        if (!dob) return "Không có dữ liệu";
        const date = new Date(dob);
        return date.toLocaleDateString("vi-VN");
      },
    },
    {
      field: "gender",
      headerName: "Giới tính",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const gender = params.value;
        if (gender === "MALE") return "Nam";
        if (gender === "FEMALE") return "Nữ";
        return "Không có dữ liệu";
      },
    },
    {
      field: "role",
      headerName: "Vai trò",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        const roles = params.row.roles;
        const roleName = roles?.[0]?.name;
        if (roleName === "ADMIN") return "Quản lý";
        if (roleName === "USER") return "Người dùng";
        return "Không có dữ liệu";
      },
    },
    {
      field: "actions",
      headerName: "Hành động",
      disableColumnMenu: true,
      sortable: false,
      width: 150,
      renderCell: (params) => {
        const { row } = params;
        const isDisabled = row.status === "INACTIVE";
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

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userList = await fetchUser();
        const usersWithHandlers = userList.map((u) => ({
          ...u,
          onEdit: handleEditClick,
          onDelete: handleDelete,
          onRestoreClick: handleRestore,
        }));
        setUsers(usersWithHandlers);
      } catch (error) {
        console.error("Lỗi khi tải người dùng:", error);
      }
    };

    loadUsers();
  }, []);

  const handleOpenModalAdd = () => setOpenModalAdd(true);
  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
    setNewUser({ name: "", email: "", password: "", role: "" });
    setErrors({});
  };

  const handleAddUser = async () => {
    try {
      // Validate
      const err = {};
      if (!newUser.name) err.name = "Tên không được để trống";
      if (!newUser.email) err.email = "Email không được để trống";
      if (!newUser.password) err.password = "Mật khẩu không được để trống";
      if (!newUser.role) err.role = "Vai trò không được để trống";
      setErrors(err);
      if (Object.keys(err).length > 0) return;

      await createUser(newUser);
      const updatedUsers = await fetchUser();
      const usersWithHandlers = updatedUsers.map((u) => ({
        ...u,
        onEdit: handleEditClick,
        onDelete: handleDelete,
        onRestoreClick: handleRestore,
      }));
      setUsers(usersWithHandlers);
      handleCloseModalAdd();
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedUser(null);
  };
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await deleteUser(id, token);
      console.log("Đã xóa user có id:", id);

      const updatedUsers = await fetchUser();

      // Gán lại các hàm cho từng user mới
      const usersWithHandlers = updatedUsers.map((u) => ({
        ...u,
        onEdit: handleEditClick,
        onDelete: handleDelete,
        onRestoreClick: handleRestore,
      }));

      setUsers(usersWithHandlers);
      showSnackbar("Xóa thành công", "success");
    } catch (error) {
      // console.error("Lỗi khi xóa user:", error);
      showSnackbar("Lỗi khi xóa user:", "error");
    }
  };

  const handleRestore = async (id, name) => {
    try {
      const token = localStorage.getItem("accessToken");
      await restoreUser(id, token);
      showSnackbar(`Đã khôi phục người dùng "${name}"`, "success");

      const updatedUsers = await fetchUser();
      const usersWithHandlers = updatedUsers.map((u) => ({
        ...u,
        onEdit: handleEditClick,
        onDelete: handleDelete,
        onRestoreClick: handleRestore,
      }));
      setUsers(usersWithHandlers);
    } catch (error) {
      console.error("Lỗi khi khôi phục người dùng:", error);
      showSnackbar("Lỗi khi khôi phục người dùng", "error");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateUser(selectedUser.id, {
        name: selectedUser.name,
        gender: selectedUser.gender,
        dob: selectedUser.dob,
        role: selectedUser.role,
      });

      const userList = await fetchUser();

      const usersWithHandlers = userList.map((u) => ({
        ...u,
        onEdit: handleEditClick,
        onDelete: handleDelete,
        onRestoreClick: handleRestore,
      }));

      setUsers(usersWithHandlers);
      handleCloseEdit();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      showSnackbar("Lỗi cập nhật:", "error");
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}>
        <Typography variant="h5" gutterBottom>
          Quản lý Người dùng
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={handleOpenModalAdd}>
          Thêm người dùng
        </Button>
      </Box>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id}
          initialState={{ pagination: { paginationModel } }}
          rowsPerPageOptions={[5, 10]}
          disableSelectionOnClick
        />
      </div>
      <Dialog open={openModalAdd} onClose={handleCloseModalAdd}>
        <DialogTitle>Thêm người dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            fullWidth
            margin="dense"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Mật khẩu"
            fullWidth
            type="password"
            margin="dense"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="Vai trò"
            fullWidth
            select
            margin="dense"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            error={!!errors.role}
            helperText={errors.role}>
            <MenuItem value="USER">Người dùng</MenuItem>
            <MenuItem value="ADMIN">Quản lý</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalAdd}>Hủy</Button>
          <Button onClick={handleAddUser} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openModalAdd} onClose={handleCloseModalAdd}>
        <DialogTitle>Thêm người dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            fullWidth
            margin="dense"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Mật khẩu"
            fullWidth
            type="password"
            margin="dense"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            label="Vai trò"
            fullWidth
            select
            margin="dense"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            error={!!errors.role}
            helperText={errors.role}>
            <MenuItem value="USER">Người dùng</MenuItem>
            <MenuItem value="ADMIN">Quản lý</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModalAdd}>Hủy</Button>
          <Button onClick={handleAddUser} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Tên"
            value={selectedUser?.name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label="Ngày sinh"
            type="date"
            value={selectedUser?.dob?.split("T")[0] || ""} // chỉ lấy yyyy-MM-dd
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, dob: e.target.value })
            }
            InputLabelProps={{
              shrink: true, // để label không đè lên
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Giới tính"
            select
            value={selectedUser?.gender || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, gender: e.target.value })
            }>
            <MenuItem value="MALE">Nam</MenuItem>
            <MenuItem value="FEMALE">Nữ</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Hủy</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayoutWrapper>
  );
};

export default UsersManagement;
