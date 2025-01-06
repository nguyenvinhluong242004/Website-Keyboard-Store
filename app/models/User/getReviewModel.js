const pool = require('../../config/database');

const getReview = async (id) => {

    try {
      const query = `
        SELECT * 
        FROM public.review
        where productid = $1
        ORDER BY reviewid ASC 
      `;
      const values = [id];
  
      const result = await pool.query(query, values);
  
      return { success: true, reviews: result.rows}; 

    } catch (error) {
      console.error("Lỗi khi chèn dữ liệu vào bảng product:", error);
      return { success: false, error: error.message };
    }
  };

module.exports= getReview ;