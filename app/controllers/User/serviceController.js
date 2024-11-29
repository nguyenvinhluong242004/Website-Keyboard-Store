class ServiceController {
    // Hàm render trang dịch vụ
    static getServicePage(req, res) {

        
        const serviceData = {
            title: "Dịch Vụ Tại The Keebs Store",
            services: [
                { name: "Mod Phím", type: "Keychron K2", price: "300,000 VND" },
                { name: "Rã Switch", type: "Akko 3068", price: "150,000 VND" },
                { name: "Hàn Switch", type: "Varmilo VA87M", price: "200,000 VND" },
                { name: "Lube Switch", type: "Logitech G Pro X", price: "100,000 VND" },
                { name: "Lube Stab", type: "Razer Huntsman Mini", price: "80,000 VND" },
                { name: "Thay Keycap", type: "SteelSeries Apex Pro", price: "500,000 VND" },
                { name: "Chỉnh Key Switch", type: "Corsair K95 RGB", price: "250,000 VND" },
                { name: "Mod LED", type: "HyperX Alloy FPS Pro", price: "600,000 VND" },
                { name: "Sửa Phím", type: "Ducky One 2 SF", price: "300,000 VND" },
                { name: "Thay PCB", type: "Razer BlackWidow V3", price: "800,000 VND" }
            ],
            repairServiceText: "Về dịch vụ sửa chữa phím như: phím không hoạt động, bung socket, đứt mạch, chập chờn,... và những lỗi khác bạn vui lòng liên hệ để được tư vấn và báo giá cụ thể cho từng lỗi."
        };

        res.render('service', {
            ...serviceData, // Truyền dữ liệu tĩnh từ serviceData
            layout: 'layout', // Layout chung
            title: 'Service', // Tiêu đề trang
            customHead: `
                <link rel="stylesheet" href="User/service.css"> 
            `
        });
    }
}

// Export class
module.exports = ServiceController;
