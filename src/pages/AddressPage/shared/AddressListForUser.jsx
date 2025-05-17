/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as DialogTextField,
  FormControl,
  InputLabel,
  Select as DialogSelect,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [city, setCity] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [streetDetail, setStreetDetail] = useState("");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);
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
        fullAddress: `${addr.streetDetail}, ${
          addr.ward?.name || "Không xác định"
        }, ${addr.district?.name || "Không xác định"}, ${
          addr.province?.name || "Không xác định"
        }`,
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
        `http://222.255.119.40:8080/adamstore/v1/addresses/${addressId}/hide`,
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

  const handleEdit = (address) => {
    setEditAddress(address);
    setSelectedCity(address.province.id ? address.province.id.toString() : "");
    setSelectedDistrict(address.district.id ? address.district.id.toString() : "");
    setWard(address.ward.code || "");
    setStreetDetail(address.streetDetail || "");
    setPhone(address.phone || "");
    setIsDefault(address.isDefault || false);
    setEditDialogOpen(true);

    // Fetch updated city, district, and ward lists
    axios
      .get("https://222.255.119.40/adamstore/v1/provinces?pageNo=1&pageSize=63", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const cities = res.data.result.items || [];
        setCity(cities);
        if (address.province.id && !cities.some((c) => c.id === address.province.id)) {
          console.warn("Province ID not found in fetched data:", address.province.id);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách tỉnh/thành:", err));

    if (address.province.id) {
      axios
        .get(
          `http://222.255.119.40:8080/adamstore/v1/provinces/${address.province.id}/districts?pageNo=1&pageSize=30`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          const districtsList = res.data.result.items || [];
          setDistricts(districtsList);
          if (address.district.id && !districtsList.some((d) => d.id === address.district.id)) {
            console.warn("District ID not found in fetched data:", address.district.id);
          }
        })
        .catch((err) => console.error("Lỗi khi lấy danh sách quận/huyện:", err));
    }

    if (address.district.id) {
      axios
        .get(
          `http://222.255.119.40:8080/adamstore/v1/districts/${address.district.id}/wards?pageNo=1&pageSize=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          const wardsList = res.data.result.items || [];
          setWards(wardsList);
          if (address.ward.code && !wardsList.some((w) => w.code === address.ward.code)) {
            console.warn("Ward code not found in fetched data:", address.ward.code);
          }
        })
        .catch((err) => console.error("Lỗi khi lấy danh sách phường/xã:", err));
    }
  };

  const handleUpdate = async () => {
    if (!selectedCity || !selectedDistrict || !ward || !streetDetail || !phone) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin địa chỉ!",
        severity: "error",
      });
      return;
    }

    const data = {
      streetDetail,
      wardCode: ward,
      districtId: selectedDistrict,
      provinceId: selectedCity,
      phone,
      isDefault: !!isDefault, // Ensure isDefault is explicitly boolean
    };

    try {
      await axios.put(
        `http://222.255.119.40:8080/adamstore/v1/addresses/${editAddress.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Cập nhật địa chỉ thành công!",
        severity: "success",
      });
      setEditDialogOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error("Lỗi khi cập nhật địa chỉ:", err.response?.data || err.message);
      setSnackbar({
        open: true,
        message: "Cập nhật địa chỉ thất bại! Kiểm tra console để biết chi tiết.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (!token || !id) return;
    fetchAddresses();
  }, [token, id]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditAddress(null);
    setSelectedCity("");
    setSelectedDistrict("");
    setWard("");
    setStreetDetail("");
    setPhone("");
    setIsDefault(false);
  };

  return (
    <Box sx={{ width: "100%", pt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Địa chỉ của tôi
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--footer-background-color)",
            padding: "12px 24px",
          }}
          onClick={() => navigate(`/accountInform/newAddress/${id}`)}
        >
          Thêm địa chỉ mới
        </Button>
      </Box>
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
                <IconButton
                  onClick={() => handleEdit(addr)}
                  disabled={addr.invisible}
                >
                  <Edit color="primary" />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(addr.id)}
                  disabled={addr.invisible}
                >
                  <Delete color="error" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
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
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cập nhật địa chỉ</DialogTitle>
        <DialogContent>
          <Stack spacing={4} sx={{ mt: 2 }}>
            <FormControl size="small" sx={{ width: "100%" }}>
              <InputLabel>Tỉnh/Thành phố</InputLabel>
              <DialogSelect
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedDistrict("");
                  setWard("");
                  setDistricts([]);
                  setWards([]);
                }}
                label="Tỉnh/Thành phố"
              >
                {city.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </DialogSelect>
            </FormControl>
            <FormControl size="small" sx={{ width: "100%" }}>
              <InputLabel>Quận/Huyện</InputLabel>
              <DialogSelect
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setWard("");
                  setWards([]);
                }}
                label="Quận/Huyện"
              >
                {districts.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </DialogSelect>
            </FormControl>
            <FormControl size="small" sx={{ width: "100%" }}>
              <InputLabel>Phường/Xã</InputLabel>
              <DialogSelect
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                label="Phường/Xã"
              >
                {wards.map((w) => (
                  <MenuItem key={w.code} value={w.code}>
                    {w.name}
                  </MenuItem>
                ))}
              </DialogSelect>
            </FormControl>
            <DialogTextField
              label="Địa chỉ"
              variant="outlined"
              size="small"
              value={streetDetail}
              onChange={(e) => setStreetDetail(e.target.value)}
              fullWidth
            />
            <DialogTextField
              label="Số điện thoại"
              variant="outlined"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <Box>
              <Typography variant="h6">Đặt làm địa chỉ mặc định:</Typography>
              <RadioGroup
                row
                value={isDefault.toString()}
                onChange={(e) => setIsDefault(e.target.value === "true")}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color="default" />}
                  label="Có"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color="default" />}
                  label="Không"
                />
              </RadioGroup>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="default" onClick={handleCloseDialog}>
            Hủy
          </Button>
          <Button
            sx={{ color: "white", backgroundColor: "black" }}
            variant="contained"
            onClick={handleUpdate}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressListForUser;