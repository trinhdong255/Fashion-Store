/* eslint-disable import/order */
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { Typography } from "@mui/material";

const Admin = () => {
  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Tổng quan
      </Typography>
    </DashboardLayoutWrapper>
  );
};

export default Admin;
