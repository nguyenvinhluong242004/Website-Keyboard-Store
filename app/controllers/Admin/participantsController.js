const moment = require('moment');
const moduleParticipants = require('../../models/Admin/detailParticipantsModel.js');

const controller = {};

controller.showParticipants = async (req, res) => {
    try {
        // Lấy dữ liệu từ model
        const participantsData = await moduleParticipants.getListGroupBy(); // Giả sử model có hàm này
               
        // Định dạng lại ngày tháng
        participantsData.allProductGroupBy.forEach(item => {
            item.enddate = moment(item.enddate).format('YYYY-MM-DD');
        });

        // Render giao diện với dữ liệu
        res.render('Admin/participants', {
            layout: 'layoutAdmin',
            title: "DetailParticipants",
            customHead: `
                <link rel="stylesheet" href="/Admin/participants/participants.css">
                <script defer type="module" src="/Admin/participants/participants.js"></script>
            `,
            listGroupBy: participantsData.allProductGroupBy // Truyền dữ liệu vào đây
        });
    } catch (error) {
        console.error("Error fetching participants data:", error);
        res.status(500).send("Error fetching participants data.");
    }
};

module.exports = controller;
