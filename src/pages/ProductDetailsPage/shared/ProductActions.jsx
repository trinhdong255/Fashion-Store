import { Alert, alpha, Button, Skeleton, Snackbar, Stack } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAddToCartMutation, useGetCartByUserQuery, useUpdateCartMutation } from "@/services/api/cart";
import { addToCart as addToCartAction } from "@/store/redux/cart/reducer";
import { setOrderData } from "@/store/redux/order/reducer";
import { selectUserId } from "@/store/redux/user/reducer";
import { useState } from "react";

const ProductActions = ({
  products,
  loading,
  selectedQuantity,
  selectedColor,
  selectedSize,
  selectedVariant, // Thêm prop để nhận selectedVariant
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const { data: cartData, isLoading: isCartLoading, refetch } = useGetCartByUserQuery(userId, {
    skip: !userId,
  });
  const [addToCartApi] = useAddToCartMutation();
  const [updateCartApi] = useUpdateCartMutation();
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
      color: selectedColor || "TRẮNG",
      size: selectedSize || "S",
      productVariantId: selectedVariant?.id, // Thêm productVariantId
    };

    const existingItem = cartItems.find(
      (item) =>
        item.productId === cartItem.productId &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );

    if (existingItem) {
      setSnackbar({
        open: true,
        message: "Sản phẩm đã có trong giỏ hàng!",
        severity: "info",
      });
      return;
    }

    try {
      if (cartData && cartData.carts && cartData.carts.length > 0) {
        const currentCart = cartData.carts[0];
        const updatedProducts = [
          ...currentCart.products,
          { id: cartItem.productId },
        ];

        await updateCartApi({
          id: currentCart.id,
          cartData: {
            userId,
            products: updatedProducts,
          },
        }).unwrap();
      } else {
        await addToCartApi({
          userId,
          products: [{ id: cartItem.productId }],
        }).unwrap();
      }

      dispatch(addToCartAction(cartItem));

      setSnackbar({
        open: true,
        message: "Đã thêm sản phẩm vào giỏ hàng!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi thêm vào giỏ hàng!",
        severity: "error",
      });
    }
  };

  const handleBuyNow = () => {
    if (!validateInputs()) return;

    const orderItem = {
      productVariantId: selectedVariant?.id, // Sử dụng productVariantId từ selectedVariant
      image: products.images,
      name: products.title || products.name,
      price: products.price,
      quantity: selectedQuantity || 1,
      color: selectedColor || "TRẮNG",
      size: selectedSize || "S",
    };

    const orderData = [orderItem];
    dispatch(setOrderData(orderData));
    navigate("/shipping-method", { state: { orderData } });
  };

  if (isCartLoading) return <Skeleton variant="rectangular" width={"100%"} height={30} />;

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
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
  selectedVariant: PropTypes.object, // Thêm propTypes cho selectedVariant
};

export default ProductActions;