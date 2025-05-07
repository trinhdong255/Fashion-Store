/* eslint-disable react/prop-types */
import { Link, useLocation, useParams } from "react-router-dom";

const AccountSideBar = ({ id }) => {
  const location = useLocation();
  const menuItems = [
    { path: `/accountInform/address/${id}`, label: "Địa chỉ" },
    { path: `/accountInform/profile/${id}`, label: "Hồ sơ cá nhân" },
  ];

  return (
    <div>
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            textDecoration: "none",
            color:
              location.pathname === item.path ? "black" : "var(--text-color)",
            fontWeight: location.pathname === item.path ? "bold" : "normal",
            fontSize: location.pathname === item.path ? "16px" : "14px",
            lineHeight: location.pathname === item.path ? "24px" : "20px",
            padding: "8px 0 8px 30px",
            display: "block",
          }}>
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default AccountSideBar;
