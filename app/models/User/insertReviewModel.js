const pool = require('../../config/database');

const insert = async (productid, email, reviewdate, comment, stars) => {

    try {
      const query = `
        INSERT INTO public.review (productid, email, reviewdate, comment, stars)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING reviewid
      `;
      const values = [productid, email, reviewdate, comment, stars];
        
      const result = await pool.query(query, values);
  
      return { success: true, reviewid: result.rows[0].reviewid}; 

    } catch (error) {
      console.error("Lỗi khi chèn dữ liệu vào bảng product:", error);
      return { success: false, error: error.message };
    }
  };

module.exports= insert ;