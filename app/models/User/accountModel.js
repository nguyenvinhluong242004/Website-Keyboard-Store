const pool = require('../../config/database'); // Kết nối đến cơ sở dữ liệu
const fs = require('fs');
const path = require('path');

class accountModel {
    /**
     * Kiểm tra thông tin tài khoản dựa trên email
     * @param {string} email - Email đăng nhập
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async findAccountByEmail(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM AccountType 
                 WHERE email = $1`,
                [email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async findAccountByEmailTypeEmail(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM AccountType 
                 WHERE email = $1 AND type='Email'`,
                [email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Kiểm tra thông tin tài khoản dựa trên email
     * @param {string} email - Email đăng nhập
     * @param {string} googleId - googleId
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async findAccountByEmailAndGoogleID(email, googleId) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM AccountType 
                 WHERE email = $1 AND passwordorgoogleid = $2 AND type='Google'`,
                [email, googleId]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Lấy thông tin tài khoản dựa trên email
     * @param {string} email - Email 
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async getInforAccountByEmail(email) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM Users 
                 WHERE email = $1`,
                [email]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Thêm thông tin User
     * @param {string} email - Email 
     * @param {string} username - Username
     * @param {string} passwordorgoogleid - mật khẩu đã băm hoặc ggID
     * @returns {Status} - Trả về lỗi nếu lỗi kết nối 
     */
    static async addUserIntoDataBase(username, email, passwordorgoogleid, type) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Bắt đầu transaction

            // Thêm dữ liệu vào bảng AccountType
            const result = await client.query(
                `INSERT INTO AccountType(email, passwordorgoogleid, type) 
                 VALUES($1, $2, $3)`,
                [email, passwordorgoogleid, type]
            );

            // Thêm dữ liệu vào bảng Users
            await client.query(
                `INSERT INTO Users(username, email, phone) 
                 VALUES($1, $2, $3)`,
                [username, email, "null"]
            );

