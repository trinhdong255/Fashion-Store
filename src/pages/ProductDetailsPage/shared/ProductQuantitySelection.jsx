import { Button, Skeleton, Stack, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductQuantitySelection = ({
  products,
  loading,
  quantity,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  selectedVariant,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"} sx={{ m: "30px 0" }}>
          <Typography variant="h6">Số lượng: </Typography>
          <Button
            variant="outlined"
            sx={{ ml: 2, borderColor: "black", color: "black" }}
            onClick={handleDecreaseQuantity}
          >
            -
          </Button>
          <TextField
            value={quantity}
            sx={{
              width: "60px",
              mx: 1,
              "& .MuiInputBase-input": { textAlign: "center" },
            }}
            InputProps={{ readOnly: true }}
          />
          <Button
            variant="outlined"
            sx={{ borderColor: "black", color: "black" }}
            onClick={handleIncreaseQuantity}
          >
            +
          </Button>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {selectedVariant?.quantity !== undefined
              ? `Còn lại: ${selectedVariant.quantity}`
              : "Vui lòng chọn màu sắc và kích thước"}
          </Typography>
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
  selectedVariant: PropTypes.object,
};

export default ProductQuantitySelection;