import { Button, Skeleton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ProductSizeSelection = ({
  products,
  loading,
  sizes,
  buttonOptionSizes,
  handleSelectSize,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"} sx={{ m: "30px 0" }}>
          <Typography variant="h6">Size: </Typography>
          {buttonOptionSizes.length > 0 ? (
            buttonOptionSizes.map((buttonOptionSize, index) => (
              <Button
                key={index}
                sx={{
                  ml: 2,
                  borderColor: "black",
                  color: sizes === buttonOptionSize ? "white" : "black",
                  backgroundColor: sizes === buttonOptionSize ? "black" : "white",
                }}
                variant="outlined"
                onClick={() => handleSelectSize(buttonOptionSize)}
              >
                {buttonOptionSize}
              </Button>
            ))
          ) : (
            <Typography variant="body2" sx={{ ml: 2, color: "text.secondary" }}>
              Vui lòng chọn màu sắc trước
            </Typography>
          )}
        </Stack>
      ) : null}
    </>
  );
};

ProductSizeSelection.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
  sizes: PropTypes.string,
  buttonOptionSizes: PropTypes.array,
  handleSelectSize: PropTypes.func,
};

export default ProductSizeSelection;