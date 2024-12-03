const { getImagesFromDirectory } = require("../../models/User/apiImage.js");

class GetApiImageController {
  // Phương thức để xử lý API lấy ảnh từ thư mục
  async createApi(req, res) {
    const directory = req.query.directory; // Lấy đường dẫn từ query parameter

    // Nếu không có tham số directory, trả về lỗi
    if (!directory) {
      return res.status(400).json({ error: "Directory path is required" });
    }

    try {
      const images = await getImagesFromDirectory(directory); // Gọi module lấy ảnh
      res.json(images); // Trả về danh sách ảnh
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "minh123Failed to retrieve images" });
    }
  }
}

module.exports = new GetApiImageController();
