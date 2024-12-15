const pool = require("../../config/database");

const getListGroupBy = async (page, perPage) => {
  const list = await pool.connect();
  try {
    // Tính toán offset (bắt đầu từ đâu trong bảng)
    const offset = (page - 1) * perPage;

    // Lấy tổng số dòng trong bảng để tính số trang
    const totalGroupBy = await list.query(
      "SELECT COUNT(*) FROM public.groupbyproduct"
    );

    // Lấy dữ liệu phân trang
    const product = await list.query(
      `
      SELECT 
        p.imagepath,
        p.productname,
        p.currentprice,
        g.enddate,
        g.currentparticipants,
        g.estimatearrive,
        b.brandname,
        p.description,
        c.categoryname,
        g.groupbyid
      FROM 
        public.product p
      JOIN 
        public.groupbyproduct g ON p.productid = g.productid
      JOIN public.category c on p.categoryid = c.categoryid

      JOIN public.brand b on b.brandid = p.brandid

      LIMIT $1 OFFSET $2
    `,
      [perPage, offset]
    );

    return {
      totalProductGroupBy: parseInt(totalGroupBy.rows[0].count, 10), // Tổng số nhóm sản phẩm
      allProductGroupBy: product.rows, // Dữ liệu sản phẩm theo trang
    };
  } catch (error) {
    console.error("Lỗi truy vấn tất cả group by:", error);
    throw error;
  } finally {
    list.release();
  }
};

const getListRegister = async (page, perPage, id) => {
  const list = await pool.connect();
  try {
    // Tính toán offset (bắt đầu từ đâu trong bảng)
    const offset = (page - 1) * perPage;

    // Lấy tổng số dòng trong bảng để tính số trang
    const totalRegister = await list.query(
      `SELECT COUNT(distinct orderid) FROM public.orderdetail
      WHERE groupbyid = $1
      `,
      [id]
      
    );

    // Lấy dữ liệu phân trang
    const register = await list.query(
      `
      SELECT DISTINCT o.orderid, o.orderdate, o.userpaid, o.paymentmethod, o.userid, o.orderstatus
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
      WHERE groupbyid = $3
      LIMIT $1 OFFSET $2
    `,
      [perPage, offset, id]
    );

    const getAllRegister = await list.query(
      `
      SELECT DISTINCT o.orderid, o.orderdate, o.userpaid, o.paymentmethod, o.userid, o.orderstatus
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
      WHERE groupbyid = $1
    `,
      [id]
    );

    return {
      totalRegister: parseInt(totalRegister.rows[0].count, 10), // Tổng số nhóm sản phẩm
      allRegister:register.rows, // Dữ liệu sản phẩm theo trang
      exportRegister:getAllRegister.rows,
    };
  } catch (error) {
    console.error("Lỗi truy vấn tất cả Register:", error);
    throw error;
  } finally {
    list.release();
  }
};
const getDetailRegister = async (page, perPage, orderid) => {
  const list = await pool.connect();
  try {
  
    const offset = (page - 1) * perPage;


    const totalRegister = await list.query(
      "SELECT COUNT(*) FROM public.groupbyproduct"
    );


    const register = await list.query(
      `
      SELECT DISTINCT o.orderdate,o.orderid,o.paymentmethod, o.userid, o.orderstatus, p.estimatearrive
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
      JOIN groupbyproduct p on p.groupbyid = d.groupbyid
      WHERE o.orderid = $3
      LIMIT $1 OFFSET $2
    `,
      [perPage, offset, orderid]
    );

    const allProduct = await list.query(
      `
      SELECT p.productname, d.quantity, d.unitprice
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
	    JOIN product p on p.productid = d.productid
      WHERE o.orderid = $3
      LIMIT $1 OFFSET $2
    `,
      [perPage, offset, orderid]
    );

    return {
      totalRegister: parseInt(totalRegister.rows[0].count, 10), 

      allRegister:register.rows, 
      
      allProductRegister:allProduct.rows
    };
  } catch (error) {
    console.error("Lỗi truy vấn tất cả Register:", error);
    throw error;
  } finally {
    list.release();
  }
};

module.exports = 
{ 
  getListGroupBy, 
  getListRegister,
  getDetailRegister 
};
