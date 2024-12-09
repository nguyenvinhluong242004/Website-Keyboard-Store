const { getAllProducts, getBrands, getCategories, getFilteredProducts } = require('../../models/Admin/productModel');

const productController = {
    productList: async (req, res) => {
        try {
            const allProducts = await getAllProducts();
            const brands = await getBrands();
            const categories = await getCategories();

            res.render("Admin/productList", {
                layout: 'layoutAdmin', 
                title: 'Product List',
                customHead: `
                    <link rel="stylesheet" href="/Admin/Product/productList.css">
                    <script defer type="module" src="/Admin/Product/productFilter.js"></script>
                `,
                allProducts,
                brands,
                categories,
            });
        } catch (error) {
            console.error("Error rendering product list page:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    filterProducts: async (req, res) => {
        try {
            // console.log(req.query)
            // Lấy các tham số từ query
            const { search, availability, category, brand, price, sortBy, page = 1 } = req.query;
            const limit = 5; // số lượng sản phẩm mỗi trang
            const offset = (page - 1) * limit; // tính offset cho phân trang

            // Gọi hàm getFilteredProducts với các tham số tìm kiếm và phân trang
            const allProducts = await getFilteredProducts({
                search,
                category,
                availability,
                brand,
                price,
                sortBy,
                limit,
                offset
            });

            // console.log(allProducts);

            // Lấy tổng số sản phẩm để tính số trang
            const totalProducts = allProducts.totalProducts;
            const totalPages = Math.ceil(totalProducts / limit);

            res.json({
                products: allProducts.data,
                totalProducts,
                totalPages,
                currentPage: parseInt(page, 10),
            });
        } catch (error) {
            console.error('Lỗi truy vấn sản phẩm:', error);
            res.status(500).send("Internal Server Error");
        }
    },

    addProduct: async (req, res) => {
        try {
            res.render("Admin/addProduct", {
                layout: 'layoutAdmin', 
                title: 'Add Product',
                customHead: `
                    <link rel="stylesheet" href="/Admin/Product/addProduct.css">
                `,
            });
        } catch (error) {
            console.error("Error rendering add product page:", error);
            res.status(500).send("Internal Server Error");
        }
    },
};

module.exports = productController;
