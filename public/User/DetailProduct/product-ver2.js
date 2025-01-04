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
      sameProducts: [],
      quantity: 4,

      //review
      rating: 0, // Lưu đánh giá cuối cùng
      hoverRating: 0, // Giá trị khi hover lên cái sao
      reviews:[],
      isToggleForm: false,
      comment:'',
      idproduct:0,
      isloadingreview:false,
      visibleReviews:5,
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
        if (isNaN(amount)) {
          throw new Error("Giá trị nhập vào phải là số.");
        }
        return amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      },
      changeMainImage(image) {
        this.mainImage = image;
      },
      goBack() {
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
      async fetchReview(id) {
        this.isloadingreview = true;
        try {
          // Gửi request tới API
          url = `/api/review/${id}`;
          console.log('duongdang:',url);

          const response = await fetch(url);

          if (!response.ok) {
            return response.json();
          }
          
          // Chuyển đổi dữ liệu sang JSON
          const data = await response.json();
          console.log(data);

          // Gán danh sách sản phẩm trả về vào một biến trong Vue (ví dụ: products)
          this.isloadingreview = false;
          this.reviews = data.data || [];
        } catch (error) {
          console.error("Lỗi khi lấy reviews:", error.message);
        }
      },
      gotoDetai(url) {
        window.location.href = `/detail-product/instock/${url}`;
      },
      calculateStarPercentage(n) {
        const totalReviews = this.reviews.length; // Tổng số review
        const starReviews = this.reviews.filter(
          (review) => parseInt(review.stars) === n
        ).length; // Lọc số review có rating = n
        return totalReviews > 0 ? (starReviews / totalReviews) * 100 : 0; // Tính tỷ lệ phần trăm
      },
      countStarReviews(star) {
        return this.reviews.filter((review) => parseInt(review.stars) === star)
          .length;
      },
      async submitReview() {
        try {
          const response = await fetch('/api/give-review', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Rating: this.rating,
              Id: this.idproduct,
              Review: this.comment,
            }),
          });
    
          const result = await response.json();
    
          if (response.ok) {
            // Cập nhật nội dung thông báo và hiển thị toast
            document.querySelector('#toast .toast-body').textContent = 'Thankyou for review!';
            this.resetForm();
            this.showToast();
            this.fetchReview(this.getDB.productid);
          } else {
            // Hiển thị thông báo lỗi
            document.querySelector('#toast .toast-body').textContent = 'Có lỗi khi gửi đánh giá. Vui lòng thử lại!';
            this.resetForm();
            this.showToast();
          
          }
        } catch (error) {
          console.error('Lỗi:', error);
          document.querySelector('#toast .toast-body').textContent = 'Có lỗi xảy ra khi gửi đánh giá';
          this.showToast();
        }
      },
      showMore(){
        this.visibleReviews += 5;
      },
    
      showToast() {
        // Hiển thị overlay
        document.querySelector('#overlay').style.display = 'block';
    
        // Hiển thị Toast
        const toast = new bootstrap.Toast(document.getElementById('toast'));
        document.querySelector('#toast').style.display = 'block'; // Hiển thị Toast
        toast.show();
    
        // Ẩn Toast và overlay sau khi hiển thị
        setTimeout(() => {
          document.querySelector('#toast').style.display = 'none';
          document.querySelector('#overlay').style.display = 'none';
        }, 1000); // Toast sẽ tự ẩn sau 5 giây
      },
      resetForm(){
        this.rating = 0;
        this.comment='';
        this.hoverRatingr=0;
        this.isToggleForm = false;
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
      averageRating() {
        if (this.reviews.length === 0) return 0; // Kiểm tra nếu không có reviews
        const totalRating = this.reviews.reduce(
          (sum, review) => sum + parseFloat(review.stars),
          0
        );
        return (totalRating / this.reviews.length).toFixed(2); // Lấy 2 chữ số thập phân
      },
      
    },
    mounted() {
      this.getImages();
      this.fetchRandomProductSame(this.getDB.categoryid);
      this.fetchReview(this.getDB.productid);
      this.idproduct= this.getDB.productid;
      if(this.reviews.lenght ===0){
        this.isloadingreview=false;
      }
    },
  });
});
