const pool = require("../../config/database");

const insertProduct = async (description, productname, currentprice, quantity,  brandid, categoryid, type) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO public.product (description, productname, currentprice, quantity,  brandid, categoryid, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING productid 
    `;
    const values = [description, productname, currentprice, quantity, brandid, categoryid, type];

    const result = await client.query(query, values);

    return { success: true, productid: result.rows[0].productid }; 
  } catch (error) {
    console.error("Lỗi khi chèn dữ liệu vào bảng product:", error);
    return { success: false, error: error.message };
  } finally {
    client.release(); // Đóng kết nối
  }
};
const updateProduct = async (id,path) => {
  const client = await pool.connect();



  try {
    const query = `
      UPDATE public.product
      SET imagepath = $2
      WHERE productid = $1;
    `;
    const values = [id,path];

    const result = await client.query(query, values);

    return { success: true}; 
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
        console.log('category name:',typeName);
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
  
const brandid = async (brandName) => {
    const client = await pool.connect();

    try {

        const result = await client.query(
            `
            SELECT brandid
            FROM public.brand
            WHERE brandname = $1
            `,
            [brandName]
        );
        console.log('result:',result);

      if (result.rows.length > 0) {
        return {
          success: true, 
          brandid: result.rows[0].brandid, 
        };
      } else {
        return { success: false, error: 'xxxx' };
      }
    } catch (error) {
      console.error("Lỗi khi truy vấn vào bảng brand:", error);
      return { success: false, error: error.message };
    } finally {
      client.release(); // Đóng kết nối
    }
  };
  
  

module.exports = { insertProduct,updateProduct,insertGroupByProduct,typeid,brandid };
