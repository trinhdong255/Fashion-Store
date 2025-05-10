export const fetchPromotion = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/promotions?pageNo=1&pageSize=10",
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

export const createPromotion = async (promotionData) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/promotions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(promotionData),
    }
  );

  if (!response.ok) {
    throw new Error("Promotion đã tồn tại trong hệ thống");
  }

  return await response.json();
};

export const deletePromotion = async (promotionId, token) => {
  try {
    const res = await fetch(
      `http://222.255.119.40:8080/adamstore/v1/promotions/${promotionId}`,
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
    throw new Error(err.message || "Lỗi kết nối khi xóa sản phẩm");
  }
};

export const restorePromotion = async (promotionId, token) => {
  try {
    const res = await fetch(
      `http://222.255.119.40:8080/adamstore/v1/promotions/${promotionId}/restore`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Lỗi không rõ");
    }
    return true;
  } catch (err) {
    throw new Error(err.message || "Lỗi kết nối khi khôi phục sản phẩm");
  }
};

export async function updatePromotion(promotionId, payload, token) {
  const response = await fetch(
    `http://222.255.119.40:8080/adamstore/v1/promotions/${promotionId}`,
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
    throw new Error(errorText || "Lỗi khi cập nhật sản phẩm");
  }

  return await response.json(); // <- Quan trọng! http://222.255.119.40:8080
}
