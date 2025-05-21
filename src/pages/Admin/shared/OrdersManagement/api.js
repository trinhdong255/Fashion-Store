export const fetchOrder = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:8080/adamstore/v1/orders?pageNo=1&pageSize=10",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lỗi khi lấy danh mục. Vui lòng kiểm tra token hoặc API.");
  }
  const data = await response.json();
  return data.result.items;
};

// export const deleteOrder = async (productId, token) => {
//   try {
//     const res = await fetch(
//       `http://localhost:8080/adamstore/v1/ordersId/${productId}`,
//       {
//         method: "DELETE",
//         headers: {
//          // "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // Nếu có lỗi từ server, parse lỗi từ response
//     if (!res.ok) {
//       const errorData = await res.json().catch(() => null); // tránh lỗi nếu không phải JSON
//       const message = errorData?.message || "Lỗi không xác định từ máy chủ";
//       throw new Error(message);
//     }

//     return true;
//   } catch (err) {
//     throw new Error(err.message || "Lỗi kết nối khi xóa sản phẩm");
//   }
// };
