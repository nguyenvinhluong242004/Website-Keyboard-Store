const fs = require("fs");
const path = require("path");
const pool = require('../../config/database');

/**
 * Lấy tất cả các ảnh trong một thư mục
 * @param {string} directory - Đường dẫn thư mục cần quét
 * @returns {Promise<string[]>} - Danh sách các đường dẫn ảnh (URL-friendly)
 */
const getImagesFromDirectory = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err);
      }

      // Lọc các tệp có đuôi là hình ảnh
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
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

const getPathImage = async (idProduct) => {
  try {
    await pool.connect();
    
    const res = await pool.query('SELECT imagepath FROM product WHERE productid = $1', [idProduct]);
    if (res.rows.length > 0) {
      return res.rows[0].imagepath;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error(error);
    return null;
  } 
};
const getLastProduct = async () => {
  try {
    await pool.connect();
    
    const res = await pool.query('SELECT count(*) as last FROM product');
    if (res.rows.length > 0) {
      return res.rows[0].last;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error(error);
    return null;
  } 
};
const getcategory = async () => {
  try {
    await pool.connect();
    
    const res = await pool.query('SELECT categoryid as id,imagepath as path, categoryname as name FROM category');
    if (res.rows.length > 0) {
      return res.rows;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error(error);
    return null;
  } 
};

module.exports = { getImagesFromDirectory,getPathImage,getLastProduct,getcategory};
