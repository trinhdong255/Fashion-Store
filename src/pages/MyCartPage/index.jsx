import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Container, Stack, Typography } from "@mui/material";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MyCart from "./shared/MyCart";

const CheckMyCart = () => {
  return (
    <>
      <Header />

      <Container maxWidth="lg">
        <Stack alignItems="center" sx={{ my: 5 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <LocalShippingIcon fontSize="large" sx={{ color: "black" }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "text.primary" }}>
              GIỎ HÀNG CỦA BẠN
            </Typography>
          </Stack>

          <MyCart />
        </Stack>
      </Container>

      <Footer />
    </>
  );
};

export default CheckMyCart;
