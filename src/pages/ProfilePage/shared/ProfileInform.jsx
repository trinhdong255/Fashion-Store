import { PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useParams } from "react-router-dom";

const ariaLabel = { "aria-label": "description" };

const ProfileInform = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success or error

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!id || !token) return;

    axios
      .get(`http://222.255.119.40:8080/adamstore/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const result = res.data.result;
        console.log(result);
        setUserProfile(result);
        setAvatar(result.avatarUrl);
        setName(result.name || "");
        setGender(result.gender || "male");
        setDob(result.dob?.slice(0, 10) || "2000-01-01");
        setEmail(result.email || "");
        // setPhone(result.phone || "");
        setSelectedDistrict(result.address);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axios
      .get(
        "http://222.255.119.40:8080/adamstore/v1/districts?pageNo=1&pageSize=21",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const result = res.data.result.items || [];
        console.log("dia chỉ", result);
        setDistricts(result);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách địa chỉ:", err);
      });
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("fileImage", file);

    try {
      const res = await fetch(
        "http://222.255.119.40:8080/adamstore/v1/file/upload/image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("hình ảnh:", data);
      if (data.code === 200) {
        setAvatar(data.result.imageUrl);
      } else {
        console.error("Upload thất bại:", data.message);
      }
    } catch (err) {
      console.error("Lỗi khi upload ảnh:", err);
    }
  };

  const handleUpdateUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const updatedUser = {
      name,
      gender,
      dob,
      email,
      phone,
      avatarUrl: avatar,
    };
    console.log("Dữ liệu gửi lên:", updatedUser);
    try {
      const res = await axios.put(
        `http://222.255.119.40:8080/adamstore/v1/users/${id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.code === 200) {
        setSnackbarMessage("Cập nhật thông tin thành công!");
        setSnackbarSeverity("success");
        setUserProfile(res.data.result);
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("Cập nhật thất bại: " + res.data.message);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Đã xảy ra lỗi khi cập nhật.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (loading || !userProfile) {
    return <Typography>Đang tải thông tin người dùng...</Typography>;
  }

  return (
    <Box
      sx={{
        padding: "20px",
        width: "100%",
        border: "1px solid black",
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
      }}>
      <Box sx={{ position: "relative", width: 120, height: 120 }}>
        {/* Ảnh avatar hình tròn */}
        <Avatar
          src={avatar}
          sx={{
            width: 120,
            height: 120,
            border: "2px solid #ccc",
          }}
        />

        {/* Nút chọn file hình camera nằm ở góc */}
        <IconButton
          component="label"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}>
          <PhotoCamera fontSize="small" />
          <input type="file" hidden accept="image/*" onChange={handleUpload} />
        </IconButton>
      </Box>

      {/* Họ tên */}
      <Box sx={rowStyle}>
        <Typography sx={labelStyle}>Họ Tên:</Typography>
        <Input
          sx={{ flex: 7 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          inputProps={ariaLabel}
        />
      </Box>

      {/* Giới tính */}
      <Box sx={rowStyle}>
        <Typography sx={labelStyle}>Giới tính:</Typography>
        <RadioGroup
          row
          sx={{ flex: 7 }}
          value={gender}
          onChange={(e) => setGender(e.target.value)}>
          <FormControlLabel value="MALE" control={<Radio />} label="Nam" />
          <FormControlLabel value="FEMALE" control={<Radio />} label="Nữ" />
          <FormControlLabel value="OTHER" control={<Radio />} label="Khác" />
        </RadioGroup>
      </Box>

      {/* Ngày sinh */}
      <Box sx={rowStyle}>
        <Typography sx={labelStyle}>Ngày sinh:</Typography>
        <Input
          sx={{ flex: 7 }}
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          inputProps={ariaLabel}
        />
      </Box>

      {/* Email */}
      <Box sx={rowStyle}>
        <Typography sx={labelStyle}>Email:</Typography>
        <Input
          sx={{ flex: 7 }}
          value={email}
          inputProps={{ ...ariaLabel, readOnly: true }}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 2,
        }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--footer-background-color)",
            marginBottom: 6,
            padding: "12px 24px",
          }}
          onClick={handleUpdateUser}
          style={{ padding: "10px 20px", fontWeight: "bold" }}>
          Lưu thay đổi
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          position: "fixed", // Đặt vị trí cố định để luôn ở góc phải
          bottom: 20, // Cách dưới màn hình 20px
          right: 20, // Cách phải màn hình 20px
        }}
      />
    </Box>
  );
};

// Style chung cho các dòng
const rowStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

// Style cho nhãn label
const labelStyle = {
  flex: 3,
  fontWeight: "bold",
};

export default ProfileInform;
