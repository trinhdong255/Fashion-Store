import { SentimentDissatisfied } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Badge,
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
  CircularProgress,
  badgeClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { selectUserId, selectUser } from "@/store/redux/user/reducer";
import {
  removeFromCart,
  fetchCartItemsFromApi,
} from "@/store/redux/cart/reducer";

const CartButton = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItemsWithImages, setCartItemsWithImages] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const user = useSelector(selectUser);
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const cartTotalQuantity = useSelector(
    (state) => state.cart?.cartTotalQuantity || 0
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItemsFromApi());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      dispatch(fetchCartItemsFromApi()).finally(() => setLoading(false));
    }
  }, [open, userId, dispatch]);

  useEffect(() => {
    if (userId && cartItems.length > 0) {
      setLoading(true);
      const fetchImages = async () => {
        const token = localStorage.getItem("accessToken");
        const updatedItems = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/v1/products/${
                  item.productVariantBasic.product.id
                }`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              return {
                ...item,
                image:
                  response.data.result.images?.[0]?.imageUrl || "/default.jpg",
              };
            } catch (error) {
              console.error(
                `Lỗi khi lấy hình ảnh cho sản phẩm ${item.productVariantBasic.product.id}:`,
                error
              );
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

  const handleConfirmRemove = async () => {
    if (itemToRemove) {
      const token = localStorage.getItem("accessToken");
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/v1/cart-items/${itemToRemove.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(removeFromCart({ id: itemToRemove.id }));
        await dispatch(fetchCartItemsFromApi());
        console.log("Xóa sản phẩm thành công, ID:", itemToRemove.id);
      } catch (error) {
        console.error(
          "Lỗi khi xóa sản phẩm:",
          error.response?.data || error.message
        );
      }
    }
    handleCloseDialog();
  };

  const handleViewCart = () => {
    navigate("/my-cart");
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
        <Box sx={{ p: 2 }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon fontSize="large" />
          </IconButton>
          <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
            <LocalMallIcon />
            <Typography variant="h5">GIỎ HÀNG CỦA BẠN</Typography>
          </Stack>
          <Divider />
        </Box>

        {loading ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 1 }}>Đang tải giỏ hàng...</Typography>
          </Box>
        ) : !userId ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <Typography variant="h6">VUI LÒNG ĐĂNG NHẬP!</Typography>
            <SentimentDissatisfied fontSize="large" />
          </Box>
        ) : cartItemsWithImages.length === 0 ? (
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
              {cartItemsWithImages.map((item, index) => {
                if (!item.productVariantBasic?.product) {
                  console.error("Invalid item structure:", item);
                  return null;
                }
                return (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ borderBottom: "1px solid #ddd", pb: 1 }}
                  >
                    <img
                      src={item.image}
                      alt={item.productVariantBasic.product.name}
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        {item.productVariantBasic.product.name}
                      </Typography>
                      <Typography variant="body2">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </Typography>
                      <Typography variant="body2">
                        Màu sắc: {item.productVariantBasic.color?.name || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Kích thước:{" "}
                        {item.productVariantBasic.size?.name || "N/A"}
                      </Typography>
                      <Typography variant="body2">
                        Số lượng: {item.quantity}
                      </Typography>
                    </Stack>
                    <IconButton
                      onClick={() => handleOpenDialog(item)}
                      sx={{ color: "black" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        )}

        {cartItemsWithImages.length > 0 && (
          <Box sx={{ flexShrink: 0, p: 2 }}>
            <Button
              variant="contained"
              sx={{ width: "100%", color: "white", backgroundColor: "black" }}
              onClick={handleViewCart}
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
              <strong>
                {itemToRemove?.productVariantBasic?.product?.name || "N/A"}
              </strong>{" "}
              khỏi giỏ hàng?
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
    <Fragment>
      <IconButton
        sx={{ mr: 2 }}
        aria-label="shopping-cart"
        onClick={toggleDrawer(true)}
      >
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
    </Fragment>
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
