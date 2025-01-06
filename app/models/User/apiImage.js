const fs = require("fs");
const path = require("path");
const pool = require("../../config/database");

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
    

    const res = await pool.query(
      "SELECT imagepath FROM product WHERE productid = $1",
      [idProduct]
    );
    if (res.rows.length > 0) {
      return res.rows[0].imagepath;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
const getLastProduct = async () => {
  try {
    

    const res = await pool.query("SELECT count(*) as last FROM product");
    if (res.rows.length > 0) {
      return res.rows[0].last;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
const getcategory = async () => {
  try {
    

    const res = await pool.query(
      "SELECT categoryid as id,imagepath as path, categoryname as name FROM category"
    );
    if (res.rows.length > 0) {
      return res.rows;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
const getreview = async (id) => {
  try {
    

    const res = await pool.query(
      `SELECT email, reviewdate as date, comment, stars
      FROM review
      WHERE productid =$1
      ORDER BY reviewdate DESC
      `,
      [id]
    );
    if (res.rows.length >= 0) {
      return res.rows;
    } else {
      throw new Error("Reviews not found");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
const sendreview = async (rating, id, comment) => {
  try {
    const res = await pool.query(
      `INSERT INTO review(productid, comment, stars)
       VALUES($1, $2, $3)`, // Sử dụng tham số thay vì chèn trực tiếp
      [id, comment, rating]  // Truyền tham số theo đúng thứ tự
    );

    if (res.rowCount > 0) { // Sử dụng rowCount để kiểm tra số lượng bản ghi bị ảnh hưởng
      return {
        success: true,
      };
    } else {
      throw new Error("Reviews not inserted");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};


module.exports = {
  sendreview,
  getImagesFromDirectory,
  getPathImage,
  getLastProduct,
  getcategory,
  getreview,
};
