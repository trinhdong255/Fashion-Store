import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListSizesQuery } from "@/services/api/size";

const SizesManagement = () => {
  const { data, isLoading, error } = useListSizesQuery({ pageNo: 1, pageSize: 10 });

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên kích thước", width: 150 },
  ];

  const rows = data?.items || [];

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý kích thước
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
          rowsPerPageOptions={[5]}
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

export default SizesManagement;