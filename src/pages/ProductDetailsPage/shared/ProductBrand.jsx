import { Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductBrand = ({ products, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"} sx={{ m: "30px 0" }}>
          <Typography variant="h6">Chi nhánh: </Typography>
          <Typography variant="h5" sx={{ ml: 1 }}>
            {products.brand ? `${products.brand}` : ""}
          </Typography>
        </Stack>
      ) : null}
    </>
  );
};

ProductBrand.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductBrand;
