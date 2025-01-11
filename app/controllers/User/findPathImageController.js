const { getPathImage } = require("../../models/User/apiImage.js");
const { getLastProduct,getcategory,getreview,sendreview } = require("../../models/User/apiImage.js");
const moment = require('moment');

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

controller.review = async (req, res) => {
    const id = req.params.id;
    try {
        const reviews = await getreview(id); // Gọi hàm getPathImage từ model

        // Sửa định dạng ngày tháng trong reviews
        const formattedReviews = reviews.map(review => ({
            ...review,
            date: moment(review.date).format('YYYY-MM-DD'), // Định dạng ngày theo yêu cầu
        }));

        res.status(200).json({ success: true, data: formattedReviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); // Xử lý lỗi server
    }
};
controller.giveReview = async (req, res) => {
    const { Rating, Id, Review } = req.body;
    console.log('Rating:', Rating); // Số sao được chọn
    console.log('Review:', Review); // Nội dung đánh giá
    console.log('ID:', Id); // Nội dung đánh giá

    console.log(req.session.user)
    
    try {
      // Gửi review và lấy kết quả (ví dụ: reviewId hoặc thông tin gì đó)
      const result = await sendreview(req.session.user.email, Rating, Id, Review);
  
      if (result && result.success) {
        // Trả về thông tin chi tiết về review vừa gửi
        res.status(200).json({
          success:true,
          message: 'Gửi review thành công!',
        });
      } else {
        res.status(400).json({ message: 'Không thể gửi review!' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' }); // Xử lý lỗi server
    }
  };
  

module.exports = controller;