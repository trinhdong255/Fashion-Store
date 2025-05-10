import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

import DashboardLayoutWrapper from "@/layouts/DashboardLayout";
import { fetchOrder } from "./api";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "customerName",
      headerName: "Khách hàng",
      width: 150,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "phone",
      headerName: "SĐT",
      width: 130,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 300,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "productName",
      headerName: "Sản phẩm",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "productOrder",
      headerName: "Ngày đặt",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "totalPrice",
      headerName: "Tổng tiền",
      width: 130,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "orderStatus",
      headerName: "Trạng thái",
      width: 160,
      disableColumnMenu: true,
      sortable: false,
      valueFormatter: (params) => {
        console.log("formatting status", params.row?.orderStatus);

        const statusMap = {
          PENDING: "Đang chờ",
          PROCESSING: "Đang xử lý",
          SHIPPED: "Đã giao hàng",
          DELIVERED: "Đã giao thành công",
          CANCELLED: "Đã hủy",
        };

        const formattedValue =
          statusMap[params.row?.orderStatus] || params.row?.orderStatus;
        console.log("Formatted status", formattedValue); // Kiểm tra giá trị đã chuyển đổi
        return formattedValue;
      },
    },

    // {
    //   field: "actions",
    //   headerName: "Hành động",
    //   width: 160,
    //   renderCell: (params) => (
    //     <>
    //       <IconButton
    //         color="primary"
    //         onClick={() => params.row.onEdit(params.row)}
    //         title="Chỉnh sửa">
    //         <EditIcon />
    //       </IconButton>
    //       <IconButton
    //         color="error"
    //         onClick={() => row.onDelete(row.id)}
    //         title="Xóa">
    //         <DeleteIcon />
    //       </IconButton>
    //     </>
    //   ),
    // },
  ];

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const items = await fetchOrder();

        const mapped = items.map((order) => {
          const firstProduct =
            order.orderItems?.[0]?.productVariant?.product?.name || "N/A";
          const fullAddress = [
            order.address?.streetDetail,
            order.address?.ward?.name,
            order.address?.district?.name,
            order.address?.province?.name,
          ]
            .filter(Boolean)
            .join(", ");

          return {
            id: order.id,
            customerName: order.customerName,
            phone: order.address.phone,
            address: fullAddress,
            productName: firstProduct,
            productOrder: order.orderDate,
            totalPrice: order.totalPrice.toLocaleString("vi-VN") + "₫",
            orderStatus: order.orderStatus,
          };
        });

        setOrders(mapped);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <DashboardLayoutWrapper>
      <Typography variant="h5" sx={{ marginBottom: 4 }} gutterBottom>
        Quản lý Đơn hàng
      </Typography>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10]}
          loading={loading}
          disableSelectionOnClick
        />
      </div>
    </DashboardLayoutWrapper>
  );
};

export default OrdersManagement;
