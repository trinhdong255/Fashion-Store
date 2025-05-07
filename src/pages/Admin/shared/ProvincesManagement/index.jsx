import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListProvincesQuery } from "@/services/api/province";

const ProvincesManagement = () => {
  const { data, isLoading, error } = useListProvincesQuery({
    pageNo: 1,
    pageSize: 60, // API trả về tối đa 60 items, nên đặt pageSize = 60
  });

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên tỉnh / thành phố", width: 200 },
  ];

  const rows = data?.items || [];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý tỉnh / thành phố
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          Lỗi khi tải dữ liệu: {error.data?.message || "Không thể kết nối đến server"}
        </Typography>
      )}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={isLoading}
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
        />
      </div>
    </DashboardLayoutWrapper>
  );
};

export default ProvincesManagement;