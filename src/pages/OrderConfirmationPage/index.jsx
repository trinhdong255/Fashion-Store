import { Container, Typography, Button, Card, CardContent, Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const error = location.state?.error;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("accessToken");
    axios
      .get(`http://localhost:8080/adamstore/v1/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrder(res.data.result);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông tin đơn hàng:", err);
        navigate("/");
      });
  }, [orderId, navigate]);

  if (!order && !error) {
    return <Typography>Đang tải...</Typography>;
  }

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
                      <TableCell sx={{ fontWeight: "bold" }}>Mã đơn hàng</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ngày đặt</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Tên khách hàng</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Địa chỉ</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Tổng tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        {order.address?.streetDetail}, {order.address?.ward?.name}, {order.address?.district?.name}, {order.address?.province?.name}
                      </TableCell>
                      <TableCell>{order.totalPrice?.toLocaleString()}đ</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Chi tiết sản phẩm
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Sản phẩm</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Màu sắc</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Kích thước</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Đơn giá</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productVariant?.product?.name}</TableCell>
                        <TableCell>{item.productVariant?.color?.name}</TableCell>
                        <TableCell>{item.productVariant?.size?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unitPrice?.toLocaleString()}đ</TableCell>
                        <TableCell>{(item.unitPrice * item.quantity).toLocaleString()}đ</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Cập nhật lần cuối: {order.updatedAt}
                </Typography>
              </CardContent>
            </Card>
            <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "black", color: "white", p: "10px 30px" }}
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