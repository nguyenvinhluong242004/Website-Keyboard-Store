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
      isToggleForm: false,
      rating: 0, // Lưu đánh giá cuối cùng
      hoverRating: 0, // Giá trị khi hover lên cái sao
      sameProducts: [],
      quantity: 4,
    },
    methods: {
      hoverStar(index) {
        this.hoverRating = index; // Cập nhật hover
      },
      setRating(index) {
        this.rating = index; // Lưu rating khi click
      },
      cong() {
        this.quanlity += 1;
      },
      tru() {
        if (this.quanlity > 1) {
          this.quanlity -= 1;
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" }; // Định dạng ngày/tháng/năm
        return date.toLocaleDateString("vi-VN", options); // Ví dụ: 27/12/2024
      },

      formatCurrencyUSD(amount) {
        // Chuyển đổi giá trị đầu vào thành số
        const numberAmount = Number(amount);
      
        // Định dạng giá trị thành tiền tệ USD
        return numberAmount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
      
      changeMainImage(image) {
        this.mainImage = image;
      },
      goToGroupbyPage() {
        window.history.back();
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
      toggleForm() {
        this.isToggleForm = !this.isToggleForm;
      },
      async fetchRandomProductSame(category) {
        try {
          // Gửi request tới API
          url = `/detail-product/instock/same-product/${category}?quantity=${this.quantity}`;
          console.log('duongdang:',url);
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Lỗi API: ${response.statusText}`);
          }

          // Chuyển đổi dữ liệu sang JSON
          const data = await response.json();

          // Gán danh sách sản phẩm trả về vào một biến trong Vue (ví dụ: products)
          this.sameProducts = data.data || [];
          console.log("sanr pham random", this.sameProducts);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách sản phẩm:", error.message);
        }
      },
      gotoDetai(url) {
        window.location.href = `/detail-product/instock/${url}`;
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
    },
    mounted() {
      this.getImages();
      this.fetchRandomProductSame(this.getDB.categoryid);
    },
  });
});
