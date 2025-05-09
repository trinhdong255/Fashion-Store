import { Typography, Stack, Rating } from "@mui/material";
import { useEffect, useState } from "react";

const ProductReviews = ({ products, loading }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [soldQuantity, setSoldQuantity] = useState(0);

  useEffect(() => {
    if (products && !loading) {
      // Lấy điểm đánh giá trung bình từ productData (mặc định 0 vì API không cung cấp)
      setAverageRating(products.averageRating || 0);

      // Lấy tổng số đánh giá từ API (totalReviews: 0)
      setTotalReviews(products.totalReviews || 0);

      // Lấy số lượng đã bán từ API (soldQuantity: 0)
      setSoldQuantity(products.minimumOrderQuantity || 0);
    }
  }, [products, loading]);

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
      {/* Điểm đánh giá trung bình với biểu tượng sao */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="body1" color="text.primary">
          {averageRating.toFixed(1)}
        </Typography>
        <Rating
          value={averageRating}
          precision={0.1}
          readOnly
          size="small"
          sx={{ color: "black" }}
        />
      </Stack>

      {/* Tổng số đánh giá */}
      <Typography variant="body2" color="text.secondary">
        {totalReviews.toLocaleString()} Đánh Giá
      </Typography>

      {/* Số lượng đã bán */}
      <Typography variant="body2" color="text.secondary">
        {soldQuantity.toLocaleString()} Sold
      </Typography>
    </Stack>
  );
};

export default ProductReviews;