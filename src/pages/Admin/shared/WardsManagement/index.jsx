import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListDistrictsQuery, useListWardsByDistrictQuery } from "@/services/api/district"; // Import useListWardsByDistrictQuery from district.js
import { useListWardsQuery } from "@/services/api/ward";

const WardsManagement = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Lấy danh sách quận/huyện
  const { data: districtsData, isLoading: districtsLoading, error: districtsError } = useListDistrictsQuery({
    pageNo: 1,
    pageSize: 1000,
    sortBy: "",
  });

  // Lấy danh sách phường/xã (tất cả)
  const {
    data: allWardsData,
    isLoading: allWardsLoading,
    error: allWardsError,
  } = useListWardsQuery(
    {
      pageNo: 1,
      pageSize: 10,
      sortBy: "",
    },
    { skip: !!selectedDistrict }
  );

  // Lấy danh sách phường/xã theo quận/huyện
  const {
    data: wardsByDistrictData,
    isLoading: wardsByDistrictLoading,
    error: wardsByDistrictError,
  } = useListWardsByDistrictQuery(
    {
      districtId: selectedDistrict,
      pageNo: 1,
      pageSize: 10,
      sortBy: "",
    },
    { skip: !selectedDistrict }
  );

  const columns = [
    { field: "code", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên phường / xã", width: 200 },
  ];

  const wardsData = selectedDistrict ? wardsByDistrictData : allWardsData;
  const wardsLoading = selectedDistrict ? wardsByDistrictLoading : allWardsLoading;
  const wardsError = selectedDistrict ? wardsByDistrictError : allWardsError;

  const rows = wardsData?.items || [];
  const districts = districtsData?.items || [];

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý phường / xã
      </Typography>
      <FormControl fullWidth sx={{ mb: 2, maxWidth: 300 }}>
        <InputLabel id="district-select-label">Chọn quận/huyện</InputLabel>
        <Select
          labelId="district-select-label"
          value={selectedDistrict}
          label="Chọn quận/huyện"
          onChange={handleDistrictChange}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {districts.map((district) => (
            <MenuItem key={district.id} value={district.id}>
              {district.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {districtsError && (
        <Typography color="error" gutterBottom>
          Lỗi khi tải danh sách quận/huyện: {districtsError.data?.message || "Không thể kết nối đến server"}
        </Typography>
      )}
      {wardsError && (
        <Typography color="error" gutterBottom>
          Lỗi khi tải danh sách phường/xã: {wardsError.data?.message || "Không thể kết nối đến server"}
        </Typography>
      )}
      {selectedDistrict && wardsData?.totalItems === 0 && !wardsLoading && !wardsError && (
        <Typography color="warning" gutterBottom>
          Không có dữ liệu phường/xã thuộc quận/huyện ID: {selectedDistrict}
        </Typography>
      )}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.code}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={districtsLoading || wardsLoading}
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
        />
      </div>
    </DashboardLayoutWrapper>
  );
};

export default WardsManagement;