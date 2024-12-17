const {subscribeNewsletter} = require('../../models/User/subscribeNewsletterModel');

const controller ={}

controller.subscribeNewsletter = async (req, res) => {
    const email = req.body.email;   
    console.log(email);
    try {
        const data = await subscribeNewsletter(email);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching: ' + error.message);
    }
} 

module.exports = controller;