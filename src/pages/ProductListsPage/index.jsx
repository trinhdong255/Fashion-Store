import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const ProductLists = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category");
  const [products, setProducts] = useState([]);
  const searchTerm = searchParams.get("search") || "";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;

    const token = localStorage.getItem("accessToken");
    axios
      .get(
        `http://localhost:8080/adamstore/v1/categories/${categoryId}/products`,
        {
          params: { pageNo: 1, pageSize: 10 },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setProducts(res.data.result.items);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
      });
  }, [categoryId]);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:8080/adamstore/v1/products/search",
          {
            params: {
              pageNo: 1,
              pageSize: 100,
              search: `name~${searchTerm}`,
            },
          }
        );
        console.log(">>> response tim kiem", response);
        setProducts(response.data.result.items);
      } catch (error) {
        console.error("Lỗi khi gọi API search:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", minHeight: "80vh" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color="#333"
        gutterBottom
        sx={{ paddingTop: 4 }}>
        {searchTerm
          ? `Kết quả tìm kiếm cho: "${searchTerm}"`
          : " DANH SÁCH SẢN PHẨM"}
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
        gap={3}
        justifyContent="center"
        padding={2}
        sx={{ alignItems: "center" }}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product-detail/${product.id}`}
            state={{ imageUrl: product.images?.[0] }}
            style={{ textDecoration: "none", color: "inherit" }}>
            <Card
              sx={{
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.03)" },
                maxWidth: "100%",
              }}>
              {product.images?.[0]?.imageUrl && (
                <CardMedia
                  component="img"
                  height="300"
                  image={product.images[0]?.imageUrl}
                  alt={product.name}
                  sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
                />
              )}
              <CardContent sx={{ padding: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="#1a1a1a"
                  gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                  <Chip
                    label={`Đã bán: ${product.soldQuantity || 0}`}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={`Đánh giá: ${product.totalReviews || 0}`}
                    color="secondary"
                    size="small"
                  />
                  <Chip
                    label={`Còn: ${product.quantity || 0}`}
                    color="success"
                    size="small"
                  />
                </Box>
                <Typography variant="h6" color="#d32f2f" fontWeight="medium">
                  Giá: {product.price?.toLocaleString() || "Đang cập nhật"}đ
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default ProductLists;
