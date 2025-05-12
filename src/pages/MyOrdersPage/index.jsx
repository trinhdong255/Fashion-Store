import {
  Container,
  Tab,
  Tabs,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WallpaperRepresentative from "@/components/WallpaperRepresentative";

const MyOrders = () => {
  const [value, setValue] = useState("PENDING");
  const [orders, setOrders] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const orderStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    const fetchOrdersByStatus = async (status) => {
      try {
        const response = await axios.get(
          "http://222.255.119.40:8080/adamstore/v1/orders/search",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              pageNo: 1,
              pageSize: 20,
              sortBy: "",
              search: `orderStatus~${status}`,
            },
          }
        );

        setOrders((prev) => ({
          ...prev,
          [status]: response.data.result.items,
        }));
      } catch (err) {
        console.error(`Lỗi khi lấy đơn hàng với trạng thái ${status}:`, err);
        setError(
          `Không thể tải đơn hàng với trạng thái ${status}. Vui lòng thử lại!`
        );
      }
    };

    orderStatuses.forEach(fetchOrdersByStatus);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRetryPayment = (orderId) => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(
        `http://222.255.119.40:8080/adamstore/v1/orders/${orderId}/retry-payment`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const paymentUrl = res.data.result.paymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      })
      .catch((err) => {
        console.error("Lỗi khi thử lại thanh toán:", err);
        setError("Lỗi khi thử lại thanh toán!");
      });
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Header />
      <WallpaperRepresentative titleHeader="Đơn hàng của tôi" />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="order status tabs"
          variant="fullWidth"
          sx={{
            mb: 4,
            "& .MuiTab-root": { fontSize: 16, fontWeight: 500, color: "#333" },
            "& .MuiTabs-indicator": { backgroundColor: "#000" },
          }}>
          <Tab value="PENDING" label="Chờ thanh toán" />
          <Tab value="PROCESSING" label="Đang xử lý" />
          <Tab value="SHIPPED" label="Đang giao hàng" />
          <Tab value="DELIVERED" label="Đã giao hàng" />
          <Tab value="CANCELLED" label="Đã hủy" />
        </Tabs>

        <Box sx={{ mb: 4 }}>
          {error && (
            <Snackbar
              open={!!error}
              autoHideDuration={6000}
              onClose={handleCloseError}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}>
              <Alert
                onClose={handleCloseError}
                severity="error"
                sx={{ width: "100%" }}>
                {error}
              </Alert>
            </Snackbar>
          )}
          {orders[value]?.length === 0 ? (
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ py: 4 }}>
              Không có đơn hàng nào.
            </Typography>
          ) : (
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
                      Mã đơn hàng
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
                      Tổng tiền
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 16 }}>
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders[value]?.map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>
                        {order.totalPrice?.toLocaleString()}đ
                      </TableCell>
                      <TableCell>
                        {order.orderStatus === "PENDING" && (
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#000",
                              color: "#fff",
                              "&:hover": { backgroundColor: "#333" },
                            }}
                            onClick={() => handleRetryPayment(order.id)}>
                            Thanh toán lại
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default MyOrders;
