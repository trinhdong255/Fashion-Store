import { Box, Container, Grid, Stack } from "@mui/material";

import ProfileInform from "./shared/ProfileInform";

import AccountSideBar from "@/components/AccountSideBar";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
      }}>
      <Box sx={{ flex: 3 }}>
        <AccountSideBar id={id} />
      </Box>
      <Box sx={{ m: "40px 0", flex: 7 }}>
        <h2
          style={{
            fontWeight: "500",
            width: "100%",
            margin: 0,
            textAlign: "center",
          }}>
          HỒ SƠ CÁ NHÂN
        </h2>

        <Stack alignItems={"center"}>
          <ProfileInform />
        </Stack>
      </Box>
    </Container>
  );
};

export default Profile;
