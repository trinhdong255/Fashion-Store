/* eslint-disable import/order */
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { Box, Typography, CircularProgress, Button, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";

const Admin = () => {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = useState(dayjs());

  const fetchData = async (start, end) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken"); // hoặc lấy từ context

    try {
      const formattedStart = start.format("YYYY-MM-DD");
      const formattedEnd = end.format("YYYY-MM-DD");

      const [dailyRes, monthlyRes] = await Promise.all([
        axios.get(
          `http://222.255.119.40:8080/adamstore/v1/revenues/daily-orders?startDate=${formattedStart}&endDate=${formattedEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        axios.get(
          `http://222.255.119.40:8080/adamstore/v1/revenues/monthly?startDate=${formattedStart}&endDate=${formattedEnd}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      setDailyData(dailyRes.data.result || []);
      setMonthlyData(monthlyRes.data.result || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi load trang và khi startDate hoặc endDate thay đổi
  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  return (
    <DashboardLayoutWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography variant="h5" gutterBottom>
          Tổng quan
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}>
            <Grid item>
              <DatePicker
                label="Từ ngày"
                value={startDate}
                onChange={(newValue) => newValue && setStartDate(newValue)}
              />
            </Grid>
            <Grid item>
              <DatePicker
                label="Đến ngày"
                value={endDate}
                onChange={(newValue) => newValue && setEndDate(newValue)}
              />
            </Grid>
          </Box>
        </LocalizationProvider>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "start",
            gap: 4,
            marginTop: 4,
          }}>
          <Box>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Doanh thu theo ngày
            </Typography>
            <ResponsiveContainer width={600} height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Doanh thu theo tháng
            </Typography>
            <ResponsiveContainer width={600} height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
    </DashboardLayoutWrapper>
  );
};

export default Admin;
