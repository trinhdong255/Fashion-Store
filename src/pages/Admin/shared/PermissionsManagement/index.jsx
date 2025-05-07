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

const PermissionsManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({
    name: "",
    module: "",
    apiPath: "",
    method: "GET",
  });
  const [editPermission, setEditPermission] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);

  // Lấy danh sách quyền hạn
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/permissions");
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên quyền", width: 150 },
    { field: "module", headerName: "Module", width: 120 },
    { field: "apiPath", headerName: "Đường dẫn API", width: 150 },
    { field: "method", headerName: "Phương thức", width: 120 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditPermission(params.row)}>Sửa</Button>
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

  const handleAddPermission = async () => {
    try {
      await axios.post("http://localhost:3000/permissions", newPermission);
      const response = await axios.get("http://localhost:3000/permissions");
      setPermissions(response.data);
      setNewPermission({ name: "", module: "", apiPath: "", method: "GET" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding permission:", error);
    }
  };

  const handleEditPermission = (permission) => {
    setEditPermission(permission);
    setNewPermission({
      name: permission.name,
      module: permission.module,
      apiPath: permission.apiPath,
      method: permission.method,
    });
    setOpenDialog(true);
  };

  const handleUpdatePermission = async () => {
    try {
      await axios.put(
        `http://localhost:3000/permissions/${editPermission.id}`,
        newPermission
      );
      const response = await axios.get("http://localhost:3000/permissions");
      setPermissions(response.data);
      setEditPermission(null);
      setNewPermission({ name: "", module: "", apiPath: "", method: "GET" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setPermissionToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeletePermission = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/permissions/${permissionToDelete}`
      );
      const response = await axios.get("http://localhost:3000/permissions");
      setPermissions(response.data);
      setOpenDeleteDialog(false);
      setPermissionToDelete(null);
    } catch (error) {
      console.error("Error deleting permission:", error);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Quyền hạn
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}></Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm quyền hạn
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={permissions}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      {/* Dialog thêm/sửa quyền hạn */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editPermission ? "Sửa quyền hạn" : "Thêm quyền hạn"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên quyền"
            value={newPermission.name}
            onChange={(e) =>
              setNewPermission({ ...newPermission, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Module"
            value={newPermission.module}
            onChange={(e) =>
              setNewPermission({ ...newPermission, module: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Đường dẫn API"
            value={newPermission.apiPath}
            onChange={(e) =>
              setNewPermission({ ...newPermission, apiPath: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Phương thức</InputLabel>
            <Select
              value={newPermission.method}
              onChange={(e) =>
                setNewPermission({ ...newPermission, method: e.target.value })
              }
              label="Phương thức"
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={
              editPermission ? handleUpdatePermission : handleAddPermission
            }
            variant="contained"
          >
            {editPermission ? "Cập nhật" : "Thêm"}
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
            Bạn có chắc chắn muốn xóa quyền hạn này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeletePermission}
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

export default PermissionsManagement;
