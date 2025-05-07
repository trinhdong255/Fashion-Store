import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoriesManagement = () => {
  const [categorys, setCategory] = useState([]);

  // Thêm Category
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState({ name: "", description: "" });
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  // Sửa category
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [editingCategoryDes, setEditingCategoryDes] = useState("");

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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

    fetch(
      "http://localhost:8080/adamstore/v1/categories/admin?pageNo=1&pageSize=10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token ở đây
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA FETCHED:", data);
        setCategory(data.result.items);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch màu sắc:", err);
      });
  }, []);

  const handleAddCategory = () => {
    const nameError = !newCategory.trim() ? "Vui lòng nhập tên danh mục" : "";
    const descriptionError = !newCategoryDescription.trim()
      ? "Vui lòng nhập mô tả"
      : "";

    if (nameError || descriptionError) {
      setError({ name: nameError, description: descriptionError });
      return;
    }

    const token = localStorage.getItem("accessToken");

    fetch("http://localhost:8080/adamstore/v1/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newCategory,
        description: newCategoryDescription, // <== THÊM DÒNG NÀY
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCategory((prev) => [...prev, data.result]);
        setNewCategory("");
        setNewCategoryDescription("");
        setOpenModal(false);
      })
      .catch((err) => {
        console.error("Lỗi khi thêm danh mục:", err);
      });
  };

  const handleEdit = (id, name, description) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
    setEditingCategoryDes(description);
    // console.log("description:", description);
    setEditModalOpen(true);
  };

  const handleUpdateColor = () => {
    const token = localStorage.getItem("accessToken");

    fetch(
      `http://localhost:8080/adamstore/v1/categories/${editingCategoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingCategoryName,
          description: editingCategoryDes,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCategory((prev) =>
          prev.map((category) =>
            category.id === editingCategoryId ? data.result : category
          )
        );
        setEditModalOpen(false);
        setEditingCategoryId(null);
        setEditingCategoryName("");
        setEditingCategoryDes("");
      })
      .catch((err) => {
        console.error("Lỗi khi sửa màu:", err);
      });
  };

  const handleOpenDeleteModal = (id) => {
    setSelectedCategoryId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedCategoryId(null);
  };

  const handleConfirmDelete = () => {
    const token = localStorage.getItem("accessToken");

    fetch(
      `http://localhost:8080/adamstore/v1/categories/${selectedCategoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Xóa không thành công");
        }
        setCategory((prev) =>
          prev.filter((color) => color.id !== selectedCategoryId)
        );
        handleCloseDeleteModal();
      })
      .catch((err) => {
        console.error("Lỗi khi xóa màu:", err);
        showSnackbar("Xảy ra lỗi khi xóa màu!", "error");
      });
  };
  const handleToggleStatus = (id) => {
    const token = localStorage.getItem("accessToken");

    fetch(`http://localhost:8080/adamstore/v1/categories/${id}/restore`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Restore failed");
        return res.json();
      })
      .then((data) => {
        console.log("Restore successful:", data);
        setCategory((prev) =>
          prev.map((cat) =>
            cat.id === id ? { ...cat, status: "ACTIVE" } : cat
          )
        );
      })
      .catch((err) => {
        console.error("Lỗi khi khôi phục danh mục:", err);
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
          Quản lý danh mục
        </Typography>
        <Button
          sx={{ backgroundColor: "#0984e3", color: "#fff" }}
          onClick={() => setOpenModal(true)}>
          Thêm danh mục
        </Button>
      </Box>
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorys.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Switch
                    checked={category.status === "ACTIVE"}
                    onChange={() => handleToggleStatus(category.id)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      handleEdit(
                        category.id,
                        category.name,
                        category.description
                      )
                    }
                    color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteModal(category.id)}
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
              <Typography
                variant="h6"
                sx={{ textAlign: "center" }}
                gutterBottom>
                Thêm danh mục
              </Typography>
              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    if (e.target.value.trim())
                      setError((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Tên danh mục"
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "16px",
                    borderColor: error.name ? "red" : undefined,
                  }}
                />
                {error.name && (
                  <p style={{ color: "red", margin: 0 }}>{error.name}</p>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  value={newCategoryDescription}
                  onChange={(e) => {
                    setNewCategoryDescription(e.target.value);
                    if (e.target.value.trim())
                      setError((prev) => ({ ...prev, description: "" }));
                  }}
                  placeholder="Mô tả"
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "16px",
                    borderColor: error.description ? "red" : undefined,
                  }}
                />
                {error.description && (
                  <p style={{ color: "red", margin: 0 }}>{error.description}</p>
                )}
              </div>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="contained" onClick={handleAddCategory}>
                  Thêm
                </Button>
                <Button onClick={() => setOpenModal(false)} variant="outlined">
                  Hủy
                </Button>
              </Box>
            </Box>
          </Box>
        )}

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
                Sửa danh mục
              </Typography>
              <input
                type="text"
                value={editingCategoryName}
                onChange={(e) => setEditingCategoryName(e.target.value)}
                placeholder="tên danh mục"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "16px",
                  fontSize: "16px",
                }}
              />
              <input
                type="text"
                value={editingCategoryDes}
                onChange={(e) => setEditingCategoryDes(e.target.value)}
                placeholder="mô tả danh mục"
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
              Bạn có chắc chắn muốn xóa danh mục này không
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
    </DashboardLayoutWrapper>
  );
};

export default CategoriesManagement;
