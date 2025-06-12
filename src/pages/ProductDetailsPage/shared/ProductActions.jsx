import { Alert, alpha, Button, Skeleton, Snackbar, Stack } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCartItemsFromApi } from "@/store/redux/cart/reducer";
import { setOrderData } from "@/store/redux/order/reducer";
import { selectUserId } from "@/store/redux/user/reducer";
import { useState } from "react";
import axios from "axios";

const ProductActions = ({
  products,
  loading,
  selectedQuantity,
  selectedColor,
  selectedSize,
  selectedVariant,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateInputs = () => {
    if (!products) {
      setSnackbar({
        open: true,
        message: "Không có thông tin sản phẩm!",
        severity: "error",
      });
      return false;
    }

    if (!selectedQuantity || selectedQuantity < 1) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn số lượng hợp lệ!",
        severity: "error",
      });
      return false;
    }

    if (!selectedColor) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn màu sắc!",
        severity: "error",
      });
      return false;
    }

    if (!selectedSize) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn kích thước!",
        severity: "error",
      });
      return false;
    }

    if (products.stock < selectedQuantity) {
      setSnackbar({
        open: true,
        message: "Sản phẩm đã hết hàng!",
        severity: "error",
      });
      return false;
    }

    if (!selectedVariant?.id) {
      setSnackbar({
        open: true,
        message: "Không tìm thấy biến thể sản phẩm!",
        severity: "error",
      });
      return false;
    }

    return true;
  };

  const handleAddToCart = async () => {
    if (!userId) {
      setSnackbar({
        open: true,
        message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!",
        severity: "error",
      });
      return;
    }

    if (!validateInputs()) return;

    const cartItem = {
      productId: products.id,
      image: products.images || products.thumbnail,
      name: products.title || products.name,
      price: products.price,
      color: selectedColor,
      size: selectedSize,
      productVariantId: selectedVariant.id,
      quantity: selectedQuantity,
      productVariantBasic: {
        id: selectedVariant.id,
        color: { name: selectedColor },
        size: { name: selectedSize },
        product: { id: products.id, name: products.title || products.name },
      },
    };

    const existingItem = cartItems.find(
      (item) => item.productVariantId === cartItem.productVariantId
    );

    try {
      const token = localStorage.getItem("accessToken");
      if (existingItem) {
        // Cập nhật số lượng nếu sản phẩm đã tồn tại
        const newQuantity = existingItem.quantity + selectedQuantity;
        await axios.put(
          `${import.meta.env.VITE_API_URL}/v1/cart-items/${existingItem.id}`,
          { quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({
          open: true,
          message: "Đã cập nhật số lượng sản phẩm!",
          severity: "success",
        });
      } else {
        // Thêm mới nếu sản phẩm chưa tồn tại
        await axios.post(
          `${import.meta.env.VITE_API_URL}/v1/cart-items`,
          {
            productVariantId: cartItem.productVariantId,
            quantity: cartItem.quantity,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSnackbar({
          open: true,
          message: "Đã thêm sản phẩm vào giỏ hàng!",
          severity: "success",
        });
      }

      // Đồng bộ dữ liệu từ API
      await dispatch(fetchCartItemsFromApi());
    } catch (error) {
      console.error("Lỗi khi thêm/cập nhật giỏ hàng:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: `Lỗi khi thêm vào giỏ hàng: ${error.response?.data?.message || "Kiểm tra lại thông tin"}`,
        severity: "error",
      });
    }
  };

  const handleBuyNow = async () => {
  if (!validateInputs()) return;

  const orderItem = {
    productVariantId: selectedVariant.id,
    productId: products.id, // Thêm productId để lấy hình ảnh
    image: products.images, // Lưu tạm thời
    name: products.title || products.name,
    price: products.price,
    quantity: selectedQuantity,
    color: selectedColor,
    size: selectedSize,
  };

  const token = localStorage.getItem("accessToken");
  try {
    // Lấy hình ảnh từ API
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/v1/products/${products.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    orderItem.image = response.data.result.images?.[0]?.imageUrl || "/default.jpg";
  } catch (error) {
    console.error("Lỗi khi lấy hình ảnh:", error);
    orderItem.image = "/default.jpg"; // Fallback
  }

  const orderData = [orderItem];
  dispatch(setOrderData(orderData));
  navigate("/shipping-method", { state: { orderData, isBuyNow: true } });
  console.log("ProductActions - orderData:", orderData);
};

  if (loading) return <Skeleton variant="rectangular" width={"100%"} height={30} />;

  return (
    <>
      {products ? (
        <Stack direction={"row"} alignItems={"center"} sx={{ m: "30px 0" }}>
          <Button
            variant="outlined"
            sx={{
              p: "10px 30px",
              borderColor: "black",
              color: "black",
              "&:hover": {
                backgroundColor: alpha("#d9d9d9", 0.5),
              },
            }}
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </Button>

          <Button
            variant="contained"
            sx={{
              ml: 4,
              p: "10px 30px",
              backgroundColor: "black",
              color: "white",
            }}
            onClick={handleBuyNow}
          >
            Mua ngay
          </Button>
        </Stack>
      ) : null}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", p: "10px 20px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

ProductActions.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
  selectedQuantity: PropTypes.number,
  selectedColor: PropTypes.string,
  selectedSize: PropTypes.string,
  selectedVariant: PropTypes.object,
};

export default ProductActions;