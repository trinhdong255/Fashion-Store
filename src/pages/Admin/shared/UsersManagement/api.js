export const createUser = async (userData) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    throw new Error("Tạo user thất bại");
  }

  return response.json();
};

export const fetchUser = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/users?pageNo=1&pageSize=10",
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

export const updateUser = async (id, userData) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `http://222.255.119.40:8080/adamstore/v1/users/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Cập nhật người dùng thất bại. Kiểm tra lại token hoặc dữ liệu."
    );
  }

  const data = await response.json();
  return data;
};

export const deleteUser = async (userId, token) => {
  const response = await fetch(
    `http://222.255.119.40:8080/adamstore/v1/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Xóa người dùng thất bại");
  }

  return response.json(); // hoặc return void
};

export const restoreUser = async (userId, token) => {
  try {
    const res = await fetch(
      `http://222.255.119.40:8080/adamstore/v1/users/${userId}/restore`,
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
