document.addEventListener("DOMContentLoaded", function () {
  console.log("Initial window.data:", window.data);
  new Vue({
    el: "#app",
    delimiters: ['[[', ']]'],
    data: {
      idGroupby:window.idGroupby,
      mainImage:'',
      isContentVisible: true,
      check: true,
      quanlity: 1,
      images: [],
      imagePath:'',
      getDB: window.data.dataGroupByProduct[0],
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }; // Định dạng ngày/tháng/năm
        return date.toLocaleDateString('vi-VN', options); // Ví dụ: 27/12/2024
      },
      async fetchImages() {

        url = this.idGroupby;
        
        console.log('url:',url);

       await fetch(`/api/path_img?id=${url}`)
          .then(response => response.json())
          .then(data => {
            this.imagePath = data.imagepath;
           
            console.log(this.imagePath);
          });

        await fetch(`/detail-product/instock/image/api?id=${this.imagePath}`)
          .then(response => response.json())
          .then(data => {
            this.images = data;
            this.mainImage = this.images[0];
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
      toggleContent() {
        this.isContentVisible = !this.isContentVisible;
      },
      toggleCheck() {
        this.check = !this.check;
      },
      addToCart(){
        $.ajax({
          url: '/shopping-cart/add', 
          method: 'POST',                      
          contentType: 'application/json',   
          data: JSON.stringify({             
              ProductID: this.idGroupby           
          }),
          success: function(response) {
              // Xử lý khi gọi API thành công
              console.log("Success:", response);
              alert(response.message);
          },
          error: function(xhr, status, error) {
              // Xử lý lỗi
              console.error("Error:", error);
              alert("Có lỗi xảy ra, vui lòng thử lại.");
          }
      });
      }
    },
    computed: {
      formattedDescription() {
        return this.getDB.specification.replace(/\n/g, '<br>');
      },
      formattedEndDate() {
        return this.formatDate(this.getDB.enddate);
      },
      formattedArriveDate() {
        return this.formatDate(this.getDB.estimatearrive);
      },
    },
    mounted() {
      this.fetchImages();

      console.log("Data from server (window.data):", this.getDB);
    },
  });
});
