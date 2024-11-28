// controllers/IntroductionController.js
class IntroductionController {
    // Render trang giới thiệu
    index(req, res) {
        res.render('introduction', {
            layout: 'layout', // Layout chung cho các trang
            title: 'Giới Thiệu Về Chúng Tôi - Tlynx Shop',
            customHead: `
                <link rel="stylesheet" href="User/introduction_styles.css">
            `,
            introductionData: {
                introductionText: "Xin chào và chào mừng bạn đến với Tlynx shop, nơi tập trung những sản phẩm bàn phím cơ và phụ kiện dành riêng cho những người đam mê công nghệ, lập trình viên, và game thủ chuyên nghiệp.",
                products: [
                    { name: "Bàn phím cơ học (instock)", description: "Các mẫu bàn phím có sẵn, đa dạng từ thiết kế đến công năng, phù hợp với mọi nhu cầu và sở thích." },
                    { name: "Kit phím", description: "Cho những ai thích tự tay lắp ráp bàn phím, chúng tôi cung cấp các bộ kit hoàn chỉnh để bạn dễ dàng cá nhân hóa từ thiết kế đến tính năng." },
                    { name: "Keycap", description: "Bộ sưu tập keycap phong phú, từ các mẫu đơn giản đến các mẫu nghệ thuật, giúp bạn tạo ra phong cách riêng cho chiếc bàn phím của mình." },
                    { name: "Switch", description: "Sự lựa chọn đa dạng về switch (linear, tactile, clicky) để mang đến cảm giác gõ phím tối ưu." },
                    { name: "Phụ kiện linh tinh", description: "Chúng tôi còn cung cấp nhiều phụ kiện khác như dây cáp, lót phím, và các thiết bị chăm sóc bàn phím, giúp hoàn thiện trải nghiệm gõ phím của bạn." }
                ],
                specialFeature: "Group Buy: Mua hàng chung với số lượng lớn để sở hữu những sản phẩm độc quyền.",
                commitmentText: "Chúng tôi cam kết mang đến các sản phẩm chính hãng, chất lượng cao và đảm bảo mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.",
                customerService: "Với đội ngũ nhân viên chuyên nghiệp và tận tâm, chúng tôi sẵn sàng hỗ trợ bạn trong việc chọn lựa sản phẩm phù hợp nhất.",
                offers: "Chúng tôi luôn có các chương trình khuyến mãi hấp dẫn và ưu đãi đặc biệt dành cho khách hàng thân thiết."
            }
        });
    }
}

module.exports = IntroductionController;
