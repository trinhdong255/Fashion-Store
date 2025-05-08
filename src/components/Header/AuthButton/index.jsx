// HeaderAuthButtons.js
import {
  Stack,
  Typography,
  Menu,
  MenuItem,
  alpha,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { resetStore } from "@/store";

const AuthButton = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchUserInfo = async () => {
      try {
        const res = await fetch(
          "http://222.255.119.40:8080/adamstore/v1/auth/myInfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log(">>>data", data);
          setUserInfo(data);
        } else {
          // Token sai hoặc hết hạn
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin user:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(
        "http://222.255.119.40:8080/adamstore/v1/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: token,
          }),
        }
      );

      if (res.ok) {
        localStorage.removeItem("token");
        setUserInfo(null);
        navigate("/login");
      } else {
        console.error("Logout thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    }
  };

  return (
    <Stack direction="row" alignItems="center">
      {userInfo ? (
        <>
          <Stack
            direction="row"
            alignItems="center"
            onClick={handleMenuOpen}
            sx={{ cursor: "pointer" }}>
            <Avatar src={userInfo.avatarUrl} alt="" />
            <Typography sx={{ marginLeft: "5px" }}>
              {userInfo.result.name}
            </Typography>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}>
            <MenuItem
              onClick={() =>
                navigate(`/accountInform/profile/${userInfo.result.id}`)
              }>
              Thông tin tài khoản
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-orders")}>
              Đơn hàng của tôi
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </>
      ) : (
        <Stack
          direction={"row"}
          spacing={2}
          display={"flex"}
          alignItems={"center"}>
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "#d9d9d9",
              borderRadius: 5,
              width: 125,
              height: 40,
              "&:hover": {
                backgroundColor: alpha("#d9d9d9", 0.5),
              },
            }}
            component={Link}
            to="/login">
            Đăng nhập
          </Button>

          <Button
            variant="contained"
            sx={{
              color: "white",
              backgroundColor: "black",
              borderRadius: 5,
              width: 125,
              height: 40,
              "&:hover": {
                backgroundColor: alpha("#333"),
              },
            }}
            component={Link}
            to="/register">
            Đăng ký
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default AuthButton;
