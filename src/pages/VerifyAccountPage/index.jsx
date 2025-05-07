import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import customTheme from "@/components/CustemTheme";
import { useVerifyOtpMutation } from "@/services/api/auth";

const VerifyAccount = () => {
  const outerTheme = useTheme();
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Lấy email từ location.state
  const email = location.state?.email || "Không có email"; // Nếu không có email, hiển thị thông báo mặc định
  console.log("Email received in VerifyAccount:", email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickShowOtp = () => setShowOtp((show) => !show);

  const handleMouseDownOtp = (event) => {
    event.preventDefault();
  };

  const handleMouseUpOtp = (event) => {
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
    console.log("Form submitted!");
    console.log("Sending verify request:", {
      email,
      verificationCode: data?.verificationCode,
    });
    setError("");

    try {
      const response = await verifyOtp({
        email: email,
        verificationCode: data?.verificationCode,
      }).unwrap();
      console.log("Sending verify request:", {
        email,
        verificationCode: data?.verificationCode,
      });

      if (response) {
        const message = response.message;
        handleShowSnackbar(true);
        setTimeout(() => {
          navigate("/login", {
            state: {
              message,
              severity: "success",
            },
          });
        });
      }
    } catch (error) {
      const errorMessage = error?.data?.message || "Lỗi từ hệ thống";
      handleShowSnackbar({
        message: errorMessage,
        severity: "error",
      });
    }
  };

  return (
    <div className={styles.wrappers}>
      <Stack
        sx={{
          backgroundColor: "white",
          width: 520,
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
              <Typography variant="body1" sx={{ marginRight: 2 }}>
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
                  label="Nhập OTP"
                  type={showOtp ? "text" : "password"}
                  variant="outlined"
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
                marginTop: "14px",
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
        </div>
      </Stack>
    </div>
  );
};

export default VerifyAccount;
