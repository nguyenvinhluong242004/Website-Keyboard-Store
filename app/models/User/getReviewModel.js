const pool = require('../../config/database');

const getReview = async (id) => {
    const client = await pool.connect();

    try {
      const query = `
        SELECT * 
        FROM public.review
        where productid = $1
        ORDER BY reviewid ASC 
      `;
      const values = [id];
  
      const result = await client.query(query, values);
  
      return { success: true, reviews: result.rows}; 

    } catch (error) {
      console.error("Lỗi khi chèn dữ liệu vào bảng product:", error);
      return { success: false, error: error.message };
    } finally {
      client.release(); // Đóng kết nối
    }
  };

module.exports= getReview ;