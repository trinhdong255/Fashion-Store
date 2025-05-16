/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddressListForUser = ({ id }) => {
  const [addresses, setAddresses] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        `http://222.255.119.40:8080/adamstore/v1/users/addresses?pageNo=1&pageSize=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const addressList = res.data.result.items || [];
      const detailedAddresses = addressList.map((addr) => ({
        ...addr,
        fullAddress: `${addr.streetDetail}, ${addr.ward?.name || 'Không xác định'}, ${addr.district?.name || 'Không xác định'}, ${addr.province?.name || 'Không xác định'}`,
      }));
      setAddresses(detailedAddresses);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setSnackbar({
        open: true,
        message: "Lỗi khi lấy danh sách địa chỉ!",
        severity: "error",
      });
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await axios.patch(
        `http://222.255.119.40:8080/adamstore/v1/addresses/${addressId}`,
        { invisible: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Xóa địa chỉ thành công!",
        severity: "success",
      });
      fetchAddresses();
    } catch (err) {
      console.error("Lỗi khi xóa địa chỉ:", err);
      setSnackbar({
        open: true,
        message: "Xóa địa chỉ thất bại!",
        severity: "error",
      });
    }
  };

  const handleUpdateRedirect = (id) => {
    navigate(`/accountInform/address/${id}`);
  };

  useEffect(() => {
    if (!token || !id) return;
    fetchAddresses();
  }, [token, id]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: "100%", pt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Danh sách địa chỉ
      </Typography>
      {addresses.length === 0 ? (
        <Typography>Chưa có địa chỉ nào.</Typography>
      ) : (
        <Stack spacing={2}>
          {addresses.map((addr) => (
            <Box
              key={addr.id}
              sx={{
                border: "1px solid #ccc",
                p: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography>{addr.fullAddress}</Typography>
                <Typography>Số điện thoại: {addr.phone}</Typography>
                {addr.isDefault && (
                  <Typography color="primary">[Địa chỉ mặc định]</Typography>
                )}
                {addr.status === "ACTIVE" ? (
                  <Typography color="success">Hoạt động</Typography>
                ) : (
                  <Typography color="error">Không hoạt động</Typography>
                )}
              </Box>
              <Box>
                <IconButton onClick={() => handleUpdateRedirect(addr.id)} disabled={addr.invisible}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(addr.id)} disabled={addr.invisible}>
                  <Delete color="error" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "var(--footer-background-color)", padding: "12px 24px" }}
          onClick={() => navigate(`/accountInform/address/${id}/new`)}
        >
          Thêm địa chỉ mới
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddressListForUser;