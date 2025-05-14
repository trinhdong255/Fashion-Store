import { Skeleton } from "@mui/material";
import PropTypes from "prop-types";

const ProductImage = ({ products, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={400} />
      ) : products ? (
        <img src={products.images?.imageUrl} alt={products.title} width="80%" />
      ) : null}
    </>
  );
};

ProductImage.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductImage;
