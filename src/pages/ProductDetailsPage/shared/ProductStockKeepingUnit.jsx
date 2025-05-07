import { Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductStockKeepingUnit = ({ products, loading }) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"}>
          <Typography variant="h6">Loại: </Typography>
          <Typography variant="h5" sx={{ ml: 1 }}>
            {products.tags ? `${products.tags}` : ""}
          </Typography>
        </Stack>
      ) : null}
    </>
  );
};

ProductStockKeepingUnit.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
};

export default ProductStockKeepingUnit;
