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
} from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { deleteUser, fetchUser, updateUser } from "./api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconButton } from "@mui/material";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên", width: 250 },
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
      field: "actions",
      headerName: "Hành động",
      width: 150,
      renderCell: (params) => {
        const { row } = params;
        const isDisabled = row.status === "Ngưng hoạt động";
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
          onDelete: handleDelete, // bạn cần thêm hàm này
          onRestoreClick: handleRestore, // bạn cần thêm hàm này
        }));
        setUsers(usersWithHandlers);
      } catch (error) {
        console.error("Lỗi khi tải người dùng:", error);
      }
    };

    loadUsers();
  }, []);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
    }
  };

  const handleRestore = (id, name) => {
    console.log("Restore user with id:", id, "name:", name);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUser(selectedUser.id, {
        name: selectedUser.name,
        gender: selectedUser.gender,
        dob: selectedUser.dob, // truyền lại ngày sinh cũ
      });
      const userList = await fetchUser();
      setUsers(userList);
      handleCloseEdit();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý Người dùng
      </Typography>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </div>

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
    </DashboardLayoutWrapper>
  );
};

export default UsersManagement;
