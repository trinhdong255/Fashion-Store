import {
  Alert,
  Button,
  CircularProgress,
  createTheme,
  Grid,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import styles from "./index.module.css";
import customTheme from "@/components/CustemTheme";
import { useState } from "react";
import { useForgotPasswordMutation } from "@/services/api/auth";

const ForgotPassword = () => {
  const outerTheme = useTheme();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
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

  const handleShowSnackbar = (success) => {
    if (success) {
      setSnackbar({
        open: true,
        message: "Đã xác nhận email !",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Xác nhận email thất bại !",
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
      const response = await forgotPassword({
        email: data?.email,
      }).unwrap();

      if (response) {
        navigate("/login/forgotPasswordVerify", {
          state: {
            message: "Đã xác nhận email !",
            severity: "success",
            email: data.email, // Đảm bảo email được truyền ở đây
          },
        });
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("Register failed:", error);
    }
  };

  return (
    <div className={styles.wrappers}>
      <Stack
        sx={{
          backgroundColor: "white",
          width: 500,
          height: 350,
          borderRadius: 4,
          boxShadow: "0px 4px 30px 5px rgba(0, 0, 0, 0.3)",
        }}>
        <div>
          <h2
            style={{
              textAlign: "center",
              margin: "46px 0 0 0",
              fontWeight: "inherit",
            }}>
            QUÊN MẬT KHẨU
          </h2>

          <p
            style={{
              textAlign: "center",
              margin: "16px 0 0 0",
            }}>
            Bạn vui lòng nhập email để đặt lại mật khẩu
          </p>

          <Stack
            sx={{ padding: "0px 36px", marginTop: "20px" }}
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}>
            <Stack className={styles.formLabelInput}>
              <ThemeProvider theme={customTheme(outerTheme)}>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  disabled={isLoading}
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
                "XÁC NHẬN EMAIL"
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
  );
};

export default ForgotPassword;
