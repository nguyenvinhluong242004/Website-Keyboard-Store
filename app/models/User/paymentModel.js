const pool = require('../../config/database');

const getAddress = async (userid) => {
    userid = parseInt(userid);

    try {
        const result = await pool.query(`
            SELECT * FROM public.Address
            WHERE userid = $1
        `, [userid]);
        return {
            address: result.rows
        };
    } catch (error) {
        console.error('Error querying!', error);
        throw new Error('Error fetching data.');
    }
}

const placeOrder = async (orderData) => {

    try {
        await pool.query('BEGIN');
        const orderResult = await pool.query(`
            INSERT INTO public.orders (userid, userpaid, totalamount, orderdate, orderstatus, paymentmethod)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING orderid
        `, [orderData.user.userid, 0, orderData.total, new Date(), 'Pending Approval', orderData.paymentMethod]);

        const orderId = orderResult.rows[0].orderid;

        for (let i = 0; i < orderData.cartItems.length; i++) {
            const item = orderData.cartItems[i];
            if (parseFloat(item.type) ===  1)
            {
                await pool.query(`
                    INSERT INTO public.orderdetail (orderid, numericalorder, productid, quantity, unitprice, groupbyid)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [orderId, i + 1, item.productid, item.quantity, item.currentprice, null]);
            }
            else if (parseFloat(item.type) === 2)
            {
                const groupById = await pool.query(`
                    SELECT groupbyid FROM public.groupbyproduct WHERE productid = $1
                `, [item.productid]);

                await pool.query(`
                    INSERT INTO public.orderdetail (orderid, numericalorder, productid, quantity, unitprice, groupbyid)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [orderId, i + 1, item.productid, item.quantity, item.currentprice, groupById.rows[0].groupbyid]);
            }
        }

        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error querying!', error);
        throw new Error('Error creating order.');
    }
}

module.exports = {
    getAddress,
    placeOrder
}