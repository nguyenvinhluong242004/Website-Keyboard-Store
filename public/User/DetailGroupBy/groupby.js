document.addEventListener("DOMContentLoaded", function() {
  new Vue({
    el: "#app",
    data: {
      mainImage: "/image/detail_groupby/1.jpg",
      isContentVisible: false,
      check: false,
      quanlity: 1,
      images: [
        "/image/detail_groupby/1.jpg","/image/detail_groupby/2.jpg",
        "/image/detail_groupby/3.jpg","/image/detail_groupby/4.jpg",
        "/image/detail_groupby/5.jpg","/image/detail_groupby/6.jpg",
        "/image/detail_groupby/7.jpg","/image/detail_groupby/8.jpg",
        "/image/detail_groupby/9.jpg","/image/detail_groupby/10.jpg",
        "/image/detail_groupby/11.jpg","/image/detail_groupby/12.jpg"
      ],
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
    mounted() {
      console.log("Vue instance has been mounted and script is loaded.");
    }
  });
});
