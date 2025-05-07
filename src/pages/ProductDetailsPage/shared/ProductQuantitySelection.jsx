import { alpha, Button, Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductQuantitySelection = ({
  products,
  loading,
  quantity,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"} sx={{ m: "30px 0" }}>
          <Typography variant="h6">Số lượng:</Typography>
          <Stack direction={"row"} sx={{ ml: 2 }}>
            <Button
              variant="outlined"
              onClick={handleDecreaseQuantity}
              sx={{
                borderColor: "black",
                color: "black",
                "&:hover": {
                  backgroundColor: alpha("#d9d9d9", 0.5),
                },
              }}
            >
              -
            </Button>
            <Typography
              variant="h6"
              sx={{
                minWidth: "40px",
                textAlign: "center",
              }}
            >
              {quantity}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleIncreaseQuantity}
              sx={{
                borderColor: "black",
                color: "black",
                "&:hover": {
                  backgroundColor: alpha("#d9d9d9", 0.5),
                },
              }}
            >
              +
            </Button>
          </Stack>
        </Stack>
      ) : null}
    </>
  );
};

ProductQuantitySelection.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
  quantity: PropTypes.number,
  handleIncreaseQuantity: PropTypes.func,
  handleDecreaseQuantity: PropTypes.func,
};

export default ProductQuantitySelection;
