const fs = require("fs");
const path = require("path");
const { getGroupByProduct } = require("../../models/User/get_product_gb.js");
const controller = {};

// Render Kit Phim
controller.showDetailGroupby = async (req, res) => {
    const user = req.session.user;
    const id = req.params.id || 1; // Lấy ID sản phẩm từ route hoặc mặc định là 1
    console.log("id product:", id);
  
    try {
      // Lấy dữ liệu sản phẩm từ model
      const productData = await getGroupByProduct(id); // Dữ liệu trả về dạng { dataProduct: [...] }
      const product = productData.dataGroupByProduct[0]; // Chỉ lấy sản phẩm đầu tiên trong mảng
  
      if (!product) {
        return res.status(404).send("Product not found");
      }
  
      // Đường dẫn tới folder ảnh dựa trên `imagepath`
      const folderPath = path.join(
        __dirname,
        "../../../public",
        product.imagepath
      );
      console.log("Folder path:", folderPath);
  
      try {
        // Đọc danh sách file ảnh trong thư mục
        const imageFiles = fs
          .readdirSync(folderPath) // Lấy danh sách file trong folder
          .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) // Chỉ lấy file ảnh
          .map((file) => `${product.imagepath}/${file}`); // Tạo URL đầy đủ cho từng ảnh
  
        product.imagepath = imageFiles; // Gán mảng ảnh vào `imagepath`
        console.log("Product data:", product);
      } catch (err) {
        console.error(`Lỗi đọc folder ảnh ${folderPath}:`, err);
        product.imagepath = []; // Nếu lỗi, gán mảng rỗng
      }
  
      // Render view với dữ liệu sản phẩm
      res.render("User/detail-groupby", {
        layout: "layoutUser",
        title: "DetailGroupby",
        customHead: `
          <link rel="stylesheet" href="/User/DetailGroupBy/detail-groupby.css">
          <script defer src="/User/DetailGroupBy/groupby.js"></script>
        `,
        user: user,
        idProduct: id,
        data: JSON.stringify(product), // Chuyển dữ liệu sang JSON để Vue.js sử dụng
      });
    } catch (error) {
      console.error("Error fetching product data:", error.message);
      res.status(500).send("Error fetching product data: " + error.message);
    }
};

module.exports = controller;
