const moment = require("moment");
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


// Lấy tất cả sản phẩm đang group by 
controller.getGroupBy = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const perPage = parseInt(req.query.perPage) || 5; 

    const participantsData = await moduleParticipants.getListGroupBy( page, perPage );

    participantsData.allProductGroupBy.forEach((item) => {
      item.enddate = moment(item.enddate).format("YYYY-MM-DD");
    });

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
    const perPage = parseInt(req.query.perPage) || 5; 
    const id = parseInt(req.query.id) || 1;

    const listRegister = await moduleParticipants.getListRegister(page, perPage, id);

    res.json({
      allRegister: listRegister.allRegister,
      totalPages: Math.ceil(listRegister.allRegister / perPage),
    });

  } catch {
    console.error("Error fetching participants data:", error);
    res.status(500).send("Error fetching participants data.");
  }
};


controller.getDetailRegister = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const perPage = parseInt(req.query.perPage) || 5; 
    const orderid = parseInt(req.query.id) || 1;


    const listDetailRegister = await moduleParticipants.getDetailRegister(
      page,
      perPage,
      orderid
    );

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
