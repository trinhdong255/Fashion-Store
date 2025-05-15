/* eslint-disable react/prop-types */
// layouts/DashboardLayout/index.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Switch,
  Menu,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "/src/context/ThemeProvider";
import {
  Chat,
  Height,
  Image,
  Inventory,
  LocalOffer,
  Lock,
  Palette,
  Payment,
  People,
  Place,
  Store,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { resetStore } from "@/store";

const drawerWidth = 240;

const DashboardLayoutWrapper = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleTheme, mode } = useTheme();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(resetStore());
    navigate("/login");
  };

  const navigationItems = [
    { path: "/admin/dashboard", title: "Tổng quan", icon: <DashboardIcon /> },
    {
      path: "/admin/productsManagement",
      title: "Sản phẩm",
      icon: <Inventory />,
    },
    {
      path: "/admin/productVariantsManagement",
      title: "Biến thể sản phẩm",
      icon: <Inventory />,
    },
    {
      path: "/admin/colorsManagement",
      title: "Màu sắc",
      icon: <Palette />,
    },
    {
      path: "/admin/sizesManagement",
      title: "Kích thước",
      icon: <Height />,
    },
    {
      path: "/admin/categoriesManagement",
      title: "Danh mục",
      icon: <CategoryIcon />,
    },
    {
      path: "/admin/usersManagement",
      title: "Người dùng",
      icon: <People />,
    },
    {
      path: "/admin/wardsManagement",
      title: "Phường / xã",
      icon: <Place />,
    },
    {
      path: "/admin/districtsManagement",
      title: "Quận / huyện",
      icon: <Place />,
    },
    {
      path: "/admin/provincesManagement",
      title: "Tỉnh / thành phố",
      icon: <Place />,
    },
    {
      path: "/admin/ordersManagement",
      title: "Đơn hàng",
      icon: <ShoppingCartIcon />,
    },
    {
      path: "/admin/rolesManagement",
      title: "Vai trò",
      icon: <People />,
    },
        {
      path: "/admin/branchesManagement",
      title: "Chi nhánh",
      icon: <Store />,
    },
    // {
    //   path: "/admin/permissionsManagement",
    //   title: "Quyền hạn",
    //   icon: <Lock />,
    // },
    {
      path: "/admin/paymentHistoriesManagement",
      title: "Lịch sử Thanh toán",
      icon: <Payment />,
    },
    // {
    //   path: "/admin/paymentHistoriesManagement",
    //   title: "Đăng xuất",
    //   icon: <Payment />,
    // },

    {
      path: "/admin/promotionsManagement",
      title: "Khuyến mãi",
      icon: <LocalOffer />,
    },
  ];

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {navigationItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            style={{ textDecoration: "none", color: "inherit" }}>
            <ListItem
              sx={{
                "&:hover": {
                  backgroundColor: mode === "dark" ? "#424242" : "#f5f5f5",
                },
                backgroundColor:
                  location.pathname === item.path
                    ? mode === "dark"
                      ? "#616161"
                      : "#e0e0e0"
                    : "transparent",
              }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                sx={{
                  color: mode === "dark" ? "#ffffff" : "black",
                }}
              />
            </ListItem>
          </Link>
        ))}
      </List>
      <Button
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0984e3",
          color: "#fff",
        }}
        onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: mode === "dark" ? "#333333" : undefined,
          color: mode === "dark" ? "#ffffff" : undefined,
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}>
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: mode === "dark" ? "#ffffff" : undefined,
            }}>
            Admin Dashboard
          </Typography>
          <Switch
            checked={mode === "dark"}
            onChange={toggleTheme}
            sx={{
              "& .MuiSwitch-switchBase": {
                color: mode === "dark" ? "#" : undefined,
              },
              "& .MuiSwitch-track": {
                backgroundColor: mode === "dark" ? "#bbbbbb" : undefined,
              },
              "& .MuiSwitch-thumb": {
                color: mode === "dark" ? "#ffffff" : undefined,
              },
            }}
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: mode === "dark" ? "#212121" : undefined,
            },
          }}>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: mode === "dark" ? "#212121" : undefined,
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: mode === "dark" ? "#000000" : undefined,
        }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayoutWrapper;
