const pool = require('../../config/database');

const getAddress = async (userid) => {
    userid = parseInt(userid);

    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM public.Address
            WHERE userid = $1
        `, [userid]);
        return {
            address: result.rows
        };
    } catch (error) {
        console.error('Error querying!', error);
        throw new Error('Error fetching data.');
    } finally {
        client.release();
    }
}

const placeOrder = async (orderData) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const orderResult = await client.query(`
            INSERT INTO public.orders (userid, userpaid, totalamount, orderdate, orderstatus, paymentmethod)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING orderid
        `, [orderData.user.userid, 0, orderData.total, new Date(), 'Pending Approval', orderData.paymentMethod]);

        const orderId = orderResult.rows[0].orderid;

        for (let i = 0; i < orderData.cartItems.length; i++) {
            const item = orderData.cartItems[i];
            if (parseFloat(item.type) ===  1)
            {
                await client.query(`
                    INSERT INTO public.orderdetail (orderid, numericalorder, productid, quantity, unitprice, groupbyid)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [orderId, i + 1, item.productid, item.quantity, item.currentprice, null]);
            }
            else if (parseFloat(item.type) === 2)
            {
                const groupById = await client.query(`
                    SELECT groupbyid FROM public.groupbyproduct WHERE productid = $1
                `, [item.productid]);

                await client.query(`
                    INSERT INTO public.orderdetail (orderid, numericalorder, productid, quantity, unitprice, groupbyid)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [orderId, i + 1, item.productid, item.quantity, item.currentprice, groupById.rows[0].groupbyid]);
            }
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error querying!', error);
        throw new Error('Error creating order.');
    } finally {
        client.release();
    }
}

module.exports = {
    getAddress,
    placeOrder
}