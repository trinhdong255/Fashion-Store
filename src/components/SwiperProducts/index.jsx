import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";

import styles from "./index.module.css";

import "swiper/css";
import "swiper/css/navigation";

const navCategories = [
  {
    title: "SẢN PHẨM BÁN CHẠY",
    showButton: true,
  },
  {
    title: "SẢN PHẨM MỚI NHẤT",
    showButton: true,
  },
];

const SwiperProducts = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and products
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // Fetch categories
    const fetchCategories = axios.get(
      "http://localhost:8080/adamstore/v1/categories?pageNo=1&pageSize=10",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Fetch all products across all pages
    const fetchAllProducts = async () => {
      let pageNo = 1;
      let allProducts = [];
      let hasMore = true;

      while (hasMore) {
        try {
          const response = await axios.get(
            `http://localhost:8080/adamstore/v1/products?pageNo=${pageNo}&pageSize=10`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const items = response.data.result.items || [];
          allProducts = [...allProducts, ...items];

          // Kiểm tra nếu không còn dữ liệu (items rỗng) thì dừng
          if (items.length === 0) {
            hasMore = false;
          } else {
            pageNo += 1;
          }
        } catch (err) {
          console.error("Lỗi khi fetch sản phẩm ở trang", pageNo, ":", err);
          setError(err.message || "Không thể tải sản phẩm");
          hasMore = false;
        }
      }

      return allProducts;
    };

    // Thực thi cả hai fetch
    Promise.all([fetchCategories, fetchAllProducts()])
      .then(([categoriesResponse, allProducts]) => {
        setCategories(categoriesResponse.data.result.items);
        setProducts(allProducts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch dữ liệu:", err);
        setError(err.message || "Không thể tải dữ liệu");
        setIsLoading(false);
      });
  }, []);

  const handleClick = () => {
    navigate("/product-lists");
  };

  return (
    <>
      {navCategories.map((category, index) => (
        <div key={index}>
          <Stack className={styles.topSellingProducts}>
            <h3>{category.title}</h3>
            <nav className={styles.navigationTopSellingProducts}>
              {isLoading ? (
                <p>Đang tải danh mục...</p>
              ) : error ? (
                <p>Lỗi khi tải danh mục: {error}</p>
              ) : (
                <ul>
                  {categories
                    .filter((item) => item.status === "ACTIVE")
                    .map((item) => (
                      <li key={item.id}>
                        <Link to={`/product-lists?category=${item.id}`}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </nav>
          </Stack>

          <Swiper
            loop={true}
            slidesPerView={4}
            slidesPerGroup={2}
            spaceBetween={20}
            centeredSlides={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            style={{
              "--swiper-navigation-color": "var(--text-color)",
              minHeight: 500,
              marginBottom: "20px",
            }}>
            {isLoading ? (
              <SwiperSlide>
                <Typography>Đang tải sản phẩm...</Typography>
              </SwiperSlide>
            ) : error ? (
              <SwiperSlide>
                <Typography>Lỗi khi tải sản phẩm: {error}</Typography>
              </SwiperSlide>
            ) : (
              products.map((product) => (
                <SwiperSlide key={product.id}>
                  <Card
                    onClick={() =>
                      navigate(`/product-detail/${product.id}`, {
                        state: { imageUrl: product.images?.[0]?.imageUrl },
                      })
                    }>
                    <CardActionArea sx={{ minHeight: "100%" }}>
                      <CardMedia
                        component="img"
                        height="300"
                        width="100%"
                        image={product.images?.[0]?.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        sx={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      <CardContent sx={{ minHeight: "100%" }}>
                        <Typography
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                          gutterBottom
                          variant="h6"
                          component="div">
                          {product.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}>
                          <Typography
                            gutterBottom
                            variant="body2"
                            component="div">
                            Đánh giá: {product.averageRating || 0}
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="body2"
                            component="div">
                            Đã bán: {product.soldQuantity || 0}
                          </Typography>
                        </Box>

                        <Typography
                          gutterBottom
                          variant="body1"
                          component="div"
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.primary",
                              fontSize: "1.2rem",
                            }}>
                            {product.price?.toLocaleString("vi-VN")} VNĐ
                          </Typography>
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </SwiperSlide>
              ))
            )}
          </Swiper>

          {category.showButton && (
            <Stack alignItems={"center"}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "var(--footer-background-color)",
                  fontSize: "1rem",
                  marginBottom: "100px",
                  padding: "12px 24px",
                }}
                onClick={handleClick}>
                XEM THÊM
              </Button>
            </Stack>
          )}
        </div>
      ))}
    </>
  );
};

export default SwiperProducts;
