document.addEventListener("DOMContentLoaded", function () {
  console.log("Initial window.data:", window.data);
  new Vue({
    el: "#app",
    data: {
      mainImage: "/image/detail_groupby/1.jpg",
      isContentVisible: false,
      check: false,
      quanlity: 1,
      images: [
        "/image/detail_groupby/1.jpg",
        "/image/detail_groupby/2.jpg",
        "/image/detail_groupby/3.jpg",
        "/image/detail_groupby/4.jpg",
        "/image/detail_groupby/5.jpg",
        "/image/detail_groupby/6.jpg",
        "/image/detail_groupby/7.jpg",
        "/image/detail_groupby/8.jpg",
        "/image/detail_groupby/9.jpg",
        "/image/detail_groupby/10.jpg",
        "/image/detail_groupby/11.jpg",
        "/image/detail_groupby/12.jpg",
      ],
      getDB: window.data.dataGroupByProduct[0],
    },
    methods: {
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
        this.isContentVisible = !this.isContentVisible;
      },
      toggleCheck() {
        this.check = !this.check;
      },
    },
    computed: {
      formattedDescription() {
        return this.getDB.specification.replace(/\n/g, '<br>');
      },
    },
    mounted() {
      console.log("Vue instance has been mounted and script is loaded.");
      console.log("Data from server (window.data):", this.getDB);
    },
  });
});
