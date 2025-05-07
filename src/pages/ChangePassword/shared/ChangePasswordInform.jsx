// import { useChangePasswordMutation } from "@/services/api/changePassword";
import { useGetMyInfoQuery } from "@/services/api/auth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ChangePasswordInform = () => {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useGetMyInfoQuery();
  const [changePassword, { isLoading: isChangePasswordLoading }] =
    useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const newPassword = watch("newPassword");

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (userError) {
      setSnackbar({
        open: true,
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
        severity: "error",
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [userError, navigate]);

  const onSubmit = async (data) => {
    try {
      await changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      setSnackbar({
        open: true,
        message: "Đổi mật khẩu thành công!",
        severity: "success",
      });
      reset();
      setTimeout(() => {
        navigate("/accountInform/profile");
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.data?.message || "Đổi mật khẩu thất bại!",
        severity: "error",
      });
    }
  };

  if (isUserLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box
      sx={{
        border: "1px solid black",
        width: "100%",
        pt: 5,
        borderRadius: 5,
      }}
      component="form" // Add form element
      onSubmit={handleSubmit(onSubmit)} // Attach the onSubmit handler
    >
      <Box sx={{ m: "24px 0 24px 64px" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          sx={{ m: "40px 0" }}
          spacing={17}>
          <Typography variant="h6">Mật khẩu hiện tại: </Typography>
          <TextField
            variant="outlined"
            label="Mật khẩu hiện tại"
            size="small"
            color="default"
            type={showCurrentPassword ? "text" : "password"}
            disabled={isChangePasswordLoading}
            {...register("currentPassword", {
              required: "Mật khẩu hiện tại không được để trống",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showCurrentPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowCurrentPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    disabled={isChangePasswordLoading}>
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: "300px" }}
          />
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          sx={{ m: "40px 0" }}
          spacing={21}>
          <Typography variant="h6">Mật khẩu mới: </Typography>
          <TextField
            variant="outlined"
            label="Mật khẩu mới"
            size="small"
            color="default"
            type={showNewPassword ? "text" : "password"}
            disabled={isChangePasswordLoading}
            {...register("newPassword", {
              required: "Mật khẩu mới không được để trống",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
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
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    disabled={isChangePasswordLoading}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: "300px" }}
          />
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          sx={{ m: "40px 0" }}
          spacing={10}>
          <Typography variant="h6">Xác nhận mật khẩu mới: </Typography>
          <TextField
            variant="outlined"
            label="Nhập lại mật khẩu mới"
            size="small"
            color="default"
            type={showConfirmPassword ? "text" : "password"}
            disabled={isChangePasswordLoading}
            {...register("confirmPassword", {
              required: "Xác nhận mật khẩu không được để trống",
              validate: (value) =>
                value === newPassword || "Mật khẩu xác nhận không khớp",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    disabled={isChangePasswordLoading}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: "300px" }}
          />
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Button
          variant="contained"
          type="submit" // Change to "submit" to allow Enter key submission
          disabled={isChangePasswordLoading}
          sx={{
            backgroundColor: "var(--footer-background-color)",
            marginBottom: 6,
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
          }}>
          {isChangePasswordLoading ? "Đang xử lý..." : "Lưu thay đổi"}
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePasswordInform;
