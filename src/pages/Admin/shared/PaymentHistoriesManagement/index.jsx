import React, { useState, useEffect } from "react";
import { Typography, Button, TextField, Grid, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

const PaymentHistoriesManagement = () => {
  const [paymentHistories, setPaymentHistories] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchPaymentHistories = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://222.255.119.40:8080/adamstore/v1/payment-histories/search",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            pageNo: page + 1,
            pageSize,
            sortBy: "",
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        }
      );
      const { items, totalItems } = response.data.result;
      setPaymentHistories(
        (items || []).map((item) => ({
          ...item,
          id: item.id, // đảm bảo có id cho DataGrid
        }))
      );
      setRowCount(totalItems || 0);
    } catch (error) {
      console.error("Failed to fetch payment histories:", error);
    }
  };

  useEffect(() => {
    fetchPaymentHistories();
  }, [page, pageSize, startDate, endDate]);

  useEffect(() => {
    console.log("Data from API:", paymentHistories);
  }, [paymentHistories]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    // {
    //   field: "order",
    //   headerName: "Đơn hàng",
    //   width: 150,
    //   valueGetter: (params) => params.row.order?.id || "",
    //   disableColumnMenu: true,
    //   sortable: false,
    // },
    {
      field: "paymentMethod",
      headerName: "Phương thức thanh toán",
      width: 200,
      renderCell: (params) => {
        const value = params.value;
        if (!value) return "";
        if (value === "CASH") return "Tiền mặt";
        if (value === "VNPAY") return "Chuyển khoản";
        return value;
      },
      disableColumnMenu: true,
      sortable: false,
    },

    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      width: 150,
      renderCell: (params) => {
        const value = params.value;
        if (value == null || isNaN(value)) return "";
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(value);
      },
      disableColumnMenu: true,
      sortable: false,
    },

    {
      field: "paymentStatus",
      headerName: "Trạng thái",
      width: 250,
      renderCell: (params) => {
        const statusMap = {
          PAID: "Giao dịch đã thanh toán thành công",
          PENDING: "Giao dịch đang chờ xử lý, chưa xác nhận thành công",
          REFUNDED: "Giao dịch đã được hoàn tiền cho khách hàng",
          CANCELED: "Giao dịch bị hủy trước khi hoàn tất",
          FAILED: "Thanh toán thất bại do lỗi kỹ thuật, từ chối ngân hàng",
        };

        return statusMap[params.value] || params.value || "";
      },
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "paymentTime",
      headerName: "Thời gian thanh toán",
      width: 200,
      renderCell: (params) => {
        console.log("paymentTime raw value:", params.value);
        if (!params.value) return "";
        return dayjs(params.value).format("HH:mm:ss DD/MM/YYYY");
      },
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  return (
    <DashboardLayoutWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}>
        <Typography variant="h5" gutterBottom>
          Quản lý Lịch sử Thanh toán
        </Typography>

        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}>
              <Box>
                <DateTimePicker
                  label="Từ ngày"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(newValue) =>
                    setStartDate(newValue ? newValue.toISOString() : "")
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
              <Box>
                <DateTimePicker
                  label="Đến ngày"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(newValue) =>
                    setEndDate(newValue ? newValue.toISOString() : "")
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={paymentHistories}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
          disableSelectionOnClick
        />
      </div>
    </DashboardLayoutWrapper>
  );
};

export default PaymentHistoriesManagement;
