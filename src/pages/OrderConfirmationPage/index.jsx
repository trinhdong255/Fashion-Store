import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const appliedPromotion = location.state?.appliedPromotion;
  const discountAmount = location.state?.discountAmount || 0;
  const totalPrice = location.state?.totalPrice || 0;
  const orderData = location.state?.orderData || []; // From Order.js
  const error = location.state?.error;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("accessToken");
    axios
      .get(`${import.meta.env.VITE_API_URL}/v1/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const orderData = res.data.result;
        setOrder(orderData);
        console.log("Order data from API in OrderConfirmation:", orderData);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err);
        navigate("/");
      });
  }, [orderId, navigate]);

  if (!order && !error) {
    return <Typography>Đang tải...</Typography>;
  }

  const displayedTotalPrice = order ? order.totalPrice || 0 : totalPrice || 0;

  // Calculate the original price (subtotal) from orderData
  const subtotal = orderData.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return sum + price * quantity;
  }, 0);

  // Calculate shipping fee: totalPrice includes subtotal - discount + shippingFee
  const shippingFee = displayedTotalPrice - (subtotal - discountAmount);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Đặt hàng thành công!
            </Typography>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin đơn hàng
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Mã đơn hàng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Ngày đặt
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Trạng thái
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tên khách hàng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tổng tiền
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        {order.address?.streetDetail},{" "}
                        {order.address?.ward?.name},{" "}
                        {order.address?.district?.name},{" "}
                        {order.address?.province?.name}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(displayedTotalPrice)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Chi tiết sản phẩm
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Sản phẩm
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Màu sắc</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Kích thước
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Số lượng
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Đơn giá</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Thành tiền
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.productVariant?.product?.name ||
                            "Không xác định"}
                        </TableCell>
                        <TableCell>
                          {item.productVariant?.color?.name || "Không xác định"}
                        </TableCell>
                        <TableCell>
                          {item.productVariant?.size?.name || "Không xác định"}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.unitPrice?.toLocaleString() || 0}đ
                        </TableCell>
                        <TableCell>
                          {(
                            (item.unitPrice || 0) * item.quantity
                          ).toLocaleString()}
                          đ
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {appliedPromotion && (
                  <Typography sx={{ mt: 2, color: "green" }}>
                    Đã áp dụng mã {appliedPromotion.code} - Giảm{" "}
                    {appliedPromotion.discountPercent}%
                  </Typography>
                )}

                <Stack sx={{ ml: 2 }}>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Giá gốc: {subtotal.toLocaleString()}đ
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Phí vận chuyển: {shippingFee.toLocaleString()}đ
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Giảm giá: {discountAmount.toLocaleString()}đ (
                    {appliedPromotion?.discountPercent || 0}%)
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Tổng cộng: {displayedTotalPrice.toLocaleString()}đ
                  </Typography>

                  <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                    Cập nhật lần cuối: {order.updatedAt}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  p: "10px 30px",
                }}
                onClick={() => navigate("/my-orders")}
              >
                Xem đơn hàng của tôi
              </Button>
            </Stack>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
