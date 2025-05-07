import { Container, Grid, Stack } from "@mui/material";

import styles from "./index.module.css";

const Footer = () => {
  const footerData = [
    {
      title: "Chăm sóc khách hàng",
      links: [
        "Trung tâm trợ giúp",
        "Cửa hàng Blog",
        "Hướng dẫn mua hàng",
        "Hướng dẫn bảo hành",
        "Trả hàng & hoàn tiền",
        "Chăm sóc khách hàng",
        "Chính sách bảo hành",
        "Vận chuyển",
      ],
    },
    {
      title: "Giới thiệu",
      links: [
        "Giới thiệu về chúng tôi",
        "Tuyển dụng",
        "Điều khoản",
        "Chính sách bảo mật",
        "Chính hãng",
        "Kênh người bán",
        "Flash Sales",
        "Chương trình tiếp thị liên kết",
      ],
    },
    {
      title: "Danh mục",
      links: [
        "Áo thun",
        "Áo sơ mi",
        "Áo khoác",
        "Quần dài",
        "Quần shorts",
        "Phụ kiện",
      ],
    },
    {
      title: "Theo dõi",
      links: ["Facebook", "LinkedIn", "Instagram", "X"],
    },
  ];

  return (
    <Stack className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={10}>
          {footerData.map((value, index) => (
            <Grid item xs={6} sm={6} md={3} key={index} sx={{ pb: 12 }}>
              <h3 className={styles.footerTitle}>{value.title}</h3>
              <ul style={{ listStyleType: "none", paddingTop: 32 }}>
                {value.links.map((valueLink, linkIndex) => (
                  <li style={{ paddingBottom: 16 }} key={linkIndex}>
                    <a className={styles.footerLink} href="#">
                      {value.icons && value.icons[linkIndex]} {valueLink}
                    </a>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
      </Container>

      <span
        style={{
          textAlign: "center",
          fontSize: 16,
          color: "white",
          paddingTop: 40,
          paddingBottom: 16,
          borderTop: "1px solid #575655",
        }}>
        Copyright @2025 by Fashion Store. All Rights Reserved.
      </span>
    </Stack>
  );
};

export default Footer;
