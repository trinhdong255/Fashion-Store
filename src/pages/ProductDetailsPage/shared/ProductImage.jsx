import { Skeleton, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductImage = ({ products, loading }) => {
  // Xác định URL hình ảnh dựa trên cấu trúc của products.images
  const imageSrc = products?.images
    ? typeof products.images === "string"
      ? products.images // Nếu là chuỗi, sử dụng trực tiếp
      : products.images.imageUrl // Nếu là đối tượng, lấy imageUrl
    : null;

  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={400} />
      ) : products && imageSrc ? (
        <img src={imageSrc} alt={products.title} width="80%" />
      ) : (
        <Typography>Không có hình ảnh</Typography>
      )}
    </>
  );
};

ProductImage.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductImage;
