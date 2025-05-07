export const fetchCategories = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    "http://localhost:8080/adamstore/v1/categories/admin?pageNo=1&pageSize=10",
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
    "http://localhost:8080/adamstore/v1/sizes?pageNo=1&pageSize=10",
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
    "http://localhost:8080/adamstore/v1/colors?pageNo=1&pageSize=100",
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
      "http://localhost:8080/adamstore/v1/file/upload/image",
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

  const response = await fetch("http://localhost:8080/adamstore/v1/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Thêm sản phẩm thất bại");
  }

  return await response.json();
};

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
    throw new Error("Lỗi khi lấy size. Vui lòng kiểm tra token hoặc API.");
  }

  const data = await response.json();
  return data.result.items;
};
