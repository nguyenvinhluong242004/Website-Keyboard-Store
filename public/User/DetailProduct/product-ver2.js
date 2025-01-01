document.addEventListener("DOMContentLoaded", function () {
  new Vue({
    el: "#app",
    delimiters: ["[[", "]]"],
    data: {
      idGroupby: window.idGroupby,
      mainImage: "",
      isContentVisible: true,
      check: true,
      quanlity: 1,
      images: [],
      imagePath: "",
      getDB: window.data,
      type_money: "đ",
    },
    methods: {
      cong(){
        this.quanlity += 1;
      },
      tru(){
        if(this.quanlity>1){
          this.quanlity -= 1;
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" }; // Định dạng ngày/tháng/năm
        return date.toLocaleDateString("vi-VN", options); // Ví dụ: 27/12/2024
      },
      formatCurrencyVN(amount) {
        if (isNaN(amount)) {
          throw new Error("Giá trị nhập vào phải là số.");
        }

        return amount
          .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
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
      addToCart() {
        $.ajax({
          url: "/shopping-cart/add",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            ProductID: this.idGroupby,
          }),
          success: function (response) {
            // Xử lý khi gọi API thành công
            console.log("Success:", response);
            alert(response.message);
          },
          error: function (xhr, status, error) {
            // Xử lý lỗi
            console.error("Error:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
          },
        });
      },
      getImages() {
        this.images = this.getDB.imagepath;
        this.mainImage = this.images[0];
      },
    },
    computed: {
      // formattedDescription() {
      //   return this.getDB.specification.replace(/\n/g, '<br>');
      // },
      formattedEndDate() {
        return this.formatDate(this.getDB.enddate);
      },
      formattedArriveDate() {
        return this.formatDate(this.getDB.estimatearrive);
      },
      formattedMoney() {
        return this.formatCurrencyVN(this.getDB.currentprice);
      },
    },
    mounted() {
      this.getImages();
    },
  });
});
