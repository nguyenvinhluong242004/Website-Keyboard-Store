new Vue({
  el: "#app",
  data: {
    // Đường dẫn ảnh chính ban đầu
    mainImage: "/image/detail_groupby/main.jpg",
    isContentVisible: false, // Biến điều khiển việc ẩn/hiện nội dung
    check: false,
    quanlity: 1,
    // Danh sách các đường dẫn ảnh nhỏ
    images: [
      "../image/1_lon.jpg",
      "../image/2_lon.jpg",
      "../image/3_lon.jpg",
      "../image/4_lon.jpg",
      "../image/5_lon.jpg",
      "../image/6_lon.jpg",
      "../image/7_lon.jpg",
      "../image/8_lon.jpg",
      "../image/9_lon.jpg",
      "../image/10_lon.jpg",
      "../image/11_lon.jpg",
    ],
  },
  methods: {
    // Phương thức để thay đổi ảnh chính khi click vào ảnh nhỏ
    changeMainImage(image) {
      this.mainImage = image;
    },
    showMess() {
      alert("Quay lại");
    },
    addCart() {
      alert("Đã thêm vào giỏ hàng");
    },
    toggleContent() {
      this.isContentVisible = !this.isContentVisible; // Chuyển đổi trạng thái khi nhấn vào dấu "+"
    },
    toggleCheck() {
      this.check = !this.check;
    },
  },
});
