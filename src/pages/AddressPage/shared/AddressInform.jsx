/* eslint-disable react/prop-types */
import {
  Box,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddressInform = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [streetDetail, setStreetDetail] = useState("");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    axios
      .get(
        "http://222.255.119.40:8080/adamstore/v1/provinces?pageNo=1&pageSize=63",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setCity(res.data.result.items || []);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách tỉnh/thành:", err));
  }, [token]);

  useEffect(() => {
    if (!selectedCity || !token) return;

    axios
      .get(
        `http://222.255.119.40:8080/adamstore/v1/provinces/${selectedCity}/districts?pageNo=1&pageSize=30`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setDistricts(res.data.result.items || []);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách quận/huyện:", err));
  }, [selectedCity, token]);

  useEffect(() => {
    if (!selectedDistrict || !token) return;

    axios
      .get(
        `http://222.255.119.40:8080/adamstore/v1/districts/${selectedDistrict}/wards?pageNo=1&pageSize=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setWards(res.data.result.items || []);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách phường/xã:", err));
  }, [selectedDistrict, token]);

  const handleSubmit = async () => {
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
      isDefault,
    };

    try {
      await axios.post(
        "http://222.255.119.40:8080/adamstore/v1/addresses",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: "Thêm địa chỉ thành công!",
        severity: "success",
      });
      setTimeout(() => navigate(`/accountInform/address/${id}`), 1500);
    } catch (err) {
      console.error("Lỗi khi thêm địa chỉ:", err);
      setSnackbar({
        open: true,
        message: "Thêm địa chỉ thất bại!",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Stack alignItems="center" sx={{ m: "40px 0" }}>
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>ĐỊA CHỈ MỚI</h2>
      <Box
        sx={{
          border: "1px solid black",
          width: "50%",
          pt: 4,
          m: "20px 0",
          borderRadius: 5,
        }}
      >
        <Box sx={{ m: "24px 0 24px 64px" }}>
          <Stack direction="row" alignItems="center" spacing={13} sx={{ m: "40px 0" }}>
            <Typography variant="h6">Tỉnh/Thành phố: </Typography>
            <FormControl sx={{ m: 1, width: "300px" }} size="small">
              <InputLabel>Tỉnh/Thành phố</InputLabel>
              <Select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} label="Tỉnh/Thành phố">
                {city.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={17} sx={{ m: "40px 0" }}>
            <Typography variant="h6">Quận/Huyện: </Typography>
            <FormControl sx={{ m: 1, width: "300px" }} size="small">
              <InputLabel>Quận/Huyện</InputLabel>
              <Select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} label="Quận/Huyện">
                {districts.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={19} sx={{ m: "40px 0" }}>
            <Typography variant="h6">Phường/Xã: </Typography>
            <FormControl sx={{ m: 1, width: "300px" }} size="small">
              <InputLabel>Phường/Xã</InputLabel>
              <Select value={ward} onChange={(e) => setWard(e.target.value)} label="Phường/Xã">
                {wards.map((w) => (
                  <MenuItem key={w.code} value={w.code}>
                    {w.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={24} sx={{ m: "40px 0" }}>
            <Typography variant="h6">Địa chỉ: </Typography>
            <TextField
              variant="outlined"
              label="Nhập địa chỉ"
              size="small"
              sx={{ width: "300px" }}
              value={streetDetail}
              onChange={(e) => setStreetDetail(e.target.value)}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={17} sx={{ m: "40px 0" }}>
            <Typography variant="h6">Số điện thoại: </Typography>
            <TextField
              variant="outlined"
              label="Nhập số điện thoại"
              size="small"
              sx={{ width: "300px" }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={17} sx={{ m: "40px 0" }}>
            <Typography variant="h6">Đặt làm mặc định: </Typography>
            <FormControlLabel
              control={<Checkbox color="default" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />}
              label=""
            />
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "var(--footer-background-color)", padding: "12px 24px" }}
              onClick={handleSubmit}
            >
              Thêm địa chỉ
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Stack>
  );
};

export default AddressInform;