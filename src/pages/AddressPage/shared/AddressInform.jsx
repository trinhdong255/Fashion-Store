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
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const AddressInform = ({ id }) => {
  const [city, setCity] = useState([]);
  const [ward, setWard] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [streetDetail, setStreetDetail] = useState("");
  const [phone, setPhone] = useState("");
  const token = localStorage.getItem("accessToken");

  const handleCityChange = (event) => {
    const CityId = event.target.value;
    setSelectedCity(CityId);
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setWard(""); // reset ward khi đổi quận
  };

  const handleWardChange = (event) => {
    setWard(event.target.value);
  };

  useEffect(() => {
    if (!token) return;

    axios
      .get(
        "http://222.255.119.40:8080/adamstore/v1/provinces?pageNo=1&pageSize=63",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const result = res.data.result.items || [];
        setCity(result);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách quận/huyện:", err);
      });
  }, [token]);

  // Gọi danh sách quận/huyện khi component mount
  useEffect(() => {
    if (!token) return;

    axios
      .get(
        `http://222.255.119.40:8080/adamstore/v1/provinces/${selectedCity}/districts?pageNo=1&pageSize=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const result = res.data.result.items || [];
        setDistricts(result);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách quận/huyện:", err);
      });
  }, [selectedCity, token]);

  // Gọi danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict || !token) return;

    axios
      .get(
        `http://222.255.119.40:8080/adamstore/v1/districts/${selectedDistrict}/wards?pageNo=1&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const result = res.data.result.items || [];
        console.log(">>>hadand", result);

        setWards(result);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách phường/xã:", err);
      });
  }, [selectedDistrict, token]);

  useEffect(() => {
    if (!token || !id) return;

    axios
      .get(`http://222.255.119.40:8080/adamstore/v1/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const result = res.data.result;

        // gán lại state theo dữ liệu trả về
        setSelectedCity(result.province.id.toString());
        setSelectedDistrict(result.district.id.toString());
        setWard(result.ward.code);
        setStreetDetail(result.streetDetail); // cần tạo thêm state này
        setPhone(result.phone);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy địa chỉ:", err);
      });
  }, [token, id]);

  const handleSubmit = () => {
    if (
      !selectedCity ||
      !selectedDistrict ||
      !ward ||
      !streetDetail ||
      !phone
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    const data = {
      isDefault: true,
      streetDetail: streetDetail,
      wardCode: ward,
      districtId: selectedDistrict,
      provinceId: selectedCity,
      phone: phone,
    };

    axios
      .post("http://222.255.119.40:8080/adamstore/v1/addresses", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Gửi địa chỉ thành công:", res.data);
        alert("Cập nhật địa chỉ thành công!");
      })
      .catch((err) => {
        console.error("Lỗi khi gửi địa chỉ:", err);
        alert("Có lỗi xảy ra khi cập nhật địa chỉ.");
      });
  };

  return (
    <Box
      sx={{ border: "1px solid black", width: "100%", pt: 4, borderRadius: 5 }}>
      <Box sx={{ m: "24px 0 24px 64px" }}>
        {/* Thành phố */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={13}
          sx={{ m: "40px 0" }}>
          <Typography variant="h6">Tỉnh/Thành phố: </Typography>
          <FormControl sx={{ m: 1, width: "300px" }} size="small">
            <InputLabel>Tỉnh/Thành phố:</InputLabel>
            <Select
              value={selectedCity}
              onChange={handleCityChange}
              label="Quận/Huyện">
              {city.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Quận/Huyện */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={17}
          sx={{ m: "40px 0" }}>
          <Typography variant="h6">Quận/Huyện: </Typography>
          <FormControl sx={{ m: 1, width: "300px" }} size="small">
            <InputLabel>Quận/Huyện</InputLabel>
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              label="Quận/Huyện">
              {districts.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Phường/Xã */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={19}
          sx={{ m: "40px 0" }}>
          <Typography variant="h6">Phường/Xã: </Typography>
          <FormControl sx={{ m: 1, width: "300px" }} size="small">
            <InputLabel>Phường/Xã</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={ward || ""} // Luôn controlled
              label="Phường xã"
              onChange={handleWardChange}
              color="default">
              {wards.map((wardItem) => (
                <MenuItem key={wardItem.code} value={wardItem.code}>
                  {wardItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Địa chỉ */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={24}
          sx={{ m: "40px 0" }}>
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

        <Stack
          direction="row"
          alignItems="center"
          spacing={17}
          sx={{ m: "40px 0" }}>
          <Typography variant="h6">Số điện thoại:</Typography>
          <TextField
            variant="outlined"
            label="Nhập số điện thoại"
            size="small"
            sx={{ width: "300px" }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>
      </Box>

      {/* Nút cập nhật */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "var(--footer-background-color)",
            marginBottom: 6,
            padding: "12px 24px",
          }}>
          Cập nhật
        </Button>
      </Box>
    </Box>
  );
};

export default AddressInform;
