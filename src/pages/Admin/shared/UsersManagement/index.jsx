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

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "ACTIVE",
  });
  const [editUser, setEditUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách vai trò
        const rolesRes = await axios.get("http://localhost:3000/roles");
        setRoles(rolesRes.data);

        // Lấy danh sách người dùng
        const usersRes = await axios.get("http://localhost:3000/users", {
          params: {
            search: searchUser || undefined,
            role: filterRole || undefined,
          },
        });
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchUser, filterRole]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "role",
      headerName: "Vai trò",
      width: 150,
      valueGetter: (params) =>
        params.row.roles?.map((role) => role.name).join(", ") || "",
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditUser(params.row)}>Sửa</Button>
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

  const handleAddUser = async () => {
    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        roleIds: [newUser.role], // Giả sử API yêu cầu gửi danh sách role IDs
        status: newUser.status,
      };
      await axios.post("http://localhost:3000/users", userData);
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
      setNewUser({ name: "", email: "", role: "", status: "ACTIVE" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.roles?.[0]?.id || "",
      status: user.status,
    });
    setOpenDialog(true);
  };

  const handleUpdateUser = async () => {
    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        roleIds: [newUser.role],
        status: newUser.status,
      };
      await axios.put(`http://localhost:3000/users/${editUser.id}`, userData);
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
      setEditUser(null);
      setNewUser({ name: "", email: "", role: "", status: "ACTIVE" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setUserToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/${userToDelete}`);
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Người dùng
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tìm kiếm người dùng"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              label="Vai trò"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm người dùng
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      {/* Dialog thêm/sửa người dùng */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editUser ? "Sửa người dùng" : "Thêm người dùng"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              label="Vai trò"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
              label="Trạng thái"
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={editUser ? handleUpdateUser : handleAddUser}
            variant="contained"
          >
            {editUser ? "Cập nhật" : "Thêm"}
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
          <Typography>Bạn có chắc chắn muốn xóa người dùng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteUser}
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

export default UsersManagement;