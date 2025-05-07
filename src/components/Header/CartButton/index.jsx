import { SentimentDissatisfied } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Badge,
  badgeClasses,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGetCartByUserQuery } from "@/services/api/cart";
import { selectUserId } from "@/store/redux/user/reducer";
import { removeFromCart, updateQuantity } from "@/store/redux/cart/reducer";

const CartButton = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const { data: cartData, isLoading } = useGetCartByUserQuery(userId, {
    skip: !userId,
  });

  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const cartTotalQuantity = useSelector((state) => state.cart?.cartTotalQuantity || 0);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleOpenDialog = (item) => {
    setItemToRemove(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setItemToRemove(null);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart({ id: itemToRemove.id }));
    }
    handleCloseDialog();
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    const token = localStorage.getItem("accessToken");
    axios
      .put(
        `http://localhost:8080/adamstore/v1/cart-items/${item.id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((err) => {
        console.error("Lỗi khi cập nhật số lượng:", err);
      });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    navigate("/shipping-method", {
      state: {
        orderData: cartItems.map((item) => ({
          productId: item.productVariantBasic.product.id,
          productVariantId: item.productVariantBasic.id,
          name: item.productVariantBasic.product.name,
          image: "/default.jpg", // Cần cập nhật logic lấy image từ API
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
    setOpen(false);
  };

  const DrawerList = () => {
    return (
      <Box
        sx={{
          width: 400,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        <Box sx={{ flexShrink: 0 }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon fontSize="large" />
          </IconButton>
          <Stack direction={"row"} alignItems={"center"}>
            <LocalMallIcon />
            <Typography variant="h5">GIỎ HÀNG CỦA BẠN</Typography>
          </Stack>
          <Divider />
        </Box>

        {isLoading ? (
          <Typography sx={{ p: 2, textAlign: "center" }}>
            Đang tải giỏ hàng...
          </Typography>
        ) : cartItems.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <Typography variant="h6">CHƯA CÓ SẢN PHẨM NÀO!</Typography>
            <SentimentDissatisfied fontSize="large" />
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              p: 2,
            }}
          >
            <Stack spacing={2}>
              {cartItems.map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ borderBottom: "1px solid #ddd", pb: 1 }}
                >
                  <img
                    src="/default.jpg" // Cần cập nhật logic lấy image từ API
                    alt={item.productVariantBasic.product.name}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="body1">
                      {item.productVariantBasic.product.name}
                    </Typography>
                    <Typography variant="body2">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </Typography>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item, Math.max(1, e.target.value))
                      }
                      inputProps={{ min: 1 }}
                      sx={{ width: "80px" }}
                    />
                  </Stack>
                  <IconButton
                    onClick={() => handleOpenDialog(item)}
                    sx={{ color: "black" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {cartItems.length > 0 && (
          <Box sx={{ flexShrink: 0, p: 2 }}>
            <Button
              variant="contained"
              sx={{ width: "100%", backgroundColor: "black", color: "white", mb: 2 }}
              onClick={handleCheckout}
            >
              Thanh toán
            </Button>
            <Button
              variant="outlined"
              sx={{ width: "100%" }}
              onClick={() => {
                toggleDrawer(false)();
              }}
            >
              Xem giỏ hàng
            </Button>
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{itemToRemove?.productVariantBasic.product.name}</strong> khỏi giỏ hàng?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
            <Button onClick={handleConfirmRemove} color="error" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <>
      <IconButton aria-label="shopping-cart" onClick={toggleDrawer(true)}>
        <ShoppingCartOutlinedIcon fontSize="large" />
        <CartBadge
          badgeContent={cartTotalQuantity}
          color="primary"
          overlap="circular"
        />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList()}
      </Drawer>
    </>
  );
};

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
    background-color: black;
    color: white;
  }
`;

export default CartButton;