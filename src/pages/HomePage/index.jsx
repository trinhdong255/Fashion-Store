import { useEffect, useState } from "react";
import { Alert, Container, Snackbar, Stack, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import styles from "./index.module.css";

const slides = [
  "/src/assets/images/backgroundFashions/backgroundHomePage.jpg",
  "/src/assets/images/backgroundFashions/backgroundHomePage-1.jpg",
  "/src/assets/images/backgroundFashions/backgroundHomePage-2.jpg",
  "/src/assets/images/backgroundFashions/backgroundHomePage-3.jpg",
];

// Ánh xạ ID danh mục sang đường dẫn ảnh tương ứng
const categoryImages = {
  1: "/src/assets/images/categories/Shirt.jpg", // Quần tây
  2: "/src/assets/images/categories/T-shirt.jpg", // Áo thun
  5: "/src/assets/images/categories/Jacket.jpg", // Áo sơ mi
  6: "/src/assets/images/categories/Shorts.jpg",
  7: "/src/assets/images/categories/quantay.webp",
  8: "/src/assets/images/categories/Accessories.jpg",
};

const Home = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Gọi API lấy danh mục khi vào trang
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch(
      "http://222.255.119.40:8080/adamstore/v1/categories?pageNo=1&pageSize=10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token ở đây
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA FETCHED:", data);
        setCategories(data.result.items);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch màu sắc:", err);
      });
  }, []);

  // Hiển thị snackbar khi đăng nhập thành công
  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: location.state.severity || "success",
      });
    }
    window.history.replaceState({}, document.title);
  }, [location]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "right", horizontal: "right" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", p: "10px 20px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: true }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        style={{ width: "100%", height: "400px", color: "#fff" }}>
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img
              style={{ objectFit: "cover", height: "100%", width: "100%" }}
              src={slide}
              alt={`Slide ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Typography
        sx={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "30px",
          fontWeight: "bold",
        }}
        variant="body1">
        Danh mục sản phẩm
      </Typography>
      <Container className={styles.wrapperCategory}>
        {categories.map((item, index) => (
          <div key={index}>
            <Link to={`/listProducts?category=${item.id}`}>
              <Stack className={styles.wrapperImg}>
                <img
                  className={styles.mediaImg}
                  src={categoryImages[item.id] || "/default.jpg"}
                  alt={item.name}
                />
                <Stack className={styles.contentImg}>
                  <h2 style={{ fontSize: 30, fontWeight: 500, color: "white" }}>
                    {item.name.toUpperCase()}
                  </h2>
                </Stack>
              </Stack>
            </Link>
          </div>
        ))}
      </Container>
    </>
  );
};

export default Home;
