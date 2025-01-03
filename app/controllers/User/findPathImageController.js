const { getPathImage } = require("../../models/User/apiImage.js");
const { getLastProduct,getcategory } = require("../../models/User/apiImage.js");


const controller ={}

//Render groupBy page
controller.getPathImg = async (req, res) => {
    const id = req.query.id;
    try {
        const imagepath = await getPathImage(id); // Gọi hàm getPathImage từ model
        
        if (imagepath) {
            res.json({ imagepath }); // Trả về imagepath trong response JSON
        } else {
            res.status(404).json({ message: 'Product not found' }); // Nếu không tìm thấy, trả về lỗi 404
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); // Xử lý lỗi server
    }
};
controller.indexLastProduct = async (req, res) => {
    try {
        const index = await getLastProduct(); // Gọi hàm getPathImage từ model
        
        if (index) {
            res.json({ index }); // Trả về imagepath trong response JSON
        } else {
            res.status(404).json({ message: 'Product not found' }); // Nếu không tìm thấy, trả về lỗi 404
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); // Xử lý lỗi server
    }
};
controller.allcategory = async (req, res) => {
    try {
        const allcategory = await getcategory(); // Gọi hàm getPathImage từ model
        res.status(200).json({ success:true, data:allcategory });
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); // Xử lý lỗi server
    }
};

module.exports = controller;