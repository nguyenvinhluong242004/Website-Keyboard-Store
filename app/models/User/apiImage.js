const fs = require("fs");
const path = require("path");

/**
 * Lấy tất cả các ảnh trong một thư mục
 * @param {string} directory - Đường dẫn thư mục cần quét
 * @returns {Promise<string[]>} - Danh sách các đường dẫn ảnh (URL-friendly)
 */
const getImagesFromDirectory = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
        console.log('fdfd');
      if (err) {
        return reject(err);
      }

      // Lọc các tệp có đuôi là hình ảnh
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );

      // Chuyển đổi đường dẫn tệp thành đường dẫn URL tương đối
      const publicRoot = path.resolve("public"); // Thư mục gốc public
      const absolutePath = path.resolve(directory);

      const imagePaths = imageFiles.map((file) => {
        const fullPath = path.join(absolutePath, file);
        
        // Loại bỏ phần public khỏi đường dẫn
        const relativePath = fullPath.replace(publicRoot, "");

        // Thay dấu \ thành /
        return relativePath.replace(/\\/g, "/");
      });

      resolve(imagePaths);
    });
  });
};

module.exports = { getImagesFromDirectory };
