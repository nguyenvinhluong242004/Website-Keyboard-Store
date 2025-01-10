const fs = require('fs');
const path = require('path');

const { getAllProducts, getBrands, getCategories, getFilteredProducts, isProductExist, addProduct, saveImage, deleteOne, findByIdAndUpdate } = require('../../models/Admin/productModel');

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

    deleteProduct: async (req, res) => {
        try {
            // Lấy productId từ req.params
            const { id: productId } = req.params;
            console.log("Product ID to delete:", productId);
    
            // Gọi model để xóa sản phẩm
            const isDeleted = await deleteOne(productId); // Trả về true/false từ model
    
            if (isDeleted) {
                // Nếu xóa thành công, trả kết quả cho client
                res.status(200).json({ message: 'Sản phẩm đã được xóa!' });
            } else {
                // Nếu không tìm thấy sản phẩm
                res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            // Trả lỗi từ model về frontend
            res.status(500).json({ message: 'Xóa sản phẩm thất bại!', error });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { productId } = req.params;
            const updatedData = req.body;
    
            console.log("Product ID to update:", productId);
            console.log("Updated data:", updatedData);
    
            // Gọi model để cập nhật sản phẩm
            const updatedProduct = await findByIdAndUpdate(productId, updatedData);
    
            // Nếu không tìm thấy sản phẩm
            if (!updatedProduct) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm!' });
            }
    
            // Nếu cập nhật thành công, trả kết quả cho client
            res.status(200).json({
                success: true,
                message: 'Sản phẩm đã được cập nhật thành công!',
                product: updatedProduct,
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            // Trả lỗi nếu có lỗi xảy ra khi cập nhật
            res.status(500).json({ success: false, message: 'Cập nhật sản phẩm thất bại!', error });
        }
    },    
};

module.exports = productController;
