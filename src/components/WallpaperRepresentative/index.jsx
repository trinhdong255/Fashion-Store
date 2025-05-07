import { Stack } from "@mui/material";
import PropTypes from "prop-types";

const WallpaperRepresentative = ({ titleHeader, searchSupport }) => {
  return (
    <Stack position={"relative"}>
      <img
        style={{ width: "100%", height: "100%" }}
        src="/src/assets/images/backgroundFashions/background-fashion.jpg"
        alt="Background Fashion"
      />
      <Stack
        position={"absolute"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100%",
          height: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            color: "white",
            margin: 0,
          }}
        >
          {titleHeader}
        </h1>

        {searchSupport}
      </Stack>
    </Stack>
  );
};

// Checking datatype is correct or not
WallpaperRepresentative.propTypes = {
  titleHeader: PropTypes.string.isRequired,
  searchSupport: PropTypes.element,
};

export default WallpaperRepresentative;
