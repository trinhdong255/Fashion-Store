import ContactsIcon from "@mui/icons-material/Contacts";
import HelpIcon from "@mui/icons-material/Help";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const NavMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] = useState(null);
  const [categories, setCategories] = useState([]);
  const openCategoryMenu = Boolean(categoryMenuAnchorEl);

  const handleCategoryMenuOpen = (event) => {
    setCategoryMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setCategoryMenuAnchorEl(null);
  }; //http://222.255.119.40:8080/adamstore/v1/categories?pageNo=1&pageSize=10",

  // Gọi API khi component được mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch(
      "http://222.255.119.40:8080/adamstore/v1/categories?pageNo=1&pageSize=10",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token ở đây
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA FETCHED:", data);
        setCategories(data.result.items);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch màu sắc:", err);
      });
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button component={Link} to="/" sx={buttonStyle}>
        Trang chủ
      </Button>
      <Button onClick={handleCategoryMenuOpen} sx={buttonStyle}>
        Danh mục
      </Button>
      <Button component={Link} to="/support" sx={buttonStyle}>
        Hỗ trợ
      </Button>
      <Button component={Link} to="/contact" sx={buttonStyle}>
        Liên hệ
      </Button>
      <Button component={Link} to="/about" sx={buttonStyle}>
        Về chúng tôi
      </Button>

      <Menu
        anchorEl={categoryMenuAnchorEl}
        open={openCategoryMenu}
        onClose={handleMenuClose}>
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            onClick={handleMenuClose}
            component={Link}
            to={`/product-lists?category=${category.id}`}
            sx={{
              px: 3,
              py: 1.5,
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#333",
                fontWeight: "bold",
                color: "#fff",
              },
            }}>
            {category.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const buttonStyle = {
  color: "inherit",
  "&:hover": {
    backgroundColor: "#333",
    color: "#fff",
  },
};

export default NavMenu;
