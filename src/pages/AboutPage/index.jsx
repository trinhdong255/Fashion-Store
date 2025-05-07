import { Container, Grid, Stack } from "@mui/material";

import WallpaperRepresentative from "../../components/WallpaperRepresentative";

import styles from "./index.module.css";

const contents = [
  {
    titleAboutUs: "Câu chuyện về chúng tôi",
    firstLineAboutUs:
      "Mọi chuyện bắt đầu vào năm 2025 khi người sáng lập của chúng tôi, Trịnh và Min, vật lộn để tìm quần áo giá cả phải chăng, chất lượng cao và bền vững. Cả 2 chúng tôi nhận ra rằng hầu hết các thương hiệu thời trang đều tập trung vào phong cách hoặc tính bền vững—nhưng hiếm khi cả hai. Đó là lúc ý tưởng về Fashion Store ra đời: một thương hiệu kết hợp các thiết kế hợp thời trang với vật liệu thân thiện với môi trường.",
    secondLineAboutUs:
      "Ngày nay, Fashion Store hợp tác với các nhà sản xuất và hỗ trợ các hoạt động thương mại công bằng để mang đến thời trang bền vững, phong cách cho những người tiêu dùng trên toàn thế giới.",
    thirdLineAboutUs:
      "Bạn có thắc mắc gì không? Hãy cho chúng tôi biết tại địa chỉ cửa hàng Ho Chi Minh City, Viet Nam hoặc gọi cho chúng tôi theo số 125-711-811 | 125-668-886",
  },
  {
    titleMissionUs: "Nhiệm vụ của chúng tôi",
    firstLineMissionUs:
      "Tại Fashion Store, sứ mệnh của chúng tôi rất đơn giản: định nghĩa lại thời trang bằng cách biến tính bền vững thành tiêu chuẩn mới.",

    secondLineMissionUs:
      "Đó là lý do tại sao chúng tôi tạo ra quần áo thân thiện với môi trường, được sản xuất mà không ảnh hưởng đến chất lượng hoặc phong cách.",

    thirdLineMissionUs:
      "Thông qua nguồn cung ứng có trách nhiệm, mức lương công bằng cho người lao động và bao bì không chứa nhựa, chúng tôi hướng đến mục tiêu tạo ra tác động tích cực đến cả con người và môi trường. Cùng nhau, chúng ta có thể xây dựng một tương lai nơi thời trang không chỉ đẹp mà còn tử tế với thế giới.",
  },
];

const About = () => {
  return (
    <>
      <WallpaperRepresentative titleHeader="Về chúng tôi" />

      <Container maxWidth="lg">
        <Grid container sx={{ m: "80px 0" }} alignItems={"center"}>
          <Grid item lg={8}>
            {contents.map((content, index) => (
              <Stack sx={{ marginRight: 8 }} key={index}>
                <h2 style={{ fontSize: "2rem", fontWeight: "500" }}>
                  {content.titleAboutUs}
                </h2>
                <p className={styles.content}>{content.firstLineAboutUs}</p>
                <p className={styles.content}>{content.secondLineAboutUs}</p>
                <p className={styles.content}>{content.thirdLineAboutUs}</p>
              </Stack>
            ))}
          </Grid>

          <Grid item lg={4}>
            <Stack className={styles.contentImg}>
              <img
                src="/src/assets/images/aboutUs/ourStory.jpg"
                alt="Our Story"
              />
            </Stack>
          </Grid>
        </Grid>

        <Grid container sx={{ m: "80px 0" }} alignItems={"center"}>
          <Grid item lg={4}>
            <Stack className={styles.contentImg}>
              <img
                src="/src/assets/images/aboutUs/ourMission.jpg"
                alt="Our Mission"
              />
            </Stack>
          </Grid>

          <Grid item lg={8}>
            {contents.map((content, index) => (
              <Stack sx={{ marginLeft: 8 }} key={index}>
                <h2 style={{ fontSize: "2rem", fontWeight: "500", margin: 0 }}>
                  {content.titleMissionUs}
                </h2>
                <p className={styles.content}>{content.firstLineMissionUs}</p>
                <p className={styles.content}>{content.secondLineMissionUs}</p>
                <p className={styles.content}>{content.thirdLineMissionUs}</p>
              </Stack>
            ))}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default About;
