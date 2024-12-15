const pool = require("../../config/database");

const insertGroupBy = async (description, productname, currentprice, quantity,categoryid) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO public.product (description, productname, currentprice, quantity,categoryid)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING productid 
    `;
    const values = [description, productname, currentprice, quantity,categoryid];

    const result = await client.query(query, values);

    return { success: true, productid: result.rows[0].productid }; 
  } catch (error) {
    console.error("Lỗi khi chèn dữ liệu vào bảng product:", error);
    return { success: false, error: error.message };
  } finally {
    client.release(); // Đóng kết nối
  }
};
const insertGroupByProduct= async ( enddate, estimatearrive, productid) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO public.groupbyproduct ( enddate, estimatearrive, productid)
      VALUES ($1, $2, $3)
      RETURNING groupbyid 
    `;
    const values = [ enddate, estimatearrive, productid];

    const result = await client.query(query, values);

    return { success: true, groupbyid: result.rows[0].groupbyid }; 
  } catch (error) {
    console.error("Lỗi khi chèn dữ liệu vào bảng product:", error);
    return { success: false, error: error.message };
  } finally {
    client.release(); // Đóng kết nối
  }
};

const typeid = async (typeName) => {
    const client = await pool.connect();

    try {

        const result = await client.query(
            `
            SELECT categoryid 
            FROM public.category
            WHERE categoryname = $1
            `,
            [typeName]
        );
        console.log('fasdfasdfa:',typeName);
        console.log('result:',result);

      if (result.rows.length > 0) {
        return {
          success: true, 
          typeid: result.rows[0].categoryid // Trả về categoryid
        };
      } else {
        return { success: false, error: 'xxxx' };
      }
    } catch (error) {
      console.error("Lỗi khi truy vấn vào bảng category:", error);
      return { success: false, error: error.message };
    } finally {
      client.release(); // Đóng kết nối
    }
  };
  
  

module.exports = { insertGroupBy,insertGroupByProduct,typeid };
