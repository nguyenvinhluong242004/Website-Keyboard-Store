const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Thêm fs để kiểm tra và tạo thư mục
const router = express.Router();
const orderController = require("../../app/controllers/Admin/orderController");

router.get("/", orderController.order);
router.post("/insert", orderController.createGroupBy);
router.post("/insert-groupbyproduct", orderController.createGroupByProduct);
router.get("/type", orderController.getType);
router.get("/brand", orderController.getBrand);

router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lấy tên sản phẩm từ body
        const productName = req.body.productInfo;

        const sanitizedProductName = productName.replace(/["]/g, '').trim(); 
        req.body.productInfo = sanitizedProductName;
        // Tạo đường dẫn thư mục theo tên sản phẩm
        const productFolderPath = path.join(__dirname, '../../public', 'image', sanitizedProductName);

        // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa thì tạo mới
        fs.mkdirSync(productFolderPath, { recursive: true });

        // Chỉ định thư mục lưu file
        cb(null, productFolderPath);
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất bằng timestamp
        const fileExtension = path.extname(file.originalname);
        const fileName = Date.now() + fileExtension; // Tên file duy nhất
        cb(null, fileName);
    }
});

// Khởi tạo Multer với cấu hình storage
const upload = multer({ storage: storage });

// Middleware xử lý upload ảnh sau khi xác nhận thông tin sản phẩm
router.post("/uploadImage", upload.single("image"), orderController.upImage);



module.exports = router;
