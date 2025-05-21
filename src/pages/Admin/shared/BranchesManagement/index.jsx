import { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
} from "@mui/material";
import axios from "axios";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const BranchesManagement = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    name: "",
    location: "",
    phone: "",
  });
  const [editBranch, setEditBranch] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  // Lấy danh sách chi nhánh
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/adamstore/v1/branches/admin",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { pageNo: 1, pageSize: 10 },
          }
        );
        console.log("Branches:", response.data);
        setBranches(response.data.result.items || []);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Tính toán rows động với useMemo
  const rows = useMemo(() => {
    return branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      location: branch.location,
      phone: branch.phone,
      status: branch.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động",
      onEdit: () => handleEditBranch(branch),
      onDelete: () => handleOpenDeleteDialog(branch.id),
      onRestoreClick: () => handleToggleStatus(branch.id),
    }));
  }, [branches]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "location", headerName: "Địa điểm", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => params.row.status,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 200,
      renderCell: (params) => {
        const { row } = params;
        const isDisabled = row.status === "Ngừng hoạt động";
        return (
          <>
            <IconButton color="primary" onClick={row.onEdit} title="Chỉnh sửa">
              <EditIcon />
            </IconButton>
            {isDisabled ? (
              <IconButton
                color="success"
                onClick={row.onRestoreClick}
                title="Khôi phục">
                <RestartAltIcon />
              </IconButton>
            ) : (
              <IconButton color="error" onClick={row.onDelete} title="Xóa">
                <DeleteIcon />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  const handleAddBranch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      await axios.post(
        "http://localhost:8080/adamstore/v1/branches",
        {
          name: newBranch.name,
          location: newBranch.location,
          phone: newBranch.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.get(
        "http://localhost:8080/adamstore/v1/branches/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageNo: 1, pageSize: 10 },
        }
      );
      setBranches(response.data.result.items || []);
      setNewBranch({ name: "", location: "", phone: "" });
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
    });
    setOpenDialog(true);
  };

  const handleUpdateBranch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      await axios.put(
        `http://localhost:8080/adamstore/v1/branches/${editBranch.id}`,
        {
          name: newBranch.name,
          location: newBranch.location,
          phone: newBranch.phone,
          status: editBranch.status, // Giữ trạng thái hiện tại khi sửa
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.get(
        "http://localhost:8080/adamstore/v1/branches/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageNo: 1, pageSize: 10 },
        }
      );

      setBranches(response.data.result.items || []);
      setEditBranch(null);
      setNewBranch({ name: "", location: "", phone: "" });
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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      await axios.delete(
        `http://localhost:8080/adamstore/v1/branches/${branchToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.get(
        "http://localhost:8080/adamstore/v1/branches/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageNo: 1, pageSize: 10 },
        }
      );
      setBranches(response.data.result.items || []);
      setOpenDeleteDialog(false);
      setBranchToDelete(null);
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const branch = branches.find((b) => b.id === id);
      const isRestoring = branch.status === "INACTIVE";

      await axios.patch(
        `http://localhost:8080/adamstore/v1/branches/${id}/${
          isRestoring ? "restore" : "deactivate"
        }`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.get(
        "http://localhost:8080/adamstore/v1/branches/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageNo: 1, pageSize: 10 },
        }
      );
      setBranches(response.data.result.items || []);
    } catch (error) {
      console.error("Error toggling branch status:", error);
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
            fullWidth>
            Thêm chi nhánh
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
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
          {editBranch && (
            <TextField
              label="Trạng thái"
              value={
                editBranch.status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"
              }
              onChange={(e) =>
                setNewBranch({
                  ...newBranch,
                  status:
                    e.target.value === "Hoạt động" ? "ACTIVE" : "INACTIVE",
                })
              }
              select
              fullWidth
              sx={{ mt: 2 }}
              SelectProps={{
                native: true,
              }}>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Ngừng hoạt động">Ngừng hoạt động</option>
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={editBranch ? handleUpdateBranch : handleAddBranch}
            variant="contained">
            {editBranch ? "Cập nhật" : "Thêm"}
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
            Bạn có chắc chắn muốn xóa chi nhánh này không? Hành động này không
            thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDeleteBranch}
            color="error"
            variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayoutWrapper>
  );
};

export default BranchesManagement;
