import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  fetchCartItemsFromApi,
  updateQuantity,
  removeFromCart,
} from "@/store/redux/cart/reducer";
import { selectUserId } from "@/store/redux/user/reducer";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MyCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [cartItemsWithImages, setCartItemsWithImages] = useState([]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      dispatch(fetchCartItemsFromApi()).finally(() => setLoading(false));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userId && cartItems.length > 0) {
      setLoading(true);
      const fetchImages = async () => {
        const token = localStorage.getItem("accessToken");
        const updatedItems = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `http://222.255.119.40:8080/adamstore/v1/products/${item.productVariantBasic.product.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...item,
                image: response.data.result.images?.[0]?.imageUrl || "/default.jpg",
              };
            } catch (error) {
              console.error(`Lỗi khi lấy hình ảnh cho sản phẩm ${item.productVariantBasic.product.id}:`, error);
              return {
                ...item,
                image: "/default.jpg",
              };
            }
          })
        );
        setCartItemsWithImages(updatedItems);
        setLoading(false);
      };
      fetchImages();
    } else {
      setCartItemsWithImages([]);
      setLoading(false);
    }
  }, [userId, cartItems]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `http://222.255.119.40:8080/adamstore/v1/cart-items/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
      await dispatch(fetchCartItemsFromApi());
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật số lượng:",
        error.response?.data || error.message
      );
    }
  };

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(
        `http://222.255.119.40:8080/adamstore/v1/cart-items/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(removeFromCart({ id: itemId }));
      await dispatch(fetchCartItemsFromApi());
    } catch (error) {
      console.error(
        "Lỗi khi xóa sản phẩm:",
        error.response?.data || error.message
      );
    }
  };

  const openDeleteDialog = (itemId) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      handleRemoveItem(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleProceedToShipping = () => {
    navigate("/shipping-method", { state: { orderData: cartItemsWithImages } });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!userId)
    return <Typography color="error">Vui lòng đăng nhập!</Typography>;
  if (cartItemsWithImages.length === 0)
    return <Typography>Chưa có sản phẩm nào!</Typography>;

  return (
    <Fragment>
      <Box sx={{ width: "100%", p: 3, borderRadius: 2, boxShadow: 2, bgcolor: "background.paper" }}>
        <Stack spacing={3}>
          {/* Table Header */}
          <Stack
            direction="row"
            sx={{
              bgcolor: "grey.100",
              borderRadius: 1,
              py: 2,
              px: 2,
              fontWeight: "medium",
            }}
          >
            {["Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền", "Xóa"].map(
              (header, index) => (
                <Typography
                  key={index}
                  sx={{
                    flex: index === 0 ? 3 : 1,
                    textAlign: index === 0 ? "left" : "center",
                    fontWeight: "medium",
                    color: "text.primary",
                  }}
                >
                  {header}
                </Typography>
              )
            )}
          </Stack>

          {/* Cart Items with Scroll Container */}
          <Box 
            sx={{ 
              maxHeight: cartItemsWithImages.length > 4 ? "400px" : "unset", 
              overflowY: cartItemsWithImages.length > 4 ? "auto" : "visible",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "grey.100",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "grey.400",
                borderRadius: "4px",
              },
            }}
          >
            <Stack spacing={0}>
              {cartItemsWithImages.map((item) => {
                const totalPrice = item.price * item.quantity;
                return (
                  <Stack
                    key={item.id}
                    direction="row"
                    alignItems="center"
                    sx={{
                      py: 2,
                      px: 2,
                      borderBottom: "1px solid",
                      borderColor: "grey.200",
                      "&:hover": { bgcolor: "grey.50" },
                    }}
                  >
                    <Stack direction="row" alignItems="center" sx={{ flex: 3 }}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.productVariantBasic.product.name}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          mr: 2,
                        }}
                      />
                      <Stack>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium", color: "text.primary" }}
                        >
                          {item.productVariantBasic.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Màu: {item.productVariantBasic.color?.name || "N/A"} | Size:{" "}
                          {item.productVariantBasic.size?.name || "N/A"}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography
                      variant="body1"
                      sx={{ flex: 1, textAlign: "center", fontWeight: "medium" }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ flex: 1, justifyContent: "center" }}
                    >
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        sx={{ 
                          minWidth: "30%", 
                          height: "32px", 
                          p: 0, 
                          color: "black", 
                          border: "1px solid", 
                          borderColor: "grey.300",
                        }}
                      >
                        <Typography>-</Typography>
                      </Button>
                      <TextField
                        value={item.quantity}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          width: 40,
                          m: "0 5px",
                          "& .MuiInputBase-input": { 
                            textAlign: "center", 
                            py: 0.5,
                            px: 0,
                          },
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1
                          }
                        }}
                        inputProps={{ style: { textAlign: "center" } }}
                        variant="outlined"
                        size="small"
                      />
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        sx={{ 
                          minWidth: "30%", 
                          height: "32px", 
                          p: 0, 
                          color: "black", 
                          border: "1px solid", 
                          borderColor: "grey.300",
                          borderRadius: 2,
                        }}
                      >
                        <Typography>+</Typography>
                      </Button>
                    </Stack>

                    <Typography
                      variant="body1"
                      sx={{ flex: 1, textAlign: "center", fontWeight: "medium" }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice)}
                    </Typography>

                    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <IconButton
                        onClick={() => openDeleteDialog(item.id)}
                        sx={{ color: "black" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          </Box>

          {/* Total and Checkout Button */}
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={3} sx={{ mt: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Tổng cộng:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                cartItemsWithImages.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                )
              )}
            </Typography>
            <Button
              variant="contained"
              onClick={handleProceedToShipping}
              sx={{
                backgroundColor: "black",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 1,
                fontWeight: "medium",
              }}
            >
              MUA HÀNG
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận xóa sản phẩm
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>
            Huỷ
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            sx={{ 
              bgcolor: "error.main",
              "&:hover": { bgcolor: "error.dark" }
            }}
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default MyCart;