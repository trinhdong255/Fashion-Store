// eslint-disable-next-line import/order
import { IconButton } from "@mui/material";
// eslint-disable-next-line import/order
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Tên", width: 200 },
  {
    field: "description",
    headerName: "Mô tả",
    width: 200,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "available",
    headerName: "Có sẵn",
    width: 200,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "averageRating",
    headerName: "Đánh giá trung bình",
    width: 160,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "sold",
    headerName: "Số lượng đã bán",
    width: 160,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "totalReviews",
    headerName: "Tổng đánh giá",
    width: 140,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "stock",
    headerName: "Số lượng tồn",
    width: 140,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "price",
    headerName: "Giá",
    width: 140,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 100,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "updatedAt",
    headerName: "Ngày cập nhật",
    width: 100,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "category",
    headerName: "Danh mục",
    width: 100,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "color",
    headerName: "Màu sắc",
    width: 160,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "size",
    headerName: "Kích thước",
    width: 160,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "images",
    headerName: "Hình ảnh",
    width: 300,
    renderCell: (params) => (
      <>
        {params.row.images?.map((image) => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt={image.fileName}
            style={{
              width: 50,
              height: 100,
              objectFit: "cover",
              padding: 5,
              borderRadius: "4px",
            }}
          />
        ))}
      </>
    ),
    disableColumnMenu: true,
    sortable: false,
  },

  {
    field: "status",
    headerName: "Trạng thái",
    width: 200,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "actions",
    headerName: "Hành động",
    width: 120,
    sortable: false,
    disableColumnMenu: true,
    filterable: false,
    renderCell: (params) => {
      const { row } = params;
      const isDisabled = row.status === "Ngưng hoạt động";
      return (
        <>
          <IconButton
            color="primary"
            onClick={() => params.row.onEdit(params.row)}
            title="Chỉnh sửa">
            <EditIcon />
          </IconButton>
          {isDisabled ? (
            <IconButton
              color="success"
              onClick={() => row.onRestoreClick(row.id, row.name)} // Gọi function khôi phục
              title="Khôi phục">
              <RestartAltIcon />
            </IconButton>
          ) : (
            <IconButton
              color="error"
              onClick={() => row.onDelete(row.id)}
              title="Xóa">
              <DeleteIcon />
            </IconButton>
          )}
        </>
      );
    },
  },
];

export const customLocaleText = {
  columnMenuSortAsc: "Sắp xếp tăng dần",
  columnMenuSortDesc: "Sắp xếp giảm dần",
  columnMenuFilter: "Lọc",
  columnMenuHideColumn: "Ẩn cột",
  columnMenuManageColumns: "Quản lý cột",
  filterPanelInputLabel: "Tìm kiếm",
  filterPanelAddFilter: "Thêm bộ lọc",
  filterOperatorContains: "Chứa",
  filterOperatorEquals: "Bằng",
  filterOperatorStartsWith: "Bắt đầu với",
  filterOperatorEndsWith: "Kết thúc với",
  filterOperatorIs: "Là",
  filterOperatorIsNot: "Không phải là",
  filterOperatorAfter: "Sau",
  filterOperatorOnOrAfter: "Trên hoặc sau",
  filterOperatorBefore: "Trước",
  filterOperatorOnOrBefore: "Trên hoặc trước",
  columnMenuSort: "Sắp xếp",
};

export const validateProduct = ({
  productName,
  productDes,
  productPrice,
  quantity,
  selectedCategoryId,
  selectedSizeId,
  selectedColorId,
  productImage,
}) => {
  const newErrors = {};

  if (!productName.trim())
    newErrors.productName = "Tên sản phẩm không được để trống";

  // Thay đổi thông báo lỗi cho 'productDes'
  if (!productDes.trim())
    newErrors.productDes = "Mô tả sản phẩm không được để trống";

  if (!productPrice || isNaN(Number(productPrice)) || Number(productPrice) <= 0)
    newErrors.productPrice = "Giá phải là số lớn hơn 0";

  if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1)
    newErrors.quantity = "Số lượng phải là số nguyên >= 1";

  if (!selectedCategoryId)
    newErrors.selectedCategoryId = "Vui lòng chọn danh mục";

  if (!selectedSizeId || selectedSizeId.length === 0)
    newErrors.selectedSizeId = "Vui lòng chọn ít nhất 1 kích thước";

  if (!selectedColorId || selectedColorId.length === 0)
    newErrors.selectedColorId = "Vui lòng chọn ít nhất 1 màu sắc";

  if (!productImage || productImage.length === 0)
    newErrors.productImage = "Vui lòng chọn ít nhất 1 hình ảnh";

  return newErrors;
};
