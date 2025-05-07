import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

import HeaderAuthButtons from "./AuthButton";
import CartButton from "./CartButton";
import styles from "./index.module.css";
import NavMenu from "./NavMenu";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <div className={styles.stickyHeader}>
      <div className={styles.headerTop}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "black",
            fontSize: 30,
            fontWeight: "bold",
            textTransform: "uppercase",
          }}>
          FASHION STORE
        </Link>
        <NavMenu />
        <SearchBar />
        <div className={styles.headerRight}>
          <CartButton />
          <HeaderAuthButtons />
        </div>
      </div>
    </div>
  );
};

export default Header;
Stack;
