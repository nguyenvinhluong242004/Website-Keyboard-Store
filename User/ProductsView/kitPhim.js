import { createApp } from 'vue';
import ProductCard from '../Component/ProductCard.js';
import FilterProduct from '../Component/FilterProduct.js';

const app = createApp({
    components: {
        'product-card': ProductCard,
        'filter-product': FilterProduct
    },
    data() {
        return {
            product: {
                type: 'Kít Phím',
                quantity: 100
            },
            products: [
                {ProductName: "Kit phím GMMK Pro", ProductID: 201, Description: "Bộ kit phím cơ GMMK Pro với khung nhôm cao cấp và thiết kế không dây.", Specification: "Chất liệu nhôm, layout 75%, hỗ trợ hot-swap switch.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 2800000, EstimateArrive: 7, OldPrice: 3200000, CategoryID: 2, BrandID: 1},
                {ProductName: "Kit phím Keychron K6", ProductID: 202, Description: "Bộ kit phím Keychron K6 không dây, phù hợp cho dân văn phòng và người dùng đa nền tảng.", Specification: "Chất liệu nhựa, layout 65%, hỗ trợ Bluetooth.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 1800000, EstimateArrive: 5, OldPrice: 2000000, CategoryID: 2, BrandID: 2},
                {ProductName: "Kit phím Akko MOD007", ProductID: 203, Description: "Bộ kit phím Akko MOD007 mang lại cảm giác gõ chắc chắn với thiết kế khung nhôm.", Specification: "Chất liệu nhôm, layout 75%, tương thích với switch Cherry MX.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 2500000, EstimateArrive: 6, OldPrice: 2800000, CategoryID: 2, BrandID: 3},
                {ProductName: "Kit phím Drop ALT", ProductID: 204, Description: "Bộ kit phím Drop ALT với LED RGB và khung nhôm CNC chất lượng cao.", Specification: "Chất liệu nhôm, layout 65%, hỗ trợ hot-swap switch.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 3500000, EstimateArrive: 10, OldPrice: 4000000, CategoryID: 2, BrandID: 4},
                {ProductName: "Kit phím Keychron Q1", ProductID: 205, Description: "Bộ kit Keychron Q1 với chất liệu nhôm và cảm giác gõ chắc chắn.", Specification: "Chất liệu nhôm, layout 75%, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 3200000, EstimateArrive: 8, OldPrice: 3500000, CategoryID: 2, BrandID: 2},
                {ProductName: "Kit phím KBD75 V2", ProductID: 206, Description: "Bộ kit phím KBD75 V2 với thiết kế tối giản và hoàn thiện cao cấp.", Specification: "Chất liệu nhôm, layout 75%, hỗ trợ hot-swap.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 4200000, EstimateArrive: 12, OldPrice: 4500000, CategoryID: 2, BrandID: 5},
                {ProductName: "Kit phím Ikki68 Aurora", ProductID: 207, Description: "Bộ kit Ikki68 Aurora với thiết kế độc đáo và LED RGB tích hợp.", Specification: "Chất liệu nhựa, layout 65%, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 2900000, EstimateArrive: 7, OldPrice: 3200000, CategoryID: 2, BrandID: 1},
                {ProductName: "Kit phím NK65 Entry", ProductID: 208, Description: "Bộ kit NK65 Entry cho người mới bắt đầu và có giá cả phải chăng.", Specification: "Chất liệu nhựa, layout 65%, hỗ trợ hot-swap.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 2200000, EstimateArrive: 5, OldPrice: 2400000, CategoryID: 2, BrandID: 3},
                {ProductName: "Kit phím Feker IK75", ProductID: 209, Description: "Bộ kit phím Feker IK75 với LED RGB và hỗ trợ Bluetooth.", Specification: "Chất liệu nhựa, layout 75%, hỗ trợ hot-swap và Bluetooth.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 2700000, EstimateArrive: 10, OldPrice: 3000000, CategoryID: 2, BrandID: 2},
                {ProductName: "Kit phím Tofu60", ProductID: 210, Description: "Bộ kit Tofu60 với thiết kế nhỏ gọn và khung nhôm chắc chắn.", Specification: "Chất liệu nhôm, layout 60%, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 3100000, EstimateArrive: 9, OldPrice: 3400000, CategoryID: 2, BrandID: 5},
                {ProductName: "Kit phím Cannonkeys Bakeneko60", ProductID: 211, Description: "Bộ kit Cannonkeys Bakeneko60 với cấu trúc đơn giản và dễ tùy chỉnh.", Specification: "Chất liệu nhôm, layout 60%, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 2600000, EstimateArrive: 11, OldPrice: 2900000, CategoryID: 2, BrandID: 4},
                {ProductName: "Kit phím Melody65", ProductID: 212, Description: "Bộ kit Melody65 với LED RGB và khung nhôm chất lượng cao.", Specification: "Chất liệu nhôm, layout 65%, hỗ trợ hot-swap.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 3000000, EstimateArrive: 7, OldPrice: 3300000, CategoryID: 2, BrandID: 2},
                {ProductName: "Kit phím TKC1800", ProductID: 213, Description: "Bộ kit TKC1800 với layout fullsize độc đáo và chất lượng cao.", Specification: "Chất liệu nhôm, layout 1800 compact, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 5500000, EstimateArrive: 14, OldPrice: 6000000, CategoryID: 2, BrandID: 1},
                {ProductName: "Kit phím IDOBAO ID80", ProductID: 214, Description: "Bộ kit IDOBAO ID80 với LED RGB và thiết kế nhôm cao cấp.", Specification: "Chất liệu nhôm, layout 75%, hỗ trợ hot-swap.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 3300000, EstimateArrive: 12, OldPrice: 3700000, CategoryID: 2, BrandID: 3},
                {ProductName: "Kit phím Womier K66", ProductID: 215, Description: "Bộ kit Womier K66 với LED RGB và khung acrylic trong suốt.", Specification: "Chất liệu acrylic, layout 66%, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 1800000, EstimateArrive: 4, OldPrice: 2000000, CategoryID: 2, BrandID: 2},
                {ProductName: "Kit phím KPrepublic BM68", ProductID: 216, Description: "Bộ kit KPrepublic BM68 không dây, hỗ trợ Bluetooth và RGB.", Specification: "Chất liệu nhựa, layout 65%, hỗ trợ hot-swap và Bluetooth.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 2500000, EstimateArrive: 6, OldPrice: 2800000, CategoryID: 2, BrandID: 1},
                {ProductName: "Kit phím Keebio Iris", ProductID: 217, Description: "Bộ kit Keebio Iris thiết kế split keyboard công thái học.", Specification: "Chất liệu nhựa, layout split, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 3400000, EstimateArrive: 10, OldPrice: 3700000, CategoryID: 2, BrandID: 4},
                {ProductName: "Kit phím Mistel Barocco", ProductID: 218, Description: "Bộ kit Mistel Barocco với thiết kế split và cấu trúc tiện lợi.", Specification: "Chất liệu nhựa, layout split 60%, hỗ trợ hot-swap.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 3800000, EstimateArrive: 8, OldPrice: 4100000, CategoryID: 2, BrandID: 5},
                {ProductName: "Kit phím NovelKeys NK87", ProductID: 219, Description: "Bộ kit NovelKeys NK87 với thiết kế TKL và LED RGB đẹp mắt.", Specification: "Chất liệu nhôm, layout TKL, hỗ trợ hot-swap.", ImagePath: "../../Images/gold_kit.jpg", CurrentPrice: 3700000, EstimateArrive: 11, OldPrice: 4000000, CategoryID: 2, BrandID: 3},
                {ProductName: "Kit phím Glorious GMMK TKL", ProductID: 220, Description: "Bộ kit GMMK TKL với LED RGB và hỗ trợ thay switch nóng.", Specification: "Chất liệu nhựa, layout TKL, hỗ trợ hot-swap.", ImagePath: "../../Images/grey_kit.jpg", CurrentPrice: 2400000, EstimateArrive: 5, OldPrice: 2600000, CategoryID: 2, BrandID: 1}
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
    }
});

app.mount('#app');