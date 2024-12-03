const express = require("express");
const router = express.Router();
const apiImageController = require("../../app/controllers/User/getApiImageController");

// Định nghĩa route cho API lấy ảnh
router.get("/api", apiImageController.createApi.bind(apiImageController));

module.exports = router;
