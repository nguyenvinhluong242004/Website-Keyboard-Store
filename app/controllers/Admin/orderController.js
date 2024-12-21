const Order = require("../../models/Admin/order.Model");
const controller = {};

controller.order = async (req, res) => {
  res.render("Admin/order", {
    layout: "layoutAdmin",
    title: "Order",
    customHead: `<link rel="stylesheet" href="/Admin/order/style.css">
        <script defer type="module" src="/Admin/order/order.js"></script>
        `,
  });
};

controller.createGroupBy = async (req, res) => {
  try {
    const { pathimage,description, productname, currentprice, quantity, branchid, categoryid } = req.body;
    const result = await Order.insertGroupBy(
      pathimage,
      description,
      productname,
      currentprice,
      quantity,
      branchid,
      categoryid
    );
    console.log("Result from insertGroupBy:", result); // Log kết quả từ model

    if (result.success) {
      // Trả về productid nếu thành công
      res.status(201).json({
        success: true,
        message: "GroupBy created successfully!",
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
    console.error("Lỗi khi tạo GroupBy:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

controller.createGroupByProduct = async (req, res) => {
  try {
    const { enddate, estimatearrive, productid } = req.body;
    const result = await Order.insertGroupByProduct(
      enddate,
      estimatearrive,
      productid
    );
    console.log("Result from insertGroupBy:", result); // Log kết quả từ model
    if (result.success) {
      // Trả về productid nếu thành công
      res.status(201).json({
        success: true,
        message: "GroupBy created successfully!",
        groupbyid: result.groupbyid,
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
    console.error("Lỗi khi tạo GroupBy:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
};

controller.getType = async (req, res) => {
  
  try {
    // Lấy tham số query 'typeName' từ URL (VD: /route?typeName=example) typeName
    const typeName = req.query.typeName || 'Keycap';

    console.log('typename:',typeName);

    const result = await Order.typeid(typeName);

    if (result.success) {
      res.status(200).json({success:true, typeid: result.typeid });
    } else {
      res.status(404).json({success:false, message: result.error });
    }

  } catch (error) {
  
    console.error("Lỗi khi xử lý request:", error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

controller.getBrand = async (req, res) => {
  try {
    const brandName = req.query.brand || 'Cherry';

    console.log('brand name:',brandName);

    const result = await Order.brandid(brandName);

    if (result.success) {
      res.status(200).json({success:true, brandid: result.brandid });
    } else {
      res.status(404).json({success:false, message: result.error });
    }

  } catch (error) {
  
    console.error("Lỗi khi xử lý request:", error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};


module.exports = controller;
