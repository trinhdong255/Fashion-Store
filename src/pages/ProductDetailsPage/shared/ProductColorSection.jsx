import { Button, Skeleton, Stack } from "@mui/material";
import PropTypes from "prop-types";

const ProductColorSection = ({
  products,
  loading,
  colors,
  handleSelectColor,
  availableColors,
}) => {
  return (
    <>
      {loading ? (
        <Skeleton variant="rectangular" width={"100%"} height={30} />
      ) : products ? (
        <Stack direction={"row"} alignItems={"center"} sx={{ m: "30px 0" }}>
          {availableColors.map((color, index) => (
            <Button
              key={index}
              sx={{
                borderColor: "black",
                color: colors === color ? "white" : "black",
                backgroundColor: colors === color ? "black" : "white",
                ml: index > 0 ? 2 : 0,
              }}
              variant="outlined"
              onClick={() => handleSelectColor(color)}
            >
              {color}
            </Button>
          ))}
        </Stack>
      ) : null}
    </>
  );
};

ProductColorSection.propTypes = {
  products: PropTypes.object,
  loading: PropTypes.bool,
  colors: PropTypes.string,
  handleSelectColor: PropTypes.func,
  availableColors: PropTypes.array,
};

export default ProductColorSection;