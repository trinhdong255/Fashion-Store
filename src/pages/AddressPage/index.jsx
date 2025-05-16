import { Container, Grid, Stack } from "@mui/material";
import AddressListForUser from "./shared/AddressListForUser";
import AccountSideBar from "@/components/AccountSideBar";
import { useParams } from "react-router-dom";

const Address = () => {
  const { id } = useParams();
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
      }}
    >
      <Grid container spacing={2} sx={{ m: "80px 0" }}>
        <Grid item lg={3} md={3}>
          <AccountSideBar id={id} />
        </Grid>
        <Grid item lg={9} md={9}>
          <h2
            style={{
              fontWeight: "500",
              width: "100%",
              margin: "0 0 20px 0",
              textAlign: "center",
            }}
          >
            ĐỊA CHỈ
          </h2>
          <Stack alignItems="center">
            <AddressListForUser id={id} />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Address;