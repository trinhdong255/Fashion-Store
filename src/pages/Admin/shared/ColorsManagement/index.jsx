import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

const colorMap = {
  cam: "#FFA500", // orange
  vàng: "#FFFF00", // yellow
  đen: "#000000", // black
  trắng: "#FFFFFF", // white
  đỏ: "#d63031",
  "xanh biển": "#0984e3",
  "xanh lá": "#00b894",
  nâu: "#e17055",
  hồng: "#e84393",
};

const ColorsManagement = () => {
  const [colors, setColors] = useState([]);

  // Thêm màu
  const [openModal, setOpenModal] = useState(false);
  const [newColor, setNewColor] = useState("");

  // Sửa màu
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingColorId, setEditingColorId] = useState(null);
  const [editingColorName, setEditingColorName] = useState("");

  // xóa màu
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch("http://localhost:8080/adamstore/v1/colors?pageNo=1&pageSize=10", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi token ở đây
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setColors(data.result.items);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch màu sắc:", err);
      });
  }, []);

  const handleAddColor = () => {
    const token = localStorage.getItem("accessToken");

    fetch("http://localhost:8080/adamstore/v1/colors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newColor }),
    })
      .then((res) => res.json())
      .then((data) => {
        setColors((prev) => [...prev, data.result]);
        setNewColor("");
        setOpenModal(false);
      })
      .catch((err) => {
        console.error("Lỗi khi thêm màu sắc:", err);
      });
  };

  const handleEdit = (id, name) => {
    setEditingColorId(id);
    setEditingColorName(name);
    setEditModalOpen(true);
  };

  const handleUpdateColor = () => {
    const token = localStorage.getItem("accessToken");

    fetch(`http://localhost:8080/adamstore/v1/colors/${editingColorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editingColorName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setColors((prev) =>
          prev.map((color) =>
            color.id === editingColorId ? data.result : color
          )
        );
        setEditModalOpen(false);
        setEditingColorId(null);
        setEditingColorName("");
      })
      .catch((err) => {
        console.error("Lỗi khi sửa màu:", err);
      });
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedColorId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedColorId(null);
  };

  const handleConfirmDelete = () => {
    const token = localStorage.getItem("accessToken");

    fetch(`http://localhost:8080/adamstore/v1/colors/${selectedColorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Xóa không thành công");
        }
        setColors((prev) =>
          prev.filter((color) => color.id !== selectedColorId)
        );
        handleCloseDeleteModal();
      })
      .catch((err) => {
        console.error("Lỗi khi xóa màu:", err);
        showSnackbar("Xảy ra lỗi khi xóa màu!", "error");
      });
  };

  return (
    <DashboardLayoutWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}>
        <Typography variant="h5" gutterBottom>
          Quản lý màu sắc
        </Typography>
        <Button
          sx={{ backgroundColor: "#0984e3", color: "#fff" }}
          onClick={() => setOpenModal(true)}>
          Thêm màu sắc
        </Button>
      </Box>
      <Box sx={{ padding: "0 20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {colors.map((color) => (
              <TableRow key={color.id}>
                <TableCell>{color.name}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor:
                        colorMap[color.name.toLowerCase().trim()] || "#ccc",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(color.id, color.name)}
                    color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteModal(color.id)}
                    color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {openModal && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: 4,
                borderRadius: 2,
                minWidth: 500,
              }}>
              <Typography variant="h6" gutterBottom>
                Thêm màu sắc
              </Typography>
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Nhập tên màu"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  fontSize: "16px",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="contained" onClick={handleAddColor}>
                  Thêm
                </Button>
                <Button onClick={() => setOpenModal(false)} variant="outlined">
                  Hủy
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {/* Sửa */}
        {editModalOpen && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Box
              sx={{
                backgroundColor: "#fff",
                padding: 4,
                borderRadius: 2,
                minWidth: 500,
              }}>
              <Typography variant="h6" gutterBottom>
                Sửa màu sắc
              </Typography>
              <input
                type="text"
                value={editingColorName}
                onChange={(e) => setEditingColorName(e.target.value)}
                placeholder="Tên màu mới"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  fontSize: "16px",
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="contained" onClick={handleUpdateColor}>
                  Lưu
                </Button>
                <Button
                  onClick={() => setEditModalOpen(false)}
                  variant="outlined">
                  Hủy
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa màu này không? Hành động này không thể
              hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteModal}>Hủy</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      ;
    </DashboardLayoutWrapper>
  );
};

export default ColorsManagement;
