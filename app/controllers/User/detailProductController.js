const { _isDomSupported } = require("chart.js/helpers");
const { getProduct } = require("../../models/User/get_product.js");
const insert = require("../../models/User/insertReviewModel.js");
const getReview = require("../../models/User/getReviewModel.js");

const controller = {};

// Render Kit Phim
controller.showDetailProduct = async (req, res) => {
  idProduct = req.params.id || 1;
  console.log('id product:',idProduct);
  const user = req.session.user;
  try {
    // Lấy dữ liệu từ model
    const data = await getProduct(idProduct);

    // Render view với dữ liệu
    res.render("User/detail-product", {
      layout: "layoutUser",
      title: "DetailProduct",
      customHead: `
                <link rel="stylesheet" href="/User/DetailProduct/detail-product.css">
                <script defer src="/User/DetailProduct/product.js"></script>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            `,
      user: user,
      idProduct: idProduct,
      data: JSON.stringify(data), // Chuyển dữ liệu sang JSON để Vue.js sử dụng
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data: " + error.message);
  }
};

controller.insertReview = async (req, res) => {
 try {
     const { productid, email, reviewdate, comment, stars} = req.body;

     console.log(req.body);
     
     const result = await insert(productid, email, reviewdate, comment, stars);

     console.log("Result from insertGroupBy:", result); // Log kết quả từ model
 
     if (result.success) {
       // Trả về productid nếu thành công
       res.status(201).json({
         success: true,
         message: "Review created successfully!",
         productid: result.productid,
       });
     } else {
       // Nếu không thành công, trả về thông báo lỗi
       res.status(500).json({
         success: false,
         message: "Failed to create GroupBy.",
         error: result.error,
       });
     }
   } catch (error) {
     console.error("Lỗi khi tạo Review:", error);
     res.status(500).json({ message: "An unexpected error occurred." });
   }
};
controller.getReview = async (req, res) => {
  const id = req.query.id ||1;
 try {

     const result = await getReview(id);

     console.log("Result from getReview:", result); // Log kết quả từ model
 
     if (result.success) {
       res.status(201).json({
        success: true,
        message: "Review created successfully!",
        reviews:result.reviews,
       });
     } else {
       // Nếu không thành công, trả về thông báo lỗi
       res.status(500).json({
         success: false,
         message: "Failed to create GroupBy.",
         error: result.error,
       });
     }
   } catch (error) {
     console.error("Lỗi khi tạo Review:", error);
     res.status(500).json({ message: "An unexpected error occurred." });
   }
};

module.exports = controller;

