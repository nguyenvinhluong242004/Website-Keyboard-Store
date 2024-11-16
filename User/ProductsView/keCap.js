import { createApp } from 'vue';
import ProductCard from '../Component/ProductCard.js';

const app = createApp({
    components: {
        'product-card': ProductCard
    },
    data() {
        return {
            product: {
                type: 'Key Cap',
                quantity: 100
            },
            products: [
                {ProductName: "Keycap SA Carbon", ProductID: 101, Description: "Bộ keycap SA Carbon với thiết kế tông màu cam và đen nổi bật, phù hợp cho layout TKL và Fullsize.", Specification: "Chất liệu PBT, profile SA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 500000, EstimateArrive: 5, OldPrice: 600000, CategoryID: 1, BrandID: 2},
                {ProductName: "Keycap GMK Laser", ProductID: 102, Description: "Bộ keycap GMK Laser với phong cách cyberpunk, phù hợp cho những người yêu thích màu sắc rực rỡ.", Specification: "Chất liệu ABS, profile Cherry, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 350000, EstimateArrive: 7, OldPrice: 400000, CategoryID: 1, BrandID: 3},
                {ProductName: "Keycap DSA Granite", ProductID: 103, Description: "Bộ keycap DSA Granite với thiết kế tối giản và phối màu xám trung tính.", Specification: "Chất liệu PBT, profile DSA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 450000, EstimateArrive: 10, OldPrice: 550000, CategoryID: 1, BrandID: 4},
                {ProductName: "Keycap PBT Miami", ProductID: 104, Description: "Bộ keycap PBT Miami với màu sắc tươi sáng và phong cách nhiệt đới, phù hợp cho layout TKL và Fullsize.", Specification: "Chất liệu PBT, profile OEM, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 400000, EstimateArrive: 3, OldPrice: 450000, CategoryID: 1, BrandID: 2},
                {ProductName: "Keycap Tai-Hao Sunset", ProductID: 105, Description: "Bộ keycap Tai-Hao Sunset mang đậm phong cách hoàng hôn nhiệt đới với các màu cam và xanh.", Specification: "Chất liệu ABS, profile OEM, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 380000, EstimateArrive: 8, OldPrice: 420000, CategoryID: 1, BrandID: 5},
                {ProductName: "Keycap XDA Canvas", ProductID: 106, Description: "Bộ keycap XDA Canvas với phong cách minimal và phối màu pastel nhã nhặn.", Specification: "Chất liệu PBT, profile XDA, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 480000, EstimateArrive: 6, OldPrice: 520000, CategoryID: 1, BrandID: 2},
                {ProductName: "Keycap SA Olivia", ProductID: 107, Description: "Bộ keycap SA Olivia với thiết kế tông màu đen và hồng nữ tính, thu hút.", Specification: "Chất liệu PBT, profile SA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 520000, EstimateArrive: 5, OldPrice: 570000, CategoryID: 1, BrandID: 3},
                {ProductName: "Keycap GMK Bento", ProductID: 108, Description: "Bộ keycap GMK Bento mang phong cách Nhật Bản với màu sắc thanh lịch.", Specification: "Chất liệu ABS, profile Cherry, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 600000, EstimateArrive: 7, OldPrice: 650000, CategoryID: 1, BrandID: 4},
                {ProductName: "Keycap SA Pulse", ProductID: 109, Description: "Bộ keycap SA Pulse với màu sắc neon hiện đại, cá tính.", Specification: "Chất liệu PBT, profile SA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 550000, EstimateArrive: 9, OldPrice: 600000, CategoryID: 1, BrandID: 2},
                {ProductName: "Keycap MT3 Dev/TTY", ProductID: 110, Description: "Bộ keycap MT3 Dev/TTY với tông màu trung tính và kiểu dáng retro.", Specification: "Chất liệu PBT, profile MT3, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 630000, EstimateArrive: 10, OldPrice: 680000, CategoryID: 1, BrandID: 3},
                {ProductName: "Keycap DSA Deep Space", ProductID: 111, Description: "Bộ keycap DSA Deep Space lấy cảm hứng từ chủ đề vũ trụ.", Specification: "Chất liệu PBT, profile DSA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 520000, EstimateArrive: 8, OldPrice: 580000, CategoryID: 1, BrandID: 5},
                {ProductName: "Keycap GMK Metropolis", ProductID: 112, Description: "Bộ keycap GMK Metropolis với màu sắc rực rỡ, lấy cảm hứng từ thành phố hiện đại.", Specification: "Chất liệu ABS, profile Cherry, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 650000, EstimateArrive: 12, OldPrice: 700000, CategoryID: 1, BrandID: 2},
                {ProductName: "Keycap SA Royal", ProductID: 113, Description: "Bộ keycap SA Royal với thiết kế hoàng gia và màu xanh navy.", Specification: "Chất liệu PBT, profile SA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 480000, EstimateArrive: 7, OldPrice: 530000, CategoryID: 1, BrandID: 4},
                {ProductName: "Keycap XDA Milky Way", ProductID: 114, Description: "Bộ keycap XDA Milky Way lấy cảm hứng từ dải ngân hà với màu sắc trang nhã.", Specification: "Chất liệu PBT, profile XDA, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 600000, EstimateArrive: 10, OldPrice: 650000, CategoryID: 1, BrandID: 3},
                {ProductName: "Keycap GMK Hennessey", ProductID: 115, Description: "Bộ keycap GMK Hennessey với tông màu trắng đen đơn giản, sang trọng.", Specification: "Chất liệu ABS, profile Cherry, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 450000, EstimateArrive: 5, OldPrice: 500000, CategoryID: 1, BrandID: 2},
                {ProductName: "Keycap MT3 Susuwatari", ProductID: 116, Description: "Bộ keycap MT3 Susuwatari lấy cảm hứng từ nhân vật hoạt hình Nhật Bản với màu đen và xám.", Specification: "Chất liệu PBT, profile MT3, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 570000, EstimateArrive: 6, OldPrice: 620000, CategoryID: 1, BrandID: 5},
                {ProductName: "Keycap SA Troubled Minds", ProductID: 117, Description: "Bộ keycap SA Troubled Minds với màu sắc neon rực rỡ và phong cách phá cách.", Specification: "Chất liệu PBT, profile SA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 490000, EstimateArrive: 8, OldPrice: 540000, CategoryID: 1, BrandID: 3},
                {ProductName: "Keycap GMK Red Samurai", ProductID: 118, Description: "Bộ keycap GMK Red Samurai với màu đỏ và đen táo bạo, phong cách Nhật Bản.", Specification: "Chất liệu ABS, profile Cherry, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 680000, EstimateArrive: 12, OldPrice: 750000, CategoryID: 1, BrandID: 4},
                {ProductName: "Keycap DSA Camping", ProductID: 119, Description: "Bộ keycap DSA Camping lấy cảm hứng từ thiên nhiên và dã ngoại với tông màu xanh và nâu.", Specification: "Chất liệu PBT, profile DSA, tương thích với Cherry MX switches.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 580000, EstimateArrive: 9, OldPrice: 630000, CategoryID: 1, BrandID: 2},
                {ProductName: "Keycap XDA Oblique", ProductID: 120, Description: "Bộ keycap XDA Oblique với phong cách hiện đại và màu sắc tươi sáng.", Specification: "Chất liệu PBT, profile XDA, tương thích với Cherry MX switches.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 510000, EstimateArrive: 5, OldPrice: 570000, CategoryID: 1, BrandID: 5}
            ],
            visibleCount: 12,
        };
    },

    mounted() {
        
    },

    computed: {
        visibleProducts() {
            return this.products.slice(0, this.visibleCount);
        }
    },

    methods: {
        addToCart(product) {
            alert(`${product.ProductName} đã được thêm vào giỏ hàng!`);
        },
        loadMore() {
            this.visibleCount += 12;
        }
    },

    filterProducts(type) {
        // Filter products by type and quantity
        if (type === 'all') {
            this.visibleCount = 12;
            return this.products;
        }
        else if (type === 'price') {
            this.visibleCount = 12;
            //ASC
            return this.products.sort((a, b) => a.CurrentPrice - b.CurrentPrice);
        }
        else if (type === 'priceDesc') {
            this.visibleCount = 12;
            //DESC
            return this.products.sort((a, b) => b.CurrentPrice - a.CurrentPrice);
        }
    }
});

app.mount('#app');