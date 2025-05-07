import { Outlet } from "react-router-dom";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WallpaperRepresentative from "@/components/WallpaperRepresentative";

const ProductListsLayout = () => {
  return (
    <>
      <Header />
      <WallpaperRepresentative titleHeader="Danh sách sản phẩm" />
      <Outlet />
      <Footer />
    </>
  );
};

export default ProductListsLayout;
