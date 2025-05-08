import PaymentsIcon from "@mui/icons-material/Payments";
import PlaceIcon from "@mui/icons-material/Place";
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
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const headerInfos = ["Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền"];

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData || [];

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CASH");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!orderData || (Array.isArray(orderData) && orderData.length === 0)) {
      setSnackbar({
        open: true,
        message: "Không có dữ liệu đơn hàng! Quay lại trang chủ.",
        severity: "error",
      });
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    const token = localStorage.getItem("accessToken");
    console.log("Token:", token); // Log token để debug

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          "http://222.255.119.40:8080/adamstore/v1/users/addresses?pageNo=1&pageSize=10",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const addressList = res.data.result.items;
        console.log("Dữ liệu địa chỉ:", addressList);

        const detailedAddresses = addressList.map((addr) => ({
          ...addr,
          wardName: addr.ward?.name || "Không xác định",
          districtName: addr.district?.name || "Không xác định",
          provinceName: addr.province?.name || "Không xác định",
        }));

        setAddresses(detailedAddresses);
        const defaultAddress = detailedAddresses.find((addr) => addr.isDefault);
        setSelectedAddress(defaultAddress?.id || detailedAddresses[0]?.id || "");
      } catch (err) {
        console.error("Lỗi khi lấy địa chỉ:", err);
        setSnackbar({
          open: true,
          message: "Lỗi khi lấy địa chỉ!",
          severity: "error",
        });
      }
    };

    fetchAddresses();
  }, [orderData, navigate]);

  useEffect(() => {
    if (selectedAddress) {
      const token = localStorage.getItem("accessToken");
      const orderItems = Array.isArray(orderData)
        ? orderData.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          }))
        : [
            {
              productVariantId: orderData.productVariantId,
              quantity: orderData.quantity,
            },
          ];

      axios
        .post(
          "http://222.255.119.40:8080/adamstore/v1/shipping/calculate-fee",
          {
            addressId: selectedAddress,
            orderItems: orderItems,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          setShippingFee(res.data.result.shippingFee || 0);
        })
        .catch((err) => {
          console.error("Lỗi khi tính phí vận chuyển:", err);
          setShippingFee(0);
        });
    }
  }, [selectedAddress, orderData]);

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

    const token = localStorage.getItem("accessToken");
    const orderItems = Array.isArray(orderData)
      ? orderData.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        }))
      : [
          {
            productVariantId: orderData.productVariantId,
            quantity: orderData.quantity,
          },
        ];

    // Log dữ liệu gửi lên để debug
    console.log("Dữ liệu gửi lên:", {
      addressId: selectedAddress,
      orderItems,
      shippingFee,
      paymentMethod: selectedPaymentMethod,
    });

    try {
      const response = await axios.post(
        "http://222.255.119.40:8080/adamstore/v1/orders",
        {
          addressId: selectedAddress,
          orderItems: orderItems,
          shippingFee: shippingFee,
          paymentMethod: selectedPaymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const orderId = response.data.result.id;

      if (selectedPaymentMethod === "VNPAY") {
        const paymentResponse = await axios.get(
          `http://222.255.119.40:8080/adamstore/v1/orders/${orderId}/vn-pay`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const paymentUrl = paymentResponse.data.result.paymentUrl;
        console.log("Payment URL:", paymentUrl);
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          setSnackbar({
            open: true,
            message: "Không nhận được URL thanh toán!",
            severity: "error",
          });
        }
      } else {
        navigate("/orderConfirmation", {
          state: { orderId: orderId },
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: `Lỗi khi tạo đơn hàng: ${error.response?.data?.message || "Kiểm tra lại dữ liệu"}`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const totalPrice = Array.isArray(orderData)
    ? orderData.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : (orderData.price || 0) * (orderData.quantity || 0);

  return (
    <>
      <div
        style={{
          width: "100%",
          border: "1px solid var(--border-color)",
          borderRadius: 5,
          marginTop: "50px",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-around"}
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

        {(Array.isArray(orderData) ? orderData : [orderData]).map((item, index) => (
          <Stack
            key={index}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{ mt: 2, px: 2 }}
          >
            <Stack direction={"row"} alignItems={"center"} sx={{ flex: 3 }}>
              <img src={item.image.imageUrl} alt={item.name} width={90} height={90} style={{ objectFit: "cover" }} />
              <Stack sx={{ ml: 2 }}>
                <Typography sx={{ color: "var(--text-color)" }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "var(--text-color-secondary)" }}>
                  Màu sắc: {item.color || "Chưa chọn"} | Kích thước: {item.size || "Chưa chọn"}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
              {item.price?.toLocaleString()}đ
            </Typography>
            <Typography variant="body1" sx={{ flex: 1, textAlign: "center" }}>
              {item.quantity}
            </Typography>
            <Typography variant="h6" sx={{ flex: 1, textAlign: "center" }}>
              {(item.price * item.quantity).toLocaleString()}đ
            </Typography>
          </Stack>
        ))}

        <Stack direction={"column"} sx={{ m: "30px 0 30px 50px" }}>
          <Stack direction={"row"} alignItems={"center"}>
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
                  {addr.streetDetail}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction={"row"} alignItems={"center"} sx={{ mt: 2 }}>
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
          direction={"row"}
          alignItems={"center"}
          justifyContent={"end"}
          sx={{ m: "50px 100px" }}
        >
          <Typography variant="h6">Phí vận chuyển: </Typography>
          <Typography variant="h5" sx={{ m: "0 50px 0 10px" }}>
            {shippingFee.toLocaleString()}đ
          </Typography>
          <Typography variant="h6">Tổng số tiền: </Typography>
          <Typography variant="h5" sx={{ m: "0 50px 0 10px" }}>
            {(totalPrice + shippingFee).toLocaleString()}đ
          </Typography>
          <Button
            variant="contained"
            onClick={handleConfirmOrder}
            sx={{ backgroundColor: "black", color: "white", p: "10px 30px" }}
          >
            Đặt ngay
          </Button>
        </Stack>
      </div>

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
    </>
  );
};

export default Order;