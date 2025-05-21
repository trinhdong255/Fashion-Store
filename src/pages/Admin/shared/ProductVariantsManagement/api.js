export const fetchProduct = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:8080/adamstore/v1/products/admin?pageNo=1&pageSize=100",
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

export const fetchProductVariant = async (productId) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `http://localhost:8080/adamstore/v1/products/${productId}/product-variants/admin?pageNo=1&pageSize=100`,
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

export async function updateProductVariant(productId, payload, token) {
  const response = await fetch(
    `http://localhost:8080/adamstore/v1/product-variants/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorText = await response.message;
    throw new Error(errorText || "Lỗi khi cập nhật biến thể sản phẩm");
  }

  return await response.json();
}

export const deleteProductVariant = async (productId, token) => {
  try {
    const res = await fetch(
      `http://localhost:8080/adamstore/v1/product-variants/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Nếu có lỗi từ server, parse lỗi từ response
    if (!res.ok) {
      const errorData = await res.json().catch(() => null); // tránh lỗi nếu không phải JSON
      const message = errorData?.message || "Lỗi không xác định từ máy chủ";
      throw new Error(message);
    }

    return true;
  } catch (err) {
    throw new Error(err.message || "Lỗi kết nối khi xóa biến thể sản phẩm");
  }
};
