import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import AccountInform from "./layouts/AccountInform";
import Address from "./pages/AddressPage";
import AddressListForUser from "./pages/AddressPage/shared/AddressListForUser";


import ChangePassword from "./pages/ChangePasswordPage";
import Profile from "./pages/ProfilePage";

import ScrollToTop from "@/components/ScrollToTop";
import LoginLayout from "@/layouts/LoginLayout";
import MainLayout from "@/layouts/MainLayout";
import ProductListsLayout from "@/layouts/ProductListsLayout";
import About from "@/pages/AboutPage";
import Contact from "@/pages/ContactPage";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/HomePage";
import Login from "@/pages/LoginPage";
import MyOrders from "@/pages/MyOrdersPage";
import OrderConfirmation from "@/pages/OrderConfirmationPage";
import ProductDetails from "@/pages/ProductDetailsPage";
import ProductLists from "@/pages/ProductListsPage";
import Register from "@/pages/RegisterPage";
import ShippingMethod from "@/pages/ShippingMethodPage";
import Support from "@/pages/SupportPage";
import VerifyAccount from "@/pages/VerifyAccountPage";
import ResetPassword from "./pages/ResetPasswordPage";
import ForgotPasswordVerify from "./pages/ForgotPassword/shared/ForgotPasswordVerify";
import AdminLayout from "./layouts/AdminLayout";
import Admin from "./pages/Admin";

import ThemeProvider from "./context/ThemeProvider";
import ProductsManagement from "./pages/Admin/shared/ProductsManagement";
import CategoriesManagement from "./pages/Admin/shared/CategoriesManagement";
import OrdersManagement from "./pages/Admin/shared/OrdersManagement";
import UsersManagement from "./pages/Admin/shared/UsersManagement";
import BranchesManagement from "./pages/Admin/shared/BranchesManagement";
import PromotionsManagement from "./pages/Admin/shared/PromotionsManagement";
import PaymentHistoriesManagement from "./pages/Admin/shared/PaymentHistoriesManagement";
import RolesManagement from "./pages/Admin/shared/RolesManagement";
import PermissionsManagement from "./pages/Admin/shared/PermissionsManagement";
import ColorsManagement from "./pages/Admin/shared/ColorsManagement";
import SizesManagement from "./pages/Admin/shared/SizesManagement";
import WardsManagement from "./pages/Admin/shared/WardsManagement";
import DistrictsManagement from "./pages/Admin/shared/DistrictsManagement";
import ProvincesManagement from "./pages/Admin/shared/ProvincesManagement";
import ProductVariantsManagement from "./pages/Admin/shared/ProductVariantsManagement";
import VNPayCallback from "./pages/ShippingMethodPage/shared/VNPayCallback";
import MyCart from "./pages/MyCartPage";
import AddressInform from "./pages/AddressPage/shared/AddressInform";

const App = () => {
  return (
    <ThemeProvider>
      <ScrollToTop />

      <Routes>
        {/* Route dependencies component Header and Footer */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="support" element={<Support />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
        </Route>


        {/* Route Login */}
        <Route path="/login" element={<LoginLayout />}>
          <Route index element={<Login />} />
          <Route path="forgotPassword" element={<ForgotPassword />} />
          <Route
            path="forgotPasswordVerify"
            element={<ForgotPasswordVerify />}
          />
          <Route path="resetPassword" element={<ResetPassword />} />
        </Route>


        {/* Route SignUp and VerifyAccount */}
        <Route path="/register" element={<Register />} />
        <Route path="/verifyAccount" element={<VerifyAccount />} />


        {/* Route List Products */}
        <Route path="/product-lists" element={<ProductListsLayout />}>
          <Route index element={<ProductLists />} />
        </Route>
        <Route path="/product-detail/:id" element={<ProductDetails />} />
        <Route path="/shipping-method" element={<ShippingMethod />} />
        <Route path="/vn-pay-callback" element={<VNPayCallback />} />
        <Route path="/orderConfirmation" element={<OrderConfirmation />} />

        {/* Route cart */}
        <Route path="/my-cart" element={<MyCart />} />


        {/* Route user */}
        <Route path="/accountInform" element={<AccountInform />}>
          <Route path="profile/:id" element={<Profile />} />
          <Route path="changePassword/:id" element={<ChangePassword />} />
          <Route path="address/:id" element={<Address />} />
          <Route path="addressListForUser/:id" element={<AddressListForUser />} />
          <Route path="newAddress/:id" element={<AddressInform /> } />
        </Route>
        <Route path="/my-orders" element={<MyOrders />} />


        {/* Route admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Admin />} />
          <Route path="productsManagement" element={<ProductsManagement />} />
          <Route
            path="productVariantsManagement"
            element={<ProductVariantsManagement />}
          />
          <Route path="colorsManagement" element={<ColorsManagement />} />
          <Route path="sizesManagement" element={<SizesManagement />} />
          <Route path="wardsManagement" element={<WardsManagement />} />
          <Route path="districtsManagement" element={<DistrictsManagement />} />
          <Route path="provincesManagement" element={<ProvincesManagement />} />
          <Route
            path="categoriesManagement"
            element={<CategoriesManagement />}
          />
          <Route path="ordersManagement" element={<OrdersManagement />} />
          <Route path="usersManagement" element={<UsersManagement />} />
          <Route path="branchesManagement" element={<BranchesManagement />} />
          <Route
            path="promotionsManagement"
            element={<PromotionsManagement />}
          />
          <Route path="rolesManagement" element={<RolesManagement />} />
          <Route
            path="permissionsManagement"
            element={<PermissionsManagement />}
          />
          <Route
            path="paymentHistoriesManagement"
            element={<PaymentHistoriesManagement />}
          />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
