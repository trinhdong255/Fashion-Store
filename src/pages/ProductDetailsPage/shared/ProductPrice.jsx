import { Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductPrice = ({ products, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"column"} spacing={1} sx={{ mt: 2 }}>
          <Typography variant="h6">Giá: </Typography>
          <Typography variant="h5" sx={{ ml: 1 }}>
            {products.price
              ? `${products.price.toLocaleString('vi-VN')}đ`
              : ""}
          </Typography>

          <Typography variant="body1" sx={{ ml: 2 }}>
            {products.minimumOrderQuantity
              ? `Đã bán: ${products.minimumOrderQuantity}`
              : ""}
          </Typography>
        </Stack>
      ) : null}
    </>
  );
};

ProductPrice.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductPrice;