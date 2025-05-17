import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import banner from "@/assets/images/backgroundFashions/background-fashion.jpg";
import styles from "./style.module.css";

// Import các component đã cung cấp
import ProductTitle from "./shared/ProductTitle";
import ProductImage from "./shared/ProductImage";
import ProductPrice from "./shared/ProductPrice";
import ProductStockKeepingUnit from "./shared/ProductStockKeepingUnit";
import ProductColorSection from "./shared/ProductColorSection";
import ProductSizeSelection from "./shared/ProductSizeSelection";
import ProductQuantitySelection from "./shared/ProductQuantitySelection";
import ProductActions from "./shared/ProductActions";
import ProductReviews from "./shared/ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedImageUrl = location.state?.imageUrl || null;

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(passedImageUrl);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Hàm lấy thông tin biến thể cụ thể
  const fetchVariant = useCallback(
    async (colorId, sizeId) => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(
          `http://222.255.119.40:8080/adamstore/v1/product-variants/${id}/${colorId}/${sizeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSelectedVariant(res.data.result);
        // Cập nhật imageUrl nếu biến thể có hình ảnh, nếu không giữ nguyên
        setImageUrl(res.data.result.imageUrl || imageUrl);
      } catch (err) {
        console.error("Lỗi khi lấy biến thể cụ thể:", err);
        setSnackbar({
          open: true,
          message: "Lỗi khi lấy thông tin biến thể!",
          severity: "error",
        });
      }
    },
    [id, imageUrl]
  );

  // Lấy thông tin sản phẩm và biến thể khi tải trang
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);

    // Lấy thông tin sản phẩm
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://222.255.119.40:8080/adamstore/v1/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const productData = res.data.result;
        setProduct(productData);
        // Nếu không có passedImageUrl từ location.state, lấy từ API
        if (!imageUrl) {
          // API trả về product.images là một mảng chuỗi, không phải mảng đối tượng
          const fallbackUrl = productData.images?.[0] || "";
          setImageUrl(fallbackUrl);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", err);
        setSnackbar({
          open: true,
          message: "Lỗi khi lấy thông tin sản phẩm!",
          severity: "error",
        });
      }
    };

    // Lấy danh sách biến thể
    const fetchVariants = async () => {
      try {
        const res = await axios.get(
          `http://222.255.119.40:8080/adamstore/v1/products/${id}/product-variants`,
          {
            params: { pageNo: 1, pageSize: 10 },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const items = res.data.result.items;
        const grouped = items.reduce((acc, item) => {
          const colorName = item.color.name.trim();
          if (!acc[colorName]) {
            acc[colorName] = {
              color: item.color,
              productName: item.product.name,
              sizes: [],
            };
          }

          acc[colorName].sizes.push({
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            isAvailable: item.isAvailable,
            productVariantId: item.id,
          });

          return acc;
        }, {});

        const variantList = Object.values(grouped);
        setVariants(variantList);
      } catch (err) {
        console.error("Lỗi khi lấy product variants:", err);
        setSnackbar({
          open: true,
          message: "Lỗi khi lấy biến thể sản phẩm!",
          severity: "error",
        });
      }
    };

    Promise.all([fetchProduct(), fetchVariants()]).finally(() =>
      setLoading(false)
    );
  }, [id, imageUrl]);

  // Khi chọn màu và kích thước, lấy thông tin biến thể cụ thể
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const colorId = variants.find(
        (group) => group.color.name === selectedColor
      )?.color.id;
      const sizeId = variants
        .find((group) => group.color.name === selectedColor)
        ?.sizes.find((s) => s.size.name === selectedSize)?.size.id;

      if (colorId && sizeId) {
        fetchVariant(colorId, sizeId);
      }
    }
  }, [selectedColor, selectedSize, variants, fetchVariant]);

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    setSelectedSize(""); // Reset kích thước khi đổi màu
  };

  const handleSelectSize = (size) => {
    setSelectedSize(size);
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const productData = product
    ? {
        id: product.id,
        title: product.name,
        images: imageUrl, // imageUrl là chuỗi, không phải đối tượng
        price: selectedVariant
          ? selectedVariant.price
          : variants[0]?.sizes[0]?.price || 0,
        minimumOrderQuantity: product.soldQuantity || 0,
        totalReviews: product.totalReviews || 0,
        averageRating: product.averageRating || 0,
        brand: product.brand || "Không xác định",
        sku: product.sku || "N/A",
        tags: product.category?.name || "Không xác định",
        stock: selectedVariant
          ? selectedVariant.quantity
          : variants[0]?.sizes[0]?.quantity || 0,
        description:
          product.description ||
          "Sản phẩm chất lượng cao, phong cách hiện đại, phù hợp với mọi lứa tuổi.",
        productVariantId: selectedVariant?.id,
      }
    : null;
  console.log("productData:", productData);

  const buttonOptionColors = variants.map((group) => group.color.name) || [
    "Trắng",
    "Đen",
  ];
  const buttonOptionSizes =
    variants
      .find((group) => group.color.name === selectedColor)
      ?.sizes.map((s) => s.size.name) || [];

  return (
    <>
      <Header />
      <img
        src={banner}
        alt="banner"
        width="100%"
        height={300}
        className={styles.image}
      />
      <Container
        sx={{
          width: "100%",
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <ProductImage products={productData} loading={loading} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <ProductTitle products={productData} loading={loading} />
          <ProductReviews products={productData} loading={loading} />
          <ProductPrice products={productData} loading={loading} />
          <ProductStockKeepingUnit products={productData} loading={loading} />

          <ProductColorSection
            products={productData}
            loading={loading}
            colors={selectedColor}
            handleSelectColor={handleSelectColor}
            availableColors={buttonOptionColors}
          />

          <ProductSizeSelection
            products={productData}
            loading={loading}
            sizes={selectedSize}
            buttonOptionSizes={buttonOptionSizes}
            handleSelectSize={handleSelectSize}
          />

          <ProductQuantitySelection
            products={productData}
            loading={loading}
            quantity={quantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            selectedVariant={selectedVariant}
          />

          <ProductActions
            products={productData}
            loading={loading}
            selectedQuantity={quantity}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedVariant={selectedVariant}
          />
        </Box>
      </Container>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mô tả sản phẩm
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}
        >
          {productData?.description || "Không có mô tả cho sản phẩm này."}
        </Typography>
      </Container>

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

      <Footer />
    </>
  );
};

export default ProductDetails;
