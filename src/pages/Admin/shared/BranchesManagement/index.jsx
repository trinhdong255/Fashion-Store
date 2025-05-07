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

const BranchesManagement = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    phone: "",
    status: "ACTIVE",
  });
  const [editBranch, setEditBranch] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  // Lấy danh sách chi nhánh
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:3000/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "location", headerName: "Địa điểm", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEditBranch(params.row)}>Sửa</Button>
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

  const handleAddBranch = async () => {
    try {
      await axios.post("http://localhost:3000/branches", newBranch);
      const response = await axios.get("http://localhost:3000/branches");
      setBranches(response.data);
      setNewBranch({ name: "", location: "", phone: "", status: "ACTIVE" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const handleEditBranch = (branch) => {
    setEditBranch(branch);
    setNewBranch({
      name: branch.name,
      location: branch.location,
      phone: branch.phone,
      status: branch.status,
    });
    setOpenDialog(true);
  };

  const handleUpdateBranch = async () => {
    try {
      await axios.put(
        `http://localhost:3000/branches/${editBranch.id}`,
        newBranch
      );
      const response = await axios.get("http://localhost:3000/branches");
      setBranches(response.data);
      setEditBranch(null);
      setNewBranch({ name: "", location: "", phone: "", status: "ACTIVE" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating branch:", error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setBranchToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteBranch = async () => {
    try {
      await axios.delete(`http://localhost:3000/branches/${branchToDelete}`);
      const response = await axios.get("http://localhost:3000/branches");
      setBranches(response.data);
      setOpenDeleteDialog(false);
      setBranchToDelete(null);
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Chi nhánh
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={9}></Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Thêm chi nhánh
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={branches}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

      {/* Dialog thêm/sửa chi nhánh */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editBranch ? "Sửa chi nhánh" : "Thêm chi nhánh"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={newBranch.name}
            onChange={(e) =>
              setNewBranch({ ...newBranch, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Địa điểm"
            value={newBranch.location}
            onChange={(e) =>
              setNewBranch({ ...newBranch, location: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Số điện thoại"
            value={newBranch.phone}
            onChange={(e) =>
              setNewBranch({ ...newBranch, phone: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newBranch.status}
              onChange={(e) =>
                setNewBranch({ ...newBranch, status: e.target.value })
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
            onClick={editBranch ? handleUpdateBranch : handleAddBranch}
            variant="contained"
          >
            {editBranch ? "Cập nhật" : "Thêm"}
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
          <Typography>Bạn có chắc chắn muốn xóa chi nhánh này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteBranch}
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

export default BranchesManagement;