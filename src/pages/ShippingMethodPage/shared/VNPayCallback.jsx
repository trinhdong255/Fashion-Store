import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { updateOrderFromCallback } from "@/store/redux/order/reducer";
import { clearCartItemsFromApi, clearCart } from "@/store/redux/cart/reducer";

const VNPayCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const responseCode = searchParams.get("responseCode");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId || !responseCode) {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("accessToken");
    axios
      .post(
        `http://localhost:8080/adamstore/v1/orders/vn-pay-callback`,
        {
          responseCode: responseCode,
          orderId: parseInt(orderId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.code === 0) {
          dispatch(updateOrderFromCallback(res.data.result));
          dispatch(clearCartItemsFromApi()); // Xóa giỏ hàng trên server
          dispatch(clearCart()); // Xóa state giỏ hàng trên client ngay lập tức
          navigate("/", {
            state: {
              message: "Thanh toán thành công! Giỏ hàng đã được xóa.",
              severity: "success",
            },
          }); // Truyền thông báo qua state
        } else {
          navigate("/my-orders", {
            state: { error: "Thanh toán không thành công!" },
          });
        }
      })
      .catch((err) => {
        console.error("Lỗi khi xử lý callback:", err);
        navigate("/my-orders", {
          state: { error: "Lỗi khi xử lý thanh toán!" },
        });
      });
  }, [orderId, responseCode, dispatch, navigate]);

  return null; // Trang này chỉ xử lý logic, không hiển thị giao diện
};

export default VNPayCallback;