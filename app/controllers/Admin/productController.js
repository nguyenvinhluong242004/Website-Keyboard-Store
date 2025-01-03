const fs = require('fs');
const path = require('path');

const { getAllProducts, getBrands, getCategories, getFilteredProducts, isProductExist, addProduct, saveImage } = require('../../models/Admin/productModel');

const productController = {
    productList: async (req, res) => {
        try {
            const allProducts = await getAllProducts();
            const brands = await getBrands();
            const categories = await getCategories();

            // console.log(allProducts)

            res.render("Admin/productList", {
                layout: 'layoutAdmin', 
                title: 'Product List',
                customHead: `
                    <link rel="stylesheet" href="/Admin/Product/productList.css">
                    <script defer type="module" src="/Admin/Product/productFilter.js"></script>
                `,
                // allProducts,
                // brands,
                // categories,
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

    productAdd: async (req, res) => {
        try {
            const brands = await getBrands();
            const categories = await getCategories();

            res.render("Admin/productAdd", {
                layout: 'layoutAdmin', 
                title: 'Add Product',
                customHead: `
                    <link rel="stylesheet" href="/Admin/Product/productAdd.css">
                    <script defer type="module" src="/Admin/Product/productAdd.js"></script>
                `,
                categories,
                brands,
            });
        } catch (error) {
            console.error("Error rendering add product page:", error);
            res.status(500).send("Internal Server Error");
        }
    },

    addProduct: async (req, res) => {
        try {
            const { name, listedPrice, adjustedPrice, type, quantity, brand, specification, description} = req.body;

            console.log(req.body)
    
            // Kiểm tra xem sản phẩm đã tồn tại chưa
            const isExist = await isProductExist(name);
            if (isExist) {
                return res.status(400).json({ message: 'Product already exists' });
            }
    
            // Thêm sản phẩm mới
            const { productId } = await addProduct({
                name,
                listedPrice,
                adjustedPrice,
                type,
                quantity,
                brand,
                specification,
                description,
            });
    
            res.status(201).json({ message: 'Product added successfully', productId });
            // res.status(201).json({ message: 'Product added successfully'});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    addImages: async (req, res) => {
        try {
            // Lấy productId và image từ req.body
            const { productId, image } = req.body;
    
            // Gọi model để lưu ảnh
            const imagePath = await saveImage(productId, image); // Lưu ảnh và nhận đường dẫn ảnh
    
            // Trả về kết quả cho client
            res.status(200).json({ message: 'Ảnh đã được lưu!', imagePath: `/image/${productId}/${imagePath}` });
        } catch (error) {
            console.error('Lỗi khi lưu ảnh:', error);
            res.status(500).json(error); // Trả lỗi từ model về frontend
        }
    },
};

module.exports = productController;
