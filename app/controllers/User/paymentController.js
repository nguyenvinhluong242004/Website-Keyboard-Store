const {getAddress, placeOrder} = require('../../models/User/paymentModel');

const controller ={}

controller.showPayment = (req, res) => {
    
    const cartItems = JSON.parse(decodeURIComponent(req.query.cartItems));;
    const user = req.session.user;

    res.render('User/payment', {layout: 'layoutUser', title: 'Payment',
        customHead: `
        <link rel="stylesheet" href="User/Payment/payment.css">
        <script defer type="module" src="User/Payment/payment.js"></script>
        <link rel="stylesheet" href="User/home.css">
        `,
        user: JSON.stringify(user),
        cartItems: JSON.stringify(cartItems)
    });
}   

controller.getAddress = async (req, res) => {
    const userid = req.query.userid;

    try{
        const data = await getAddress(userid);
        let address ='';
        data.address.forEach(item => {
            address += `${item.street}, ${item.ward}, ${item.district}, ${item.province}`;
        });

        res.json({ address: address });
    }
    catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
}

controller.placeOrder = async (req, res) => {
    orderData = req.body;
    
    try{
        await placeOrder(orderData);
        res.json({ message: 'Order placed successfully.' });
    }
    catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
}

module.exports = controller;