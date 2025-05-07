import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { useListProvincesQuery } from "@/services/api/province";
import { useListDistrictsByProvinceQuery, useListDistrictsQuery } from "@/services/api/district";

const DistrictsManagement = () => {
  const [selectedProvince, setSelectedProvince] = useState("");

  // Lấy danh sách tỉnh/thành phố
  const { data: provincesData, isLoading: provincesLoading, error: provincesError } = useListProvincesQuery({
    pageNo: 1,
    pageSize: 60,
  });

  // Lấy danh sách quận/huyện (tất cả)
  const {
    data: allDistrictsData,
    isLoading: allDistrictsLoading,
    error: allDistrictsError,
  } = useListDistrictsQuery(
    {
      pageNo: 1,
      pageSize: 10,
      sortBy: "",
    },
    { skip: !!selectedProvince } // Chỉ chạy khi không có tỉnh/thành phố được chọn
  );

  // Lấy danh sách quận/huyện theo tỉnh/thành phố
  const {
    data: districtsByProvinceData,
    isLoading: districtsByProvinceLoading,
    error: districtsByProvinceError,
  } = useListDistrictsByProvinceQuery(
    {
      provinceId: selectedProvince,
      pageNo: 1,
      pageSize: 10,
      sortBy: "",
    },
    { skip: !selectedProvince } // Chỉ chạy khi có tỉnh/thành phố được chọn
  );

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Tên quận / huyện", width: 200 },
  ];

  // Dữ liệu hiển thị: Nếu có tỉnh/thành phố được chọn, dùng districtsByProvinceData, ngược lại dùng allDistrictsData
  const districtsData = selectedProvince ? districtsByProvinceData : allDistrictsData;
  const districtsLoading = selectedProvince ? districtsByProvinceLoading : allDistrictsLoading;
  const districtsError = selectedProvince ? districtsByProvinceError : allDistrictsError;

  const rows = districtsData?.items || [];
  const provinces = provincesData?.items || [];

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" gutterBottom>
        Quản lý quận / huyện
      </Typography>
      <FormControl fullWidth sx={{ mb: 2, maxWidth: 300 }}>
        <InputLabel id="province-select-label">Chọn tỉnh/thành phố</InputLabel>
        <Select
          labelId="province-select-label"
          value={selectedProvince}
          label="Chọn tỉnh/thành phố"
          onChange={handleProvinceChange}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {provinces.map((province) => (
            <MenuItem key={province.id} value={province.id}>
              {province.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {provincesError && (
        <Typography color="error" gutterBottom>
          Lỗi khi tải danh sách tỉnh/thành phố: {provincesError.data?.message || "Không thể kết nối đến server"}
        </Typography>
      )}
      {districtsError && (
        <Typography color="error" gutterBottom>
          Lỗi khi tải danh sách quận/huyện: {districtsError.data?.message || "Không thể kết nối đến server"}
        </Typography>
      )}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={provincesLoading || districtsLoading}
          localeText={{
            noRowsLabel: "Không có dữ liệu",
          }}
        />
      </div>
    </DashboardLayoutWrapper>
  );
};

export default DistrictsManagement;