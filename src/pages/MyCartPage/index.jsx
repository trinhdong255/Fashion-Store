import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchCartItemsFromApi, updateQuantity, removeFromCart } from "@/store/redux/cart/reducer";
import { selectUserId } from "@/store/redux/user/reducer";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MyCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      dispatch(fetchCartItemsFromApi()).finally(() => setLoading(false));
    }
  }, [userId, dispatch]);

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
      console.error("Lỗi khi cập nhật số lượng:", error.response?.data || error.message);
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
      console.error("Lỗi khi xóa sản phẩm:", error.response?.data || error.message);
    }
  };

  const handleProceedToShipping = () => {
    navigate("/shipping-method", { state: { orderData: cartItems } });
  };

  if (loading) return <div>Loading...</div>;
  if (!userId) return <div>Vui lòng đăng nhập!</div>;
  if (cartItems.length === 0) return <div>Chưa có sản phẩm nào!</div>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        GIỎ HÀNG CỦA BẠN
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ borderBottom: "1px solid #ddd", pb: 1 }}>
          {["Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền", "Xóa"].map((header, index) => (
            <Typography
              key={index}
              sx={{
                flex: index === 0 ? 3 : 1,
                textAlign: index === 0 ? "left" : "center",
                fontSize: 20,
                fontWeight: "500",
                padding: "8px",
              }}
            >
              {header}
            </Typography>
          ))}
        </Stack>
        {cartItems.map((item) => {
          const totalPrice = item.price * item.quantity;
          return (
            <Stack
              key={item.id}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mt: 2, px: 2 }}
            >
              <Stack direction="row" alignItems="center" sx={{ flex: 3 }}>
                <img
                  src={item.image || "/default.jpg"}
                  alt={item.productVariantBasic.product.name}
                  style={{ width: 90, height: 90, objectFit: "cover" }}
                />
                <Stack sx={{ ml: 2 }}>
                  <Typography sx={{ color: "var(--text-color)" }}>
                    {item.productVariantBasic.product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-color-secondary)" }}>
                    Màu: {item.productVariantBasic.color?.name || "N/A"} | Size: {item.productVariantBasic.size?.name || "N/A"}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
              </Typography>
              <Stack direction="row" alignItems="center" sx={{ flex: 1, justifyContent: "center" }}>
                <IconButton
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Typography>-</Typography>
                </IconButton>
                <TextField
                  value={item.quantity}
                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                  sx={{ width: 40, textAlign: "center" }}
                  inputProps={{ style: { textAlign: "center" } }}
                />
                <IconButton
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Typography>+</Typography>
                </IconButton>
              </Stack>
              <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
              </Typography>
              <IconButton onClick={() => handleRemoveItem(item.id)} sx={{ color: "black" }}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          );
        })}
        <Typography sx={{ mt: 2, textAlign: "right", fontSize: 20 }}>
          Tổng cộng: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "black", color: "white", mt: 2, alignSelf: "flex-end", p: "10px 30px" }}
          onClick={handleProceedToShipping}
        >
          Mua hàng
        </Button>
      </Stack>
    </Box>
  );
};

export default MyCart;