const moment = require("moment");
const fs = require("fs");
const path = require("path");
const moduleParticipants = require("../../models/Admin/detailParticipantsModel.js");

const controller = {};

// render mặc định
controller.showParticipants = async (req, res) => {
  try {
    // Render giao diện với dữ liệu
    res.render("Admin/participants", {
      layout: "layoutAdmin",
      title: "DetailParticipants",
      customHead: `
        <link rel="stylesheet" href="/Admin/participants/participants.css">
        <script defer type="module" src="/Admin/participants/participants.js"></script>
      `,
    });
  } catch (error) {
    console.error("Error fetching participants data:", error);
    res.status(500).send("Error fetching participants data.");
  }
};
controller.deleteForm = async (req, res) => {
  const { id } = req.params; // Lấy id từ URL params
  try {
    // Xóa sản phẩm trong cơ sở dữ liệu (giả sử sử dụng ORM hoặc query)
    const result = await moduleParticipants.deleteForm(id); // Gọi hàm deleteForm để xóa sản phẩm

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      message: `Product with ID ${id} has been deleted successfully.`,
    });

  } catch (error) {
    // Ghi lỗi và trả về phản hồi lỗi
    console.error("Error deleting product:", error.message);
    console.error("Error stack:", error.stack); // Thêm chi tiết lỗi để debug
    res.status(500).json({
      success: false,
      message: "Error deleting product: " + error.message,
    });
  }

};
controller.closeForm = async (req, res) => {
  const { id } = req.params; // Lấy id từ URL params
  console.log('ma no chuw id laf :', id);
  try {
    // Xóa sản phẩm trong cơ sở dữ liệu (giả sử sử dụng ORM hoặc query)
    const result = await moduleParticipants.closeForm(id); // Gọi hàm deleteForm để xóa sản phẩm

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      message: `Product with ID ${id} has been deleted successfully.`,
    });

  } catch (error) {
    // Ghi lỗi và trả về phản hồi lỗi
    console.error("Error deleting product:", error.message);
    console.error("Error stack:", error.stack); // Thêm chi tiết lỗi để debug
    res.status(500).json({
      success: false,
      message: "Error deleting product: " + error.message,
    });
  }

};


controller.getGroupBy = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const perPage = parseInt(req.query.perPage) || 3; 
    const orderby = req.query.orderby || 'enddate';

    const participantsData = await moduleParticipants.getListGroupBy(page, perPage, orderby);

    participantsData.allProductGroupBy.forEach((item) => {
      // Format ngày tháng
      item.enddate = moment(item.enddate).format("YYYY-MM-DD");
      item.estimatearrive = moment(item.estimatearrive).format("YYYY-MM-DD");
      
      // Xử lý imagepath thành mảng các ảnh
      const folderPath = path.join(__dirname, "../../../public", item.imagepath); // Đường dẫn tới folder ảnh
      console.log(folderPath);
      try {
        const imageFiles = fs.readdirSync(folderPath) // Lấy danh sách file trong folder
          .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) // Chỉ lấy file ảnh
          .map((file) => `${item.imagepath}/${file}`); // Tạo URL đầy đủ cho từng ảnh
        
        item.imagepath = imageFiles; // Gán mảng ảnh vào trường imagepath
      } catch (err) {
        console.error(`Lỗi đọc folder ảnh ${folderPath}:`, err);
        item.imagepath = []; // Nếu lỗi, gán mảng rỗng
      }
    });

    console.log('danh sách sản phẩm dạng Groupby:', participantsData.allProductGroupBy);

    res.json({
      allProductGroupBy: participantsData.allProductGroupBy,
      totalPages: Math.ceil(participantsData.totalProductGroupBy / perPage),
    });

  } catch (error) {
    console.error("Error fetching participants data:", error);
    res.status(500).send("Error fetching participants data.");
  }
};


controller.getRegister = async (req, res) => {
  try {
 
    const page = parseInt(req.query.page) || 1; 
    const perPage = parseInt(req.query.perPage) || 3; 
    const id = parseInt(req.query.id) || 1;

    const listRegister = await moduleParticipants.getListRegister(page, perPage, id);
    listRegister.allRegister.forEach((item) => {
      item.orderdate = moment(item.orderdate).format("YYYY-MM-DD");
    });
    res.json({
      allRegister: listRegister.allRegister,
      totalPages: Math.ceil(listRegister.totalRegister / perPage),
    });

  } catch {
    console.error("Error fetching participants data:", error);
    res.status(500).send("Error fetching participants data.");
  }
};


controller.getRegisterSearch = async (req, res) => {
  try {
 
    const page = parseInt(req.query.page) || 1; 
    const perPage = parseInt(req.query.perPage) || 3; 
    const id = parseInt(req.query.id) || 1;
    const query = req.query.q || 'Pay In Cash';

    const listRegister = await moduleParticipants.searchRegister(page, perPage, id, query);
  
    res.json({
      result: listRegister.resultSearch,
      totalPagesSearch: Math.ceil(listRegister.totalSearch / perPage),
    });

  } catch {
    console.error("Error fetching participants data:", error);
    res.status(500).send("Error fetching participants data.");
  }
};


controller.getRegisterExport = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1; 
    const perPage = parseInt(req.query.perPage) || 3; 
    const id = parseInt(req.query.id) || 1;
  
    const listRegister = await moduleParticipants.getListRegister(page, perPage, id);
      

    res.json({
      export: listRegister.exportRegister,
    });

  } catch {
    console.error("Error fetching participants data:", error);
    res.status(500).send("Error fetching participants data.");
  }
};


controller.getDetailRegister = async (req, res) => {
  try {
    // const page = parseInt(req.query.page) || 1; 
    // const perPage = parseInt(req.query.perPage) || 5; 
    const gbID = req.query.groupbyID || 1;
    const orderid = parseInt(req.query.id) || 1;


    const listDetailRegister = await moduleParticipants.getDetailRegister(orderid,gbID);

    listDetailRegister.allRegister.forEach((item) => {
      item.orderdate = moment(item.orderdate).format("YYYY-MM-DD");
    });
    listDetailRegister.allRegister.forEach((item) => {
      item.estimatearrive = moment(item.estimatearrive).format("YYYY-MM-DD");
    });

    console.log('danh sachs chi tiet nguowif dang kis',listDetailRegister);

    res.json({
      allRegister: listDetailRegister.allRegister,
      allProduct: listDetailRegister. allProductRegister,
    });
  } catch {
    console.error("Error fetching participants data:", error);
    res.status(500).send("Error fetching participants data.");
  }
};


module.exports = controller;
