import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import customTheme from "@/components/CustemTheme";
import { useRegisterMutation } from "@/services/api/auth";

const Register = () => {
  const outerTheme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useRegisterMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // or 'error'
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleShowSnackbar = ({ message, severity }) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    setError("");

    try {
      const response = await signUp({
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        password: data?.password,
        confirmPassword: data?.password,
      }).unwrap();

      if (response) {
        const message = response.message;
        navigate("/verifyAccount", {
          state: {
            message,
            severity: "success",
            email: data.email, // Đảm bảo email được truyền ở đây
          },
        });
        console.log("data", response);
      }
    } catch (error) {
      const errorMessage = error?.data?.message || "Lỗi từ hệ thống";
      handleShowSnackbar({
        message: errorMessage,
        severity: "error",
      });
      console.log("Register failed:", error.data.message);
    }
  };

  return (
    <div className={styles.wrappers}>
      <Stack
        sx={{
          backgroundColor: "white",
          width: 500,
          height: "100%",
          borderRadius: 4,
          boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
        }}>
        <div>
          <h2
            style={{
              textAlign: "center",
              margin: "20px 0",
              fontWeight: "inherit",
            }}>
            Đăng ký
          </h2>
          <Stack
            sx={{ padding: "0px 36px", display: "flex" }}
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}>
            <Stack className={styles.formLabelInput}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  id="name"
                  label="Họ và tên"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  disabled={isLoading}
                  {...register("name", {
                    required: "Họ và tên không được để trống",
                    pattern: {
                      value: /^[A-Za-zÀ-Ỹà-ỹ0-9]+(?: [A-Za-zÀ-Ỹà-ỹ0-9]+)*$/,
                      message:
                        "Chỉ được sử dụng chữ cái, số và một khoảng trắng giữa các từ, không có ký tự đặc biệt",
                    },
                  })}
                />
                {errors.name && (
                  <p className={styles.errorMessage}>{errors.name.message}</p>
                )}
              </ThemeProvider>
            </Stack>

            <Stack className={styles.formLabelInput}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  {...register("email", {
                    required: "Email không được để trống",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                />
                {errors.email && (
                  <p className={styles.errorMessage}>{errors.email.message}</p>
                )}
              </ThemeProvider>
            </Stack>

            <Stack className={styles.formLabelInput}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  id="phone"
                  label="Số điện thoại"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  disabled={isLoading}
                  {...register("phone", {
                    required: "Số điện thoại không được để trống",
                    pattern: {
                      value:
                        /^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/,
                      message: "Số điện thoại phải có 10 số và bắt đầu bằng 0",
                    },
                  })}
                />
                {errors.phone && (
                  <p className={styles.errorMessage}>{errors.phone.message}</p>
                )}
              </ThemeProvider>
            </Stack>

            <Stack className={styles.formLabelInput}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  id="password"
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  sx={{ mb: 1 }}
                  disabled={isLoading}
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
                          edge="end"
                          disabled={isLoading}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </ThemeProvider>
              {errors.password && (
                <p className={styles.errorMessage}>{errors.password.message}</p>
              )}
            </Stack>

            <Stack className={styles.formLabelInput}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  id="confirmPassword"
                  label="Xác nhận mật khẩu"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  sx={{ mb: 1 }}
                  disabled={isLoading}
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) =>
                      value === watch("password") ||
                      "Mật khẩu xác nhận không khớp",
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showConfirmPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          onMouseUp={handleMouseUpConfirmPassword}
                          edge="end"
                          disabled={isLoading}>
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </ThemeProvider>
              {errors.confirmPassword && (
                <p className={styles.errorMessage}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </Stack>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                padding: "6px 16px",
                marginTop: "20px",
                fontSize: "1.2rem",
                fontWeight: "regular",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
              type="submit"
              disabled={isLoading}>
              {isLoading ? (
                <CircularProgress size={34} color="inherit" />
              ) : (
                "ĐĂNG KÝ"
              )}
            </Button>

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
          </Stack>

          <Stack sx={{ display: "flex", alignItems: "center" }}>
            <div style={{ margin: "34px 0" }}>
              <span>
                Bạn đã có tài khoản?
                <Link className={styles.linkFooter} to="/login">
                  Đăng nhập
                </Link>
              </span>
            </div>
          </Stack>
        </div>
      </Stack>
    </div>
  );
};

export default Register;
