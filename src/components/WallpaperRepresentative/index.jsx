/* eslint-disable react/prop-types */
import { Stack } from "@mui/material";

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

export default WallpaperRepresentative;
