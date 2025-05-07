import { Skeleton, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductTitle = ({ products, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Typography variant="h5">{products.title}</Typography>
      ) : null}
    </>
  );
};

ProductTitle.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductTitle;
