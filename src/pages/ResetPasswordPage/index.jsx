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
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import customTheme from "@/components/CustemTheme";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useResetPasswordMutation } from "@/services/api/auth";
import { setUser } from "@/store/redux/user/reducer";
import styles from "./index.module.css";

const ResetPassword = () => {
  const outerTheme = useTheme();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
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

  // Lấy forgotPasswordToken từ state
  const forgotPasswordToken = location.state?.forgotPasswordToken || "";

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handleMouseDownNewPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpNewPassword = (event) => {
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
        message: "Đặt lại mật khẩu thành công !",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Đặt lại mật khẩu thất bại !",
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
      const response = await resetPassword({
        forgotPasswordToken: forgotPasswordToken,
        newPassword: data?.newPassword,
        confirmPassword: data?.confirmPassword,
      }).unwrap();

      if (response) {
        // const userData = {
        //   forgotPasswordToken: response.forgotPasswordToken,
        //   newPassword: response.newPassword,
        //   confirmPassword: response.confirmPassword,
        // };
        // dispatch(setUser(userData));
        navigate("/login", {
          state: {
            message: "Đặt lại mật khẩu thành công !",
            severity: "success",
          },
        });
      }
    } catch (error) {
      handleShowSnackbar(false);
      console.log("Reset password failed:", error);
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

      <Stack alignItems={"center"} justifyContent={"center"}>
        <Stack
          sx={{
            backgroundColor: "white",
            width: 460,
            height: 450,
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
              ĐẶT LẠI MẬT KHẨU
            </h2>

            <Stack
              sx={{ padding: "0px 36px" }}
              component={"form"}
              onSubmit={handleSubmit(onSubmit)}>
              <Stack className={styles.formLabelInput}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
                    id="newPassword"
                    label="Mật khẩu mới"
                    type={showNewPassword ? "text" : "password"}
                    variant="outlined"
                    sx={{ mb: 1 }}
                    disabled={isLoading}
                    {...register("newPassword", {
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
                              showNewPassword
                                ? "hide the password"
                                : "display the password"
                            }
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownNewPassword}
                            onMouseUp={handleMouseUpNewPassword}
                            edge="end"
                            disabled={isLoading}>
                            {showNewPassword ? (
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
                {errors.newPassword && (
                  <p className={styles.errorMessage}>
                    {errors.newPassword.message}
                  </p>
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
                        value === watch("newPassword") ||
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
                  "ĐẶT LẠI MẬT KHẨU"
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
      </Stack>
    </div>
  );
};

export default ResetPassword;
