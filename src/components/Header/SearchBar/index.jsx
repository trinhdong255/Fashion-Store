// SearchBar.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash"; // Cần cài đặt lodash: npm install lodash
import customTheme from "@/components/CustemTheme";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
  useTheme,
} from "@mui/material";

const SearchBar = () => {
  const outerTheme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const debouncedSearch = debounce(() => {
    if (searchTerm.trim()) {
      navigate(`/listProducts?search=${encodeURIComponent(searchTerm)}`);
    }
  }, 300);

  const handleSearch = () => {
    debouncedSearch();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <TextField
        id="outlined-basic"
        label="Tìm kiếm sản phẩm..."
        size="small"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        sx={{
          width: 250,
          "& .MuiOutlinedInput-root": {
            borderRadius: 100,
          },
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </ThemeProvider>
  );
};

export default SearchBar;