            await client.query('COMMIT'); // Xác nhận transaction
            console.log('Thêm tài khoản và cấp độ ban đầu thành công!');
        } catch (err) {
            await client.query('ROLLBACK'); // Quay lại nếu có lỗi
            console.error('Lỗi khi thêm tài khoản và cấp độ!', err);
            throw new Error('Lỗi thêm dữ liệu vào cơ sở dữ liệu');
        } finally {
            client.release(); // Giải phóng kết nối
        }
    }

    /**
     * Thay đổi mật khẩu 
     * @param {string} email - Email 
     * @param {string} hashedNewPassword - Mật khẩu mới
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async changePasswordByEmail(email, hashedNewPassword) {
        try {
            const result = await pool.query(
                `UPDATE AccountType 
                 SET passwordorgoogleid = $2
                 WHERE email = $1`,
                [email, hashedNewPassword]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    /**
     * Thay đổi thông tin người dùng 
     * @param {string} email - Email 
     * @param {string} username - Tên
     * @returns {Promise<Object|null>} - Trả về thông tin tài khoản hoặc null nếu không tìm thấy
     */
    static async changeInfoByEmail(userid, email, username, sdt) {
        try {
            const result = await pool.query(
                `UPDATE Users 
                 SET username = $2, email = $3, phone = $4 
                 WHERE userid = $1`,
                [userid, username, email, sdt]
            );
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async getAllAddress(userid) {
        try {
            const result = await pool.query(
                `SELECT * 
                 FROM Address 
                 WHERE userid = $1`,
                [userid]
            );
            return result.rows.length > 0 ? result.rows : [];
        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }

    static async getAllOrdersForUser(userid, status) {
        try {
            let result = null;
            if (status === '') {
                result = await pool.query(
                    `SELECT 
                        o.orderid,
                        o.userid,
                        o.userpaid,
                        o.totalamount,
                        o.orderdate,
                        o.orderstatus,
                        o.paymentmethod,
                        od.numericalorder,
                        p.productid,
                        p.productname,
                        od.quantity,
                        od.unitprice,
                        p.imagepath,
                        p.description,
                        p.type
                    FROM orders o
                    JOIN orderdetail od ON o.orderid = od.orderid
                    JOIN product p ON od.productid = p.productid
                    WHERE o.userid = $1
                    ORDER BY o.orderdate DESC`,
                    [userid]
                );
            }
            else {
                result = await pool.query(
                    `SELECT 
                        o.orderid,
                        o.userid,
                        o.userpaid,
                        o.totalamount,
                        o.orderdate,
                        o.orderstatus,
                        o.paymentmethod,
                        od.numericalorder,
                        p.productid,
                        p.productname,
                        od.quantity,
                        od.unitprice,
                        p.imagepath,
                        p.description,
                        p.type
                    FROM orders o
                    JOIN orderdetail od ON o.orderid = od.orderid
                    JOIN product p ON od.productid = p.productid
                    WHERE o.userid = $1 AND o.OrderStatus = $2
                    ORDER BY o.orderdate DESC`,
                    [userid, status]
                );
            }

            if (result.rows.length > 0) {
                const orders = [];
                let currentOrder = null;

                for (const row of result.rows) {
                    // Nếu đơn hàng chưa được thêm vào list, tạo một đơn hàng mới
                    if (!currentOrder || currentOrder.orderid !== row.orderid) {
                        if (currentOrder) {
                            orders.push(currentOrder); // Thêm đơn hàng hiện tại vào danh sách
                        }

                        // Tạo đối tượng đơn hàng mới
                        currentOrder = {
                            orderid: row.orderid,
                            userid: row.userid,
                            userpaid: row.userpaid,
                            totalamount: row.totalamount,
                            orderdate: row.orderdate,
                            orderstatus: row.orderstatus,
                            paymentmethod: row.paymentmethod,
                            products: [] // Danh sách các sản phẩm trong đơn hàng
                        };
                    }

                    // Lấy đường dẫn hình ảnh đầu tiên cho sản phẩm
                    const folderPath = path.join(__dirname, '../../../public', row.imagepath);
                    let firstImage = '/path/to/default-image.jpg'; // Mặc định nếu không tìm thấy hình ảnh

                    try {
                        const files = fs.readdirSync(folderPath);
                        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
                        firstImage = imageFiles.length > 0 ? `${row.imagepath}/${imageFiles[0]}` : firstImage;
                    } catch (err) {
                        console.error(`Không thể đọc thư mục ảnh: ${folderPath}`, err);
                    }

                    // Thêm thông tin chi tiết sản phẩm vào mảng products
                    currentOrder.products.push({
                        numericalorder: row.numericalorder,
                        productid: row.productid,
                        productname: row.productname,
                        quantity: row.quantity,
                        type: row.type,
                        unitprice: row.unitprice,
                        imagepath: row.imagepath,
                        firstimage: firstImage,  // Đưa đường dẫn ảnh đầu tiên vào
                        description: row.description
                    });
                }

                // Đảm bảo thêm đơn hàng cuối cùng vào danh sách
                if (currentOrder) {
                    orders.push(currentOrder);
                }

                return orders;
            } else {
                return []; // Nếu không có đơn hàng nào
            }

        } catch (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        }
    }



    static async addOrUpdateAddress(id, userid, province, district, ward, street) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Bắt đầu transaction

            if (id) {
                // Nếu id đã tồn tại, thực hiện cập nhật
                await client.query(
                    `UPDATE Address 
                    SET userid = $2, province = $3, district = $4, ward = $5, street = $6
                    WHERE id = $1`,
                    [id, userid, province, district, ward, street]
                );
            } else {
                // Nếu id rỗng, thực hiện thêm mới
                await client.query(
                    `INSERT INTO Address (userid, province, district, ward, street)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [userid, province, district, ward, street]
                );
            }

            await client.query('COMMIT'); // Xác nhận transaction
        } catch (err) {
            await client.query('ROLLBACK'); // Quay lại nếu có lỗi
            console.error('Lỗi: ', err);
            throw new Error('Lỗi thêm hoặc cập nhật dữ liệu vào cơ sở dữ liệu');
        } finally {
            client.release(); // Giải phóng kết nối
        }
    }


    static async deleteAddressById(id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN'); // Bắt đầu transaction

            // Xóa bản ghi khỏi bảng Address
            const result = await client.query(
                `DELETE FROM Address WHERE id = $1`,
                [id]
            );

            await client.query('COMMIT'); // Xác nhận transaction

            if (result.rowCount === 0) {
                // Không tìm thấy bản ghi để xóa
                throw new Error('Không tìm thấy địa chỉ với ID đã cung cấp');
            }
            return { success: true, message: 'Đã xóa địa chỉ thành công' };
        } catch (err) {
            await client.query('ROLLBACK'); // Quay lại nếu có lỗi
            console.error('Lỗi khi xóa địa chỉ: ', err);
            throw new Error('Lỗi khi xóa địa chỉ');
        } finally {
            client.release(); // Giải phóng kết nối
        }
    }

    static async changeStatus(orderId, status) {
        const client = await pool.connect(); // Kết nối cơ sở dữ liệu
        try {
            await client.query('BEGIN'); // Bắt đầu giao dịch

            // Cập nhật trạng thái đơn hàng
            const updateResult = await client.query(
                `UPDATE Orders
                 SET OrderStatus = $1
                 WHERE OrderID = $2
                 RETURNING OrderID, OrderStatus`,
                [status, orderId]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('Order not found or unable to update');
            }

            // Nếu trạng thái là "Cancelled", cập nhật lại số lượng sản phẩm
            if (status === 'Refuse') {
                // Lấy danh sách sản phẩm trong OrderDetail
                const orderDetails = await client.query(
                    `SELECT ProductID, Quantity
                     FROM OrderDetail
                     WHERE OrderID = $1`,
                    [orderId]
                );

                // Cập nhật lại số lượng sản phẩm trong bảng Product
                for (const detail of orderDetails.rows) {
                    await client.query(
                        `UPDATE Product
                         SET Quantity = Quantity + $1
                         WHERE ProductID = $2`,
                        [detail.quantity, detail.productid]
                    );
                }
            }

            await client.query('COMMIT'); // Kết thúc giao dịch thành công
            return updateResult.rows[0]; // Trả về thông tin đơn hàng đã cập nhật
        } catch (err) {
            await client.query('ROLLBACK'); // Quay lại giao dịch nếu có lỗi
            console.error('Lỗi truy vấn cơ sở dữ liệu!', err);
            throw new Error('Lỗi truy vấn cơ sở dữ liệu');
        } finally {
            client.release(); // Đóng kết nối
        }
    }





}

module.exports = accountModel;
