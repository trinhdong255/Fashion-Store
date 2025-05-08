export const fetchCategories = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/categories/admin?pageNo=1&pageSize=10",
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

export const fetchSize = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/sizes?pageNo=1&pageSize=10",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lỗi khi lấy size. Vui lòng kiểm tra token hoặc API.");
  }

  const data = await response.json();
  return data.result.items;
};

export const fetchColor = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/colors?pageNo=1&pageSize=100",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lỗi khi lấy màu. Vui lòng kiểm tra token hoặc API.");
  }

  const data = await response.json();
  return data.result.items;
};

export const handleUpload = async (file) => {
  const token = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("fileImage", file);

  try {
    const res = await fetch(
      "http://222.255.119.40:8080/adamstore/v1/file/upload/image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    console.log("Response từ API:", data);

    if (data.code === 200 && data.result) {
      return {
        id: data.result.id,
        imageUrl: data.result.imageUrl,
      };
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (err) {
    console.error("Lỗi khi upload ảnh", err);
    throw err;
  }
};

export const createProduct = async (productData) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }
  );

  if (!response.ok) {
    throw new Error("Thêm sản phẩm thất bại");
  }

  return await response.json();
};

export const fetchProduct = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://222.255.119.40:8080/adamstore/v1/products/admin?pageNo=1&pageSize=100",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Lỗi khi lấy size. Vui lòng kiểm tra token hoặc API.");
  }

  const data = await response.json();
  return data.result.items;
};

export const fetchProductID = async (productId, token) => {
  try {
    const res = await fetch(
      `http://222.255.119.40:8080/adamstore/v1/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    // ❗ Kiểm tra nếu có lỗi từ server
    if (!res.ok) {
      throw new Error(data.message || "Lỗi không xác định từ máy chủ");
    }

    // ❗ Kiểm tra xem có result không
    if (!data.result) {
      throw new Error("Không tìm thấy thông tin sản phẩm.");
    }

    const item = data.result;

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      available: item.isAvailable ? "Còn hàng" : "Hết hàng",
      averageRating: item.averageRating,
      sold: item.soldQuantity,
      totalReviews: item.totalReviews,
      stock: item.quantity,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: item.category,
      colors: item.colors || [],
      sizes: item.sizes || [],
      images: item.images || [],
      status: item.status === "ACTIVE" ? "Hoạt động" : "Ngưng hoạt động",
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteProduct = async (productId, token) => {
  try {
    const res = await fetch(
      `http://222.255.119.40:8080/adamstore/v1/products/${productId}`,
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

export const restoreProduct = async (productId, token) => {
  try {
    const res = await fetch(
      `http://222.255.119.40:8080/adamstore/v1/products/${productId}/restore`,
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

export async function updateProduct(productId, payload, token) {
  const response = await fetch(
    `http://222.255.119.40:8080/adamstore/v1/products/${productId}`,
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
