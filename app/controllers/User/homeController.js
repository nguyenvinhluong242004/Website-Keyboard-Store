const {     getProducts, getKeycaps, getKeyboards,getDeskpads, getSupplies, getMerch, getSwitchs, getPosters, } = require('../../models/User/homeModel');

const homeController = {
    home: async (req, res) => {
        try {
            const visibleCount = parseInt(req.query.visibleCount, 10) || 20; // Mặc định 20 sản phẩm
            const newProduct = await getProducts(visibleCount);
            const salesProduct = await getProducts(visibleCount);
            const trendingProduct = await getProducts(visibleCount);

            const maxProduct = 10;
            const keycapProducts = await getKeycaps(maxProduct);
            const deskpadProducts = await getDeskpads(maxProduct);
            const suppliesProducts = await getSupplies(maxProduct);
            const switchProducts = await getSwitchs(maxProduct);
            const keyboardProducts = await getKeyboards(maxProduct);
            const merchProducts = await getMerch(maxProduct);

            const topNewProduct = newProduct.data.slice(0, 10);
            const bottomNewProduct = newProduct.data.slice(10, 20);

            const topSalesProduct = salesProduct.data.slice(0, 10);
            const bottomSalesProduct = salesProduct.data.slice(10, 20);

            const poster = await getPosters();
            const user = req.session.user;

            res.render("User/home", {
                layout: 'layoutUser',
                title: 'Home',
                customHead: `
                    <link rel="stylesheet" href="User/home.css">
                    <script defer type="module" src="User/Home/home.js"></script>
                    <script defer type="module" src="User/Home/helper.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
                `,
                user: user,
                topNewProduct,
                bottomNewProduct,
                topSalesProduct,
                bottomSalesProduct,
                trendingProduct,
                keycapProducts,
                deskpadProducts,
                suppliesProducts,
                switchProducts,
                keyboardProducts,
                merchProducts,
                poster,
            });
        } catch (error) {
            console.error("Error rendering home page:", error);
            res.status(500).send("Internal Server Error");
        }
    },
};

module.exports = homeController;
