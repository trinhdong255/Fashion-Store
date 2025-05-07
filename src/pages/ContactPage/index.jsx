import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Button,
  Container,
  createTheme,
  Grid,
  hexToRgb,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";

import WallpaperRepresentative from "../../components/WallpaperRepresentative";
import customTheme from "@/components/CustemTheme";

const contactInfos = [
  {
    title: "Địa chỉ",
    description: "Ho Chi Minh City, VietNam",
    icon: <PlaceIcon />,
  },
  {
    title: "Số điện thoại",
    description: "125-711-811 | 125-668-886",
    icon: <PhoneIcon />,
  },
  {
    title: "Hỗ trợ",
    description: "Support.photography@gmail.com",
    icon: <EmailIcon />,
  },
];

const sendMessages = [
  "Họ và tên",
  "Số điện thoại",
  "Địa chỉ Email",
  "Tin nhắn",
];

const renderHeadTitle = (title) => {
  return <h2 style={{ fontSize: "2rem", fontWeight: "500" }}>{title}</h2>;
};

const Contact = () => {
  const outerTheme = useTheme();

  return (
    <>
      <WallpaperRepresentative titleHeader="Liên hệ" />

      <Container maxWidth="lg">
        <Grid container>
          <Grid item lg={6} md={6}>
            <Stack
              direction="column"
              spacing={2}
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              sx={{ margin: "80px 0" }}
            >
              {renderHeadTitle("GỬI TIN NHẮN CHO CHÚNG TÔI")}
              {sendMessages.map((sendMessage, index) => (
                <Stack
                  key={index}
                  spacing={2}
                  p={"10px 0"}
                  sx={{ width: "90%" }}
                >
                  <label style={{ fontSize: "1.3rem" }} htmlFor={sendMessage}>
                    {sendMessage}
                  </label>
                  <ThemeProvider theme={customTheme(outerTheme)}>
                    <TextField
                      id={sendMessage}
                      label={sendMessage}
                      variant="outlined"
                      multiline={sendMessage === "Tin nhắn"}
                      rows={sendMessage === "Tin nhắn" ? 6 : 1}
                      fullWidth
                    />
                  </ThemeProvider>
                </Stack>
              ))}

              <Button
                variant="contained"
                sx={{
                  width: 200,
                  height: 50,
                  borderRadius: 5,
                  fontSize: "1rem",
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: hexToRgb("#333"),
                  },
                }}
              >
                GỬI TIN NHẮN
              </Button>
            </Stack>
          </Grid>
          <Grid item lg={6} md={6}>
            <Stack
              direction="column"
              spacing={2}
              alignItems={"flex-start"}
              sx={{ margin: "80px 0 0 80px" }}
            >
              {renderHeadTitle("THÔNG TIN LIÊN HỆ")}
              {contactInfos.map((contactInfo, index) => (
                <Stack key={index}>
                  <Stack
                    flexDirection={"row"}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                  >
                    {contactInfo.icon}
                    <h3
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "400",
                        marginLeft: 16,
                      }}
                    >
                      {contactInfo.title}
                    </h3>
                  </Stack>
                  <p
                    style={{
                      color: "var(--text-color)",
                      padding: "14px 0",
                    }}
                  >
                    {contactInfo.description}
                  </p>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Contact;
