import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Container,
  createTheme,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

import WallpaperRepresentative from "../../components/WallpaperRepresentative";
import  "./index.css";

const Support = () => {
  const outerTheme = useTheme();

  return (
    <>
      <WallpaperRepresentative
        titleHeader="Chúng tôi có thể giúp gì cho bạn ?"
        searchSupport={
          <ThemeProvider theme={customTheme(outerTheme)}>
            <TextField
              id="outlined-basic"
              label="Tìm kiếm sự hỗ trợ"
              variant="standard"
              sx={{
                width: "660px",
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <SearchIcon sx={{ color: "white" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </ThemeProvider>
        }
      />

      <Container maxWidth="lg">
        <Stack>
          <h1 style={{ margin: "40px 0" }}>Câu hỏi thường gặp ?</h1>

          <Box sx={{ m: "0 0 40px 0" }}>
            <SimpleTreeView>
              <TreeItem
                itemId="refund-policy"
                label="Chính sách hoàn trả của bạn là gì?"
              >
                <TreeItem
                  itemId="refund-policy-community"
                  label="Nếu bạn không hài lòng với giao dịch mua hàng của mình, chúng tôi chấp nhận trả lại trong vòng 30 ngày kể từ ngày giao hàng. Để bắt đầu trả lại, vui lòng gửi email chúng tôi tại trinhdong255@gmail.com với số đơn đặt hàng của bạn và giải thích ngắn gọn lý do tại sao bạn trả lại hàng."
                  disabled
                />
              </TreeItem>
              <TreeItem
                itemId="order-tracking"
                label="Làm cách nào để theo dõi đơn hàng của tôi?"
              >
                <TreeItem
                  itemId="order-tracking-community"
                  label="Bạn có thể theo dõi đơn hàng của mình bằng cách nhấp vào liên kết theo dõi trong email xác nhận vận chuyển hoặc bằng cách đăng nhập vào tài khoản của bạn trên trang web của chúng tôi và xem chi tiết đơn hàng."
                  disabled
                />
              </TreeItem>
              <TreeItem
                itemId="cancel-order"
                label="Tôi có thể thay đổi hoặc hủy đơn hàng của mình không?"
              >
                <TreeItem
                  itemId="cancel-order-community"
                  label="Thật không may, một khi đơn hàng đã được đặt, chúng tôi không thể thực hiện thay đổi hoặc hủy bỏ. Nếu bạn không còn muốn các mục bạn đã đặt hàng, bạn có thể trả lại hàng để được hoàn tiền trong vòng 30 ngày của việc giao hàng."
                  disabled
                />
              </TreeItem>
              <TreeItem
                itemId="product-delivery"
                label="Bạn có cung cấp vận chuyển quốc tế?"
              >
                <TreeItem
                  itemId="product-delivery-community"
                  label="Hiện tại, chúng tôi chỉ cung cấp dịch vụ vận chuyển trong phạm vi Việt Nam."
                  disabled
                />
              </TreeItem>
              <TreeItem
                itemId="payment"
                label="Những phương thức thanh toán nào bạn chấp nhận?"
              >
                <TreeItem
                  itemId="payment-community"
                  label="Chúng tôi chấp nhận visa, mastercard, phương thức thanh toán paypal, chúng tôi cũng có hệ thống giao hàng thu tiền."
                  disabled
                />
              </TreeItem>
            </SimpleTreeView>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "--TextField-brandBorderColor": "white",
            "--TextField-brandBorderHoverColor": "white",
            "--TextField-brandBorderFocusedColor": "white",
            "& label": {
              color: "white",
            },
            "& label.Mui-focused": {
              color: "var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            fontSize: "1.2rem",
            color: "white",
            "&::before": {
              borderBottom: "2px solid var(--TextField-brandBorderColor)",
            },
            "&:hover:not(.Mui-disabled, .Mui-error):before": {
              borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
            },
            "&.Mui-focused:after": {
              borderBottom:
                "2px solid var(--TextField-brandBorderFocusedColor)",
            },
          },
        },
      },
    },
  });

export default Support;
