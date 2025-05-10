import React, { useState, useEffect } from "react";
import { Typography, Button, TextField, Grid, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";

const PaymentHistoriesManagement = () => {
  const [paymentHistories, setPaymentHistories] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchPaymentHistories = async () => {
    try {
      const response = await axios.get(
        "http://222.255.119.40:8080/adamstore/v1/payment-histories/search",
        {
          params: {
            pageNo: page + 1,
            pageSize,
            sortBy: "",
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        }
      );
      const { content, totalElements } = response.data;
      setPaymentHistories(content || []);
      setRowCount(totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch payment histories:", error);
    }
  };

  useEffect(() => {
    fetchPaymentHistories();
  }, [page, pageSize, startDate, endDate]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "order",
      headerName: "Đơn hàng",
      width: 150,
      valueGetter: (params) => params.row.order?.id || "",
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "paymentMethod",
      headerName: "Phương thức thanh toán",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "totalAmount",
      headerName: "Tổng tiền",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "paymentStatus",
      headerName: "Trạng thái",
      width: 150,
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
