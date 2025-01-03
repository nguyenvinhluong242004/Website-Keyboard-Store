const pool = require("../../config/database");

const getListGroupBy = async (page, perPage,orderby) => {
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
        p.quantity,
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
      where p.type = 2
      ORDER BY ${orderby}
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
const getDetailRegister = async (orderid,gbID) => {
  const list = await pool.connect();
  try {
  
    //const offset = (page - 1) * perPage;


    const totalRegister = await list.query(
      "SELECT COUNT(*) FROM public.groupbyproduct"
    );


    const register = await list.query(
      `
      SELECT DISTINCT o.orderdate,o.orderid,o.paymentmethod, o.userid, o.orderstatus, p.estimatearrive
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
      JOIN groupbyproduct p on p.groupbyid = d.groupbyid
      WHERE o.orderid = $1 and p.groupbyid = $2
      --LIMIT $1 OFFSET $2
    `,
      [ orderid,gbID]
    );

    const allProduct = await list.query(
      `
      SELECT p.productname, d.quantity, d.unitprice
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
	    JOIN product p on p.productid = d.productid
      WHERE o.orderid = $1 and d.groupbyid =$2
      --LIMIT $1 OFFSET $2
    `,
      [orderid,gbID]
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
const deleteForm = async (id) => {
  const client = await pool.connect(); // Kết nối đến cơ sở dữ liệu
  try {
      // Thực hiện truy vấn cập nhật
      const result = await client.query(`
          UPDATE product
          SET type = NULL
          WHERE productid = $1
      `, [id]);

      // Kiểm tra kết quả nếu không có dòng nào bị ảnh hưởng
      if (result.rowCount === 0) {
          throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
      }

      // Trả về kết quả thành công
      return {
          success: true,
          message: `Đã xóa loại sản phẩm cho sản phẩm có ID ${id}`,
      };
  } catch (error) {
      // Ghi log lỗi chi tiết
      console.error('Lỗi truy vấn:', error.message);
      console.error('Chi tiết lỗi:', error.stack);

      // Quăng lỗi để xử lý bên ngoài nếu cần
      throw new Error(`Có lỗi xảy ra khi cập nhật sản phẩm: ${error.message}`);
  } finally {
      client.release(); // Giải phóng kết nối
  }
};
const closeForm = async (id) => {
  const client = await pool.connect(); // Kết nối đến cơ sở dữ liệu
  try {
      // Thực hiện truy vấn cập nhật
      const result = await client.query(`
          UPDATE product
          SET quantity = 0
          WHERE productid = $1
      `, [id]);

      // Kiểm tra kết quả nếu không có dòng nào bị ảnh hưởng
      if (result.rowCount === 0) {
          throw new Error(`Không tìm thấy sản phẩm với ID: ${id}`);
      }

      // Trả về kết quả thành công
      return {
          success: true,
          message: `Đã xóa loại sản phẩm cho sản phẩm có ID ${id}`,
      };
  } catch (error) {
      // Ghi log lỗi chi tiết
      console.error('Lỗi truy vấn:', error.message);
      console.error('Chi tiết lỗi:', error.stack);

      // Quăng lỗi để xử lý bên ngoài nếu cần
      throw new Error(`Có lỗi xảy ra khi cập nhật sản phẩm: ${error.message}`);
  } finally {
      client.release(); // Giải phóng kết nối
  }
};

const searchRegister = async (page, perPage,id,query) => {
  const list = await pool.connect();
  try {
    // Tính toán offset (bắt đầu từ đâu trong bảng)
    const offset = (page - 1) * perPage;


    const totalRegisterSearch = await list.query(
      `
      SELECT COUNT( DISTINCT o.orderid)
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
      WHERE groupbyid = $1 and LOWER(o.paymentmethod) = LOWER($2)
      `,
      [id,query]
    );

     const registerSearch = await list.query(
      `
      SELECT DISTINCT o.orderid, o.orderdate, o.userpaid, o.paymentmethod, o.userid, o.orderstatus
      FROM  public.orders o 
      JOIN public.orderdetail d on d.orderid=o.orderid 
      WHERE groupbyid = $3 and LOWER(o.paymentmethod) = LOWER($4)
      LIMIT $1 OFFSET $2
    `,
      [perPage, offset, id,query]
    );


    return {
      totalSearch: parseInt(totalRegisterSearch.rows[0].count, 10),
      resultSearch: registerSearch.rows, 
    };
  } catch (error) {
    console.error("Lỗi truy vấn tất cả group by:", error);
    throw error;
  } finally {
    list.release();
  }
};


module.exports = 
{ 
  getListGroupBy, 
  getListRegister,
  getDetailRegister,
  searchRegister,
  deleteForm,
  closeForm
};
