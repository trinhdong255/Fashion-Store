export const fetchOrder = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/orders?pageNo=1&pageSize=10`,
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
