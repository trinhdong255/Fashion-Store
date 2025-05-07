import { Container, Grid, Stack } from "@mui/material";
import AddressInform from "./shared/AddressInform";
import AccountSideBar from "@/components/AccountSideBar";
import { useParams } from "react-router-dom";

const Address = () => {
  const { id } = useParams();
  return (
    <Container maxWidth="lg">
      <Stack sx={{ m: "80px 0" }}>
        <Grid container>
          <Grid item xl={3} lg={3}>
            <AccountSideBar id={id} />
          </Grid>

          <Grid item xl={9} lg={9}>
            <h1
              style={{
                fontWeight: "500",
                width: "100%",
                margin: 0,
                textAlign: "center",
              }}>
              ĐỊA CHỈ
            </h1>

            <Stack alignItems={"center"}>
              <AddressInform id={id} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Address;
