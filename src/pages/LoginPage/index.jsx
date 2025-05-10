import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import customTheme from "@/components/CustemTheme";
import axios from "axios";
import { fetchUserInfo, setUser } from "@/store/redux/user/reducer";
import { fetchCartItemsFromApi } from "@/store/redux/cart/reducer";

const Login = () => {
  const outerTheme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(
        "http://222.255.119.40:8080/adamstore/v1/auth/login",
        data
      );

      const result = response.data.result;
      const { accessToken, refreshToken, roles, email } = result;
      console.log("result:", result);

      // Lưu token
      localStorage.setItem("accessToken", accessToken);
      console.log("accessToken:", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Lấy thông tin người dùng từ API myInfo
      await dispatch(fetchUserInfo());

      // Đồng bộ giỏ hàng
      await dispatch(fetchCartItemsFromApi());

      // Hiển thị thông báo thành công
      setSnackbar({
        open: true,
        message: "Đăng nhập thành công!",
        severity: "success",
      });

      // Điều hướng theo vai trò
      const role = roles?.[0]?.name;
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Email hoặc mật khẩu không đúng.");
      setSnackbar({
        open: true,
        message: "Đăng nhập thất bại!",
        severity: "error",
      });
    }
  };

  return (
    <div className={styles.wrappers}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", p: "10px 20px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Stack>
        <Stack
          sx={{
            backgroundColor: "white",
            width: 500,
            height: 500,
            borderRadius: 4,
            boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
          }}>
          <div>
            <h2
              style={{
                textAlign: "center",
                margin: "46px 0 20px 0",
                fontWeight: "inherit",
              }}>
              ĐĂNG NHẬP
            </h2>

            <Stack
              sx={{ padding: "0px 36px" }}
              component={"form"}
              onSubmit={handleSubmit(handleLogin)}>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Stack className={styles.formLabelInput}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    {...register("email", {
                      required: "Email không được để trống",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                </ThemeProvider>
                {errors.email && (
                  <p className={styles.errorMessage}>{errors.email.message}</p>
                )}
              </Stack>

              <Stack className={styles.formLabelInput}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="password"
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    {...register("password", {
                      required: "Mật khẩu không được để trống",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </ThemeProvider>
                {errors.password && (
                  <p className={styles.errorMessage}>
                    {errors.password.message}
                  </p>
                )}
              </Stack>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "6px 16px",
                  marginTop: "14px",
                  fontSize: "1.2rem",
                  fontWeight: "regular",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
                type="submit">
                ĐĂNG NHẬP
              </Button>
            </Stack>

            <Stack sx={{ display: "flex", alignItems: "center" }}>
              <Link className={styles.forgotPassword} to="forgotPassword">
                Bạn quên mật khẩu?
              </Link>

              <span style={{ margin: "12px 0 0 0" }}>
                Bạn chưa có tài khoản?
                <Link className={styles.createAccount} to="/register">
                  Tạo tài khoản ngay
                </Link>
              </span>

              <Link className={styles.backToHome} to="/">
                Trở về trang chủ
              </Link>
            </Stack>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default Login;
