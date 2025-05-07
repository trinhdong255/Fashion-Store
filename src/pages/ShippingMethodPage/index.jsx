import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Container, Stack, Typography } from "@mui/material";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Order from "@/pages/ShippingMethodPage/shared/Order";

const ShippingMethod = () => {
  return (
    <>
      <Header />

      <Container maxWidth="lg">
        <Stack alignItems={"center"} sx={{ m: "80px 0" }}>
          <Stack direction={"row"} alignItems={"center"}>
            <LocalShippingIcon fontSize="large" />
            <Typography variant="h5" sx={{ ml: 2 }}>
              CHỌN HÌNH THỨC GIAO HÀNG
            </Typography>
          </Stack>

          <Order />
        </Stack>
      </Container>

      <Footer />
    </>
  );
};

export default ShippingMethod;
