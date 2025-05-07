import {
  Alert,
  Button,
  CircularProgress,
  createTheme,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "../index.module.css";
import customTheme from "@/components/CustemTheme";
import { Fragment, useEffect, useState } from "react";
import { useForgotPasswordVerifyMutation } from "@/services/api/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ForgotPasswordVerify = () => {
  const outerTheme = useTheme();
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [forgotPasswordVerify, { isLoading }] =
    useForgotPasswordVerifyMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // or 'error'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Lấy email từ location.state
  const email = location.state?.email || "Không có email"; // Nếu không có email, hiển thị thông báo mặc định
  console.log("Email received in VerifyAccount:", email);

  const handleClickShowOtp = () => setShowOtp((show) => !show);

  const handleMouseDownOtp = (event) => {
    event.preventDefault();
  };

  const handleMouseUpOtp = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message || "",
        severity: location.state.severity || "success",
      });
    }
    window.history.replaceState({}, document.title);
  }, [location]);

  const handleShowSnackbar = (success) => {
    if (success) {
      setSnackbar({
        open: true,
        message: "Xác thực OTP thành công !",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Xác thực OTP thất bại !",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    setError("");

    try {
      const response = await forgotPasswordVerify({
        email: email,
        verificationCode: data?.verificationCode,
      }).unwrap();

      if (response) {
        // Lưu forgotPasswordToken từ response
        navigate("/login/resetPassword", {
          state: {
            message: "Xác thực email thành công !",
            severity: "success",
            // Truyền token từ response vào state
            forgotPasswordToken: response.result.forgotPasswordToken,
          },
        });
      }
    } catch (error) {
      handleShowSnackbar(false);
      if (error.status === 401) {
        setError(
          "OTP không hợp lệ hoặc người dùng chưa được xác thực. Vui lòng thử lại."
        );
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
      console.log("OTP verification failed:", error);
    }
  };

  return (
    <Fragment>
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

      <div className={styles.wrappers}>
        <Stack
          sx={{
            backgroundColor: "white",
            width: 460,
            height: 400,
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
              XÁC THỰC TÀI KHOẢN
            </h2>

            <Stack
              sx={{ padding: "0px 36px" }}
              component={"form"}
              onSubmit={handleSubmit(onSubmit)}>
              {/* Hiển thị email dưới dạng text */}
              <Stack sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Email: <span className={styles.email}>{email}</span>
                </Typography>
              </Stack>

              {/* Hiển thị lỗi nếu có */}
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Stack className={styles.formLabelInput}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="verificationCode"
                    label="Xác thực OTP"
                    type={showOtp ? "text" : "password"}
                    variant="outlined"
                    sx={{ mb: 1 }}
                    disabled={isLoading}
                    {...register("verificationCode", {
                      required: "OTP không được để trống",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "OTP phải là 6 chữ số",
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showOtp ? "hide the OTP" : "display the OTP"
                            }
                            onClick={handleClickShowOtp}
                            onMouseDown={handleMouseDownOtp}
                            onMouseUp={handleMouseUpOtp}
                            edge="end"
                            disabled={isLoading}>
                            {showOtp ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors.verificationCode && (
                    <p className={styles.errorMessage}>
                      {errors.verificationCode.message}
                    </p>
                  )}
                </ThemeProvider>
              </Stack>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "6px 16px",
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
                  "XÁC NHẬN"
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
              <Link className={styles.linkFooter} to="/login">
                Trở về đăng nhập
              </Link>
            </Stack>
          </div>
        </Stack>
      </div>
    </Fragment>
  );
};

export default ForgotPasswordVerify;
