document.addEventListener("DOMContentLoaded", function () {
  console.log("Initial window.data:", window.data);
  new Vue({
    el: "#app",
    data: {
      idGroupby:window.idGroupby,
      mainImage:'',
      isContentVisible: false,
      check: false,
      quanlity: 1,
      images: [],
      getDB: window.data.dataGroupByProduct[0],
    },
    methods: {
      async fetchImages() {

        url = this.idGroupby;
        
        console.log('url:',url);

        fetch(`/detail-product/instock/image/api?id=${url}`)
          .then(response => response.json())
          .then(data => {
            this.images = data;
            this.mainImage=this.images[0];

            console.log(this.images);
            
          })
          .catch(error => console.error('Error fetching images:', error));
      },

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
      this.fetchImages();
      console.log("Vue instance has been mounted and script is loaded.");
      console.log("Data from server (window.data):", this.getDB);
    },
  });
});
