const pool = require("../../config/database");


const getListGroupBy = async () => {
  const list = await pool.connect();
  try {
    const totalGroupBy = await list.query(
      "SELECT COUNT(*) FROM public.groupbyproduct"
    );
    const product = await list.query(` 
            SELECT 
                p.productname,
                p.imagepath,
                g.enddate
            FROM 
                public.product p
            JOIN 
                public.groupbyproduct g ON p.productid = g.productid
            `);
    return {
      totalProductGroupBy: parseInt(totalGroupBy.rows[0].count, 10),
      allProductGroupBy: product.rows,
    };
  } catch (error) {
    console.error("Lỗi truy vấn tất cả group by :", error);
    throw error;
  } finally {
    list.release();
  }
};
module.exports = { getListGroupBy };
