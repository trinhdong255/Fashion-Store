import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./index.module.css";

import "swiper/css";
import "swiper/css/navigation";
import { useListProductsQuery } from "@/services/api/product";

// const navCategories = [
//   {
//     title: "SẢN PHẨM BÁN CHẠY",
//     description: [
//       "ÁO THUN",
//       "ÁO SƠ MI",
//       "ÁO KHOÁC",
//       "QUẦN DÀI",
//       "QUẦN SHORTS",
//       "PHỤ KIỆN",
//     ],
//     showButton: true,
//   },
//   {
//     title: "SẢN PHẨM MỚI NHẤT",
//     description: [
//       "ÁO THUN",
//       "ÁO SƠ MI",
//       "ÁO KHOÁC",
//       "QUẦN DÀI",
//       "QUẦN SHORTS",
//       "PHỤ KIỆN",
//     ],
//     showButton: true,
//   },
// ];

const SwiperProducts = () => {
  const navigate = useNavigate();

  const { data: dataProducts } = useListProductsQuery();

  const handleClick = () => {
    navigate("/listProducts");
  };

  useEffect(() => {
    const controller = new AbortController();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {/* {navCategories.map((category, index) => (
        <div key={index}>
          <Stack className={styles.topSellingProducts}>
            <h3>{category.title}</h3>
            <nav className={styles.navigationTopSellingProducts}>
              <ul>
                {category.description.map((item, index) => (
                  <li key={index}>
                    <Link to="#">{item}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Stack>

          <Swiper
            loop={true}
            slidesPerView={3}
            slidesPerGroup={1}
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            style={{
              margin: "50px 0",
            }}>
            {(dataProducts?.products || []).map((product) => (
              <SwiperSlide key={product.id}>
                <Card onClick={() => navigate(`/productDetails/${product.id}`)}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.thumbnail}
                      alt={product.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.title}
                      </Typography>
                      <Typography gutterBottom variant="body2" component="div">
                        Rating: {product.rating}
                      </Typography>
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
                            color: "text.secondary",
                            textDecoration: "line-through",
                            fontSize: "1rem",
                          }}>
                          ${product.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            fontSize: "1.2rem",
                            marginLeft: "10px",
                          }}>
                          ${product.price}
                        </Typography>
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))} */}
    </>
  );
};

export default SwiperProducts;
