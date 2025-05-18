import PaymentsIcon from "@mui/icons-material/Payments";
import PlaceIcon from "@mui/icons-material/Place";
import DiscountIcon from "@mui/icons-material/Discount";
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchCartItemsFromApi,
  clearCartItemsFromApi,
} from "@/store/redux/cart/reducer";

const headerInfos = ["Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền"];

const formatLargeNumber = (number) => {
  if (number < 1000) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  } else if (number >= 1000 && number < 1000000) {
    return `${(number / 1000).toFixed(2)}K đ`;
  } else {
    return `${(number / 1000000).toFixed(2)}M đ`;
  }
};

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.cartItems || []);
  const [orderData, setOrderData] = useState(location.state?.orderData || []);
  const [orderDataWithImages, setOrderDataWithImages] = useState([]);

  const [isFromBuyNow, setIsFromBuyNow] = useState(() => {
    const initialOrderData = location.state?.orderData || [];
    if (initialOrderData.length > 0) {
      return initialOrderData.some(
        (item) =>
          "productVariantId" in item && item.productVariantId !== undefined
      );
    }
    return false;
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CASH");
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const syncOrderData = async () => {
      if (isFromBuyNow) {
        setOrderData(location.state?.orderData || []);
      } else {
        await dispatch(fetchCartItemsFromApi());
        setOrderData(cartItems.length > 0 ? cartItems : []);
      }
    };

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/adamstore/v1/users/addresses?pageNo=1&pageSize=10",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const addressList = res.data.result.items;
        const detailedAddresses = addressList.map((addr) => ({
          ...addr,
          wardName: addr.ward?.name || "Không xác định",
          districtName: addr.district?.name || "Không xác định",
          provinceName: addr.province?.name || "Không xác định",
        }));
        setAddresses(detailedAddresses);
        const defaultAddress = detailedAddresses.find((addr) => addr.isDefault);
        setSelectedAddress(
          defaultAddress?.id || detailedAddresses[0]?.id || ""
        );
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setSnackbar({
          open: true,
          message: "Lỗi khi lấy địa chỉ!",
          severity: "error",
        });
      }
    };

    const fetchPromotions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/adamstore/v1/users/promotions/available?pageNo=1&pageSize=10&sortBy=discountPercent-desc",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const promotionList = res.data.result.items;
        setPromotions(promotionList);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setSnackbar({
          open: true,
          message: "Lỗi khi lấy danh sách mã giảm giá!",
          severity: "error",
        });
      }
    };

    syncOrderData();
    fetchAddresses();
    fetchPromotions();
  }, [dispatch, location.state?.orderData, location.pathname, isFromBuyNow]);

  useEffect(() => {
    if (orderData.length > 0) {
      const fetchImages = async () => {
        const token = localStorage.getItem("accessToken");
        const updatedItems = await Promise.all(
          orderData.map(async (item) => {
            const productId = isFromBuyNow
              ? item.productId
              : item.productVariantBasic?.product?.id;
            if (!productId) {
              return {
                ...item,
                image: "/default.jpg",
              };
            }
            try {
              const response = await axios.get(
                `http://222.255.119.40:8080/adamstore/v1/products/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return {
                ...item,
                image:
                  response.data.result.images?.[0]?.imageUrl || "/default.jpg",
              };
            } catch (error) {
              console.error(
                `Lỗi khi lấy hình ảnh cho sản phẩm ${productId}:`,
                error
              );
              return {
                ...item,
                image: "/default.jpg",
              };
            }
          })
        );
        setOrderDataWithImages(updatedItems);
      };
      fetchImages();
    } else {
      setOrderDataWithImages([]);
    }
  }, [orderData, isFromBuyNow]);

  useEffect(() => {
    if (selectedAddress && orderData.length > 0) {
      const token = localStorage.getItem("accessToken");

      const orderItems = orderData
        .map((item) => ({
          productVariantId: isFromBuyNow
            ? item.productVariantId
            : item.productVariantBasic?.id,
          quantity: item.quantity,
        }))
        .filter((item) => item.productVariantId && item.quantity > 0);

      if (orderItems.length === 0) {
        setSnackbar({
          open: true,
          message:
            "Không có sản phẩm hợp lệ để tính phí vận chuyển! Vui lòng kiểm tra lại giỏ hàng.",
          severity: "error",
        });
        setShippingFee(0);
        return;
      }

      axios
        .post(
          "http://localhost:8080/adamstore/v1/shipping/calculate-fee",
          { addressId: selectedAddress, orderItems },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setShippingFee(res.data.result.total || 0);
        })
        .catch((err) => {
          console.error(
            "Error calculating shipping fee:",
            err.response?.data || err.message
          );
          setSnackbar({
            open: true,
            message: `Lỗi khi tính phí vận chuyển: ${
              err.response?.data?.message || "Vui lòng kiểm tra lại dữ liệu."
            }`,
            severity: "error",
          });
          setShippingFee(0);
        });
    } else {
      setShippingFee(0);
    }
  }, [selectedAddress, orderData, isFromBuyNow]);

  useEffect(() => {
    if (!isFromBuyNow) {
      setOrderData(cartItems);
    }
  }, [cartItems, isFromBuyNow]);

  const applyPromotionId = () => {
    const matchedPromotion = promotions.find(
      (promo) => promo.id === parseInt(selectedPromotionId)
    );
    if (matchedPromotion) {
      setAppliedPromotion(matchedPromotion);
      calculateDiscount(matchedPromotion);
      setSnackbar({
        open: true,
        message: `Áp dụng mã ${matchedPromotion.code} thành công!`,
        severity: "success",
      });
      setOpenDialog(false);
    } else {
      setAppliedPromotion(null);
      setDiscountAmount(0);
      setSnackbar({
        open: true,
        message: "Mã giảm giá không hợp lệ hoặc không khả dụng!",
        severity: "error",
      });
    }
  };

  const calculateDiscount = (promotion) => {
    if (!promotion) {
      setDiscountAmount(0);
      return;
    }

    const total = orderData.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return sum + price * quantity;
    }, 0);

    if (total === 0) {
      setSnackbar({
        open: true,
        message:
          "Dữ liệu đơn hàng không hợp lệ, vui lòng kiểm tra lại giỏ hàng!",
        severity: "error",
      });
      setDiscountAmount(0);
      return;
    }

    const discountPercent = promotion.discountPercent || 0;
    let discount = (total * discountPercent) / 100;
    if (discount > total) discount = total;
    setDiscountAmount(discount);
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn địa chỉ giao hàng!",
        severity: "error",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn phương thức thanh toán!",
        severity: "error",
      });
      return;
    }

    if (!isFromBuyNow) {
      await dispatch(fetchCartItemsFromApi());
      setOrderData(cartItems);
    }

    if (!orderData || orderData.length === 0) {
      setSnackbar({
        open: true,
        message: "Giỏ hàng trống, vui lòng thêm sản phẩm!",
        severity: "error",
      });
      return;
    }

    const token = localStorage.getItem("accessToken");
    const orderItems = orderData
      .map((item) => ({
        productVariantId: isFromBuyNow
          ? item.productVariantId
          : item.productVariantBasic?.id || item.id,
        quantity: item.quantity,
      }))
      .filter((item) => item.productVariantId && item.quantity > 0);

    if (orderItems.length === 0) {
      setSnackbar({
        open: true,
        message: "Không có sản phẩm hợp lệ để đặt hàng! Vui lòng kiểm tra lại.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/adamstore/v1/orders",
        {
          addressId: selectedAddress,
          orderItems,
          promotionId: appliedPromotion?.id || null,
          shippingFee: shippingFee,
          paymentMethod: selectedPaymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const orderId = response.data.result.id;

      if (selectedPaymentMethod === "VNPAY") {
        const paymentResponse = await axios.get(
          `http://222.255.119.40:8080/adamstore/v1/orders/${orderId}/vn-pay`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const paymentUrl = paymentResponse.data.result.paymentUrl;
        if (paymentUrl) window.location.href = paymentUrl;
        else
          setSnackbar({
            open: true,
            message: "Không nhận được URL thanh toán!",
            severity: "error",
          });
      } else {
        if (!isFromBuyNow) {
          await dispatch(clearCartItemsFromApi());
        }
        navigate("/orderConfirmation", {
          state: {
            orderId,
            appliedPromotion,
            discountAmount,
            totalPrice:
              orderData.reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
                0
              ) -
              discountAmount +
              shippingFee,
            orderData: orderDataWithImages,
          },
        });
      }
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message
      );
      setSnackbar({
        open: true,
        message: `Lỗi khi tạo đơn hàng: ${
          error.response?.data?.message || "Kiểm tra lại dữ liệu"
        }`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPromotionId("");
  };

  const totalPrice = orderData.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return sum + price * quantity;
  }, 0);

  const finalPrice = totalPrice - discountAmount + shippingFee;

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid var(--border-color)",
        borderRadius: 3,
        marginTop: "50px",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-around"
        sx={{ borderBottom: "1px solid var(--border-color)" }}
      >
        {headerInfos.map((headerInfo, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: 20,
              fontWeight: "500",
              flex: index === 0 ? 3 : 1,
              textAlign: index === 0 ? "left" : "center",
              padding: "8px",
            }}
          >
            {headerInfo}
          </Typography>
        ))}
      </Stack>

      <Box
        sx={{
          maxHeight: "500px",
          overflowY: orderDataWithImages.length > 5 ? "auto" : "hidden",
          px: 2,
        }}
      >
        {orderDataWithImages.map((item, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2 }}
          >
            <Stack direction="row" alignItems="center" sx={{ flex: 3 }}>
              <img
                src={item.image}
                alt={item.name || item.productVariantBasic?.product?.name}
                width={90}
                height={90}
                style={{ objectFit: "cover" }}
              />
              <Stack sx={{ ml: 2 }}>
                <Typography sx={{ color: "var(--text-color)" }}>
                  {item.name || item.productVariantBasic?.product?.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-color-secondary)" }}
                >
                  Màu:{" "}
                  {item.color || item.productVariantBasic?.color?.name || "N/A"}{" "}
                  | Size:{" "}
                  {item.size || item.productVariantBasic?.size?.name || "N/A"}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price)}
            </Typography>
            <Typography variant="body1" sx={{ flex: 1, textAlign: "center" }}>
              {item.quantity}
            </Typography>
            <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price * item.quantity)}
            </Typography>
          </Stack>
        ))}
      </Box>

      <Stack direction="column" sx={{ m: "30px 0 30px 50px" }}>
        <Stack direction="row" alignItems="center">
          <PlaceIcon />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Địa chỉ nhận hàng
          </Typography>
        </Stack>
        <FormControl fullWidth sx={{ mt: 2, maxWidth: "500px" }}>
          <InputLabel>Chọn địa chỉ</InputLabel>
          <Select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            label="Chọn địa chỉ"
          >
            {addresses.map((addr) => (
              <MenuItem key={addr.id} value={addr.id}>
                {addr.streetDetail}, {addr.wardName}, {addr.districtName},{" "}
                {addr.provinceName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
          <DiscountIcon />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Mã giảm giá
          </Typography>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{ mt: 2, maxWidth: "500px" }}
        >
          <TextField
            label="Chọn mã giảm giá"
            value={appliedPromotion ? appliedPromotion.code : ""}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ marginRight: "8px", cursor: "pointer" }}
                  onClick={handleOpenDialog}
                >
                  <path d="M10 12.5L5 7.5H15L10 12.5Z" fill="#000000" />
                </svg>
              ),
            }}
            sx={{ flex: 1, mr: 2 }}
            onClick={handleOpenDialog}
          />
        </Stack>
        {appliedPromotion && (
          <Typography sx={{ mt: 1, color: "green" }}>
            Đã áp dụng mã {appliedPromotion.code} - Giảm{" "}
            {appliedPromotion.discountPercent}%
          </Typography>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{ fontWeight: "bold", fontSize: "24px", textAlign: "center" }}
          >
            Chọn Fashion Store Voucher
          </DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "bold", ml: 3 }}>
            Mã Miễn Phí Vận Chuyển
          </Typography>
          <DialogContent>
            <Stack spacing={2}>
              {promotions.map((promo, index) => (
                <Stack
                  key={promo.id}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor:
                      selectedPromotionId === promo.id ? "#f5f5f5" : "white",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedPromotionId(promo.id.toString())}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <img
                      src="/src/assets/images/voucher.png"
                      alt="Voucher Icon"
                      width={40}
                      height={40}
                    />
                  </Box>
                  <Stack flex={1}>
                    <Typography variant="body1">{promo.description}</Typography>
                    <Typography variant="body2" sx={{ color: "black" }}>
                      HSD: {promo.endDate || "Không thời hạn"}
                    </Typography>
                  </Stack>
                  <Radio
                    checked={selectedPromotionId === promo.id.toString()}
                    onChange={() => setSelectedPromotionId(promo.id.toString())}
                    color="default"
                  />
                </Stack>
              ))}
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: "black",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                px: 3,
              }}
            >
              Trở lại
            </Button>
            <Button
              onClick={applyPromotionId}
              variant="contained"
              sx={{ backgroundColor: "black", color: "white", px: 3 }}
              disabled={!selectedPromotionId}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Stack direction="row" alignItems="center" sx={{ mt: 2 }}>
          <PaymentsIcon />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Phương thức thanh toán
          </Typography>
        </Stack>
        <RadioGroup
          value={selectedPaymentMethod}
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          sx={{ m: "20px" }}
        >
          <FormControlLabel
            value="CASH"
            control={<Radio color="default" />}
            label="Thanh toán tiền mặt (CASH)"
          />
          <FormControlLabel
            value="VNPAY"
            control={<Radio color="default" />}
            label="Thanh toán qua VNPAY"
          />
        </RadioGroup>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="end"
        sx={{ m: "50px 100px", gap: 2 }}
      >
        <Stack direction="row" alignItems="center">
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            Phí vận chuyển:
          </Typography>
          <Typography variant="h5" sx={{ ml: 2, mr: 4, whiteSpace: "nowrap" }}>
            {formatLargeNumber(shippingFee)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            Giảm giá:
          </Typography>
          <Typography variant="h5" sx={{ ml: 2, mr: 4, whiteSpace: "nowrap" }}>
            {formatLargeNumber(discountAmount)}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            Tổng số tiền:
          </Typography>
          <Typography variant="h5" sx={{ ml: 2, mr: 4, whiteSpace: "nowrap" }}>
            {formatLargeNumber(finalPrice)}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          onClick={handleConfirmOrder}
          sx={{
            backgroundColor: "black",
            color: "white",
            p: "10px 30px",
            whiteSpace: "nowrap",
          }}
        >
          Đặt ngay
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Order;
