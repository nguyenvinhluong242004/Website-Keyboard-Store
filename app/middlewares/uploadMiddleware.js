const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const productId = req.body.productId;

        if (!productId) {
            return cb(new Error('Thiếu productId!'), false);
        }

        const uploadDir = path.join(__dirname, '../../../public/images', productId);

        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir); // Lưu file vào thư mục tương ứng
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Lấy đuôi file (vd: .jpg, .png)
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName); // Tạo tên file duy nhất
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // Giới hạn kích thước file (2MB)
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ hỗ trợ các định dạng ảnh: jpeg, jpg, png, gif!'));
        }
    },
});

module.exports = upload;
