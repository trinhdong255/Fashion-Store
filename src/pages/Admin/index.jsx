import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, BarChart } from "@mui/x-charts";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

const Admin = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const revenueRes = await axios.get(
          "http://localhost:3000/orders/revenue?months=6"
        );
        setRevenueData(revenueRes.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    const fetchOrderStatus = async () => {
      try {
        const statusRes = await axios.get(
          "http://localhost:3000/orders/count-by-status"
        );
        setOrderStatusData(statusRes.data);
      } catch (error) {
        console.error("Error fetching order status data:", error);
      }
    };

    fetchRevenue();
    fetchOrderStatus();
  }, []);

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Tổng quan
      </Typography>

      {/* Biểu đồ doanh thu và thống kê đơn hàng */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <LineChart
                xAxis={[
                  {
                    data: revenueData.map((data) => data.month),
                    label: "Tháng",
                  },
                ]}
                series={[
                  {
                    data: revenueData.map((data) => data.revenue),
                    label: "Doanh thu (VND)",
                    color: "#4bc0c0",
                    area: true,
                  },
                ]}
                height={300}
                margin={{ top: 50, bottom: 50, left: 60, right: 20 }}
                title="Doanh thu 6 tháng gần nhất"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: ["Chờ xử lý", "Hoàn thành", "Đã hủy"],
                    label: "Trạng thái",
                  },
                ]}
                series={[
                  {
                    data: [
                      orderStatusData.PENDING || 0,
                      orderStatusData.COMPLETED || 0,
                      orderStatusData.CANCELLED || 0,
                    ],
                    label: "Số lượng đơn hàng",
                    color: "#4bc0c0",
                  },
                ]}
                height={300}
                margin={{ top: 50, bottom: 50, left: 60, right: 20 }}
                title="Thống kê đơn hàng theo trạng thái"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayoutWrapper>
  );
};

export default Admin;